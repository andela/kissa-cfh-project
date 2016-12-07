const app = require('../../server');
const request = require('supertest');

describe('Invite API', () => {
  describe('Send invite', () => {
    it('should send invites successfully', (done) => {
      request(app)
        .post('/api/invite/user')
        .send({ email: 'test@test.com', link: 'https://google.com' })
        .expect(200, done());
    });
  });
});
