const angular = require('angular');
const moment = require('moment');
angular.module('apiList.controllers', []).controller('apiListCtrl', function ($scope, $state, $filter, apiListService
  , apiInfoService) {
  init();
  // $('#productPage').tooltip('show');
  $scope.search = () => {
    search();
  };

  function search() {
    $scope.spinner = true;
    apiListService.searchApi($scope.query).then(result => {
      $scope.apiList = result;
      $scope.spinner = false;
    }, err => {
      $scope.apiList = [];
      console.log(err);
    });
  }

  function init() {
    moment().locale('zh-cn');
    $scope.query = {};
    search();
  }
  $scope.goAciton = (api) => {
    $state.go('apiInfo', {
      projectId: api.project._id, actionId: api._id
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
      $dates.filter( (date) => {
        return date.localDateValue() >= activeDate.valueOf();
      }).forEach( (date) => {
        date.selectable = false;
      });
    }
  }

  function endDateBeforeRender($view, $dates) {
    if ($scope.query.updateBegin) {
      var activeDate = moment($scope.query.updateBegin).subtract(1, $view).add(1, 'minute');
      $dates.filter((date) =>{
        return date.localDateValue() <= activeDate.valueOf();
      }).forEach( (date) => {
        date.selectable = false;
      });
    }
  }
  console.log('接口管理列表');
});
