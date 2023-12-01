const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../model/User");

let authorization = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token == undefined) {
    res.status(401).json({ status: "No token" });
  }
  token = token.replace("Bearer ", "");
  console.log(token);
  if (token) {
    jwt.verify(token, "secret1234!@#$", (err, decoded) => {
      if (err) {
        res.status(401).json({ status: "Invalid token" });
      } else {
        console.log(decoded);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ status: "No token" });
  }
};

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

router.put("/update", authorization, async (req, res) => {
  let { id } = req.decoded;
  let { name, email, password } = req.body;
  try {
    let updated = await User.update(id, name, email, password);

    if (updated) {
      res.status(200).json({ status: "User updated" });
    }
    res.status(500).json({ status: "User not updated" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/delete", authorization, async (req, res) => {
  let { id } = req.decoded;
  try {
    let deleted = await User.delete(id);
    if (deleted) {
      res.status(200).json({ status: "User deleted" });
    }
    res.status(500).json({ status: "User not deleted" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;
