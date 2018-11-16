const angular = require('angular');
const moment = require('moment');
angular.module('apiList.controllers', []).controller('apiListCtrl', function ($scope, $state, $filter, apiListService
  , apiInfoService, productService, tagService,projectService) {
  $scope.page = {
    pageSize: 10
    , currPage: 1
    , totalCount: 0
    , totalPage: 0
    , showPages: []
  };
  init();
  $scope.loadTags = ($query) => {
    var tagList = $scope.tagList;
    return tagList.filter(function (tag) {
      return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
    });
  };
  $scope.loadProducts = ($query) => {
    var productVersions = $scope.productVsersions;
    return productVersions.filter(function (version) { 
      return version.displayName.toLowerCase().indexOf($query.toLowerCase()) != -1;
    });
  };

  $scope.removeUpdateBegin = () => {
    $scope.query.updateBegin = undefined;
  };

  $scope.removeUpdateEnd = () => {
    $scope.query.updateEnd = undefined;
  };


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
  // 获取所有产品线
  function getAllProduct() {
    // 获取所有产品线
    productService.getAllProducts().then(result => {
      $scope.productList = result;
      $scope.productVsersions = [];
      if ($scope.productList && $scope.productList.length > 0) {
        for (var n = 0; n < $scope.productList.length; n++) {
          var product = $scope.productList[n];
          var versions = product.productVersions;
          for (var m = 0; m < versions.length; m++) {
            var version = versions[m];
            $scope.productVsersions.push(version);
          }
        }
      }
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

  // 获取所有标签
  function getAllProject() {
    // 获取所有标签
    projectService.getAll().then(result => {
      $scope.projectList = result;
    }, error => {
      alert(error);
    });
  }

  function getPageList() {

    for (var p in $scope.query) {
      if (!$scope.query[p]) {
        $scope.query[p] = undefined;
      }
    }

    //if(query.favourite)
    // 设置标签查询条件
    if ($scope.tags && $scope.tags.length > 0) {
      $scope.query.tags = [];
      for (var n = 0; n < $scope.tags.length; n++) {
        $scope.query.tags.push($scope.tags[n]._id);
      }
    } else {
      $scope.query.tags = undefined;
    }

    // 设置产品线查询条件
    if ($scope.products && $scope.products.length > 0) {
      $scope.query.products = [];
      for (var m = 0; m < $scope.products.length; m++) {
        $scope.query.products.push($scope.products[m]._id);
      }
    } else {
      $scope.query.products = undefined;
    }
    apiListService.pageList($scope.page, $scope.query).then(result => {
      $scope.apiList = result;
    }, error => {
      alert(error);
    });
    apiListService.totalCount($scope.query).then(result => {
      $scope.page.totalCount = result;
      $scope.page.totalPage = Math.ceil($scope.page.totalCount / $scope.page.pageSize);
      setPageInfo();
    }, error => {
      alert(error);
    });
  };
  // $('#productPage').tooltip('show');
  $scope.search = () => {
    getPageList();
  };

  function init() {
    moment().locale('zh-cn');
    $scope.query = {};
    getPageList();
    getAllProduct();
    getAllTag();
    getAllProject();
  }
  $scope.goAciton = (api) => {
    $state.go('apiInfo', {
      projectId: api.project._id
      , actionId: api._id
    });
  };
  $scope.toggleFavorite = (apiId, isFavourite) => {
    apiInfoService.favourite(apiId, isFavourite).then(result => {
      for (var i = 0; i < $scope.apiList.length; i += 1) {
        if ($scope.apiList[i]._id === apiId) {
          $scope.apiList[i].favourite = !isFavourite;
        }
      }
      console.log(result);
    }, error => console.log(error));
  };
  $scope.endDateBeforeRender = endDateBeforeRender;
  $scope.endDateOnSetTime = endDateOnSetTime;
  $scope.startDateBeforeRender = startDateBeforeRender;
  $scope.startDateOnSetTime = startDateOnSetTime;

  function startDateOnSetTime() {
    $scope.$broadcast('start-date-changed');
    $scope.query.updateBegin = $filter('date')($scope.query.updateBegin, 'yyyy-MM-dd');
  }

  function endDateOnSetTime() {
    $scope.$broadcast('end-date-changed');
    $scope.query.updateEnd = $filter('date')($scope.query.updateEnd, 'yyyy-MM-dd');
  }

  function startDateBeforeRender($dates) {
    if ($scope.query.updateEnd) {
      var activeDate = moment($scope.query.updateEnd);
      $dates.filter((date) => {
        return date.localDateValue() >= activeDate.valueOf();
      }).forEach((date) => {
        date.selectable = false;
      });
    }
  }

  function endDateBeforeRender($view, $dates) {
    if ($scope.query.updateBegin) {
      var activeDate = moment($scope.query.updateBegin).subtract(1, $view).add(1, 'minute');
      $dates.filter((date) => {
        return date.localDateValue() <= activeDate.valueOf();
      }).forEach((date) => {
        date.selectable = false;
      });
    }
  }
  console.log('接口管理列表');
});

