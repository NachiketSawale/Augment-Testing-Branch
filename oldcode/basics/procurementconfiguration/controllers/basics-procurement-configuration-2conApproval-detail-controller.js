/**
 * Created by lvy on 10/12/2020.
 */
(function () {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basPrcConfig2ConApprovalDetailController', [
		'$scope',
		'basPrcConfig2ConApprovalValidationService',
		'basPrcConfig2ConApprovalDataService',
		'basPrcConfig2ConApprovalUIService',
		'platformDetailControllerService',
		function (
			$scope,
			validationService,
			dataService,
			uiService,
			platformDetailControllerService
		) {
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, null);
		}]);

})();