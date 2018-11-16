const tools = require('./tools');
const model = require('../models/productVersion.js');
const Version = model.ProductVersion;
const createVersion = (name, product) => {
  const now = new Date;
  return {
    name
    , product
    , createAt: now
    , updateAt: now
  };
};
exports.name = 'productVersion';
exports.get = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Version.findById(id).then(version => tools.responseSuccess(res, version), err => tools.responseFailure(res, err));
};
exports.getByNameAndProductId = (req, res) => {
  const param = req.params.name;
  var arrs = param.split('_');
  const name = arrs[0];
  const product = arrs[1];
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Version.find({
    'name': name
    , 'mark': 0
    , 'product': product
  }).then(version => tools.responseSuccess(res, version), err => tools.responseFailure(res, err));
};
exports.getAllByProductId = (req, res) => {
  const product = req.params.productId;
  console.log('product:' + product);
  if (!product) {
    tools.responseFailure(res, 'Invalid product');
  }
  Version.find({
    'product': product
  }).then(versions => tools.responseSuccess(res, versions), err => tools.responseFailure(res, err));
};
exports.getAll = (req, res) => {
  Version.find({
    mark: 0
  }).then(versions => tools.responseSuccess(res, versions), err => tools.responseFailure(res, err));
};
exports.create = (req, res) => {
  const name = req.body.name;
  const product = req.body.product;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Version.create(createVersion(name, product)).then(version => tools.responseSuccess(res, version), err => tools.responseFailure(
    res, err));
};
exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const mark = req.body.mark;
  const updateAt = req.body.updateAt || new Date;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Version.findByIdAndUpdate(id, {
    name
    , updateAt
    , mark
  }).then(version => tools.responseSuccess(res, version), err => tools.responseFailure(res, err));
};
exports.del = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Version.findByIdAndRemove(id).then(version => tools.responseSuccess(res, version), err => tools.responseFailure(res
    , err));
};

