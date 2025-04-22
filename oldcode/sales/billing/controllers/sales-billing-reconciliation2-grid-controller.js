(function (angular) {
	'use strict';
	/* jshint -W072 */

	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingReconciliation2GridColumns',
		[function () {
			var service = {
				getStandardConfigForListView: getStandardConfigForListView
			};
			function getStandardConfigForListView() {
				return {
					columns: [
						{
							id: 'ReconName',
							field: 'Type',
							formatter: 'description',
							name: 'Type',
							name$tr$: 'procurement.invoice.reconciliation2.type',
							width: 120
						}, {
							id: 'ReconNet',
							field: 'Net',
							formatter: 'money',
							name: 'Net',
							name$tr$: 'procurement.invoice.entityNet',
							width: 120
						}, {
							id: 'ReconVat',
							field: 'Vat',
							formatter: 'money',
							name: 'Vat',
							name$tr$: 'procurement.invoice.entityVAT',
							width: 120
						}, {
							id: 'ReconGross',
							field: 'Gross',
							formatter: 'money',
							name: 'Gross',
							name$tr$: 'procurement.invoice.entityGross',
							width: 120
						}, {
							id: 'ReconNetOc',
							field: 'NetOc',
							formatter: 'money',
							name: 'Net(OC)',
							name$tr$: 'procurement.invoice.entityNetOc',
							width: 120
						}, {
							id: 'ReconVatOc',
							field: 'VatOc',
							formatter: 'money',
							name: 'Vat(OC)',
							name$tr$: 'procurement.invoice.entityVATOc',
							width: 120
						}, {
							id: 'ReconGrossOc',
							field: 'GrossOc',
							formatter: 'money',
							name: 'Gross(OC)',
							name$tr$: 'procurement.invoice.entityGrossOc',
							width: 120
						}
					]
				};
			}
			return service;
		}]);

	angular.module(moduleName).controller('salesBillingReconciliation2GridController',
		['_', '$scope', '$timeout', 'platformToolbarService', 'platformGridControllerService',
			'salesBillingReconciliation2DataService', 'salesBillingReconciliation2GridColumns', '$translate', 'salesBillingService',
			function (_, $scope, $timeout, platformToolbarService, gridControllerService, dataService, uiConfigurationService, $translate, salesBillingService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, uiConfigurationService, dataService, null, gridConfig);

				var containerUUID = $scope.getContainerUUID();
				// remove unnecessary tools
				var toolItems = _.filter(platformToolbarService.getTools(containerUUID), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete';
				});

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});

				platformToolbarService.removeTools(containerUUID);

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};


				salesBillingService.registerSelectionChanged(updateTools);

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						var itemStatus = salesBillingService.getItemStatus();
						if (itemStatus.IsReadOnly) {
							return true;
						} else {
							return dataService.getList().length === 0;
						}
					},
					fn: function updateCalculation() {
						salesBillingService.update();
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
				}];

				gridControllerService.addTools(tools);

			}
		]);
})(angular);
