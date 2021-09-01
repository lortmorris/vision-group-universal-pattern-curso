
const sales = require('./sales');

function controllers(upInstance) {
  return {
    sales: sales(upInstance),
  }
}

module.exports = controllers;
