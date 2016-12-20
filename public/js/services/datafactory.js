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
      })
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

    dataFactory.searchUsers = function(route) {
      return $http.get(route);
    };

    dataFactory.sendInvites = function(route, form) {
      return $http({
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: form.email,
          link: form.link,
          sender: form.sender
        }
      })
    }

    dataFactory.getGameHistory = function(route) {
      return $http.get(route);
    };

    dataFactory.getSingleHistory = function(route) {
      return $http.get(route);
    };

    return dataFactory;
  }]);