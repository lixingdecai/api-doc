angular.module('utils', []).factory('httpInterceptor', ['$q', '$injector', '$rootScope', function ($q, $injector
  , $rootScope) {
  var httpInterceptor = {
    request: (config) => {
      $rootScope.loading = true;
      // config.requestTimestamp = new Date().getTime();
      return config;
    }
    , responseError: (response) => {
      if (response.status == 401) {
        // var rootScope = $injector.get('$rootScope');
        // var state = $injector.get('$rootScope').$state.current.name;
        // rootScope.stateBeforLogin = state;
        // rootScope.$state.go("login");
        return $q.reject(response);
      } else if (response.status === 404) {
        // alert("404!");
        return $q.reject(response);
      }
      return response;
    }
    , response: (response) => {
      // $rootScope.loading = false;
      return response;
    }
  };
  return httpInterceptor;
}]).directive('unique', function ($http) {
  return {
    require: 'ngModel'
    , link: function (scope, elm, attrs, ctrl) {
      elm.bind('blur', function () {
        var dirty = attrs.dirty;
        if(dirty === 'false'){
          ctrl.$setValidity('unique', true);
          return;
        }
        $http({
          method: 'GET'
          , url: '/checkUnique/' + attrs.dname + '/' + attrs.dvalue
        }).success(function (data, status, headers, config) {
          if (data.status == 'success') {
            if (data.response.length > 0) {
              ctrl.$setValidity('unique', false);
            } else {
              ctrl.$setValidity('unique', true);
            }
          } else {
            ctrl.$setValidity('unique', true);
          }
        }).error(function (data, status, headers, config) {
          ctrl.$setValidity('unique', true);
        });
      });
    }
  };
});

