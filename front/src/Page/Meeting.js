import React, { useEffect, useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose, IoSearch } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import MeetingCanlander from '../Image/MeeringCalander.svg'
import MeetingUser from '../Image/MeetingUSer.svg'
import MeetingMultiUser from '../Image/MeetingMultiUser.svg'
import { Button, Modal, Offcanvas, Form } from 'react-bootstrap';


function Meeting() {
    const [meetingType, setMeetingType] = useState("All Meetings");
    const [meetingFilter, setMeetingFilter] = useState("All Meetings");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedReminders, setSelectedReminders] = useState([])
    const [RepeatEvery, setRepeatEvery] = useState(1)
    const [billingCycle, setBillingCycle] = useState('Meeting Details');
    const [selectedDays, setSelectedDays] = useState([]);
    const [isSelectedMeetingCancelled, setIsSelectedMeetingCancelled] = useState(false);

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

    const handleDotsClick = (meetingId, event) => {
        event.stopPropagation();
        setOpenDropdownId(openDropdownId === meetingId ? null : meetingId);
    };

    // const handleEditClick = (e) => {
    //     e.stopPropagation();
    //     setOpenDropdownId(null);
    //     const scheduleModal = new window.bootstrap.Modal(document.getElementById('ScheduleMeetingModal'));
    //     scheduleModal.show();
    // };

    // const handleCancelClick = (e) => {
    //     e.stopPropagation();
    //     setOpenDropdownId(null);
    //     const cancelModal = new window.bootstrap.Modal(document.getElementById('cancelMeetingModal'));
    //     cancelModal.show();
    // };

    // const handleInvitePeopleClick = (e) => {
    //     setOpenDropdownId(null);
    //     const inviteModal = new window.bootstrap.Modal(document.getElementById('invitePeopleModal'));
    //     inviteModal.show();
    // };

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdownId(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const renderMeetingCards = () => {
        if (meetingType === "All Meetings" && meetingFilter === "All Meetings") {
            return (
                <div className='mx-4'>
                    <div className="row g-5 B_meeting_card_section">
                        {/* METTING CARD ALL SECTION */}

                        {/* Upcoming Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-primary B_upcoming_btn me-2">Upcoming</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding ">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-success B_upcoming_btn1 me-2">Completed</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-danger B_upcoming_btn1 me-2">Cancelled</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>

                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if (meetingType === "Upcoming Meetings" && meetingFilter === "Created By Me") {
            return (
                <div className='mx-4'>
                    <div className="row g-5 B_meeting_card_section">
                        {/* METTING CARD UPCOMING SECTION */}
                        {/* Upcoming Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div className="position-relative">
                                        <HiOutlineDotsVertical
                                            className='text-white'
                                            size={22}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleDotsClick('meeting1', e)}
                                        />
                                        {openDropdownId === 'meeting1' && (
                                            <div className="position-absolute end-0 mt-2 py-2 B_boxEdit  rounded shadow-lg"
                                                style={{ minWidth: '120px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowScheduleModel}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowCancelModel}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowInviteModel}
                                                >
                                                    Invite People
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding ">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div className="position-relative">
                                        <HiOutlineDotsVertical
                                            className='text-white'
                                            size={22}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleDotsClick('meeting2', e)}
                                        />
                                        {openDropdownId === 'meeting2' && (
                                            <div className="position-absolute end-0 mt-2 py-2 B_boxEdit rounded shadow-lg"
                                                style={{ minWidth: '120px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowScheduleModel}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowCancelModel}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowInviteModel}
                                                >
                                                    Invite People
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div className="position-relative">
                                        <HiOutlineDotsVertical
                                            className='text-white'
                                            size={22}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleDotsClick('meeting3', e)}
                                        />
                                        {openDropdownId === 'meeting3' && (
                                            <div className="position-absolute end-0 mt-2 py-2 B_boxEdit rounded shadow-lg"
                                                style={{ minWidth: '120px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowScheduleModel}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowCancelModel}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowInviteModel}
                                                >
                                                    Invite People
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div className="position-relative">
                                        <HiOutlineDotsVertical
                                            className='text-white'
                                            size={22}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleDotsClick('meeting4', e)}
                                        />
                                        {openDropdownId === 'meeting4' && (
                                            <div className="position-absolute end-0 mt-2 py-2 B_boxEdit rounded shadow-lg"
                                                style={{ minWidth: '120px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowScheduleModel}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowCancelModel}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleShowInviteModel}
                                                >
                                                    Invite People
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if (meetingType === "Upcoming Meetings" && meetingFilter === "Invited By Me") {
            return (
                <div className='mx-4'>
                    <div className="row g-5 B_meeting_card_section">
                        {/* METTING CARD ALL SECTION */}
                        {/* Upcoming Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding ">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                        <HiOutlineDotsVertical className='text-white ' size={22} style={{ cursor: "pointer" }} />
                                    </div>

                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        else if (meetingType === "Past Meetings" && meetingFilter === "Created By Me") {
            return (
                <div className='mx-4'>
                    <div className="row g-5 B_meeting_card_section">
                        {/* METTING CARD ALL SECTION */}

                        {/* Completed Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12" onClick={() => handleShowOffcanvasModel('completed')}>
                            <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px', cursor: "pointer" }}
                            >
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-success B_upcoming_btn1 me-2">Completed</button>
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12" onClick={() => handleShowOffcanvasModel('cancelled')}>
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px', cursor: "pointer" }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding ">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-danger B_upcoming_btn1 me-2">Cancelled</button>
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Completed Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12" onClick={() => handleShowOffcanvasModel('completed')}>
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px', cursor: "pointer" }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Online Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-success B_upcoming_btn1 me-2">Completed</button>
                                    </div>

                                </div>
                                <div style={{ borderTop: "1px solid #525252" }}></div>
                                <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Date</span>
                                        <span className='text-white'>: 23-01-2025</span>
                                    </div>
                                    <div className="d-flex  mb-2">
                                        <span className='B_meetingALl_details_span'>Meeting Time</span>
                                        <span className='text-white'>: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex ">
                                        <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                        <span className='text-white'>: 0h 30m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            return null;
        };
    }


    const [CancelModel, setCancelModel] = useState(false);
    const handleCloseCancelModel = () => setCancelModel(false);
    const handleShowCancelModel = () => setCancelModel(true);

    const [DeleteModel, setDeleteModel] = useState(false);
    const handleCloseDeleteModel = () => setDeleteModel(false);
    const handleShowDeleteModel = () => setDeleteModel(true);

    const [InviteModel, setInviteModel] = useState(false);
    const handleCloseInviteModel = () => setInviteModel(false);
    const handleShowInviteModel = () => setInviteModel(true);

    const [OffcanvasModel, setOffcanvasModel] = useState(false);
    const handleCloseOffcanvasModel = () => {
        setOffcanvasModel(false);
        setBillingCycle('Meeting Details');
    };
    const handleShowOffcanvasModel = (meetingStatus) => {
        setIsSelectedMeetingCancelled(meetingStatus === 'cancelled');
        setBillingCycle('Meeting Details');
        setOffcanvasModel(true);
    };

    const [ScheduleModel, setScheduleModel] = useState(false);
    const handleCloseScheduleModel = () => setScheduleModel(false);
    const handleShowScheduleModel = () => setScheduleModel(true);

    const [ScheduleCustomModel, setScheduleCustomModel] = useState(false);
    const handleCloseScheduleCustomModel = () => setScheduleCustomModel(false);
    const handleShowScheduleCustomModel = () => setScheduleCustomModel(true);

    return (
        <div>
            {/* .......................NAVBAR START ....................... */}
            <HomeNavBar />
            {/* .......................NAVBAR END ....................... */}

            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">

                        {/* .......................SIDEBAR START ....................... */}
                        <SideBar />
                        {/* .......................SIDEBAR END ....................... */}
                    </div>
                    <div className="col-11 p-0 B_contant_width">
                        <div className="d-flex justify-content-between B_Meeting_head">
                            <div className="d-flex gap-4 B_Meeting_head_flex">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle B_dropdown_btn1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {meetingType}
                                    </button>
                                    <ul className="dropdown-menu B_dropdown" style={{ cursor: "pointer" }}>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingType("All Meetings")}>All Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingType("Upcoming Meetings")}>Upcoming Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingType("Past Meetings")}>Past Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingType("Personal Room")}>Personal Room</a></li>
                                    </ul>
                                </div>
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle B_dropdown_btn1 B_dropdown_btn2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {meetingFilter}
                                    </button>
                                    <ul className="dropdown-menu B_dropdown B_dropdown1" style={{ cursor: "pointer" }}>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingFilter("All Meetings")}>All Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingFilter("Created By Me")}>Created By Me</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => setMeetingFilter("Invited By Me")}>Invited By Me</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="d-flex gap-4 align-items-center B_Meeting_head_flex1">
                                <div className="position-relative">
                                    <input type="text" className="form-control B_Meeting_search"
                                        style={{ paddingRight: '60px', paddingLeft: '35px', backgroundColor: '#202F41', color: "rgb(179, 174, 174)" }}
                                        placeholder="Search..." aria-label="First name" />

                                    <div className='position-absolute B_Meeting_search_icon text-white'>
                                        <IoSearchSharp style={{ color: 'rgb(179, 174, 174)' }} />
                                    </div>
                                </div>

                                <div className='d-flex gap-4'>
                                    <button className="btn btn-outline-light B_metting_btn">Schedule</button>
                                    <button className="btn btn-outline-light B_metting_btn">Meet Now</button>
                                </div>
                            </div>
                        </div>

                        {/* <div className='B_Meeting_video_icon text-white d-flex flex-column align-items-center justify-content-center' >
                            <img src={VideoIcon} alt="" />
                            <p className='B_Meeting_txt1'>No Upcoming Meetings</p>
                            <p className='B_Meeting_txt2' style={{color: "#999999"}}>You're all caught up - no meetings ahead</p>
                        </div> */}

                        {/* .......................MEETING CARDS START ....................... */}
                        {renderMeetingCards()}    
                        {/* .......................MEETING CARDS END ....................... */}

                        {/* .......................MODEL START ....................... */}

                        {/* ============================ Schedule Meeting Modal ============================ */}

                        <Modal
                            show={ScheduleModel}
                            onHide={handleCloseScheduleModel}
                            size="lg"
                            centered
                            contentClassName="j_modal_schedule "
                            dialogClassName="j_Schedule_width"
                        >
                            <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                                <Modal.Title className="j_join_title text-white">Schedule Meeting</Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                                    onClick={handleCloseScheduleModel}
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
                                                <Form.Select className="j_select j_join_text" id="meetingLink">
                                                    <option value="0">Select</option>
                                                    <option value="1">Generate a one time meeting link</option>
                                                    <option value="2">Use my personal room link</option>
                                                </Form.Select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    className="j_input j_join_text"
                                                    placeholder="Enter a description for meeting"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-white j_join_text">Reminder</label>
                                                <div>
                                                    {['5 min before', '10 min before', '15 min before', '30 min before',
                                                        '1 hr before', '2 hr before', '1 day before', '2 days before'].map((reminder) => (
                                                            <Button
                                                                key={reminder}
                                                                type="button"
                                                                className={`j_schedule_btn ${selectedReminders.includes(reminder) ? 'j_schedule_selected_btn' : ''}`}
                                                                onClick={() => toggleReminder(reminder)}
                                                            >
                                                                {reminder}
                                                            </Button>
                                                        ))}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="recurringMeetings" className="form-label text-white j_join_text">Recurring Meetings</label>
                                                <Form.Select
                                                    className="j_select j_join_text"
                                                    onChange={(e) => {
                                                        if (e.target.value === "custom") {
                                                            handleCloseScheduleModel();
                                                            handleShowScheduleCustomModel();
                                                        }
                                                    }}
                                                >
                                                    <option value="0">select</option>
                                                    <option value="1">Does not repeat</option>
                                                    <option value="2">Daily</option>
                                                    <option value="3">Weekly on Monday</option>
                                                    <option value="4">Monthly on 3 February</option>
                                                    <option value="custom">Custom</option>
                                                </Form.Select>
                                            </div>
                                            <Modal.Footer className="j_schedule_footer border-0 p-0 pt-4 pb-3 gap-0 gap-md-4">
                                                <Button variant="outline-light" className="j_home_button B_schedule_btn1 fw-semibold" onClick={handleCloseScheduleModel}>
                                                    Cancel
                                                </Button>
                                                <Button variant="light" className="j_home_button fw-semibold">
                                                    Schedule
                                                </Button>
                                            </Modal.Footer>
                                        </form>
                                    </div>

                                    <div className="col-6 col-md-4 pe-0">
                                        <div className="mb-3 pt-3">
                                            <p className='mb-0 text-white'>Invitees (0)</p>
                                            <div className="position-relative mt-1">
                                                <IoSearch className='position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                                                <Form.Control
                                                    type="search"
                                                    className="text-white j_input ps-4 j_join_text"
                                                    placeholder="Add people by name or email..."
                                                    style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* ============================ Schedule Meeting custom Modal ============================ */}

                        <Modal
                            show={ScheduleCustomModel}
                            onHide={handleCloseScheduleCustomModel}
                            centered
                            contentClassName="j_modal_join"
                        >
                            <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                                <Modal.Title className="text-white j_join_title">Custom Recurrence</Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                                    onClick={handleCloseScheduleCustomModel}
                                />
                            </Modal.Header>
                            <div className="j_modal_header"></div>
                            <Modal.Body>
                                <div className="j_schedule_Repeat">
                                    <div className="mb-3 flex-fill me-2 j_select_fill J_Fill_bottom">
                                        <Form.Label className="text-white j_join_text">Repeat Type</Form.Label>
                                        <Form.Select className="j_select j_join_text">
                                            <option value="0">Select</option>
                                            <option value="1">Daily</option>
                                            <option value="2">Weekly</option>
                                            <option value="3">Monthly</option>
                                            <option value="4">Yearly</option>
                                        </Form.Select>
                                    </div>
                                    <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                                        <Form.Label className="text-white j_join_text">Repeat Every</Form.Label>
                                        <div className='position-relative'>
                                            <Form.Control
                                                type="text"
                                                className="j_input j_join_text"
                                                value={RepeatEvery}
                                                onChange={(e) => setRepeatEvery(Number(e.target.value) || 1)}
                                            />
                                            <div className="j_custom_icons">
                                                <FaAngleUp
                                                    style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                    onClick={handleIncrement}
                                                />
                                                <FaAngleDown
                                                    style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                    onClick={handleDecrement}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Form.Label className="text-white j_join_text">Repeat On</Form.Label>
                                    <div className="d-flex B_Repeat_on_btn">
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                            <Button
                                                key={day}
                                                className={`${selectedDays.includes(day) ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                                onClick={() => toggleDay(day)}
                                            >
                                                {day[0]}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="j_schedule_Repeat">
                                    <div className="mb-3 flex-fill me-2 j_select_fill J_Fill_bottom">
                                        <Form.Label className="text-white j_join_text">Ends</Form.Label>
                                        <Form.Select className="j_select j_join_text">
                                            <option value="0">Select</option>
                                            <option value="1">Never</option>
                                            <option value="2">On</option>
                                            <option value="3">After</option>
                                        </Form.Select>
                                    </div>
                                    <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                                        <Form.Label className="text-white j_join_text"></Form.Label>
                                        <Form.Control
                                            type="date"
                                            className="j_input j_join_text j_special_m"
                                        />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="j_custom_footer border-0 p-0 pt-4 pb-3">
                                <Button
                                    variant="outline-light"
                                    className="j_custom_button fw-semibold"
                                    onClick={handleCloseScheduleCustomModel}
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
                        </Modal>

                        {/* ============================ Cancel Meeting Modal ============================ */}

                        <Modal
                            show={CancelModel}
                            onHide={handleCloseCancelModel}
                            centered
                            contentClassName="B_modal_content"
                        >
                            <Modal.Header className="border-0 B_cancle_model justify-content-between p-4 pb-3">
                                <Modal.Title className="text-white fw-normal B_cancle_model_title">
                                    Cancel Meeting
                                </Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                                    onClick={handleCloseCancelModel}
                                />
                            </Modal.Header>
                            <div style={{ borderBottom: '1px solid #474e58' }}></div>
                            <Modal.Body className="text-center px-4 pb-4 B_cancle_model_body">
                                <p className="text-white fs-5 mb-2 p-4 pb-2 B_cancle_model_text">
                                    Are you sure you want to cancel this meeting?
                                </p>
                                <p style={{ color: '#666666' }}>This action can't be undone</p>
                                <div className="d-flex justify-content-center gap-5 mt-4 B_cancle_model_btn_flex">
                                    <Button
                                        variant="outline-light"
                                        className="px-4 py-2 B_cancle_model_btn"
                                        onClick={handleCloseCancelModel}
                                        style={{
                                            minWidth: '180px'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="px-4 py-2 B_cancle_model_btn"
                                        onClick={handleCloseCancelModel}
                                        style={{
                                            minWidth: '180px'
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* ============================ Invite People Modal ============================ */}

                        <Modal
                            show={InviteModel}
                            onHide={handleCloseInviteModel}
                            centered
                            contentClassName="B_modal_content"
                            dialogClassName="B_invite_people_modal"
                        >
                            <Modal.Header className="border-0 d-flex justify-content-between align-items-center px-4 pt-3 pb-3">
                                <Modal.Title className="text-white fw-normal" style={{ fontSize: '18px' }}>
                                    Invite People
                                </Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                                    onClick={handleCloseInviteModel}
                                />
                            </Modal.Header>
                            <div style={{ borderBottom: '1px solid #474e58' }}></div>
                            <Modal.Body className="p-4 B_invite_people_body">
                                <div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '120px' }}>Title</span>
                                        <span className="text-white B_invite_people_text">: Online Meeting</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '120px' }}>Time</span>
                                        <span className="text-white B_invite_people_text">: 11:00 AM</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '120px' }}>Duration</span>
                                        <span className="text-white B_invite_people_text">: 0h 30m</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '120px' }}>Meeting ID</span>
                                        <span className="text-white B_invite_people_text">: https://googlemeet.123/57809</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '120px' }}>Password</span>
                                        <span className="text-white B_invite_people_text">: fverf54cf</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center gap-4 mt-4">
                                    <Button
                                        variant="outline-light"
                                        className="B_invite_people_btn"
                                        onClick={handleCloseInviteModel}
                                        style={{
                                            padding: '8px 60px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="B_invite_people_btn1"
                                        style={{
                                            padding: '8px 58px',
                                            fontSize: '14px',
                                            color: '#000000'
                                        }}
                                    >
                                        Copy Link
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* ============================ Meeting Details OFFCANVAS ============================ */}

                        <Offcanvas
                            show={OffcanvasModel}
                            onHide={handleCloseOffcanvasModel}
                            placement="end"
                            className="B_offcanvas"
                            style={{ backgroundColor: '#12161C' }}
                        >
                            <Offcanvas.Header
                                className="justify-content-end border-bottom"
                                style={{ borderColor: '#474e58 !important' }}
                            >
                                <div className='d-flex justify-content-center pt-3'>
                                    <div className='d-flex' style={{ backgroundColor: '#101924', padding: '4px', borderRadius: '8px' }}>
                                        <button
                                            type="button"
                                            className="B_pricing_button border-0 rounded"
                                            style={{
                                                minWidth: '100px',
                                                backgroundColor: billingCycle === 'Meeting Details' ? '#2A323B' : 'transparent',
                                                color: billingCycle === 'Meeting Details' ? '#ffffff' : '#87898B'
                                            }}
                                            onClick={() => setBillingCycle('Meeting Details')}
                                        >
                                            Meeting Details
                                        </button>
                                        <button
                                            type="button"
                                            className="B_pricing_button border-0 rounded"
                                            style={{
                                                minWidth: '100px',
                                                backgroundColor: billingCycle === 'Chat' ? '#2A323B' : 'transparent',
                                                color: isSelectedMeetingCancelled ? '#4A4A4A' : (billingCycle === 'Chat' ? '#ffffff' : '#87898B'),
                                                cursor: isSelectedMeetingCancelled ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => !isSelectedMeetingCancelled && setBillingCycle('Chat')}
                                            disabled={isSelectedMeetingCancelled}
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </div>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '22px' }}
                                    className='text-end ms-auto mb-5'
                                    onClick={handleCloseOffcanvasModel}
                                />
                            </Offcanvas.Header>

                            <Offcanvas.Body className="p-4 B_meeting_time_text_div d-flex flex-column">
                                {billingCycle === 'Meeting Details' ? (
                                    <>
                                        <div className="flex-grow-1">
                                            <div className="mb-4">
                                                <h5 className="text-white mb-3 B_meeting_title">Meeting Time</h5>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ paddingRight: '10px' }}>
                                                        <img src={MeetingCanlander} alt="" />
                                                    </div>
                                                    <div className='ps-3' style={{ borderLeft: '1px solid #474e58' }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Mon, 23-01-2025</span>
                                                            </div>
                                                            <div>
                                                                <span className='B_meeting_time_text_span' style={{ color: '#fff' }}>11:00 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>
                                                                (GMT + 05:30) India Standard Time (Asia / Kolkata)
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h5 className="text-white mb-3 B_meeting_title">Host & Participants</h5>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ paddingRight: '10px' }} className='B_meeting_host_img'>
                                                        <img src={MeetingUser} alt="" />
                                                    </div>
                                                    <div className='ps-3' style={{ borderLeft: '1px solid #474e58' }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="me-3">
                                                                <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Host : John Kumar</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>johnkumar123@gmail.com</small>
                                                        </div>
                                                        {!isSelectedMeetingCancelled && (
                                                            <div>
                                                                <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>
                                                                    Participant: <span style={{ color: '#dadada' }}> 89</span>
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h5 className="text-white mb-3 B_meeting_title">Meeting Details</h5>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ paddingRight: '10px' }}>
                                                        <img src={MeetingMultiUser} alt="" />
                                                    </div>
                                                    <div className='ps-3' style={{ borderLeft: '1px solid #474e58' }}>
                                                        <div className="d-flex align-items-center justify-content-between B_meeting_details_flex">
                                                            <div className="me-3">
                                                                <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Meeting Link : </span>
                                                            </div>
                                                            <div>
                                                                <small className='B_meeting_time_text' style={{ color: '#dadada' }}>
                                                                    https://googlemeet.123/57809
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>
                                                                Meeting ID : <span style={{ color: '#dadada' }}> 1245644575</span>
                                                            </small>
                                                        </div>
                                                        <div>
                                                            <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>
                                                                Password: <span style={{ color: '#dadada' }}> YvujvbuFRT</span>
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto" style={{ padding: '1rem' }}>
                                            <div className="d-flex gap-3">
                                                <Button
                                                    variant="outline-light"
                                                    className="w-50 py-2"
                                                    style={{ borderColor: '#474E58', color: '#fff', backgroundColor: 'transparent' }}
                                                    onClick={handleShowDeleteModel}
                                                >
                                                    Delete Meeting
                                                </Button>
                                                <Button
                                                    variant="light"
                                                    className="w-50 py-2"
                                                    style={{ backgroundColor: '#fff', color: '#000' }}
                                                    onClick={handleShowScheduleModel}
                                                >
                                                    Schedule Meeting
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="chat-container h-100 d-flex flex-column">
                                        <div className="chat-messages flex-grow-1" style={{ overflowY: 'auto' }}>
                                            {/* Lisa's first message */}
                                            <div className="d-flex align-items-start mb-3">
                                                <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff' }}>LN</span>
                                                </div>
                                                <div>
                                                    <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                                    <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                        Can u hear my voice
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Your first message */}
                                            <div className="d-flex justify-content-end mb-3">
                                                <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                                    Ok, wait, 5 min
                                                </div>
                                            </div>

                                            {/* Lisa's second message */}
                                            <div className="d-flex align-items-start mb-3">
                                                <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff' }}>LN</span>
                                                </div>
                                                <div>
                                                    <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                                    <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                        Thanks....
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kiara's message */}
                                            <div className="d-flex align-items-start mb-3">
                                                <div className="chat-avatar me-2" style={{ backgroundColor: '#382B82', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff' }}>KP</span>
                                                </div>
                                                <div>
                                                    <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Kiara</div>
                                                    <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                        Lorem ipsum is simply dummy
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Your second message */}
                                            <div className="d-flex justify-content-end mb-3">
                                                <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                                    Lorem ipsum is simply dummy text of the printing
                                                </div>
                                            </div>

                                            {/* Lisa's third message */}
                                            <div className="d-flex align-items-start mb-3">
                                                <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff' }}>LN</span>
                                                </div>
                                                <div>
                                                    <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                                    <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                        Lorem ipsum is simply dummy
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Your third message */}
                                            <div className="d-flex justify-content-end mb-3">
                                                <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                                    Ok, wait, 5 min
                                                </div>
                                            </div>
                                            {/* Lisa's third message */}
                                            <div className="d-flex align-items-start mb-3">
                                                <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff' }}>LN</span>
                                                </div>
                                                <div>
                                                    <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                                    <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                        Lorem ipsum is simply dummy
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Your third message */}
                                            <div className="d-flex justify-content-end mb-3">
                                                <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                                    Ok, wait, 5 min
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Offcanvas.Body>
                        </Offcanvas>

                        {/* ============================ Delete Meeting Model ============================ */}

                        <Modal
                            show={DeleteModel}
                            onHide={handleCloseDeleteModel}
                            centered
                            contentClassName="B_modal_content"

                        >
                            <Modal.Header className="border-0 B_cancle_model justify-content-between p-4 pb-3">
                                <Modal.Title className="text-white fw-normal B_cancle_model_title">
                                    Delete Meeting
                                </Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                                    onClick={handleCloseDeleteModel}
                                />
                            </Modal.Header>
                            <div style={{ borderBottom: '1px solid #474e58' }}></div>
                            <Modal.Body className="text-center px-4 pb-4 B_cancle_model_body">
                                <p className="text-white fs-5 mb-2 p-4 pb-2 B_cancle_model_text">
                                    Are you sure you want to Delete this meeting?
                                </p>
                                <p style={{ color: '#666666' }}>This action can't be undone</p>
                                <div className="d-flex justify-content-center gap-5 mt-4 B_cancle_model_btn_flex">
                                    <Button
                                        variant="outline-light"
                                        className="px-4 py-2 B_cancle_model_btn"
                                        onClick={handleCloseDeleteModel}
                                        style={{
                                            minWidth: '180px'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="px-4 py-2 B_cancle_model_btn"
                                        onClick={handleCloseDeleteModel}
                                        style={{
                                            minWidth: '180px'
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* .......................MODEL END ....................... */}
                    </div>

                </div>
            </section>


        </div>
    )
}

export default Meeting;
