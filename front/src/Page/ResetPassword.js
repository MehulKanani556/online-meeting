import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import OTP from '../Image/OTP.png'
import { IoEye, IoEyeOff } from 'react-icons/io5';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [compassword, setcomPassword] = useState('');
    const [showPass, setShowPass] = useState(false)
    const [showcomPass, setShowcomPass] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Password:', password, 'compassword:', compassword);
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
                                <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>Reset Password</h1>
                                <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>Your new password must be unique from
                                    those previously used.</p>
                                <form onSubmit={handleSubmit}>
                                    <label className='j_label'>
                                        New Password
                                        <div className="password-container" style={{ position: 'relative' }}>
                                            <input
                                                className='form-control j_input'
                                                type={showPass ? "text" : "password"}
                                                placeholder="Create password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <div onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                                {showPass ? <IoEye /> : <IoEyeOff />}
                                            </div>
                                        </div>
                                    </label>
                                    <label className='j_label'>
                                        Confirm Password
                                        <div className="password-container" style={{ position: 'relative' }}>
                                            <input
                                                className='form-control j_input'
                                                type={showcomPass ? "text" : "password"}
                                                placeholder="Enter confirm password"
                                                value={compassword}
                                                onChange={(e) => setcomPassword(e.target.value)}
                                                required
                                            />
                                            <div onClick={() => setShowcomPass(!showcomPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                                {showcomPass ? <IoEye /> : <IoEyeOff />}
                                            </div>
                                        </div>
                                    </label>
                                    <button className='j_Code_button' type="submit">Reset Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPassword