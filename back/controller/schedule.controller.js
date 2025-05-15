const schedule = require('../models/schedule.modal');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
// const { google } = require("googleapis");
const { OAuth2Client } = require('google-auth-library');
const google = require('googleapis').google;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

 // Function to get next date based on recurring type
 const getNextDate = (currentDate, type) => {
    const date = new Date(currentDate);
    const currentDay = date.getDate(); // Get the current day of the month
    const currentDayOfWeek = date.getDay(); // Get the current day of the week (0-6)

    switch(type) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            // Add 7 days to get to the same day next week
            date.setDate(date.getDate() + 7);
            // Ensure we're on the same day of the week
            while (date.getDay() !== currentDayOfWeek) {
                date.setDate(date.getDate() + 1);
            }
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        default:
            return null;
    }
    return date.toISOString().split('T')[0];
};


function generateCustomRecurrenceDates(startDate, customRecurrence) {
    const dates = [];
    let current = new Date(startDate);
    let count = 0;

    const { repeatType, repeatEvery, ends, endDate, Recurrence, repeatOn, Monthfirst } = customRecurrence;

    function addOccurrence(date) {
        dates.push(new Date(date));
        count++;
    }

    while (true) {
        // End conditions
        if (ends === 'after' && count >= Recurrence) break;
        if (ends === 'on' && current > new Date(endDate)) break;
        if (ends === 'never' && count >= 10) break; // safety limit

        if (repeatType === 'daily') {
            addOccurrence(current);
            current = new Date(current);
            current.setDate(current.getDate() + repeatEvery);
            if (current.getDate() === 1) {
                current.setMonth(current.getMonth() + 1);
            }
        }else if (repeatType === 'weekly') {
            while (true) {
                // For each week, add for selected days
                const weekStart = new Date(current);
                for (let i = 0; i < 7; i++) {
                    const day = new Date(weekStart);
                    day.setDate(weekStart.getDate() + i);
                    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
                    if (repeatOn.includes(dayName) && (dates.length === 0 || day > dates[dates.length - 1])) {
                        addOccurrence(day);
                        // Check after each addition
                        if (ends === 'after' && count >= Recurrence) return dates;
                    }
                }
                current.setDate(current.getDate() + 7 * repeatEvery);
            }
        } else if (repeatType === 'monthly') {
            if (Monthfirst && Monthfirst === 'firstmonday') {
                // Find first Monday of the month
                let firstMonday = new Date(current.getFullYear(), current.getMonth(), 1);
                while (firstMonday.getDay() !== 1) {
                    firstMonday.setDate(firstMonday.getDate() + 1);
                }
                if (firstMonday.getMonth() !== current.getMonth()) {
                    firstMonday = new Date(current.getFullYear(), current.getMonth() + 1, 1);
                    while (firstMonday.getDay() !== 1) {
                        firstMonday.setDate(firstMonday.getDate() + 1);
                    }
                }
                addOccurrence(firstMonday);
                current.setMonth(current.getMonth() + repeatEvery);
            } else if (Monthfirst && Monthfirst === 'firstday') {
                current.setDate(1);
                addOccurrence(current);
                current.setMonth(current.getMonth() + repeatEvery);
            }
        }else if (repeatType === 'yearly') {
            addOccurrence(current);
            current = new Date(current);
            current.setFullYear(current.getFullYear() + repeatEvery);
        }  else {
            break;
        }
    }
    return dates;
}


