const angular = require('angular');
angular.module('addApi.controllers', []).controller('addApiCtrl', function ($scope, $state, apiInfoService
  , productService, tagService, projectService, $stateParams, $q) {
  $scope.newAction = {};
  initData();
  $scope.addAction = () => {
    $scope.newAction.isEdit = true;
    $scope.newAction.project = projectId;
    $scope.newAction.isChange = true; // 修改 标识符
    $scope.newAction.products = [];
    var actionId = apiInfoService.addAction($scope.newAction, false);
    $scope.chooseAction(actionId);
  };
  // 获取当前接口信息
  $scope.chooseAction = (actionId) => {
    // watch();
    $scope.viewState = true;
    $scope.currentAction = apiInfoService.getAction(actionId);
    $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
  };
  $scope.setPageDate = () => {
    if ($scope.newAction.project) {
      getPageByProjectId($scope.newAction.project);
      $scope.newAction.pageId = '';
    }else{
      $scope.pageList = [];
      $scope.newAction.pageId = '';
    }
  };
  // 初始化数据
  function initData() {
    getAllProject();
    getAllProduct();
    getAllTag();
  }
  // 获取所有产品线
  function getAllProduct() {
    // 获取所有产品线
    productService.getAllProducts().then(result => {
      $scope.productList = result;
      if ($scope.currentAction) {
        initActionProduct();
      }
      // if (result && result.length > 0) {
      //   getAllVersion($scope.productList);
      // }
    }, error => {
      alert(error);
    });
  }
  // 获取所有标签
  function getAllTag() {
    // 获取所有标签
    tagService.getAll().then(result => {
      $scope.tagList = result;
    }, error => {
      alert(error);
    });
  }
  // 获取所有项目
  function getAllProject() {
    // 获取所有项目
    projectService.getAll().then(result => {
      $scope.projectList = result;
      console.error($scope.projectList);
    }, error => {
      alert(error);
    });
  }

  function getPageByProjectId(id) {
    apiInfoService.getPageByProjectId(id).then(result => {
      $scope.pageList = result;
      console.error($scope.pageList);
    }, error => {
      alert(error);
    });
  }
})

