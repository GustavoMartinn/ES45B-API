const {
  isName,
  isEmail,
  isPassword,
  isNumber,
  isValidDate
} = require('./regex/regex');

const fieldsToVerify = {
  'name': (name) => isName(name),
  'email': (email) => isEmail(email),
  'password': (password) => isPassword(password),
  'isAdmin': (isAdmin) => typeof isAdmin === 'boolean',
  'initialBalance': (initialBalance) => isNumber(initialBalance),
  'value': (value) => isNumber(value),
  'amount': (amount) => isNumber(amount),
  'buyPrice': (buyPrice) => isNumber(buyPrice),
  'type': (type) => ['INCOME', 'EXPENSE'].includes(type),
  'date': (date) => isValidDate(date),
  'buyDate': (buyDate) => isValidDate(buyDate),
}

const fieldsErrorResponses = {
  'name': 'Name must contain only letters',
  'email': 'Invalid email',
  'password': 'Password must contain at least 8 characters, one letter and one number',
  'isAdmin': 'isAdmin must be a boolean',
  'initialBalance': 'Initial balance must be a number',
  'value': 'Value must be a number',
  'amount': 'Amount must be a number',
  'buyPrice': 'Buy price must be a number',
  'type': 'Type must be INCOME or EXPENSE',
  'date': 'Invalid date',
  'buyDate': 'Invalid date',
}

function verifyField(field, value) {
  if (fieldsToVerify[field]) {
    return fieldsToVerify[field](value);
  }
  return false;
}

function verifyFields(body, fields) {
  let errors = [];
  fields.forEach(field => {
    if (!body[field]) {
      errors.push(`Field ${field} is required`);
    }

    if (!verifyField(field, body[field])) {
      errors.push(fieldsErrorResponses[field]);
    }    
  });

  return errors;
}

module.exports = {
  verifyFields
}