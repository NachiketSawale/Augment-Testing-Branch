(function(angular) {
	'use strict';
	/* global  angular */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonEmployeeAssignmentListController', ppsCommonEmployeeAssignmentListController);

	ppsCommonEmployeeAssignmentListController.$inject = ['$scope', 'platformGridControllerService',
		'ppsCommonEmployeeAssignmentDataService',
		'ppsCommonEmployeeAssignmentUIStandardService',
		'ppsCommonEmployeeAssignmentValidationService'];

	function ppsCommonEmployeeAssignmentListController($scope, gridControllerService,
		dataService,
		uiStandardService,
		validationService) {

		var gridConfig = { initCalled: false, columns: [] };
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		$scope.$on('$destroy', function() {

		});
	}
})(angular);