exports.createNewschedule = async (req, res) => {
    try {
        let {
            title,
            date,
            userId,
            startTime,
            endTime,
            meetingLink,
            description,
            reminder,
            recurringMeeting,
            customRecurrence,
            invitees,
            status,
        } = req.body;

        const schedulesToCreate = [];
        let currentDate = date;

        // Get the current date and time
        const currentDateTime = new Date();
        const scheduleDateTime = new Date(`${date}T${startTime}`);

        // Check if the schedule time is in the past or future
        if (scheduleDateTime <= currentDateTime && new Date(`${date}T${endTime}`) >= currentDateTime) {
            status = "Join";
        } else if (scheduleDateTime > currentDateTime) {
            status = "Upcoming";
        }

        // Create 5 meetings if recurring
        if (recurringMeeting && ['daily', 'weekly', 'monthly'].includes(recurringMeeting)) {
            for (let i = 0; i < 5; i++) {
                const scheduleData = {
                    title,
                    date: currentDate,
                    userId,
                    startTime,
                    endTime,
                    meetingLink,
                    description,
                    reminder,
                    recurringMeeting,
                    invitees,
                    status: "Upcoming",
                    parentMeetingId: i === 0 ? null : schedulesToCreate[0]?._id
                };

                if (meetingLink === "GenerateaOneTimeMeetingLink") {
                    const uniqueId = crypto.randomBytes(10).toString('hex');
                    scheduleData.meetingLink = `/screen/${uniqueId}`;
                }

                if (meetingLink === "UseMyPersonalRoomLink") {
                    const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                    const password = crypto.randomBytes(4).toString('hex');
                    scheduleData.meetingLink = `/screen/${uniqueId}`;
                    scheduleData.password = password;
                }


                const createdSchedules = await schedule.create(scheduleData);
                schedulesToCreate.push(createdSchedules);
                currentDate = getNextDate(currentDate, recurringMeeting);
            }
        } else if (recurringMeeting === 'custom' && customRecurrence) {
            // Generate all dates for the custom recurrence
            const recurrenceDates = generateCustomRecurrenceDates(date, customRecurrence);
        
            for (let i = 0; i < recurrenceDates.length; i++) {
                const scheduleData = {
                    title,
                    date: recurrenceDates[i],
                    userId,
                    startTime,
                    endTime,
                    meetingLink,
                    description,
                    reminder,
                    recurringMeeting,
                    invitees,
                    status: "Upcoming",
                    customRecurrence,
                    parentMeetingId: i === 0 ? null : schedulesToCreate[0]?._id
                };

                if (meetingLink === "GenerateaOneTimeMeetingLink") {
                    const uniqueId = crypto.randomBytes(10).toString('hex');
                    scheduleData.meetingLink = `/screen/${uniqueId}`;
                }
    
                if (meetingLink === "UseMyPersonalRoomLink") {
                    const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                    const password = crypto.randomBytes(4).toString('hex');
                    scheduleData.meetingLink = `/screen/${uniqueId}`;
                    scheduleData.password = password;
                }
        
                if (recurringMeeting === 'custom' && customRecurrence) {
                    scheduleData.customRecurrence = {
                        repeatType: customRecurrence.repeatType,
                        repeatEvery: customRecurrence.repeatEvery,
                        ends: customRecurrence.ends,
                        repeatOn: customRecurrence.repeatType === 'weekly' ? customRecurrence.repeatOn : undefined,
                        endDate: customRecurrence.ends === 'on' ? customRecurrence.endDate : undefined,
                        Recurrence: customRecurrence.ends === 'after' ? customRecurrence.Recurrence : undefined,
                        Monthfirst: customRecurrence.repeatType == 'monthly' ? customRecurrence.Monthfirst : undefined
                    };
                }
        
                const createdSchedule = await schedule.create(scheduleData);
                schedulesToCreate.push(createdSchedule);
            }
        } else {
            // Single meeting
            const scheduleData = {
                title,
                date,
                userId,
                startTime,
                endTime,
                meetingLink,
                description,
                reminder,
                recurringMeeting,
                invitees,
                status,
            };

            if (meetingLink === "GenerateaOneTimeMeetingLink") {
                const uniqueId = crypto.randomBytes(10).toString('hex');
                scheduleData.meetingLink = `/screen/${uniqueId}`;
            }

            if (meetingLink === "UseMyPersonalRoomLink") {
                const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                const password = crypto.randomBytes(4).toString('hex');
                scheduleData.meetingLink = `/screen/${uniqueId}`;
                scheduleData.password = password;
            }

            if (recurringMeeting === 'custom' && customRecurrence) {
                scheduleData.customRecurrence = {
                    repeatType: customRecurrence.repeatType,
                    repeatEvery: customRecurrence.repeatEvery,
                    ends: customRecurrence.ends,
                    repeatOn: customRecurrence.repeatType === 'weekly' ? customRecurrence.repeatOn : undefined,
                    endDate: customRecurrence.ends === 'on' ? customRecurrence.endDate : undefined,
                    Recurrence: customRecurrence.ends === 'after' ? customRecurrence.Recurrence : undefined,
                    Monthfirst: customRecurrence.repeatType == 'monthly' ? customRecurrence.Monthfirst : undefined
                };
            }

            const createdSchedules = await schedule.create(scheduleData);
            schedulesToCreate.push(createdSchedules);
        }

        // Create all schedules
        // const createdSchedules = await schedule.create(schedulesToCreate);

        // Send emails for all created meetings
        if (invitees && invitees.length > 0) {
            for (const createdSchedule of schedulesToCreate) {
                const emailPromises = invitees.map(invitee => {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: invitee.email,
                        subject: `Meeting Invitation: ${title}`,
                        html: `
                            <h2>You've been invited to: ${title}</h2>
                            <p><strong>Date:</strong> ${createdSchedule.date}</p>
                            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                            <p><strong>Description:</strong> ${description}</p>
                            <p><strong>Meeting Link:</strong> <a href="${createdSchedule.meetingLink}">${createdSchedule.meetingLink}</a></p>
                            <p><strong>Password:</strong> ${createdSchedule.password || "N/A"}</p>
                        `
                    };
                    return transporter.sendMail(mailOptions);
                });

                try {
                    await Promise.all(emailPromises);
                } catch (emailError) {
                    console.log('Error sending emails:', emailError);
                }
            }
        }

        // Google Calendar integration
        let checkUser = await userModel.findById(userId);
        if (checkUser.GoogleCalendar) {
            for (const createdSchedule of schedulesToCreate) {
                const event = {
                    summary: title,
                    description,
                    start: {
                        dateTime: `${createdSchedule.date}T${startTime}:00`,
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: `${createdSchedule.date}T${endTime}:00`,
                        timeZone: 'Asia/Kolkata',
                    },
                    attendees: invitees.map(i => ({ email: i.email })),
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 24 * 60 },
                            { method: 'popup', minutes: 10 },
                        ],
                    },
                };

                try {
                    oauth2Client.setCredentials({ refresh_token: checkUser.googleRefreshToken });
                    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
                    const response = await calendar.events.insert({
                        calendarId: 'primary',
                        resource: event,
                    });
                    if (response && response.data && response.data.id) {
                        createdSchedule.googleCalendarEventId = response.data.id;
                        await createdSchedule.save();
                    }
                } catch (error) {
                    console.log('Google Calendar error:', error);
                }
            }
        }

        return res.json({
            status: 200,
            message: "Schedule(s) Created Successfully",
            schedules: schedulesToCreate
        });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.createNextRecurringMeeting = async (completedMeetingId, lastMeetingSchedule) => {
    try {
        const completedMeeting = await schedule.findById(lastMeetingSchedule._id);
        if (!completedMeeting || !completedMeeting.recurringMeeting) return;

        const nextDate = getNextDate(completedMeeting.date, completedMeeting.recurringMeeting);
        const newMeeting = {
            ...completedMeeting.toObject(),
            _id: undefined,
            date: nextDate,
            status: "Upcoming",
            parentMeetingId: completedMeeting.parentMeetingId
        };

        // Generate new meeting link if needed
        if (newMeeting.meetingLink === "GenerateaOneTimeMeetingLink") {
            const uniqueId = crypto.randomBytes(10).toString('hex');
            newMeeting.meetingLink = `/screen/${uniqueId}`;
        }

        if (newMeeting.meetingLink === "UseMyPersonalRoomLink") {
            const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            const password = crypto.randomBytes(4).toString('hex');
            newMeeting.meetingLink = `/screen/${uniqueId}`;
            newMeeting.password = password;
        }

        const createdMeeting = await schedule.create(newMeeting);

        // Send emails to invitees
        if (newMeeting.invitees && newMeeting.invitees.length > 0) {
            const emailPromises = newMeeting.invitees.map(invitee => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: invitee.email,
                    subject: `Meeting Invitation: ${newMeeting.title}`,
                    html: `
                        <h2>You've been invited to: ${newMeeting.title}</h2>
                        <p><strong>Date:</strong> ${newMeeting.date}</p>
                        <p><strong>Time:</strong> ${newMeeting.startTime} - ${newMeeting.endTime}</p>
                        <p><strong>Description:</strong> ${newMeeting.description}</p>
                        <p><strong>Meeting Link:</strong> <a href="http://localhost:3000/${newMeeting.meetingLink}">${newMeeting.meetingLink}</a></p>
                        <p><strong>Password:</strong> ${newMeeting.password || "N/A"}</p>
                    `
                };
                return transporter.sendMail(mailOptions);
            });

            try {
                await Promise.all(emailPromises);
            } catch (emailError) {
                console.log('Error sending emails:', emailError);
            }
        }

        return createdMeeting;
    } catch (error) {
        console.error('Error creating next recurring meeting:', error);
        throw error;
    }
};

