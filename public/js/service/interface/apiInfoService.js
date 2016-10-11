const angular = require('angular');
angular.module('apiInfo.services', [])
  .factory('apiInfoService', ($http, $q) => {
    let pageList = [],
      actionList = [],
      actionId = '',
      _curActionId = '2222',
      _generatedId = -1;

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

    const interfaceListService = {};

    interfaceListService.setPageList = pgList => {
      pageList = pgList;
    }
    interfaceListService.getPageList = () => {
      return pageList;
    }

    // 添加请求参数
    interfaceListService.addRequestParameter = (actionId) => {
      var pNew = newParameter();
      const rl = interfaceListService.getAction(actionId).requestParameterList;
      pNew.id = createId(null, rl);
      pNew.pNum =  parentNum(pNew.id);
      rl.push(pNew);
      return pNew.id;
    };

    // 添加请求数据
    interfaceListService.addRequestData = (actionId) => {
      var pNew = newParameter();
      const rl = interfaceListService.getAction(actionId).requestDataList;
      pNew.id = createId(null, rl);
      pNew.pNum =  parentNum(pNew.id);
      rl.push(pNew);
      return pNew.id;
    };

    // 添加请求头
    interfaceListService.addRequestHeader = (actionId) => {
      var pNew = newParameter();
      const rl = interfaceListService.getAction(actionId).requestHeaderList;
      pNew.id = createId(null, rl);
      pNew.pNum =  parentNum(pNew.id);
      rl.push(pNew);
      return pNew.id;
    };

    // 添加响应数据
    interfaceListService.addResponseData = (actionId) => {
      var pNew = newParameter();
      const rl = interfaceListService.getAction(actionId).responseDataList;
      pNew.id = createId(null, rl);
      pNew.pNum =  parentNum(pNew.id);
      rl.push(pNew);
      return pNew.id;
    };

    // interfaceListService.getAction = getAction;

    // 获取接口参数
    interfaceListService.getAction = (id) => {
      pageListCount = pageList.length;
      for (var j = 0; j < pageListCount; j++) {
        var page = pageList[j],
          actionList = page.actionList,
          actionListCount = actionList.length;
        for (var k = 0; k < actionListCount; k++) {
          var action = {};
          action = actionList[k];
          if (action.id === id) {
            return action;
          }
        }
      }
      // }
      return null;
    };

    interfaceListService.addChildParameter = (actionId, parentParamId, type) => {
      var p = interfaceListService.getParameter(actionId, parentParamId, type);
      if (p !== null) {
        var pNew = newParameter();
        pNew.id = createId(parentParamId, p.parameterList);
        pNew.pNum =  parentNum(pNew.id);
        p.parameterList.push(pNew);
        return pNew.id;
      }
      return -1;
    };

    interfaceListService.savePages = (actionId) => {
      const plg = pageList.length;
      const deferred = $q.defer();
      const promise = deferred.promise;
      let plist = [];

      //      for (let i = 0; i < plg; i++) {
      //         const p = pageList[i];
      //         if (p.isEdit) {
      //           $http.post('/page', p).success((data) => {
      //             if (data.status === 'success') {
      //               deferred.resolve(data);
      //             } else {
      //               deferred.reject(data.error);
      //             }
      //           }).error((error) => {
      //             deferred.reject(error);
      //           });
      //         }
      //       }

      for (let i = 0; i < plg; i++) {
        const p = pageList[i];
        // 获取变更页面
        // if (p.isEdit) {
        //   const pp = $http.post('/page', p).success((data) => {
        //     if (data.status === 'success') {
        //       deferred.resolve(data);
        //     } else {
        //       deferred.reject(data.error);
        //     }
        //   }).error((error) => {
        //     deferred.reject(error);
        //   });
        //   plist.push(pp);
        // }

        // 获取变更接口
        let actionList = p.actionList,
          actionListCount = actionList.length;
        for (let k = 0; k < actionListCount; k++) {
          let action = actionList[k];
          if (action.id === actionId) {
            if (action.requestParameterList || action.requestParameterList > 0) {
              action.requestParameter = JSON.stringify(action.requestParameterList);
            }
            if (action.requestHeaderList || action.requestHeaderList > 0) {
              action.requestHeader = JSON.stringify(action.requestHeaderList);
            }
            if (action.requestHeaderList || action.requestHeaderList > 0) {
              action.requestData = JSON.stringify(action.requestDataList);
            }
            if (action.responseDataList || action.responseDataList > 0) {
              action.responseData = JSON.stringify(action.responseDataList);
            }

            let ap =
              $http.post('/api', action).success((data) => {
                if (data.status === 'success') {
                  deferred.resolve(data);
                } else {
                  deferred.reject(data.error);
                }
              }).error((error) => {
                deferred.reject(error);
              });
            plist.push(ap);
          }
        }
      }

      $q.all(plist)
        .then(function(results) {
          for (var i = 0; i < results.length; i++) {
            // theResults.push(result[i]);
            if (results[i].data.status !== 'success') {
              return deferred.reject(results[i].data.error);
            }
          }
          deferred.resolve(results);
          //将结果委托回调函数
          // deferred.resolve(aggregatedData);
        });
      //返回回调函数结果

      return deferred.promise;



      // return promise;
    };

    interfaceListService.addPage = function(page) {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.post('/page', page).success((data) => {
        if (data.status === 'success') {
          data.id = generateId();
          data.isIdGenerated = true;
          data.actionList = [];
          pageList.push(data);
          deferred.resolve(data);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    interfaceListService.addAction = function(obj, addExisted, isCopy) {
      obj = deepCopy(obj);
      if (isCopy) {
        obj.name += '-副本';
      }
      var oldId = obj.id;
      if (!obj.id) {
        // 新建
        obj.id = generateId();
      } else {
        // 编辑
        var action = interfaceListService.getAction(obj.id);
        if (action !== null) {
          action = obj;
        }
        return obj.id;
      }
      if (!addExisted || addExisted === 'mount') {
        obj.requestParameterList = [];
        obj.requestDataList = [];
        obj.requestHeaderList = [];
        obj.responseDataList = [];
        /**
        if (addExisted === 'mount') {
            obj.requestType = '99';
            obj.responseTemplate = '{{mountId}}' + oldId;
        }
        */
      } else {
        // recursively update identifier
        var i;
        for (i = 0; i < obj.requestParameterList.length; i++) {
          recurUpdateParamId(obj.requestParameterList[i]);
        }
        for (i = 0; i < obj.responseDataList.length; i++) {
          recurUpdateParamId(obj.responseDataList[i]);
        }
        for (i = 0; i < obj.requestDataList.length; i++) {
          recurUpdateParamId(obj.requestDataList[i]);
        }
        for (i = 0; i < obj.requestHeaderList.length; i++) {
          recurUpdateParamId(obj.requestHeaderList[i]);
        }
      }
      getPage(obj.pageId).actionList.push(obj);

      function recurUpdateParamId(param) {
        param.id = p.generateId();
        if (param.parameterList) {
          for (var i = 0; i < param.parameterList.length; i++) {
            recurUpdateParamId(param.parameterList[i]);
          }
        }
      }
      return obj.id;
    };

    // deep copy
    function deepCopy(o) {
      return jQuery.extend(true, {}, o);
    }



    function getPage(id) {

      pageListNum = pageList.length;
      for (var j = 0; j < pageListNum; j++) {
        if (pageList[j]._id === id) {
          return pageList[j];
        }
      }

      return null;
    }

    function generateId() {
      return _generatedId--;
    }

    interfaceListService.addParam = (type, actionId, parentParamId, paramType) => {
      var newParamId = -1;
      if (type == "child") {
        newParamId = interfaceListService.addChildParameter(actionId, parentParamId, paramType);
      } else if (type == "reqParam") {
        newParamId = interfaceListService.addRequestParameter(actionId);
      } else if (type == "resData") {
        newParamId = interfaceListService.addResponseData(actionId);
      } else if (type == "reqData") {
        newParamId = interfaceListService.addRequestData(actionId);
      } else if (type == "reqHeader") {
        newParamId = interfaceListService.addRequestHeader(actionId);
      } else {
        throw new Error("unkown type: " + type + " in ws.addParam(type, parentParamId);");
      }
      return actionList;
      // finish edit before refresh
      // this.finishEdit();
      // this.switchA(_curActionId);
      // if (newParamId > 0) {
      //     this.edit(newParamId, "param-identifier");
      // }
    };

    // 删除参数 响应参数中单条参数
    // actionId 接口id
    // paramId 参数id
    // type 参数类型 reqParam resData reqData reqHeader
    interfaceListService.removeParameter = function(actionId, id, type) {
      var l,
        parameter,
        pageListCount = pageList.length;
      for (var j = 0; j < pageListCount; j++) {
        var page = pageList[j],
          actionList = page.actionList,
          actionListCount = actionList.length;
        for (var k = 0; k < actionListCount; k++) {
          if (actionId === actionList[k].id) {
            var action = actionList[k],
              requestParameterList = action.requestParameterList,
              requestParameterListCount = requestParameterList.length,
              requestDataList = action.requestDataList,
              requestDataListCount = requestDataList.length,
              requestHeaderList = action.requestHeaderList,
              requestHeaderListCount = requestHeaderList.length,
              responseDataList = action.responseDataList,
              responseDataListCount = responseDataList.length;
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
          }
        }
      }
      return -1;
    };

    /**
     * remove parameter recursively
     * return 0 if remove successfully,
     * otherwise return -1
     */
    function removeParameterRecursively(p, id) {
      var parameterList = p.parameterList,
        parameterListNum = parameterList && parameterList.length ? parameterList.length : 0;

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

    // 获取请求 响应参数中单条参数
    // actionId 接口id
    // paramId 参数id
    // type 参数类型 reqParam resData reqData reqHeader
    interfaceListService.getParameter = (actionId, paramId, type) => {
      var l,
        parameter,
        recursivelyFoundParameter;

      pageListCount = pageList.length;
      for (var j = 0; j < pageListCount; j++) {
        var page = pageList[j],
          actionList = page.actionList,
          actionListCount = actionList.length;
        for (var k = 0; k < actionListCount; k++) {
          if (actionId === actionList[k].id) {
            var action = actionList[k],
              requestParameterList = action.requestParameterList,
              requestParameterListCount = requestParameterList.length,
              requestDataList = action.requestDataList,
              requestDataListCount = requestDataList.length,
              requestHeaderList = action.requestHeaderList,
              requestHeaderListCount = requestHeaderList.length,
              responseDataList = action.responseDataList,
              responseDataListCount = responseDataList.length;
            if (type === 'reqParam') {
              for (l = 0; l < requestParameterListCount; l++) {
                parameter = requestParameterList[l];
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
          }
        }
      }
      return null;
    };

    function getParameterRecursively(p, id) {
      var parameterList = p.parameterList,
        parameterListNum = parameterList && parameterList.length ? parameterList.length : 0;

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

    interfaceListService.getPageByProjectId = (projectId) => {

      // var p1 = () => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/pages/' + projectId).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);

          // 组装
          pageList = data.response;
          for (var pi in pageList) {
            pageList[pi].actionList = [];
            pageList[pi].id = pageList[pi]._id;
          }
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
      // }

      // var p2 = () => {
      //   const deferred = $q.defer();
      //   const promise = deferred.promise;
      //   $http.get('/apis/' + projectId).success((data) => {
      //     if (data.status === 'success') {
      //       deferred.resolve(data.response);

      //       // 组装
      //       var acList = data.response;

      //       for (var pi in pageList) {
      //         for (var ai in acList) {
      //           if (pageList[pi].id === acList[ai].projectId) {
      //             pageList[pi].actionList.push(acList[ai]);
      //           }
      //         }
      //       }
      //       deferred.resolve(pageList);
      //     } else {
      //       deferred.reject(data.error);
      //     }
      //   }).error((error) => {
      //     deferred.reject(error);
      //   });
      //   return promise;
      // }

      // $q.all([p1(), p2()])
      //   .then(function(results) {
      //     for (var i = 0; i < results.length; i++) {
      //       // theResults.push(result[i]);
      //       if (results[i].data.status !== 'success') {
      //         return deferred.reject(results[i].data.error);
      //       }
      //     }
      //     deferred.resolve(pageList);
      //     //将结果委托回调函数
      //     // deferred.resolve(aggregatedData);
      //   });
      //返回回调函数结果

      // return promise;
    };

    interfaceListService.getActionsByProjectId = (projectId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/apis/' + projectId).success((data) => {
        if (data.status === 'success') {
          // deferred.resolve(data.response);

          // 组装
          var acList = data.response;

          for (var pi in pageList) {
            for (var ai in acList) {
              if (pageList[pi]._id === acList[ai].pageId) {
                acList[ai].id = acList[ai]._id

                if (!acList[ai].requestParameter) {
                  acList[ai].requestParameterList = [];
                } else {
                  acList[ai].requestParameterList = JSON.parse(acList[ai].requestParameter);
                }

                if (!acList[ai].requestHeader) {
                  acList[ai].requestHeaderList = [];
                } else {
                  acList[ai].requestHeaderList = JSON.parse(acList[ai].requestHeader);
                }

                if (!acList[ai].requestData) {
                  acList[ai].requestDataList = [];
                } else {
                  acList[ai].requestDataList = JSON.parse(acList[ai].requestData);
                }

                if (!acList[ai].responseData) {
                  acList[ai].responseDataList = [];
                } else {
                  acList[ai].responseDataList = JSON.parse(acList[ai].responseData);
                }
                pageList[pi].actionList.push(acList[ai]);
              }
            }
          }
          deferred.resolve(pageList);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    interfaceListService.removePage = (pageId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.delete('/page/' + pageId).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    interfaceListService.removeAction = (actionId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.delete('/api/' + actionId).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    interfaceListService.getApi = (projectId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/api/' + projectId).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    // 添加／取消 订阅
    interfaceListService.favourite = (actionId, isFavourite) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      if (!isFavourite) {
        $http.put('/favourite/' + actionId).success((data) => {
          if (data.status === 'success') {
            deferred.resolve(data.response);
          } else {
            deferred.reject(data.error);
          }
        }).error((error) => {
          deferred.reject(error);
        });
      } else {
        $http.delete('/favourite/' + actionId).success((data) => {
          if (data.status === 'success') {
            deferred.resolve(data.response);
          } else {
            deferred.reject(data.error);
          }
        }).error((error) => {
          deferred.reject(error);
        });
      }

      return promise;
    };


    interfaceListService.getFavourite = (actionId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/favourite').success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    interfaceListService.getHistory = (actionId) => {
      const deferred = $q.defer();
      const promise = deferred.promise;
      $http.get('/apiHistory/' + actionId).success((data) => {
        if (data.status === 'success') {
          deferred.resolve(data.response);
        } else {
          deferred.reject(data.error);
        }
      }).error((error) => {
        deferred.reject(error);
      });
      return promise;
    };

    /*生成id */
    function createId(parentId, obList) {

      if (parentId) {
        // var obList = obListService.get();
        // var num = 1;
        // for (var i = 0; i < obList.length; i++) {
        //   if (obList[i].parent == parentId) {
        //     num++;
        //   }
        // }
        return parentId + "_" + obList.length;
      } else {
        //根节点
        return obList.length + 1 + '';
      }

    }

    // 统计层级
    function parentNum(id){
      var n=(id.split('_')).length;
      return n;
    }

    return interfaceListService;
  });
