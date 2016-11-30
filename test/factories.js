var mongoose = require('mongoose');
  User = mongoose.model('User');
var faker = require("faker");
exports.user = {
	name : faker.name.findName(),
	email : faker.internet.email(),
	password : faker.internet.password()
};

