const tools = require('./tools');
const model = require('../models/favourite');

const Favourite = model.Favourite;

const createFavourite = (user, api) => {
  const now = new Date;
  return {
    user,
    api,
    createAt: now,
    updateAt: now
  };
};

exports.name = 'favourite';

exports.getAll = (req, res) => {
  if (!req.session.user) {
    tools.responseFailure(res, '必须登录！');
    return;
  }
  const user = req.session.user;
  Favourite.find({
      user: user._id
    })
    .then((favourites) => {
      tools.responseSuccess(res, {
        favourites
      });
    }, err => tools.responseFailure(res, err));
};

exports.remove = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Favourite.findByIdAndRemove(id).then(
    api => tools.responseSuccess(res, api),
    err => tools.responseFailure(res, err)
  );
};

exports.create = (req, res) => {
  tools.responseFailure(res, 'call update replace');
};

exports.update = (req, res) => {
  if (!req.session.user) {
    tools.responseFailure(res, 'Invalid user');
    return;
  }
  const api = req.params.id;

  if (!api) {
    tools.responseFailure(res, 'api id 不能为空！');
    return;
  }
  const user = req.session.user._id;
  Favourite.create(createFavourite(user, api))
    .then((f) => {
      tools.responseSuccess(res, f);
    }, err => tools.responseFailure(res, err));
};

exports.del = (req, res) => {
  if (!req.session.user) {
    tools.responseFailure(res, 'Invalid user');
    return;
  }
  const api = req.params.id;

  if (!api) {
    tools.responseFailure(res, 'Invalid api！');
    return;
  }
  const user = req.session.user._id;
  Favourite.remove({
      user,
      api
    })
    .then((f) => {
      tools.responseSuccess(res, f);
    }, err => tools.responseFailure(res, err));
};

exports.getByUser = (req, res) => {
  const user = req.params.user;
  Favourite.find({
      user
    })
    .then(() => {
      tools.responseSuccess(res, {});
    });
};

exports.get = (req, res) => {
  if (!req.session.user) {
    tools.responseFailure(res, 'Invalid current user');
  }
  const user = req.session.user._id;
  Favourite.find({
      user
    }).populate('api')
    .then(
      (list) => tools.responseSuccess(res, list),
      (error) => tools.responseFailure(res, error));
};

exports.clean = (req, res) => {
  Favourite.remove({}).then((data) => {
    tools.responseSuccess(res, data);
  });
};
