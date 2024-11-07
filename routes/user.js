const express = require("express");
const router = express.Router();

const { signUp, signIn, signOut, updateUser } = require("../controllers/user");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.patch("/update-user/:userId", updateUser);

module.exports = router;
