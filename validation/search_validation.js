const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSearchInput(sterm) {
  let errors = {};

  console.log("validate");
  console.log(sterm);

  tsterm = !isEmpty(sterm) ? sterm : "";

  if (Validator.isEmpty(tsterm)) {
    errors.search = "Search field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
