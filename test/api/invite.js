<<<<<<< HEAD
<<<<<<< HEAD
/* eslint amd:true */
=======
>>>>>>> 201ff57... test(invite-user): create invite user test suite
=======
/* eslint amd:true */
>>>>>>> c50c211... fix(eslint): set eslint configuration
const app = require('../../server');
const request = require('supertest');

describe('Invite api', () => {
  describe('Send invite', () => {
    it('invites successfully', (done) => {
      request(app)
        .post('/api/invite/user')
        .send({ email: 'test@test.com', link: 'https://google.com' })
        .expect(200, done());
    });
  });
});
