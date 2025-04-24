/**
 * Created by wwa on 12/10/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	var moduleName = 'procurement.stock';

	angular.module(moduleName).factory('procurementStockStockTotalReconciliation2GridColumns',
		[
			function () {
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
								// formatter: 'money',
								formatter: function (row, cell, value, columnDef, dataContext) {
									if (value !== undefined) {
										if (dataContext.Type === 'Total Quantity') {
											return value.toFixed(3);
										} else {
											return value.toFixed(2);
										}
									}
									return '';
								},
								name: 'Receipt',
								name$tr$: 'procurement.stock.header.receipt',
								width: 120
							}, {
								id: 'TotalProvision',
								field: 'Consumed',
								formatter: function (row, cell, value, columnDef, dataContext) {
									if (value !== undefined) {
										if (dataContext.Type === 'Total Quantity') {
											return value.toFixed(3);
										} else {
											return value.toFixed(2);
										}
									}
									return '';
								},
								name: 'Consumed',
								name$tr$: 'procurement.stock.header.consumed',
								width: 120
							}, {
								id: 'Expenses',
								field: 'Difference',
								formatter: function (row, cell, value, columnDef, dataContext) {
									if (value !== undefined) {
										if (dataContext.Type === 'Total Quantity') {
											return value.toFixed(3);
										} else {
											return value.toFixed(2);
										}
									}
									return '';
								},
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
	angular.module(moduleName).controller('procurementStockStockTotalReconciliation2GridController',
		['$scope', '$timeout', 'platformToolbarService', 'platformGridControllerService',
			'procurementStockStockTotalReconciliation2DataService', 'procurementStockStockTotalReconciliation2GridColumns',
			function ($scope, $timeout, platformToolbarService, gridControllerService, dataService, uiConfigurationService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, uiConfigurationService, dataService, null, gridConfig);

			}
		]);
})(angular);