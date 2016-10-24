const angular = require('angular');
// const $ = require('jquery');
angular.module('project.controllers', []).controller('projectCtrl', function ($scope, $state, projectService) {
  console.log('项目');
  $scope.projectList = [];
  getAll();

  function getAll() {
    projectService.getAll().then(result => {
      $scope.projectList = result;
    }, error => {
      alert(error);
    });
  };

  $scope.openModal = () => {
    $scope.newProject = {};
    console.log('添加项目');
    $('#modal1').modal('show');
  };
  $scope.addProject = () => {
    $scope.projectList.push($scope.newProject);
    projectService.create($scope.newProject).then(result => {
      console.log(result);
      getAll();
    }, error => {
      alert(error);
    });
    $('#modal1').modal('hide');
  };

  $scope.delete = (id) => {
    if (!window.confirm('确定要删除该用户？')) {
      return;
    }
    projectService.get(id).then(result => {
      $scope.delProject = result;
      $scope.delProject.mark = -1;
      projectService.update($scope.delProject).then(result => {
        console.log(result);
        getAll();
      }, error => {
        alert(error);
      });
    }, error => {
      alert(error);
    });
  };

  $scope.apiInfo = (projectId) => {
    console.log('跳转接口信息！');
    $state.go('apiInfo', {
      projectId: projectId
      , actionId: 0,
      editFlag: 0
    });
  };

  $scope.apiInfoEdit = (projectId) => {
    console.log('跳转编辑接口信息！');
    $state.go('apiInfo', {
      projectId: projectId,
      actionId: 0,
      editFlag: 1
    });
  };


});
