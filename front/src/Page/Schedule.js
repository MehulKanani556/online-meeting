import React, { useState } from 'react'
import SideBar from '../Component/SideBar'
import HomeNavBar from '../Component/HomeNavBar'
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Modal } from 'react-bootstrap';
import { IoClose, IoSearch } from 'react-icons/io5';

const localizer = momentLocalizer(moment)

const events = [
    {
        title: 'Project Meeting',
        start: new Date(2025, 2, 11, 8, 15), // march 11, 2025, 8:15 PM
        end: new Date(2025, 2, 11, 9, 30),   // march 11, 2025, 9:30 PM
    },
    {
        title: 'Online Meeting',
        start: new Date(2025, 2, 15, 18, 15), // march 15, 2025, 6:15 PM
        end: new Date(2025, 2, 15, 20, 30),   // march 15, 2025, 8:30 PM
    },
    {
        title: 'Project Meeting',
        start: new Date(2025, 2, 26, 11, 45), // march 26, 2025, 11:45 AM
        end: new Date(2025, 2, 26, 12, 45),   // march 26, 2025, 12:45 PM
    },
    {
        title: 'Online Meeting',
        start: new Date(2025, 2, 26, 13, 45), // march 26, 2025, 1:45 PM
        end: new Date(2025, 2, 26, 14, 45),   // march 26, 2025, 2:45 PM
    },
    {
        title: 'Online Meeting',
        start: new Date(2025, 3, 10, 18, 15), // apr 10, 2025, 6:15 PM
        end: new Date(2025, 3, 10, 20, 30),   // apr 10, 2025, 8:30 PM
    },
    {
        title: 'Project Meeting',
        start: new Date(2025, 3, 24, 11, 45), // apr 24, 2025, 11:45 AM
        end: new Date(2025, 3, 24, 12, 45),   // apr 24, 2025, 12:45 PM
    },
    {
        title: 'Online Meeting',
        start: new Date(2025, 3, 29, 13, 45), // apr 29, 2025, 1:45 PM
        end: new Date(2025, 3, 29, 14, 45),   // apr 29, 2025, 2:45 PM
    },
]

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    // const label = () => {
    //     const date = moment(toolbar.date);
    //     return (
    //         <span>{date.format('MMMM YYYY')}</span>
    //     );
    // };
    const label = () => {
        const date = moment(toolbar.date);
        switch (toolbar.view) {
            case 'week':
                const weekStart = date.clone().startOf('week').format('DD MMM YYYY');
                const weekEnd = date.clone().endOf('week').format('DD MMM YYYY');
                return <span>{`${weekStart} - ${weekEnd}`}</span>;
            case 'day':
                return <span>{date.format('DD MMMM  YYYY')}</span>;
            // return <span>{date.format('dddd, DD MMMM  YYYY')}</span>;
            default:
                return <span>{date.format('MMMM YYYY')}</span>;
        }
    };
    return (
        <div className="rbc-toolbar j_rbc_toolbar">
            <span className="rbc-btn-group j_LR_rbc_btn">
                <button type="button" onClick={goToBack}>
                    <FaChevronLeft />
                </button>
                {/* <button type="button" onClick={goToCurrent}>
                    Today
                </button> */}
                <span className="rbc-toolbar-label j_toolbar_label" style={{ fontWeight: 'bold' }}>
                    {label()}
                </span>
                <button type="button" onClick={goToNext}>
                    <FaChevronRight />
                </button>
            </span>
            <span className="rbc-btn-group j_btn_rbc_group">
                {toolbar.views.map(view => (
                    <button
                        key={view}
                        type="button"
                        className={view === toolbar.view ? 'rbc-active' : ''}
                        onClick={() => toolbar.onView(view)}
                        style={{
                            backgroundColor: view === toolbar.view ? '#2C343D' : '',
                            color: view === toolbar.view ? '#fff' : '#BFBFBF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '5px 20px',
                            margin: '0 2px',
                            textTransform: 'capitalize'
                        }}
                    >
                        {view}
                    </button>
                ))}
            </span>

            <div className="j_schedule_buttons">
                <button className="btn btn-outline-light j_nav_btn" onClick={toolbar.onScheduleShow}>
                    Schedule Now
                </button>
                <button className="btn btn-outline-light j_nav_btn">
                    Meet Now
                </button>
            </div>
        </div>
    );
};


