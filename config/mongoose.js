const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;
const db = mongoose.connection;
const CONNECTION_URL = config.db.CONNECTION_URL;

db.on('error', console.error.bind(console, '[MONGODB] connection error:'));
db.once('open', () => console.log('[MONGODB] is connected'));
mongoose.connect(CONNECTION_URL);
console.log(`[MONGODB] try to connecting ${CONNECTION_URL}`);

exports.db = db;
