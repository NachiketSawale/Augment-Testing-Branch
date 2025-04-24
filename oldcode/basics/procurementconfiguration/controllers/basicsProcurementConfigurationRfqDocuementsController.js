/**
 * Created by pel on 3/22/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigurationRfqDocuementsController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfigurationRfqDocumentsService','basicsProcurementConfigurationRfqDocumentsValidationService',
			'basicsProcurementConfigurationRfqDocumentsUIService',
			function ($scope, gridControllerService, dataService,validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);
