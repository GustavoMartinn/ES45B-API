const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
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

router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    console.log(email);
    console.log(password);
    const user = await User.getByEmail(email);
    if (user) {
      if (user.password === password) {
        const token = jwt.sign(
          { id: user.id, email: user.email, admin: user.admin },
          "secret1234!@#$",
          { expiresIn: "1h" }
        );
        res.status(200).json({ logged: true, token });
      } else {
        res.status(401).json({ status: "Invalid password" });
      }
    } else {
      res.status(401).json({ status: "Invalid email" });
    }
  });

module.exports = router;
