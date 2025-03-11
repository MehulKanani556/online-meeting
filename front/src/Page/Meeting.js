import React, { useEffect, useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose, IoSearch, IoCheckmark } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown, FaDiceSix, FaDiceTwo, FaRegStar, FaStar } from "react-icons/fa6";
import MeetingCanlander from '../Image/MeeringCalander.svg'
import MeetingUser from '../Image/MeetingUSer.svg'
import MeetingMultiUser from '../Image/MeetingMultiUser.svg'
import MeetingAudio from '../Image/B_Audioo.svg'
import MeetingVideo from '../Image/B_Videoo.svg'
import MeetingConnection from '../Image/B_shearing.svg'
import { Button, Modal, Offcanvas, Form } from 'react-bootstrap';
import BEdit from '../Image/BEdit.svg'
import { Link } from 'react-router-dom';


function Meeting() {
    const [isSelectedMeetingCancelled, setIsSelectedMeetingCancelled] = useState(false);
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [isLinkRotating, setIsLinkRotating] = useState(false);
    const [selectedReminders, setSelectedReminders] = useState([])
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [RepeatEvery, setRepeatEvery] = useState(1)
    const [billingCycle, setBillingCycle] = useState('Meeting Details');
    const [meetingFilter, setMeetingFilter] = useState("All Meetings");
    const [securityType, setSecurityType] = useState('alwaysLocked');
    const [meetingType, setMeetingType] = useState("All Meetings");
    const [linkNumber, setLinkNumber] = useState('57809');
    const [linkError, setLinkError] = useState('');
    const [rating, setRating] = useState(0);


    const handleLinkDiceClick = () => {
        setIsLinkRotating(true);
        setTimeout(() => {
            setIsLinkRotating(false);
            setLinkNumber(generateLinkNumber());
        }, 1000);
    };

    const generateLinkNumber = () => {
        let number = '';
        for (let i = 0; i < 5; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    };

    const validateLink = (value) => {
        if (value.length < 5) {
            setLinkError('Number must be minimum 5 characters');
            return false;
        }
        if (value.length > 5) {
            setLinkError('Number must be maximum 5 characters');
            return false;
        }

        if (!/^\d+$/.test(value)) {
            setLinkError('Please enter numbers only');
            return false;
        }

        setLinkError('');
        return true;
    };


    const handleLinkChange = (e) => {
        const newValue = e.target.value;
        setLinkNumber(newValue);
        validateLink(newValue);
    };

    const handleLinkEdit = (e) => {
        if (e.key === 'Enter') {
            if (validateLink(linkNumber)) {
                setIsEditingLink(false);
            }
        }
    };

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

    const handleDotsClick = (meetingId, event) => {
        event.stopPropagation();
        setOpenDropdownId(openDropdownId === meetingId ? null : meetingId);
    };

    const handleIncrement = () => {
        setRepeatEvery(prev => prev + 1);
    }

    const handleDecrement = () => {
        setRepeatEvery(prev => Math.max(prev - 1, 1));
    }


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
                                        <HiOutlineDotsVertical
                                            className='text-white'
                                            size={22}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleDotsClick('meeting1', e)}
                                        />
                                        {openDropdownId === 'meeting1' && (
                                            <div className="position-absolute  mt-2 py-2 B_boxEdit  rounded shadow-lg"
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
                                    <div>
                                        <button type="button" class="btn btn-outline-success B_upcoming_btn1 me-2">Completed</button>
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

        else if (meetingType === "Upcoming Meetings" && meetingFilter === "All Meetings") {
            return (
                <div className='mx-4'>
                    {/* Created By Me Section */}
                    <h6 className="text-white mt-4 ms-4">Created By Me</h6>
                    <div className="row g-5 B_meeting_card_section B_G_space mb-5">
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

                    {/* Invited By Me Section */}
                    <h6 className="text-white mb-4 ms-4">Invited By Me</h6>
                    <div className="row g-5 B_meeting_card_section B_G_space">
                        {/* Upcoming Meeting Card */}
                        <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                    <h6 className="text-white m-0 B_card_title">Project Meeting</h6>
                                    <div>
                                        <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
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
                                    <div className="d-flex">
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

        else if (meetingType === "Past Meetings" && meetingFilter === "Created By Me" || meetingFilter === "Invited By Me" || meetingFilter === "All Meetings") {
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
        }

        else if (meetingType === "Personal Room") {
            return (
                <div className="mx-4 B_perosnalMargin">
                    <div className="row">
                        {/* Room Details Section */}
                        <div className="col-lg-5 col-12 B_col_form">
                            <div className="mb-4 mt-5 B_top_margin">
                                <h5 className="text-white mb-4">Room Details</h5>
                                <div className='B_ROOM_DETAILS' style={{ borderRadius: '6px', padding: '20px' }}>
                                    <div className="d-flex align-items-center mb-4">
                                        <span className='B_ROOM_DETAILS_span' style={{ color: '#B3AEAE', width: '120px' }}>Name</span>
                                        <span className="text-white">: John Kumar's Meeting Room</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-4">
                                        <span className='B_ROOM_DETAILS_span' style={{ color: '#B3AEAE', width: '120px' }}>Meeting ID</span>
                                        <span className="text-white">: 16846118749463</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-4 B_invite_link_Column">
                                        <span className='B_ROOM_DETAILS_span' style={{ color: '#B3AEAE', width: '120px' }}>Invite Link</span>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center">
                                                <span className="text-white">: https://googlemeet.123/
                                                    {isEditingLink ? (
                                                        <input
                                                            type="text"
                                                            value={linkNumber}
                                                            onChange={handleLinkChange}
                                                            onKeyDown={handleLinkEdit}
                                                            className='B_Link_input'
                                                            autoFocus
                                                            style={{
                                                                background: 'transparent',
                                                                border: '1px solid #474e58',
                                                                color: 'white',
                                                                width: '120px',
                                                                borderRadius: '4px',
                                                                padding: '2px 5px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <span>{linkNumber}</span>
                                                    )}
                                                </span>
                                                {isEditingLink ? (
                                                    <>
                                                        <button
                                                            className="btn btn-link p-0 ms-2"
                                                            style={{ color: '#fff' }}
                                                            onClick={() => {
                                                                if (validateLink(linkNumber)) {
                                                                    setIsEditingLink(false);
                                                                }
                                                            }}
                                                        >
                                                            <IoCheckmark size={18} />
                                                        </button>
                                                        <button
                                                            className="btn btn-link p-0 ms-2"
                                                            style={{ color: '#fff' }}
                                                            onClick={() => {
                                                                setLinkNumber('57809');
                                                                setLinkError('');
                                                                setIsEditingLink(false);
                                                            }}
                                                        >
                                                            <IoClose size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            className='ms-2'
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setIsEditingLink(true)}
                                                        >
                                                            <img src={BEdit} alt="Edit" />
                                                        </span>
                                                        <span
                                                            className='ms-2'
                                                            style={{
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                display: 'inline-block',
                                                                transform: isLinkRotating ? 'rotate(60deg)' : 'rotate(0deg)',
                                                                transition: 'transform 0.5s ease',
                                                                transformOrigin: 'center center'
                                                            }}
                                                            onClick={handleLinkDiceClick}
                                                        >
                                                            <FaDiceTwo size={18} />
                                                        </span>
                                                        <button className="btn btn-link p-0 ms-2" style={{ color: '#fff' }}>
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {isEditingLink && linkError && (
                                                <small style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                                                    {linkError}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-4">
                                        <span className='B_ROOM_DETAILS_span' style={{ color: '#B3AEAE', width: '120px' }}>Security</span>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input B_radio_input"
                                                    type="radio"
                                                    style={{ cursor: "pointer" }}
                                                    name="security"
                                                    id="alwaysLocked"
                                                    checked={securityType === 'alwaysLocked'}
                                                    onChange={() => handleSecurityChange('alwaysLocked')}
                                                />
                                                <label className="form-check-label B_ROOM_DETAILS_label text-white" htmlFor="alwaysLocked">
                                                    Always locked
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input B_radio_input"
                                                    type="radio"
                                                    name="security"
                                                    id="passwordProtected"
                                                    checked={securityType === 'passwordProtected'}
                                                    onChange={() => handleSecurityChange('passwordProtected')}
                                                />
                                                <label className="form-check-label B_ROOM_DETAILS_label  text-white" htmlFor="passwordProtected">
                                                    Password Protected
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className='B_ROOM_DETAILS_span' style={{ color: '#B3AEAE', width: '120px' }}>Password</span>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center">
                                                <span className="text-white">: {
                                                    isEditingPassword ? (
                                                        <input
                                                            type="text"
                                                            value={password}
                                                            onChange={handlePasswordChange}
                                                            onKeyDown={handlePasswordEdit}
                                                            className='B_password_input'
                                                            autoFocus
                                                            style={{
                                                                background: 'transparent',
                                                                border: '1px solid #474e58',
                                                                color: 'white',
                                                                width: '120px',
                                                                borderRadius: '4px',
                                                                padding: '2px 5px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <span>{password}</span>
                                                    )
                                                }</span>
                                                {isEditingPassword ? (
                                                    <>
                                                        <button
                                                            className="btn btn-link p-0 ms-2"
                                                            style={{ color: '#fff' }}
                                                            onClick={() => {
                                                                if (validatePassword(password)) {
                                                                    setIsEditingPassword(false);
                                                                }
                                                            }}
                                                        >
                                                            <IoCheckmark size={18} />
                                                        </button>
                                                        <button
                                                            className="btn btn-link p-0 ms-2"
                                                            style={{ color: '#fff' }}
                                                            onClick={() => {
                                                                setPassword('5163YHV8ujui');
                                                                setPasswordError('');
                                                                setIsEditingPassword(false);
                                                            }}
                                                        >
                                                            <IoClose size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            className='ms-2'
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setIsEditingPassword(true)}
                                                        >
                                                            <img src={BEdit} alt="Edit" />
                                                        </span>
                                                        <span
                                                            className='ms-2'
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: '#fff',
                                                                display: 'inline-block',
                                                                transform: isRotating ? 'rotate3d(1, 1, 1, 360deg)' : 'rotate3d(1, 1, 1, 0deg)',
                                                                transition: 'transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                                                transformStyle: 'preserve-3d',
                                                                perspective: '1000px'
                                                            }}
                                                            onClick={handleDiceClick}
                                                        >
                                                            <FaDiceSix size={18} />
                                                        </span>
                                                        <button className="btn btn-link p-0 ms-2" style={{ color: '#fff' }}>
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {isEditingPassword && passwordError && (
                                                <small style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                                                    {passwordError}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <button className="btn btn-light fw-semibold B_ROOM_DETAILS_btn" style={{ padding: '8px 30px' }}>
                                            Start Meeting
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note Section */}
                        <div className="col-lg-7 col-12">
                            <div className="mb-4 mt-5 B_meeting_note_div1">
                                <div className='B_meeting_note_div' style={{ backgroundColor: '#0A1119', borderRadius: '6px', padding: '30px 50px 30px 30px' }}>
                                    <h5 className="text-white mb-4 ">Note:</h5>
                                    <p style={{ color: '#d3d3d3', marginBottom: '15px' }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>
                                    <p style={{ color: '#d3d3d3', marginBottom: '15px' }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply.
                                    </p>
                                    <p style={{ color: '#d3d3d3', marginBottom: '15px' }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>
                                    <p style={{ color: '#d3d3d3', marginBottom: '0' }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }


    const [ScheduleModel, setScheduleModel] = useState(false);
    const handleCloseScheduleModel = () => setScheduleModel(false);
    const handleShowScheduleModel = () => setScheduleModel(true);
    const handleShowScheduleModel1 = () => setScheduleModel(true);

    const [ScheduleCustomModel, setScheduleCustomModel] = useState(false);
    const handleCloseScheduleCustomModel = () => setScheduleCustomModel(false);
    const handleShowScheduleCustomModel = () => setScheduleCustomModel(true);

    const [CancelModel, setCancelModel] = useState(false);
    const handleCloseCancelModel = () => setCancelModel(false);
    const handleShowCancelModel = () => setCancelModel(true);

    const [InviteModel, setInviteModel] = useState(false);
    const handleCloseInviteModel = () => setInviteModel(false);
    const handleShowInviteModel = () => setInviteModel(true);

    const [DeleteModel, setDeleteModel] = useState(false);
    const handleCloseDeleteModel = () => setDeleteModel(false);
    const handleShowDeleteModel = () => setDeleteModel(true);

    const [ReviewModel, setReviewModel] = useState(false);

    const handleCloseReviewModel = () => setReviewModel(false);
    const handleShowReviewModel = () => setReviewModel(true);



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


    const handleSecurityChange = (type) => {
        setSecurityType(type);
    };

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [password, setPassword] = useState('5163YHV8ujui');
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (value) => {
        if (value.length < 12) {
            setPasswordError('Password must be minimum 12 characters');
            return false;
        }
        if (value.length > 12) {
            setPasswordError('Password must be maximum 12 characters');
            return false;
        }
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            setPasswordError('Password must contain uppercase, lowercase and numbers');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const handlePasswordChange = (e) => {
        const newValue = e.target.value;
        setPassword(newValue);
        validatePassword(newValue);
    };

    const handlePasswordEdit = (e) => {
        if (e.key === 'Enter') {
            if (validatePassword(password)) {
                setIsEditingPassword(false);
            }
        }
    };

    const [isRotating, setIsRotating] = useState(false);

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const length = 12;

        let chars = uppercase + lowercase + numbers;
        let password = '';

        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];

        for (let i = password.length; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        password = password.split('').sort(() => Math.random() - 0.5).join('');

        return password;
    };

    const handleDiceClick = () => {
        setIsRotating(true);
        setTimeout(() => {
            setIsRotating(false);
            setPassword(generatePassword());
        }, 1000);
    };

    const [activeButton, setActiveButton] = useState('audio');

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

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
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => {
                                            setMeetingType("All Meetings");
                                            setMeetingFilter("All Meetings");
                                        }}>All Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => {
                                            setMeetingType("Upcoming Meetings");
                                            setMeetingFilter("All Meetings");
                                        }}>Upcoming Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => {
                                            setMeetingType("Past Meetings");
                                            setMeetingFilter("All Meetings");
                                        }}>Past Meetings</a></li>
                                        <li><a className="dropdown-item B_dropdown_item" onClick={() => {
                                            setMeetingType("Personal Room");
                                            setMeetingFilter("");
                                        }}>Personal Room</a></li>
                                    </ul>
                                </div>

                                {meetingType !== "Personal Room" && (
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
                                )}
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
                                    <button className="btn btn-outline-light B_metting_btn" onClick={handleShowScheduleModel1}>Schedule</button>
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
                                            fontSize: '14px',
                                            padding: '8px 60px'
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
                                                color: billingCycle === 'Meeting Details' ? '#ffffff' : '#87898B',
                                                backgroundColor: billingCycle === 'Meeting Details' ? '#2A323B' : 'transparent'
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
                                                color: isSelectedMeetingCancelled ? '#4A4A4A' : (billingCycle === 'Chat' ? '#ffffff' : '#87898B'),
                                                backgroundColor: billingCycle === 'Chat' ? '#2A323B' : 'transparent',
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
                                    style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
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
                                                <h5 className="text-white B_meeting_title mb-3">Host & Participants</h5>
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

                        {/* Review Meeting Model */}

                        <Button variant="primary" onClick={handleShowReviewModel}>
                            Launch demo modal
                        </Button>

                        <Modal centered show={ReviewModel} onHide={handleCloseReviewModel} className='B_review_model'>
                            <Modal.Header className=' border-0 B_review_model_header' >
                                <Modal.Title className='B_review_model_title my-1'>How was your meeting experience?</Modal.Title>
                            </Modal.Header>
                            <div className='j_modal_header'>

                            </div>
                            <Modal.Body className='B_review_model_body'>
                                <div className='mt-3'>
                                    Help us improve - share your thoughts
                                </div>
                                <div>
                                    {/* Star Rating Component */}
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={star <= rating ? 'B_yellow_star' : 'B_grey_star'}
                                            onClick={() => setRating(star)}
                                            style={{ cursor: 'pointer', marginRight: '20px', fontSize: '20px', marginTop: '20px' }}
                                        />
                                    ))}
                                </div>

                                <div className='B_review_model_text'>
                                    What aspect of session gives you trouble?
                                </div>
                                <div className='d-flex gap-5 B_gapDiv justify-content-center'>
                                    <a
                                        className='B_review_model_Box text-decoration-none'
                                        href='#'
                                        onClick={() => handleButtonClick('audio')}
                                        style={{
                                            color: activeButton === 'audio' ? 'white' : '#BFBFBF',
                                            border: activeButton === 'audio' ? '1px solid #BFBFBF' : '2px solid transparent',
                                            padding: '10px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <img
                                            src={MeetingAudio}
                                            alt=""
                                            style={{
                                                filter: activeButton === 'audio' ? 'none' : 'grayscale(100%)',
                                                transition: 'filter 0.3s ease'
                                            }}
                                        />
                                        <p className='B_Box_Textt' style={{ color: activeButton === 'audio' ? 'white' : '#BFBFBF' }}>Audio</p>
                                    </a>
                                    <a
                                        className='B_review_model_Box text-decoration-none'
                                        href='#'
                                        onClick={() => handleButtonClick('video')}
                                        style={{
                                            color: activeButton === 'video' ? 'white' : '#BFBFBF',
                                            border: activeButton === 'video' ? '1px solid #BFBFBF' : '2px solid transparent',
                                            padding: '10px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <img
                                            src={MeetingVideo}
                                            alt=""
                                            style={{
                                                filter: activeButton === 'video' ? 'none' : 'grayscale(100%)',
                                                transition: 'filter 0.3s ease'
                                            }}
                                        />
                                        <p className='B_Box_Textt' style={{ color: activeButton === 'video' ? 'white' : '#BFBFBF' }}>Video</p>
                                    </a>
                                    <a
                                        className='B_review_model_Box text-decoration-none'
                                        href='#'
                                        onClick={() => handleButtonClick('connection')}
                                        style={{
                                            color: activeButton === 'connection' ? 'white' : '#BFBFBF',
                                            border: activeButton === 'connection' ? '1px solid #BFBFBF' : '2px solid transparent',
                                            padding: '10px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <img
                                            src={MeetingConnection}
                                            className='B_review_model_Box_img'
                                            alt=""
                                            style={{
                                                filter: activeButton === 'connection' ? 'none' : 'grayscale(100%)',
                                                transition: 'filter 0.3s ease'
                                            }}
                                        />
                                        <p className='B_Box_Textt' style={{ color: activeButton === 'connection' ? 'white' : '#BFBFBF' }}>Screen Sharing</p>
                                    </a>

                                </div>
                                <div className='mt-5 B_textAreaa' style={{ textAlign: "left" }}>
                                    <p className='B_addtional_text'>Additional Comments</p>
                                    <textarea
                                        className='B_text_Area'
                                        placeholder="Enter additional comments"
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            borderRadius: '4px',
                                            border: '1px solid #2d394b',
                                            backgroundColor: '#202F41',
                                            color: '#BFBFBF',
                                            padding: '10px',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <div className=' BB_margin_home gap-5' style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: "20px" }}>
                                    <Link to={'/home'}>
                                        <button className='B_hover_bttn'
                                        // onClick={() => {/* Add your back to home logic here */ }}
                                        >
                                            Back To Home
                                        </button>
                                    </Link>

                                    <button
                                        className='B_lastbtn'
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            border: 'none',
                                            color: '#000',
                                            padding: '8px 20px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease',
                                            width: '170px',
                                            textAlign: 'center'
                                        }}
                                        // onClick={() => {/* Add your submit logic here */ }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                                    >
                                        Submit
                                    </button>
                                </div>

                            </Modal.Body>

                        </Modal>
                    </div>

                </div>
            </section>


        </div>
    )
}

export default Meeting;
