/* eslint no-console:0*/
const mongoose = require('mongoose');
const config = require('../config');

const db = mongoose.connection;
const CONNECTION_URL = config.db.CONNECTION_URL;

db.on('error', console.error.bind(console, '[MongoDB] connection error:'));
db.once('open', () => console.log('[MongoDB] we\'re connected!'));

mongoose.connect(CONNECTION_URL);
console.log(`[MongoDB] connecting to ${CONNECTION_URL}`);

exports.db = db;
