const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors"); // Uncomment this line
app.use(
  cors({
    origin: "http://localhost:5500", 
    methods: ["GET", "POST", "PUT", "DELETE"],  
    allowedHeaders: ["Content-Type", "Authorization"],  
    credentials: true, 
  })
);
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../Front-end")));


//Router
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const groupRouter = require("./routes/groupRoute");
//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");


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
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => console.log(err));