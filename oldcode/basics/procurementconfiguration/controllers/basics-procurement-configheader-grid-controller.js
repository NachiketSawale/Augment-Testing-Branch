/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigHeaderGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfigHeaderDataService',
			'basicsProcurementConfigHeaderValidationService', 'basicsProcurementConfigHeaderUIStandardService',
			function ($scope, gridControllerService, dataService, validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);