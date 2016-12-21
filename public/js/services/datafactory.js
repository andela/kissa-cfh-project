angular.module('mean.system')
  .factory('dataFactory', ['$http', function ($http) {
    let dataFactory = {};

    dataFactory.saveGameHistory = function(route, form) {
      return $http({
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          creator: form.creator,
          friends: form.friends
        }
      });
    };
    
    dataFactory.updateGameHistory = function(route, form) {
      return $http({
        method: 'PUT',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          creator: form.creator,
          winner: form.winner,
          status: form.status,
          rounds: form.rounds,
          friends: form.friends
        }
      });
    };

    dataFactory.searchUsers = function(word, type) {
      const link = type === 'users' ? `/api/search/users/${word}` : `/api/search/users/friends/${word}`;
      return $http.get(link);
    };

    dataFactory.sendInvites = function(mode, form) {
      const route = mode === 'users' ? '/api/users/email-invite' : '/api/users/send-message';
      const friendId = mode === 'friends' ? form.friendId : '';
      return $http({
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: form.email,
          link: form.link,
          sender: form.sender,
          userId: friendId
        }
      });
    };

    dataFactory.addFriends = function(route, form) {
      return $http({
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          friendEmail: form.email
        }
      });
    };

    dataFactory.getMessages = function(route) {
      return $http.get(route);
    };

    dataFactory.sendMessage = function(route, form) {
      return $http({
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: form.email,
          userId: form.userId,
          sender: form.sender,
          link: form.link
        }
      });
    };

    dataFactory.viewMessage = function(route) {
      return $http.get(route);
    };

    dataFactory.getGameHistory = function(route) {
      return $http.get(route);
    };

    dataFactory.getSingleHistory = function(route) {
      return $http.get(route);
    };

    return dataFactory;
  }]);