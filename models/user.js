var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema to model a user and their pertinent information
const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }, 
      email:{type:String, required:true},
      watchlist: {type: [{item: String, specificItem: Boolean}], required: false}
    })
  );
module.exports=User