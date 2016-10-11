const tools = require('./tools');
const model = require('../models/log');

const Log = model.Log;

const createLog = (description, user, api) => {
  const now = new Date;
  return {
    description,
    user,
    api,
    createAt: now,
    updateAt: now
  };
};

exports.createLog = createLog;

exports.name = 'tag';

exports.get = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Log.findById(id).then(
    tag => tools.responseSuccess(res, tag),
    err => tools.responseFailure(res, err)
  );
};

exports.getAll = (req, res) => {
  Log.find().then(
    tags => tools.responseSuccess(res, tags),
    err => tools.responseFailure(res, err)
  );
};

exports.getAllByApi = (req, res) => {
  const api = req.params.api;
  if (!api) {
    tools.responseFailure(res, 'Invalid api');
  }
  Log.find({ api }).then(
    tags => tools.responseSuccess(res, tags),
    err => tools.responseFailure(res, err)
  );
};

exports.create = (req, res) => {
  const description = req.body.description;
  const user = req.session.user;
  const api = req.body.api;
  if (!description) {
    return tools.responseFailure(res, 'Invalid description');
  }
  if (!user) {
    return tools.responseFailure(res, 'Invalid description');
  }
  if (!api) {
    return tools.responseFailure(res, 'Invalid api');
  }
  Log.create(createLog(description, user._id, api)).then(
    tag => tools.responseSuccess(res, tag),
    err => tools.responseFailure(res, err)
  );
};

exports.update = (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const updateAt = req.body.updateAt || new Date;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  if (!description) {
    return tools.responseFailure(res, 'Invalid name');
  }

  Log.findByIdAndUpdate(id, { description, updateAt }).then(
    tag => tools.responseSuccess(res, tag),
    err => tools.responseFailure(res, err)
  );
};

exports.del = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Log.findByIdAndRemove(id).then(
    tag => tools.responseSuccess(res, tag),
    err => tools.responseFailure(res, err)
  );
};
