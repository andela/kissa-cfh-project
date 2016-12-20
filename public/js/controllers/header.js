angular.module('mean.system')
.controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }];

    dataFactory.getMessages('/api/users/get-messages')
    .success(function(data, status, headers, config) {
      $scope.invitation = data.length;
    })
    .error(function (data, status, headers, config) {
      $scope.noResult = status;
    });
}]);