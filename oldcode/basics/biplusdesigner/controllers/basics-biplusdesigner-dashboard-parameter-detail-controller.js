
(function (angular) {

	'use strict';

	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).controller('basicsBiPlusDesignerDashboardParameterDetailController', basicsBiPlusDesignerDashboardParameterDetailController);

	basicsBiPlusDesignerDashboardParameterDetailController.$inject = ['$scope', 'basicsBiPlusDesignerDashboardParameterDataService', 'platformDetailControllerService', 'basicsBiPlusDesignerDashboardParameterUIStandardService', 'basicsConfigTranslationService', 'basicsBiPlusDesignerDashboardParameterValidationService'];

	function basicsBiPlusDesignerDashboardParameterDetailController($scope, basicsBiPlusDesignerDashboardParameterDataService, platformDetailControllerService, basicsBiPlusDesignerDashboardParameterUIStandardService, basicsConfigTranslationService, basicsBiPlusDesignerDashboardParameterValidationService) {

		platformDetailControllerService.initDetailController($scope, basicsBiPlusDesignerDashboardParameterDataService, basicsBiPlusDesignerDashboardParameterValidationService, basicsBiPlusDesignerDashboardParameterUIStandardService, basicsConfigTranslationService);

	}
})(angular);
