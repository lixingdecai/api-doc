// 项目
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  name: String, // 项目名
  domain: String, // 域名
  description: String, // 说明
  author: String,
  mark: {
    type: Number,
    default: 0
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

const project = new Schema(fields);
const Project = mongoose.model('Project', project);

exports.fields = fields;
exports.project = project;
exports.Project = Project;
