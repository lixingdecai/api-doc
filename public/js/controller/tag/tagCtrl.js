const angular = require('angular');
//const $ = require('jquery');
angular.module('tag.controllers', []).controller('tagCtrl', function ($scope, $state, tagService) {
  console.log('项目');
  $scope.tagList = [];
  getAll();

  function getAll() {
    tagService.getAll().then(result => {
      $scope.tagList = result;
    }, error => {
      alert(error);
    });
  };
  $scope.openModal = () => {
    $scope.newTag = {};
    console.log('添加标签');
    $('#modal1').modal('show');
  };
  $scope.openEditModal = (id) => {
    tagService.get(id).then(result => {
      $scope.editTag = result;
    }, error => {
      alert(error);
    });
    console.log('编辑标签');
    $('#editmodal1').modal('show');
  };
  $scope.addTag = () => {
    tagService.create($scope.newTag).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
    $('#modal1').modal('hide');
  };
  $scope.updateTag = () => {
    tagService.update($scope.editTag).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
    $('#editmodal1').modal('hide');
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
        getAll();
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

