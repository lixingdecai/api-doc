/* eslint no-console: 0*/
const url = require('url');
const nodemailer = require('nodemailer');
const tools = require('./tools');
const log = require('../models/log');
const model = require('../models/apiHistory');
const api = require('../models/api');
const user = require('./user');

const ApiHistory = model.ApiHistory;
const User = model.User;
const fields = model.fields;

exports.findByApiId = (req, res) => {
  const apiId = req.params.apiId;
  if (!apiId) {
    return tools.responseFailure(res, 'Invalid apiId');
  }
  console.log('apiId : ' + apiId);


  ApiHistory.find({apiId: apiId}).populate('createBy updateBy').then(
    apiHistory => {
      tools.responseSuccess(res, apiHistory)
    },
    err => tools.responseFailure(res, err)
  );
};

exports.get = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }

  ApiHistory.findById(id).then(
    apiHistory => tools.responseSuccess(res, apiHistory),
    err => tools.responseFailure(res, err)
  );
};
