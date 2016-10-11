const angular = require('angular');
angular.module('start.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$state', 'loginService', function($scope, $rootScope, $state, loginService) {
    // $rootScope.showNav = true;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('检查是否登入');
      if (toState.name === 'login') return; // 如果是进入登录界面则允许
      loginService.checklogin().then(
        success => {

        }, err => {
          alert('请先登录');
          $state.go('login');
        }
      );
    });
    $scope.logout = () => {
      loginService.loginOut().then(
        () => $state.go('login'),
        () => console.log('退出失败')
      );
    }
  }])
  .factory('httpInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
    var httpInterceptor = {
      request: function(config) {
        $rootScope.loading = true;
        // config.requestTimestamp = new Date().getTime();
        return config;
      },
      'responseError': function(response) {
        if (response.status == 401) {
          // var rootScope = $injector.get('$rootScope');
          // var state = $injector.get('$rootScope').$state.current.name;
          // rootScope.stateBeforLogin = state;
          // rootScope.$state.go("login");
          return $q.reject(response);
        } else if (response.status === 404) {
          alert("404!");
          return $q.reject(response);
        }
      },
      'response': function(response) {
        // $rootScope.loading = false;
        return response;
      }
    }
    return httpInterceptor;
  }]);
