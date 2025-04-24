
(function (angular) {

	'use strict';

	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).controller('basicsBiPlusDesignerDashboard2GroupDetailController', basicsBiPlusDesignerDashboard2GroupDetailController);

	basicsBiPlusDesignerDashboard2GroupDetailController.$inject = ['$scope', 'basicsBiPlusDesignerDashboard2GroupDataService', 'platformDetailControllerService', 'basicsBiPlusDesignerDashboard2GroupUIStandardService', 'basicsConfigTranslationService', 'basicsBiPlusDesignerDashboard2GroupValidationService'];

	function basicsBiPlusDesignerDashboard2GroupDetailController($scope, basicsBiPlusDesignerDashboard2GroupDataService, platformDetailControllerService, basicsBiPlusDesignerDashboard2GroupUIStandardService, basicsConfigTranslationService, basicsBiPlusDesignerDashboard2GroupValidationService) {

		platformDetailControllerService.initDetailController($scope, basicsBiPlusDesignerDashboard2GroupDataService, basicsBiPlusDesignerDashboard2GroupValidationService, basicsBiPlusDesignerDashboard2GroupUIStandardService, basicsConfigTranslationService);
	}
})(angular);
