const express = require("express");
const router = express.Router();

const User = require("../model/User");

router.post("/", async (req, res) => {
  let { name, email, password } = req.body;
  try {
    let user = await User.create(name, email, password);
    res.status(200).json({ status: "User created" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;
