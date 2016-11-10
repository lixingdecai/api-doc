const tools = require('./tools');
const model = require('../models/product');
const pVersionM = require('../models/productVersion');
const Product = model.Product;
const ProductVersion = pVersionM.ProductVersion;
const createProduct = (name, description, productVesions) => {
  const now = new Date;
  return {
    name
    , description
    , createAt: now
    , updateAt: now
  };
};
exports.name = 'product';
exports.get = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Product.findById(id).then(product => tools.responseSuccess(res, product), err => tools.responseFailure(res, err));
};
exports.getByName = (req, res) => {
  const name = req.params.name;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Product.find({
    'name': name
    , 'mark': 0
  }).then(product => tools.responseSuccess(res, product), err => tools.responseFailure(res, err));
};
exports.pageList = (req, res) => {
  const pageSize = parseInt(req.params.pageSize);
  const currPage = parseInt(req.params.currPage);
  const skip = (currPage - 1) * pageSize;
  Product.find({
    mark: 0
  }).skip(skip).limit(pageSize).then(
    (products) => {
      // console.log('productId : ' + products);
      ProductVersion.find({
        mark: 0
      }).then(versions => {
        // console.log('version  ssssss :' + versions);
        products.forEach(product => {
          // console.log('product :' + product);
          versions.forEach(version => {
            // console.log(product._id + ' ------ ' + version.product);
            // console.log(version.product.equals(product._id));
            if (version.product.equals(product._id)) {
              product.productVersions.push(version);
              // console.log(' ====== ' + product);
            }
          });
        });
        tools.responseSuccess(res, products);
        // if (version) {
        //   console.log('aaa: ' + product);
        //   product.productVesions.push(version);
        //   console.log('bbb: ' + product);
        // }
      }, err => tools.responseFailure(res, err));
      // console.log('return !!');
    }, (err) => tools.responseFailure(res, err));
};
exports.totalCount = (req, res) => {
  var query = Product.find({
    mark: 0
  });
  query.count(function (err, count) {
    tools.responseSuccess(res, count);
  });
};
exports.getAll = (req, res) => {
  console.log('get products');
  Product.find({
    mark: 0
  }).then(
    (products) => {
      // console.log('productId : ' + products);
      ProductVersion.find({
        mark: 0
      }).then(versions => {
        // console.log('version  ssssss :' + versions);
        products.forEach(product => {
          // console.log('product :' + product);
          versions.forEach(version => {
            // console.log(product._id + ' ------ ' + version.product);
            // console.log(version.product.equals(product._id));
            if (version.product.equals(product._id)) {
              version.productName = product.name;
              version.displayName = product.name + ' -> ' + version.name;
              product.productVersions.push(version);
              // console.log(' ====== ' + product);
            }
          });
        });
        tools.responseSuccess(res, products);
        // if (version) {
        //   console.log('aaa: ' + product);
        //   product.productVesions.push(version);
        //   console.log('bbb: ' + product);
        // }
      }, err => tools.responseFailure(res, err));
      // console.log('return !!');
    }, (err) => tools.responseFailure(res, err));
};
exports.create = (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Product.create(createProduct(name, description)).then(product => tools.responseSuccess(res, product), err => tools.responseFailure(
    res, err));
};
exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const productVesions = req.body.productVesions;
  const mark = req.body.mark;
  const updateAt = req.body.updateAt || new Date;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  Product.findByIdAndUpdate(id, {
    name
    , description
    , mark
    , updateAt
  }).then(product => tools.responseSuccess(res, product), err => tools.responseFailure(res, err));
};
exports.del = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Product.findByIdAndRemove(id).then(product => tools.responseSuccess(res, product), err => tools.responseFailure(res
    , err));
};

