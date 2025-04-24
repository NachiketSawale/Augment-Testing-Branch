(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfiguration2Prj2TextTypeController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfiguration2Prj2TextTypeService','basicsProcurementConfiguration2Prj2HeaderTextValidationService',
			'basicsProcurementConfiguration2Prj2TextTypeUIService',
			function ($scope, gridControllerService, dataService,validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);