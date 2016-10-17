const angular = require('angular');
//const $ = require('jquery');
angular.module('product.controllers', []).controller('productCtrl', function ($scope, $state, productService) {
  console.log('项目');
  $scope.productList = [];
  $scope.versionList = [];
  $scope.showVersions = [];
  $scope.currIndex = 0;
  $scope.page = {
    pageSize: 10
    , currPage: 1
    , totalCount: 0
    , totalPage: 0
    , showPages: []
  , };
  getPageList();
  $scope.showProducts = (index) => {
    var flag = $scope.showVersions[index];
    if (flag) {
      $scope.showVersions[index] = false;
    } else {
      $scope.showVersions[index] = true;
    }
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
    productService.pageList($scope.page).then(result => {
      $scope.productList = result;
    }, error => {
      alert(error);
    });
    productService.totalCount().then(result => {
      $scope.page.totalCount = result;
      $scope.page.totalPage = Math.ceil($scope.page.totalCount / $scope.page.pageSize);
      setPageInfo();
    }, error => {
      alert(error);
    });
  };

  function getAll() {
    productService.pageList().then(result => {
      var productt = result;
    }, error => {
      alert(error);
    });
    productService.totalCount();
    productService.getPageListProducts().then(result => {
      $scope.productList = result;
    }, error => {
      alert(error);
    });
  };
  $scope.openVersionModal = (id, index) => {
    $scope.submitted = false;
    $scope.currIndex = index;
    $scope.newVersion = {};
    $scope.newVersion.product = id;
    console.log('添加产品线');
    $('#versionModal').modal('show');
  };
  $scope.editVersionModal = (id) => {
    $scope.submitted = false;
    //$scope.editVersion_form.name.$dirty = false;
    productService.getVersion(id).then(result => {
      $scope.editVersion = result;
      $scope.oldName = $scope.editVersion.name;
    }, error => {
      alert(error);
    });
    console.log('编辑产品线');
    $('#editversionModal').modal('show');
  };
  $scope.openProductModal = () => {
    $scope.newProduct = {};
    $scope.submitted = false;
    // $scope.newProduct = id;
    console.log('添加产品');
    $('#productModal').modal('show');
  };

  $scope.openEditProductModal = (id) => {
    $scope.submitted = false;
    productService.get(id).then(result => {
      $scope.editProduct = result;
    }, error => {
      alert(error);
    });
    console.log('编辑标签');
    $('#editproductModal').modal('show');
  };

  $scope.updateProduct = () => {
    $scope.submitted = true;
    if ($scope.editProduct_form.$valid) {
      productService.update($scope.editProduct).then(result => {
        console.log(result);
        getPageList();
        $('#editproductModal').modal('hide');
      }, error => {
        alert(error);
      });
    } else {}
  };


  $scope.delete = (id) => {
    if (!window.confirm('确定要删除该产品？')) {
      return;
    }
    productService.get(id).then(result => {
      $scope.delProduct = result;
      $scope.delProduct.mark = -1;
      productService.update($scope.delProduct).then(result => {
        console.log(result);
        productService.getVersionsByProductId(id).then(result => {
          $scope.delVersions = result;
          for (var i = 0; i < $scope.delVersions.length; i++) {
            var delVersion = $scope.delVersions[i];
            delVersion.mark = -1;
            productService.updateVersion(delVersion);
          }
        }, error => {
          alert(error);
        });
        getPageList();
      }, error => {
        alert(error);
      });
    }, error => {
      alert(error);
    });
  };
  $scope.deleteVersion = (id) => {
    if (!window.confirm('确定要删除该版本？')) {
      return;
    }
    productService.getVersion(id).then(result => {
      $scope.delVersion = result;
      $scope.delVersion.mark = -1;
      productService.updateVersion($scope.delVersion);
      getPageList();
    }, error => {
      alert(error);
    });
  };
  $scope.submitted = false;
  $scope.loading = false;
  $scope.addProduct = () => {
    $scope.submitted = true;
    $scope.loading = true;
    if ($scope.newProduct_form.$valid) {
      productService.create($scope.newProduct).then(result => {
        $scope.loading = false;
        getPageList();
        $('#productModal').modal('hide');
      }, error => {
        alert(error);
      });
    } else {
      $scope.loading = false;
    }
  };
  $scope.addVersion = (index) => {
    $scope.submitted = true;
    $scope.loading = true;
    if ($scope.newVersion_form.$valid) {
      productService.createVersion($scope.newVersion).then(result => {
        $scope.loading = false;
        $scope.showVersions[index] = true;
        getPageList();
        $('#versionModal').modal('hide');
      }, error => {
        alert(error);
      });
    } else {
      $scope.loading = false;
    }
  };
  $scope.updateVersion = () => {
    $scope.submitted = true;
    if ($scope.editVersion_form.$valid) {
      productService.updateVersion($scope.editVersion).then(result => {
        console.log(result);
        getPageList();
        $('#editversionModal').modal('hide');
      }, error => {
        alert(error);
      });
    } else {}
  };
  $scope.apiInfo = () => {
    console.log('跳转接口信息！');
    $state.go('apiInfo');
  }
});

