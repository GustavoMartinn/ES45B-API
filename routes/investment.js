const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Investment = require("../model/Investment");

const { verifyFields } = require("../utils/verifyFields");

const ApiClient = require("../utils/finance/ApiClient");

const finaceApiClient = new ApiClient(process.env.FINANCE_API_URL, process.env.FINANCE_API_KEY)

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
  let { code, amount, buyPrice, buyDate } = req.body;
  let { id: userId } = req.decoded;

  const errors = verifyFields(req.body, ["amount", "buyPrice", "buyDate"]);

    if (errors.length > 0) {
      res.status(400).json({ status: "Data invalid", errors });
      return;
    }

  try {
    let investment = await Investment.create(code, amount, buyPrice, buyDate, userId)
    res.status(200).json({ status: "Investment created" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/all", authorization, async (req, res) => {
  let { id: userId } = req.decoded;
  let { page, limit } = req.query;

  try {
    let investment = await Investment.getAllByUserId(userId, page, limit);
    res.status(200).json({ investment });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let investment = await Investment.getById(id, userId);
    res.status(200).json({ investment });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { code, amount, buyPrice, buyDate } = req.body;
  let { id: userId } = req.decoded;

  const errors = verifyFields(req.body, ["amount", "buyPrice", "buyDate"]);

    if (errors.length > 0) {
      res.status(400).json({ status: "Data invalid", errors });
      return;
    }

  try {
    let investment = await Investment.update(id, code, amount, buyPrice, buyDate, userId);
    res.status(200).json({ status: "Investment updated" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let investment = await Investment.delete(id, userId);
    res.status(200).json({ status: "Investment deleted" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
})

router.get("/profit/all", authorization, async (req, res) => {
  let { id: userId } = req.decoded;
  try {
    let investment = await Investment.getAllByUserId(userId);
    let profit = 0;
    for (let i = 0; i < investment.length; i++) {
      let code = investment[i].code;
      let amount = investment[i].amount;
      let buyPrice = investment[i].buyPrice;
      let todayPrice = await finaceApiClient.getQuotePrice(code);
      profit += (todayPrice - buyPrice) * amount;
    }
    res.status(200).json({ profit });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/profit/:code", authorization, async (req, res) => {
  let { code } = req.params;
  try {
    let investment = await Investment.getQuote(code);

    if (investment === null) {
      res.status(401).json({ status: "You don't have this quote" });
      return;
    }

    try {
      finaceApiClient.getQuotePrice(code).then((data) => {
        let profit = (data - investment.buyPrice) * investment.amount;
        res.status(200).json({ profit });
      });
    } catch (error) {

      res.status(500).json({ status: "Internal server error" });
    }

  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;