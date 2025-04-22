/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractTotalsListController
	 * @function
	 *
	 * @description
	 * Controller for the totals container list for multiple selected contract (header) entities.
	 **/
	angular.module(moduleName).controller('salesContractTotalsListController',
		['_', '$scope', 'platformContainerControllerService', 'salesContractTotalsDataService', 'salesContractService',
			function (_, $scope, platformContainerControllerService, salesContractTotalsDataService, salesContractService) {
				platformContainerControllerService.initController($scope, moduleName, '2047403a70504a17b4d3ea23c3fae14c');

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: 'sales.contract.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return _.isEmpty(salesContractService.getSelectedEntities());
					},
					fn: function updateCalculation() {
						// TODO:
						salesContractTotalsDataService.load();
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
				}];

				$scope.addTools(tools);
			}
		]);
})();