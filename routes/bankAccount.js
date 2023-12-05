const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const BankAccount = require("../model/BankAccount");

let authorization = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token == undefined) {
    res.status(401).json({ status: "No token" });
  }
  token = token.replace("Bearer ", "");
  if (token) {
    jwt.verify(token, "secret1234!@#$", (err, decoded) => {
      if (err) {
        res.status(401).json({ status: "Invalid token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ status: "No token" });
  }
}

router.post("/", authorization, async (req, res) => {
  let { name, initialBalance } = req.body;
  let { id: userId } = req.decoded;
  try {
    let bankAccount = await BankAccount.create(name, initialBalance, userId);
    res.status(200).json({ status: "Bank Account created" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/all", authorization, async (req, res) => {
  let { id: userId } = req.decoded;
  let { page, limit } = req.query;

  try {
    let bankAccounts = await BankAccount.getAllByUserId(userId, page, limit);
    res.status(200).json({ bankAccounts });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let bankAccount = await BankAccount.getById(id, userId);
    res.status(200).json({ bankAccount });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { name, initialBalance } = req.body;
  let { id: userId } = req.decoded;
  try {
    let bankAccount = await BankAccount.update(id, name, initialBalance, userId);
    res.status(200).json({ status: "Bank Account updated" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let bankAccount = await BankAccount.delete(id, userId);
    res.status(200).json({ status: "Bank Account deleted" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;