const express = require("express");
const app = express();

const installRouter = require('./routes/install');

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(installRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
