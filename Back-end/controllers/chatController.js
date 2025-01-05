const path = require("path");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

const io = require("socket.io")(5000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});



io.on("connection", (socket) => {
  socket.on("getMessages", async (groupName) => {
    try {

      console.log("A user connected:", socket.id); 
      const group = await Group.findOne({ where: { name: groupName } });
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });
      console.log("Request Made");
      io.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});

exports.sendMessage = async (req, res, next) => {
  try {

    const groupName = req.body.groupName;
    const group = await Group.findOne({ where: { name: groupName } });

    const result = await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.id
    });
    return res.status(200).json({ result, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};


// exports.getMessages = async (req, res, next) => {
//   try {
//     const param = req.query.param;

//     const messages = await Chat.findAll({
//       where: {
//         id: {
//           [Op.gt]: param,
//         },
//       },
//     });
//     console.log(messages);
//     return res.status(200).json({ messages: messages });
//   } catch (error) {
//     console.log(error);
//   }
// };