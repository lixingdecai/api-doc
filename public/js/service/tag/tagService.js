const angular = require('angular');
angular.module('tag.services', []).factory('tagService', ($http, $q) => {
  const tagService = {};
  tagService.getAll = () => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/tag').success((data) => {
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

  tagService.pageList = (page) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/tagPageList/'+page.pageSize+'/'+page.currPage).success((data) => {
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

  tagService.totalCount = () => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/tagTotalCount').success((data) => {
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

  tagService.get = (id) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/tag/' + id).success((data) => {
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


  tagService.create = (tag) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.post('/tag', tag).success((data) => {
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

  tagService.update = (tag) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.put('/tag/' + tag._id, tag).success((data) => {
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
  return tagService;
});

