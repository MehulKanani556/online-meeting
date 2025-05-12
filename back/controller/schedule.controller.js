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

        // Get the current date and time
        const currentDateTime = new Date();
        const scheduleDateTime = new Date(`${date}T${startTime}`);
        // console.log("scheduleDateTime", scheduleDateTime, endTime, new Date(`${date}T${endTime}`));
        console.log("endTime type:", typeof endTime);
        console.log("endTime format:", endTime);


        // Check if the schedule time is in the past or future
        if (scheduleDateTime <= currentDateTime && new Date(`${date}T${endTime}`) >= currentDateTime) {
            status = "Join"; // Set status to join if current time matches
        } else if (scheduleDateTime > currentDateTime) {
            status = "Upcoming"; // Set status to upcoming if it's a future date
        }

        let scheduleData = {
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
            status, // Use the updated status
        };

        if (meetingLink === "GenerateaOneTimeMeetingLink") {
            const uniqueId = crypto.randomBytes(10).toString('hex');
            scheduleData.meetingLink = `/screen/${uniqueId}`;
        }

        if (meetingLink === "UseMyPersonalRoomLink") {
            const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Generate a 12-digit random number
            const password = crypto.randomBytes(4).toString('hex'); // Generate a password (8 characters)
            // const password = crypto.randomBytes(8).toString('base64')
            // .replace(/[+/]/g, '')
            // .slice(0, 12)
            // .replace(/(.{3})/g, '$1-')
            // .slice(0, -1);
            scheduleData.meetingLink = `/screen/${uniqueId}`;
            scheduleData.password = password;
        }

        // Add email sending functionality
        if (invitees && invitees.length > 0) {
            const emailPromises = invitees.map(invitee => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: invitee.email,
                    subject: `Meeting Invitation: ${title}`,
                    html: `
                        <h2>You've been invited to: ${title}</h2>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                        <p><strong>Description:</strong> ${description}</p>
                        <p><strong>Meeting Link:</strong> <a href="${scheduleData.meetingLink}">${scheduleData.meetingLink}</a></p>
                        <p><strong>Password:</strong> ${scheduleData.password || "N/A"}</p>
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

        let chekschedule = await schedule.create(scheduleData);


        // ===========Google Calendar============

        let checkUser = await userModel.findById(userId);

        if (checkUser.GoogleCalendar) {
            // Prepare event
            const event = {
                summary: title,
                description,
                start: {
                    dateTime: `${date}T${startTime}:00`,
                    timeZone: 'Asia/Kolkata',
                },
                end: {
                    dateTime: `${date}T${endTime}:00`,
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
                // Get user info from Google
                oauth2Client.setCredentials({ refresh_token: checkUser.googleRefreshToken })

                const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
                const response = await calendar.events.insert({
                    calendarId: 'primary',
                    resource: event,
                });
                // Store the Google Calendar event ID in the schedule
                if (response && response.data && response.data.id) {
                    chekschedule.googleCalendarEventId = response.data.id;
                    await chekschedule.save();
                }
            } catch (error) {
                console.log(error);
            }

        }
        return res.json({
            status: 200,
            message: "Schedule Created Successfully",
            schedules: chekschedule
        });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
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