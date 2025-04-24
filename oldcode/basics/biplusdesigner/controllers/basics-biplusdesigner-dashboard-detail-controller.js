
(function (angular) {

	'use strict';

	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).controller('basicsBiPlusDesignerDashboardDetailController', basicsBiPlusDesignerDashboardDetailController);

	basicsBiPlusDesignerDashboardDetailController.$inject = ['$scope', 'basicsBiPlusDesignerService', 'platformDetailControllerService', 'basicsBiPlusDesignerDashboardUIStandardService', 'basicsConfigTranslationService', 'basicsBiPlusDesignerDashboardValidationService'];

	function basicsBiPlusDesignerDashboardDetailController($scope, basicsBiPlusDesignerService, platformDetailControllerService, basicsBiPlusDesignerDashboardUIStandardService, basicsConfigTranslationService, basicsBiPlusDesignerDashboardValidationService) {

		platformDetailControllerService.initDetailController($scope, basicsBiPlusDesignerService, basicsBiPlusDesignerDashboardValidationService, basicsBiPlusDesignerDashboardUIStandardService, basicsConfigTranslationService);

	}
})(angular);
