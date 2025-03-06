import React, { useEffect, useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';
import VideoIcon from '../Image/VideoIcon.png';
import { HiOutlineDotsVertical } from "react-icons/hi";
import plus from '../Image/j_plus.svg'
import { IoClose, IoSearch } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";

import MeetingCanlander from '../Image/MeeringCalander.svg'
import MeetingUser from '../Image/MeetingUSer.svg'
import MeetingMultiUser from '../Image/MeetingMultiUser.svg'


function Meeting() {
    const [meetingType, setMeetingType] = useState("All Meetings");
    const [meetingFilter, setMeetingFilter] = useState("All Meetings");
    const [openDropdownId, setOpenDropdownId] = useState(null); // Add this state

    const [activeItem, setActiveItem] = useState('New Meeting')
    const [selectedReminders, setSelectedReminders] = useState([])
    const [RepeatEvery, setRepeatEvery] = useState(1)
    const [billingCycle, setBillingCycle] = useState('Meeting Details');
    const [selectedDays, setSelectedDays] = useState([]);

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



    // /////////////////////////////////////////////////////////

    const handleDotsClick = (meetingId, event) => {
        event.stopPropagation();
        setOpenDropdownId(openDropdownId === meetingId ? null : meetingId);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        const scheduleModal = new window.bootstrap.Modal(document.getElementById('ScheduleMeetingModal'));
        scheduleModal.show();
    };

    const handleCancelClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        const cancelModal = new window.bootstrap.Modal(document.getElementById('cancelMeetingModal'));
        cancelModal.show();
    };

    const handleInvitePeopleClick = (e) => {
        setOpenDropdownId(null);
        const inviteModal = new window.bootstrap.Modal(document.getElementById('invitePeopleModal'));
        inviteModal.show();
    };


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
        } else if (meetingType === "Upcoming Meetings" && meetingFilter === "Created By Me") {
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
                                                    onClick={handleEditClick}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleCancelClick}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleInvitePeopleClick}
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
                                                    onClick={handleEditClick}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleCancelClick}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleInvitePeopleClick}
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
                                                    onClick={handleEditClick}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleCancelClick}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleInvitePeopleClick}
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
                                                    onClick={handleEditClick}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleCancelClick}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                    onClick={handleInvitePeopleClick}
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
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightMeeting" aria-controls="offcanvasRight">
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
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
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
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightMeeting" aria-controls="offcanvasRight">
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

    return (
        <div>
            <HomeNavBar />

            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
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

                        {renderMeetingCards()}

                        {/* .......................MODEL START ....................... */}


                        {/* ============================ Schedule Meeting Modal ============================ */}
                        <div className="modal fade" id="ScheduleMeetingModal" tabIndex={-1} aria-labelledby="ScheduleMeetingModalLabel" aria-hidden="true">
                            <div className="modal-dialog j_Schedule_width modal-lg modal-dialog-centered">
                                <div className="modal-content j_modal_schedule">
                                    <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                                        <h1 className="modal-title j_join_title text-white" id="ScheduleMeetingModalLabel">Schedule Meeting</h1>
                                        <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="j_modal_header"></div>
                                    <div className="modal-body py-0">
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
                                                        <select className="form-select j_select j_join_text" id="recurringMeetings" onChange={(e) => {
                                                            if (e.target.value === "custom") {
                                                                const customModal = new window.bootstrap.Modal(document.getElementById('customModal'));
                                                                customModal.show();
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
                                                    <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3 gap-0 gap-md-4">
                                                        <button type="button" className="btn btn-outline-light j_home_button B_schedule_btn1 fw-semibold" data-bs-dismiss="modal">Cancel</button>
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================ Schedule Meeting custom Modal ============================ */}
                        <div className="modal fade" id="customModal" tabIndex={-1} aria-labelledby="customModalLabel" aria-hidden="true" >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content j_modal_join">
                                    <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                                        <h1 className="modal-title text-white j_join_title" id="customModalLabel">Custom Recurrence</h1>
                                        <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="j_modal_header"></div>
                                    <div className="modal-body">
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
                                            <div className="d-flex">
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
                                        <div className="modal-footer j_custom_footer border-0 p-0 pt-4 pb-3">
                                            <button type="button" className="btn btn-outline-light j_custom_button fw-semibold" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" className="btn btn-light j_custom_button fw-semibold">Done</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================ Cancel Meeting Modal ============================ */}

                        <div className="modal fade" id="cancelMeetingModal" tabIndex={-1} aria-labelledby="cancelMeetingModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content" style={{ backgroundColor: '#12161C', borderRadius: '8px' }}>
                                    <div className="modal-header border-0 d-flex justify-content-between align-items-center B_cancle_model p-4 pb-3" >
                                        <h5 className="modal-title text-white fw-normal B_cancle_model_title ">Cancel Meeting</h5>
                                        <IoClose
                                            style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                                            type="button"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div style={{ borderBottom: '1px solid #474e58' }}></div>
                                    <div className="modal-body text-center px-4 pb-4 B_cancle_model_body">
                                        <p className="text-white fs-5 mb-2  p-4 pb-2 B_cancle_model_text">Are you sure you want to cancel this meeting?</p>
                                        <p style={{ color: '#666666' }}>This action can't be undone</p>
                                        <div className="d-flex justify-content-center gap-5 mt-4 B_cancle_model_btn_flex">
                                            <button
                                                type="button"
                                                className="btn px-4 py-2 B_cancle_model_btn"
                                                data-bs-dismiss="modal"
                                                style={{
                                                    border: '1px solid #ffffff',
                                                    borderRadius: '6px',
                                                    color: '#ffffff',
                                                    backgroundColor: 'transparent',
                                                    minWidth: '180px'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn px-4 py-2 B_cancle_model_btn"
                                                data-bs-dismiss="modal"
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '6px',
                                                    color: '#000000',
                                                    minWidth: '180px'
                                                }}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================ Invite People Modal ============================ */}
                        <div className="modal fade" id="invitePeopleModal" tabIndex={-1} aria-labelledby="invitePeopleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered B_invite_people_modal" style={{ maxWidth: '500px' }}>
                                <div className="modal-content" style={{ backgroundColor: '#12161C', borderRadius: '8px' }}>
                                    <div className="modal-header border-0 d-flex justify-content-between align-items-center px-4 pt-3 pb-3">
                                        <h5 className="modal-title text-white fw-normal" style={{ fontSize: '18px' }}>Invite People</h5>
                                        <IoClose
                                            style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                                            type="button"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div style={{ borderBottom: '1px solid #474e58' }}></div>
                                    <div className="modal-body p-4 B_invite_people_body">
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
                                            <button
                                                type="button"
                                                className="btn B_invite_people_btn"
                                                data-bs-dismiss="modal"
                                                style={{
                                                    border: '1px solid #ffffff',
                                                    borderRadius: '4px',
                                                    color: '#ffffff',
                                                    backgroundColor: 'transparent',
                                                    padding: '8px 60px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn B_invite_people_btn1"
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '4px',
                                                    color: '#000000',
                                                    padding: '8px 58px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================ Meeting Details OFFCANVAS ============================ */}
                        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRightMeeting" aria-labelledby="offcanvasRightLabel" style={{ backgroundColor: '#12161C' }}>
                            <div class="offcanvas-header justify-content-end  " style={{ borderBottom: '1px solid #474e58' }}>
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
                                                color: billingCycle === 'Chat' ? '#ffffff' : '#87898B'
                                            }}
                                            onClick={() => setBillingCycle('Chat')}
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </div>
                                <div className=''>
                                    <IoClose style={{ color: '#fff', fontSize: '22px' }} className='text-end ms-auto mb-5' type="button" data-bs-dismiss="offcanvas" aria-label="Close" />
                                </div>
                            </div>

                            <div>
                                <div className="offcanvas-body p-4 B_meeting_time_text_div">
                                    <div className="mb-4">
                                        <h5 className="text-white mb-3 B_meeting_title">Meeting Time</h5>
                                        <div className="d-flex align-items-center ">

                                            <div style={{ paddingRight: '10px' }}>
                                                <img src={MeetingCanlander} alt="" />
                                            </div>

                                            <div className='ps-3 ' style={{ borderLeft: '1px solid #474e58' }}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Mon, 23-01-2025</span>
                                                    </div>
                                                    <div>
                                                        <span className='B_meeting_time_text_span' style={{ color: '#fff' }}>11:00 AM</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>(GMT + 05:30) India Standard Time (Asia / Kolkata)</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="text-white mb-3 B_meeting_title">Host & Participants</h5>
                                        <div className="d-flex align-items-center ">
                                            <div style={{ paddingRight: '10px' }} className='B_meeting_host_img'>
                                                <img src={MeetingUser} alt="" />
                                            </div>

                                            <div className='ps-3 ' style={{ borderLeft: '1px solid #474e58' }}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="me-3">
                                                        <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Host : John Kumar</span>
                                                    </div>

                                                </div>
                                                <div>
                                                    <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>johnkumar123@gmail.com</small>
                                                </div>
                                                <div>
                                                    <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>Participant: <span style={{ color: '#dadada' }}> 89</span></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="text-white mb-3 B_meeting_title">Meeting Details</h5>
                                        <div className="d-flex align-items-center ">
                                            <div style={{ paddingRight: '10px' }}>
                                                <img src={MeetingMultiUser} alt="" />
                                            </div>

                                            <div className='ps-3 ' style={{ borderLeft: '1px solid #474e58' }}>
                                                <div className="d-flex align-items-center justify-content-between B_meeting_details_flex">
                                                    <div className="me-3">
                                                        <span className='B_meeting_Date_text_span' style={{ color: '#fff' }}>Meeting Link : </span>
                                                    </div>

                                                    <div>
                                                        <small className='B_meeting_time_text' style={{ color: '#dadada' }}>https://googlemeet.123/57809 </small>
                                                    </div>
                                                </div>
                                                <div>
                                                    <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>Meeting ID : <span style={{ color: '#dadada' }}> 1245644575</span></small>
                                                </div>
                                                <div>
                                                    <small className='B_meeting_time_text' style={{ color: '#8c8c8c' }}>Password: <span style={{ color: '#dadada' }}> YvujvbuFRT</span></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* .......................MODEL END ....................... */}
                    </div>

                </div>
            </section>


        </div>
    )
}

export default Meeting;
