const tools = require('./tools');
const model = require('../models/page.js');

const Page = model.Page;

const createPage = (name, description, projectId, author) => {
  const now = new Date;
  return {
    name,
    author,
    description,
    projectId,
    createAt: now,
    updateAt: now
  };
};

exports.name = 'page';

exports.get = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Page.findById(id).then(
    page => tools.responseSuccess(res, page),
    err => tools.responseFailure(res, err)
  );
};

exports.getAll = (req, res) => {
  Page.find().then(
    page => tools.responseSuccess(res, Page),
    err => tools.responseFailure(res, err)
  );
};

exports.getAllByProjectId = (req, res) => {
  const projectId = req.params.projectId;
  const author = req.session.user;
  console.log('projectId:' + projectId);
  if (!author) {
    return tools.responseFailure(res, '登入超时');
  }
  if (!projectId) {
    tools.responseFailure(res, 'Invalid projectId');
  }
  Page.find({
    'projectId': projectId
  }).then(
    page => tools.responseSuccess(res, page),
    err => tools.responseFailure(res, err)
  );
};

// exports.saveOrUpdatePages = (req, res) => {
//   const pages = req.body;
//   if (!name) {
//     return tools.responseFailure(res, 'Invalid name');
//   }
//   if (!projectId) {
//     return tools.responseFailure(res, 'Invalid projectId');
//   }
//   if (!author) {
//     return tools.responseFailure(res, '登入超时');
//   }

//   if (_id) {
//     console.log('更新 Page :' + _id);
//     Page.findByIdAndUpdate(_id, {
//       name,
//       description,
//       projectId,
//       author,
//       updateAt
//     }).then(
//       page => tools.responseSuccess(res, page),
//       err => tools.responseFailure(res, err)
//     );
//   } else {
//     console.log('新建 Page :' + name);
//     Page.create(createPage(name, description, projectId, author)).then(
//       page => tools.responseSuccess(res, page),
//       err => tools.responseFailure(res, err)
//     );
//   }

// };

exports.create = (req, res) => {
  const _id = req.body._id;
  const name = req.body.name;
  const description = req.body.description;
  const projectId = req.body.project;
  const author = req.session.user;
  const updateAt = req.body.updateAt || new Date;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }
  if (!projectId) {
    return tools.responseFailure(res, 'Invalid projectId');
  }
  if (!author) {
    return tools.responseFailure(res, '登入超时');
  }

  if (_id) {
    console.log('更新 Page :' + _id);
    Page.findByIdAndUpdate(_id, {
      name,
      description,
      projectId,
      author,
      updateAt
    }).then(
      page => tools.responseSuccess(res, page),
      err => tools.responseFailure(res, err)
    );
  } else {
    console.log('新建 Page :' + name);
    Page.create(createPage(name, description, projectId, author)).then(
      page => tools.responseSuccess(res, page),
      err => tools.responseFailure(res, err)
    );
  }

};

exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const domain = req.body.domain;
  const description = req.body.description;
  const updateAt = req.body.updateAt || new Date;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }

  Page.findByIdAndUpdate(id, {
    name,
    description,
    domain,
    updateAt
  }).then(
    page => tools.responseSuccess(res, page),
    err => tools.responseFailure(res, err)
  );
};

exports.del = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Page.findByIdAndRemove(id).then(
    page => tools.responseSuccess(res, page),
    err => tools.responseFailure(res, err)
  );
};
