/**
 * Created by zpa on 2016/10/11.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerCustomerCompanyDataService', [
		'_', '$q', '$http', 'globals', 'platformModuleStateService', 'platformDataValidationService', 'platformDataServiceModificationTrackingExtension', 'platformDataServiceSelectionExtension', 'platformDataServiceActionExtension', 'platformGridAPI', 'platformDataServiceFactory', 'platformDataServiceDataProcessorExtension', 'platformSchemaService', 'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension', 'basicsLookupdataLookupDescriptorService', '$translate', 'businessPartnerMainSupplierOrCustomerCompanyValidationService', 'basicsCommonMandatoryProcessor',
		'PlatformMessenger', 'businesspartnerMainCustomerDataService', 'basicsLookupdataLookupFilterService',
		function (_, $q, $http, globals, platformModuleStateService, platformDataValidationService, platformDataServiceModificationTrackingExtension, platformDataServiceSelectionExtension, platformDataServiceActionExtension, platformGridAPI, platformDataServiceFactory, platformDataServiceDataProcessorExtension, platformSchemaService, platformRuntimeDataService,
			ServiceDataProcessDatesExtension, basicsLookupdataLookupDescriptorService, $translate, supplierOrCustomerCompanyValidationService, basicsCommonMandatoryProcessor,
			PlatformMessenger, businesspartnerMainCustomerDataService, basicsLookupdataLookupFilterService) {

			var readOnlyFields = ['BasCompanyFk', 'Supplierno', 'CustomerLedgerGroupFk', 'BusinessPostingGroupFk', 'VatGroupFk', 'CustomerLedgerGroupIcFk'];
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'businessPartnerCustomerCompanyDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'businesspartner/main/customercompany/',
					usePostForRead: false,
					endRead: 'list'
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead,
						initCreationData: initCreationData
					}
				},
				entityRole: {},
				entitySelection: {},
				actions: {create: 'flat', delete: true}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			data.cacheToSave = [];
			data.cacheToDelete = [];
			data.cacheData = [];
			service.name = 'businesspartner.customercompany';
			angular.extend(service, {
				markItemAsModified: markItemAsModified
			});

			angular.extend(data, {
				deleteItem: deleteItem,
				doClearModifications: doClearModifications,
				markItemAsModified: markItemAsModified
			});

			var validator = supplierOrCustomerCompanyValidationService(service);
			data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CustomerCompanyDto',
				moduleSubModule: 'BusinessPartner.Main',
				validationService: validator,
				mustValidateFields: ['BasCompanyFk']
			});

			service.clearCache = function () {
				data.cacheToSave = [];
				data.cacheToDelete = [];
				data.cacheData = [];
			};

			service.storeData = function () {

				var customerId = businesspartnerMainCustomerDataService.getSelected().Id;
				businesspartnerMainCustomerDataService.storeData(data.cacheData, customerId);
				service.clearCache();
			};

			service.isEntityDeleted = function isEntityDeleted(service, entity) {
				return !service.getItemById(entity.Id);
			};

			var bpDataService = businesspartnerMainCustomerDataService.parentService();
			service.disableCreate = function disableCreate() {

				var item = bpDataService.getSelected();
				return !bpDataService.isBpStatusHasRight(item, 'AccessRightDescriptorFk', 'statusWithCreateRight');

			};
			service.disableDelete = function disableDelete() {

				var item = bpDataService.getSelected();
				return !bpDataService.isBpStatusHasRight(item, 'AccessRightDescriptorFk', 'statusWithDeleteRight');
			};

			function markItemAsModified(entity) {
				var customerId = businesspartnerMainCustomerDataService.getSelected().Id;

				if (entity && !service.isEntityDeleted(service, entity, data)) {
					var add = false;
					var entry;
					if (!data.cacheData[customerId]) {
						data.cacheData[customerId] = [];
					}
					if (!data.cacheData[customerId].saveItem) {
						data.cacheData[customerId].saveItem = [];
						add = true;
					} else {
						entry = _.find(data.cacheData[customerId].saveItem, {Id: entity.Id});// If it is not in already we got null. Not null is true
						add = !entry;
						if (entry) {
							data.cacheData[customerId].saveItem = _.filter(data.cacheData[customerId].saveItem, function (item) {
								return item.Id !== entity.Id;
							});
							data.cacheData[customerId].saveItem.push(entity);
						}
					}
					if (add) {
						data.cacheData[customerId].saveItem.push(entity);
					}

					businesspartnerMainCustomerDataService.markItemAsModified(businesspartnerMainCustomerDataService.getSelected());
					data.itemModified.fire(null, entity);
				}
			}

			function doClearModifications(entity) {
				var customerId = businesspartnerMainCustomerDataService.getSelected().Id;

				if (entity && entity.Version === 0 && data.cacheData[customerId].saveItem) {
					if (_.find(data.cacheData[customerId].saveItem, {Id: entity.Id})) {
						data.cacheData[customerId].saveItem = _.filter(data.cacheData[customerId].saveItem, function (item) {
							return item.Id !== entity.Id;
						});
					}
				}
			}

			service.loadItemList = function () {
				var id = businesspartnerMainCustomerDataService.getIfSelectedIdElse(-1);
				data.listLoadStarted.fire();
				var readData = businesspartnerMainCustomerDataService.getOriginalDataList(id);
				data.onReadSucceeded(readData, data, id);
			};

			function deleteItem(entity, data) {
				var customerId = businesspartnerMainCustomerDataService.getSelected().Id;

				platformRuntimeDataService.markAsBeingDeleted(entity);

				if (!data.cacheData[customerId]) {
					data.cacheData[customerId] = [];
				}
				var deleteParams = {};
				deleteParams.entity = entity;
				deleteParams.service = service;
				platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);// remove error list about validation issue
				if (!data.cacheData[customerId].deleteItem) {
					data.cacheData[customerId].deleteItem = [];
				}
				data.cacheData[customerId].deleteItem.push(entity);
				data.onDeleteDone(deleteParams, data, null);
				businesspartnerMainCustomerDataService.markItemAsModified(businesspartnerMainCustomerDataService.getSelected());
				return $q.when(true);
			}

			service.incorporateData = function (readData, customerId) {
				data.cacheToSave = angular.copy(businesspartnerMainCustomerDataService.getCache().saveItem);
				data.cacheToDelete = angular.copy(businesspartnerMainCustomerDataService.getCache().deleteItem);
				if (data.cacheToSave && data.cacheToSave.length > 0) {
					data.cacheToSave = _.filter(data.cacheToSave, function (item) {
						return item.BpdCustomerFk === customerId;
					});
					_.forEach(data.cacheToSave, function (item) {
						if (_.find(readData, {Id: item.Id})) {
							readData = _.filter(readData, function (itemData) {
								return itemData.Id !== item.Id;
							});
						}
						readData.push(item);
					});
				}

				if (data.cacheToDelete && data.cacheToDelete.length > 0) {
					data.cacheToDelete = _.filter(data.cacheToDelete, function (item) {
						return item.BpdCustomerFk === customerId;
					});
					_.forEach(data.cacheToDelete, function (item) {
						if (_.find(readData, {Id: item.Id})) {
							readData = _.filter(readData, function (itemData) {
								return itemData.Id !== item.Id;
							});
						}
					});
				}
				var item = bpDataService.getSelected();
				if (item && !businesspartnerMainCustomerDataService.bPCustomerhasRight()) {

					setReadOnly(readData);
				}
				return data.handleReadSucceeded(readData, data);
			};

			function incorporateDataRead(readData, data, id) {
				if (!readData || readData.length === 0) {
					$http.get(globals.webApiBaseUrl + 'businesspartner/main/customercompany/list?mainItemId=' + id)
						.then(function (response) {
							readData = response.data;
							service.incorporateData(readData, id);
						});
				} else {
					service.incorporateData(readData, id);
				}
			}

			function setReadOnly(items) {
				var fields = [];
				_.forEach(readOnlyFields, function (field) {
					fields.push({field: field, readonly: true});
				});
				_.forEach(items, function (item) {
					platformRuntimeDataService.readonly(item, angular.copy(fields));
				});
			}

			var companies = basicsLookupdataLookupDescriptorService.getData('company');

			function getSubledgerContextFk(item) {
				if (!item.BasCompanyFk) {
					return {
						BpdSubledgerContextFk: null
					};
				}
				return {
					BpdSubledgerContextFk: companies[item.BasCompanyFk].SubledgerContextFk
				};
			}

			var filters = [
				{
					key: 'business-partner-main-customercompany-businesspostinggroup-filter',
					serverKey: 'business-partner-main-businesspostinggroup-filter',
					serverSide: true,
					fn: function (item) {
						return getSubledgerContextFk(item);
					}
				},
				{
					key: 'business-partner-main-customercompany-customerledgergroup-filter',
					serverKey: 'business-partner-main-customerledgergroup-filter',
					serverSide: true,
					fn: function (item) {
						return getSubledgerContextFk(item);
					}
				},
				{
					key: 'business-partner-customer-company-bank-filter',
					serverKey: 'business-partner-customer-company-bank-filter',
					serverSide: true,
					fn: function () {
						return {
							BusinessPartnerFk: bpDataService.getSelected().Id
						};
					}
				},
				{
					key: 'business-partner-customer-company-company-filter',
					fn: function (item) {
						var subledgerContextId = businesspartnerMainCustomerDataService.getSelected().SubledgerContextFk;
						return item.SubledgerContextFk === subledgerContextId;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);
			return service;

			function initCreationData(creationData) {
				var selected = businesspartnerMainCustomerDataService.getSelected();
				creationData.PKey1 = selected.Id;
			}
		}

	]);
})(angular);