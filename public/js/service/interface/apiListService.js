const angular = require('angular');
angular.module('apiList.services', [])
  .factory('apiListService', ($http, $q) => {
    const interfaceListService = {};
    interfaceListService.searchApi = (query) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.post('/api/search', query).success((data) => {
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
    return interfaceListService;
  });
