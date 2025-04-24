(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementQuoteTotalController
	 * @requires $scope,
	 * @description Controller for the total grid container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementQuoteTotalController', [
		'$scope', 'platformGridControllerService', 'procurementQuoteTotalDataService',
		'procurementQuoteTotalUIConfigurationService', 'procurementQuoteTotalValidationService',
		function ($scope, platformGridControllerService, dataService, configurationsService, validationService) {

			var validator = validationService(dataService);
			platformGridControllerService.initListController($scope, configurationsService, dataService, validator, {});

			platformGridControllerService.addTools([
				{
					id: 't1000',
					sort: 1000,
					caption: 'procurement.common.total.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					permission: '#w',
					disabled: function () {
						return dataService.recalculateDisable();
					},
					fn: function updateCalculation() {
						dataService.updateCalculation();
					}
				},
				{
					id: 't1001',
					sort: 1001,
					caption: 'procurement.common.total.toolbarFilter',
					type: 'check',
					iconClass: 'tlb-icons ico-on-off-zero',
					permission: '#r',
					value: !dataService.getShowAllStatus(),
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