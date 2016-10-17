// const angular = require('angular');
// require('angular-ui-router');
// require('moment');
// require('angular-moment');
// require('angular-bootstrap-datetimepicker');
const vimtAPP = angular.module('vimt', ['ui.router', 'ui.bootstrap.datetimepicker',
  'start.controllers', 'utils',
  'apiList.controllers', 'apiList.services',
  'login.controllers', 'login.services',
  'project.controllers', 'project.services',
  'apiInfo.controllers', 'apiInfo.services',
  'user.controllers', 'user.services',
  'product.controllers', 'product.services',
  'tag.controllers', 'tag.services',
  'mock.controllers', 'mock.services'
]);
// vimtAPP.constant('moment', require('moment-timezone'));
vimtAPP.run(['$rootScope', ($rootScope, $location, $state) => {
  // var NowMoment = amMoment();
  console.log('run1');
  // amMoment.changeLocale('de');
  $rootScope.showNav = true;
  // $rootScope.$on('$routeChangeStart', '$location', function (evt, next, current) {
  //   // 如果用户未登录
  //   if (!AuthService.userLoggedIn()) {
  //     if (next.templateUrl === 'login.html') {
  //       // 已经转向登录路由因此无需重定向
  //     } else {
  //       $location.path('/login');
  //     }
  //   }
  // });
  // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
  //   if (toState.name == 'login') return; // 如果是进入登录界面则允许
  //   // 如果用户不存在
  //   if (!$rootScope.user || !$rootScope.user.token) {
  //     event.preventDefault(); // 取消默认跳转行为
  //     $state.go('login', {
  //       from: fromState.name,
  //       w: 'notLogin'
  //     }); //跳转到登录界面
  //   }
  // });

}]);

vimtAPP.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
  console.log('router');
  $httpProvider.interceptors.push('httpInterceptor');
  // amMoment.locale('zh-cn');

  $urlRouterProvider.otherwise('/apiList');
  $stateProvider.state('apiList', {
    url: '/apiList',
    templateUrl: '../template/interface/apiList.html',
    controller: 'apiListCtrl'
  }).state('login', {
    url: '/login',
    templateUrl: '../template/login/login.html',
    controller: 'loginCtrl'
  }).state('apiInfo', {
    url: '/apiInfo/:projectId/:actionId',
    templateUrl: '../template/interface/apiInfo.html',
    controller: 'apiInfoCtrl'
  }).state('project', {
    url: '/project',
    templateUrl: '../template/project/project.html',
    controller: 'projectCtrl'
  }).state('user', {
    url: '/userList',
    templateUrl: '../template/user/user.html',
    controller: 'userCtrl'
  }).state('product', {
    url: '/productList',
    templateUrl: '../template/product/product.html',
    controller: 'productCtrl'
  }).state('tag', {
    url: '/tag',
    templateUrl: '../template/tag/tag.html',
    controller: 'tagCtrl'
  }).state('mock', {
    url: '/mock/:apiId',
    templateUrl: '../template/mock/mock.html',
    controller: 'mockCtrl'
  });
}]);
