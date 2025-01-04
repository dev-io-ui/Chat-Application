const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const groupRouter = require("./routes/groupRoute");
//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");
const { FORCE } = require("sequelize/lib/index-hints");


app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/group",groupRouter);

//Relationships between Tables
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);
Chat.belongsTo(Group);
User.hasMany(UserGroup);
Group.hasMany(Chat);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);


sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));