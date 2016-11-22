'use strict';
let mongoose = require('mongoose');
const User = mongoose.model('User'),
	   jwt = require('jsonwebtoken'),
	   config = require('../../config/env/all');

//signup method
module.exports.signUp = (req, res) =>  {
	User.findOne({email: req.body.email}, (err, registeredUser) => {
		if (err) return err;
		//Check if email does not exists
		if(!registeredUser) {
			if (req.body.email && req.body.name && req.body.password) {
				const user = new User();
				user.email = req.body.email;
				user.name = req.body.name;
				user.password = req.body.password;
				user.avatar = req.body.avatar;
				//save the user in the database
				user.save(function(err, user) {
					if (err) return err;
					const token = jwt.sign(user, config.secret, {expiresIn: '24h'});
					res.json({success: true, message: 'You have successfully signed up!', token:token});
				});
			} else {
				res.send('Authentication failed. No field can be empty!');
			}
		} else {
			res.send('User already available');
		}
	});
}
//login method
module.exports.login = (req, res) => {
	User.findOne({email: req.body.email}, (err, user) => {
		if (err) return err;
		//check if email does not exists
		if (!user) {
			res.json({success: false, message: 'Incorrect email or password'});
		} else {
			//check if user password against the one the database
			if (!user.authenticate(req.body.password)) {
				res.json({success: false, message: 'Authentication failed'});
			} else {
				//if everyhing is fine, assign a token to the user
				const token = jwt.sign(user, config.secret, {expiresIn: '24h'});
				res.json({success: true, message: 'Login is successfull', token: token});
			}
		}
	});
}