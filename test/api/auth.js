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
  describe('Signup', () => {
    before((done) => {
      User.remove({}, (error) => {
        if (error) return error;
        done();
      });
    });
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
        response.should.have.status(400);
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
        response.should.have.status(409);
        response.body.should.have.property('message');
        response.body.message.should.equal('User already exists');
        done();
      });
    });
  });

  describe('Login', () => {
    before((done) => {
      const user = new User({
        name: 'kissa andela',
        username: 'jjjk',
        email: 'kissa@andela',
        password: '123456',
      });
      user.save((error) => {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it('Should return an error on wrong email address', (done) => {
      const user = {
        email: 'kissass@andela',
        password: '123456'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((error, response) => {
        response.should.have.status(401);
        response.body.should.have.property('success').eql(false);
        response.body.should.have.property('message').eql('Authentication failed');
        done();
      });
    });

    it('Should return an error if password is invalid', (done) => {
      const user = {
        email: 'kissa@andela',
        password: 'pass'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((error, response) => {
        response.should.have.status(401);
        response.body.should.have.property('success').eql(false);
        response.body.should.have.property('message').eql('Authentication failed. Invalid Password');
        done();
      });
    });

    it('Should return an error on wrong email address and password', (done) => {
      const user = {
        email: 'kissass@andela',
        password: '1234s'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property('success').eql(false);
        response.body.should.have.property('message').eql('Authentication failed');
        done();
      });
    });

    it('Should return JWT on successful login', (done) => {
      const user = {
        email: 'kissa@andela',
        password: '123456'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.property('success').eql(true);
        response.body.should.have.property('token');
        response.body.should.have.property('message').eql('Authentication successful. User logged in');
        done();
      });
    });
  });
});

