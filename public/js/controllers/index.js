angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'dataFactory', function ($scope, Global, $location, socket, game, AvatarService, dataFactory) {
  $scope.global = Global;

  $scope.playAsGuest = function() {
    game.joinGame();
    $location.path('/app');
  };

  $scope.showError = function() {
    if ($location.search().error) {
      return true;
    } else {
      return false;
    }
  };

  if (window.user !== null) {
    dataFactory.getMessages('/api/users/get-messages')
    .success(function(data, status, headers, config) {
      $scope.invitation = data;
    })
    .error(function (data, status, headers, config) {
      $scope.noResult = status;
    });
  }

  $scope.readMessage = function(inviteId) {
    const link = `/api/users/view-message/${inviteId}`;
    dataFactory.viewMessage(link)
    .success(function(data, status, headers, config) {
      $scope.hasRead = data.read;
    })
    .error(function (data, status, headers, config) {
      $scope.noResult = status;
    });
  }

  $scope.showEmail = $location.search().email;
  $scope.gameId = $location.search().game;

  $scope.avatars = [];
  AvatarService.getAvatars()
    .then(function(data) {
      $scope.avatars = data;
    });

}]);
