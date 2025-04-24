
(function (angular) {
	'use strict';

	var moduleName = 'basics.biplusdesigner';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsBiPlusDesignerDashboardParameterController',
		['$scope', 'platformGridControllerService','basicsBiPlusDesignerDashboardParameterDataService',
			'basicsBiPlusDesignerDashboardParameterUIStandardService','basicsBiPlusDesignerDashboardParameterValidationService',
			function ($scope, gridControllerService, dataService, gridColumns, validationService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
			}
		]);
})(angular);