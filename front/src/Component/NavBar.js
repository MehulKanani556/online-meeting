import React, { useState, useEffect } from 'react'
import logo from '../Image/logo.svg'
import { FiAlignJustify } from "react-icons/fi";
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setauth } from '../Redux/Slice/auth.slice';


function NavBar() {


    const [activeLink, setActiveLink] = useState('')
    const location = useLocation();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            dispatch(setauth(true));
        } else {
            dispatch(setauth(false));
        }
    }, [dispatch]);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveLink('Home');
        else if (path === '/helpcenter') setActiveLink('Help Center');
        else if (path === '/pricing' || path === '/payment') setActiveLink('Pricing');
        else if (path === '/contactus') setActiveLink('Contact Us');
    }, [location]);

    const getPath = (item) => {
        if (item === 'Home') return '/';
        else if (item === 'Help Center') return '/helpcenter';
        else if (item === 'Pricing' || item === 'Payment') return '/pricing';
        else if (item === 'Contact Us') return '/contactus';
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg py-4" >
                <div className="container-fluid ">
                    <Link className="navbar-brand text-white" to={"/"}>
                        <img src={logo} style={{ height: "30px", width: "35 px" }} alt="" />
                    </Link>

                    <button className="navbar-toggler text-white " style={{ boxShadow: "0 0 3px 1px white" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span className="navbar-toggler-icon " style={{ backgroundColor: 'white', height: '25px', width: '25px' }}></span> */}
                        <FiAlignJustify style={{ color: 'white', height: '25px', width: '25px' }} />

                    </button>

                    <div className="collapse navbar-collapse " id="navbarText">

                        <ul className="navbar-nav  me-auto mb-2 mb-lg-0 m-auto gap-lg-5" >
                            {['Home', 'Help Center', 'Pricing', 'Contact Us'].map((item) => (
                                <li className="nav-item" key={item}>
                                    <Link
                                        to={getPath(item)}
                                        className={`nav-link ${activeLink === item ? 'active' : ''} B_UL_text `}
                                        style={{
                                            color: activeLink === item ? 'white' : '#BFBFBF',
                                            borderBottom: activeLink === item ? '2px solid white' : 'none',
                                            paddingBottom: "5px",
                                            width: "fit-content",
                                            fontWeight: "500",
                                        }}
                                        onClick={() => setActiveLink(item)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {isAuthenticated ? (
                            <Link to={'/home'}>
                                <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                                    Get Started
                                </button>
                            </Link>
                        ) : (
                            <Link to={'/login'}>
                                <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                                    Log In
                                </button>
                            </Link>
                        )}


                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;
