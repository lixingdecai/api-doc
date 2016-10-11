const http = require('http');
const FormData = require('form-data');
var path = require('path');
// const tools = require('./tools');
// const config = require('../config');

exports.get = (req, res, next) => {
  console.log('美柚接口管理 index.html');
  res.sendFile(path.resolve('public/template/index.html'));
  // res.render('index', {
  //   title: '美柚接口管理'
  // });
};

exports.send = (req, res) => {
  try {
    const request = JSON.parse(req.body.request);
    const options = request.options || {};
    // console.log(options);
    if (options.headers) {
      const header = options.headers;
      // console.log(Headers);
      const headers = new Headers();
      Object.keys(header).forEach(v => headers.append(v, header[v].value));
      options.headers = headers;
    }

    if (options.method.slice(0, 1).toUpperCase() === 'P') {
      const body = options.body;
      if (body) {
        const type = body.type;
        const data = body[type];

        if (data) {
          const fd = new FormData;
          Object.keys(data).forEach(v => fd.append(v, data[v].value));
          options.body = fd;
        }
      }
    }

    console.info('[fetch] %s', request.input);
    fetch(request.input, options)
      .then(response => tools.createResponse(res, response))
      .catch(err => tools.responseFailure(res, err));
  } catch (e) {
    res.send(tools.createException('Invalid request', e));
  }

};
