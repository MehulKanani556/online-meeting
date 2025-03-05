import React, { useEffect, useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';
import VideoIcon from '../Image/VideoIcon.png';
import { HiOutlineDotsVertical } from "react-icons/hi";


function Meeting() {
    const [meetingType, setMeetingType] = useState("All Meetings");
    const [meetingFilter, setMeetingFilter] = useState("All Meetings");
    const [openDropdownId, setOpenDropdownId] = useState(null); // Add this state

    const handleDotsClick = (meetingId, event) => {
        event.stopPropagation(); // Prevent event bubbling
        setOpenDropdownId(openDropdownId === meetingId ? null : meetingId);
    };

    // Add click handler to close dropdown when clicking outside
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
                                            <div className="position-absolute end-0 mt-2 py-2 bg-dark rounded shadow-lg"
                                                style={{ minWidth: '150px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Edit
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
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
                                            <div className="position-absolute end-0 mt-2 py-2 bg-dark rounded shadow-lg"
                                                style={{ minWidth: '150px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Edit
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
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
                                            <div className="position-absolute end-0 mt-2 py-2 bg-dark rounded shadow-lg"
                                                style={{ minWidth: '150px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Edit
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
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
                                            <div className="position-absolute end-0 mt-2 py-2 bg-dark rounded shadow-lg"
                                                style={{ minWidth: '150px', zIndex: 1000 }}>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Start
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Edit
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                                                    Cancel
                                                </button>
                                                <button className="dropdown-item text-white px-3 py-1 hover-bg-secondary"
                                                    style={{ backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
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

        return null;
    };

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
                                    <ul className="dropdown-menu B_dropdown">
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
                                    <ul className="dropdown-menu B_dropdown B_dropdown1">
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
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Meeting;
