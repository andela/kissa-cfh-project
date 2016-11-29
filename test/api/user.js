// var request = require('supertest');
// var mongoose = require ('mongoose');
// var app = require('../../server');
// var userFactory = require('../factories').user;

// // Globals
// var user;

// describe('Search api', function () {

//   'use strict';

//   beforeEach(function (done) {
//     user = new User(userFactory);
//     user.save(done);
//   });
//   afterEach(function (done) {
//     // Clear database.
//     mongoose.connection.db.dropDatabase(done);
//   });
//     it('routes successfully', function (done) {
//       request(app)
//         .get('/api/search/users?email=')
//         .expect(200, done);
//     });
//     it('expects correct users returned from the database', function (done){
//     	request(app)
//     	.get('/api/users')
//     	.expect('Content-Type', /json/)
//     	.expect(200,done);
//     });
// });