const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Transaction = require("../model/Transaction");
const { verifyFields } = require("../utils/verifyFields");

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
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para criar uma nova transação'
  let { value, date, type, bankAccountId } = req.body;
  let { id: userId } = req.decoded;

  const errors = verifyFields(req.body, ["value", "date", "type"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }

  try {
    let transaction = await Transaction.create(value, date, type, bankAccountId, userId)
    res.status(200).json({ status: "Transaction created" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/all", authorization, async (req, res) => {
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para listar todas as transações do usuário'
  let { id: userId } = req.decoded;
  let { page, limit } = req.query;

  try {
    let transaction = await Transaction.getAllByUserId(userId, page, limit);
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/allByBankAccount/:bankAccountId", authorization, async (req, res) => {
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para listar todas as transações de uma conta bancária'
  let { bankAccountId } = req.params;
  let { id: userId } = req.decoded;
  let { page, limit } = req.query;

  try {
    let transaction = await Transaction.getAllByBankAccountId(bankAccountId, userId, page, limit);
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
})

router.get("/:id", authorization, async (req, res) => {
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para listar uma transação específica'
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let transaction = await Transaction.getById(id, userId);
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/:id", authorization, async (req, res) => {
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para atualizar uma transação'
  let { id } = req.params;
  let { value, date, type, bankAccountId } = req.body;
  let { id: userId } = req.decoded;

  const errors = verifyFields(req.body, ["value", "date", "type"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }

  try {
    let transaction = await Transaction.update(id, value, date, type, bankAccountId, userId);
    res.status(200).json({ status: "Bank Account updated" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/:id", authorization, async (req, res) => {
  // #swagger.tags = ['Transaction']
  // #swagger.description = 'Endpoint para deletar uma transação'
  let { id } = req.params;
  let { id: userId } = req.decoded;
  try {
    let transaction = await Transaction.delete(id, userId);
    res.status(200).json({ status: "Bank Account deleted" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

module.exports = router;