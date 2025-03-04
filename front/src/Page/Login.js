import React, { useEffect, useRef, useState } from 'react'
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
import { forgotPassword, googleLogin, loginuser, resetPassword, verifyOtp } from '../Redux/Slice/auth.slice';
import { createUser } from '../Redux/Slice/user.slice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const OTPInput = ({ length = 6, onComplete, resendTimer, setResendTimer, handleVerifyOTP, email }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);

    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);

      if (pastedData.length === length) {
        onComplete?.(pastedData);
      }
      // Focus last filled input or first empty input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== length) {
      setError('Please enter the complete OTP.');
      return;
    }
    setError('');
    try {
      const response = await dispatch(verifyOtp({ email: email, otp: otpValue }));
      console.log(response);
      if (response.payload.status === 200) {
        handleVerifyOTP(otpValue);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (error) {
      setError('Error verifying OTP. Please try again.');
    }
  };

  return (
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
                <div className="flex justify-center space-x-2 pb-3">
                  {otp.map((digit, index) => (
                    <input
                      type="text"
                      maxLength="1"
                      className="otp-input"
                      key={index}
                      ref={(ref) => inputRefs.current[index] = ref}
                      style={{ margin: '0 5px', textAlign: 'center' }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
                {error && <div className="text-center mt-1" style={{ color: '#cd1425', fontSize: '14px' }}>{error}</div>}
                <button className='j_Code_button' type="submit">Verify</button>
              </form>
              <p className='j_login_p'>Didn't received code? <a type="button" style={{ cursor: 'pointer' }} className='text-white'>Resend</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [resendTimer, setResendTimer] = useState(60);
  const [email, setEmail] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [forgotPasswordStep, setforgotPasswordStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showcomPass, setShowcomPass] = useState(false)
  const [showNewcomPass, setShowNewcomPass] = useState(false)

  const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const signUpSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
    compassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], "Password and Confirm Password not match"),
  });

  const handleSendOTP = () => {
    setforgotPasswordStep(2);
  };

  const handleVerifyOTP = () => {
    setforgotPasswordStep(3);
  };

  const handleChangePassword = (values) => {
    console.log(values);
    const { newPassword } = values;
    dispatch(resetPassword({ newPassword, email })).then((response) => {
      console.log(response)
      if (response.payload.status == 200) {
        setforgotPasswordStep(0);
      }
    });
  };

  return (
    <div>
      {forgotPasswordStep === 0 && (
        <section className='j_login_center' style={{ backgroundColor: "#060A11" }}>
          <div className='B_container_new'>
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
                          if (response.payload.status == 200) navigate('/');
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
                            <ErrorMessage name="email" component="div" style={{ color: '#cd1425' }} />
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
                            <ErrorMessage name="password" component="div" style={{ color: '#cd1425' }} />
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
                          <GoogleLogin
                            onSuccess={response => {
                              const { name, email, sub: uid } = jwtDecode(response.credential);
                              console.log(name, email, uid);

                              dispatch(googleLogin({ uid, name: name, email })).then((response) => {
                                if (response.payload) navigate('/');
                              });
                            }}
                            onFailure={console.error}
                            render={renderProps => (
                              <button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className="j_Login_social d-flex justify-content-center align-items-center"
                              >
                                <img src={google_login} alt="google_login" className='google_login' />
                                <span className='j_google_social'>Google</span>
                              </button>
                            )}
                          />
                        </div>
                        <div className="col-md-6 col-12 j_col_pad2">
                          <button className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={facebook_login} alt="google_login" className='google_login' />
                            <span className='j_google_social'>Facebook</span>
                          </button>
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
                        name: '', email: '', password: '', compassword: '', showPass: false
                      }}
                      validationSchema={signUpSchema}
                      onSubmit={(values) => {
                        dispatch(createUser(values)).then((response) => {
                          if (response.payload._id) navigate('/');
                        });
                      }}
                    >
                      {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                          <label className='j_label'>
                            Name
                            <Field
                              type="text"
                              name="name"
                              placeholder="Enter Name"
                              value={values.name}
                              onChange={handleChange}
                              className="form-control j_input"
                            />
                            <ErrorMessage name="name" component="div" style={{ color: '#cd1425' }} />
                          </label>
                          <label className='j_label'>
                            Email
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              value={values.email}
                              onChange={handleChange}
                              className="form-control j_input"
                            />
                            <ErrorMessage name="email" component="div" style={{ color: '#cd1425' }} />
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
                            <ErrorMessage name="password" component="div" style={{ color: '#cd1425' }} />
                          </label>
                          <label className='j_label mt-2'>
                            Confirm Password
                            <div className='position-relative'>
                              <Field
                                name="compassword"
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
                            <ErrorMessage name="compassword" component="div" style={{ color: '#cd1425' }} />
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
                          <GoogleLogin
                            onSuccess={response => {
                              const { name, email, sub: uid } = jwtDecode(response.credential);
                              console.log(name, email, uid);

                              dispatch(googleLogin({ uid, name: name, email })).then((response) => {
                                if (response.payload) navigate('/');
                              });
                            }}
                            onFailure={console.error}
                            render={renderProps => (
                              <button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className="j_Login_social d-flex justify-content-center align-items-center"
                              >
                                <img src={google_login} alt="google_login" className='google_login' />
                                <span className='j_google_social'>Google</span>
                              </button>
                            )}
                          />
                        </div>
                        <div className="col-md-6 col-12 j_col_pad2">
                          <button className="j_Login_social d-flex justify-content-center align-items-center">
                            <img src={facebook_login} alt="google_login" className='google_login' />
                            <span className='j_google_social'>Facebook</span>
                          </button>
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
      )}

      {/* Forget Password */}
      {forgotPasswordStep === 1 && (
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
                  <Formik
                    initialValues={{
                      email: ''
                    }}
                    validationSchema={Yup.object({
                      email: Yup.string().email('Invalid email').required('Email is required'),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      console.log(values.email);
                      setEmail(values.email);
                      dispatch(forgotPassword(values.email)).then((response) => {
                        console.log(response);
                        if (response.payload.success) {
                          handleSendOTP();
                          resetForm();
                        }
                      });
                    }}
                  >
                    {({ handleChange, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <label className='j_label'>
                          Email
                          <input
                            type="email"
                            name="email"
                            className='form-control j_input'
                            placeholder="Enter Email"
                            ref={(input) => input && input.focus()}
                            onChange={handleChange}
                          />
                          <ErrorMessage name="email" component="div" style={{ color: '#cd1425' }} />
                        </label>
                        <button className='j_Code_button' type="submit">Send Code</button>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OTP */}
      {forgotPasswordStep === 2 && (
        <OTPInput
          length={6}
          onComplete={(otpValue) => {

          }}
          resendTimer={resendTimer}
          setResendTimer={setResendTimer}
          handleVerifyOTP={handleVerifyOTP}
          email={email}
        />
      )}

      {/* new pass */}
      {forgotPasswordStep === 3 && (
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
                  <Formik
                    initialValues={{
                      newPassword: '',
                      confirmPassword: '',
                    }}
                    validationSchema={Yup.object({
                      newPassword: Yup.string().required('New Password is required'),
                      confirmPassword: Yup.string()
                        .oneOf([Yup.ref('newPassword'), null], 'Password and Confirm Password not match')
                        .required('Confirm Password is required'),
                    })}
                    onSubmit={(values) => {
                      const { newPassword, confirmPassword } = values;
                      handleChangePassword({ newPassword, confirmPassword });
                    }}
                  >
                    {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                      <form onSubmit={handleSubmit}>
                        <label className='j_label'>
                          New Password
                          <div className="password-container" style={{ position: 'relative' }}>
                            <input
                              name="newPassword"
                              className='form-control j_input'
                              type={showNewPass ? "text" : "password"}
                              placeholder="Create password"
                              value={values.newPassword}
                              onChange={handleChange}
                            />
                            <div onClick={() => setShowNewPass(!showNewPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                              {showNewPass ? <IoEye /> : <IoEyeOff />}
                            </div>
                          </div>
                          {errors.newPassword && touched.newPassword && (
                            <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.newPassword}</div>
                          )}
                        </label>
                        <label className='j_label mt-2'>
                          Confirm Password
                          <div className="password-container" style={{ position: 'relative' }}>
                            <input
                              name="confirmPassword"
                              className='form-control j_input'
                              type={showNewcomPass ? "text" : "password"}
                              placeholder="Enter confirm password"
                              value={values.confirmPassword}
                              onChange={handleChange}
                            />
                            <div onClick={() => setShowNewcomPass(!showNewcomPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                              {showNewcomPass ? <IoEye /> : <IoEyeOff />}
                            </div>
                          </div>
                        </label>
                        <button className='j_Code_button' type="submit">Reset Password</button>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div >
  )
}

export default Login;
