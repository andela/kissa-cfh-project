angular.module('mean.system').
  controller('DashboardController', ['$scope', 'dataFactory', '$modal', function($scope, dataFactory, $modal) {
    function showModal(result, template) {
      $scope.animationsEnabled = true;
        $scope.messageBody = result;
        $scope.modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          scope: $scope,
          ariaDescribedBy: 'modal-body',
          templateUrl: template,
          controller: 'DashboardController',
          size: 'sm',
          appendTo: angular.element(document).find('#game-log-button'),
          resolve: {
            items: function () {
              return $scope.messageBody;
            }
          }
        });
    }
    $scope.closeModal = () => {
      $scope.modalInstance.close();
    };

    $scope.viewGameLog = () => {
      if (!$scope.showGameLog) {
        const link = `/api/games/history/${window.user._id}`;
        $scope.result = dataFactory.getGameHistory(link).success((response) => {
          $scope.data = response;
        })
        .error((response) => {
          $scope.data = "An error occurred when trying to get game log";
        });
        $scope.showGameLog = true;
      } else {
        $scope.showGameLog = false;
      }    
    };
    $scope.singleLog = (game_id) => {
      const link = `/api/games/history/${window.user._id}/${game_id}`;
      $scope.single = dataFactory.getSingleHistory(link)
      .success((response) => {
        showModal(response, '/views/dashboard-modal.html');
      })
      .error((response) => {
        showModal('An error occurred', '/views/dashboard-modal.html');
      });
    };
  }]);
