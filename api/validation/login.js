const Validator = require('validator')
const isEmpty = require("is-empty");

module.exports = function validateLogin(data){
    let errors = {}

    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
   
    //Email Validation
    if(Validator.isEmpty(data.username)){
        errors.username = "Username field is required"
    }
    //Password Validation
    if(Validator.isEmpty(data.password)){
        errors.password = "Password Required"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
    
}