const user = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
const { OAuth2Client } = require('google-auth-library');


exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    let checkEmailIsExist = await user.findOne({ email });

    if (!checkEmailIsExist) {
      return res.status(404).json({ status: 404, message: "Email Not found" });
    }

    let comparePassword = await bcrypt.compare(
      password,
      checkEmailIsExist.password
    );

    if (!comparePassword) {
      return res
        .status(404)
        .json({ status: 404, message: "Password Not Match" });
    }

    // Check if the plan has expired
    const currentDate = new Date();
    if (checkEmailIsExist.endDate && currentDate > checkEmailIsExist.endDate) {
      // Set planType to default if expired
      checkEmailIsExist.planType = 'Basic'; // or any default value you want
      checkEmailIsExist.endDate = null;
      checkEmailIsExist.startDate = null;
      checkEmailIsExist.Pricing = null;
      await checkEmailIsExist.save(); // Save the updated user
    }

    let token = await jwt.sign(
      { _id: checkEmailIsExist._id },
      process.env.SECRET_KEY,
      { expiresIn: "1D" }
    );

    return res.status(200).json({
      status: 200,
      message: "User Login SuccessFully...",
      user: checkEmailIsExist,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("code", code);

    if (!code) {
      return res.status(400).json({
        status: 400,
        message: "No authorization code provided",
        success: false,
      });
    }

    // Create OAuth client
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'postmessage' // 'postmessage' is important for client-side flow
    );

    try {
      // Exchange the authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      console.log("Google tokens received:", {
        has_access_token: !!tokens.access_token,
        has_refresh_token: !!tokens.refresh_token,
        has_id_token: !!tokens.id_token,
        expires_in: tokens.expires_in
      });

      // Extract tokens
      const { access_token, refresh_token, id_token, expiry_date } = tokens;

      if (!access_token) {
        return res.status(400).json({
          status: 400,
          message: "Failed to obtain access token from Google",
          success: false,
        });
      }

      // Get user info from ID token
      const ticket = await oauth2Client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log("Google user info:", {
        sub: payload.sub,
        email: payload.email,
        name: payload.name
      });

      // Find or create user
      let checkUser = await user.findOne({ email: payload.email });
      if (!checkUser) {
        checkUser = await user.create({
          uid: payload.sub,
          name: payload.name,
          email: payload.email,
          photo: payload.picture,
          googleAccessToken: access_token,
          googleRefreshToken: refresh_token || null, // Store refresh token if available
          googleTokenExpiry: new Date(expiry_date || (Date.now() + (tokens.expires_in * 1000)))
        });
      } else {
        // Update user info with new tokens
        checkUser.googleAccessToken = access_token;
        if (refresh_token) {
          checkUser.googleRefreshToken = refresh_token;
        } else if (access_token) {
          checkUser.googleAccessToken = access_token;
        }
        checkUser.googleTokenExpiry = new Date(expiry_date || (Date.now() + (tokens.expires_in * 1000)));
        await checkUser.save();
      }

      // Check if the plan has expired
      const currentDate = new Date();
      if (checkUser.endDate && currentDate > checkUser.endDate) {
        // Set planType to default if expired
        checkUser.planType = 'Basic'; // or any default value you want
        checkUser.endDate = null;
        checkUser.startDate = null;
        checkUser.Pricing = null;
        await checkUser.save(); // Save the updated user
      }

      // Convert to plain object for response
      checkUser = checkUser.toObject();

      // Create JWT for your app
      let token = jwt.sign(
        { _id: checkUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "1D" }
      );

      // Don't send sensitive information to client
      delete checkUser.googleAccessToken;
      delete checkUser.googleRefreshToken;

      return res.status(200).json({
        status: 200,
        message: "User Login successfully...",
        success: true,
        user: checkUser,
        token: token,
      });
    } catch (tokenError) {
      console.error("Token exchange error:", tokenError);
      return res.status(401).json({
        status: 401,
        message: "Failed to authenticate with Google",
        error: tokenError.message,
        success: false,
      });
    }
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    let checkEmail = await user.findOne({ email });

    if (!checkEmail) {
      return res.status(404).json({ status: 404, message: "Email Not Found" });
    }

    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Your code is: ${otp} `,
    };

    checkEmail.otp = otp;

    await checkEmail.save();

    transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ status: 500, success: false, message: error.message });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Email Sent SuccessFully...",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    console.log(email, otp);

    let chekcEmail = await user.findOne({ email });

    if (!chekcEmail) {
      return res.status(404).json({ status: 404, message: "Email Not Found" });
    }

    if (chekcEmail.otp != otp) {
      return res.status(404).json({ status: 404, message: "Invalid Otp" });
    }

    chekcEmail.otp = undefined;

    await chekcEmail.save();

    return res.status(200).json({
      status: 200,
      message: "Otp Verify SuccessFully...",
      user: chekcEmail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let { newPassword, email } = req.body;

    let userId = await user.findOne({ email });

    if (!userId) {
      return res.status(404).json({ status: 404, message: "User Not Found" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(newPassword, salt);

    let updatePassword = await user.findByIdAndUpdate(
      userId._id,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      status: 200,
      message: "Password Changed SuccessFully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.userLogout = async (req, res) => {
  try {
    const userlogout = await user.findByIdAndUpdate(req.params.id);
  } catch (error) {
    console.log("errr logouttt", error);
  }

  return res.status(200).json({
    success: true,
    message: "User logged Out",
  });
};
