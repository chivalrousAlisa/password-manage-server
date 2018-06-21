var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountsSchema = new Schema({
  "platform":String,
  "account":String,
  "password":String,
  "email":String,
  "phone":String,
  "description": String
});
module.exports = mongoose.model('accounts',accountsSchema);
