import React from 'react'
import HomeNavBar from '../Component/HomeNavBar';
import SideBar from '../Component/SideBar';
import { IoSearchSharp } from 'react-icons/io5';

function Meeting() {
    return (
        <div>
            <HomeNavBar />

            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0">
                        <div className="d-flex justify-content-between B_Meeting_head">

                            <div className="d-flex gap-3">
                                {/* <div className="dropdown">
                                    <button className="btn dropdown-toggle B_dropdown_btn1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Upcoming Meetings
                                    </button>
                                    <ul className="dropdown-menu" style={{ backgroundColor: '#1a1d21', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <li><a className="dropdown-item text-white" href="#">Upcoming Meetings</a></li>
                                        <li><a className="dropdown-item text-white" href="#">Past Meetings</a></li>
                                    </ul>
                                </div> */}

                                <div class="dropdown ">
                                    <button class="btn btn-secondary dropdown-toggle B_dropdown_btn1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Upcoming Meetings
                                    </button>
                                    <ul class="dropdown-menu B_dropdown">
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Upcoming Meetings</a></li>
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Past Meetings</a></li>
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Something else here</a></li>
                                    </ul>
                                </div>
                                <div class="dropdown ">
                                    <button class="btn btn-secondary dropdown-toggle B_dropdown_btn1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Created By Me
                                    </button>
                                    <ul class="dropdown-menu B_dropdown">
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Upcoming Meetings</a></li>
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Past Meetings</a></li>
                                        <li><a class="dropdown-item B_dropdown_item" href="#">Something else here</a></li>
                                    </ul>
                                </div>

                                {/* <div className="dropdown">
                                    <button className="btn dropdown-toggle B_dropdown_btn1" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                    >
                                        Created By Me
                                    </button>
                                    <ul className="dropdown-menu" style={{ backgroundColor: '#1a1d21', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <li><a className="dropdown-item text-white" href="#">Created By Me</a></li>
                                        <li><a className="dropdown-item text-white" href="#">Shared With Me</a></li>
                                    </ul>
                                </div> */}
                            </div>

                            <div className="d-flex gap-4 align-items-center">
                                <div className="position-relative">
                                    {/* <input
                                        type="search"
                                        className="form-control B_Meeting_search"
                                        placeholder="Search..."
                                        style={{ paddingRight: '60px', backgroundColor: '#202F41' }}
                                    /> */}

                                    <input type="text" className="form-control B_Meeting_search"
                                        style={{ paddingRight: '60px', paddingLeft: '35px', backgroundColor: '#202F41', color: "rgb(179, 174, 174)" }}
                                        placeholder="Search..." aria-label="First name" />


                                    {/* <i className="bi bi-search position-absolute top-0 end-3 translate-middle-y text-white"></i> */}
                                    <div className='position-absolute B_Meeting_search_icon text-white'>
                                        <IoSearchSharp style={{ color: 'rgb(179, 174, 174)' }} />
                                    </div>
                                </div>

                                <button className="btn btn-outline-light B_metting_btn">Schedule</button>
                                <button className="btn btn-outline-light B_metting_btn">Meet Now</button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Meeting;
