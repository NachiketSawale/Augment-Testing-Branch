(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqTotalListController
	 * @requires $scope, platformGridControllerBase
	 * @description
	 * #
	 * Controller for rfq total container
	 */
	angular.module(moduleName).controller('procurementRfqTotalListController',
		['$scope', 'platformGridControllerService', 'procurementRfqTotalUIStandardService', 'procurementRfqTotalService', 'procurementRfqTotalValidationService',
			function ($scope, platformGridControllerService, columnsService, dataService, procurementRfqTotalValidationService) {
				var validator = procurementRfqTotalValidationService(dataService);

				platformGridControllerService.initListController($scope, columnsService, dataService, validator, {});

				platformGridControllerService.addTools([
					{
						id: 't1001',
						sort: 1001,
						caption: 'procurement.common.total.toolbarFilter',
						type: 'check',
						iconClass: 'tlb-icons ico-on-off-zero',
						value: !dataService.getShowAllStatus(),
						permission: '#r',
						fn: function () {
							dataService.reloadByFilter();
						}
					}
				]);

				var removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});
			}
		]);
})(angular);
