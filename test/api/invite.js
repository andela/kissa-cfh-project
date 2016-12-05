<<<<<<< HEAD
/* eslint amd:true */
=======
>>>>>>> 201ff57... test(invite-user): create invite user test suite
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
