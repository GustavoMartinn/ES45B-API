const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { verifyFields } = require("../utils/verifyFields");

let authorizationAdm = (req, res, next) => {
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
        if (decoded.admin) {
          next();
        }
      }
    });
  } else {
    res.status(401).json({ status: "No token" });
  }
};

router.post("/", authorizationAdm, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint para criar um novo administrador'

  let { name, email, password, isAdmin } = req.body;

  const errors = verifyFields(req.body, ["name", "email", "password", "isAdmin"]);

    if (errors.length > 0) {
      res.status(400).json({ status: "Data invalid", errors });
      return;
    }

  try {
    let user = await User.create(name, email, password, isAdmin);
    res.status(200).json({ status: "User created" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.put("/user/:userId", authorizationAdm, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint para atualizar um usuário que não seja administrador ou atualizar a si mesmo'
  let { userId } = req.params;
  let { name, email, password, isAdmin } = req.body;

  const errors = verifyFields(req.body, ["name", "email", "password", "isAdmin"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }


  let userIsAdmin = await User.isAdmin(userId);
  if (userIsAdmin && userId !== req.decoded.id) {
    res.status(401).json({ status: "Is not possible update another admin" });
  }
  try {
    let user = await User.update(userId, name, email, password, isAdmin);
    res.status(200).json({ status: "User updated" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/user/:userId", authorizationAdm, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint para deletar um usuário que não seja administrador ou deletar a si mesmo'
  let { userId } = req.params;
  let isAdmin = await User.isAdmin(userId);
  if (isAdmin && userId !== req.decoded.id) {
    res.status(401).json({ status: "Is not possible delete another admin" });
  }
  try {
    let user = await User.delete(userId);
    res.status(200).json({ status: "User deleted" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/user/all", authorizationAdm, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint para buscar todos os usuários'
  let { page, limit } = req.query;
  try {
    let users = await User.getAll(page, limit);
    res.status(200).json({ users });
  } catch (error) {
    res.status(401).json({ status: "Error" });
  }
});

router.get("/user/:userId", authorizationAdm, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Endpoint para buscar um usuário'
  let { userId } = req.params;
  try {
    let user = await User.getById(userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ status: "Error" });
  }
});

module.exports = router;
