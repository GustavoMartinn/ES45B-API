function isName(name) {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(name);
}

function isEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

function isPassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
}

function isNumber(number) {
  return !isNaN(number);
}

function isValidDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  return regex.test(date);
}

module.exports = {
  isName,
  isEmail,
  isPassword,
  isNumber,
  isValidDate
}