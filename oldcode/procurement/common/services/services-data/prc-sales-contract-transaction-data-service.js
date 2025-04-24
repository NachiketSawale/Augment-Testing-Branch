/**
 * Created by Ivy on 07.20.2020.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcAndSalesContractTransactionDataService',
		[
			'$translate',
			'procurementCommonDataServiceFactory',
			'procurementContractHeaderDataService',
			'platformDataServiceProcessDatesBySchemeExtension',
			'platformRuntimeDataService',
			'ServiceDataProcessDatesExtension',
			'procurementContextService',
			function (
				$translate,
				dataServiceFactory,
				parentService,
				platformDataServiceProcessDatesBySchemeExtension,
				platformRuntimeDataService,
				ServiceDataProcessDatesExtension,
				procurementContextService
			) {
				function constructorFn(parentService) {
					var serviceContainer;
					var dateProcessor;
					var area = 'procurement';
					moduleName = parentService.getModule().name;
					if (moduleName.match('sales')) {
						area = 'sales';
					}
					if (area === 'procurement') {
						dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
							{
								typeName: 'ConTransactionDto',
								moduleSubModule: 'Procurement.Contract'
							}
						);
					}
					else {
						dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
							{
								typeName: 'OrdTransactionDto',
								moduleSubModule: 'Sales.Contract'
							}
						);
					}

					var serviceOption = {
						flatLeafItem: {
							module: angular.module(moduleName),
							serviceName: 'procurementContractTransactionDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/contract/transaction/',
								initReadData: function initReadData(readData) {
									readData.filter = '?mainItemId=' + parentService.getSelected().Id;
								}
							},
							presenter: {
								list: null
							},
							dataProcessor: [dateProcessor, {processItem: readonlyProcessor}, new ServiceDataProcessDatesExtension(['DateDocument', 'DateDeliveredFrom', 'DateDelivered'])],
							actions: {delete: false, create: false, bulk: false},
							entityRole: {
								node: {
									itemName: 'ConTransaction',
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							}
						}
					};
					if (area === 'sales') {
						serviceOption.flatLeafItem.httpCRUD.route = globals.webApiBaseUrl + 'sales/contract/transaction/';
						serviceOption.flatLeafItem.entityRole.node.itemName = 'OrdTransaction';
					}

					serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					var service = serviceContainer.service;

					service.PisReadonly = function () {
						return parentService.getItemStatus().IsReadOnly;
					};

					function readonlyProcessor(item) {
						platformRuntimeDataService.readonly(item, [
							{field: 'IsSuccess', readonly: true},
							{field: 'Ischange', readonly: true},
							{field: 'Isconsolidated', readonly: true}
						]);
					}
					return service;
				}
				return dataServiceFactory.createService(constructorFn, 'prcAndSalesContractTransactionDataService');
			}]);
})(angular);