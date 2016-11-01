const angular = require('angular');
angular.module('apiList.services', []).factory('apiListService', ($http, $q) => {
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
  interfaceListService.pageList = (page, query) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    
    $http.get('/apiPageList/' + page.pageSize + '/' + page.currPage + '/' + query.url + '/' + query.title + '/' +
      query.updateBegin + '/' + query.updateEnd + '/' + query.project + '/' + query.products + '/' + query.tags +
      '/' + query.favourite).success((data) => {
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
  interfaceListService.totalCount = (query) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    
    $http.get('/apiTotalCount' + '/' + query.url + '/' + query.title + '/' + query.updateBegin + '/' + query.updateEnd +
      '/' + query.project + '/' + query.products + '/' + query.tags + '/' + query.favourite).success((data) => {
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

