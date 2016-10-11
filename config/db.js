const DB_NAME = process.env.NODE_ENV !== 'production' ? 'docs_test' : 'docs2';

const DB = {
  HOST: 'localhost',
  NAME: DB_NAME
};

exports.DB = DB;
exports.CONNECTION_URL = `mongodb://${DB.HOST}/${DB.NAME}`;
