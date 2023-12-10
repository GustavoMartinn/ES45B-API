const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../model/User");
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
};

router.post("/", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para criar um novo usuário'

  let { name, email, password } = req.body;

  const errors = verifyFields(req.body, ["name", "email", "password"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }

  try {
    let user = await User.create(name, email, password);
    res.status(200).json({ status: "User created" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.post("/login", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para realizar login'


  let { email, password } = req.body;

  const errors = verifyFields(req.body, ["email", "password"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }

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

router.put("/", authorization, async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para atualizar um usuário'

  let { id } = req.decoded;
  let { name, email, password } = req.body;

  const errors = verifyFields(req.body, ["name", "email", "password"]);

  if (errors.length > 0) {
    res.status(400).json({ status: "Data invalid", errors });
    return;
  }

  try {
    let updated = await User.update(id, name, email, password);

    if (updated) {
      res.status(200).json({ status: "User updated" });
      return;
    }
    res.status(500).json({ status: "User not updated" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.delete("/", authorization, async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para deletar um usuário'
  let { id } = req.decoded;
  try {
    let deleted = await User.delete(id);
    if (deleted) {
      res.status(200).json({ status: "User deleted" });
      return;
    }
    res.status(500).json({ status: "User not deleted" });
  } catch (error) {
    res.status(401).json({ status: "Data invalid" });
  }
});

router.get("/", authorization, async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para buscar um usuário'
    let { id } = req.decoded;
    try {
        let user = await User.getById(id);
        res.status(200).json({ user });
    } catch (error) {
  
        res.status(401).json({ status: "Data invalid" });
    }
});

module.exports = router;