const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Get the date part only
};

exports.getAllschedule = async (req, res) => {
    try {
        let paginatedschedule;

        // paginatedschedule = await schedule.find();
        paginatedschedule = await schedule.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        const userId = req.user.id;

        // console.log(paginatedschedule,"paginatedschedule");


        const currentDateTime = new Date();
        const userSchedules = paginatedschedule.filter((meeting) => {
            const scheduleStartTime = new Date(`${formatDate(meeting.date)}T${meeting.startTime}`);
            const scheduleEndTime = new Date(`${formatDate(meeting.date)}T${meeting.endTime}`);

            // Check if the current time matches the start time
            if (scheduleStartTime <= currentDateTime && scheduleEndTime > currentDateTime) {
                // Update status to "Join" if current time is within the meeting time
                schedule.findByIdAndUpdate(meeting._id, { status: "Join" })
                    .catch(err => console.error("Error updating meeting status:", err));
                meeting.status = "Join";
            } else if (meeting.participants?.length > 1) {
                // Update status to "Completed" if the meeting has ended
                schedule.findByIdAndUpdate(meeting._id, { status: "Completed" })
                .then(async () => {
                    // If it's a recurring meeting, create the next one
                    if (meeting.recurringMeeting && ['daily', 'weekly', 'monthly'].includes(meeting.recurringMeeting)  && meeting.userId.toString() === userId.toString()) {
                        try {
                            // Check if this is a "never end" recurring meeting
                            const isNeverEnd = meeting.customRecurrence?.ends === 'never';
                            
                            // Count existing future meetings and find the last meeting schedule
                            const futureMeetingsCount = await schedule.countDocuments({
                                parentMeetingId: meeting._id,
                                date: { $gt: meeting.date }
                            });

                            const lastMeetingSchedule = await schedule.findOne({
                                parentMeetingId: meeting._id,
                                date: { $gt: meeting.date }
                            }).sort({ date: -1 });

                            console.log("lastMeetingSchedule---------------------------------", lastMeetingSchedule,futureMeetingsCount);
                            
        
                            // Only create new meeting if we have less than 5 future meetings
                            if (futureMeetingsCount < 5) {
                                await exports.createNextRecurringMeeting(meeting._id, lastMeetingSchedule);
                            }
                        } catch (error) {
                            console.error("Error creating next recurring meeting:", error);
                        }
                    }
                })
                .catch(err => console.error("Error updating meeting status:", err));
                meeting.status = "Completed";
            }
            return (meeting.userId.toString() === userId.toString() ||
                meeting?.invitees?.some((invitee) => invitee?.userId?.toString() === userId?.toString()));
        });


        let count = userSchedules.length;

        if (count === 0) {
            return res.json({
                status: 400,
                message: "No schedules found",
            });
        }

        return res.json({
            status: 200,
            totalschedules: count,
            message: "All schedules found successfully",
            schedules: userSchedules,
        });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getscheduleById = async (req, res) => {
    try {
        let id = req.params.id

        let scheduleFindById = await schedule.findById(id);

        if (!scheduleFindById) {
            return res.json({ status: 400, message: "schedule Not Found" })
        }

        return res.json({ status: 200, message: "schedule Found SuccessFully", schedules: scheduleFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateschedule = async (req, res) => {
    try {
        let id = req.params.id;
        let scheduleData = req.body;
        let scheduleUpdateById = await schedule.findById(id);

        if (!scheduleUpdateById) {
            return res.json({ status: 400, message: "schedule Not Found" });
        }

        // Update Google Calendar event if event ID exists
        if (scheduleUpdateById.googleCalendarEventId) {
            const user = await userModel.findById(scheduleUpdateById.userId);

            oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            // Prepare updated event data
            const event = {
                summary: scheduleData.title,
                description: scheduleData.description,
                start: {
                    dateTime: `${scheduleData.date}T${scheduleData.startTime}:00`,
                    timeZone: 'Asia/Kolkata',
                },
                end: {
                    dateTime: `${scheduleData.date}T${scheduleData.endTime}:00`,
                    timeZone: 'Asia/Kolkata',
                },
                attendees: scheduleData.invitees?.map(i => ({ email: i.email })) || [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 },
                    ],
                },
            };

            try {
                await calendar.events.update({
                    calendarId: 'primary',
                    eventId: scheduleUpdateById.googleCalendarEventId,
                    resource: event,
                });
            } catch (error) {
                console.log("Google Calendar update error:", error);
            }
        }

        // Update schedule in DB
        scheduleUpdateById = await schedule.findByIdAndUpdate(id, { ...scheduleData }, { new: true });

        // Add email sending functionality
        if (scheduleData.invitees && scheduleData.invitees.length > 0) {
            const emailPromises = scheduleData.invitees.map(invitee => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: invitee.email,
                    subject: `Meeting Invitation: ${scheduleUpdateById.title}`,
                    html: `
                        <h2>Meeting Invitation Updated: ${scheduleUpdateById.title}</h2>
                        <p><strong>Date:</strong> ${scheduleUpdateById.date}</p>
                        <p><strong>Time:</strong> ${scheduleUpdateById.startTime} - ${scheduleUpdateById.endTime}</p>
                        <p><strong>Description:</strong> ${scheduleUpdateById.description}</p>
                        <p><strong>Meeting Link:</strong><a href="http://localhost:3000/${scheduleUpdateById.meetingLink}">${scheduleUpdateById.meetingLink}</a></p>
                        <p><strong>Password:</strong> ${scheduleUpdateById.password || "N/A"}</p>
                        <h4><strong style="color: red;">Note:</strong> The meeting has started. Please join immediately!</h4>
                    `
                };
                return transporter.sendMail(mailOptions);
            });

            try {
                await Promise.all(emailPromises);
            } catch (emailError) {
                console.log('Error sending emails:', emailError);
            }
        }

        return res.json({ status: 200, message: "schedule Updated SuccessFully", schedules: scheduleUpdateById });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removeschedule = async (req, res) => {
    try {
        let id = req.params.id;

        let removeschedule = await schedule.findById(id);

        if (!removeschedule) {
            return res.json({ status: 400, message: "schedule Not Found" });
        }

        // Delete from Google Calendar if event ID exists
        if (removeschedule.googleCalendarEventId) {
            const user = await userModel.findById(removeschedule.userId);

            oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            try {
                await calendar.events.delete({
                    calendarId: 'primary',
                    eventId: removeschedule.googleCalendarEventId,
                });
            } catch (error) {
                console.log("Google Calendar delete error:", error);
            }
        }

        await schedule.findByIdAndDelete(id);

        return res.json({ status: 200, message: "schedule Deleted SuccessFully" });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}