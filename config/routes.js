/* eslint amd:true */
const users = require('../app/controllers/users');
const answers = require('../app/controllers/answers');
const avatars = require('../app/controllers/avatars');
const questions = require('../app/controllers/questions');
const index = require('../app/controllers/index');
const invite = require('../app/controllers/api/invites');
const search = require('../app/controllers/api/search');
const game = require('../app/controllers/api/game');
const jwtAuth = require('../app/controllers/api/auth');


const routes = (app, passport) => {
  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);
  app.get('/playgame', users.playGame);

  // Setting up the users api
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

  // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Avatar Routes
  app.get('/avatars', avatars.allJSON);

  // Home route
  app.get('/play', index.play);
  app.get('/', index.render);
  app.get('/gametour', index.gameTour);

  // Search Users api
  app.get('/api/search/users/:email', users.authenticate, search.users);
  app.get('/api/search/users/friends/:email', users.authenticate, search.searchFriends);
  app.post('/api/users/friends', users.authenticate, search.addFriend);

  // Auth api sign up route
  app.post('/api/auth/signup', jwtAuth.signUp);
  app.post('/api/auth/login', jwtAuth.login);

  // Game Play Routes
  app.post('/api/games/:id/start', users.authenticate, game.create);
  app.put('/api/games/:id/start', users.authenticate, game.update);

  // Get game history
  app.get('/api/games/history/:userid/:gameid',users.authenticate, game.gameDetails);
  app.get('/api/games/history/:userid',users.authenticate, game.gameLog);

  // Invite users with nodemailer
  app.post('/api/users/email-invite', users.authenticate, invite.emailinvite);

  // Invite Users and Friends
  app.post('/api/users/send-message', users.authenticate, invite.appMessage);
  app.get('/api/users/get-messages', users.authenticate, invite.getMessages);
  app.get('/api/users/view-message/:id', users.authenticate, invite.viewMessage);
};

module.exports = routes;
