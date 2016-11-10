/* eslint no-console: 0*/
const url = require('url');
const async = require('async');
const nodemailer = require('nodemailer');
const tools = require('./tools');
const model = require('../models/api');
const log = require('../models/log');
const favourite = require('../models/favourite');
const apiHistoryM = require('../models/apiHistory');
const Api = model.Api;
const ApiHistory = apiHistoryM.ApiHistory;
const fields = model.fields;
const transport = nodemailer.createTransport('SMTP', {
  host: 'smtp.exmail.qq.com'
  , secureConnection: true
  , port: 465
  , auth: {
    user: 'apidoc@linggan.com'
    , pass: 'Wp861121'
  }
});
const findAllProjection = model.findAllProjection;
const distinctionFields = model.distinctionFields;
const composeApi = req => {
  const kv = {};
  const body = req.body;
  if (body.url) {
    const parts = url.parse(body.url);  
    kv.host = parts.host;
    kv.pathname = parts.pathname;
  }
  Object.keys(fields).forEach(v => {
    if (body[v] === undefined) {
      return;
    }
    // if (fields[v] !== String) {
    //   console.log('body[v]:' + body[v]);
    //   // kv[v] = JSON.parse(body[v]);
    // } else {
    //   kv[v] = body[v];
    // }
    kv[v] = body[v];
  });
  return kv;
};
const createDistinction = (res, field) => {
  Api.distinct(field).then(tags => tools.responseSuccess(res, tags), err => tools.responseFailure(res, err));
};
exports.name = 'api';
exports.distinctionFields = distinctionFields;
exports.get = (req, res) => {
  const id = req.params.id;
  if (!id) {
    tools.responseFailure(res, 'Invalid id');
    return;
  }
  Api.findById(id).populate('products').then(
    (_api) => {
      const t = _api.toJSON();
      t.logs = null;
      // 同步获取出api的更新日志；
      log.Log.find({
        api: id
      }).populate('user').lean().exec((err, list) => {
        if (err) {
          tools.responseFailure(res, err);
        } else {
          t.logs = list;
          tools.responseSuccess(res, t);
        }
      });
    }, (err) => tools.responseFailure(res, err));
};
exports.getAllByProjectId = (req, res) => {
  const project = req.params.projectId;
  const author = req.session.user;
  console.log('project:' + project);
  if (!author) {
    tools.responseFailure(res, '登入超时');
    return;
  }
  if (!project) {
    tools.responseFailure(res, 'Invalid project');
    return;
  }
  Api.find({
    'project': project
  }).populate('products updateBy createBy').populate('tags').then(apis => tools.responseSuccess(res, apis), err =>
    tools.responseFailure(res, err));
};
exports.getAll = (req, res) => {
  Api.find({
    mark: 0
  }, findAllProjection).then(apis => tools.responseSuccess(res, apis), err => tools.responseFailure(res, err));
};
exports.create = (req, res) => {
  if (!req.session.user) {
    tools.responseFailure(res, '请求超时');
    return;
  }
  const project = req.body.project;
  const pageId = req.body.pageId;
  const id = req.body._id;
  if (!project) {
    tools.responseFailure(res, '缺少 project');
  }
  if (!pageId) {
    tools.responseFailure(res, '缺少 pageId');
  }
  const data = composeApi(req);
  const now = new Date;
  if (!data.updateAt) {
    data.updateAt = now;
  }
  if (!data.updateBy) {
    data.updateBy = req.session.user._id;
  }
  if (id) {
    data.updateBy = req.session.user._id;
    data.updateAt = now;
    const apiHistory = data;
    // apiHistory._id = undefined;
    apiHistory.apiId = id;
    ApiHistory.create(apiHistory).then(result => {
      console.log('存历史成功');
    }, err => {
      console.log('存历史失败' + err);
    });
    Api.findByIdAndUpdate(id, data).then(
      (_api) => {
        const _log = new log.Log({
          description: req.body.log
          , user: req.session.user._id
          , api: id
        });
        _log.save(() => {
          sendUpdateMail(id, data.title, req.body.log, req.session.user);
          tools.responseSuccess(res, _api);
        });
      }, (err) => tools.responseFailure(res, err));
  } else {
    if (!data.createAt) {
      data.createAt = now;
    }
    if (!data.createBy) {
      data.createBy = req.session.user._id;
    }
    Api.create(data).then(api => tools.responseSuccess(res, api), err => tools.responseFailure(res, err));
  }
};
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  if (!req.session.user) {
    return tools.responseFailure(res, '未登录！');
  }
  const data = composeApi(req);
  if (!data.updateAt) {
    data.updateAt = new Date;
  }
  if (!data.updateBy) {
    data.updateBy = req.session.user._id;
  }
  Api.findByIdAndUpdate(id, data).then(
    (_api) => {
      const _log = new log.Log({
        description: req.body.log
        , user: req.session.user._id
        , api: id
      });
      _log.save(() => {
        sendUpdateMail(id, data.title, req.body.log, req.session.user);
        tools.responseSuccess(res, _api);
      });
    }, (err) => tools.responseFailure(res, err));
};
const sendUpdateMail = (id, title, _log, _to) => {
  favourite.Favourite.find({
    api: id
  }).populate('user').lean().exec((err, list) => {
    const emails = []; // cc
    list.forEach((item) => {
      if (item.user && item.user.email && item.user.email.lastIndexOf('@') > 0) {
        emails.push(item.user.email);
      }
    });
    const config = {
      from: 'apidoc@linggan.com'
      , to: _to.email
      , cc: emails
      , subject: `${title} 更新通知`
      , generateTextFromHTML: true
      , html: `
        <p>${_to.name} 对 <a href="http://apidoc.meiyou.com/#/detail/${id}">${title}</a> 进行了更新操作，<a href="http://apidoc.meiyou.com/#/detail/${id}">点击链接</a>查看明细；</p>
        <p>更新日志：</p>
        <div>${_log}</div>
      `
    };
    if (!emails.length) {
      delete config.cc;
    }
    transport.sendMail(config, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Message sent to: ${_to.email}; response: ${response.message}`);
      }
      transport.close();
    });
  });
};
exports.del = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return tools.responseFailure(res, 'Invalid id');
  }
  Api.findByIdAndRemove(id).then(api => tools.responseSuccess(res, api), err => tools.responseFailure(res, err));
};
exports.pageList = (req, res) => {
  const pageSize = parseInt(req.params.pageSize);
  const currPage = parseInt(req.params.currPage);
  const skip = (currPage - 1) * pageSize;
  const user = req.session.user;
  if (!user) {
    tools.responseFailure(res, '请求超时');
    return;
  }
  const condition = {};
  const query = req.params;
  condition.mark = 0;
  if (query['project'] != 'undefined') {
    condition.project = query.project;
  }
  ['title', 'url', 'pathname'].forEach(q => {
    if (query[q] != 'undefined') {
      condition[q] = new RegExp(query[q], 'i');
    }
  });
  ['tags', 'products'].forEach(q => {
    if (query[q] != 'undefined') {
      condition[q] = {
        $in: query[q].split(',')
      };
    }
  });
  // condition.updateAt = {
  //   $gte: query.updateBegin,
  //   $lte: query.updateEnd
  // }
  if (query.favourite != 'undefined') {
    favourite.Favourite.find({
      user: user._id
    }).then((favourites) => {
      if (favourites && favourites.length > 0) {
        var ids = [];
        for (var j = 0; j < favourites.length; j++) {
          ids.push(favourites[j].api);
        }
        condition._id = {
          $in: ids
        };
      }
      var q = Api.find(condition, findAllProjection);
      if (query.updateBegin != 'undefined') {
        q.where('updateAt').gte(query.updateBegin);
      }
      if (query.updateEnd != 'undefined') {
        q.where('updateAt').lte(query.updateEnd);
      }
      // query.exec(function(err, docs) {
      //   // called when the `query.complete` or `query.error` are called
      //   // internally
      // });
      // console.log(condition);
      q.skip(skip).limit(pageSize).populate('project products updateBy createBy').then(apis => {
        // console.log('apis success' + apis);
        favourite.Favourite.find({
          user: user._id
        }).then((favourites) => {
          // console.log('favourites success' + favourites);
          apis.forEach(api => {
            api['favourite'] = false;
            favourites.forEach(favourite => {
              // console.log(api._id + ' ---- ' + favourite.api);
              // console.log(favourite.api.equals(api._id));
              if (favourite.api.equals(api._id)) {
                // console.log(api);
                api['favourite'] = true;
              }
            });
          });
          // console.log(apis);
          // apis.favourite = true;
          // console.log(apis);
          tools.responseSuccess(res, apis);
        }, err => tools.responseFailure(res, err));
        // tools.responseSuccess(res, apis)
      }, err => tools.responseFailure(res, err));
    }, err => tools.responseFailure(res, err));
  } else {
    var q = Api.find(condition, findAllProjection);
    if (query.updateBegin != 'undefined') {
      q.where('updateAt').gte(query.updateBegin);
    }
    if (query.updateEnd != 'undefined') {
      q.where('updateAt').lte(query.updateEnd);
    }
    q.skip(skip).limit(pageSize).populate('project products updateBy createBy').then(apis => {
      // console.log('apis success' + apis);
      favourite.Favourite.find({
        user: user._id
      }).then((favourites) => {
        // console.log('favourites success' + favourites);
        apis.forEach(api => {
          api['favourite'] = false;
          favourites.forEach(favourite => {
            // console.log(api._id + ' ---- ' + favourite.api);
            // console.log(favourite.api.equals(api._id));
            if (favourite.api.equals(api._id)) {
              // console.log(api);
              api['favourite'] = true;
            }
          });
        });
        // console.log(apis);
        // apis.favourite = true;
        // console.log(apis);
        tools.responseSuccess(res, apis);
      }, err => tools.responseFailure(res, err));
      // tools.responseSuccess(res, apis)
    }, err => tools.responseFailure(res, err));
  }
};
exports.totalCount = (req, res) => {
  const condition = {};
  const query = req.params;
  const user = req.session.user;
  // console.log('query:::: ');
  // console.log(query);
  condition.mark = 0;
  if (query['project'] != 'undefined') {
    condition.project = query.project;
  }
  ['title', 'url', 'pathname'].forEach(q => {
    if (query[q] != 'undefined') {
      condition[q] = new RegExp(query[q], 'i');
    }
  });
  ['tags', 'products'].forEach(q => {
    if (query[q] != 'undefined') {
      condition[q] = {
        $in: query[q].split(',')
      };
    }
  });
  if (query.favourite != 'undefined') {
    favourite.Favourite.find({
      user: user._id
    }).then((favourites) => {
      if (favourites && favourites.length > 0) {
        var ids = [];
        for (var j = 0; j < favourites.length; j++) {
          ids.push(favourites[j].api);
        }
        condition._id = {
          $in: ids
        };
      }
      var q = Api.find(condition);
  if (query.updateBegin != 'undefined') {
    q.where('updateAt').gte(query.updateBegin);
  }
  if (query.updateEnd != 'undefined') {
    q.where('updateAt').lte(query.updateEnd);
  }
  q.count(function (err, count) {
    tools.responseSuccess(res, count);
  });
    }, err => tools.responseFailure(res, err));
  } else {
var q = Api.find(condition);
  if (query.updateBegin != 'undefined') {
    q.where('updateAt').gte(query.updateBegin);
  }
  if (query.updateEnd != 'undefined') {
    q.where('updateAt').lte(query.updateEnd);
  }
  q.count(function (err, count) {
    tools.responseSuccess(res, count);
  });
  }
  
};
exports.search = (req, res) => {
  const user = req.session.user;
  if (!user) {
    tools.responseFailure(res, '请求超时');
    return;
  }
  const condition = {};
  const query = req.body;
  // console.log('query:::: ');
  // console.log(query);
  if (query['project']) {
    condition.project = query.project;
  }
  ['title', 'url', 'pathname'].forEach(q => {
    if (query[q]) {
      condition[q] = new RegExp(query[q], 'i');
    }
  });
  ['tags', 'products'].forEach(q => {
    if (query[q]) {
      condition[q] = {
        $in: query[q].split(',')
      };
    }
  });
  // condition.updateAt = {
  //   $gte: query.updateBegin,
  //   $lte: query.updateEnd
  // }
  var q = Api.find(condition, findAllProjection);
  if (query.updateBegin) {
    q.where('updateAt').gte(query.updateBegin);
  }
  if (query.updateEnd) {
    q.where('updateAt').lte(query.updateEnd);
  }
  // query.exec(function(err, docs) {
  //   // called when the `query.complete` or `query.error` are called
  //   // internally
  // });
  // console.log(condition);
  q.populate('project products updateBy createBy').then(apis => {
    // console.log('apis success' + apis);
    favourite.Favourite.find({
      user: user._id
    }).then((favourites) => {
      // console.log('favourites success' + favourites);
      apis.forEach(api => {
        api['favourite'] = false;
        favourites.forEach(favourite => {
          // console.log(api._id + ' ---- ' + favourite.api);
          // console.log(favourite.api.equals(api._id));
          if (favourite.api.equals(api._id)) {
            // console.log(api);
            api['favourite'] = true;
          }
        });
      });
      // console.log(apis);
      // apis.favourite = true;
      // console.log(apis);
      tools.responseSuccess(res, apis);
    }, err => tools.responseFailure(res, err));
    // tools.responseSuccess(res, apis)
  }, err => tools.responseFailure(res, err));
};
distinctionFields.forEach(field => exports[field] = (req, res) => createDistinction(res, field));

