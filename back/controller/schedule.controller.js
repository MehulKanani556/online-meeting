const schedule = require('../models/schedule.modal');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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
        } = req.body;

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
            invitees
        };

        if (meetingLink === "GenerateaOneTimeMeetingLink") {
            const uniqueId = crypto.randomBytes(10).toString('hex');
            scheduleData.meetingLink = `http://localhost:3000/screen/${uniqueId}`;
        }

        if (meetingLink === "UseMyPersonalRoomLink") {
            const uniqueId = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Generate a 12-digit random number
            const password = crypto.randomBytes(4).toString('hex'); // Generate a password (8 characters)
            // const password = crypto.randomBytes(8).toString('base64')
            // .replace(/[+/]/g, '')
            // .slice(0, 12)
            // .replace(/(.{3})/g, '$1-')
            // .slice(0, -1);
            scheduleData.meetingLink = `http://localhost:3000/screen/${uniqueId}`;
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

// exports.getAllschedule = async (req, res) => {
//     try {
//         let paginatedschedule;

//         paginatedschedule = await schedule.find()

//         let count = paginatedschedule.length;

//         if (count === 0) {
//             return res.json({ status: 400, message: "schedule Not Found" })
//         }

//         return res.json({ status: 200, totalschedules: count, message: "All schedule Found SuccessFully", schedules: paginatedschedule })

//     } catch (error) {
//         res.json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };
exports.getAllschedule = async (req, res) => {
    try {
        let paginatedschedule;

        paginatedschedule = await schedule.find();

        const userId = req.user.id;

        const userSchedules = paginatedschedule.filter(meeting => meeting.userId.toString() === userId);

        let count = userSchedules.length;

        if (count === 0) {
            return res.json({ status: 400, message: "No schedules found for this user" });
        }

        return res.json({ status: 200, totalschedules: count, message: "User schedules found successfully", schedules: userSchedules });

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
        let id = req.params.id
        let scheduleData = req.body;
        let scheduleUpdateById = await schedule.findById(id);

        if (!scheduleUpdateById) {
            return res.json({ status: 400, message: "schedule Not Found" })
        }

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
        let id = req.params.id

        let removeschedule = await schedule.findById(id);

        if (!removeschedule) {
            return res.json({ status: 400, message: "schedule Not Found" })
        }

        await schedule.findByIdAndDelete(id);

        return res.json({ status: 200, message: "schedule Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}