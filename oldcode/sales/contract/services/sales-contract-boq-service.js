/**
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractBoqService
	 * @function
	 *
	 * @description
	 * salesContractBoqService is a data service for managing boqs in context of contracts
	 */
	salesContractModule.factory('salesContractBoqService', ['_', 'salesContractService', 'platformDataServiceFactory', 'salesCommonBoqReadonlyProcessor', 'salesCommonBoqServiceDecorator',
		function (_, salesContractService, platformDataServiceFactory, salesCommonBoqReadonlyProcessor, salesCommonBoqServiceDecorator) {

			var salesContractBoqServiceOption = {
				flatLeafItem: {
					module: salesContractModule,
					serviceName: 'salesContractBoqService',
					httpCRUD: {route: globals.webApiBaseUrl + 'sales/contract/boq/'},
					dataProcessor: [salesCommonBoqReadonlyProcessor],
					presenter: {
						list: {
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'boqrootitem.reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: incorporatedDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'OrdBoqComposite',
							parentService: salesContractService,
							parentFilter: 'contractId'
						}
					},
					filterByViewer: true
				}
			};

			// Complete this options with general options
			salesCommonBoqServiceDecorator.completeServiceOptions(salesContractBoqServiceOption);

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesContractBoqServiceOption);
			var service = serviceContainer.service;

			// Overwrite standard createItem to call dialog for user entries first before doing the creation of the contract boq
			salesCommonBoqServiceDecorator.decorate(serviceContainer);

			function incorporatedDataRead(result, data) {
				// The following service method incorporateDataRead is added by the salesCommonBoqServiceDecorator.
				// If any changes in the behavior are needed have a look there.
				serviceContainer.data.sortByColumn(result);
				return service.incorporateDataRead(result, data);
			}

			// update wip value in contract header
			function updateAmounts() {
				var boqsData = service.getList();
				var sumFinalprice = _.sumBy(boqsData, 'BoqRootItem.Finalprice');
				var sumFinalgross = _.sumBy(boqsData, 'BoqRootItem.Finalgross');
				var sumFinalpriceOc = _.sumBy(boqsData, 'BoqRootItem.FinalpriceOc');
				var sumFinalgrossOc = _.sumBy(boqsData, 'BoqRootItem.FinalgrossOc');

				salesContractService.updateAmounts(sumFinalprice, sumFinalpriceOc, sumFinalgross, sumFinalgrossOc);
			}

			service.registerItemModified(updateAmounts);

			service.registerEntityDeleted(updateAmounts);

			return service;
		}
	]);
})();
