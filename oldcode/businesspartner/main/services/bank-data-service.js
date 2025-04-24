/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainBankDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide bank data service
	 */
	angular.module(moduleName).factory('businesspartnerMainBankDataService',
		['$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService',
			'businesspartnerMainBankValidationService', 'platformRuntimeDataService', 'globals', 'PlatformMessenger', 'platformContextService',
			/* jshint -W072 */
			function ($http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService,
				businesspartnerMainBankValidationService, platformRuntimeDataService, globals, PlatformMessenger, platformContextService) {
				var serviceContainer = {};
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainBankDataService',
						dataProcessor: [{processItem: processItem}],
						entityRole: {leaf: {itemName: 'BpdBank', parentService: businesspartnerMainHeaderDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/bank/', endCreate: 'createbank'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/bank/', endRead: 'list'},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: function initCreationData(creationData, data) {
									if (angular.isObject(data.parentService)) {
										creationData.mainItemId = data.parentService.getSelected().Id;
									}
									var existedBanks = serviceContainer.data.getList();
									creationData.requestDefault = existedBanks.length === 0;
								}
							}
						}
					}
				};
				var readonlyFields = ['IsLive', 'BankTypeFk', 'BankFk', 'Iban', 'AccountNo', 'CountryFk', 'IsDefault', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'CompanyFk',
					'IsDefaultCustomer'];
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var validator = businesspartnerMainBankValidationService(serviceContainer.service);
				var bpStatusFk = 'AccessRightDescriptorFk';
				initialize();

				serviceContainer.service.copyPaste = function copyPaste() {  // DeepCopyRecord
					$http.post(globals.webApiBaseUrl + 'businesspartner/main/bank/deepcopy', serviceContainer.service.getSelected())
						.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data, serviceContainer.data);
						},
						function (/* error */) {
						});
				};

				serviceContainer.service.disableDeepCopy = function disableDeepCopy() {
					var item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {  // if BP header status is not edit
						var isEditName = businesspartnerMainHeaderDataService.isEditName(item.BusinessPartnerStatusFk);
						if ((!isEditName) || !businesspartnerMainHeaderDataService.isBpStatusHasRight(item, bpStatusFk, 'statusWithEidtRight')) {
							return true;
						}
					}
					return !serviceContainer.service.hasSelection(); // if not selected
				};
				serviceContainer.service.setReadonly = setReadonly;

				serviceContainer.service.canCreate = function () {
					let item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {
						let isEditName = businesspartnerMainHeaderDataService.isEditName(item.BusinessPartnerStatusFk);
						if (isEditName && businesspartnerMainHeaderDataService.isBpStatusHasRight(item, bpStatusFk, 'statusWithCreateRight'))
							return true;
					}
					return false;
				};
				return serviceContainer.service;

				function incorporateDataRead(readData, data) {
					var item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {
						var isEditName = businesspartnerMainHeaderDataService.isEditName(item.BusinessPartnerStatusFk);
						disableDelete((!isEditName) || !businesspartnerMainHeaderDataService.isBpStatusHasRight(item, bpStatusFk, 'statusWithDeleteRight'));
					}
					basicsLookupdataLookupDescriptorService.attachData(readData);

					return data.handleReadSucceeded(readData.Main, data);
				}



				function disableDelete(flag) {
					serviceContainer.service.canDelete = function () {
						return !flag && canDeleteCallBackFunc(serviceContainer.service.getSelected());
					};
				}

				function canDeleteCallBackFunc(selected) {
					return !!selected;
				}

				function setReadonly(items, status) {
					var fields = getReadonlyFields(readonlyFields, status);
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, fields);
					});
				}

				function getReadonlyFields(fields, status) {
					var readonlyFields = [];
					_.forEach(fields, function (field) {
						readonlyFields.push({field: field, readonly: status});
					});
					return readonlyFields;
				}

				function processItem(item) {
					if (item) {
						var result = validator.validateBankTypeFk(item, item.BankTypeFk, 'BankTypeFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'BankTypeFk');

						result = validator.validateBankFk(item, item.BankFk, 'BankFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'BankFk');

						result = validator.validateCountryFk(item, item.CountryFk, 'CountryFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'CountryFk');

						var bpItem = businesspartnerMainHeaderDataService.getSelected();
						var isBPReadOnly = !businesspartnerMainHeaderDataService.isBpStatusHasRight(bpItem, bpStatusFk, 'statusWithEidtRight');

						// set readonly
						var currencyCompanyId = platformContextService.clientId;
						var status = basicsLookupdataLookupDescriptorService.getLookupItem('bpdbankstatus', item.BpdBankStatusFk);
						if (!!item.CompanyFk && item.CompanyFk !== currencyCompanyId || (!!status && status.IsReadonly) || isBPReadOnly) {
							setReadonly([item], true);
						}
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
								case 'BankFk':
								case 'BankTypeFk':
								case 'CountryFk':
								case 'BpdBankStatusFk':
									result = false;
									break;
								default:
									break;
							}
							return result;
						}
					});
					if (!result.dataReady) {
						result.dataPromise.then(function () {
							serviceContainer.service.gridRefresh();
						});
					}

					platformRuntimeDataService.applyValidationResult(validator.validateIban(newEntity, newEntity.Iban, 'Iban'), newEntity, 'Iban');
					// platformRuntimeDataService.applyValidationResult(validator.validateAccountNo(newEntity, newEntity.AccountNo, 'AccountNo'), newEntity, 'AccountNo');
				}

				function initialize() {
					/**
					 * provide lookup data item to lookup formatter after creating new item.
					 */
					serviceContainer.service.entityDeleted = new PlatformMessenger();
					var basOnDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function (deleteParams, data, response) {

						var entities = angular.copy(deleteParams.entities);
						basOnDeleteDone(deleteParams, data, response);
						serviceContainer.service.entityDeleted.fire(entities);
					};
					serviceContainer.service.registerEntityCreated(onEntityCreated);
				}
			}]
	);
})(angular);