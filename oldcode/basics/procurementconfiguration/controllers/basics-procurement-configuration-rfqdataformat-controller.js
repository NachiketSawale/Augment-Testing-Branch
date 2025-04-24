/**
 * Created by lvy on 3/21/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigurationRfqDataFormatController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfigurationDataFormatService','basicsProcurementConfigurationRfqDataFormatValidationService',
			'basicsProcurementConfigurationRfqDataFormatUIService',
			function ($scope, gridControllerService, dataService,validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);