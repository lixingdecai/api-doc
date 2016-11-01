const angular = require('angular');
angular.module('apiInfo.controllers', []).controller('apiInfoCtrl', apic);

function apic($scope, $state, apiInfoService, $stateParams, $q, productService, tagService) {
  var projectId = $stateParams.projectId;
  var aId = $stateParams.actionId;
  init();
  // $scope.showNav = false;
  var editFlag = $stateParams.editFlag;
  if (editFlag == 1) {
    $scope.isEdit = true; // 是否编辑状态
  } else {
    $scope.isEdit = false; // 是否编辑状态
  }
  $scope.viewState = true; // 是否预览状态
  $scope.doesImportType = 'reqData'; // json导入数据类型 reqData reqParam reqHeader resData
  // $scope.currentAction = {}; // 当前接口信息
  var nPageId = 0;
  console.log('接口详情');
  $scope.title = '接口详情';
  $scope.pageList = [];
  $scope.apidata = {};
  $scope.apidata.requestHead = {};
  if ($scope.isFavourite) {
    $scope.isFavourite = false;
  }
  $scope.importJson = (doesImportType) => {
    $scope.doesImportType = doesImportType;
    $scope.reqHeadJson = '';
    $('#modal1').modal('show');
  };
  $scope.showAddPage = () => {
    $scope.newPage = {};
    $scope.newPage.project = projectId;
    $('#modal2').modal('show');
  };
  $scope.showNewAction = (pageId) => {
    $scope.addExisted = false;
    $scope.newAction = {};
    $scope.newAction.pageId = pageId;
    $('#modal3').modal('show');
  };
  $scope.productChange = (productVersions) => {
    if (!productVersions.exist) {
      $scope.productVersions = productVersions;
    }
  };
  $scope.tagChange = (tag) => {
    $scope.tag = tag;
  };

  function addProduct(productVersions) {
    for (var i = 0; i < $scope.productList.length; i += 1) {
      for (var j = 0; j < $scope.productList[i].productVersions.length; j += 1) {
        if ($scope.productList[i].productVersions[j]._id === productVersions._id) {
          $scope.productList[i].productVersions[j].exist = true;
        }
      }
    }
  }

  function rmProduct(productVersionsId) {
    for (var i = 0; i < $scope.productList.length; i += 1) {
      for (var j = 0; j < $scope.productList[i].productVersions.length; j += 1) {
        if ($scope.productList[i].productVersions[j]._id === productVersionsId) {
          $scope.productList[i].productVersions[j].exist = false;
        }
      }
    }
  }
  $scope.addProduct = (productVersions) => {
    addProduct(productVersions);
    if (!$scope.currentAction.products) {
      $scope.currentAction.products = {};
    }
    $scope.currentAction.products.push(productVersions);
  };
  $scope.addTag = (tag) => {
    if (!tag || tag.isExist) {
      return;
    }
    if (!$scope.currentAction.tags) {
      $scope.currentAction.tags = [];
    }
    if (!tag.isExist) {
      $scope.currentAction.tags.push(tag);
      tag.isExist = true;
      $scope.tag = null;
    }
  };
  $scope.rmTag = (id) => {
    for (var i = 0; i < $scope.currentAction.tags.length; i += 1) {
      if ($scope.currentAction.tags[i]._id === id) {
        $scope.currentAction.tags[i].isExist = false;
        $scope.currentAction.tags.splice(i, 1);
      }
    }
    for (var i = 0; i < $scope.tagList.length; i += 1) {
      if ($scope.tagList[i]._id === id) {
        $scope.tagList[i].isExist = false;
      }
    }
  };
  $scope.rmProduct = (productVersionsId) => {
    rmProduct(productVersionsId);
    for (var i = 0; i < $scope.currentAction.products.length; i += 1) {
      if ($scope.currentAction.products[i]._id === productVersionsId) {
        $scope.currentAction.products.splice(i, 1);
      }
    }
  };
  // 初始化
  function init() {
    console.log('接口详情 初始化');
    if (!projectId) {
      return;
    }
    // getPageList(projectId);
    // getActions(projectId);
    $q.all([apiInfoService.getPageByProjectId(projectId), apiInfoService.getActionsByProjectId(projectId)]).then((
      results) => {
      // for (var i = 0; i < results.length; i++) {
      //   // theResults.push(result[i]);
      //   // if (results[i].data.status !== 'success') {
      //   //   return deferred.reject(results[i].data.error);
      //   // }
      // }
      if (results[0]) {
        $scope.pageList = results[0];
        if ($scope.pageList && $scope.pageList.length > 0) {
          if ($scope.pageList[0].actionList && $scope.pageList[0].actionList.length > 0) {
            if (aId && aId != 0) {
              $scope.currentAction = apiInfoService.getAction(aId);
            }
            if (!$scope.currentAction) {
              $scope.currentAction = $scope.pageList[0].actionList[0];
            }
          }
        }
      }
      getAllTag(); //获取所有的标签
      getAllProduct(); // 获取所有产品线
      if ($scope.currentAction) {
        $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
        getFavourite(); // 获取订阅信息
        if (!$scope.currentAction.protocol) {
          $scope.currentAction.protocol = 'http';
        }
        if (!$scope.currentAction.method) {
          $scope.currentAction.method = 'get';
        }
      }
      // deferred.resolve(pageList);
      // 将结果委托回调函数
      // deferred.resolve(aggregatedData);
    }, (error) => {
      console.log(error);
    });
  }
  // 初始化当前借口下的产品线
  function initActionProduct() {
    if (!$scope.productList) {
      $scope.productList = [];
    }
    // 重置所有产品线选择状态
    for (let i = 0; i < $scope.productList.length; i += 1) {
      for (let j = 0; j < $scope.productList[i].productVersions.length; j += 1) {
        $scope.productList[i].productVersions[j].exist = false;
      }
    }
    for (var i = 0; i < $scope.currentAction.products.length; i += 1) {
      addProduct($scope.currentAction.products[i]);
    }
    if ($scope.currentAction.tags) {
      for (var i = 0; i < $scope.currentAction.tags.length; i += 1) {
        for (var j = 0; j < $scope.tagList.length; j += 1) {
          if ($scope.currentAction.tags[i]._id == $scope.tagList[j]._id) {
            $scope.tagList[j].isExist = true;
          }
        }
        $scope.currentAction.tags[i].isExist = true;
      }
    }
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
  // 获取接口是否订阅
  function getFavourite() {
    apiInfoService.getFavourite().then(result => {
      $scope.isFavourite = false;
      if (result && result.favourites && result.favourites.length > 0) {
        for (var i = 0; i < result.favourites.length; i += 1) {
          if (result.favourites[i].api === $scope.currentAction.id) {
            $scope.isFavourite = true;
          }
        }
      }
      // console.log(result);
    }, error => {
      console.log(error);
    });
  }
  // 添加订阅
  $scope.favourite = () => {
    apiInfoService.favourite($scope.currentAction.id, $scope.isFavourite).then(() => {
      $scope.isFavourite = !$scope.isFavourite;
    }, () => {});
  };
  // 获取所有页面
  // function getPageList(projectId) {
  //   apiInfoService.getPageByProjectId(projectId).then((data) => {
  //     console.log('获取项目下所有页面 成功！');
  //     $scope.pageList = data;
  //   }, (error) => {
  //     console.log('获取项目下所有页面 失败！' + error);
  //   });
  // }
  // 获取所有页面的所有方法
  // function getActions(projectId) {
  //   apiInfoService.getActionsByProjectId(projectId).then((data) => {
  //     console.log('获取项目下所有接口 成功！');
  //     $scope.pageList = data;
  //   }, (error) => {
  //     console.log('获取项目下所有接口 失败！' + error);
  //   });
  // }
  function getPage(pageId) {
    // var pageList
    for (var i = 0; i < $scope.pageList.length; i += 1) {
      if ($scope.pageList[i]._id === pageId) {
        return $scope.pageList[i];
      }
    }
    return null;
  }
  // 新增页面
  $scope.addPage = () => {
    nPageId += 1;
    $scope.newPage.id = nPageId;
    $scope.newPage.isEdit = true; // 判断是否更新/新建标识符
    apiInfoService.addPage($scope.newPage).then(() => {
      init();
    }, error => {
      console.log(error);
    });
    // apiInfoService.addPage($scope.newPage).then((data) => {
    //   alert('添加页面成功');
    // }, (error) => {
    //   alert(error);
    // });
    // getPageList($scope.newPage);
    $('#modal2').modal('hide');
    // $scope.pageList.push($scope.newPage);
  };
  // 编辑页面
  $scope.editPage = (pageId) => {
    $scope.newPage = getPage(pageId);
    $('#modal2').modal('show');
  };
  $scope.removePage = (pageId) => {
    apiInfoService.removePage(pageId).then(() => {
      init();
      alert('删除成功');
    }, (error) => {
      alert(error);
    });
  };
  // 添加参数
  $scope.addParam = (type, parentParamId, paramType) => {
    $scope.currentAction.isChange = true;
    apiInfoService.addParam(type, $scope.currentAction.id, parentParamId, paramType);
    // $scope.currentAction = apiInfoService.getAction($scope.currentAction.id);
    $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
  };
  // 删除制定参数
  $scope.removeParam = (paramId, type) => {
    apiInfoService.removeParameter($scope.currentAction.id, paramId, type);
    $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
  };
  // 添加／修改 接口
  $scope.addAction = () => {
    // var action = {};
    // action.pageId = -1;
    // action.name = 'b.g("editAFloater-name").value';
    // action.requestType = 'getSelectedValue("editAFloater-type")';
    // action.requestUrl = 'b.g("editAFloater-requestUrl").value';
    // action.responseTemplate = ' b.g("editAFloater-responseTemplate").value';
    // action.description = 'b.g("editAFloater-description").value';
    // var struct = getSelectedValue("editAFloater-struct");
    // setActionStruct(action, struct);
    $scope.newAction.isEdit = true;
    $scope.newAction.project = projectId;
    $scope.newAction.isChange = true; // 修改 标识符
    $scope.newAction.products = [];
    var actionId = apiInfoService.addAction($scope.newAction, $scope.addExisted);
    $scope.chooseAction(actionId);
    // $scope.newAction.id = actionId;
    // $scope.currentAction = $scope.newAction;
    $('#modal3').modal('hide');
  };
  $scope.editAction = (actionId) => {
    if (!$scope.isEdit) {
      return;
    }
    $scope.chooseAction(actionId);
    $('#modal3').modal('show');
    $scope.addExisted = true;
    $scope.newAction = apiInfoService.getAction(actionId);
  };
  $scope.getHistory = () => {
    $scope.chooseHisItem = '';
    $scope.apiHistoryList = [];
    apiInfoService.getHistory($scope.currentAction.id).then(result => {
      $scope.apiHistoryList = result;
    }, err => {
      console.log('获取接口历史信息失败' + err);
    });
    $('#modal4').modal('show');
  };
  $scope.removeAction = actionId => {
    apiInfoService.removeAction(actionId).then(() => {
      init();
      alert('删除成功');
    }, error => {
      console.log('删除失败' + error);
    });
  };
  // 获取当前接口信息
  $scope.chooseAction = (actionId) => {
    // watch();
    $scope.viewState = true;
    $scope.currentAction = apiInfoService.getAction(actionId);
    $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
    getFavourite();
    initActionProduct();
  };
  // 取消编辑页面和接口
  $scope.cancelEditEvent = () => {
    $scope.isEdit = false;
  };
  // 编辑页面和接口
  $scope.editEvent = () => {
    $scope.isEdit = true;
    console.error(1112);
    var cirr = $scope.currentAction;
  };
  // 页面保存事件
  $scope.saveEvent = () => {
    console.log('页面保存');
    console.log($scope.currentAction);
    // 保存页面
    apiInfoService.savePages($scope.currentAction.id).then(() => {
      alert('接口' + $scope.currentAction.title + '保存成功');
      $scope.isEdit = false;
    }, (error) => {
      alert(error);
    });
    console.log($scope.currentAction);
    $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
    console.log($scope.currentAction);
    // 保存接口
    // saveAc();
  };
  // 选择历史纪录
  $scope.chooseHistory = (historyId) => {
    $scope.isEdit = false;
    $scope.chooseHisItem = historyId;
  };
  // parameter 解析成层级结构modal
  function parseParam(paramList, resultList) {
    var pil = [];
    var plist = paramList.parameterList;
    if (!plist) {
      return;
    }
    var pl = plist.length;
    for (var i = 0; i < pl; i += 1) {
      // parentsIdList.push(paramList.id);
      // if (parentsIdList) {
      //   for (var ppid in parentsIdList) {
      //     pil.push(parentsIdList[ppid]);
      //   }
      // }
      // pil.push(paramList.id);
      // plist[i].parentsIdList = pil;
      resultList.push(plist[i]);
      if (plist[i].parameterList && plist[i].parameterList.length > 0) {
        parseParam(plist[i], resultList, pil);
      }
    }
  };
  // 预览历史纪录
  $scope.viewHistory = () => {
    const al = $scope.apiHistoryList.length;
    for (var i = 0; i < al; i += 1) {
      if ($scope.apiHistoryList[i]._id === $scope.chooseHisItem) {
        $scope.apiHistoryList[i].id = $scope.apiHistoryList[i].apiId;
        $scope.viewState = false;
        $scope.currentAction = $scope.apiHistoryList[i];
        if (!$scope.currentAction.requestParameter) {
          $scope.currentAction.requestParameterList = [];
        } else {
          $scope.currentAction.requestParameterList = JSON.parse($scope.currentAction.requestParameter);
        }
        if (!$scope.currentAction.requestHeader) {
          $scope.currentAction.requestHeaderList = [];
        } else {
          $scope.currentAction.requestHeaderList = JSON.parse($scope.currentAction.requestHeader);
        }
        if (!$scope.currentAction.requestData) {
          $scope.currentAction.requestDataList = [];
        } else {
          $scope.currentAction.requestDataList = JSON.parse($scope.currentAction.requestData);
        }
        if (!$scope.currentAction.responseData) {
          $scope.currentAction.responseDataList = [];
        } else {
          $scope.currentAction.responseDataList = JSON.parse($scope.currentAction.responseData);
        }
        var ca = $scope.currentAction;
        var param = {};
        // if (!param) {
        //   param = {};
        // }
        param.requestParameter = [];
        param.requestHeader = [];
        param.requestData = [];
        param.responseData = [];
        if (ca === null) return null;
        if (ca.requestParameterList) {
          let rpl = ca.requestParameterList.length;
          for (let i = 0; i < rpl; i += 1) {
            ca.requestParameterList[i].parentsIdList = [];
            param.requestParameter.push(ca.requestParameterList[i]);
            parseParam(ca.requestParameterList[i], param.requestParameter, []);
          }
          // ca.requestParameterList = requestParameter;
        }
        if (ca.requestDataList) {
          let rpl = ca.requestDataList.length;
          for (let i = 0; i < rpl; i += 1) {
            ca.requestDataList[i].parentsIdList = [];
            param.requestData.push(ca.requestDataList[i]);
            parseParam(ca.requestDataList[i], param.requestData, []);
          }
          // ca.requestDataList = requestData;
        }
        if (ca.requestHeaderList) {
          let rpl = ca.requestHeaderList.length;
          for (let i = 0; i < rpl; i += 1) {
            ca.requestHeaderList[i].parentsIdList = [];
            param.requestHeader.push(ca.requestHeaderList[i]);
            parseParam(ca.requestHeaderList[i], param.requestHeader, []);
          }
          // ca.requestHeaderList = requestHeader;
        }
        if (ca.responseDataList) {
          var rpl = ca.responseDataList.length;
          for (let i = 0; i < rpl; i += 1) {
            ca.responseDataList[i].parentsIdList = [];
            param.responseData.push(ca.responseDataList[i]);
            parseParam(ca.responseDataList[i], param.responseData, []);
          }
          // ca.responseDataList = responseData;
        }
        ca.param = param;
      }
    }
    $('#modal4').modal('hide');
  };
  $scope.refleshPage = () => {
    $scope.chooseAction($scope.currentAction.id);
  };
  // 导入json
  $scope.doImportJSON = () => {
    // if (!validate('formImportJSONFloater')) return;
    // var ele = b.g('importJSONFloater-text');
    var txt = $scope.reqHeadJson;
    try {
      if (typeof JSON === 'undefined') {
        alert('您用的啥浏览器啊？连JSON转换都不支持也...请使用IE9+/Chrome/FF试试看？');
        return;
      }
      /* eslint no-eval: "error"*/
      /* eslint-env browser*/
      var data = window.eval('(' + txt + ')');
      if (data instanceof Array) {
        data = data[0];
      }
      // ele.value = '';
      processJSONImport(data);
      console.log(data);
      $scope.currentAction = apiInfoService.switchA($scope.currentAction.id);
      $('#modal1').modal('hide');
      // this.cancelImportJSON();
    } catch (e) {
      alert('JSON解析错误: ' + e.message);
      // showMessage(CONST.ERROR, ELEMENT_ID.IMPORT_JSON_MESSAGE, 'JSON解析错误: ' + e.message);
    }
  };
  // /**
  //  * sort parameters recursively
  //  */
  // function sortParams(params) {
  //   if (!params) return;
  //   var i = 0;
  //   var n = params.length;
  //   var o;
  //   // params.sort(paramsSorter);
  //   for (; i < n; i++) {
  //     sortParams(params[i].parameterList);
  //   }
  // }
  /**
   * process JSON import
   *
   * @param {object}  f value to be processed
   * @param {string}  k key
   * @param {number}  pid parameter id
   * @param {boolean} notFirst
   */
  function processJSONImport(f, k, pId, notFirst, arrContext) {
    var id;
    var param = {};
    // var doesImportToRequest = ws._doesImportToRequest;
    // $scope.doesImportType = true;
    // 是否新建
    if (notFirst) {
      // 没有根节点
      if (!pId) {
        // 创建请求参数
        if ($scope.doesImportType === 'reqParam') {
          id = apiInfoService.addRequestParameter($scope.currentAction.id);
        } else if ($scope.doesImportType === 'resData') {
          // 创建响应参数
          id = apiInfoService.addResponseData($scope.currentAction.id);
        } else if ($scope.doesImportType === 'reqData') {
          id = apiInfoService.addRequestData($scope.currentAction.id);
        } else if ($scope.doesImportType === 'reqHeader') {
          id = apiInfoService.addRequestHeader($scope.currentAction.id);
        }
        // 获取对应对象
        param = apiInfoService.getParameter($scope.currentAction.id, id, $scope.doesImportType);
        param.identifier = k;
      } else {
        // 创建子节点
        id = apiInfoService.addChildParameter($scope.currentAction.id, pId, $scope.doesImportType);
        param = apiInfoService.getParameter($scope.currentAction.id, id, $scope.doesImportType);
        param.identifier = k;
      }
    }
    // var key;
    var f2; // child of f
    var i;
    var mValues; // mock @order values
    // 根据类型 生成param 各属性
    if (f instanceof Array && f.length) {
      // 是否根节点
      if (notFirst) {
        f2 = f[0];
        if (typeof f2 === 'string') {
          param.dataType = 'array<string>';
          param.remark = '@mock=' + f;
        } else if (typeof f2 === 'number') {
          param.dataType = 'array<number>';
          param.remark = '@mock=' + f;
        } else if (typeof f2 === 'boolean') {
          param.dataType = 'array<boolean>';
          param.remark = '@mock=' + f;
        } else if (f2 instanceof Array) {
          param.dataType = 'array';
          param.remark = '@mock=' + JSON.stringify(f);
        } else if (f !== null && typeof f2 === 'object') {
          param.dataType = 'array<object>';
          for (key in f2) {
            if ({}.hasOwnProperty.call(foo, key)) {
              processJSONImport(f2[key], key, notFirst ? id : undefined, true, f.length > 1 ? f : undefined);
            }
          }
        }
        // process @order for import array data
        if (typeof f2 in {
            number: undefined
            , boolean: undefined
          } && f.length > 1) {
          mValues = [f2];
          for (i = 1; i < f.length; i += 1) {
            mValues.push(f[i]);
          }
          param.remark = '@mock=$order(' + mValues.join(',') + ')';
        } else if (typeof f2 === 'string' && f.length > 1) {
          mValues = ['\'' + f2 + '\''];
          for (i = 1; i < f.length; i += 1) {
            mValues.push('\'' + f[i] + '\'');
          }
          param.remark = '@mock=$order(' + mValues.join(',') + ')';
        }
      }
    } else if (typeof f === 'string') {
      if (param) {
        param.dataType = 'string';
        param.remark = '@mock=' + f;
      }
    } else if (typeof f === 'number') {
      if (param) {
        param.dataType = 'number';
        param.remark = '@mock=' + f;
      }
    } else if (typeof f === 'boolean') {
      if (param) {
        param.dataType = 'boolean';
        param.remark = '@mock=' + f;
      }
    } else if (typeof f === 'object') {
      var oldKey;
      var oldItem;
      if (param) {
        param.dataType = 'object';
      }
      Object.keys(f).forEach((key) => {
        oldKey = key;
        oldItem = f[key];
        if (f[key] && f[key] instanceof Array && f[key].length > 1 && f[key][0] instanceof Object && f[key][0] !==
          null && !(f[key][0] instanceof Array)) {
          key = key + '|' + f[key].length;
          delete f[oldKey];
          f[key] = oldItem;
        }
        processJSONImport(f[key], key, notFirst ? id : null, true);
      });
    }
    if (arrContext && typeof f in {
        number: undefined
        , boolean: undefined
      }) {
      // process @order for import array data for array<object>
      mValues = [f];
      for (i = 1; i < arrContext.length; i += 1) {
        mValues.push(arrContext[i][k]);
      }
      param.remark = '@mock=$order(' + mValues.join(',') + ')';
    } else if (arrContext && typeof f === 'string') {
      mValues = ['\'' + f + '\''];
      for (i = 1; i < arrContext.length; i += 1) {
        mValues.push('\'' + arrContext[i][k] + '\'');
      }
      param.remark = '@mock=$order(' + mValues.join(',') + ')';
    }
  }
}

