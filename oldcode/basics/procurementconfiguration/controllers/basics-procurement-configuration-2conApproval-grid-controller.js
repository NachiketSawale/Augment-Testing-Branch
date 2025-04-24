/**
 * Created by lvy on 9/23/2020.
 */

(function () {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basPrcConfig2ConApprovalGridController', [
		'$scope',
		'basPrcConfig2ConApprovalValidationService',
		'basPrcConfig2ConApprovalDataService',
		'basPrcConfig2ConApprovalUIService',
		'platformGridControllerService',
		function (
			$scope,
			validationService,
			dataService,
			uiService,
			gridControllerService
		) {
			var gridConfig = {initCalled: false, columns: []};
			gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}
	]);
})();