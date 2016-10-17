const angular = require( 'angular' );
angular.module( 'user.services', [ ] ).factory( 'userService', ( $http, $q ) => {
  const userService = {};
  userService.getAll = ( ) => {
    const deferred = $q.defer( );
    const promise = deferred.promise;
    $http.get( '/user' ).success( ( data ) => {
      if ( data.status === 'success' ) {
        deferred.resolve( data.response );
      } else {
        deferred.reject( data.error );
      }
    } ).error( ( error ) => {
      deferred.reject( error );
    } );
    return promise;
  };

  userService.update = (user) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.put('/user/' + user._id, user).success((data) => {
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

  userService.pageList = (page) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/userPageList/'+page.pageSize+'/'+page.currPage).success((data) => {
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

  userService.totalCount = () => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/userTotalCount').success((data) => {
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

  userService.get = (id) => {
    const deferred = $q.defer();
    const promise = deferred.promise;
    $http.get('/user/' + id).success((data) => {
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


  userService.create = ( user ) => {
    const deferred = $q.defer( );
    const promise = deferred.promise;
    $http.post( '/user', user ).success( ( data ) => {
      if ( data.status === 'success' ) {
        deferred.resolve( data.response );
      } else {
        deferred.reject( data.error );
      }
    } ).error( ( error ) => {
      deferred.reject( error );
    } );
    return promise;
  };
  userService.delete = ( id ) => {
    const deferred = $q.defer( );
    const promise = deferred.promise;
    $http.delete( '/user/' + id ).success( ( data ) => {
      if ( data.status === 'success' ) {
        deferred.resolve( data.response );
      } else {
        deferred.reject( data.error );
      }
    } ).error( ( error ) => {
      deferred.reject( error );
    } );
    return promise;
  };

  return userService;
} );

