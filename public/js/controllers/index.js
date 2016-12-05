angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', function ($scope, Global, $location, socket, game, AvatarService) {
  $scope.global = Global;

  $scope.playAsGuest = () => {
    game.joinGame();
    $location.path('/app');
  };

  $scope.showError = () => {
    if ($location.search().error) {
      return $location.search().error;
    } else {
      return false;
    }
  };

  $scope.showEmail = $location.search().email;
<<<<<<< HEAD

  $scope.avatars = [];
  AvatarService.getAvatars()
    .then((data) => {
      $scope.avatars = data;
    });
=======
>>>>>>> 3dc3a20cae22c3b2397a41260a0903d411dfa38e

  $scope.avatars = [];
  AvatarService.getAvatars()
    .then(function(data) {
        $scope.avatars = data;
    });
}]);
