/**
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidBoqService
	 * @function
	 *
	 * @description
	 * salesBidBoqService is a data service for managing boqs in context of bids
	 */
	salesBidModule.factory('salesBidBoqService', ['globals', '_', 'salesBidService', 'platformDataServiceFactory', 'salesCommonBoqReadonlyProcessor', 'salesCommonBoqServiceDecorator',
		function (globals, _, salesBidService, platformDataServiceFactory, salesCommonBoqReadonlyProcessor, salesCommonBoqServiceDecorator) {

			var salesBidBoqServiceOption = {
				flatLeafItem: {
					module: salesBidModule,
					serviceName: 'salesBidBoqService',
					httpCRUD: {route: globals.webApiBaseUrl + 'sales/bid/boq/'},
					dataProcessor: [salesCommonBoqReadonlyProcessor],
					presenter: {
						list: {
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'boqrootitem.reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: incorporatedDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'BidBoqComposite',
							parentService: salesBidService,
							parentFilter: 'bidId'
						}
					},
					filterByViewer: true
				}
			};

			// Complete this options with general options
			salesCommonBoqServiceDecorator.completeServiceOptions(salesBidBoqServiceOption);

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesBidBoqServiceOption);
			var service = serviceContainer.service;

			// Overwrite standard createItem to call dialog for user entries first before doing the creation of the bid boq
			salesCommonBoqServiceDecorator.decorate(serviceContainer);

			function incorporatedDataRead(result, data) {
				// The following service method incorporateDataRead is added by the salesCommonBoqServiceDecorator.
				// If any changes in the behavior are needed have a look there.
				serviceContainer.data.sortByColumn(result);
				return service.incorporateDataRead(result, data);
			}

			// update wip value in bid header
			function updateAmounts() {
				var boqsData = service.getList();
				var sumFinalprice = _.sumBy(boqsData, 'BoqRootItem.Finalprice');
				var sumFinalgross = _.sumBy(boqsData, 'BoqRootItem.Finalgross');
				var sumFinalpriceOc = _.sumBy(boqsData, 'BoqRootItem.FinalpriceOc');
				var sumFinalgrossOc = _.sumBy(boqsData, 'BoqRootItem.FinalgrossOc');

				salesBidService.updateAmounts(sumFinalprice, sumFinalpriceOc, sumFinalgross, sumFinalgrossOc);
			}

			service.registerItemModified(updateAmounts);

			service.registerEntityDeleted(updateAmounts);

			return service;
		}
	]);
})();
