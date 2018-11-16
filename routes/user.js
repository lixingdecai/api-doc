/* eslint strict:0 */
'use strict';
const tools = require('./tools');
const model = require('../models/user');
const User = model.User;
const createUser = (name, email, password) => {
  const now = new Date;
  return {
    name
    , email
    , password
    , createAt: now
    , updateAt: now
  };
};
exports.name = 'user';
exports.get = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  User.findById(id).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(res, err));
};
exports.getByName = (req, res) => {
  const name = req.params.name;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  User.find({
    'name': name
    , 'mark': 0
  }).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(res, err));
};
exports.getByEmail = (req, res) => {
  const name = req.params.name;
  if (!name) {
    return tools.responseFailure(res, 'Invalid email');
  }
  User.find({
    'email': name
    , 'mark': 0
  }).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(res, err));
};
exports.getAll = (req, res) => {
  User.find({
    mark: 0
  }).then(users => tools.responseSuccess(res, users), err => tools.responseFailure(res, err));
};
exports.create = (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  if (!email) {
    return tools.responseFailure(res, 'Invalid email');
  }
  if (!password) {
    return tools.responseFailure(res, 'Invalid password');
  }
  User.create(createUser(name, email, password)).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(
    res, err));
};
exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const mark = req.body.mark;
  const updateAt = req.body.updateAt || new Date;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  if (!email) {
    return tools.responseFailure(res, 'Invalid email');
  }
  if (!password) {
    return tools.responseFailure(res, 'Invalid password');
  }
  User.findByIdAndUpdate(id, {
    name
    , email
    , password
    , updateAt
    , mark
  }).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(res, err));
};
exports.del = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  User.findByIdAndRemove(id).then(user => tools.responseSuccess(res, user), err => tools.responseFailure(res, err));
};
exports.pageList = (req, res) => {
  const pageSize = parseInt(req.params.pageSize);
  const currPage = parseInt(req.params.currPage);
  const skip = (currPage - 1) * pageSize;
  User.find({
    mark: 0
  }).skip(skip).limit(pageSize).then(users => tools.responseSuccess(res, users), err => tools.responseFailure(res
    , err));
};
exports.totalCount = (req, res) => {
  var query = User.find({
    mark: 0
  });
  query.count(function (err, count) {
    tools.responseSuccess(res, count);
  });
};
exports.login = (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  if (!name) {
    return tools.responseFailure(res, '请输入用户名');
  }
  if (!password) {
    return tools.responseFailure(res, '密码不能为空');
  }
  console.log('name:' + name + ' password:' + password);
  if (name.lastIndexOf('@') > 0) {
    User.findOne({
      name
      , password
    }).then((user) => {
      if (!user) {
        tools.responseFailure(res, '用户名或密码错误');
        return;
      }
      if (user.mark == -1) {
        tools.responseFailure(res, '该用户已经删除！');
        return;
      }
      if (!req.session.user) {
        req.session.user = user;
        req.session.save();
      }
      // req.session.user = user;
      // req.session.save();
      // res.cookie('user', user, { maxAge: 1000 * 60 * 30 });
      tools.responseSuccess(res, user);
    }, (error) => tools.responseFailure(res, error));
  } else {
    User.findOne({
      name
      , password
    }).then((user) => {
      if (!user) {
        tools.responseFailure(res, '用户名或密码错误');
        return;
      }
      if (user.mark == -1) {
        tools.responseFailure(res, '该用户已经删除！');
        return;
      }
      if (!req.session.user) {
        req.session.update = new Date();
        req.session.user = user;
        req.session.save();
      }
      tools.responseSuccess(res, user);
    }, (error) => tools.responseFailure(res, error));
  }
};
exports.checklogin = (req, res) => {
  console.log('checklogin');
  if (!req.session.user) {
    tools.responseFailure(res, '未登入');
  } else {
    tools.responseSuccess(res, {
      user: req.session.user
    });
  }
};
exports.logout = (req, res) => {
  // req.clearCookie('connect.sid');
  req.session.user = null;
  req.session.save();
  res.session = null;
  // res.clearCookie(Settings.auth_cookie_name);
  tools.responseSuccess(res, {});
};

