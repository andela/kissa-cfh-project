var path = require('path');

var rootPath = path.normalize(__dirname + '/../..'),
  keys = rootPath + '/keys.txt';

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL || 'localhost:27017/cfh'
};
