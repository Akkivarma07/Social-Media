const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY;
const { error, success } = require("../utils/responseWrapper");
const cookieParser = require("cookie-parser");

const signUpController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("User already exists");
      return res.send(error(409, "User already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      email,
      password: hashedPassword,
    });

    // return res.status(201).json({
    //   message: "User created successfully",
    //   user,
    // });

    return res.send(
      success(201, {
        user: user,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(404).send("User is not found");
      return res.send(error(404, "User is not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // return res.status(403).send("Invalid credentials");
      return res.send(error(403, "Invalid credentials"));
    }

    const accessToken = generateAcessToken({ _id: user.id });
    const refreshToken = generateRefreshToken({ _id: user.id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.status(200).json({
    //   message: "User logged in successfully",
    //   accessToken,
    //   // will not be sending like want to send in cookies
    //   // refreshToken,
    // });

    return res.send(
      success(200, {
        accessToken: accessToken,
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const refrshAcessTokenController = async (req, res) => {
  //As refresh token was previously approach was present in body
  //but now it is present in the cookie

  // const { refreshToken } = req.body;
  //so we will be acessing through cookie

  // const cookies = req.cookie;
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookies is required");
    return res.send(error(401, "Refresh token in cookies is required"));
  }

  const refreshToken = cookies.jwt;
  console.log('refresh token', refreshToken);

  // if (!refreshToken) {
  //   return res.status(401).send("Refresh token is required");
  // }
  //previous approach

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);

    const _id = decoded._id;
    const accessToken = generateAcessToken({ _id });

    // return res.status(200).json({ accessToken });
    return res.send(
      success(200, {
        accessToken,
      })
    );
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid refresh token");
    return res.send(error(401, "Invalid refresh token"));
  }
};

//internal functions

const generateAcessToken = (data) => {
  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: "20s",
  });
  console.log(token);
  return token;
};
const generateRefreshToken = (data) => {
  const token = jwt.sign(data, REFRESH_TOKEN_KEY, {
    expiresIn: "1y",
  });
  console.log(token);
  return token;
};

module.exports = {
  signUpController,
  loginController,
  refrshAcessTokenController,
};
