import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import OTP from '../Image/OTP.png'

function OTPVerification() {
    const [email, setEmail] = useState('example@gmail.com');
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        navigate('/resetpassword')
    };
    return (
        <div>
            <section className='j_pass_center' style={{ backgroundColor: "#060A11" }}>
                <div className='container_new'>
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12 d-flex justify-content-center j_col_img">
                            <img src={OTP} alt="OTP img" className='j_login_img' />
                        </div>
                        <div className="col-md-6 col-12 d-flex justify-content-center j_form_div">
                            <div className="signin-container">
                                <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>OTP Verification</h1>
                                <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>Enter verification code we’ve just sent you on {email}</p>
                                <form onSubmit={handleSubmit}>
                                    {/* <div className="otp-inputs">
                                        {Array(6).fill().map((_, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="otp-input"
                                                style={{ margin: '0 5px', textAlign: 'center' }}
                                            />
                                        ))}
                                    </div> */}
                                    <div className="otp-inputs">
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            style={{ margin: '0 5px', textAlign: 'center' }}
                                        />
                                    </div>
                                    <button className='j_Code_button' type="submit">Verify</button>
                                </form>
                                <p className='j_login_p'>Didn’t received code? <a style={{ cursor: 'pointer' }} className='text-white'>Resend</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OTPVerification