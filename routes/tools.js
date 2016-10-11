exports.createResponse = (res, response) => {
  const ok = response.ok;
  const status = response.status;
  const headers = response.headers._headers;

  response.json()
    .then(json => {
      res.send({ ok, status, headers, json });
    })
    .catch(error => res.send({ error }));
};

exports.createException = (info, e) => {
  return { status: 'error', error: e.toString(), info };
};

exports.random = () => {
  return Math.random().toString(16).slice(2);
};

exports.createId = () => {
  return exports.random() + exports.random();
};

exports.responseSuccess = (res, response) => {
  return res.send({
    status: 'success',
    response
  });
};

exports.responseFailure = (res, error) => {
  return res.send({
    status: 'failed',
    error: error.toString()
  })
};
