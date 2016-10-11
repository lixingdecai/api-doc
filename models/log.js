const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  api: { type: Schema.Types.ObjectId, ref: 'Api' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
};

const log = new Schema(fields);
const Log = mongoose.model('Log', log);

exports.fields = fields;
exports.log = log;
exports.Log = Log;
