const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  name: String,
  email: String,
  password: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
};

const user = new Schema(fields);
const User = mongoose.model('User', user);

exports.fields = fields;
exports.user = user;
exports.User = User;
