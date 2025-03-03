import React, { useState } from 'react'
import { IoEye, IoEyeOff } from "react-icons/io5";
import login from '../Image/login.png'
import google_login from '../Image/google_login.svg'
import facebook_login from '../Image/facebook_login.svg'
import OTP from '../Image/OTP.png'
import forgetpassword from '../Image/forgetpassword.png'
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginuser } from '../Redux/Slice/auth.slice';

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [compassword, setcomPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [forgotPasswordStep, setforgotPasswordStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [showcomPass, setShowcomPass] = useState(false)

  const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isSignIn) {
  //     console.log("Name:", name, 'Email:', email, 'Password:', password, 'compassword:', compassword);
  //   } else {
  //     if (password !== compassword) {
  //       alert("Passwords do not match!");
  //       return;
  //     }
  //     console.log("Name:", name, 'Email:', email, 'Password:', password, 'compassword:', compassword);
  //   }
  // };

  return (
    <div>

      {forgotPasswordStep === 0 && (
        <section className='j_login_center' style={{ backgroundColor: "#060A11" }}>
          <div className='container_new'>
            <div className="row align-items-center">
              <div className="col-md-6 col-12 d-flex justify-content-center j_col_img">
                <img src={login} alt="login img" className='j_login_img' />
              </div>
              {isSignIn ? (
                <div className="col-md-6 col-12 d-flex justify-content-center j_form_div">
                  <div className="signin-container">
                    <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>Sign In</h1>
                    <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>Login to your existing account to access your account</p>
                    <Formik
                      initialValues={{ email: '', password: '', showPass: false }}
                      validationSchema={signInSchema}
                      onSubmit={(values) => {
                        dispatch(loginuser(values)).then((response) => {
                          if (response.payload.status == 200) navigate('/home');
                        });
                      }}
                    >
                      {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                          <label className='j_label'>
                            Email
                            <Field
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={values.email}
                              onChange={handleChange}
                              className="form-control j_input"
                            />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                          </label>
                          <label className='j_label mt-2'>
                            Password
                            <div className='position-relative'>
                              <Field
                                name="password"
                                className='form-control j_input'
                                type={showPass ? "text" : "password"}
                                placeholder="Enter Password"
                                value={values.password}
                                onChange={handleChange}
                                required
                              />
                              <div onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                {showPass ? <IoEye /> : <IoEyeOff />}
                              </div>
                            </div>
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </label>

                          <div className="j_forget_pass">
                            <a onClick={() => { setforgotPasswordStep(1) }} style={{ cursor: 'pointer' }}>Forgot Password?</a>
                          </div>
                          <button className='j_Login_button' type="submit">Sign In</button>
                        </Form>
                      )}
                    </Formik>
                    <div className="OR-login">
                      <div className="j_border_center_left"></div>
                      <span>OR</span>
                      <div className="j_border_center_right"></div>
                    </div>
                    <div className="social-login">
                      <div className="row">
                        <div className="col-md-6 col-12 j_col_pad">
                          <div className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={google_login} alt="google_login" className='google_login' />
                            <button className='j_google_social'>Google</button>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 j_col_pad2">
                          <div className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={facebook_login} alt="google_login" className='google_login' />
                            <button className='j_google_social'>Facebook</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className='j_login_p'>Don't have an account? <a style={{ cursor: 'pointer' }} className='text-decoration-none text-white' onClick={() => setIsSignIn(false)}>Sign Up</a></p>
                  </div>
                </div>
              ) : (
                <div className="col-md-6 col-12 d-flex justify-content-center j_form_div2">
                  <div className="signin-container">
                    <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>Sign Up</h1>
                    <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>One click away from seamless meetings! - Signup now</p>
                    <Formik
                      initialValues={{
                        name: '', email: '', password: '', compass: '', showPass: false
                      }}
                      validationSchema={signInSchema}
                      onSubmit={(values) => {
                        dispatch(loginuser(values)).then((response) => {
                          if (response.payload.status == 200) navigate('/home');
                        });
                      }}
                    >
                      {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                          <label className='j_label'>
                            Name
                            <input
                              type="text"
                              className='form-control j_input'
                              placeholder="Enter Name"
                              value={values.name}
                              onChange={handleChange}
                              required
                            />
                          </label>
                          <label className='j_label'>
                            Email
                            <input
                              type="email"
                              className='form-control j_input'
                              placeholder="Enter Email"
                              value={values.email}
                              onChange={handleChange}
                              required
                            />
                          </label>
                          <label className='j_label'>
                            Create Password
                            <div className="password-container" style={{ position: 'relative' }}>
                              <input
                                className='form-control j_input'
                                type={showPass ? "text" : "password"}
                                placeholder="Create password"
                                value={values.password}
                                onChange={handleChange}
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
                                value={values.compassword}
                                onChange={handleChange}
                                required
                              />
                              <div onClick={() => setShowcomPass(!showcomPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                {showcomPass ? <IoEye /> : <IoEyeOff />}
                              </div>
                            </div>
                          </label>
                          <button className='j_signup_button' type="submit">Sign Up</button>
                        </Form>
                      )}
                    </Formik>
                    <div className="OR-login">
                      <div className="j_border_center_left"></div>
                      <span>OR</span>
                      <div className="j_border_center_right"></div>
                    </div>
                    <div className="social-login">
                      <div className="row">
                        <div className="col-md-6 col-12 j_col_pad">
                          <div className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={google_login} alt="google_login" className='google_login' />
                            <button className='j_google_social'>Google</button>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 j_col_pad2">
                          <div className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={facebook_login} alt="google_login" className='google_login' />
                            <button className='j_google_social'>Facebook</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className='j_login_p'>Already have an account? <a style={{ cursor: 'pointer' }} className='text-decoration-none text-white' onClick={() => setIsSignIn(true)}>Sign In</a></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )
      }

      {/* Forget Password */}
      {/* {forgotPasswordStep === 1 && (
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
                    <button onClick={() => { setforgotPasswordStep(2) }} className='j_Code_button' type="submit">Send Code</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* OTP */}
      {/* {forgotPasswordStep === 2 && (
        <section className='j_pass_center' style={{ backgroundColor: "#060A11" }}>
          <div className='container_new'>
            <div className="row align-items-center">
              <div className="col-md-6 col-12 d-flex justify-content-center j_col_img">
                <img src={OTP} alt="OTP img" className='j_login_img' />
              </div>
              <div className="col-md-6 col-12 d-flex justify-content-center j_form_div">
                <div className="signin-container">
                  <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>OTP Verification</h1>
                  <p style={{ marginBottom: '20px', fontSize: '14px', color: '#BFBFBF' }}>Enter verification code we've just sent you on {email}</p>
                  <form onSubmit={handleSubmit}>
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
                    <button onClick={() => { setforgotPasswordStep(3) }} className='j_Code_button' type="submit">Verify</button>
                  </form>
                  <p className='j_login_p'>Didn't received code? <a style={{ cursor: 'pointer' }} className='text-white'>Resend</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* new pass */}
      {/* {forgotPasswordStep === 3 && (
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
      )} */}
    </div >
  )
}

export default Login;
