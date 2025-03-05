import React from 'react'
import logo from '../Image/logo.svg'
import bell from '../Image/j_bell.svg'
import notification from '../Image/j_Navbar_bell.svg'
import { IoClose } from 'react-icons/io5'

function HomeNavBar() {

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
                        <button className="btn btn-outline-light j_nav_btn">
                            Log In
                        </button>
                    </div>
                </div>
            </nav>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ backgroundColor: '#12161C' }}>
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
            </div>

        </div >
    )
}

export default HomeNavBar