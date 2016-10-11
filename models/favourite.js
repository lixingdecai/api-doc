const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  api: { type: Schema.Types.ObjectId, ref: 'Api' },
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
};

const favourite = new Schema(fields);
const Favourite = mongoose.model('Favourite', favourite);

exports.fields = fields;
exports.favourite = favourite;
exports.Favourite = Favourite;
