/*  eslint-disable no-unused-vars*/
/*  eslint amd:true */
const server = require('../../server');
const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');

const User = mongoose.model('User');
const should = chai.should();
chai.use(chaiHttp);

describe('Authenticate', () => {
  before((done) => {
    User.remove({}, (error) => {
      if (error) return error;
      done();
    });
  });

  describe('Signup', () => {
    it('should fail authetication when required fields are empty', (done) => {
      const user = {
        name: 'kissa231',
        email: 'everything@kissa2314.com',
        avatar: '',
        password: ''
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((error, response) => {
        response.body.should.have.property('message');
        response.body.message.should.equal('Authentication failed. No field can be empty!');
        done();
      });
    });

    it('should give user jwt token on successful signup', (done) => {
      const user = {
        name: 'kissa',
        email: 'everything@kissa.com',
        avatar: '',
        password: 'password1'
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        response.body.should.have.property('token');
        response.body.message.should.equal('You have successfully signed up!');
        done();
      });
    });

    it('should fail when user exists', (done) => {
      const user = {
        name: 'kissa',
        email: 'everything@kissa.com',
        avatar: '',
        password: 'password1'
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((error, response) => {
        response.body.should.have.property('message');
        response.body.message.should.equal('User already available');
        done();
      });
    });
  });
});
