const angular = require('angular');
angular.module('login.services', [])
  .factory('loginService', ($http, $q) => {
    const loginService = {};


    loginService.checklogin = () => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/checklogin').success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    loginService.login = (userInfo) => {
      console.log('login');
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.post('/login', userInfo).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    loginService.loginOut = () => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/logout').success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    return loginService;
  });
