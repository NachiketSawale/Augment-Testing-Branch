/**
 * Created by zpa on 2016/10/11.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerSupplierCompanyDataService',
		['_', '$q', '$http', 'globals', 'platformDataValidationService', 'platformDataServiceSelectionExtension', 'platformDataServiceActionExtension', 'platformModuleStateService', 'platformDataServiceModificationTrackingExtension', 'platformGridAPI', 'platformDataServiceFactory', 'platformDataServiceDataProcessorExtension', 'platformSchemaService', 'platformRuntimeDataService',
			'ServiceDataProcessDatesExtension', 'basicsLookupdataLookupDescriptorService', '$translate', 'businessPartnerMainSupplierOrCustomerCompanyValidationService', 'basicsCommonMandatoryProcessor',
			'PlatformMessenger', 'businesspartnerMainSupplierDataService', 'basicsLookupdataLookupFilterService',
			function (_, $q, $http, globals, platformDataValidationService, platformDataServiceSelectionExtension, platformDataServiceActionExtension, platformModuleStateService, platformDataServiceModificationTrackingExtension, platformGridAPI, platformDataServiceFactory, platformDataServiceDataProcessorExtension, platformSchemaService, platformRuntimeDataService,
				ServiceDataProcessDatesExtension, basicsLookupdataLookupDescriptorService, $translate, supplierOrCustomerCompanyValidationService, basicsCommonMandatoryProcessor,
				PlatformMessenger, businesspartnerMainSupplierDataService, basicsLookupdataLookupFilterService) {

				var serviceOption = {
					module: angular.module(moduleName),
					serviceName: 'businessPartnerSupplierCompanyDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/',
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

				var readOnlyFields = ['BasCompanyFk', 'CustomerNo', 'SupplierLedgerGroupFk', 'BusinessPostingGroupFk', 'VatGroupFk', 'BusinessPostGrpWhtFk', 'BasPaymentMethodFk', 'SupplierLedgerGroupIcFk'];
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;
				data.cacheToSave = [];
				data.cacheToDelete = [];
				data.cacheData = [];
				service.name = 'businesspartner.suppliercompany';
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
					typeName: 'SupplierCompanyDto',
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

					var supplierId = businesspartnerMainSupplierDataService.getSelected().Id;
					businesspartnerMainSupplierDataService.storeData(data.cacheData, supplierId);
					service.clearCache();
				};

				service.isEntityDeleted = function isEntityDeleted(service, entity) {
					return !service.getItemById(entity.Id);
				};
				var bpDataService = businesspartnerMainSupplierDataService.parentService();
				service.disableCreate = function disableCreate() {

					var item = bpDataService.getSelected();
					return !bpDataService.isBpStatusHasRight(item, 'AccessRightDescriptorFk', 'statusWithCreateRight');

				};
				service.disableDelete = function disableDelete() {

					var item = bpDataService.getSelected();
					return !bpDataService.isBpStatusHasRight(item, 'AccessRightDescriptorFk', 'statusWithDeleteRight');
				};

				function markItemAsModified(entity) {
					var supplierId = businesspartnerMainSupplierDataService.getSelected().Id;
					if (entity && !service.isEntityDeleted(service, entity, data)) {
						var add = false;
						var entry;
						if (!data.cacheData[supplierId]) {
							data.cacheData[supplierId] = [];
						}
						if (!data.cacheData[supplierId].saveItem) {
							data.cacheData[supplierId].saveItem = [];
							add = true;
						} else {
							entry = _.find(data.cacheData[supplierId].saveItem, {Id: entity.Id});// If it is not in already we got null. Not null is true
							add = !entry;
							if (entry) {
								data.cacheData[supplierId].saveItem = _.filter(data.cacheData[supplierId].saveItem, function (item) {
									return item.Id !== entity.Id;
								});
								data.cacheData[supplierId].saveItem.push(entity);
							}
						}
						if (add) {
							data.cacheData[supplierId].saveItem.push(entity);
						}
						businesspartnerMainSupplierDataService.markItemAsModified(businesspartnerMainSupplierDataService.getSelected());
						data.itemModified.fire(null, entity);
					}
				}

				function doClearModifications(entity) {
					var supplierId = businesspartnerMainSupplierDataService.getSelected().Id;

					if (entity && entity.Version === 0 && data.cacheData[supplierId].saveItem) {
						if (_.find(data.cacheData[supplierId].saveItem, {Id: entity.Id})) {
							data.cacheData[supplierId].saveItem = _.filter(data.cacheData[supplierId].saveItem, function (item) {
								return item.Id !== entity.Id;
							});
						}
					}
				}

				service.loadItemList = function () {
					var id = businesspartnerMainSupplierDataService.getIfSelectedIdElse(-1);
					data.listLoadStarted.fire();
					var readData = businesspartnerMainSupplierDataService.getOriginalDataList(id);
					data.onReadSucceeded(readData, data, id);
				};

				function deleteItem(entity, data) {
					var supplierId = businesspartnerMainSupplierDataService.getSelected().Id;

					platformRuntimeDataService.markAsBeingDeleted(entity);

					if (!data.cacheData[supplierId]) {
						data.cacheData[supplierId] = [];
					}
					var deleteParams = {};
					deleteParams.entity = entity;
					deleteParams.service = service;
					platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);// remove error list about validation issue
					if (!data.cacheData[supplierId].deleteItem) {
						data.cacheData[supplierId].deleteItem = [];
					}
					data.cacheData[supplierId].deleteItem.push(entity);
					data.onDeleteDone(deleteParams, data, null);
					businesspartnerMainSupplierDataService.markItemAsModified(businesspartnerMainSupplierDataService.getSelected());
					return $q.when(true);
				}

				service.incorporateData = function (readData, supplierId) {
					data.cacheToSave = angular.copy(businesspartnerMainSupplierDataService.getCache().saveItem);
					data.cacheToDelete = angular.copy(businesspartnerMainSupplierDataService.getCache().deleteItem);
					if (data.cacheToSave && data.cacheToSave.length > 0) {
						data.cacheToSave = _.filter(data.cacheToSave, function (item) {
							return item.BpdSupplierFk === supplierId;
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
							return item.BpdSupplierFk === supplierId;
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
					if (item && !businesspartnerMainSupplierDataService.bpSupplierHasRight()) {

						setReadOnly(readData);
					}
					return data.handleReadSucceeded(readData, data);

				};

				function incorporateDataRead(readData, data, id) {
					if (!readData || readData.length === 0) {
						$http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + id)
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
						key: 'business-partner-main-suppliercompany-businesspostinggroup-filter',
						serverKey: 'business-partner-main-businesspostinggroup-filter',
						serverSide: true,
						fn: function (item) {
							return getSubledgerContextFk(item);
						}
					},
					{
						key: 'business-partner-main-suppliercompany-supplierledgergroup-filter',
						serverKey: 'business-partner-main-supplierledgergroup-filter',
						serverSide: true,
						fn: function (item) {
							return getSubledgerContextFk(item);
						}
					},
					{
						key: 'business-partner-supplier-company-bank-filter',
						serverKey: 'business-partner-supplier-company-bank-filter',
						serverSide: true,
						fn: function () {
							return {
								BusinessPartnerFk: bpDataService.getSelected().Id
							};
						}
					},
					{
						key: 'business-partner-supplier-company-company-filter',
						fn: function (item) {
							var subledgerContextId = businesspartnerMainSupplierDataService.getSelected().SubledgerContextFk;
							return item.SubledgerContextFk === subledgerContextId;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				return service;

				function initCreationData(creationData) {
					var selectedItem = businesspartnerMainSupplierDataService.getSelected();
					creationData.PKey1 = selectedItem.Id;
				}
			}

		]);
})(angular);