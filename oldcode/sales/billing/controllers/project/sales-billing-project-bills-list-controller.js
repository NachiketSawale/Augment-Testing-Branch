/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingProjectBillsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of billing (header) entities in module project
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBillingProjectBillsListController',
		['_', '$scope', '$state', '$translate', 'platformContainerControllerService', 'salesBillingProjectBillsService', 'platformGridControllerService', 'platformModuleNavigationService',
			function (_, $scope, $state, $translate, platformContainerControllerService, salesBillingProjectBillsService, platformGridControllerService, naviService) {

				platformContainerControllerService.initController($scope, moduleName, '4B0D79FFFCE24775B00D8CCD88E489DE');

				platformGridControllerService.addTools([{
					id: 't15',
					caption: $translate.instant('sales.billing.goToSalesBilling'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function opensalesBilling() {
						// Go to sales billing module
						var navigator = {moduleName: 'sales.billing'},
							selectedItem = salesBillingProjectBillsService.getSelected();

						if (salesBillingProjectBillsService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(salesBillingProjectBillsService.getSelected()) || !naviService.hasPermissionForModule('sales.billing');
					}
				}]);

				// update toolbar (especially on delection, and "goto" toolbar button)
				salesBillingProjectBillsService.registerSelectionChanged($scope.updateTools);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					salesBillingProjectBillsService.unregisterSelectionChanged($scope.updateTools);
				});

			}
		]);
})();
