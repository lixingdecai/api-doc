const angular = require('angular');
// const $ = require('jquery');
angular.module('project.controllers', [])
  .controller('projectCtrl',
    function($scope, $state, projectService) {
      console.log('项目');
      $scope.projectList = [];
      projectService.getAll().then(result => {
        $scope.projectList = result;
      }, error => {
        alert(error);
      });

      $scope.openModal = () => {
        $scope.newProject = {};
        console.log('添加项目');
        $('#modal1').modal('show');
      };

      $scope.addProject = () => {
        $scope.projectList.push($scope.newProject);
        projectService.create($scope.newProject).then(result => {
          console.log(result);
        }, error => {
          alert(error);
        });
        $('#modal1').modal('hide');
      };
      $scope.apiInfo = (projectId) =>{
        console.log('跳转接口信息！');
        $state.go('apiInfo', {projectId: projectId, actionId: 0});
      };
    }
  );
