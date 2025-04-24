/**
 * Created by sfi on 9/1/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfiguration2TabGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfiguration2TabDataService',
			'basicsProcurementConfiguration2TabValidationService', 'basicsProcurementConfigModule2TabUIStandardService',
			function ($scope, gridControllerService, dataService, validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);