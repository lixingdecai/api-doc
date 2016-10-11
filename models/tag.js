const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  name: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  mark: {type: Number, default: 0},
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
};

const tag = new Schema(fields);
const Tag = mongoose.model('Tag', tag);

exports.fields = fields;
exports.tag = tag;
exports.Tag = Tag;
