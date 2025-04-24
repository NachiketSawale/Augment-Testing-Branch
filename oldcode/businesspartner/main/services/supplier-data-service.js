/**
 * Created by zos on 12/19/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainSupplierDataServiceNew
	 * @function
	 * @requireds platformDataServiceBase, $http, basicsLookupdataLookupFilterService, $q
	 *
	 * @description Provide header data service
	 */
	angular.module(moduleName).factory('businesspartnerMainSupplierDataService',
		['platformDataValidationService', 'businesspartnerMainBankDataService', '_', '$injector', '$http', '$translate',
			'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService',
			'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDataService', 'businesspartnerMainSupplierValidationService',
			'platformRuntimeDataService', 'businessPartnerHelper', 'PlatformMessenger', 'globals', 'basicsLookupdataLookupFilterService',
			'businesspartnerStatusRightService', 'supplierNumberGenerationSettingsService', 'platformModalService', 'businesspartnerMainSubsidiaryDataService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (platformDataValidationService, bankDataService, _, $injector, $http, $translate,
				platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService,
				businesspartnerMainHeaderDataService, basicsLookupdataLookupDataService, businesspartnerMainSupplierValidationService,
				platformRuntimeDataService, businessPartnerHelper, PlatformMessenger, globals, basicsLookupdataLookupFilterService,
				businesspartnerStatusRightService, supplierNumberGenerationSettingsService, platformModalService,subsidiaryDataService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainSupplierDataService',
						dataProcessor: [{
							processItem: processItem,
							revertProcessItem: revertProcessCustomer
						}],
						entityRole: {
							leaf: {
								itemName: 'Supplier',
								parentService: businesspartnerMainHeaderDataService
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'businesspartner/main/supplier/',
							endCreate: 'createsupplier'
						},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/supplier/', endRead: 'list'},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: initCreationData,
								handleCreateSucceeded: function (item) {
									item.Code = supplierNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk) ? $translate.instant('cloud.common.isGenerated') : '';
								}
							}
						},
						actions: {create: 'flat', delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				function revertProcessCustomer(item) {
					if (item.Version === 0 && supplierNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						item.Code = 'isgenerated';
					}
				}

				var readonlyFields = ['SupplierStatusFk', 'SupplierLedgerGroupFk', /* CreditorCode */'Code', 'Description', 'CustomerNo', 'PaymentTermPaFk', 'PaymentTermFiFk', 'BillingSchemaFk',
					'SubledgerContextFk', 'VatGroupFk', 'SubsidiaryFk', 'Description2', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5',
					'BusinessPostingGroupFk', 'BankFk', 'BasPaymentMethodFk', 'BusinessPostGrpWhtFk', 'BlockingReasonFk',
					'SupplierLedgerGroupIcFk'];
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var service = serviceContainer.service;
				service.cacheToRead = [];
				service.originItemList = [];
				var tempModifiedItems = [];
				var validator = businesspartnerMainSupplierValidationService(serviceContainer.service);

				serviceContainer.data.cleanUpLocalData = function cleanUpBPSupplierData() {
					tempModifiedItems = [];
				};

				var loginCompanyId = 0;
				var loginCompanies = null;

				service.currentSubledgerContextFk = null;
				service.getSubledgerContextByCompanyId = function getSubledgerContextByCompanyId(companyId) {
					$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
						.then(function (response) {
							service.currentSubledgerContextFk = response.data.SubledgerContextFk;
						});
				};

				service.updateCompanyData = updateCompanyData;

				function updateCompanyData() {
					loginCompanyId = platformContextService.getContext().clientId;
					loginCompanies = basicsLookupdataLookupDescriptorService.getData('Company') || {};
					if (!loginCompanies[loginCompanyId]) {
						basicsLookupdataLookupDataService.getItemByKey('company', loginCompanyId).then(function (data) {
							if (data) {
								basicsLookupdataLookupDescriptorService.updateData('company', [data]);
								loginCompanies[loginCompanyId] = data;
							}
						});
					}
				}

				initialize();

				angular.extend(service, {
					provideUpdateData: provideUpdateData
				});

				service.storeData = function (cacheData, supplierId) {

					if (!service.cacheToRead.deleteItem) {
						service.cacheToRead.deleteItem = [];
					}
					if (!service.cacheToRead.saveItem) {
						service.cacheToRead.saveItem = [];
					}
					if (cacheData[supplierId] && cacheData[supplierId].saveItem) {
						_.forEach(cacheData[supplierId].saveItem, function (item) {
							if (_.find(service.cacheToRead.saveItem, {Id: item.Id})) {
								service.cacheToRead.saveItem = _.filter(service.cacheToRead.saveItem, function (saveItem) {
									return saveItem.Id !== item.Id;
								});
							}
							service.cacheToRead.saveItem.push(item);
						});
					}
					if (cacheData[supplierId] && cacheData[supplierId].deleteItem) {
						_.forEach(cacheData[supplierId].deleteItem, function (item) {
							if (_.find(service.cacheToRead.saveItem, {Id: item.Id})) {
								service.cacheToRead.saveItem = _.filter(service.cacheToRead.saveItem, function (saveItem) {
									return saveItem.Id !== item.Id;
								});
							} else if (!_.find(service.cacheToRead.deleteItem, {Id: item.Id})) {
								service.cacheToRead.deleteItem.push(item);
							}

						});
					}
				};

				service.getCache = function () {
					if (!service.cacheToRead.saveItem) {
						service.cacheToRead.saveItem = [];
					}
					if (!service.cacheToRead.deleteItem) {
						service.cacheToRead.deleteItem = [];
					}

					return service.cacheToRead;
				};

				service.loadSupplierCompanyItem = function (mainItemId) {
					if (mainItemId !== -1) {
						if (!service.originItemList[mainItemId]) {
							service.originItemList[mainItemId] = [];
						}
						if (service.originItemList[mainItemId].length === 0) {
							$http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + mainItemId)
								.then(function (response) {
									service.originItemList[mainItemId] = angular.copy(response.data);
								});
						}
					}

				};

				service.getOriginalDataList = function (Id) {
					return service.originItemList[Id];
				};

				function provideUpdateData(updateData) {

					if (service.cacheToRead.saveItem || service.cacheToRead.deleteItem) {
						if (service.cacheToRead && service.cacheToRead.saveItem &&
							service.cacheToRead.saveItem.length > 0) {
							if (!angular.isArray(updateData['SupplierCompanyToSave'])) {// jshint ignore:line
								updateData['SupplierCompanyToSave'] = [];// jshint ignore:line
							}
							_.forEach(service.cacheToRead.saveItem, function (item) {
								updateData['SupplierCompanyToSave'].push(item);// jshint ignore:line
								updateData.EntitiesCount += 1;
							});
						}
						if (service.cacheToRead && service.cacheToRead.deleteItem &&
							service.cacheToRead.deleteItem.length > 0) {
							if (!angular.isArray(updateData['SupplierCompanyToDelete'])) {// jshint ignore:line
								updateData['SupplierCompanyToDelete'] = [];// jshint ignore:line
							}
							_.forEach(service.cacheToRead.deleteItem, function (item) {
								updateData['SupplierCompanyToDelete'].push(item);// jshint ignore:line
								updateData.EntitiesCount += 1;
							});
						}
						service.originItemList = [];
						service.cacheToRead = [];

					}
				}

				var filters = [
					{
						key: 'business-partner-main-supplier-businesspostinggroup-filter',
						serverKey: 'business-partner-main-businesspostinggroup-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BpdSubledgerContextFk: item.SubledgerContextFk
							};
						}
					},
					{
						key: 'business-partner-main-supplier-supplierledgergroup-filter',
						serverKey: 'business-partner-main-supplierledgergroup-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BpdSubledgerContextFk: item.SubledgerContextFk
							};
						}
					},
					{
						key: 'business-partner-main-bank-filter',
						serverKey: 'business-partner-main-bank-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BusinessPartnerFk: item.BusinessPartnerFk
							};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				service.bpItem = null;

				var bpStatusFk = 'AccessRightDescriptorFk';
				var spStatusFk = 'AccessRightDescriptor2Fk';
				service.bpSupplierHasRight = bpSupplierHasRight;
				service.getSupplierBySupplierLedgerGrps = getSupplierBySupplierLedgerGrps;
				service.isItemEditable4WizardChangeCode = isItemEditable4WizardChangeCode;
				let filterList = [];
				let supplierList = [];
				let filterBranchLoad = false;
				var canCreate = service.canCreate;
				service.canCreate = function () {
					return canCreate() && !service.isReadOnly();
				};

				var canDelete = service.canDelete;
				service.canDelete = function () {
					return canDelete() && !service.isReadOnly();
				};

				service.isReadOnly = function () {
					return businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					service.bpItem = businesspartnerMainHeaderDataService.getSelected();
					var bReadOnly = service.isReadOnly();
					supplierList=readData.Main;
					if (filterBranchLoad) {
						readData.Main = filterList;
					} else {
						filterByBranch();
						if (filterBranchLoad) {
							readData.Main = filterList;
						}
					}
					filterBranchLoad = false;
					filterList = [];

					if (bReadOnly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
					}

					basicsLookupdataLookupDescriptorService.attachData(readData);

					return data.handleReadSucceeded(readData.Main, data);
				}

				function setReadonly(items) {
					var fields = getReadonlyFields(readonlyFields);
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, angular.copy(fields));
					});
				}

				function getReadonlyFields(fields) {
					var readonlyFields = [];
					_.forEach(fields, function (field) {
						readonlyFields.push({field: field, readonly: true});
					});
					return readonlyFields;
				}

				function initCreationData(creationData) {
					creationData.mainItemId = service.bpItem.Id;
					creationData.description = service.bpItem.BusinessPartnerName1;
				}

				function bpSupplierHasRight() {
					var isBpStatusHasRight = businesspartnerMainHeaderDataService.isBpStatusHasRight(service.bpItem, bpStatusFk, 'statusWithEidtRight');
					var isBpStatusToCustomerHasRight = businesspartnerMainHeaderDataService.isBpStatusHasRight(service.bpItem, spStatusFk, 'statusWithEidtRightToSupplier');

					return isBpStatusHasRight ? isBpStatusHasRight : isBpStatusToCustomerHasRight;
				}

				function processItem(item) {

					if (item) {
						// at present, don't validate 'Code' while loading supplier records.
						// var result = validator.asyncValidateCode(item, item.Code, 'Code');
						// result.then(function (data) {
						// platformRuntimeDataService.applyValidationResult(data, item, 'Code');
						// });
						var model = 'BusinessPostingGroupFk';
						var result = validator.validateBusinessPostingGroupFk(item, item.BusinessPostingGroupFk, model);
						platformRuntimeDataService.applyValidationResult(result, item, model);

						if (isItemReadonly(item)) {

							setReadonly([item]);
						} else {
							var fields = _.map(service.canReadonlyModels, function (model) {
								var editable = getCellEditable(item);
								if (model === 'UpdatedAt' || model === 'InsertedAt' || model.indexOf('__rt$data.history') >= 0 || model === 'SubledgerContextFk'||model === 'Code') {
									editable = false;
								}
								return {
									field: model,
									readonly: !editable
								};
							});
							platformRuntimeDataService.readonly(item, fields);
						}
					}
				}

				function fillReadonlyModels(configuration) {
					var service = serviceContainer.service;
					service.unregisterSelectionChanged(onSetReadonly);
					businessPartnerHelper.fillReadonlyModels(configuration, service);
					service.registerSelectionChanged(onSetReadonly);
				}

				function onSetReadonly() {
					var service = serviceContainer.service;
					var currentItem = service.getSelected();
					if (!currentItem || !currentItem.Id) {
						return;
					}

					var fields = _.map(service.canReadonlyModels, function (model) {
						var editable = getCellEditable(currentItem);
						if (model === 'UpdatedAt' || model === 'InsertedAt' || model.indexOf('__rt$data.history') >= 0 || model === 'SubledgerContextFk') {
							editable = false;
						}else if (model === 'Code') {
							if (currentItem.Version===0){
								editable = editable && !supplierNumberGenerationSettingsService.hasToGenerateForRubricCategory(currentItem.RubricCategoryFk);
							}else {
								editable =false;
							}
						}
						return {
							field: model,
							readonly: !editable
						};
					});
					if (service.bpItem) {
						if (isItemReadonly(currentItem)) {
							fields = getReadonlyFields(readonlyFields);
						}
					}
					platformRuntimeDataService.readonly(currentItem, fields);
				}

				function isItemReadonly(item) {
					var status = basicsLookupdataLookupDescriptorService.getLookupItem('SupplierStatus', item.SupplierStatusFk);
					return item.Version !== 0 && (!bpSupplierHasRight() || (status && status.IsDeactivated));
				}

				function onItemDeleted(entity) {
					if (!entity) {
						return;
					}
					for (var i = 0; i < tempModifiedItems.length; ++i) {
						if (tempModifiedItems[i].Id === entity.Id) {
							tempModifiedItems.splice(i, 1);
							break;
						}
					}
				}

				function propertyChanged() {
					var entity = serviceContainer.service.getSelected();
					if (entity) {
						addTempModifiedItem(entity);
					}
				}

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, newEntity) {
					var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
						collect: function (prop) {
							var result = true;
							// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
							// if it is not the right lookup type name, please use convert to return right name.
							switch (prop) {
								case 'BusinessPartnerFk':
								case 'PaymentTermFiFk':
								case 'PaymentTermPaFk':
								case 'SubledgerContextFk':
								case 'VatGroupFk':
								case 'BasPaymentMethodFk':
								case 'BusinessPostGrpWhtFk':
									result = false;
									break;
								default:
									break;
							}
							return result;
						}
					});
					// var validateResult = validator.asyncValidateCode(newEntity, newEntity.Code, 'Code');
					// validateResult.then(function (data) {
					// platformRuntimeDataService.applyValidationResult(data, newEntity, 'Code');
					// });
					validator.validateFieldsOnCreate(newEntity);
					if (!result.dataReady) {
						result.dataPromise.then(function () {
							serviceContainer.service.gridRefresh();
						});
					}
				}

				function addTempModifiedItem(item) {
					var modify = _.find(tempModifiedItems, {Id: item.Id});
					if (!modify) {
						tempModifiedItems.push(item);
					}
				}

				function canDeleteCallBackFunc(selectItem) {
					return getCellEditable(selectItem);
				}

				function getCellEditable(currentItem) {
					if (!currentItem) {
						return false;
					}

					// BPD_CUSTOMER_LEDGER_GROUP_FK.BPD_SUBLEDGER_CONTEXT_FK is different to the BPD_SUBLEDGER_CONTEXT_FK of the login company have to be read only
					var isEditable = false;
					if (loginCompanies && loginCompanies[loginCompanyId]) {
						isEditable = currentItem.SubledgerContextFk === loginCompanies[loginCompanyId].SubledgerContextFk;
					}
					var modifiedItem = _.find(tempModifiedItems, {Id: currentItem.Id});
					var isNewItem = false;
					if (angular.isDefined(currentItem.Version)) {
						isNewItem = currentItem.Version === 0;
					}

					// if the current item is a new item or the current item is a modified item, the cell is editable.
					return isEditable || isNewItem || (!!modifiedItem);
				}

				function registerMessenger() {
					var data = serviceContainer.data;
					data.deleteRequested.register(onItemDeleted);

					bankDataService.entityDeleted.register(onBankDeleted);

					function onBankDeleted(bankEntities) {

						var suppliers = service.getList();
						if (!!bankEntities && !!suppliers) {

							suppliers.forEach(function (se) {

								if (se.BankFk === null) {
									return;
								}
								var found = _.find(bankEntities, {Id: se.BankFk});
								if (found) {
									se.BankFk = null;
									service.markItemAsModified(se);
								}
							});
						}
					}
				}

				function getSupplierBySupplierLedgerGrps(groupIds) {
					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/supplier/getsupplierbysupplierledgergroup', groupIds);
				}

				function initialize() {
					var service = serviceContainer.service,
						data = serviceContainer.data;

					data.deleteRequested = new PlatformMessenger();
					service.fillReadonlyModels = fillReadonlyModels;
					service.propertyChanged = propertyChanged;
					service.filterByBranch = filterByBranch;
					/**
					 * provide lookup data item to lookup formatter after creating new item.
					 */
					service.registerEntityCreated(onEntityCreated);
					registerMessenger();
				}

				function isItemEditable4WizardChangeCode(item) {
					if (!item) {
						return false;
					}

					if (isItemReadonly(item)) {
						platformModalService.showMsgBox('businesspartner.main.changeCode.statusIsReadonly', 'businesspartner.main.changeCode.supplierTitle', 'ico-warning');
						return false;
					}

					if (loginCompanies && loginCompanies[loginCompanyId]) {
						if (item.SubledgerContextFk !== loginCompanies[loginCompanyId].SubledgerContextFk) {
							platformModalService.showMsgBox('businesspartner.main.changeCode.supplierDiffSubLedgerContext', 'businesspartner.main.changeCode.supplierTitle', 'ico-warning');
							return false;
						}
					}

					return true;
				}

				function filterByBranch(selectEntity) {
					const selected = selectEntity ? selectEntity : subsidiaryDataService.getSelected();
					if (businesspartnerMainHeaderDataService.isBaseLine && supplierList.length > 0 && selected) {
						filterList = supplierList.filter(x => x.SubsidiaryFk === selected.Id || x.SubsidiaryFk === null);
						filterBranchLoad = true;
						if (selectEntity) {
							serviceContainer.service.load();
						}

					}
				}
			}]
	);
})(angular);