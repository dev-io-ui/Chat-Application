
const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
// const Sib = require("sib-api-v3-sdk");
const { Op, where } = require("sequelize");


let generateAccessToken = (id, email)=> {
  return jwt.sign(
      { id: id, email: email },
      "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
  );
};


const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "../","Front-end", "views", "sign-up.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log(name, 'name', email, 'email', phone, 'phone', password);
  const t = await sequelize.transaction();
  try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {

          return res.status(400).json({ error: 'User already exists' });

      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
          name,
          email,
          phone,
          password: hashedPassword,
      },{transaction:t});

      await t.commit();
      res.status(201).json({ message: 'User added successfully', user: newUser });
  }
  catch (err) {
      await t.rollback();
      console.error("Error in POST /add-user:", err);
      res.status(500).json({ error: 'An error occurred while adding the user.' });
  }
};


const postUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Use bcrypt to compare the password asynchronously with await
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
          return res.status(200).json({
              success: true,
              message: "Login Successful!",
              token: generateAccessToken(user.id, user.email),
          });
      } else {
          return res.status(401).json({ error: 'User Not Authorized' });
      }
  } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: 'Something went wrong' });
  }
};



  module.exports = {
    getLoginPage,
    postUserSignUp,
    postUserLogin,
    generateAccessToken
  };