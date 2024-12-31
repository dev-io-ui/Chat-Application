
const path = require("path");
const User = require("../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
const Sib = require("sib-api-v3-sdk");
const { Op } = require("sequelize");

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "../","Front-end", "views", "sign-up.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res, next) => {

    const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
  };


  module.exports = {
    getLoginPage,
    postUserSignUp,
  };