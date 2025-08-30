import dotenv from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../models/userSchema.js';
import { verifyEmail } from '../verifyEmail/verifyEmail.js';
import sessionSchema from '../models/sessionSchema.js';

export const register = async (req, res) => {
  try {   
    const { userName, email, password } = req.body;
    console.log("test",userName, email, password)
    const existing = await userSchema.findOne({ email: email });
    if (existing) { 
      return res.status(401).json({
        success: false,  
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });
    console.log(`the encrypted password is ${hashedPassword}`)
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "15m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {

      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      } else if (passwordCheck && user.verified === true) {

      // const existing = await sessionSchema.findOneAndDelete({
      //     userId: user._id,
      //   });
      //   console.log("my session", existing);


        await sessionSchema.create({ userId: user._id });

        const accessToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "10days",
          }
        );

        const refreshToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "30days",
          }
        );

        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User Logged in Successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        });
      } else {
        res.status(200).json({
          message: "Complete Email verification then Login..",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const logout = async (req, res) => {
  const existing = await sessionSchema.findOne({ userId: req.userId });
  // console.log("existing ", existing);

  try {
    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      existing.isLoggedIn = false;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: "Session successfully ended",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User had no session",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};