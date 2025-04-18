import React, { useEffect, useRef, useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose, IoSearch, IoCheckmark } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown, FaDiceSix, FaDiceTwo, FaStar } from "react-icons/fa6";
import MeetingCanlander from '../Image/MeeringCalander.svg'
import MeetingUser from '../Image/MeetingUSer.svg'
import MeetingMultiUser from '../Image/MeetingMultiUser.svg'
import MeetingAudio from '../Image/B_Audioo.svg'
import MeetingVideo from '../Image/B_Videoo.svg'
import MeetingConnection from '../Image/B_shearing.svg'
import { Button, Modal, Offcanvas, Form } from 'react-bootstrap';
import BEdit from '../Image/BEdit.svg'
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { createreview } from '../Redux/Slice/reviews.slice';
import { useDispatch, useSelector } from 'react-redux';
import { createschedule, getAllschedule, updateschedule } from '../Redux/Slice/schedule.slice';
import { getAllUsers } from '../Redux/Slice/user.slice';
import bin from '../Image/j_bin.svg'
import { IMAGE_URL } from '../Utils/baseUrl';
import { current } from '@reduxjs/toolkit';



function Meeting() {
    const [isSelectedMeetingCancelled, setIsSelectedMeetingCancelled] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLinkRotating, setIsLinkRotating] = useState(false);
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [selectedReminders, setSelectedReminders] = useState([]);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [rating, setRating] = useState(0);
    const [RepeatEvery1, setRepeatEvery1] = useState(1);
    const [RepeatEvery, setRepeatEvery] = useState(1);
    const [billingCycle, setBillingCycle] = useState('Meeting Details');
    const [meetingFilter, setMeetingFilter] = useState("All Meetings");
    const [securityType, setSecurityType] = useState('alwaysLocked');
    const [meetingType, setMeetingType] = useState("All Meetings");
    const [password, setPassword] = useState('5163YHV8ujui');
    const [linkNumber, setLinkNumber] = useState('57809');
    const [passwordError, setPasswordError] = useState('');
    const [linkError, setLinkError] = useState('');
    const [repeatType, setRepeatType] = useState('0');
    const [endsSelection, setEndsSelection] = useState('0');
    const userId = sessionStorage.getItem('userId');
    const gettoken = sessionStorage.getItem('token');
    const allusers = useSelector((state) => state.user.allusers);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [activeButton, setActiveButton] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const IMG_URL = IMAGE_URL
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);


    const handleLinkDiceClick = () => {
        setIsLinkRotating(true);
        setTimeout(() => {
            setIsLinkRotating(false);
            setLinkNumber(generateLinkNumber());
        }, 1000);
    };

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);


    const generateLinkNumber = () => {
        let number = '';
        for (let i = 0; i < 5; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !searchInputRef.current.contains(event.target)) {
                setShowDropdown(false);
                setFilteredUsers([]);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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
        setSelectedDays((prevSelectedDays) => {
            if (prevSelectedDays.includes(day)) {
                return prevSelectedDays.filter((d) => d !== day);
            } else {
                return [...prevSelectedDays, day];
            }
        });
    };

    const handleDotsClick = (meetingId, event) => {
        event.stopPropagation();
        setOpenDropdownId(openDropdownId === meetingId ? null : meetingId);
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

    const handleIncrement1 = () => {
        setRepeatEvery1(prev => prev + 1);
    }

    const handleDecrement1 = () => {
        setRepeatEvery1(prev => Math.max(prev - 1, 1));
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

    const allschedule = useSelector((state) => state.schedule.allschedule);
    // console.log("allschedule", allschedule);

    const usersMeetings = allschedule.filter(meeting => meeting.userId === userId);
    // console.log("userMeetings", usersMeetings);

    useEffect(() => {
        dispatch(getAllschedule());
    }, [dispatch]);

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false // set to false if you want 24-hour format
    });
    // console.log(currentTime);

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const durationInMinutes = (end - start) / (1000 * 60);

        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        return `${hours}h ${minutes}m`;
    };

    const [ScheduleData, setScheduleData] = useState()
    const handleEdit = (data) => {
        setScheduleData(data)
    }

    const [inviteData, setInviteData] = useState()
    const handleInvite = (data) => {
        setInviteData(data)
    }


    const renderMeetingCards = () => {

        if (meetingType === "All Meetings" && meetingFilter === "All Meetings") {
            return (
                <div className='mx-4'>
                    <div className="row g-5 B_meeting_card_section">
                        {/* METTING CARD ALL SECTION */}

                        {/* Upcoming Meeting Card */}
                        {usersMeetings.filter(schedule => {
                            const duration = calculateDuration(schedule.startTime, schedule.endTime);
                            const date = formatDate(schedule.date)
                            return (
                                schedule.title.includes(searchTerm) ||
                                date.includes(searchTerm) ||
                                schedule.startTime.includes(searchTerm) ||
                                duration.includes(searchTerm)
                            );
                        }).map((schedule, index) => {
                            return (
                                <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className="B_meeting_card" style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                        <div className="d-flex justify-content-between align-items-center  p-3 B_meeting_padding">
                                            <h6 className="text-white m-0 B_card_title">{schedule.title}</h6>
                                            <div>
                                                {formatDate(schedule.date) >= formatDate(currentDate) && schedule.startTime != currentTime && (
                                                    <>
                                                        <button type="button" class="btn btn-outline-primary B_upcoming_btn me-2">Upcoming</button>

                                                        <HiOutlineDotsVertical
                                                            className='text-white'
                                                            size={22}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => handleDotsClick(schedule._id, e)}
                                                        />

                                                        {openDropdownId === schedule._id && (
                                                            <div className="position-absolute  mt-2 py-2 B_boxEdit  rounded shadow-lg"
                                                                style={{ minWidth: '120px', zIndex: 1000 }}>
                                                                {/* <Link target="_blank" to={`${schedule.meetingLink}`} className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                                    Start
                                                                </Link> */}
                                                                <button
                                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                                    onClick={() => window.location.href = schedule.meetingLink}
                                                                >
                                                                    Start
                                                                </button>
                                                                {/* <button
                                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                                    onClick={() => window.open(schedule.meetingLink, '_blank')}
                                                                >
                                                                    Start
                                                                </button> */}
                                                                <button
                                                                    className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                                                    onClick={() => { handleShowScheduleModel(); handleEdit(schedule) }}
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
                                                                    onClick={() => { handleShowInviteModel(); handleInvite(schedule) }}
                                                                >
                                                                    Invite People
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {formatDate(schedule.date) < formatDate(currentDate) && (
                                                    <button type="button" class="btn btn-outline-success B_upcoming_btn1 me-2">Completed</button>
                                                )}

                                                {formatDate(schedule.date) == formatDate(currentDate) && schedule.startTime == currentTime && (
                                                    <button type="button" class="btn btn-outline-secondary B_upcoming_btn1 B_upcoming_btn2 me-2">Join</button>
                                                )}
                                                {/* <button type="button" class="btn btn-outline-danger B_upcoming_btn1 me-2">Cancelled</button> */}
                                            </div>
                                        </div>
                                        <div style={{ borderTop: "1px solid #525252" }}></div>
                                        <div className="B_meetingALl_details p-3 B_meeting_padding" style={{ color: '#B3AEAE' }}>
                                            <div className="d-flex  mb-2">
                                                <span className='B_meetingALl_details_span'>Meeting Date</span>
                                                <span className='text-white'>: {formatDate(schedule.date)}</span>
                                                {/* <span className='text-white'>: 23-01-2025</span> */}
                                            </div>
                                            <div className="d-flex  mb-2">
                                                <span className='B_meetingALl_details_span'>Meeting Time</span>
                                                <span className='text-white'>: {schedule.startTime}</span>
                                                {/* <span className='text-white'>: 11:00 AM</span> */}
                                            </div>
                                            <div className="d-flex ">
                                                <span className='B_meetingALl_details_span'>Meeting Duration</span>
                                                <span className='text-white'>: {calculateDuration(schedule.startTime, schedule.endTime)}</span>
                                                {/* <span className='text-white'>: 0h 30m</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Completed Meeting Card */}
                        {/* <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
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
                        </div> */}

                        {/* Join Meeting Card */}
                        {/* <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
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
                        </div> */}

                        {/* Cancelled Meeting Card */}
                        {/* <div className=" col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="B_meeting_card " style={{ backgroundColor: '#0A1119', borderRadius: '6px' }}>
                                <div className="d-flex justify-content-between align-items-center p-3 B_meeting_padding">
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
                        </div> */}
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
                                                        <div className="d-flex flex-column align-items-center"> {/* Container for button and message */}
                                                            <button className="btn btn-link p-0 ms-2" style={{ color: '#fff' }}>
                                                                <i className="fas fa-copy"></i>
                                                            </button>
                                                            {linkCopied && ( // Conditionally render the copied message
                                                                <div className="text-success mt-2">
                                                                    Link is copied!
                                                                </div>
                                                            )}
                                                        </div>
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

    const [createScheduleModel, setcreateScheduleModel] = useState(false);
    const [EditScheduleModel, seteditScheduleModel] = useState(false);
    const handleCloseScheduleModel = () => setcreateScheduleModel(false);
    const handlecreateScheduleModel = () => setcreateScheduleModel(true);
    const handleShowScheduleModel = () => seteditScheduleModel(true);
    const handleCloseeditScheduleModel = () => seteditScheduleModel(false);

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


    // const reviewSchema = Yup.object().shape({
    //     rating: Yup.string().required("rating is required"),
    //     comments: Yup.string().required("comments is required"),
    // });

    // const handleButtonClick = (button) => {
    //     setActiveButton(button);
    // };

    const handleRating = (value) => {

        if (value === rating) {
            setRating(rating - 1);
        } else {
            setRating(value);
        }
    };

    // const handleRating = (star) => {
    //     if (star === rating) {
    //         // If clicking the last filled star, decrease rating by 1
    //         setRating(rating - 1);
    //     } else {
    //         // Otherwise set to clicked star value
    //         setRating(star);
    //     }
    // }


    const handleButtonClick = (button) => {
        setActiveButton((prev) => {
            if (prev.includes(button)) {
                return prev.filter((b) => b !== button);
            } else {
                return [...prev, button];
            }
        });
    };

    // const handleButtonClick = (button) => {
    //     setActiveButton((prev) => {
    //         if (prev.includes(button)) {
    //             return prev.filter((b) => b !== button); // Deselect if already selected
    //         } else {
    //             return [...prev, button]; // Select if not already selected
    //         }
    //     });
    // };


    const scheduleSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),

        date: Yup.date()
            .required('Date is required'),

        startTime: Yup.string()
            .required('Start time is required'),

        endTime: Yup.string()
            .required('End time is required')
            .test('is-greater', 'End time should be after start time', function (value) {
                const { startTime } = this.parent;
                if (!startTime || !value) return true;
                return value > startTime;
            }),

        meetingLink: Yup.string()
            .required('Meeting link is required'),

        description: Yup.string()
            .required('Description is required'),

        reminder: Yup.array()
            .of(Yup.string()
                .oneOf([
                    '5 min before',
                    '10 min before',
                    '15 min before',
                    '30 min before',
                    '1 hr before',
                    '2 hr before',
                    '1 day before',
                    '2 days before'
                ], 'Please select a valid reminder option')
            )
            .min(1, 'Please select at least one reminder'),

        recurringMeeting: Yup.string()
            .oneOf(['DoesNotRepeat', 'daily', 'weekly', 'monthly', 'custom'], 'Please select a valid recurring option')
            .required('Please select recurring meeting option'),

        customRecurrence: Yup.object().when('recurringMeeting', {
            is: 'custom',
            then: () => Yup.object({
                repeatType: Yup.string()
                    .required('Repeat type is required')
                    .oneOf(['daily', 'weekly', 'monthly', 'yearly'], 'Please select a valid repeat type'),

                repeatEvery: Yup.number()
                    .required('Repeat frequency is required')
                    .min(1, 'Must be at least 1'),

                repeatOn: Yup.array()
                    .of(Yup.string()
                        .oneOf(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']))
                    .when('repeatType', {
                        is: 'weekly',
                        then: () => Yup.array().min(1, 'Please select at least one day')
                    }),

                ends: Yup.string()
                    .required('Please select when the recurring meeting ends')
                    .oneOf(['never', 'on', 'after'], 'Invalid end option'),

                endDate: Yup.date().when('ends', {
                    is: 'on',
                    then: () => Yup.date()
                        .required('End date is required')
                        .min(Yup.ref('date'), 'End date must be after start date')
                })
            }),
            otherwise: () => Yup.object().nullable()
        }),

        invitees: Yup.array()
            .of(
                Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Email is required'),
                })
            )
            .test('min-invitees', 'Please add at least one invitee', function (invitees) {
                const nonHostInvitees = invitees?.filter(invitee => invitee._id !== userId) || [];
                return nonHostInvitees.length >= 1;
            })
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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
                                        placeholder="Search..." value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} />

                                    <div className='position-absolute B_Meeting_search_icon text-white'>
                                        <IoSearchSharp style={{ color: 'rgb(179, 174, 174)' }} />
                                    </div>
                                </div>

                                <div className='d-flex gap-4'>
                                    <button className="btn btn-outline-light B_metting_btn fw-semibold" onClick={() => {
                                        if (!gettoken || !userId) {
                                            alert('Please login to create a schedule');
                                            return;
                                        }
                                        handlecreateScheduleModel();
                                    }}>
                                        Schedule
                                    </button>
                                    <button className="btn btn-outline-light B_metting_btn fw-semibold">Meet Now</button>
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


                        {/* ============================create Schedule Meeting Modal ============================ */}

                        <Modal
                            show={createScheduleModel}
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

                                <Formik
                                    initialValues={{
                                        userId: userId,
                                        title: '',
                                        date: '',
                                        startTime: '',
                                        endTime: '',
                                        meetingLink: '',
                                        description: '',
                                        reminder: [],
                                        recurringMeeting: '',
                                        customRecurrence: {
                                            repeatType: '',
                                            repeatEvery: "1",
                                            repeatOn: [],
                                            ends: '0',
                                            endDate: '',
                                            Recurrence: '1',
                                            Monthfirst: '',
                                        },
                                        invitees: []
                                    }}
                                    validationSchema={scheduleSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        if (!gettoken || !userId) {
                                            alert('Please login to create a schedule');
                                            return;
                                        }
                                        dispatch(createschedule(values)).then((response) => {
                                            console.log(response);
                                            if (response.payload?.status === 200) {
                                                resetForm();
                                                handleCloseScheduleModel();
                                            }
                                        });
                                    }}
                                >

                                    {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                                        console.log(formatDate(values.date)),
                                        <form onSubmit={handleSubmit}>
                                            <div className="row B_flex_reverse">
                                                <div className="col-12 col-lg-8 ps-0 j_schedule_border">
                                                    <div className="mb-3 pt-3">
                                                        <label htmlFor="title" className="form-label text-white j_join_text">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control j_input j_join_text"
                                                            id="title"
                                                            name="title"
                                                            value={values.title}
                                                            onChange={handleChange}
                                                            placeholder="Enter title for meeting"
                                                        />
                                                        {touched.title && errors.title && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.title}</div>}
                                                    </div>

                                                    <div className="j_schedule_DnT B_schedule_DnT">
                                                        <div className="mb-3">
                                                            <label htmlFor="date" className="form-label text-white j_join_text">Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="date"
                                                                name="date"
                                                                value={values.date}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.date && errors.date && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.date}</div>}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                                                            <input
                                                                type="time"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="startTime"
                                                                name="startTime"
                                                                value={values.startTime}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.startTime && errors.startTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.startTime}</div>}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="endTime" className="form-label text-white j_join_text">End Time</label>
                                                            <input
                                                                type="time"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="endTime"
                                                                name="endTime"
                                                                value={values.endTime}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.endTime && errors.endTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.endTime}</div>}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="meetingLink" className="form-label text-white j_join_text">Meeting Link</label>
                                                        <select
                                                            className="form-select j_select j_join_text"
                                                            id="meetingLink"
                                                            name="meetingLink"
                                                            value={values.meetingLink}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="GenerateaOneTimeMeetingLink">Generate a one time meeting link</option>
                                                            <option value="UseMyPersonalRoomLink">Use my personal room link</option>
                                                        </select>
                                                        {touched.meetingLink && errors.meetingLink && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.meetingLink}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                                                        <textarea
                                                            className="form-control j_input j_join_text"
                                                            id="description"
                                                            name="description"
                                                            rows="3"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                            placeholder="Enter a description for meeting"
                                                        />
                                                        {touched.description && errors.description && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.description}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white j_join_text">Reminder</label>
                                                        <div>
                                                            {['5 min before', '10 min before', '15 min before', '30 min before',
                                                                '1 hr before', '2 hr before', '1 day before', '2 days before'].map((reminder) => (
                                                                    <button
                                                                        key={reminder}
                                                                        type="button"
                                                                        className={`btn j_schedule_btn ${values.reminder.includes(reminder) ? 'j_schedule_selected_btn' : ''}`}
                                                                        onClick={() => {
                                                                            const newReminders = values.reminder.includes(reminder)
                                                                                ? values.reminder.filter(r => r !== reminder)
                                                                                : [...values.reminder, reminder];
                                                                            setFieldValue('reminder', newReminders);
                                                                        }}
                                                                    >
                                                                        {reminder}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                        {touched.reminder && errors.reminder && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.reminder}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="recurringMeeting" className="form-label text-white j_join_text">Recurring Meetings</label>
                                                        <select
                                                            className="form-select j_select j_join_text"
                                                            id="recurringMeeting"
                                                            name="recurringMeeting"
                                                            value={values.recurringMeeting}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                if (e.target.value === "custom") {
                                                                    // handleCloseScheduleModel();
                                                                    handleShowScheduleCustomModel();
                                                                }
                                                            }}
                                                        >
                                                            <option value="">select</option>
                                                            <option value="DoesNotRepeat">Does not repeat</option>
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly on Monday</option>
                                                            <option value="monthly">Monthly on 3 February</option>
                                                            <option value="custom">Custom</option>
                                                        </select>
                                                        {touched.recurringMeeting && errors.recurringMeeting &&
                                                            <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.recurringMeeting}</div>}
                                                    </div>

                                                    <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3 B_Gap_Button">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-light j_home_button B_schedule_btn1 fw-semibold"
                                                            onClick={handleCloseScheduleModel}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="btn btn-light j_home_button fw-semibold">
                                                            {ScheduleData ? 'Update' : 'Schedule'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-4 pe-0 B_paddingStart">
                                                    <div className="mb-3 pt-3 B_MarGin">
                                                        <p className='mb-0 text-white'>
                                                            Invitees ({values.invitees.length + (userId ? 1 : 0)})
                                                        </p>
                                                        <div className="position-relative mt-1">
                                                            <IoSearch className='position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                                                            <input
                                                                ref={searchInputRef}
                                                                type="search"
                                                                name="invitees"
                                                                className="form-control text-white j_input ps-4 j_join_text"
                                                                placeholder="Add people by name or email..."
                                                                style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                                                onChange={(e) => {
                                                                    const searchTerm = e.target.value.toLowerCase();
                                                                    const filtered = allusers.filter(user =>
                                                                        user.email.toLowerCase().includes(searchTerm) ||
                                                                        user.name.toLowerCase().includes(searchTerm)
                                                                    );
                                                                    setFilteredUsers(filtered);
                                                                    setShowDropdown(true);
                                                                }}
                                                                onFocus={() => setShowDropdown(true)}
                                                            />
                                                        </div>
                                                        {showDropdown && (
                                                            <div
                                                                ref={dropdownRef}
                                                                className="position-absolute mt-1 B_suggestion"
                                                                style={{
                                                                    backgroundColor: "#202F41",
                                                                    borderRadius: '5px',
                                                                    width: '31%',
                                                                    zIndex: 1000,
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto'
                                                                }}
                                                            >
                                                                {filteredUsers.length > 0 ? (
                                                                    filteredUsers
                                                                        .filter(user => user._id !== userId)
                                                                        .map((user) => (
                                                                            <div
                                                                                key={user._id}
                                                                                className="d-flex align-items-center p-2 cursor-pointer hover-bg-dark"
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    if (!values.invitees.some(invitee => invitee.email === user.email)) {
                                                                                        setFieldValue('invitees', [...values.invitees, {
                                                                                            _id: user._id,
                                                                                            name: user.name,
                                                                                            email: user.email,
                                                                                            photo: user.photo
                                                                                        }]);
                                                                                    }
                                                                                    setShowDropdown(false);
                                                                                }}
                                                                            >
                                                                                <div className="me-2">
                                                                                    {user.photo ? (
                                                                                        <img
                                                                                            src={`${IMG_URL}${user.photo}`}
                                                                                            alt="Profile"
                                                                                            className="rounded-circle"
                                                                                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                            style={{
                                                                                                width: '30px',
                                                                                                height: '30px',
                                                                                                backgroundColor: '#364758',
                                                                                                color: 'white'
                                                                                            }}
                                                                                        >
                                                                                            {/* {user.name.charAt(0).toUpperCase()} */}
                                                                                            {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="text-white">
                                                                                    <div style={{ fontSize: '14px' }}>{user.name}</div>
                                                                                    <div style={{ fontSize: '12px', color: '#8B9CAF' }}>{user.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <div className="p-3 text-center text-white" style={{ fontSize: '14px' }}>
                                                                        No users found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {touched.invitees && errors.invitees && (
                                                            <div style={{ fontSize: '14px', marginTop: '4px', color: '#cd1425' }}>
                                                                {errors.invitees}
                                                            </div>
                                                        )}
                                                        {(values.invitees.length > 0 || userId) && (
                                                            <div className="mt-2">
                                                                {allusers
                                                                    .filter(user => user._id === userId)
                                                                    .map(user => (
                                                                        <div key={user._id} className="d-flex align-items-center mb-1">
                                                                            <div className="j_margin_end">
                                                                                {user.photo ? (
                                                                                    <img
                                                                                        src={`${IMG_URL}${user.photo}`}
                                                                                        alt="Profile"
                                                                                        className="rounded-circle"
                                                                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: '30px',
                                                                                            height: '30px',
                                                                                            backgroundColor: '#364758',
                                                                                            color: 'white'
                                                                                        }}
                                                                                    >
                                                                                        {/* {user.name.charAt(0).toUpperCase()} */}
                                                                                        {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                <span className="text-white" style={{ fontSize: '13.5px' }}>{user.email}</span>
                                                                                <p className="mb-0" style={{ fontSize: '13px', color: '#BFBFBF' }}>Host</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                {values.invitees.map((invitee, index) => (
                                                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className="j_margin_end">
                                                                                {invitee.photo ? (
                                                                                    <img
                                                                                        src={`${IMG_URL}${invitee.photo}`}
                                                                                        alt="Profile"
                                                                                        className="rounded-circle"
                                                                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: '30px',
                                                                                            height: '30px',
                                                                                            backgroundColor: '#364758',
                                                                                            color: 'white'
                                                                                        }}
                                                                                    >
                                                                                        {/* {invitee.name?.charAt(0).toUpperCase()} */}
                                                                                        {invitee.name.charAt(0).toUpperCase()}{invitee.name.split(' ')[1] ? invitee.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="j_margin_start">
                                                                                <span className="text-white" style={{ fontSize: '14px' }}>{invitee.email}</span>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-link text-danger p-0 ms-2"
                                                                            onClick={() => {
                                                                                const newInvitees = values.invitees.filter((_, i) => i !== index);
                                                                                setFieldValue('invitees', newInvitees);
                                                                            }}
                                                                        >
                                                                            <img src={bin} alt="bin" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {values.invitees.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-link text-white p-0"
                                                                style={{
                                                                    fontSize: '14px',
                                                                    textDecoration: 'underline',
                                                                    border: 'none',
                                                                    background: 'none'
                                                                }}
                                                                onClick={() => setFieldValue('invitees', [])}
                                                            >
                                                                Remove all
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ============================ Schedule Meeting custom Modal ============================  */}
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
                                                        <div className="mb-3 flex-fill me-2 j_select_fill">
                                                            <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                id="RepeatType"
                                                                name="customRecurrence.repeatType"
                                                                value={values.customRecurrence.repeatType}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="daily">Daily</option>
                                                                <option value="weekly">Weekly</option>
                                                                <option value="monthly">Monthly</option>
                                                                <option value="yearly">Yearly</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-3 flex-fill j_select_fill">
                                                            <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                                                            <div className='position-relative'>
                                                                <input
                                                                    type="text"
                                                                    className="form-control j_input j_join_text"
                                                                    id="RepeatEvery"
                                                                    name="customRecurrence.repeatEvery"
                                                                    value={values.customRecurrence.repeatEvery}
                                                                    onChange={(e) => setFieldValue('customRecurrence.repeatEvery', e.target.value)}
                                                                />
                                                                <div className="j_custom_icons">
                                                                    <FaAngleUp
                                                                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                        onClick={() => setFieldValue('customRecurrence.repeatEvery', Number(values.customRecurrence.repeatEvery) + 1)}
                                                                    />
                                                                    <FaAngleDown
                                                                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                        onClick={() => setFieldValue('customRecurrence.repeatEvery', Math.max(values.customRecurrence.repeatEvery - 1, 1))}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {values.customRecurrence.repeatType === 'weekly' && (
                                                        <div className="mb-3">
                                                            <label className="form-label text-white j_join_text">Repeat On</label>
                                                            <div className="d-flex B_Repeat_on_btn">
                                                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                                                    <button
                                                                        key={day}
                                                                        className={`btn ${values.customRecurrence.repeatOn.includes(day) ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                                                        onClick={() => {
                                                                            const newDays = values.customRecurrence.repeatOn.includes(day)
                                                                                ? values.customRecurrence.repeatOn.filter(d => d !== day)
                                                                                : [...values.customRecurrence.repeatOn, day];
                                                                            setFieldValue('customRecurrence.repeatOn', newDays);
                                                                        }}
                                                                    >
                                                                        {day.charAt(0)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {values.customRecurrence.repeatType === 'monthly' && (
                                                        <div className="mb-3">
                                                            <label className="text-white j_join_text">Every</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                name="customRecurrence.Monthfirst"
                                                                value={values.customRecurrence.Monthfirst}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="firstmonday">Monthly on first monday</option>
                                                                <option value="firstday">Monthly on first day</option>
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div className="j_schedule_Repeat">
                                                        <div className="mb-3 flex-fill me-2  j_select_fill">
                                                            <label htmlFor="ends" className="form-label text-white j_join_text">Ends</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                name="customRecurrence.ends"
                                                                value={values.customRecurrence.ends}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="never">Never</option>
                                                                {values.customRecurrence.repeatType !== 'daily' && <option value="on">On</option>}
                                                                <option value="after">After</option>
                                                            </select>
                                                        </div>

                                                        {values.customRecurrence.ends === "on" && (
                                                            <div className="mb-3 flex-fill j_select_fill">
                                                                <label htmlFor="endDate" className="form-label text-white j_join_text"></label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control j_input j_join_text j_special_m"
                                                                    name="customRecurrence.endDate"
                                                                    value={values.customRecurrence.endDate}
                                                                    onChange={handleChange}
                                                                />
                                                                {touched.customRecurrence?.endDate && errors.customRecurrence?.endDate && (
                                                                    <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.customRecurrence.endDate}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {values.customRecurrence.ends === "after" && (
                                                            console.log(values.customRecurrence.Recurrence),

                                                            <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                                                                <label className="form-label text-white j_join_text"></label>
                                                                <div className='position-relative'>
                                                                    <input
                                                                        type="text"
                                                                        name='customRecurrence.Recurrence'
                                                                        className="form-control j_input j_join_text j_special_m"
                                                                        value={`${values.customRecurrence.Recurrence} Recurrence`}
                                                                        onChange={(e) => setFieldValue('customRecurrence.Recurrence', e.target.value)}
                                                                    />
                                                                    <div className="j_custom_icons">
                                                                        <FaAngleUp
                                                                            style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                            onClick={() => setFieldValue('customRecurrence.Recurrence', Number(values.customRecurrence.Recurrence) + 1)}
                                                                        />
                                                                        <FaAngleDown
                                                                            style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                            onClick={() => setFieldValue('customRecurrence.Recurrence', Math.max(values.customRecurrence.Recurrence - 1, 1))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Modal.Footer className="j_custom_footer border-0 p-0 pt-4 pb-3">
                                                        <Button
                                                            variant="outline-light"
                                                            className="j_custom_button fw-semibold"
                                                            onClick={() => { handleCloseScheduleCustomModel(); handleShowScheduleModel() }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="light"
                                                            className="j_custom_button fw-semibold"
                                                            onClick={() => {
                                                                console.log("customRecurrence", values.customRecurrence);
                                                                setFieldValue('customRecurrence', values.customRecurrence);
                                                                handleCloseScheduleCustomModel();
                                                            }}
                                                        >
                                                            Done
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal.Body>
                                            </Modal>
                                        </form>
                                    )}


                                </Formik>
                            </Modal.Body>
                        </Modal>

                        {/* ============================ update Schedule Meeting Modal ============================ */}

                        <Modal
                            show={EditScheduleModel}
                            onHide={handleCloseeditScheduleModel}
                            size="lg"
                            centered
                            contentClassName="j_modal_schedule "
                            dialogClassName="j_Schedule_width"
                        >
                            <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                                <Modal.Title className="j_join_title text-white">Update Schedule Meeting</Modal.Title>
                                <IoClose
                                    style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                                    onClick={handleCloseeditScheduleModel}
                                />
                            </Modal.Header>

                            <div className="j_modal_header"></div>

                            <Modal.Body className="py-0">

                                <Formik
                                    initialValues={{
                                        _id: ScheduleData ? ScheduleData._id : '',
                                        userId: ScheduleData ? ScheduleData?.userId : userId,
                                        title: ScheduleData ? ScheduleData?.title : '',
                                        date: ScheduleData ? ScheduleData?.date : '',
                                        startTime: ScheduleData ? ScheduleData?.startTime : '',
                                        endTime: ScheduleData ? ScheduleData?.endTime : '',
                                        meetingLink: ScheduleData ? ScheduleData?.meetingLink : '',
                                        description: ScheduleData ? ScheduleData?.description : '',
                                        reminder: ScheduleData ? ScheduleData?.reminder : [],
                                        recurringMeeting: ScheduleData ? ScheduleData?.recurringMeeting : '',
                                        customRecurrence: ScheduleData ? ScheduleData?.customRecurrence : {
                                            repeatType: '',
                                            repeatEvery: "1",
                                            repeatOn: [],
                                            ends: '0',
                                            endDate: '',
                                            Recurrence: '1',
                                            Monthfirst: '',
                                        },
                                        invitees: ScheduleData ? ScheduleData?.invitees : []
                                    }}
                                    validationSchema={scheduleSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        if (!gettoken || !userId) {
                                            alert('Please login to create a schedule');
                                            return;
                                        }
                                        dispatch(updateschedule(values)).then((response) => {
                                            console.log(response);
                                            if (response.payload?.status === 200) {
                                                resetForm();
                                                handleCloseeditScheduleModel();
                                            }
                                        });
                                    }}
                                >

                                    {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row B_flex_reverse">
                                                <div className="col-12 col-lg-8 ps-0 j_schedule_border">
                                                    <div className="mb-3 pt-3">
                                                        <label htmlFor="title" className="form-label text-white j_join_text">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control j_input j_join_text"
                                                            id="title"
                                                            name="title"
                                                            value={values.title}
                                                            onChange={handleChange}
                                                            placeholder="Enter title for meeting"
                                                        />
                                                        {touched.title && errors.title && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.title}</div>}
                                                    </div>

                                                    <div className="j_schedule_DnT B_schedule_DnT">
                                                        <div className="mb-3">
                                                            {console.log("values.date", formatDate(values.date))}
                                                            <label htmlFor="date" className="form-label text-white j_join_text">Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="date"
                                                                name="date"
                                                                value={values.date}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.date && errors.date && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.date}</div>}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                                                            <input
                                                                type="time"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="startTime"
                                                                name="startTime"
                                                                value={values.startTime}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.startTime && errors.startTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.startTime}</div>}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="endTime" className="form-label text-white j_join_text">End Time</label>
                                                            <input
                                                                type="time"
                                                                className="form-control j_input j_join_text B_schedule_input"
                                                                id="endTime"
                                                                name="endTime"
                                                                value={values.endTime}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.endTime && errors.endTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.endTime}</div>}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="meetingLink" className="form-label text-white j_join_text">Meeting Link</label>
                                                        <select
                                                            className="form-select j_select j_join_text"
                                                            id="meetingLink"
                                                            name="meetingLink"
                                                            value={values.meetingLink}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="GenerateaOneTimeMeetingLink">Generate a one time meeting link</option>
                                                            <option value="UseMyPersonalRoomLink">Use my personal room link</option>
                                                        </select>
                                                        {touched.meetingLink && errors.meetingLink && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.meetingLink}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                                                        <textarea
                                                            className="form-control j_input j_join_text"
                                                            id="description"
                                                            name="description"
                                                            rows="3"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                            placeholder="Enter a description for meeting"
                                                        />
                                                        {touched.description && errors.description && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.description}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white j_join_text">Reminder</label>
                                                        <div>
                                                            {['5 min before', '10 min before', '15 min before', '30 min before',
                                                                '1 hr before', '2 hr before', '1 day before', '2 days before'].map((reminder) => (
                                                                    <button
                                                                        key={reminder}
                                                                        type="button"
                                                                        className={`btn j_schedule_btn ${values.reminder.includes(reminder) ? 'j_schedule_selected_btn' : ''}`}
                                                                        onClick={() => {
                                                                            const newReminders = values.reminder.includes(reminder)
                                                                                ? values.reminder.filter(r => r !== reminder)
                                                                                : [...values.reminder, reminder];
                                                                            setFieldValue('reminder', newReminders);
                                                                        }}
                                                                    >
                                                                        {reminder}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                        {touched.reminder && errors.reminder && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.reminder}</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="recurringMeeting" className="form-label text-white j_join_text">Recurring Meetings</label>
                                                        <select
                                                            className="form-select j_select j_join_text"
                                                            id="recurringMeeting"
                                                            name="recurringMeeting"
                                                            value={values.recurringMeeting}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                if (e.target.value === "custom") {
                                                                    // handleCloseScheduleModel();
                                                                    handleShowScheduleCustomModel();
                                                                }
                                                            }}
                                                        >
                                                            <option value="">select</option>
                                                            <option value="DoesNotRepeat">Does not repeat</option>
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly on Monday</option>
                                                            <option value="monthly">Monthly on 3 February</option>
                                                            <option value="custom">Custom</option>
                                                        </select>
                                                        {touched.recurringMeeting && errors.recurringMeeting &&
                                                            <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.recurringMeeting}</div>}
                                                    </div>

                                                    <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3 B_Gap_Button">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-light j_home_button B_schedule_btn1 fw-semibold"
                                                            onClick={handleCloseeditScheduleModel}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="btn btn-light j_home_button fw-semibold">
                                                            {ScheduleData ? 'Update' : 'Schedule'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-4 pe-0 B_paddingStart">
                                                    <div className="mb-3 pt-3 B_MarGin">
                                                        <p className='mb-0 text-white'>
                                                            Invitees ({values.invitees.length + (userId ? 1 : 0)})
                                                        </p>
                                                        <div className="position-relative mt-1">
                                                            <IoSearch className='position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                                                            <input
                                                                ref={searchInputRef}
                                                                type="search"
                                                                name="invitees"
                                                                className="form-control text-white j_input ps-4 j_join_text"
                                                                placeholder="Add people by name or email..."
                                                                style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                                                onChange={(e) => {
                                                                    const searchTerm = e.target.value.toLowerCase();
                                                                    const filtered = allusers.filter(user =>
                                                                        user.email.toLowerCase().includes(searchTerm) ||
                                                                        user.name.toLowerCase().includes(searchTerm)
                                                                    );
                                                                    setFilteredUsers(filtered);
                                                                    setShowDropdown(true);
                                                                }}
                                                                onFocus={() => setShowDropdown(true)}
                                                            />
                                                        </div>
                                                        {showDropdown && (
                                                            <div
                                                                ref={dropdownRef}
                                                                className="position-absolute mt-1 B_suggestion"
                                                                style={{
                                                                    backgroundColor: "#202F41",
                                                                    borderRadius: '5px',
                                                                    width: '31%',
                                                                    zIndex: 1000,
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto'
                                                                }}
                                                            >
                                                                {filteredUsers.length > 0 ? (
                                                                    filteredUsers
                                                                        .filter(user => user._id !== userId)
                                                                        .map((user) => (
                                                                            <div
                                                                                key={user._id}
                                                                                className="d-flex align-items-center p-2 cursor-pointer hover-bg-dark"
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    if (!values.invitees.some(invitee => invitee.email === user.email)) {
                                                                                        setFieldValue('invitees', [...values.invitees, {
                                                                                            _id: user._id,
                                                                                            name: user.name,
                                                                                            email: user.email,
                                                                                            photo: user.photo
                                                                                        }]);
                                                                                    }
                                                                                    setShowDropdown(false);
                                                                                }}
                                                                            >
                                                                                <div className="me-2">
                                                                                    {user.photo ? (
                                                                                        <img
                                                                                            src={`${IMG_URL}${user.photo}`}
                                                                                            alt="Profile"
                                                                                            className="rounded-circle"
                                                                                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                            style={{
                                                                                                width: '30px',
                                                                                                height: '30px',
                                                                                                backgroundColor: '#364758',
                                                                                                color: 'white'
                                                                                            }}
                                                                                        >
                                                                                            {/* {user.name.charAt(0).toUpperCase()} */}
                                                                                            {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="text-white">
                                                                                    <div style={{ fontSize: '14px' }}>{user.name}</div>
                                                                                    <div style={{ fontSize: '12px', color: '#8B9CAF' }}>{user.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <div className="p-3 text-center text-white" style={{ fontSize: '14px' }}>
                                                                        No users found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {touched.invitees && errors.invitees && (
                                                            <div style={{ fontSize: '14px', marginTop: '4px', color: '#cd1425' }}>
                                                                {errors.invitees}
                                                            </div>
                                                        )}
                                                        {(values.invitees.length > 0 || userId) && (
                                                            <div className="mt-2">
                                                                {allusers
                                                                    .filter(user => user._id === userId)
                                                                    .map(user => (
                                                                        <div key={user._id} className="d-flex align-items-center mb-1">
                                                                            <div className="j_margin_end">
                                                                                {user.photo ? (
                                                                                    <img
                                                                                        src={`${IMG_URL}${user.photo}`}
                                                                                        alt="Profile"
                                                                                        className="rounded-circle"
                                                                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: '30px',
                                                                                            height: '30px',
                                                                                            backgroundColor: '#364758',
                                                                                            color: 'white'
                                                                                        }}
                                                                                    >
                                                                                        {/* {user.name.charAt(0).toUpperCase()} */}
                                                                                        {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                <span className="text-white" style={{ fontSize: '13.5px' }}>{user.email}</span>
                                                                                <p className="mb-0" style={{ fontSize: '13px', color: '#BFBFBF' }}>Host</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                {values.invitees.map((invitee, index) => (
                                                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className="j_margin_end">
                                                                                {invitee.photo ? (
                                                                                    <img
                                                                                        src={`${IMG_URL}${invitee.photo}`}
                                                                                        alt="Profile"
                                                                                        className="rounded-circle"
                                                                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: '30px',
                                                                                            height: '30px',
                                                                                            backgroundColor: '#364758',
                                                                                            color: 'white'
                                                                                        }}
                                                                                    >
                                                                                        {/* {invitee.name?.charAt(0).toUpperCase()} */}
                                                                                        {invitee.name.charAt(0).toUpperCase()}{invitee.name.split(' ')[1] ? invitee.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="j_margin_start">
                                                                                <span className="text-white" style={{ fontSize: '14px' }}>{invitee.email}</span>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-link text-danger p-0 ms-2"
                                                                            onClick={() => {
                                                                                const newInvitees = values.invitees.filter((_, i) => i !== index);
                                                                                setFieldValue('invitees', newInvitees);
                                                                            }}
                                                                        >
                                                                            <img src={bin} alt="bin" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {values.invitees.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-link text-white p-0"
                                                                style={{
                                                                    fontSize: '14px',
                                                                    textDecoration: 'underline',
                                                                    border: 'none',
                                                                    background: 'none'
                                                                }}
                                                                onClick={() => setFieldValue('invitees', [])}
                                                            >
                                                                Remove all
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ============================ Schedule Meeting custom Modal ============================  */}
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
                                                        <div className="mb-3 flex-fill me-2 j_select_fill">
                                                            <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                id="RepeatType"
                                                                name="customRecurrence.repeatType"
                                                                value={values.customRecurrence.repeatType}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="daily">Daily</option>
                                                                <option value="weekly">Weekly</option>
                                                                <option value="monthly">Monthly</option>
                                                                <option value="yearly">Yearly</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-3 flex-fill j_select_fill">
                                                            <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                                                            <div className='position-relative'>
                                                                <input
                                                                    type="text"
                                                                    className="form-control j_input j_join_text"
                                                                    id="RepeatEvery"
                                                                    name="customRecurrence.repeatEvery"
                                                                    value={values.customRecurrence.repeatEvery}
                                                                    onChange={(e) => setFieldValue('customRecurrence.repeatEvery', e.target.value)}
                                                                />
                                                                <div className="j_custom_icons">
                                                                    <FaAngleUp
                                                                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                        onClick={() => setFieldValue('customRecurrence.repeatEvery', Number(values.customRecurrence.repeatEvery) + 1)}
                                                                    />
                                                                    <FaAngleDown
                                                                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                        onClick={() => setFieldValue('customRecurrence.repeatEvery', Math.max(values.customRecurrence.repeatEvery - 1, 1))}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {values.customRecurrence.repeatType === 'weekly' && (
                                                        <div className="mb-3">
                                                            <label className="form-label text-white j_join_text">Repeat On</label>
                                                            <div className="d-flex B_Repeat_on_btn">
                                                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                                                    <button
                                                                        key={day}
                                                                        className={`btn ${values.customRecurrence.repeatOn.includes(day) ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                                                        onClick={() => {
                                                                            const newDays = values.customRecurrence.repeatOn.includes(day)
                                                                                ? values.customRecurrence.repeatOn.filter(d => d !== day)
                                                                                : [...values.customRecurrence.repeatOn, day];
                                                                            setFieldValue('customRecurrence.repeatOn', newDays);
                                                                        }}
                                                                    >
                                                                        {day.charAt(0)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {values.customRecurrence.repeatType === 'monthly' && (
                                                        <div className="mb-3">
                                                            <label className="text-white j_join_text">Every</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                name="customRecurrence.Monthfirst"
                                                                value={values.customRecurrence.Monthfirst}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="firstmonday">Monthly on first monday</option>
                                                                <option value="firstday">Monthly on first day</option>
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div className="j_schedule_Repeat">
                                                        <div className="mb-3 flex-fill me-2  j_select_fill">
                                                            <label htmlFor="ends" className="form-label text-white j_join_text">Ends</label>
                                                            <select
                                                                className="form-select j_select j_join_text"
                                                                name="customRecurrence.ends"
                                                                value={values.customRecurrence.ends}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="0">Select</option>
                                                                <option value="never">Never</option>
                                                                {values.customRecurrence.repeatType !== 'daily' && <option value="on">On</option>}
                                                                <option value="after">After</option>
                                                            </select>
                                                        </div>

                                                        {values.customRecurrence.ends === "on" && (
                                                            <div className="mb-3 flex-fill j_select_fill">
                                                                <label htmlFor="endDate" className="form-label text-white j_join_text"></label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control j_input j_join_text j_special_m"
                                                                    name="customRecurrence.endDate"
                                                                    value={values.customRecurrence.endDate}
                                                                    onChange={handleChange}
                                                                />
                                                                {touched.customRecurrence?.endDate && errors.customRecurrence?.endDate && (
                                                                    <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.customRecurrence.endDate}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {values.customRecurrence.ends === "after" && (
                                                            console.log(values.customRecurrence.Recurrence),

                                                            <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                                                                <label className="form-label text-white j_join_text"></label>
                                                                <div className='position-relative'>
                                                                    <input
                                                                        type="text"
                                                                        name='customRecurrence.Recurrence'
                                                                        className="form-control j_input j_join_text j_special_m"
                                                                        value={`${values.customRecurrence.Recurrence} Recurrence`}
                                                                        onChange={(e) => setFieldValue('customRecurrence.Recurrence', e.target.value)}
                                                                    />
                                                                    <div className="j_custom_icons">
                                                                        <FaAngleUp
                                                                            style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                            onClick={() => setFieldValue('customRecurrence.Recurrence', Number(values.customRecurrence.Recurrence) + 1)}
                                                                        />
                                                                        <FaAngleDown
                                                                            style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                                                            onClick={() => setFieldValue('customRecurrence.Recurrence', Math.max(values.customRecurrence.Recurrence - 1, 1))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Modal.Footer className="j_custom_footer border-0 p-0 pt-4 pb-3">
                                                        <Button
                                                            variant="outline-light"
                                                            className="j_custom_button fw-semibold"
                                                            onClick={() => { handleCloseScheduleCustomModel(); handleShowScheduleModel() }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="light"
                                                            className="j_custom_button fw-semibold"
                                                            onClick={() => {
                                                                console.log("customRecurrence", values.customRecurrence);
                                                                setFieldValue('customRecurrence', values.customRecurrence);
                                                                handleCloseScheduleCustomModel();
                                                            }}
                                                        >
                                                            Done
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal.Body>
                                            </Modal>
                                        </form>
                                    )}


                                </Formik>
                            </Modal.Body>
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
                        {console.log("inviteData", inviteData)}

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
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '100px' }}>Title</span>
                                        <span className="text-white B_invite_people_text">: {inviteData?.title}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '100px' }}>Time</span>
                                        <span className="text-white B_invite_people_text">: {inviteData?.startTime}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '100px' }}>Duration</span>
                                        <span className="text-white B_invite_people_text">: {calculateDuration(inviteData?.startTime, inviteData?.endTime)}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '100px' }}>Meeting ID</span>
                                        <span className="text-white B_invite_people_text">: {inviteData?.meetingLink}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3 B_invite_people_text_flex">
                                        <span className='B_invite_people_text_span' style={{ color: '#B3AEAE', width: '100px' }}>Password</span>
                                        <span className="text-white B_invite_people_text">: {inviteData?.password || "N/A"}</span>

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
                                    <div className="d-flex flex-column align-items-center">
                                        <Button
                                            variant="light"
                                            className="B_invite_people_btn1"
                                            onClick={() => {

                                                navigator.clipboard.writeText(`${inviteData?.meetingLink}`)
                                                    .then(() => {
                                                        setLinkCopied(true);
                                                        setTimeout(() => setLinkCopied(false), 2000);
                                                    })
                                                    .catch(err => {
                                                        console.error("Failed to copy: ", err);
                                                    });
                                            }}
                                            style={{
                                                padding: '8px 58px',
                                                fontSize: '14px',
                                                color: '#000000'
                                            }}
                                        >
                                            Copy Link
                                        </Button>

                                    </div>

                                </div>
                                {linkCopied && (
                                    <div className="text-success text-end pe-5 me-4  mt-2" style={{ marginTop: '8px', paddingLeft: "40px" }}>
                                        Link is copied!
                                    </div>
                                )}
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


                    </div>
                </div>
            </section >
        </div >
    )
}

export default Meeting;
