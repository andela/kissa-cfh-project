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
        method: 'POST',
        url: route,
        headers: { 'Content-Type': 'application/json' },
        data: {
          gameDataId: form.gameKey,
          winner: form.winner,
          status: form.status,
          rounds: form.rounds
        }
      })
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

    return dataFactory;
  }]);