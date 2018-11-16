const angular = require('angular');
angular.module('mock.controllers', [])
  .controller('mockCtrl',
    function ($scope, $rootScope, $state, apiInfoService, $stateParams) {
      const apiId = $stateParams.apiId;
      apiInfoService.getApiById(apiId).then(result => {
        $scope.apiInfo = result;
        console.log($scope.apiInfo);
      },
      err => {
        console.log(err);
      });
    }
  );
