const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sequelize } = require("../model/bd");

let authorizationAdm = (req, res, next) => {
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
        if (decoded.admin) {
          next();
        }
      }
    });
  } else {
    res.status(401).json({ status: "No token" });
  }
};

router.post("/create", authorizationAdm, async (req, res) => {
  let { name, email, password, admin } = req.body;
  try {
    let user = await User.create(name, email, password, admin);
    res.status(200).json({ status: "User created" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;
