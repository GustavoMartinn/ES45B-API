const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Investment = require("../model/Investment");

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
  let { code, buyPrice, buyDate } = req.body;
  let { id: userId } = req.decoded;
  try {
    let investment = await Investment.create(code, buyPrice, buyDate, userId)
    res.status(200).json({ status: "Investment created" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/all", authorization, async (req, res) => {
  let { id: userId } = req.decoded;

  try {
    let investment = await Investment.getAllByUserId(userId);
    res.status(200).json({ investment });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/:id", authorization, async (req, res) => {
  let { id } = req.params;
  let { code, buyPrice, buyDate } = req.body;
  let { id: userId } = req.decoded;
  try {
    let investment = await Investment.update(id, code, buyPrice, buyDate, userId);
    res.status(200).json({ status: "Investment updated" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(401).json({ status: "Data invalid" });
  }
})

module.exports = router;