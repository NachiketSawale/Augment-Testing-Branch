/**
 * Created by postic on 21.06.2022.
 */
(function () {

	'use strict';
	var moduleName = 'sales.wip';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name salesWipLineItemToggleGcListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of line item entities. Either loaded by project (sales header) or Boq Item
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('salesWipLineItemToggleGcListController',
		['$scope', '$timeout', 'salesWipService', 'salesWipBoqStructureService', 'salesWipEstimateLineItemDataService', 'salesWipEstimateLineItemGcDataService',
			function ($scope, $timeout, salesWipService, salesWipBoqStructureService, salesWipEstimateLineItemDataService, salesWipEstimateLineItemGcDataService) {

				var defineGrid = function () {
					var selectedWip = salesWipService.getSelected();
					var selectedBoqItem = salesWipBoqStructureService.getSelected();
					if (selectedWip && selectedBoqItem) {
						$scope.gridId = 'D2EA490FFFC84F0090DD1D1B78E69768';
						$scope.isGc = false;
						$scope.isNormal = true;
					} else {
						$scope.gridId = '6BA1D8BC9E184389888793CA65D82808';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesWipEstimateLineItemDataService.setButton.fire();
					}
				};

				var toggleGrid = function (isGc) {
					if (isGc) {
						$scope.gridId = '6BA1D8BC9E184389888793CA65D82808';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesWipEstimateLineItemDataService.setButton.fire();
					} else {
						$scope.gridId = 'D2EA490FFFC84F0090DD1D1B78E69768';
						$scope.isGc = false;
						$scope.isNormal = true;
					}
				};

				var activateGcContainer = function () {
					var selectedWip = salesWipService.getSelected();
					if ($scope.isNormal && selectedWip) {
						salesWipEstimateLineItemDataService.clearContentLI(true);
						salesWipEstimateLineItemGcDataService.clearContentLI(true);
						$scope.gridId = '6BA1D8BC9E184389888793CA65D82808';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesWipEstimateLineItemDataService.setButton.fire();
					}
				};

				var activateNormalContainer = function () {
					var selectedBoqItem = salesWipBoqStructureService.getSelected();
					if ($scope.isGc && selectedBoqItem) {
						salesWipEstimateLineItemDataService.clearContentLI(true);
						salesWipEstimateLineItemGcDataService.clearContentLI(true);
						$scope.gridId = 'D2EA490FFFC84F0090DD1D1B78E69768';
						$scope.isGc = false;
						$scope.isNormal = true;
					}
				};

				var clearNormalContent = function () {
					salesWipEstimateLineItemDataService.clearContentLI(true);
				};

				var clearGcContent = function () {
					salesWipEstimateLineItemGcDataService.clearContentLI(true);
				};


				defineGrid();


				salesWipEstimateLineItemDataService.gcButtonClicked.register(toggleGrid);
				salesWipEstimateLineItemGcDataService.gcButtonClicked.register(toggleGrid);

				salesWipBoqStructureService.registerSelectionChanged(activateNormalContainer);
				salesWipService.registerSelectionChanged(activateGcContainer);

				salesWipBoqStructureService.registerSelectionChanged(clearNormalContent);
				salesWipService.registerSelectionChanged(clearGcContent);


				$scope.$on('$destroy', function () {
					salesWipEstimateLineItemDataService.gcButtonClicked.unregister(toggleGrid);
					salesWipEstimateLineItemGcDataService.gcButtonClicked.unregister(toggleGrid);
					salesWipBoqStructureService.unregisterSelectionChanged(activateNormalContainer);
					salesWipService.unregisterSelectionChanged(activateGcContainer);
				});

			}
		]);
})();