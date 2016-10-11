const angular = require('angular');
angular.module('product.services', []).factory('productService', ($http, $q) => {
  const productService = {};
  productService.getAllProducts = () => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/product').success((data) => {
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
  productService.getAllVersion = () => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/productVersion').success((data) => {
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
  productService.getVersionsByProductId = (productId) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/versions/' + productId).success((data) => {
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
  productService.create = (product) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.post('/product', product).success((data) => {
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
  productService.get = (id) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/product/' + id).success((data) => {
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

  productService.getVersion = (id) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/productVersion/' + id).success((data) => {
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

  productService.createVersion = (version) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.post('/productVersion', version).success((data) => {
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
  productService.update = (product) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.put('/product/' + product._id, product).success((data) => {
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
  productService.updateVersion = (version) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.put('/productVersion/' + version._id, version).success((data) => {
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
  productService.delete = (id) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.delete('/product/' + id).success((data) => {
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
  return productService;
});

