const { signUpSchema, signInSchema } = require("../lib/validation/user");
const User = require("../models/user");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { setTokenCookie } = require("../lib/utils");

const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = signUpSchema.parse(
      req.body
    );
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "username already exists" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    if (!newUser) {
      return res.status(400).json({ message: "failed to create user " });
    }

    setTokenCookie(res, newUser, process.env.JWT_SECRET);

    return res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
const signIn = async (req, res) => {
  try {
    const { username, password } = signInSchema.parse(req.body);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "invalid username or password " });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "invalid username or password " });
    }

    setTokenCookie(res, user, process.env.JWT_SECRET);

    return res.status(200).json({ message: "user logged in" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "user signed out seccessfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
};
