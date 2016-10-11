// 产品
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  id: String,
  name: String,
  description: String,
  mark: {type: Number, default: 0},
  productVersions: [],
  createBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
};

const product = new Schema(fields);
const Product = mongoose.model('Product', product);

exports.fields = fields;
exports.product = product;
exports.Product = Product;
