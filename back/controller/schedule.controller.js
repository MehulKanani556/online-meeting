// const schedule = require('../models/schedule.modal');

// exports.createNewschedule = async (req, res) => {
//     try {
//         let { title, date, startTime, endTime, meetingLink, description, reminder, recurringMeeting, customRecurrence, invitees } = req.body;

//         let chekschedule = await schedule.create({
//             title,
//             date,
//             startTime,
//             endTime,
//             meetingLink,
//             description,
//             reminder,
//             recurringMeeting,
//             invitees
//         });

//         return res.json({ status: 200, message: "schedule Created Successfully", schedules: chekschedule });

//     } catch (error) {
//         res.json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };
const schedule = require('../models/schedule.modal');

exports.createNewschedule = async (req, res) => {
    try {
        let {
            title,
            date,
            startTime,
            endTime,
            meetingLink,
            description,
            reminder,
            recurringMeeting,
            customRecurrence,
            invitees
        } = req.body;

        let scheduleData = {
            title,
            date,
            startTime,
            endTime,
            meetingLink,
            description,
            reminder,
            recurringMeeting,
            invitees
        };

        if (recurringMeeting === 'custom' && customRecurrence) {
            scheduleData.customRecurrence = {
                repeatType: customRecurrence.repeatType,
                repeatEvery: customRecurrence.repeatEvery,
                repeatOn: customRecurrence.repeatOn,
                ends: customRecurrence.ends,
                endDate: customRecurrence.ends === 'on' ? customRecurrence.endDate : undefined
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

exports.getAllschedule = async (req, res) => {
    try {
        let paginatedschedule;

        paginatedschedule = await schedule.find()

        let count = paginatedschedule.length;

        if (count === 0) {
            return res.json({ status: 400, message: "schedule Not Found" })
        }

        return res.json({ status: 200, totalschedules: count, message: "All schedule Found SuccessFully", schedules: paginatedschedule })

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