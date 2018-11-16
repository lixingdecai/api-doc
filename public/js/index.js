// require('../stylesheets/vendor.css');
// require('../static/bootstrap/3.3.5/css/bootstrap.min.css');
const angular = require('angular');
require('angular-route')
require('angular-ui-router');
// require('../libs/angular-route.js');
// require('../libs/angular-route.min.js');
require('../libs/jquery/jquery-1.9.1.min.js');
require('../libs/bootstrap/3.3.5/js/bootstrap.min.js');
require('../libs/datetimepicker/css/datetimepicker.css');
// require('../../node_modules/moment/moment.js');
// require('../../node_modules/moment/locale/zh-cn.js');
// require('../../node_modules/angular-momentjs/angular-momentjs.js');
require('../libs/datetimepicker/js/datetimepicker.js');
require('../libs/datetimepicker/js/datetimepicker.templates.js');
require('./app.js');
require('./controller.js');
require('./controller/interface/apiListCtrl.js');
require('./service/interface/apiListService.js');
require('./controller/login/loginCtrl.js');
require('./service/login/loginService.js');
require('./controller/project/projectCtrl.js');
require('./service/project/projectService.js');
require('./controller/interface/apiInfoCtrl.js');
require('./controller/interface/addApiCtrl.js');
require('./service/interface/apiInfoService.js');
require('./service/user/userService.js');
require('./controller/user/userCtrl.js');
require('./service/product/productService.js');
require('./controller/product/productCtrl.js');
require('./controller/tag/tagCtrl.js');
require('./service/tag/tagService.js');
require('./controller/mock/mockCtrl.js');
require('./service/mock/mockService.js');
require('./utils/utils.js');
require('../libs/nginput/js/ng-tags-input.min.js');
require('../libs/nginput/css/ng-tags-input.min.css');
