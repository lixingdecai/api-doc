// 产品
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  name: String,
  // 产品名称
  productName: String,
  // 产品版本结合名称
  displayName: String,
  author: String,
  mark: {type: Number, default: 0},
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }, // 产品线
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
};

const productVersion = new Schema(fields);
const ProductVersion = mongoose.model('ProductVersion', productVersion);

exports.fields = fields;
exports.productVersion = productVersion;
exports.ProductVersion = ProductVersion;
