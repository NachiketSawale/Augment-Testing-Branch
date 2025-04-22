/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';


	var salesContractModule = 'sales.contract';

	/**
	 * @ngdoc factory
	 * @name sales.billing.services: salesBillingSchemaService
	 * @description
	 *
	 */
	angular.module(salesContractModule).factory('salesContractBillingSchemaService', ['_', '$injector', 'commonBillingSchemaDataService', 'salesContractService', 'salesCommonGeneralsServiceFactory',
		function (_, $injector, commonBillingSchemaDataService, salesContractService, salesCommonGeneralsServiceFactory) {

			var service = commonBillingSchemaDataService.getService(salesContractService, 'sales/contract/schema/', {
				onUpdateSuccessNotify: salesContractService.onUpdateSucceeded
			});
			var contract = {};
			var generalService = salesCommonGeneralsServiceFactory.getServiceContainer(salesContractModule);

			var onBillingSchemaChanged = function onBillingSchemaChanged() {
				var mainItem = salesContractService.getSelected();
				if (mainItem && mainItem.Id) {
					// service.deleteAll();
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(contract);
						// salesContractService.update();
						service.gridRefresh();
					});
				}
			};

			service.copyBillingSchemas = function copyBillingSchemas(createItem, onLoadDone, hasHiddenItem) {
				service.copyBasicBillingSchemas(createItem, onLoadDone, hasHiddenItem);
				// service.gridRefresh();
			};

			salesContractService.BillingSchemaFkChanged.register(onBillingSchemaChanged);

			service.getContractData = function getContractData(item){
				contract = item;
			};

			/**
			 * @ngdoc function
			 * @name recalculateBillingSchema
			 * @function
			 * @methodOf sales.contract.services
			 * @description
			 */
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				var mainItem = salesContractService.getSelected();
				if (mainItem && mainItem.Id) {
					var billingSchemas = service.getList();
					mainItem.OldBillingSchemas = billingSchemas;
					generalService.salesCommonGeneralsService.setFilter('mainItemId=' + mainItem.Id);
					generalService.salesCommonGeneralsService.read().then(function () {
						service.onBillingSchemaChangedFromBilling(mainItem).then(function () {
							salesContractService.update();
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
