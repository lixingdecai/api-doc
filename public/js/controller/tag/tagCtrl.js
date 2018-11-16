const angular = require('angular');
//const $ = require('jquery');
angular.module('tag.controllers', []).controller('tagCtrl', function ($scope, $state, tagService) {
  console.log('项目');
  $scope.tagList = [];
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
    if ($scope.page.totalPage > $scope.page.currPage && ($scope.page.currPage + 5 < $scope.page.totalPage)) {
      $scope.page.showPages.push('...');
    }
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
    tagService.pageList($scope.page).then(result => {
      $scope.tagList = result;
    }, error => {
      alert(error);
    });
    tagService.totalCount().then(result => {
      $scope.page.totalCount = result;
      $scope.page.totalPage = Math.ceil($scope.page.totalCount / $scope.page.pageSize);
      setPageInfo();
    }, error => {
      alert(error);
    });
  };
  $scope.openModal = () => {
    $scope.newTag = {};
    $scope.submitted = false;
    console.log('添加标签');
    $('#modal1').modal('show');
  };
  $scope.openEditModal = (id) => {
    $scope.submitted = false;
    tagService.get(id).then(result => {
      $scope.editTag = result;
    }, error => {
      alert(error);
    });
    console.log('编辑标签');
    $('#editmodal1').modal('show');
  };
  $scope.addTag = () => {
    $scope.submitted = true;
    $scope.loading = true;
    if ($scope.newTag_form.$valid) {
      tagService.create($scope.newTag).then(result => {
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
  $scope.updateTag = () => {
    $scope.submitted = true;
    if ($scope.editTag_form.$valid) {
      tagService.update($scope.editTag).then(result => {
        console.log(result);
        getPageList();
        $('#editmodal1').modal('hide');
      }, error => {
        alert(error);
      });
    } else {}
  };
  $scope.delete = (id) => {
    if (!window.confirm('确定要删除该标签？')) {
      return;
    }
    tagService.get(id).then(result => {
      $scope.delTag = result;
      $scope.delTag.mark = -1;
      tagService.update($scope.delTag).then(result => {
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

