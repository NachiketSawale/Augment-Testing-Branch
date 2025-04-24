/**
 * Created by lvy on 4/16/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsPrcConfigRfqCoverLetterOrEamilBodyController',
		['$scope', 'platformGridControllerService', 'basicsPrcConfigRfqCoverLetterOrEamilBodyService','basicsProcurementConfigurationRfqReportsValidationService',
			'basicsPrcConfigRfqCoverLetterOrEamilBodyUIService',
			function ($scope, gridControllerService, dataService,commonValidationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				var validationService = commonValidationService(dataService);
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);