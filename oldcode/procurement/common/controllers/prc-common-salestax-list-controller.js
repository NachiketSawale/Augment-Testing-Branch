/**
 * Created by lcn on 02/24/2022.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).controller('procurementCommonSalesTaxListController',
		['$scope', 'platformGridControllerService', 'procurementCommonSalesTaxUIStandardService', 'procurementCommonSalesTaxValidationService', '$injector', '$translate',
			function ($scope, gridControllerService, gridColumns, validationService, $injector, $translate) {
				var gridConfig = {
					initCalled: false,
					lazyInit: true,
					columns: [],
					parentProp: 'PrcStructureFk',
					childProp: 'SalesTaxItems'
				};

				var dataService = $scope.getContentValue('dataService');
				var modName = $scope.getContentValue('moduleName');
				switch (modName) {
					case 'procurement.invoice':
						gridColumns = gridColumns.get('Procurement.Invoice', 'InvSalesTaxDto');
						break;
					default:
						throw new Error('Unknown moduleName: ' + modName);
				}

				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}
				if (angular.isFunction(dataService)) {
					dataService = dataService.call(this);
				}

				validationService = validationService(dataService);
				dataService.createItem = false;
				dataService.deleteItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
				$scope.addTools([{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.wizard.generateDeliverySchedule.reset'),
					type: 'item',
					iconClass: 'tlb-icons ico-reset',
					permission: '#w',
					disabled: function () {
						return dataService.disabled();
					},
					fn: function updateReset() {
						dataService.getParentService().update().then(function () {
							dataService.recalculate(true);
						});

					}
				}, {
					id: 't2000',
					sort: 2000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					permission: '#w',
					disabled: function () {
						return dataService.disabled();
					},
					fn: function updateCalculation() {
						dataService.getParentService().update().then(function () {
							dataService.recalculate();
						});

					}
				}
				]);
				// eslint-disable-next-line no-undef,func-names
				_.remove($scope.tools.items, function (item) {
					return item && item.id === 'create' && item.id === 'delete';
				});

				// eslint-disable-next-line no-unused-vars
				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};
			}]
	);
})(angular);