(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'procurement.rfq';

	angular.module(moduleName).directive('procurementRfqPartialreqAssignedDataDirective', [
		'$translate', 'platformGridAPI', 'platformObjectHelper', 'basicsCommonDialogGridControllerService',
		function ($translate, platformGridAPI, platformObjectHelper, dialogGridControllerService) {
			return {
				restrict: 'A',
				scope: {},
				replace: false,
				templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/procurement-rfq-partialreq-assigned-data-selection-grid.html',
				controller: ['$scope', '_', '$rootScope',
					'procurementRfqPartialreqAssignedDataDirectiveDataService',
					'procurementRfqPartialreqAssignedDirectiveUiService',
					controller]
			};
			function controller($scope, _, $rootScope, dataService,
				uiService) {
				$scope.gridUUID = 'b85af5b55eb14df8ac99b38731e9c3ae';
				$scope.isRunning = false;
				let gridConfig = {
					uuid: $scope.gridUUID,
					initCalled: false,
					columns: [],
					grouping: false,
					idProperty: 'Id',
					parentProp: 'Pid', childProp: 'Children'
				};

				dialogGridControllerService.initListController($scope, uiService, dataService, dataService.validationService, gridConfig);
				let grid = platformGridAPI.grids.element('id', $scope.gridData.state);
				grid.options.collapsed = false;
				$scope.isRunning = true;
				dataService.loadData()
					.finally(function () {
						$scope.isRunning = false;
					});
			}
		}
	]);
})(angular);