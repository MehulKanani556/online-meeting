import React, { useState } from 'react'
import forgetpassword from '../Image/forgetpassword.png'
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        navigate('/otpVerification')
    };
    return (
        <div>
            <section className='j_pass_center' style={{ backgroundColor: "#060A11" }}>
                <div className='container_new'>
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12 d-flex justify-content-center j_col_img">
                            <img src={forgetpassword} alt="forget password img" className='j_login_img' />
                        </div>
                        <div className="col-md-6 col-12 d-flex justify-content-center j_form_div">
                            <div className="signin-container">
                                <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>Forget Password</h1>
                                <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>Enter your email below to recover your password</p>
                                <form onSubmit={handleSubmit}>
                                    <label className='j_label'>
                                        Email
                                        <input
                                            type="email"
                                            className='form-control j_input'
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        // required
                                        />
                                    </label>
                                    <button className='j_Code_button' type="submit">Send Code</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgetPassword