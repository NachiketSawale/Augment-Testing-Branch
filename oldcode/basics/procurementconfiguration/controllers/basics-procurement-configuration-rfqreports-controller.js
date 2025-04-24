/**
 * Created by lvy on 3/25/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigurationRfqReportsController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfigurationRfqReportsService','basicsProcurementConfigurationRfqReportsValidationService',
			'basicsProcurementConfigurationRfqReportsUIService',
			function ($scope, gridControllerService, dataService,commonValidationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				var validationService = commonValidationService(dataService);
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);