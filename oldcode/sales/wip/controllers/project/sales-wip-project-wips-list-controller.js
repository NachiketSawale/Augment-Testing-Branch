/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipProjectWipsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of wip (header) entities in module project
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipProjectWipsListController',
		['_', '$scope', '$translate', 'platformGridControllerService', 'salesWipProjectWipsService', 'platformContainerControllerService', 'platformModuleNavigationService',
			function (_, $scope, $translate, platformGridControllerService, salesWipProjectWipsService, platformContainerControllerService, naviService) {

				platformContainerControllerService.initController($scope, moduleName, 'E462BC1E81F648039CB506B9FCF70F4E');

				platformGridControllerService.addTools([{
					id: 't15',
					caption: $translate.instant('sales.wip.goToSalesWip'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openSalesWip() {
						// Go to sales wip module
						var navigator = {moduleName: 'sales.wip'},
							selectedItem = salesWipProjectWipsService.getSelected();

						if (salesWipProjectWipsService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(salesWipProjectWipsService.getSelected()) || !naviService.hasPermissionForModule('sales.wip');
					}
				}]);

				// update toolbar (especially on delection, and "goto" toolbar button)
				salesWipProjectWipsService.registerSelectionChanged($scope.updateTools);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					salesWipProjectWipsService.unregisterSelectionChanged($scope.updateTools);
				});

			}
		]);
})(angular);
