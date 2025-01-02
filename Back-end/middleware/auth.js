const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token

        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token must be provided" });
        }

        const decoded = jwt.verify(token, "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd");

        const user = await User.findByPk(decoded.id); 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user; 
        next(); 

    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = { authenticate };
