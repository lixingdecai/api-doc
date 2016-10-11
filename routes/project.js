const tools = require('./tools');
const model = require('../models/project.js');

const Project = model.Project;

const createProject = (name, description, domain) => {
  const now = new Date;
  return {
    name,
    domain,
    description,
    createAt: now,
    updateAt: now
  };
};

exports.name = 'project';

exports.get = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Project.findById(id).then(
    project => tools.responseSuccess(res, project),
    err => tools.responseFailure(res, err)
  );
};

exports.getAll = (req, res) => {
  Project.find().then(
    projects => tools.responseSuccess(res, projects),
    err => tools.responseFailure(res, err)
  );
};

exports.create = (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const domain = req.body.domain;
  if (!name) {
    return tools.responseFailure(res, 'Invalid name');
  }

  Project.create(createProject(name, description, domain)).then(
    project => tools.responseSuccess(res, project),
    err => tools.responseFailure(res, err)
  );
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

  Project.findByIdAndUpdate(id, { name, description, domain, updateAt }).then(
    project => tools.responseSuccess(res, project),
    err => tools.responseFailure(res, err)
  );
};

exports.del = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  Project.findByIdAndRemove(id).then(
    project => tools.responseSuccess(res, project),
    err => tools.responseFailure(res, err)
  );
};
