const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.jwtSecret, {
    expiresIn: jwtConfig.jwtExpiration,
  });
};

module.exports = { generateToken };
