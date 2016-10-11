const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
  apiId: { type: Schema.Types.ObjectId, ref: 'Api' }, // api Id
  title: String,  // 接口名称
  description: String,  // 接口描述
  method: String, // 请求类型
  url: String,  // 请求url
  requestParameterList: String, // 请求参数
  requestDataType: String, // 请求数据类型 1、form-data 2、x-www-from-urlencoded 3、raw
  requestDataList: String, // 请求数据
  requestHeaderList: String, // 请求头
  responseDataList: String, // 响应参数
  request: String,
  response: String,
  host: String, // 域名
  pathname: String,
  tags: [String], // 标签
  refer: String,
  pageId:{ type: Schema.Types.ObjectId, ref: 'Page' },  // 所属页面
  projectId:{ type: Schema.Types.ObjectId, ref: 'Project' },  // 所属项目
  productId: [{ type: Schema.Types.ObjectId, ref: 'Product' }],  // 产品线
  createBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createAt: Date,
  updateAt: Date
};

const apiHistory = new Schema(fields);
const ApiHistory = mongoose.model('ApiHistory', apiHistory);

const findAllProjection = {
  apiId: 1,
  method: 1,
  title: 1,
  description: 1,
  url: 1,
  host: 1,
  pathname: 1,
  tags: 1,
  author: 1,
  pageId: 1,
  projectId: 1,
  productId: 1,
  createBy: 1,
  updateBy: 1,
  createAt: 1,
  updateAt: 1
};

const distinctionFields = ['author', 'products', 'tags'];

exports.fields = fields;
exports.findAllProjection = findAllProjection;
exports.distinctionFields = distinctionFields;
exports.apiHistory = apiHistory;
exports.ApiHistory = ApiHistory;
