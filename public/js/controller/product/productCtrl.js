const angular = require('angular');
//const $ = require('jquery');
angular.module('product.controllers', []).controller('productCtrl', function ($scope, $state, productService) {
  console.log('项目');
  $scope.productList = [];
  $scope.versionList = [];
  $scope.showVersions = [];
  $scope.currIndex = 0;
  getAll();
  $scope.showProducts = (index) => {
    var flag = $scope.showVersions[index];
    if (flag) {
      $scope.showVersions[index] = false;
    } else {
      $scope.showVersions[index] = true;
    }
  };

  function getAll() {
    productService.getAllProducts().then(result => {
      $scope.productList = result;
    }, error => {
      alert(error);
    });
  };
  $scope.openVersionModal = (id,index) => {
    $scope.currIndex = index;
    $scope.newVersion = {};
    $scope.newVersion.product = id;
    console.log('添加产品线');
    $('#versionModal').modal('show');
  };
  $scope.editVersionModal = (id) => {
    productService.getVersion(id).then(result => {
      $scope.editVersion = result;
    }, error => {
      alert(error);
    });
    console.log('编辑产品线');
    $('#editversionModal').modal('show');
  };
  $scope.openProductModal = () => {
    $scope.newProduct = {};
    // $scope.newProduct = id;
    console.log('添加产品');
    $('#productModal').modal('show');
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
        getAll();
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
      getAll();
    }, error => {
      alert(error);
    });
  };
  $scope.addProduct = () => {
    productService.create($scope.newProduct).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
    $('#productModal').modal('hide');
  };
  $scope.addVersion = (index) => {
    productService.createVersion($scope.newVersion).then(result => {
      console.log(result);
      $scope.showVersions[index] = true;
    }, error => {
      alert(error);
    });
    getAll();
    $('#versionModal').modal('hide');
  };
  $scope.updateVersion = () => {
    productService.updateVersion($scope.editVersion).then(result => {
      console.log(result);
    }, error => {
      alert(error);
    });
    getAll();
    $('#editversionModal').modal('hide');
  };
  $scope.apiInfo = () => {
    console.log('跳转接口信息！');
    $state.go('apiInfo');
  }
});

