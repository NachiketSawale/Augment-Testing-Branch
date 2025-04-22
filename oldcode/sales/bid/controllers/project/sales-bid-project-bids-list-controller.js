/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidProjectBidsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of bid (header) entities in module project
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBidProjectBidsListController',
		['_', '$scope', '$translate', 'platformContainerControllerService', 'platformGridControllerService', 'salesBidProjectBidsService', 'platformModuleNavigationService',
			function (_, $scope, $translate, platformContainerControllerService, platformGridControllerService, salesBidProjectBidsService, naviService) {

				platformContainerControllerService.initController($scope, moduleName, '96E96054B48C4F82AED3F9140611B010');

				platformGridControllerService.addTools([{
					id: 't15',
					caption: $translate.instant('sales.bid.goToSalesBid'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openSalesBid() {
						// Go to sales bid module
						var navigator = {moduleName: 'sales.bid'},
							selectedItem = salesBidProjectBidsService.getSelected();

						if (salesBidProjectBidsService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(salesBidProjectBidsService.getSelected()) || !naviService.hasPermissionForModule('sales.bid');
					}
				}]);

				// update toolbar (especially on delection, and "goto" toolbar button)
				salesBidProjectBidsService.registerSelectionChanged($scope.updateTools);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					salesBidProjectBidsService.unregisterSelectionChanged($scope.updateTools);
				});

			}
		]);
})(angular);
