const angular = require('angular');
//const $ = require('jquery');
angular.module('user.controllers', []).controller('userCtrl', function ($scope, $state, userService) {
  console.log('项目');
  $scope.userList = [];
  $scope.submitted = false;
  $scope.loading = false;
  $scope.page = {
    pageSize: 10
    , currPage: 1
    , totalCount: 0
    , totalPage: 0
    , showPages: []
  , };
  getPageList();

  function setPageInfo() {
    $scope.page.showStart = $scope.page.currPage - 5;
    $scope.page.showEnd = $scope.page.currPage + 5;
    if ($scope.page.showStart < 1) {
      $scope.page.showStart = 1;
    }
    if ($scope.page.showEnd > $scope.page.totalPage) {
      $scope.page.showEnd = $scope.page.totalPage;
    }
    $scope.page.showPages = [];
    for (var i = $scope.page.showStart; i <= $scope.page.showEnd; i++) {
      $scope.page.showPages.push(i);
    }
    $scope.page.showPages.push('...');
  }
  $scope.changePage = (currPage) => {
    var patrn = /^\d*$/;
    if (!patrn.test(currPage)) {
      if (currPage == '...') {
        currPage = $scope.page.currPage + 5;
        if (currPage > $scope.page.totalPage) {
          currPage = $scope.page.totalPage;
        }
      }
    }
    if (currPage > $scope.page.totalPage || currPage < 1) {
      return;
    }
    $scope.page.currPage = currPage;
    getPageList();
  };

  function getPageList() {
    userService.pageList($scope.page).then(result => {
      $scope.userList = result;
    }, error => {
      alert(error);
    });
    userService.totalCount().then(result => {
      $scope.page.totalCount = result;
      $scope.page.totalPage = Math.ceil($scope.page.totalCount / $scope.page.pageSize);
      setPageInfo();
    }, error => {
      alert(error);
    });
  };
 
  $scope.openModal = () => {
    $scope.newUser = {};
    $scope.submitted = false;
    console.log('添加项目');
    $('#modal1').modal('show');
  };
  $scope.addUser = () => {
    $scope.submitted = true;
    $scope.loading = true;
    if ($scope.newUser_form.$valid) {
      userService.create($scope.newUser).then(result => {
        console.log(result);
        getPageList();
        $('#modal1').modal('hide');
        $scope.loading = false;
      }, error => {
        $scope.loading = false;
        alert(error);
      });
    } else {
      $scope.loading = false;
    }
  };
  $scope.delete = (index, id) => {
    if (!window.confirm('确定要删除该用户？')) {
      return;
    }
    userService.get(id).then(result => {
      $scope.delUser = result;
      $scope.delUser.mark = -1;
      userService.update($scope.delUser).then(result => {
        console.log(result);
        getPageList();
      }, error => {
        alert(error);
      });
    }, error => {
      alert(error);
    });
  };
  $scope.apiInfo = () => {
    console.log('跳转接口信息！');
    $state.go('apiInfo');
  }
});

