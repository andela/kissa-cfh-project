/*  eslint-disable no-unused-vars*/
/*  eslint amd:true */
const server = require('../../server');

const chai = require('chai');
const mongoose = require('mongoose');

const User = mongoose.model('User');

const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);
describe('Authenticate', () => {
  before((done) => {
    User.remove({}, (err) => {
      if (err) return err;
      done();
    });
  });
  describe('on signup', () => {
    it('should have no fields empty', (done) => {
      const user = {
        name: 'kissa231',
        email: 'everything@kissa2314.com',
        avatar: '',
        password: ''
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.message.should.equal('Authentication failed. No field can be empty!');
        done();
      });
    });
    it('should give token on successful signup', (done) => {
      const user = {
        name: 'kissa',
        email: 'everything@kissa.com',
        avatar: '',
        password: 'password1'
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.should.have.property('token');
        res.body.message.should.equal('You have successfully signed up!');
        done();
      });
    });
    it('should not be an existing user', (done) => {
      const user = {
        name: 'kissa',
        email: 'everything@kissa.com',
        avatar: '',
        password: 'password1'
      };
      chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.message.should.equal('User already available');
        done();
      });
    });
  });
});
