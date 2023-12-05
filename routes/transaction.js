const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Transaction = require("../model/Transaction");

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
  let { value, date, type, bankAccountId } = req.body;
  let { id: userId } = req.decoded;
  try {
    let transaction = await Transaction.create(value, date, type, bankAccountId, userId)
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
    let transaction = await Transaction.getAllByUserId(userId, page, limit);
    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/allByBankAccount/:bankAccountId", authorization, async (req, res) => {
  let { bankAccountId } = req.params;
  let { id: userId } = req.decoded;
  let { page, limit } = req.query;

  try {
    let transaction = await Transaction.getAllByBankAccountId(bankAccountId, userId, page, limit);
    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
})

router.get("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let transaction = await Transaction.getById(id, userId);
    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { value, date, type, bankAccountId } = req.body;
  let { id: userId } = req.decoded;
  try {
    let transaction = await Transaction.update(id, value, date, type, bankAccountId, userId);
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
    let transaction = await Transaction.delete(id, userId);
    res.status(200).json({ status: "Bank Account deleted" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;