/**
 * Created by wwa on 12/10/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	var moduleName = 'procurement.stock';

	angular.module(moduleName).factory('procurementStockReconciliation2GridColumns',
		[function () {
			function getStandardConfigForListView() {
				return {
					columns: [
						{
							id: 'ReconName',
							field: 'Type',
							formatter: function (row, cell, value) {
								var formatterMarkup = value;
								var navigatorMarkup = '';
								// var colDef = _.cloneDeep(columnDef);
								// value = value.trim('').replace(' ','').toLowerCase();
								return formatterMarkup + navigatorMarkup;
							},
							name: 'Type',
							name$tr$: 'procurement.stock.header.type',
							width: 120
						},
						{
							id: 'TotalValue',
							field: 'Receipt',
							formatter: 'money',
							name: 'Receipt',
							name$tr$: 'procurement.stock.header.receipt',
							width: 120
						}, {
							id: 'TotalProvision',
							field: 'Consumed',
							formatter: 'money',
							name: 'Consumed',
							name$tr$: 'procurement.stock.header.consumed',
							width: 120
						}, {
							id: 'Expenses',
							field: 'Difference',
							formatter: 'money',
							name: 'Difference',
							name$tr$: 'procurement.stock.header.difference',
							width: 120
						}
					]
				};
			}

			return {
				getStandardConfigForListView: getStandardConfigForListView
			};
		}]);

	angular.module(moduleName).controller('procurementStockReconciliation2GridController',
		['$scope', '$timeout', 'platformToolbarService', 'platformGridControllerService',
			'procurementStockReconciliation2DataService', 'procurementStockReconciliation2GridColumns',
			function ($scope, $timeout, platformToolbarService, gridControllerService, dataService, uiConfigurationService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, uiConfigurationService, dataService, null, gridConfig);

				// var containerUUID = $scope.getContainerUUID();
				// //remove unnecessary tools
				// var toolItems = _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				//     return item && item.id !== 'create' && item.id !== 'delete';
				// });
				//
				// $scope.setTools({
				//     showImages: true,
				//     showTitles: true,
				//     cssClass: 'tools',
				//     items: toolItems
				// });
				//
				// platformToolbarService.removeTools(containerUUID);
				//
				// var updateTools = function () {
				//     if ($scope.tools) {
				//         $scope.tools.update();
				//     }
				// };
				//
				//
				// invoiceHeaderDataService.registerSelectionChanged(updateTools);
				//
				// var tools = [{
				//     id: 't1000',
				//     sort: 1000,
				//     caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
				//     type: 'item',
				//     iconClass: 'control-icons ico-recalculate',
				//     disabled: function () {
				//         var itemStatus = invoiceHeaderDataService.getItemStatus();
				//         if (itemStatus.IsReadOnly) {
				//             return true;
				//         } else {
				//             return dataService.getList().length === 0;
				//         }
				//     },
				//     fn: function updateCalculation() {
				//         invoiceHeaderDataService.update();
				//     }
				// }, {
				//     id: 'd999',
				//     sort: 999,
				//     type: 'divider'
				// }];
				//
				// gridControllerService.addTools(tools);

			}
		]);
})(angular);