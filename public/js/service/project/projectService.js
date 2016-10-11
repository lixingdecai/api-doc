const angular = require('angular');
angular.module('project.services', [])
  .factory('projectService', ($http, $q) => {
    const projectService = {};
    projectService.getAll = () => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/project').success((data) => {
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
    projectService.create = (project) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.post('/project', project).success((data) => {
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
    return projectService;
  });
