<<<<<<< HEAD
/* eslint strict:0 */
/* eslint amd:true */
<<<<<<< HEAD

'use strict';

=======
/* eslint amd:true */
>>>>>>> b0e3e77... test(search-user): create search user test suite
=======
'use strict';
>>>>>>> 63ec263... fix(mocha-error): add use strict to search.js test file
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');

let user = '';

describe('Search api', () => {
  beforeEach((done) => {
    user = new User({
      name: 'Full name',
      email: 'search@search.com',
      username: 'user',
      password: 'password'
    });
    user.save(done);
  });

  afterEach((done) => {
    done();
  });

  describe('login route', () => {
    it('should login for valid user', (done) => {
      request(app).post('/users/session')
        .send({ email: user.email, password: user.password })
        .expect(302, done);
    });
  });

  describe('Search route', () => {
    it('routes successfully', (done) => {
      request(app)
        .get('/api/search/users/search@search.com')
        .send(user)
        .expect(200, done());
    });
    it('returns not found when no word is entered', (done) => {
      request(app)
        .get('/api/search/users/')
        .send(user)
        .expect(404, done());
    });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> b0e3e77... test(search-user): create search user test suite
