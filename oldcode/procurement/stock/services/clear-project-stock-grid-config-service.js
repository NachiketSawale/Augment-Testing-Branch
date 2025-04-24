/**
 * Created by lcn on 10/18/2017.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';

	angular.module(moduleName).factory('clearProjectStockGridConfigService', [
		// eslint-disable-next-line func-names
		function () {
			var service = {};
			// eslint-disable-next-line func-names
			service.getColumns = function () {
				return [
					{
						id: 'projectNo',
						field: 'ProjectId',
						name: 'projectNo',
						width: 80,
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					},
					{
						id: 'projectName',
						field: 'ProjectId',
						name: 'projectName',
						width: 100,
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectName'
						}
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 80,
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'quantity',
						field: 'Quantity',
						name: 'Quantity',
						formatter: 'quantity',
						width: 100,
						name$tr$: 'procurement.stock.stocktotal.Quantity'
					},
					{
						id: 'total',
						field: 'Total',
						name: 'Total',
						formatter: 'money',
						width: 100,
						name$tr$: 'procurement.stock.stocktotal.Total'
					},
					{
						id: 'provisionTotal',
						field: 'ProvisionTotal',
						name: 'ProvisionTotal',
						formatter: 'money',
						width: 100,
						name$tr$: 'procurement.stock.stocktotal.ProvisionTotal'
					},
					{
						id: 'address',
						field: 'Address',
						name: 'Address',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.address'
					}
				];
			};

			// eslint-disable-next-line func-names
			service.provideGridConfig = function (gridId) {
				return {
					columns: angular.copy(service.getColumns()),
					data: [],
					id: gridId,
					lazyInit: true,
					enableConfigSave: true,
					options: {
						indicator: true,
						idProperty: 'Id'
					}
				};
			};

			return service;
		}
	]);

})(angular);