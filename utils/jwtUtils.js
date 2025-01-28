const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");


const generateToken = (user) => {
  return jwt.sign({ id: user._id,role:user.role}, jwtConfig.jwtSecret, {
    expiresIn: jwtConfig.jwtExpiration,
  });
};

module.exports = { generateToken };
