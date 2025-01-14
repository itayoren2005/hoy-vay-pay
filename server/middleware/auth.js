const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { now } = require("mongoose");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token || token.length === 0) {
      throw new Error("token not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("invalid token");
    }

    if (decoded.exp < Date.now() / 1000) {
      throw new Error("token required");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("user not found");
    }

    req.user = Object.assign(user, { exp: decoded.exp });

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { auth };
