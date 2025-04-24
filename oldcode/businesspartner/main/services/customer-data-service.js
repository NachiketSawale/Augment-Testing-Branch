/**
 * Created by zos on 12/19/2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainCustomerDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide customer data service
	 */
	angular.module(moduleName).factory('businesspartnerMainCustomerDataService',
		['_', '$injector', '$http', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService', '$translate',
			'platformContextService', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDataService',
			'businesspartnerMainCustomerValidationService', 'platformRuntimeDataService', 'businessPartnerHelper', 'globals', 'businesspartnerStatusRightService',
			'customerNumberGenerationSettingsService', 'platformModalService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, $injector, $http, PlatformMessenger, platformGridAPI, platformDataServiceFactory, basicsLookupdataLookupFilterService, $translate,
				platformContextService, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService, basicsLookupdataLookupDataService,
				businesspartnerMainCustomerValidationService, platformRuntimeDataService, businessPartnerHelper, globals, businesspartnerStatusRightService,
				customerNumberGenerationSettingsService, platformModalService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainCustomerDataService',
						dataProcessor: [{
							processItem: processItem,
							revertProcessItem: revertProcessCustomer
						}],
						entityRole: {
							leaf: {
								itemName: 'Customer',
								parentService: businesspartnerMainHeaderDataService
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'businesspartner/main/customer/',
							endCreate: 'create'
						},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/customer/', endRead: 'list'},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								handleCreateSucceeded: function (item) {
									item.Code = customerNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk) ? $translate.instant('cloud.common.isGenerated') : '';
								},
								initCreationData: initCreationData
							}
						},
						actions: {create: 'flat', delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				function revertProcessCustomer(item) {
					if (item.Version === 0 && customerNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						item.Code = 'isgenerated';
					}
				}

				var readonlyFields = ['CustomerStatusFk',/* 'Debtor Code' */'Code', 'CustomerLedgerGroupFk', 'SupplierNo', 'SubsidiaryFk', 'CustomerBranchFk',
					'BusinessUnitFk', 'PaymentTermFiFk', 'PaymentTermPaFk', 'BillingSchemaFk', 'SubledgerContextFk', 'VatGroupFk',
					'SubsidiaryFk', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'BusinessPostingGroupFk',
					'BasPaymentMethodFk', 'BpdDunninggroupFk', 'BlockingReasonFk', 'Description', 'Description2', 'Einvoice',
					'CustomerLedgerGroupIcFk'];

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var service = serviceContainer.service;
				service.cacheToRead = [];
				service.originItemList = [];
				var validator = businesspartnerMainCustomerValidationService(serviceContainer.service);

				var loginCompanyId = platformContextService.getContext().clientId;
				var loginCompanies = basicsLookupdataLookupDescriptorService.getData('Company') || {};
				if (!loginCompanies[loginCompanyId]) {
					basicsLookupdataLookupDataService.getItemByKey('company', loginCompanyId).then(function (data) {
						if (data) {
							basicsLookupdataLookupDescriptorService.updateData('company', [data]);
							loginCompanies[loginCompanyId] = data;
						}
					});
				}
				var bpStatusFk = 'AccessRightDescriptor3Fk';
				initialize(serviceContainer.service);
				var tempModifiedItems = [];

				angular.extend(service, {
					provideUpdateData: provideUpdateData
				});

				service.storeData = function (cacheData, customerId) {

					if (!service.cacheToRead.deleteItem) {
						service.cacheToRead.deleteItem = [];
					}
					if (!service.cacheToRead.saveItem) {
						service.cacheToRead.saveItem = [];
					}
					if (cacheData[customerId] && cacheData[customerId].saveItem) {
						_.forEach(cacheData[customerId].saveItem, function (item) {
							if (_.find(service.cacheToRead.saveItem, {Id: item.Id})) {
								service.cacheToRead.saveItem = _.filter(service.cacheToRead.saveItem, function (saveItem) {
									return saveItem.Id !== item.Id;
								});
							}
							service.cacheToRead.saveItem.push(item);
						});
					}
					if (cacheData[customerId] && cacheData[customerId].deleteItem) {
						_.forEach(cacheData[customerId].deleteItem, function (item) {
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

				service.loadCustomerCompanyItem = function (mainItemId) {
					if (mainItemId !== -1) {
						if (!service.originItemList[mainItemId]) {
							service.originItemList[mainItemId] = [];
						}
						if (service.originItemList[mainItemId].length === 0) {
							$http.get(globals.webApiBaseUrl + 'businesspartner/main/customercompany/list?mainItemId=' + mainItemId)
								.then(function (response) {
									service.originItemList[mainItemId] = angular.copy(response.data);
								});
						}
					}

				};

				service.getOriginalDataList = function (Id) {
					var temp;
					temp = angular.copy(service.originItemList[Id]);
					return temp;
				};

				service.currentSubledgerContextFk = null;
				service.getSubledgerContextByCompanyId = function getSubledgerContextByCompanyId(companyId) {
					$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
						.then(function (response) {
							service.currentSubledgerContextFk = response.data.SubledgerContextFk;
						});
				};

				function provideUpdateData(updateData) {

					if (service.cacheToRead.saveItem || service.cacheToRead.deleteItem) {
						if (service.cacheToRead && service.cacheToRead.saveItem &&
							service.cacheToRead.saveItem.length > 0) {
							if (!angular.isArray(updateData['CustomerCompanyToSave'])) {// jshint ignore:line
								updateData['CustomerCompanyToSave'] = [];// jshint ignore:line
							}
							_.forEach(service.cacheToRead.saveItem, function (item) {
								updateData['CustomerCompanyToSave'].push(item);// jshint ignore:line
								updateData.EntitiesCount += 1;
							});
						}
						if (service.cacheToRead && service.cacheToRead.deleteItem &&
							service.cacheToRead.deleteItem.length > 0) {
							if (!angular.isArray(updateData['CustomerCompanyToDelete'])) {// jshint ignore:line
								updateData['CustomerCompanyToDelete'] = [];// jshint ignore:line
							}
							_.forEach(service.cacheToRead.deleteItem, function (item) {
								updateData['CustomerCompanyToDelete'].push(item);// jshint ignore:line
								updateData.EntitiesCount += 1;
							});
						}
						service.originItemList = [];
						service.cacheToRead = [];
					}
				}

				serviceContainer.data.cleanUpLocalData = function cleanUpBPCustomerData() {
					tempModifiedItems = [];
				};

				var filters = [
					{
						key: 'business-partner-main-customer-businesspostinggroup-filter',
						serverKey: 'business-partner-main-businesspostinggroup-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BpdSubledgerContextFk: item.SubledgerContextFk
							};
						}
					},
					{
						key: 'business-partner-main-customer-customerledgergroup-filter',
						serverKey: 'business-partner-main-customerledgergroup-filter',
						serverSide: true,
						fn: function (item) {
							return {
								BpdSubledgerContextFk: item.SubledgerContextFk
							};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.bPCustomerhasRight = bPCustomerhasRight;
				service.bpItem = null;
				service.getCustomerByCustomerLedgerGrps = getCustomerByCustomerLedgerGrps;
				service.isItemEditable4WizardChangeCode = isItemEditable4WizardChangeCode;

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				return serviceContainer.service;

				function incorporateDataRead(readData, data) {

					service.bpItem = businesspartnerMainHeaderDataService.getSelected();
					var status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData, true);
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

				function processItem(item) {
					if (item) {
						var result = validator.validateBusinessUnitFk(item, item.BusinessUnitFk, 'BusinessUnitFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'BusinessUnitFk');
						// at present, don't validate 'Code' while loading customer records.
						// result = validator.asyncValidateCode(item, item.Code, 'Code');
						// result.then(function (data) {
						// platformRuntimeDataService.applyValidationResult(data, item, 'Code');
						// });
						var model = 'BusinessPostingGroupFk';
						result = validator.validateBusinessPostingGroupFk(item, item.BusinessPostingGroupFk, model);
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

				function bPCustomerhasRight() {
					var isBpStatusHasRight = businesspartnerMainHeaderDataService.isBpStatusHasRight(service.bpItem, 'AccessRightDescriptorFk', 'statusWithEidtRight');
					var isBpStatusToCustomerHasRight = businesspartnerMainHeaderDataService.isBpStatusHasRight(service.bpItem, bpStatusFk, 'statusWithEidtRightToCustomer');

					return isBpStatusHasRight ? isBpStatusHasRight : isBpStatusToCustomerHasRight;
				}

				function fillReadonlyModels(configuration) {
					var service = serviceContainer.service;
					service.unregisterSelectionChanged(onSetReadonly);
					businessPartnerHelper.fillReadonlyModels(configuration, service);
					service.registerSelectionChanged(onSetReadonly);
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
								editable = editable && !customerNumberGenerationSettingsService.hasToGenerateForRubricCategory(currentItem.RubricCategoryFk);
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
					var status = basicsLookupdataLookupDescriptorService.getLookupItem('CustomerStatus', item.CustomerStatusFk);
					return item.Version !== 0 && (!bPCustomerhasRight() || (status && status.IsDeactivated));
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
								case 'BpdDunninggroupFk':
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
				}

				function getCustomerByCustomerLedgerGrps(groupIds) {

					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/customer/getcustomerbycustomerledgergroup', groupIds);
				}

				function initialize(service) {
					serviceContainer.data.deleteRequested = new PlatformMessenger();
					service.fillReadonlyModels = fillReadonlyModels;
					service.propertyChanged = propertyChanged;
					/**
					 * provide lookup data item to lookup formatter after creating new item.
					 */
					service.registerEntityCreated(onEntityCreated);
					registerMessenger();

				}

				function initCreationData(creationData) {
					var selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}

				function isItemEditable4WizardChangeCode(item) {
					if (!item) {
						return false;
					}

					if (isItemReadonly(item)) {
						platformModalService.showMsgBox('businesspartner.main.changeCode.statusIsReadonly', 'businesspartner.main.changeCode.customerTitle', 'ico-warning');
						return false;
					}

					if (loginCompanies && loginCompanies[loginCompanyId]) {
						if (item.SubledgerContextFk !== loginCompanies[loginCompanyId].SubledgerContextFk) {
							platformModalService.showMsgBox('businesspartner.main.changeCode.customerDiffSubLedgerContext', 'businesspartner.main.changeCode.customerTitle', 'ico-warning');
							return false;
						}
					}

					return true;
				}
			}]
	);
})(angular);