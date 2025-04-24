/**
 * Created by pel on 7/5/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';
	// jshint -W072
	// jshint -W074
	var moduleName = 'procurement.inventory';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInventoryDataService',
		['platformDataServiceFactory', 'procurementInventoryHeaderDataService', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'platformRuntimeDataService', 'inventoryReadonlyProcessor',
			'basicsCommonMandatoryProcessor',
			function (dataServiceFactory, parentService, moduleContext, lookupDescriptorService, basicsLookupdataLookupFilterService,
				runtimeDataService, inventoryReadonlyProcessor, basicsCommonMandatoryProcessor) {

				var serviceContainer;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInventoryDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/inventory/',
							endCreate: 'createiy',
						},
						dataProcessor: [
							inventoryReadonlyProcessor
						],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.main, data, true);
									serviceContainer.service.containerData = data;

									return dataRead;
								},
								initCreationData: function (creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
								}
							}
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							},
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Inventory',
								parentService: parentService
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PrcInventoryDto',
					moduleSubModule: 'Procurement.Inventory',
					validationService: 'inventoryElementValidationService',
					mustValidateFields: ['MdcMaterialFk']
				});

				service.clearContent = function () {
					serviceContainer.data.clearContent(serviceContainer.data);
				};

				service.canCreate = function () {
					var mainItem = parentService.getSelected();
					if (mainItem) {
						var readonlyStatus = mainItem.IsPosted;
						if (readonlyStatus) {
							return false;
						}
					}
					return true;
				};

				service.canDelete = function () {
					var readonlyStatus;
					var mainItem = parentService.getSelected();
					if (mainItem) {
						readonlyStatus = mainItem.IsPosted;
						if (readonlyStatus) {
							return false;
						}
					}

					var selected = service.getSelected();
					readonlyStatus = !!selected;
					return readonlyStatus;

				};

				var filters = [
					{
						key: 'inventory-stock-transaction-transactiontype-filter',
						serverSide: false,
						fn: function (item) {
							return item.IsLive === true && item.Sorting !== 0 && item.IsDelta === false;
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				return service;
			}]);
})(angular);
