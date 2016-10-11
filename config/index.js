exports.db = require('./db');
exports.redis = require('./redis').redis;
exports.publicPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:8080/' : '/dist/';
