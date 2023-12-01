const express = require("express");
const app = express();

const installRouter = require('./routes/install');
const userRouter = require('./routes/user');

app.use(express.json());

app.use(installRouter);
app.use('/user', userRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
