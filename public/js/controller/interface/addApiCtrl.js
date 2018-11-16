const angular = require('angular');
angular.module('addApi.controllers', []).controller('addApiCtrl', function ($scope, $state, apiInfoService
  , productService, tagService, projectService, $stateParams, $q) {
  initData();
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


  $scope.choseProduct = () => {
    $scope.isChoseProducts = true;
  };
  $scope.cancelChoseProduct = () => {
    $scope.isChoseProducts = false;
  };
  // 通过项目id设置接口模块数据
  $scope.setPageData = () => {
    if ($scope.newApiVO.newApi.project) {
      getPageByProjectId($scope.newApiVO.newApi.project);
      $scope.newApiVO.newApi.pageId = '';
    } else {
      $scope.pageList = [];
      $scope.newApiVO.newApi.pageId = '';
    }
  };
  // 初始化数据
  function initData() {
    // 页面视图辅助对象，用于渲染页面
    $scope.newApiVO = {};
    // 临时存储get方法请求数据，最终用于转成json格式入库
    $scope.newApiVO.requestParameterList = [];
    // 临时存储post方法请求数据，最终用于转成json格式入库
    $scope.newApiVO.requestDataList = [];
    // 临时存储请求头数据，最终用于转成json格式入库
    $scope.newApiVO.requestHeaderList = [];
    // 临时存储响应头数据，最终用于转成json格式入库
    $scope.newApiVO.responseDataList = [];
    // 初始化newApi对象，与model api对应，用于最终入库
    $scope.newApiVO.newApi = {};
    // 因为存储的参数结构是树状格式，用于渲染页面时需要转成列表格式，该对象用于页面参数列表渲染
    $scope.newApiVO.paramViewModel = {};
    // 用于get请求参数列表渲染
    $scope.newApiVO.paramViewModel.requestParameter = [];
    // 用于post请求参数列表渲染
    $scope.newApiVO.paramViewModel.requestData = [];
    // 用于请求头参数列表渲染
    $scope.newApiVO.paramViewModel.requestHeader = [];
    // 用于响应头参数列表渲染
    $scope.newApiVO.paramViewModel.responseData = [];
    getAllProject();
    getAllProduct();
    getAllTag();
  }
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
  // 获取所有项目
  function getAllProject() {
    // 获取所有项目
    projectService.getAll().then(result => {
      $scope.projectList = result;
    }, error => {
      alert(error);
    });
  }
  // 通过项目id获取模块列表
  function getPageByProjectId(id) {
    apiInfoService.getPageByProjectId(id).then(result => {
      $scope.pageList = result;
    }, error => {
      alert(error);
    });
  }
  // 选择标签
  $scope.tagChange = (tag) => {
    $scope.tag = tag;
  };
  // 添加标签
  $scope.addTag = (tag) => {
    if (!tag || tag.isExist) {
      return;
    }
    if (!$scope.newApiVO.newApi.tags) {
      $scope.newApiVO.newApi.tags = [];
    }
    if (!tag.isExist) {
      $scope.newApiVO.newApi.tags.push(tag);
      tag.isExist = true;
      $scope.tag = null;
    }
  };
  // 移除标签
  $scope.rmTag = (id) => {
    for (var i = 0; i < $scope.newApiVO.newApi.tags.length; i += 1) {
      if ($scope.newApiVO.newApi.tags[i]._id === id) {
        $scope.newApiVO.newApi.tags[i].isExist = false;
        $scope.newApiVO.newApi.tags.splice(i, 1);
      }
    }
    for (var i = 0; i < $scope.tagList.length; i += 1) {
      if ($scope.tagList[i]._id === id) {
        $scope.tagList[i].isExist = false;
      }
    }
  };
  // 选择产品
  $scope.productChange = (productVersions) => {
    if (!productVersions.exist) {
      $scope.productVersions = productVersions;
    }
    addProduct(productVersions);
    if (!$scope.newApiVO.newApi.products) {
      $scope.newApiVO.newApi.products = [];
    }
    $scope.newApiVO.newApi.products.push(productVersions);
  };
  // 添加产品
  function addProduct(productVersions) {
    for (var i = 0; i < $scope.productList.length; i += 1) {
      for (var j = 0; j < $scope.productList[i].productVersions.length; j += 1) {
        if ($scope.productList[i].productVersions[j]._id === productVersions._id) {
          $scope.productList[i].productVersions[j].exist = true;
        }
      }
    }
  }
  // 移除产品
  function rmProduct(productVersionsId) {
    for (var i = 0; i < $scope.productList.length; i += 1) {
      for (var j = 0; j < $scope.productList[i].productVersions.length; j += 1) {
        if ($scope.productList[i].productVersions[j]._id === productVersionsId) {
          $scope.productList[i].productVersions[j].exist = false;
        }
      }
    }
  }
  $scope.$removeTag = () => {
    alert('sss');
  };
  // 添加产品
  $scope.addProduct = (productVersions) => {
    addProduct(productVersions);
    if (!$scope.newApiVO.newApi.products) {
      $scope.newApiVO.newApi.products = [];
    }
    $scope.newApiVO.newApi.products.push(productVersions);
  };
  // 移除产品
  $scope.rmProduct = (productVersionsId) => {
    rmProduct(productVersionsId);
    for (var i = 0; i < $scope.newApiVO.newApi.products.length; i += 1) {
      if ($scope.newApiVO.newApi.products[i]._id === productVersionsId) {
        $scope.newApiVO.newApi.products.splice(i, 1);
      }
    }
  };
  // 添加接口
  $scope.addApi = () => {
    // 将参数集合转换成json格式入库
    setParamsToJson();
    apiInfoService.create($scope.newApiVO.newApi);
    alert('保存接口成功，请在列表中查看');
    $state.go('apiList');
  };
  // 将参数集合转换成json格式入库
  function setParamsToJson() {
    var vo = $scope.newApiVO;
    if (vo.requestParameterList || vo.requestParameterList > 0) {
      vo.newApi.requestParameter = JSON.stringify(vo.requestParameterList);
    }
    if (vo.requestHeaderList || vo.requestHeaderList > 0) {
      vo.newApi.requestHeader = JSON.stringify(vo.requestHeaderList);
    }
    if (vo.requestHeaderList || vo.requestHeaderList > 0) {
      vo.newApi.requestData = JSON.stringify(vo.requestDataList);
    }
    if (vo.responseDataList || vo.responseDataList > 0) {
      vo.newApi.responseData = JSON.stringify(vo.responseDataList);
    }
  }
  // 导入json
  $scope.importJson = (doesImportType) => {
    $scope.doesImportType = doesImportType;
    $scope.reqHeadJson = '';
    $('#modal1').modal('show');
  };
  // 添加参数
  $scope.addParam = (type, parentParamId, paramType) => {
    if (type == 'child') {
      addChildParameter(parentParamId, paramType);
    } else if (type == 'reqParam') {
      addRequestParameter();
    } else if (type == 'resData') {
      addResponseData();
    } else if (type == 'reqData') {
      addRequestData();
    } else if (type == 'reqHeader') {
      addRequestHeader();
    } else {
      alert('未知类型参数！');
    }
    // 设置参数列表渲染模型
    setParamViewModel();
  };
  // 删除制定参数
  $scope.removeParam = (paramId, type) => {
    removeParameter(paramId, type);
    // 设置参数列表渲染模型
    setParamViewModel();
  };
  // 删除参数 响应参数中单条参数
  // actionId 接口id
  // paramId 参数id
  // type 参数类型 reqParam resData reqData reqHeader
  function removeParameter(id, type) {
    var l, parameter;
    var vo = $scope.newApiVO
      , requestParameterList = vo.requestParameterList
      , requestParameterListCount = requestParameterList.length
      , requestDataList = vo.requestDataList
      , requestDataListCount = requestDataList.length
      , requestHeaderList = vo.requestHeaderList
      , requestHeaderListCount = requestHeaderList.length
      , responseDataList = vo.responseDataList
      , responseDataListCount = responseDataList.length;
    if (type === 'reqParam') {
      for (l = 0; l < requestParameterListCount; l++) {
        parameter = requestParameterList[l];
        if (parameter.id == id) {
          requestParameterList.splice(l, 1);
          return 0;
        }
        if (removeParameterRecursively(parameter, id) === 0) {
          return 0;
        }
      }
    }
    if (type === 'reqData') {
      for (l = 0; l < requestDataListCount; l++) {
        parameter = requestDataList[l];
        if (parameter.id == id) {
          requestDataList.splice(l, 1);
          return 0;
        }
        if (removeParameterRecursively(parameter, id) === 0) {
          return 0;
        }
      }
    }
    if (type === 'reqHeader') {
      for (l = 0; l < requestHeaderListCount; l++) {
        parameter = requestHeaderList[l];
        if (parameter.id == id) {
          requestHeaderList.splice(l, 1);
          return 0;
        }
        if (removeParameterRecursively(parameter, id) === 0) {
          return 0;
        }
      }
    }
    if (type === 'resData') {
      for (l = 0; l < responseDataListCount; l++) {
        parameter = responseDataList[l];
        if (parameter.id == id) {
          responseDataList.splice(l, 1);
          return 0;
        }
        if (removeParameterRecursively(parameter, id) === 0) {
          return 0;
        }
      }
    }
    return -1;
  }
  /**
   * remove parameter recursively
   * return 0 if remove successfully,
   * otherwise return -1
   */
  function removeParameterRecursively(p, id) {
    var parameterList = p.parameterList
      , parameterListNum = parameterList && parameterList.length ? parameterList.length : 0;
    for (var i = 0; i < parameterListNum; i++) {
      var parameter = parameterList[i];
      if (parameter.id == id) {
        parameterList.splice(i, 1);
        return 0;
      }
      if (removeParameterRecursively(parameter, id) === 0) {
        return 0;
      }
    }
    return -1;
  }

  function addChildParameter(parentParamId, type) {
    var p = getParameter(parentParamId, type);
    if (p !== null) {
      var pNew = newParameter();
      pNew.id = createId(parentParamId, p.parameterList);
      pNew.pNum = parentNum(pNew.id);
      p.parameterList.push(pNew);
      return pNew.id;
    }
    return -1;
  }
  // 添加请求参数
  function addRequestParameter() {
    var pNew = newParameter();
    const rl = $scope.newApiVO.requestParameterList;
    pNew.id = createId(null, rl);
    pNew.pNum = parentNum(pNew.id);
    rl.push(pNew);
    return pNew.id;
  }
  // 添加响应数据
  function addResponseData() {
    var pNew = newParameter();
    const rl = $scope.newApiVO.responseDataList;
    pNew.id = createId(null, rl);
    pNew.pNum = parentNum(pNew.id);
    rl.push(pNew);
    return pNew.id;
  }
  // 添加请求数据
  function addRequestData() {
    var pNew = newParameter();
    const rl = $scope.newApiVO.requestDataList;
    pNew.id = createId(null, rl);
    pNew.pNum = parentNum(pNew.id);
    rl.push(pNew);
    return pNew.id;
  }
  // 添加请求头
  function addRequestHeader() {
    var pNew = newParameter();
    const rl = $scope.newApiVO.requestHeaderList;
    pNew.id = createId(null, rl);
    pNew.pNum = parentNum(pNew.id);
    rl.push(pNew);
    return pNew.id;
  }
  // 统计层级
  function parentNum(id) {
    var n = (id.split('_')).length;
    return n;
  }
  // 获取请求 响应参数中单条参数
  // paramId 参数id
  // type 参数类型 reqParam resData reqData reqHeader
  function getParameter(paramId, type) {
    var l, parameter, recursivelyFoundParameter, vo = $scope.newApiVO
      , requestParameterList = vo.requestParameterList
      , requestParameterListCount = requestParameterList.length
      , requestDataList = vo.requestDataList
      , requestDataListCount = requestDataList.length
      , requestHeaderList = vo.requestHeaderList
      , requestHeaderListCount = requestHeaderList.length
      , responseDataList = vo.responseDataList
      , responseDataListCount = responseDataList.length;
    if (type === 'reqParam') {
      for (l = 0; l < vo.requestParameterList.length; l++) {
        parameter = vo.requestParameterList[l];
        if (parameter.id === paramId) return parameter;
        recursivelyFoundParameter = getParameterRecursively(parameter, paramId);
        if (recursivelyFoundParameter) {
          return recursivelyFoundParameter;
        }
      }
    }
    if (type === 'resData') {
      for (l = 0; l < responseDataListCount; l++) {
        parameter = responseDataList[l];
        if (parameter.id === paramId) return parameter;
        recursivelyFoundParameter = getParameterRecursively(parameter, paramId);
        if (recursivelyFoundParameter) {
          return recursivelyFoundParameter;
        }
      }
    }
    if (type === 'reqData') {
      for (l = 0; l < requestDataListCount; l++) {
        parameter = requestDataList[l];
        if (parameter.id === paramId) return parameter;
        recursivelyFoundParameter = getParameterRecursively(parameter, paramId);
        if (recursivelyFoundParameter) {
          return recursivelyFoundParameter;
        }
      }
    }
    if (type === 'reqHeader') {
      for (l = 0; l < requestHeaderListCount; l++) {
        parameter = requestHeaderList[l];
        if (parameter.id === paramId) return parameter;
        recursivelyFoundParameter = getParameterRecursively(parameter, paramId);
        if (recursivelyFoundParameter) {
          return recursivelyFoundParameter;
        }
      }
    }
    return null;
  }

  function getParameterRecursively(p, id) {
    var parameterList = p.parameterList;
    var parameterListNum = parameterList && parameterList.length ? parameterList.length : 0;
    for (var i = 0; i < parameterListNum; i++) {
      var parameter = parameterList[i];
      if (parameter.id === id) {
        return parameter;
      }
      var recursivelyFoundParameter = getParameterRecursively(parameter, id);
      if (recursivelyFoundParameter) {
        return recursivelyFoundParameter;
      }
    }
    return null;
  }
  // parameter 解析成层级结构modal
  function parseParam(paramList, resultList) {
    var pil = [];
    var plist = paramList.parameterList;
    if (!plist) {
      return;
    }
    var pl = plist.length;
    for (var i = 0; i < pl; i += 1) {
      resultList.push(plist[i]);
      if (plist[i].parameterList && plist[i].parameterList.length > 0) {
        parseParam(plist[i], resultList, pil);
      }
    }
  };
  // 通过参数列表设置视图模型对象
  function setParamViewModel() {
    var ca = $scope.newApiVO;
    // console.log(ca);
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
    ca.paramViewModel = param;
    return ca;
  }
  // 生成id
  function createId(parentId, obList) {
    if (parentId) {
      return parentId + '_' + obList.length;
    } else {
      // 根节点
      return obList.length + 1 + '';
    }
  }
  // 请求 响应参数 ：解析后每一行（最小粒度）
  function newParameter() {
    var obj = {};
    // obj.id = generateId();
    obj.parentId = '';
    obj.identifier = ''; // 标识符
    obj.name = ''; // 含义
    obj.remark = ''; // 备注
    obj.validator = '';
    obj.dataType = ''; // 类别
    obj.parameterList = [];
    return obj;
  }
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
        setParamViewModel();
        $('#modal1').modal('hide');
        // this.cancelImportJSON();
      } catch (e) {
        alert('JSON解析错误: ' + e.message);
        // showMessage(CONST.ERROR, ELEMENT_ID.IMPORT_JSON_MESSAGE, 'JSON解析错误: ' + e.message);
      }
    }
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
          id = addRequestParameter();
        } else if ($scope.doesImportType === 'resData') {
          // 创建响应参数
          id = addResponseData();
        } else if ($scope.doesImportType === 'reqData') {
          id = addRequestData();
        } else if ($scope.doesImportType === 'reqHeader') {
          id = addRequestHeader();
        }
        // 获取对应对象
        param = getParameter(id, $scope.doesImportType);
        param.identifier = k;
      } else {
        // 创建子节点
        id = addChildParameter(pId, $scope.doesImportType);
        param = getParameter(id, $scope.doesImportType);
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
});

