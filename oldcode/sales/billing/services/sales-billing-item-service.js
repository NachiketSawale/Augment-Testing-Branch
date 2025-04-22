/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingItemService
	 * @function
	 *
	 * @description
	 * salesBillingItemService main service for handling billing item entities
	 */
	salesBillingModule.factory('salesBillingItemService',
		['globals', '_', '$injector','$http', 'salesBillingService', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor','platformContextService','basicsLookupdataLookupDescriptorService','PlatformMessenger',
			function (globals, _, $injector, $http, salesBillingService, platformDataServiceFactory, basicsCommonMandatoryProcessor,platformContextService,basicsLookupdataLookupDescriptorService,PlatformMessenger) {

				var salesBillingItemServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingItemService',
						httpCreate: {route: globals.webApiBaseUrl + 'sales/billing/item/', endCreate: 'create'},
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/item/', endRead: 'list'
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'sales/billing/', endUpdate: 'update'},
						presenter: {list: {
							initCreationData: function initCreationData(creationData) {
								var selectedBill = salesBillingService.getSelected();
								creationData.PKey1 = selectedBill.Id;
							},
							handleCreateSucceeded: function (newItem, data) {
								// getting current item no config from dialog service
								var curConfig = $injector.get('salesBillingItemNumberingConfigurationService').getCurrentConfigSync();
								var itemWithMax = _.maxBy(data.getList(), 'ItemNo');
								newItem.ItemNo = _.isNumber(_.get(itemWithMax, 'ItemNo')) ? itemWithMax.ItemNo + curConfig.increment : curConfig.startValue;

								// take over tax code from bill header if not set yet
								newItem.TaxCodeFk = _.get(salesBillingService.getSelected(), 'TaxCodeFk') || newItem.TaxCodeFk;

								return newItem;
							}
						}},
						dataProcessor: [], // TODO: add image processor
						entityRole: {
							node: {itemName: 'BilItem', parentService: salesBillingService}
						}
					}
				};

				basicsLookupdataLookupDescriptorService.loadData('company');
				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingItemServiceOption);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'ItemDto',
					moduleSubModule: 'Sales.Billing',
					validationService: 'salesBillingItemValidationService',
					mustValidateFields: ['UomFk']
				});

				var service = serviceContainer.service;
				service.calculateItem = function (entity) {
					$injector.get('salesBillingItemValidationService').calculateItem(entity);
				};

				service.onSpecificationChanged = new PlatformMessenger();

				service.reloadPriceCondition = function (item, priceConditionFk) {
					let saleBillingItemPriceConditionService = $injector.get('saleBillingItemPriceConditionService');
					if (_.isFunction(saleBillingItemPriceConditionService.unwatchEntityAction)) {
						saleBillingItemPriceConditionService.unwatchEntityAction();
					}
					saleBillingItemPriceConditionService.reload(item, priceConditionFk).finally(resetWatchDataAction);

				};
				function resetWatchDataAction() {
					if (_.isFunction(service.watchEntityAction)) {
						service.watchEntityAction();
					}
				}

				serviceContainer.service.getIsCalculateOverGross = function getIsCalculateOverGross() {
					var isOverGross = false;
					var loginCompanyFk = platformContextService.clientId;
					if (loginCompanyFk) {
						var companies = basicsLookupdataLookupDescriptorService.getData('Company');
						var company = _.find(companies, {Id: loginCompanyFk});
						if (company) {
							isOverGross = company.IsCalculateOverGross;
						}
					}
					return isOverGross;
				};
				$injector.get('procurementCommonMaterialSpecificationFactory').getItemSpecification(service);

				service.showItemNumberingConfigDialog = function showItemNumberingConfigDialog() {
					$injector.get('salesBillingItemNumberingConfigurationService').showDialog();
				};

				return service;
			}]);
})();