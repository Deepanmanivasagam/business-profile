const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.jwtSecret);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
};

module.exports = protect;