/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractProjectContractsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of contract (header) entities in module project
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractProjectContractsListController',
		['_', '$scope', '$translate', 'platformContainerControllerService', 'platformGridControllerService', 'salesContractProjectContractsService', 'platformModuleNavigationService','salesCommonContextService',
			function (_, $scope, $translate, platformContainerControllerService, platformGridControllerService, salesContractProjectContractsService, naviService,salesCommonContextService) {
				salesCommonContextService.init();
				platformContainerControllerService.initController($scope, moduleName, 'F28370473E8648498FC471FB88D7BAAC');

				platformGridControllerService.addTools([{
					id: 't15',
					caption: $translate.instant('sales.contract.goToSalesContract'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openSalesContract() {
						// Go to sales contract module
						var navigator = {moduleName: 'sales.contract'},
							selectedItem = salesContractProjectContractsService.getSelected();

						if (salesContractProjectContractsService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(salesContractProjectContractsService.getSelected()) || !naviService.hasPermissionForModule('sales.contract');
					}
				}]);

				// update toolbar (especially on delection, and "goto" toolbar button)
				salesContractProjectContractsService.registerSelectionChanged($scope.updateTools);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					salesContractProjectContractsService.unregisterSelectionChanged($scope.updateTools);
				});

			}
		]);
})(angular);
