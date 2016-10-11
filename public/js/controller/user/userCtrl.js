const angular = require('angular');
//const $ = require('jquery');
angular.module('user.controllers', []).controller('userCtrl', function($scope, $state, userService) {
  console.log('项目');
  $scope.userList = [];
  getAll();

  function getAll() {
    userService.getAll().then(result => {
      $scope.userList = result;
    }, error => {
      alert(error);
    });
  };
  $scope.openModal = () => {
    $scope.newUser = {};
    console.log('添加项目');
    $('#modal1').modal('show');
  };
  $scope.addUser = () => {
    userService.create($scope.newUser).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
    $('#modal1').modal('hide');
  };
  $scope.delete = (index, id) => {
    userService.delete(id).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
  };
  $scope.apiInfo = () => {
    console.log('跳转接口信息！');
    $state.go('apiInfo');
  }
});
