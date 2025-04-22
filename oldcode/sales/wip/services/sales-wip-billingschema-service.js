/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var salesWipModule = 'sales.wip';

	/**
	 * @ngdoc factory
	 * @name sales.wip.services: salesWipBillingSchemaService
	 * @description
	 *
	 */
	angular.module(salesWipModule).factory('salesWipBillingSchemaService', ['$http', '$injector', 'commonBillingSchemaDataService', 'salesWipService', 'salesCommonGeneralsServiceFactory', 'PlatformMessenger',
		function ($http, $injector, commonBillingSchemaDataService, salesWipService, salesCommonGeneralsServiceFactory, PlatformMessenger) {

			var service = commonBillingSchemaDataService.getService(salesWipService, 'sales/wip/schema/', {
				onUpdateSuccessNotify: salesWipService.onUpdateSucceeded
			});
			var wip = {};
			var generalService = salesCommonGeneralsServiceFactory.getServiceContainer(salesWipModule);

			service.selectBillingSchemaChange = new PlatformMessenger();

			var onBillingSchemaChanged = service.reloadBillingSchemas = function onBillingSchemaChanged() {
				var mainItem = salesWipService.getSelected();
				if (mainItem && mainItem.Id) {
					service.deleteAll();
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(wip);
						salesWipService.update();
						service.gridRefresh();
					});
				}
			};

			service.copyBillingSchemas = function copyBillingSchemas(createItem) {
				service.copyBasicBillingSchemas(createItem);
			};

			salesWipService.BillingSchemaFkChanged.register(onBillingSchemaChanged);

			service.getWipData = function getWipData(item) {
				wip = item;
			};

			/**
			 * @ngdoc function
			 * @name recalculateBillingSchema
			 * @function
			 * @methodOf sales.billing.services
			 * @description
			 */
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				let mainItem = salesWipService.getSelected();
				if (mainItem && mainItem.Id) {
					let billingSchemas = service.getList();
					mainItem.OldBillingSchemas = billingSchemas;
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(mainItem).then(function () {
							salesWipService.update();
						});
					});
				}
			};

			// use to copy general's value to billingSchema's value
			service.registerEntityCreated(onEntityCreated);

			function onEntityCreated(e, item) {
				angular.forEach(generalService.salesCommonGeneralsService.getList(), function (general) {
					switch (item.BillingLineTypeFk) {
						case 8:
						case 10:
						case 13:
						case 14:
							if (item.GeneralsTypeFk === general.GeneralsTypeFk) {
								item.Value = general.Value;
								service.markItemAsModified(item);
								service.setPostHiddenStatus(true);
							}
							break;
					}
				});
			}

			// we don't want to create or delete items (no structural modifications)
			// so we remove functions createItem and deleteItem from service api
			// as an effect no toolbar buttons will be displayed for create and delete
			// see also SVN revision: 407827
			delete service.createItem;
			delete service.deleteItem;

			return service;
		}

	]);
})();
