const angular = require('angular');
angular.module('mock.services', [])
  .factory('mockService', ($http, $q) => {
    const mockService = {};

    return mockService;
  });
