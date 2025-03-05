import React, { useEffect } from 'react'
import logo from '../Image/logo.svg'
import bell from '../Image/j_bell.svg'
import notification from '../Image/j_Navbar_bell.svg'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { logout, logoutUser, setauth } from '../Redux/Slice/auth.slice'
import pencil from '../Image/j_profile_pencile.svg'
import { getUserById } from '../Redux/Slice/user.slice'
import { Link } from 'react-router-dom'

function HomeNavBar() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userId = sessionStorage.getItem('userId')
    const currUser = useSelector((state) => state.user.currUser);

    useEffect(() => {
        dispatch(getUserById(userId))
    }, [userId])

    const handleLogout = async () => {
        try {
            if (userId) {
                await dispatch(logoutUser(userId));
            }
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("token");
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            dispatch(setauth(true));
        } else {
            dispatch(setauth(false));
        }
    }, [dispatch]);

    return (
        <div>
            <nav className="navbar navbar-expand-lg j_nav_padding" style={{ backgroundColor: '#121B26' }} >
                <div className="container-fluid p-0">
                    <a className="navbar-brand text-white" href="#">
                        <img src={logo} style={{ height: "30px", width: "35 px" }} alt="" />
                    </a>

                    <div className="d-flex align-items-center">
                        <button className="btn border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                            <img src={bell} alt="Bell" style={{ height: '22px', width: '22px' }} />
                        </button>
                        {isAuthenticated ? (
                            <div className="dropdown">
                                <button className="btn btn-secondary j_homenav_dropdown" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    {currUser?.name?.charAt(0)}{currUser?.name?.split(' ')[1]?.charAt(0)}
                                </button>
                                <ul className="dropdown-menu j_drop_menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <a className="dropdown-item j_drop_item" href="#" data-bs-toggle="modal" data-bs-target="#myprofile">My Profile</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item j_drop_item" href="#">Change Password</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item j_drop_item" href="#" onClick={(event) => { event.preventDefault(); handleLogout(); }} >Logout</a>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link to={"/login"}>
                                <button className="btn btn-outline-light j_nav_btn">
                                    Log In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav >

            {/* ============= My profile Modal ============= */}
            <div className="modal fade" id="myprofile" tabindex="-1" aria-labelledby="myprofileLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: '#12161C' }}>
                        <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                            <h5 className="modal-title text-white" id="myprofileLabel">Profile</h5>
                            <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="j_modal_header"></div>
                        <div className="modal-body">
                            <div className="j_profile">
                                <div className="j_profile_icon">
                                    <p className='m-0 j_profile_short'>
                                        {currUser?.name?.charAt(0)}{currUser?.name?.split(' ')[1]?.charAt(0)}
                                    </p>
                                    <div className="j_profile_name text-white">
                                        <p className='mb-0'>{currUser?.name}</p>
                                        <span>{currUser?.email}</span>
                                    </div>
                                </div>
                                <button className="btn j_profile_btn" data-bs-toggle="modal" data-bs-target="#changeprofile">
                                    <img src={pencil} alt="pencil" style={{ marginRight: '5px' }} />Edit
                                </button>
                            </div>
                            <div className="j_my_profile">
                                <div className="j_static_data" style={{ color: '#BFBFBF' }}>
                                    <ul>Display Name&nbsp;&nbsp;&nbsp;&nbsp;</ul>
                                    <ul>Email&nbsp;&nbsp;&nbsp;&nbsp;</ul>
                                    <ul>Language&nbsp;&nbsp;&nbsp;&nbsp;</ul>
                                    <ul>Time Zone&nbsp;&nbsp;&nbsp;&nbsp;</ul>
                                </div>
                                <div className="j_dynamic_data text-white">
                                    <ul>:&nbsp;&nbsp; {currUser?.name}</ul>
                                    <ul>:&nbsp;&nbsp; {currUser?.email}</ul>
                                    <ul>:&nbsp;&nbsp; English (United States)</ul>
                                    <ul>:&nbsp;&nbsp; (GMT +05:30)  India Standard Time (Asia/Kolkata)</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============== changeprofile ============= */}
            <div className="modal fade" id="changeprofile" tabindex="-1" aria-labelledby="changeprofileLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: '#12161C' }}>
                        <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                            <h5 className="modal-title text-white" id="changeprofileLabel">Edit Profile</h5>
                            <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="j_modal_header"></div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label text-white">Full Name</label>
                                    <input type="text" className="form-control j_input" id="fullName" value={currUser?.name} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="displayName" className="form-label text-white">Display Name</label>
                                    <input type="text" className="form-control j_input" id="displayName" defaultValue="John Kumar 123" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label text-white">Email</label>
                                    <input type="email" style={{ opacity: '0.5' }} className="form-control j_input" id="email" value={currUser?.email} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="language" className="form-label text-white">Language</label>
                                    <select className="form-select j_select" id="language">
                                        <option value='0'>select</option>
                                        <option value='1'>English (United States)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="timeZone" className="form-label text-white">Time Zone</label>
                                    <select className="form-select j_select" id="timeZone">
                                        <option value='0'>select</option>
                                        <option value='1'>(GMT +05:30) India Standard Time (Asia/Kolkata)</option>
                                        <option value='2'>(GMT +01:00) Middle europe Time (MET)</option>
                                        <option value='3'>(GMT -07:00) Mountain Standard Time (America/Fort_Nelson)</option>
                                        <option value='4'>(GMT +10:30) Australian Central Daylight Time (Australia/Broken_Hill)</option>
                                        <option value='5'>(GMT +02:00) Eastern European Standard Time (Europe/Riga)</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >

            {/* =========================== Notification =========================== */}
            <div div className="offcanvas offcanvas-end" tabIndex={- 1
            } id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ backgroundColor: '#12161C' }}>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 className="offcanvas-title text-white" id="offcanvasRightLabel">Notification</h5>
                    <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="j_modal_header"></div>
                <div className="offcanvas-body j_notification">
                    <div className="text-center">
                        <img src={notification} alt="notification" className='j_notification_bell' />
                    </div>
                    <div className="j_null_notification">
                        <p className='mb-0 text-white text-center'>No Notification</p>
                        <p className='mb-0 text-white text-center'>Nothing to see here - stay tuned for updates</p>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default HomeNavBar