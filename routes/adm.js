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

router.put("/update/:userId", authorizationAdm, async (req, res) => {
  let { userId } = req.params;
  console.log(userId);
  let { name, email, password, admin } = req.body;
  let isAdmin = await User.isAdmin(userId);
  if (isAdmin && userId !== req.decoded.id) {
    res.status(401).json({ status: "Is not possible update another admin" });
  }
  try {
    let user = await User.update(userId, name, email, password, admin);
    res.status(200).json({ status: "User updated" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/delete/:userId", authorizationAdm, async (req, res) => {
  let { userId } = req.params;
  let isAdmin = await User.isAdmin(userId);
  if (isAdmin && userId !== req.decoded.id) {
    res.status(401).json({ status: "Is not possible delete another admin" });
  }
  try {
    let user = await User.delete(userId);
    res.status(200).json({ status: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/getAllUsers", authorizationAdm, async (req, res) => {
  try {
    let users = await User.getAll();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Error" });
  }
});



module.exports = router;
