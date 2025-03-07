import React, { useEffect, useState, useRef } from 'react'
import logo from '../Image/logo.svg'
import bell from '../Image/j_bell.svg'
import camera from '../Image/j_camera.svg'
import notification from '../Image/j_Navbar_bell.svg'
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { logout, logoutUser, setauth } from '../Redux/Slice/auth.slice'
import pencil from '../Image/j_profile_pencile.svg'
import { getUserById, updateUser, removeUserProfilePic } from '../Redux/Slice/user.slice'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import langs from 'langs';
import moment from 'moment-timezone';
import { Modal, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import { IMAGE_URL } from '../Utils/baseUrl'

function HomeNavBar() {

    const dispatch = useDispatch();
    const languages = langs.all();
    const timeZoneOptions = moment.tz.names();
    const userId = sessionStorage.getItem('userId')
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const currUser = useSelector((state) => state.user.currUser);
    const [showPass, setShowPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showNewconPass, setShowNewconPass] = useState(false)
    const [changeprofileshow, setchangeprofileshow] = useState(false);
    const [profileshow, setprofileShow] = useState(false);
    const [logoutShow, setlogoutShow] = useState(false);
    const [passwordShow, setpasswordShow] = useState(false);
    const [showcanvas, setshowcanvas] = useState(false);
    const [showProfilePicOptions, setshowProfilePicOptions] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);
    const IMG_URL = IMAGE_URL

    const handleprofileshow = () => setprofileShow(true)
    const handleprofileclose = () => setprofileShow(false)
    const handlelogoutshow = () => setlogoutShow(true)
    const handlelogoutclose = () => setlogoutShow(false)
    const handlepasswordshow = () => setpasswordShow(true)
    const handlepasswordclose = () => setpasswordShow(false)
    const handlechangeprofileClose = () => setchangeprofileshow(false);
    const handlechangeprofileShow = () => setchangeprofileshow(true);
    const handleshowcanvas = () => setshowcanvas(true)
    const handleClosecanvas = () => setshowcanvas(false)
    const handleProfilePicClick = () => setshowProfilePicOptions(true)
    const handleCloseProfilePicOptions = () => setshowProfilePicOptions(false)

    useEffect(() => {
        dispatch(getUserById(userId))
    }, [userId])

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            dispatch(setauth(true));
        } else {
            dispatch(setauth(false));
        }
    }, [dispatch]);

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

    const handleEditUser = async (values) => {
        try {
            await dispatch(updateUser({ id: currUser._id, values, file: uploadedFile }));
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditprofile = async (values) => {
        try {
            await dispatch(updateUser({ id: currUser._id, file: uploadedFile, values }));
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveProfilePic = async () => {
        if (currUser.photo) {
            await dispatch(removeUserProfilePic(currUser._id));
            setUploadedFile(null); // Clear the uploaded file state
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg j_nav_padding" style={{ backgroundColor: '#121B26' }} >
                <div className="container-fluid p-0">
                    <a className="navbar-brand text-white" href="#">
                        <img src={logo} style={{ height: "30px", width: "35 px" }} alt="" />
                    </a>

                    <div className="d-flex align-items-center">
                        <button className="btn border-0" type="button" onClick={handleshowcanvas}>
                            <img src={bell} alt="Bell" style={{ height: '22px', width: '22px' }} />
                        </button>
                        {isAuthenticated ? (
                            <Dropdown>
                                <Dropdown.Toggle className="btn btn-secondary j_homenav_dropdown j_remove_icon" id="dropdown-basic">
                                    {currUser?.photo ? (
                                        // `${currUser?.photo}`
                                        <img
                                            src={`${IMG_URL}${currUser.photo}`}
                                            alt="Profile"
                                            className="object-fill w-full h-full"
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: '0' }}
                                        />
                                    ) : (
                                        `${currUser?.name?.charAt(0)}${currUser?.name?.split(' ')[1]?.charAt(0)}`
                                    )}
                                    {/* {currUser?.name?.charAt(0)}{currUser?.name?.split(' ')[1]?.charAt(0)} */}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="j_drop_menu" drop="down-centered">
                                    <Dropdown.Item className="j_drop_item" onClick={(event) => { event.preventDefault(); handleprofileshow(); }}>My Profile</Dropdown.Item>
                                    <Dropdown.Item className="j_drop_item" onClick={(event) => { event.preventDefault(); handlepasswordshow(); }}>Change Password</Dropdown.Item>
                                    <Dropdown.Item className="j_drop_item" onClick={(event) => { event.preventDefault(); handlelogoutshow(); }}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
            <Modal show={profileshow} onHide={handleprofileclose} className='j_Modal_backcolor' centered>
                <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
                    <Modal.Title className='j_modal_header_text text-white'>Edit Profile</Modal.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handleprofileclose} />
                </Modal.Header>
                <div className="j_modal_header"></div>
                <Modal.Body>
                    <div className="j_profile">
                        <div className="j_profile_icon">
                            <p className='j_profile_short' style={{ padding: currUser?.photo ? '0px' : '5px' }}>
                                {currUser?.photo ? (
                                    // `${currUser?.photo}`
                                    <img
                                        src={`${IMG_URL}${currUser.photo}`}
                                        alt="Profile"
                                        className="object-fill w-full h-full"
                                        style={{ width: '50px', height: '50px', borderRadius: '50%', padding: '0' }}
                                    />
                                ) : (
                                    `${currUser?.name?.charAt(0)}${currUser?.name?.split(' ')[1]?.charAt(0)}`
                                )}
                            </p>
                            <div className="j_profile_name text-white">
                                <p className='mb-0'>{currUser?.name}</p>
                                <span>{currUser?.email}</span>
                            </div>
                        </div>
                        <button className="btn j_profile_btn" onClick={handlechangeprofileShow}>
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
                            <ul>:&nbsp;&nbsp; {currUser?.displayName || currUser?.name}</ul>
                            <ul>:&nbsp;&nbsp; {currUser?.email}</ul>
                            <ul>:&nbsp;&nbsp; {currUser?.language}</ul>
                            <ul>:&nbsp;&nbsp; {currUser?.timeZone}</ul>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ============== Edit profile ============= */}
            <Modal show={changeprofileshow} onHide={handlechangeprofileClose} className='j_Modal_backcolor' centered>
                <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
                    <Modal.Title className='text-white j_modal_header_text'>Edit Profile</Modal.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handlechangeprofileClose} />
                </Modal.Header>
                <div className="j_modal_header"></div>
                <Modal.Body>
                    <div className="j_change_short position-relative" onClick={handleProfilePicClick} style={{ padding: currUser?.photo ? '0px' : '15px' }}>
                        {/* {currUser?.name?.charAt(0)}{currUser?.name?.split(' ')[1]?.charAt(0)} */}
                        {currUser?.photo ? (
                            <img
                                src={`${IMG_URL}${currUser.photo}`}
                                alt="Profile"
                                className="object-fill w-full h-full"
                                style={{ width: '70px', height: '70px', borderRadius: '50%', padding: '0' }}
                            />
                        ) : (
                            `${currUser?.name?.charAt(0)}${currUser?.name?.split(' ')[1]?.charAt(0)}`
                        )}
                        <div className="j_cameraa d-flex justify-content-center align-items-center">
                            <img src={camera} alt="camera" className='j_cameraa_img' />
                        </div>
                    </div>
                    <Formik
                        initialValues={{
                            name: currUser?.name,
                            displayName: currUser?.displayName,
                            email: currUser?.email,
                            language: currUser?.language,
                            timeZone: currUser?.timeZone,
                            photo: currUser?.photo || null
                        }}
                        onSubmit={handleEditUser}
                    >
                        {({ handleChange, handleBlur, values, setFieldValue }) => {
                            const handleLanguageChange = (event) => {
                                const selectedLanguage = event.target.value;
                                setFieldValue("language", selectedLanguage);
                            };

                            return (
                                <Form enctype="multipart/form-data">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label text-white j_join_text">Full Name</label>
                                        <input type="text" className="form-control j_input j_join_text" id="name" name="name" onChange={handleChange} value={values.name} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="displayName" className="form-label text-white j_join_text">Display Name</label>
                                        <input type="text" className="form-control j_input j_join_text" id="displayName" name="displayName" onChange={handleChange} value={values.displayName} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label text-white j_join_text">Email</label>
                                        <input type="email" className="form-control j_input j_join_text" id="email" name="email" value={values.email} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="language" className="form-label text-white j_join_text">Language</label>
                                        <select className="form-select j_select j_join_text" id="language" name="language" onChange={handleLanguageChange} value={values.language}>
                                            <option value='0'>select</option>
                                            {languages.map((language, index) => (
                                                <option key={index} value={language['name']}>
                                                    {language.name} ({language.local})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="timeZone" className="form-label text-white j_join_text" >Time Zone</label>
                                        <select className="form-select j_select j_join_text" id="timeZone" name="timeZone" onChange={handleChange} value={values.timeZone}>
                                            <option value=''>Select Time Zone</option>
                                            {timeZoneOptions.map((tz, index) => {
                                                const offset = moment.tz(tz).utcOffset();
                                                const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
                                                const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
                                                const sign = offset >= 0 ? '+' : '-';
                                                const offsetString = `(GMT ${sign}${hours}:${minutes})`;

                                                const fullName = moment.tz(tz).zoneName();

                                                return (
                                                    <option key={index} value={tz}>
                                                        {offsetString} {fullName} ({tz})
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <Modal.Footer className='border-0 justify-content-center'>
                                        <Button variant="outline-light" className="btn outline-light j_custom_button fw-semibold" onClick={handlechangeprofileClose}>
                                            Cancel
                                        </Button>
                                        <Button className="btn btn-light j_custom_button fw-semibold" type="submit" onClick={() => { handlechangeprofileClose(); handleprofileclose(); }}>
                                            Update
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            {/*Upload Media and Remove Pic */}
            <Modal show={showProfilePicOptions} onHide={handleCloseProfilePicOptions} className='j_Modal_backcolor' centered>
                <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
                    <Modal.Title className='text-white j_modal_header_text'>Profile Picture Options</Modal.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handleCloseProfilePicOptions} />
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            photo: currUser?.photo || null
                        }}
                        onSubmit={handleEditprofile}
                    >
                        {({ values, setFieldValue }) => {
                            const handleUploadMedia = (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const fileURL = URL.createObjectURL(file);
                                    setUploadedFile(file);
                                    setFieldValue("photo", fileURL);
                                }
                            };

                            return (
                                <Form enctype="multipart/form-data">
                                    {uploadedFile ? (
                                        <div className="" style={{ textAlign: 'center', marginBottom: '10px' }}>
                                            <img src={`${values.photo}`} alt="User Image" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: '0' }} />
                                        </div>
                                    ) : (
                                        <p className='j_profile_short' style={{ margin: '0 auto 10px', padding: currUser?.photo ? '0px' : '5px' }}>
                                            {currUser?.photo ? (
                                                <img
                                                    src={`${IMG_URL}${currUser.photo}`}
                                                    alt="Profile"
                                                    className="object-fill w-full h-full"
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', padding: '0' }}
                                                />
                                            ) : (
                                                `${currUser?.name?.charAt(0)}${currUser?.name?.split(' ')[1]?.charAt(0)}`
                                            )}
                                        </p>
                                    )}
                                    <div className="j_image_Upload">
                                        <input
                                            type="file"
                                            className="d-none"
                                            id="fileUpload"
                                            ref={fileInputRef}
                                            onChange={handleUploadMedia}
                                        />
                                        <Button
                                            variant="outline-light"
                                            className="j_Upload_Btn"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            Upload Media
                                        </Button>
                                        <Button variant="outline-light" className="j_Upload_Btn" onClick={() => { handleRemoveProfilePic(); handleCloseProfilePicOptions(); handlechangeprofileClose(); handleprofileclose(); }}>
                                            Remove Pic
                                        </Button>
                                    </div>
                                    <Modal.Footer className='border-0 justify-content-center'>
                                        <Button variant="outline-light" className="btn btn-outline-light j_custom_button fw-semibold" onClick={handleCloseProfilePicOptions}>
                                            Cancel
                                        </Button>
                                        <Button className="btn btn-light j_custom_button fw-semibold" type="submit" onClick={() => { handleCloseProfilePicOptions(); handlechangeprofileClose(); handleprofileclose(); }}>
                                            Submit
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>

            {/* ============== change password ============= */}
            <Modal show={passwordShow} onHide={handlepasswordclose} className='j_Modal_backcolor' centered>
                <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
                    <Modal.Title className='text-white j_modal_header_text'>Change Password</Modal.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handlepasswordclose} />
                </Modal.Header>
                <div className="j_modal_header"></div>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="OldPassword" className="form-label text-white">Old Password</label>
                            <div className="position-relative">
                                <input type={showPass ? "text" : "password"} className="form-control j_input" id="OldPassword" name="OldPassword" placeholder='Old Password' />
                                <div onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                    {showPass ? <IoEye color='white' /> : <IoEyeOff color='white' />}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="NewPassword" className="form-label text-white">New Password</label>
                            <div className="position-relative">
                                <input type={showNewPass ? "text" : "password"} className="form-control j_input" id="NewPassword" name="NewPassword" placeholder='New Password' />
                                <div onClick={() => setShowNewPass(!showNewPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                    {showNewPass ? <IoEye color='white' /> : <IoEyeOff color='white' />}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="CNPassword" className="form-label text-white">Confirm New Password</label>
                            <div className="position-relative">
                                <input type={showNewconPass ? "text" : "password"} className="form-control j_input" id="CNPassword" name="CNPassword" placeholder='Confirm New Password' />
                                <div onClick={() => setShowNewconPass(!showNewconPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                    {showNewconPass ? <IoEye color='white' /> : <IoEyeOff color='white' />}
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    <Button variant="outline-light" className="btn btn-outline-light j_custom_button fw-semibold" onClick={handlepasswordclose}>
                        Cancel
                    </Button>
                    <Button className="btn btn-light j_custom_button fw-semibold" type="submit" onClick={() => { handlepasswordclose() }}>
                        Change Password
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* =========================== Notification =========================== */}
            <Offcanvas show={showcanvas} onHide={handleClosecanvas} placement='end' className='j_canvas_backcolor'>
                <Offcanvas.Header className='d-flex justify-content-between align-items-center'>
                    <Offcanvas.Title className='text-white j_modal_header_text'>Notification</Offcanvas.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handleClosecanvas} />
                </Offcanvas.Header>
                <Offcanvas.Body className='j_notification'>
                    <div className="text-center">
                        <img src={notification} alt="notification" className='j_notification_bell' />
                    </div>
                    <div className="j_null_notification">
                        <p className='mb-0 text-white text-center'>No Notification</p>
                        <p className='mb-0 text-white text-center'>Nothing to see here - stay tuned for updates</p>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* ================= log Out ====================== */}
            <Modal show={logoutShow} onHide={handlelogoutclose} className='j_Modal_backcolor' centered>
                <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
                    <Modal.Title className='text-white j_modal_header_text'>Logout</Modal.Title>
                    <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handlelogoutclose} />
                </Modal.Header>
                <div className="j_modal_header"></div>
                <Modal.Body>
                    <p className='j_logout_p text-white text-center'>Are you sure you want to logout from your account?</p>
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    <Button variant="outline-light" className="btn btn-outline-light j_custom_button fw-semibold" onClick={handlelogoutclose}>
                        Cancel
                    </Button>
                    <Button className="btn btn-light j_custom_button fw-semibold" type="submit" onClick={() => { handleLogout(); handlelogoutclose() }}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default HomeNavBar;