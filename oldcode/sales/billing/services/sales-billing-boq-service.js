/**
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingBoqService
	 * @function
	 *
	 * @description
	 * salesBillingBoqService is a data service for managing boqs in context of billing
	 */
	salesBillingModule.factory('salesBillingBoqService', ['_', 'salesBillingService', 'platformDataServiceFactory', 'salesCommonBoqReadonlyProcessor', 'salesCommonBoqServiceDecorator',
		function (_, salesBillingService, platformDataServiceFactory, salesCommonBoqReadonlyProcessor, salesCommonBoqServiceDecorator) {

			var salesBillingBoqServiceOption = {
				flatLeafItem: {
					module: salesBillingModule,
					serviceName: 'salesBillingBoqService',
					httpCRUD: {route: globals.webApiBaseUrl + 'sales/billing/boq/'},
					dataProcessor: [salesCommonBoqReadonlyProcessor],
					presenter: {
						list: {
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'boqrootitem.reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: incorporatedDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'BilBoqComposite',
							parentService: salesBillingService,
							parentFilter: 'bilId'
						}
					},
					filterByViewer: true
				}
			};

			// Complete this options with general options
			salesCommonBoqServiceDecorator.completeServiceOptions(salesBillingBoqServiceOption);

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingBoqServiceOption);
			var service = serviceContainer.service;

			// Overwrite standard createItem to call dialog for user entries first before doing the creation of the billing boq
			salesCommonBoqServiceDecorator.decorate(serviceContainer);

			function incorporatedDataRead(result, data) {
				// The following service method incorporateDataRead is added by the salesCommonBoqServiceDecorator.
				// If any changes in the behavior are needed have a look there.
				serviceContainer.data.sortByColumn(result);
				return service.incorporateDataRead(result, data);
			}

			// TODO: replaced for the moment by updateAmounts (see #104649)
			// service.registerItemModified(function (e, entity) {
			//  var finalPrice = _.get(entity, 'BoqRootItem.Finalprice');
			//  var selectedBill = salesBillingService.getSelected();
			//  var changed = Math.abs(selectedBill.AmountNet - finalPrice) > 0;
			//  if (selectedBill && finalPrice && changed) {
			//      selectedBill.AmountNet = finalPrice;
			//      salesBillingService.recalculateAmounts(selectedBill);
			//  }
			// });

			// update amounts in bill header
			function updateAmounts() {
				var boqsData = service.getList();
				var sumFinalprice = _.sumBy(boqsData, 'BoqRootItem.Finalprice');
				var sumFinalgross = _.sumBy(boqsData, 'BoqRootItem.Finalgross');
				var sumFinalpriceOc = _.sumBy(boqsData, 'BoqRootItem.FinalpriceOc');
				var sumFinalgrossOc = _.sumBy(boqsData, 'BoqRootItem.FinalgrossOc');

				salesBillingService.updateAmounts(sumFinalprice, sumFinalpriceOc, sumFinalgross, sumFinalgrossOc);
			}

			service.registerItemModified(updateAmounts);

			service.registerEntityDeleted(updateAmounts);


			return service;
		}
	]);
})();