function Schedule() {

    const [ScheduleModal, setScheduleModal] = useState(false)
    const [customModal, setcustomModal] = useState(false)
    const [selectedReminders, setSelectedReminders] = useState([])
    const [RepeatEvery, setRepeatEvery] = useState(1)
    const [selectedDays, setSelectedDays] = useState([]);

    const handleScheduleclose = () => setScheduleModal(false)
    const handleScheduleshow = () => setScheduleModal(true)
    const handlecustomclose = () => setcustomModal(false)
    const handlecustomshow = () => setcustomModal(true)

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const toggleReminder = (reminder) => {
        setSelectedReminders(prev =>
            prev.includes(reminder)
                ? prev.filter(r => r !== reminder)
                : [...prev, reminder]
        )
    }

    const handleIncrement = () => {
        setRepeatEvery(prev => prev + 1);
    }

    const handleDecrement = () => {
        setRepeatEvery(prev => Math.max(prev - 1, 1));
    }

    return (
        <div>
            <HomeNavBar />
            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0 j_contant_width">
                        <div className='j_calender'>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%', width: '100%' }}
                                views={['day', 'week', 'month']}
                                defaultView="day"
                                components={{
                                    toolbar: (props) => <CustomToolbar {...props} onScheduleShow={handleScheduleshow} />
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ============================ Schedule Modal ============================  */}
                <Modal
                    show={ScheduleModal}
                    onHide={handleScheduleclose}
                    size="lg"
                    centered
                    contentClassName="j_modal_schedule "
                    dialogClassName="j_Schedule_width"
                >
                    <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                        <Modal.Title className="j_join_title text-white">Schedule Meeting</Modal.Title>
                        <IoClose
                            style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                            onClick={handleScheduleclose}
                        />
                    </Modal.Header>
                    <div className="j_modal_header"></div>
                    <Modal.Body className="py-0">
                        <div className="row">
                            <div className="col-6 col-md-8 ps-0 j_schedule_border">
                                <form>
                                    <div className="mb-3 pt-3">
                                        <label htmlFor="meetingTitle" className="form-label text-white j_join_text">Title</label>
                                        <input type="text" className="form-control j_input j_join_text" id="meetingTitle" placeholder="Enter title for meeting" />
                                    </div>
                                    <div className="j_schedule_DnT B_schedule_DnT">
                                        <div className="mb-3">
                                            <label htmlFor="meetingDate" className="form-label text-white j_join_text">Date</label>
                                            <input type="date" className="form-control j_input j_join_text B_schedule_input" id="meetingDate" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                                            <input type="time" className="form-control j_input j_join_text B_schedule_input" id="startTime" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="endTime" className="form-label text-white j_join_text">End Time</label>
                                            <input type="time" className="form-control j_input j_join_text B_schedule_input" id="endTime" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="meetingLink" className="form-label text-white j_join_text">Meeting Link</label>
                                        <select className="form-select j_select j_join_text" id="meetingLink">
                                            <option value="0">Select</option>
                                            <option value="1">Generate a one time meeting link</option>
                                            <option value="2">Use my personal room link</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                                        <textarea className="form-control j_input j_join_text" id="description" rows="3" placeholder="Enter a description for meeting"></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-white j_join_text">Reminder</label>
                                        <div>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('5 min before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('5 min before')}
                                            >
                                                5 min before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('10 min before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('10 min before')}
                                            >
                                                10 min before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('15 min before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('15 min before')}
                                            >
                                                15 min before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('30 min before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('30 min before')}
                                            >
                                                30 min before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('1 hr before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('1 hr before')}
                                            >
                                                1 hr before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('2 hr before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('2 hr before')}
                                            >
                                                2 hr before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('1 day before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('1 day before')}
                                            >
                                                1 day before
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn j_schedule_btn ${selectedReminders.includes('2 days before') ? 'j_schedule_selected_btn' : ''}`}
                                                onClick={() => toggleReminder('2 days before')}
                                            >
                                                2 days before
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recurringMeetings" className="form-label text-white j_join_text">Recurring Meetings</label>
                                        <select className="form-select j_select j_join_text" id="recurringMeetings"
                                            onChange={(e) => {
                                                if (e.target.value === "custom") {
                                                    handleScheduleclose();
                                                    handlecustomshow();
                                                }
                                            }}>
                                            <option value="0">select</option>
                                            <option value="1">Does not repeat</option>
                                            <option value="2">Daily</option>
                                            <option value="3">Weekly on Monday</option>
                                            <option value="4">Monthly on 3 February</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3">
                                        <button type="button" className="btn btn-outline-light j_home_button B_schedule_btn1 fw-semibold" onClick={handleScheduleclose}>Cancel</button>
                                        <button type="button" className="btn btn-light j_home_button fw-semibold">Schedule</button>
                                    </div>
                                </form>
                            </div>

                            <div className="col-6 col-md-4 pe-0">
                                <div className="mb-3 pt-3">
                                    <p className='mb-0 text-white'>Invitees (0)</p>
                                    <div className="position-relative mt-1">
                                        <IoSearch className=' position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                                        <input
                                            type="search"
                                            className="form-control text-white j_input ps-4 j_join_text"
                                            placeholder="Add people by name or email..."
                                            style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* ============================ Schedule custom Modal ============================  */}
                <Modal
                    show={customModal}
                    onHide={handlecustomclose}
                    centered
                    contentClassName="j_modal_join"
                >
                    <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                        <Modal.Title className="text-white j_join_title">Custom Recurrence</Modal.Title>
                        <IoClose
                            style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                            onClick={handlecustomclose}
                        />
                    </Modal.Header>
                    <div className="j_modal_header"></div>
                    <Modal.Body>
                        <div className="j_schedule_Repeat">
                            <div className="mb-3 flex-fill me-2  j_select_fill">
                                <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                                <select className="form-select j_select j_join_text" id="RepeatType">
                                    <option value="0">Select</option>
                                    <option value="1">Daily</option>
                                    <option value="2">Weekly</option>
                                    <option value="3">Monthly</option>
                                    <option value="4">Yearly</option>
                                </select>
                            </div>
                            <div className="mb-3 flex-fill  j_select_fill">
                                <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                                <div className='position-relative'>
                                    <input type="text" className="form-control j_input j_join_text" id="RepeatEvery" onChange={(e) => setRepeatEvery(Number(e.target.value) || 1)} value={RepeatEvery} />
                                    <div className="j_custom_icons">
                                        <FaAngleUp style={{ color: 'white', fontSize: '12px' }} onClick={() => handleIncrement()} />
                                        <FaAngleDown style={{ color: 'white', fontSize: '12px' }} onClick={() => handleDecrement()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white j_join_text">Repeat On</label>
                            <div className="d-flex B_Repeat_on_btn">
                                <button
                                    className={`btn ${selectedDays.includes('Sunday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Sunday')}
                                >
                                    S
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Monday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Monday')}
                                >
                                    M
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Tuesday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Tuesday')}
                                >
                                    T
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Wednesday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Wednesday')}
                                >
                                    W
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Thursday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Thursday')}
                                >
                                    T
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Friday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Friday')}
                                >
                                    F
                                </button>
                                <button
                                    className={`btn ${selectedDays.includes('Saturday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => toggleDay('Saturday')}
                                >
                                    S
                                </button>
                            </div>
                        </div>

                        <div className="j_schedule_Repeat">
                            <div className="mb-3 flex-fill me-2  j_select_fill">
                                <label htmlFor="RepeatType" className="form-label text-white j_join_text">Ends</label>
                                <select className="form-select j_select j_join_text" id="RepeatType">
                                    <option value="0">Select</option>
                                    <option value="1">Never</option>
                                    <option value="2">On</option>
                                    <option value="3">After</option>
                                </select>
                            </div>
                            <div className="mb-3 flex-fill  j_select_fill">
                                <label htmlFor="RepeatType" className="form-label text-white j_join_text"></label>
                                <input type="date" className="form-control j_input j_join_text j_special_m" id="RepeatEvery" />
                            </div>
                        </div>
                        <Modal.Footer className="j_custom_footer border-0 p-0 pt-4 pb-3">
                            <Button
                                variant="outline-light"
                                className="j_custom_button fw-semibold"
                                onClick={() => { handlecustomclose(); handleScheduleshow() }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="light"
                                className="j_custom_button fw-semibold"
                            >
                                Done
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </section >
        </div>
    )
}

export default Schedule;