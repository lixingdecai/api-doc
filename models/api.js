const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  title: String,  // 接口名称
  description: String,  // 接口描述
  method: String, // 请求类型
  url: String,  // 请求url
  protocol: String, // 网络协议 http、https
  requestParameter: String, //请求参数
  requestDataType: String, // 请求数据类型 1、form-data 2、x-www-from-urlencoded 3、raw
  requestData: String, // 请求数据
  requestHeader: String, // 请求头
  responseData: String, //响应参数
  request: String,
  response: String,
  host: String, // 域名
  pathname: String,
  favourite: Boolean, // 关联查询输出用
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }], // 标签
  remarks : String, // 备注
  refer: String,
  pageId: { type: Schema.Types.ObjectId, ref: 'Page' },  // 所属页面
  project: { type: Schema.Types.ObjectId, ref: 'Project' },  // 所属页面
  products: [{ type: Schema.Types.ObjectId, ref: 'ProductVersion' }],  // 产品线
  createBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createAt: Date,
  updateAt: Date
};

const api = new Schema(fields);
const Api = mongoose.model('Api', api);

const findAllProjection = {
  method: 1,
  title: 1,
  description: 1,
  protocol: 1,
  url: 1,
  host: 1,
  pathname: 1,
  tags: 1,
  author: 1,
  pageId: 1,
  project: 1,
  products: 1,
  createBy: 1,
  updateBy: 1,
  createAt: 1,
  updateAt: 1
};

const distinctionFields = ['createBy', 'products', 'tags'];

exports.fields = fields;
exports.findAllProjection = findAllProjection;
exports.distinctionFields = distinctionFields;
exports.api = api;
exports.Api = Api;
