const path = require('path');

const rootPath = path.normalize(path.join(__dirname, '/../..'));
const keys = path.join(rootPath, '/keys.txt');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL || 'localhost:27017/cfh'
};
