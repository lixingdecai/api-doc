const angular = require('angular');
angular.module('login.controllers', [])
  .controller('loginCtrl',
    function ($scope, $rootScope, $state, loginService) {
      $rootScope.showNav = false;
      console.log('登入');
      $scope.title = '接口管理列表';
      $scope.login = () => {
        loginService.login($scope.userInfo).then(result => {
          console.log(result);
          $rootScope.showNav = true;
          // $rootScope.user = result;
          $state.go('apiList');
        }, error => {
          alert(error);
        });
      };
    }
  );
