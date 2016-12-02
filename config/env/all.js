const path = require('path');

const rootPath = path.normalize(path.join(__dirname, '/../..'));
let db = null;
if (process.env.NODE_ENV === 'development') {
  db = process.env.MONGODEV_URL;
}
if (process.env.NODE_ENV === 'test') {
  db = process.env.MONGOTEST_URL;
}
if (process.env.NODE_ENV === 'production') {
  db = process.env.MONGOHQ_URL;
}
module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: db,
};