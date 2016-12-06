/**
 * module dependencies
 */
process.env.NODE_ENV = 'development';

const chai = require('chai');

const chaiHttp = require('chai-http');
const server = require('../../server');

const mongoose = require('mongoose');

const User = mongoose.model('User');
chai.use(chaiHttp);

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
        response.body.should.have.property('message');
        response.body.should.have.property('success');
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
        response.body.should.have.property('message');
        response.body.should.have.property('success');
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
        response.body.should.have.property('message');
        response.body.should.have.property('success');
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
        response.body.should.have.property('message');
        response.body.should.have.property('success');
        response.body.should.have.property('token');
        done();
      });
  });
});
