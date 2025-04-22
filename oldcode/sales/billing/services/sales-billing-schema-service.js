/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var salesBillingModule = 'sales.billing';

	/**
	 * @ngdoc factory
	 * @name sales.billing.services: salesBillingSchemaService
	 * @description
	 *
	 */
	angular.module(salesBillingModule).factory('salesBillingSchemaService', ['_', '$injector', 'commonBillingSchemaDataService', 'salesBillingService', 'salesCommonGeneralsServiceFactory',
		function (_, $injector, commonBillingSchemaDataService, salesBillingService, salesCommonGeneralsServiceFactory) {

			var service = commonBillingSchemaDataService.getService(salesBillingService, 'sales/billing/schema/', {
				onUpdateSuccessNotify: salesBillingService.onUpdateSucceeded
			});
			var billing = {};
			var generalService = salesCommonGeneralsServiceFactory.getServiceContainer(salesBillingModule);
			var onBillingSchemaChanged = function onBillingSchemaChanged() {
				var mainItem = salesBillingService.getSelected();
				if (mainItem && mainItem.Id) {
					// service.deleteAll();
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(billing);
						// salesBillingService.update();
						service.gridRefresh();
					});
				}
			};

			service.copyBillingSchemas = function copyBillingSchemas(createItem, onLoadDone, hasHiddenItem) {
				service.copyBasicBillingSchemas(createItem, onLoadDone, hasHiddenItem);
				// service.gridRefresh();
			};

			service.getBillingData = function getBillingData(item){
				billing = item;
			};

			salesBillingService.BillingSchemaFkChanged.register(onBillingSchemaChanged);

			/**
			 * @ngdoc function
			 * @name recalculateBillingSchema
			 * @function
			 * @methodOf sales.billing.services
			 * @description
			 */
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				var mainItem = salesBillingService.getSelected();
				if (mainItem && mainItem.Id) {
					var billingSchemas = service.getList();
					mainItem.OldBillingSchemas = billingSchemas;
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(mainItem).then(function () {
							salesBillingService.update();
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
								if (general.ControllingUnitFk) {
									item.ControllingUnitFk = general.ControllingUnitFk;
								}
								if (general.TaxCodeFk) {
									item.TaxCodeFk = general.TaxCodeFk;
								}
								service.markItemAsModified(item);
								service.setPostHiddenStatus(true);
							}
							break;
					}
				});
			}

			var getCellEditableBase  = service.getCellEditable;

			service.getCellEditable = function getCellEditable(item, model){
				var billingLineTypeFk = [8, 10, 13, 14];
				var editableResult = getCellEditableBase(item, model);
				if (!item || !item.Id) {
					return editableResult;
				}
				if(model === 'Value'){
					var isInLineType = _.indexOf(billingLineTypeFk, item.BillingLineTypeFk) !== -1;
					if(isInLineType && item.GeneralsTypeFk){
						editableResult = false;
					}
				}
				if (model === 'Result' || model === 'ResultOc') {
					editableResult = item.BillingLineTypeFk === 19;// Dif. Discount Basis
				}
				return editableResult;
			};

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
