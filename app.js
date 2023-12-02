const express = require("express");
const app = express();

const installRouter = require('./routes/install');
const userRouter = require('./routes/user');
const admRouter = require('./routes/adm');
const bankAccountRouter = require('./routes/bankAccount');
const transactionRouter = require('./routes/transaction');
const investmentRouter = require('./routes/investment');

app.use(express.json());

app.use(installRouter);
app.use('/user', userRouter);
app.use('/adm', admRouter);
app.use('/bankAccount', bankAccountRouter);
app.use('/transaction', transactionRouter);
app.use('/investment', investmentRouter);


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
