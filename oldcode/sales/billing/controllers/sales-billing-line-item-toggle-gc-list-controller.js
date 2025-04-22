/**
 * Created by postic on 27.06.2022.
 */
(function () {

	'use strict';
	var moduleName = 'sales.billing';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name salesBillingLineItemToggleGcListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of line item entities. Either loaded by project (sales header) or Boq Item
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('salesBillingLineItemToggleGcListController',
		['$scope', '$timeout', 'salesBillingService', 'salesBillingBoqStructureService', 'salesBillingEstimateLineItemDataService', 'salesBillingEstimateLineItemGcDataService',
			function ($scope, $timeout, salesBillingService, salesBillingBoqStructureService, salesBillingEstimateLineItemDataService, salesBillingEstimateLineItemGcDataService) {

				var defineGrid = function () {
					var selectedBill = salesBillingService.getSelected();
					var selectedBoqItem = salesBillingBoqStructureService.getSelected();
					if (selectedBill && selectedBoqItem) {
						$scope.gridId = '1A68D99550B34B44844FC7B4E856F70C';
						$scope.isGc = false;
						$scope.isNormal = true;
					} else {
						$scope.gridId = '310C540EF65545EA8EAEE77F87080322';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesBillingEstimateLineItemDataService.setButton.fire();
					}
				};

				var toggleGrid = function (isGc) {
					if (isGc) {
						$scope.gridId = '310C540EF65545EA8EAEE77F87080322';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesBillingEstimateLineItemDataService.setButton.fire();
					} else {
						$scope.gridId = '1A68D99550B34B44844FC7B4E856F70C';
						$scope.isGc = false;
						$scope.isNormal = true;
					}
				};

				var activateGcContainer = function () {
					var selectedBill = salesBillingService.getSelected();
					if ($scope.isNormal && selectedBill) {
						salesBillingEstimateLineItemDataService.clearContentLI(true);
						salesBillingEstimateLineItemGcDataService.clearContentLI(true);
						$scope.gridId = '310C540EF65545EA8EAEE77F87080322';
						$scope.isGc = true;
						$scope.isNormal = false;
						salesBillingEstimateLineItemDataService.setButton.fire();
					}
				};

				var activateNormalContainer = function () {
					var selectedBoqItem = salesBillingBoqStructureService.getSelected();
					if ($scope.isGc && selectedBoqItem) {
						salesBillingEstimateLineItemDataService.clearContentLI(true);
						salesBillingEstimateLineItemGcDataService.clearContentLI(true);
						$scope.gridId = '1A68D99550B34B44844FC7B4E856F70C';
						$scope.isGc = false;
						$scope.isNormal = true;
					}
				};

				var clearNormalContent = function () {
					salesBillingEstimateLineItemDataService.clearContentLI(true);
				};

				var clearGcContent = function () {
					salesBillingEstimateLineItemGcDataService.clearContentLI(true);
				};


				defineGrid();


				salesBillingEstimateLineItemDataService.gcButtonClicked.register(toggleGrid);
				salesBillingEstimateLineItemGcDataService.gcButtonClicked.register(toggleGrid);

				salesBillingBoqStructureService.registerSelectionChanged(activateNormalContainer);
				salesBillingService.registerSelectionChanged(activateGcContainer);
				salesBillingBoqStructureService.registerSelectionChanged(clearNormalContent);
				salesBillingService.registerSelectionChanged(clearGcContent);


				$scope.$on('$destroy', function () {
					salesBillingEstimateLineItemDataService.gcButtonClicked.unregister(toggleGrid);
					salesBillingEstimateLineItemGcDataService.gcButtonClicked.unregister(toggleGrid);
					salesBillingBoqStructureService.unregisterSelectionChanged(activateNormalContainer);
					salesBillingService.unregisterSelectionChanged(activateGcContainer);
				});

			}
		]);
})();