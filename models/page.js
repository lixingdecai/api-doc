// 项目
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  name: String, // 页面名
  description: String, // 说明
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
};

const page = new Schema(fields);
const Page = mongoose.model('Page', page);

exports.fields = fields;
exports.page = page;
exports.Page = Page;
