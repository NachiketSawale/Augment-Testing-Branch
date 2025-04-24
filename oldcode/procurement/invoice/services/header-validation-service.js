/**
 /**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_, math */

	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W074 */
	/* jshint -W071 */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).factory('invoiceHeaderElementValidationService',
		['$injector', '$translate', '$http', 'procurementContextService', 'platformContextService', 'procurementInvoiceHeaderDataService',
			'platformDataValidationService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			'businessPartnerLogicalValidator', 'platformRuntimeDataService', 'platformModalService', '$q', '$timeout',
			'procurementInvoiceReferenceDialogService', 'procurementCommonProjectLogicalValidator', 'procurementCommonCodeHelperService',
			'procurementInvoiceCertificateDataService', 'PlatformMessenger', 'ServiceDataProcessDatesExtension', 'prcCommonCalculationHelper', 'procurementInvoiceHeaderFilterService',
			'procurementCommonExchangerateFormatterService', 'platformRuntimeDataService', 'procurementInvoiceAccountAssignmentGetDataService', 'moment', 'procurementInvoiceReconciliationReference',
			'procurementInvoiceNumberGenerationSettingsService', 'procurementInvoiceHeader2HeaderDataService', 'paymentTermCalculationService', 'procurementInvoiceValidationDataService', 'validationReferenceStructuredService', '$rootScope',
			'procurementCommonExchangerateValidateService', 'procurementCommonControllingUnitFactory','procurementCommonMatrixValidationService',
			function ($injector, $translate, $http, moduleContext, platformContextService, dataService, platformDataValidationService,
				lookupDataService, basicsLookupdataLookupDescriptorService, businessPartnerLogicalValidator,
				runtimeDataService, platformModalService, $q, $timeout,
				referenceDialogService, projectLogicalValidator, codeHelperService,
				procurementInvoiceCertificateDataService, PlatformMessenger, ServiceDataProcessDatesExtension, prcCommonCalculationHelper, procurementInvoiceHeaderFilterService,
				procurementCommonExchangerateFormatterService, platformRuntimeDataService, procurementInvoiceAccountAssignmentDataService, moment, reconciliationReference,
				procurementInvoiceNumberGenerationSettingsService, procurementInvoiceHeader2HeaderDataService, paymentTermCalculationService, validationDataService, validationReferenceStructuredService, $rootScope,
				procurementCommonExchangerateValidateService, procurementCommonControllingUnitFactory,commonMatrixValidationService) {

				var service = {};
				service.onConfigurationFkChanged = new PlatformMessenger();

				var self = this, invTypes = [], billingSchemas = [], invTypeItem, isContractBank = false,
					httpRoutBaseUrl = globals.webApiBaseUrl + 'procurement/invoice/header/',
					validateResult, isShowingProgressIdWarning = false;

				var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService, validationService: service});
				var projectValidatorService = projectLogicalValidator.getService({dataService: dataService});
				var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/invoice/header/updateExchangeRate';
				service.validateSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;

				self.refresh = function (entity) {
					$timeout(function () {
						service.removeError();
						entity = entity || service.getSelected();
						dataService.fireItemModified(entity);
					});
				};

				self.isMandatory = function (entity, value, model, errorParam) {
					return platformDataValidationService.isMandatory(value, model, errorParam);
				};

				self.getCurrentRate = function getCurrentRate(entity, value) {
					var exchangeRateUri = globals.webApiBaseUrl + 'procurement/common/exchangerate/defaultrate';
					return $http({
						method: 'GET',
						url: exchangeRateUri,
						params: {
							CompanyFk: moduleContext.loginCompany,
							CurrencyForeignFk: value,
							ProjectFk: entity.ProjectFk,
							currencyRateTypeFk: 1
						}
					});
				};

				self.getInvTypes = function getInvTypes() {
					lookupDataService.getList('InvType').then(function (data) {
						if (data) {
							invTypes = data;
						}
					});
				};

				self.getInvTypes();

				self.getBillingSchema = function getBillingSchema() {
					lookupDataService.getList('BillingSchema').then(function (data) {
						if (data) {
							billingSchemas = data;
						}
					});
				};

				self.getBillingSchema();

				self.setDefaultInvType = function setDefaultInvType(entity, rubricCategoryFk, invTypeFk, dataList, isFromWizard) {
					invTypeItem = _.filter(invTypes, {RubricCategoryFk: rubricCategoryFk});
					if (invTypeFk !== undefined) {
						if (dataList) {
							var _invTypeItem = _.find(invTypes, {Id: invTypeFk});
							if (_invTypeItem) {
								invTypeItem[0] = _invTypeItem;
							}
						}
					} else {
						if (entity.RubricCategoryFk === rubricCategoryFk) {
							invTypeItem = undefined;
						}
					}
					var fireEvent = (_.isUndefined(isFromWizard) || isFromWizard) ? undefined : false;
					if (invTypeItem && invTypeItem.length > 0) {
						var oldinvType = _.find(invTypes, {Id: entity.InvTypeFk});
						if (oldinvType) {
							var getInvtypeItem = _.find(invTypeItem, {IsProgress: oldinvType.IsProgress});
							if (getInvtypeItem) {
								service.validateInvTypeFk(entity, getInvtypeItem.Id, 'InvTypeFk', fireEvent);
							} else {
								service.validateInvTypeFk(entity, invTypeItem[0].Id, 'InvTypeFk', fireEvent);
							}
						} else {
							service.validateInvTypeFk(entity, invTypeItem[0].Id, 'InvTypeFk', fireEvent);
						}
						// entity.InvTypeFk=invTypeItem.Id;
					}

					// entity.Description = dataService.getDescription(entity);
					dataService.getDescriptionAsync(entity).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});
				};

				self.applyBillingSchema = function (entity, fireEvent, forceReload, data, IsFromWizard) {
					var defer = $q.defer();
					if (data) {
						self.onValidateBillingSchemaFk(entity, data.Id, fireEvent, forceReload).then(function () {
							entity.BillingSchemaFk = data.Id;
							defer.resolve(true);
						});
						basicsLookupdataLookupDescriptorService.updateData('BillingSchema', data);
						dataService.fireItemModified(entity);
						if (entity.ConHeaderFk && fireEvent) {
							dataService.autoCreateChainedInvoice.fire();
						}
						if (entity.ConHeaderFk && IsFromWizard) {
							dataService.autoCreateChainedInvoice.fire();
						}
					}
					// we should call the modified event always, because it can trigger the update in billing schema container.
					dataService.markCurrentItemAsModified();
					return defer.promise;
				};

				self.reloadBillingSchema = function reloadBillingSchema(entity, fireEvent, forceReload, isKeeping) {
					var defer = $q.defer();
					if (entity && entity.PrcConfigurationFk) {
						if (isKeeping) {
							return service.getDefaultBillingSchemas(entity.PrcConfigurationFk).then(function (response) {
								if (angular.isArray(response.data) && response.data.length) {
									var items = response.data;
									var target = _.find(items, {Id: entity.BillingSchemaFk});
									var item;
									if (!target) {
										// if current billing schema is not exist in current procurement configuration context
										item = items[0];
									} else {
										item = target;
									}
									if (service.onConfigurationFkChanged) {
										service.onConfigurationFkChanged.fire(null, {
											BillingSchemaFk: entity.BillingSchemaFk,
											InvoiceEntity: entity
										});
									}
									return self.applyBillingSchema(entity, fireEvent, forceReload, item);
								}
							});
						} else {
							return $http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschema?configurationFk=' +
								entity.PrcConfigurationFk).then(
								function (response) {
									if (service.onConfigurationFkChanged) {
										service.onConfigurationFkChanged.fire(null, {
											BillingSchemaFk: entity.BillingSchemaFk,
											InvoiceEntity: entity
										});
									}
									return self.applyBillingSchema(entity, fireEvent, forceReload, response.data);
								}
							);
						}
					}
					defer.resolve(true);
					return defer.promise;
				};

				service.removeError = function (entity, flag) {
					var remainingProperties = flag ? ['ControllingUnitFk'] : ['BusinessPartnerFk', 'Reference', 'Code', 'ControllingUnitFk'];
					var remainingObj = {};
					if (!entity) {
						entity = dataService.getSelected();
					}
					if (entity === undefined || entity === null) {
						return;
					}
					if (entity.__rt$data && entity.__rt$data.errors) {
						_.forEach(remainingProperties, function (val) {
							if (Object.prototype.hasOwnProperty.call(entity.__rt$data.errors, val)) {
								remainingObj[val] = entity.__rt$data.errors[val];
							}
						});
						entity.__rt$data.errors = remainingObj;
					}
					if (_.isEmpty(remainingObj) && flag) {
						var result = {apply: true, valid: true};
						if (entity.Reference) {
							platformDataValidationService.finishValidation(result, entity, entity.Reference, 'Reference', service, dataService);
						}
					}
				};

				self.onPrcConfigurationFk = function onPrcConfigurationFk(entity, value, fireEvent, keepBillingSchemaFK, output, dataList, updatekeepBillingSchemaFK) {
					var defer = $q.defer();
					if (!value) {
						defer.resolve(false);
						return defer.promise;
					}

					var include = _.find(dataList, {Id: entity.PrcConfigurationFk});

					if (entity.PrcConfigurationFk === value || include !== undefined) {
						defer.resolve(true);
						return defer.promise;
					}

					entity.PrcConfigurationFk = value;
					// var forceReload = true;
					// var isKeeping = true;
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					if (entity.RubricCategoryFk !== config.RubricCategoryFk) {
						entity.RubricCategoryFk = config.RubricCategoryFk;
						if (output) {
							output.forceReload = true;
						}
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/defaultrubriccategory?invTypeFk=' + entity.InvTypeFk + '&repalceRubricCategoryFk=' + config.RubricCategoryFk).then(
							function (response) {
								tunInvTypesArray(invTypes);
								if (invTypes.length > 0) {
									/** @namespace response.data.invTypeFk */
									self.setDefaultInvType(entity, entity.RubricCategoryFk, response.data.invTypeFk, dataList);
									/** @namespace response.data.IsAccordance */
									if (dataList !== undefined) {
										if (!response.data.IsAccordance) {
											var modalOptions = {
												bodyText: $translate.instant('procurement.invoice.warning.bothWarnning'),
												iconClass: 'ico-warning'
											};
											platformModalService.showDialog(modalOptions);
										} else {
											var modalOptions1 = {
												bodyText: $translate.instant('procurement.invoice.warning.configurationWarnning'),
												iconClass: 'ico-warning'
											};
											platformModalService.showDialog(modalOptions1);
										}
									}
								} else {
									lookupDataService.getList('InvType').then(function (data) {
										if (!data) {
											defer.resolve(null);
											return defer.promise;
										}
										invTypes = data;
										self.setDefaultInvType(entity, entity.RubricCategoryFk);
									});
								}
								if (!entity.Code || entity.Version === 0) {
									platformRuntimeDataService.readonly(entity, [{
										field: 'Code',
										readonly: procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
									}]);
									entity.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);

									validateEmptyCode(entity);
								}

								if (!keepBillingSchemaFK) {
									self.reloadBillingSchema(entity, fireEvent, true, true).then(function () {
										if (updatekeepBillingSchemaFK === false) {
											dataService.reloadBillingSchemas();
										}
									});
								}

								if (keepBillingSchemaFK && updatekeepBillingSchemaFK === false) {
									dataService.reloadBillingSchemas();
								}

								$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getConfigHeaderById?configurationFk=' + value).then(function (response) {
									service.updatePaymentTermFkByPrcConfiguration(entity, response.data);
								});

								defer.resolve(true);
							}
						);
					} else {
						if (dataList !== undefined) {
							var modalOptions = {
								bodyText: $translate.instant('procurement.invoice.warning.configurationWarnning'),
								iconClass: 'ico-warning'
							};
							platformModalService.showDialog(modalOptions);
						}
						if (!entity.Code) {
							procurementInvoiceNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
								}]);
								entity.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);
								validateEmptyCode(entity);
							});
						}
						tunInvTypesArray(invTypes);
						if (invTypes.length > 0) {
							self.setDefaultInvType(entity, entity.RubricCategoryFk, undefined);
						} else {
							lookupDataService.getList('InvType').then(function (data) {
								if (!data) {
									defer.resolve(null);
									return defer.promise;
								}

								invTypes = data;

								self.setDefaultInvType(entity, entity.RubricCategoryFk);
							});
						}

						if (!keepBillingSchemaFK) {
							self.reloadBillingSchema(entity, fireEvent, false, true).then(function () {
								if (updatekeepBillingSchemaFK === false) {
									dataService.reloadBillingSchemas();
								}
							});
						}

						if (keepBillingSchemaFK && updatekeepBillingSchemaFK === false) {
							dataService.reloadBillingSchemas();
						}
						$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getConfigHeaderById?configurationFk=' + value).then(function (response) {
							service.updatePaymentTermFkByPrcConfiguration(entity, response.data);
						});

						defer.resolve(true);
					}
					return defer.promise;
				};

				self.onPrcConfigurationFkForWizard = function onPrcConfigurationFkForWizard(entity, value, fireEvent, keepBillingSchemaFK, output, frmWizardInvTypeFk) {
					var defer = $q.defer();
					if (!value) {
						defer.resolve(false);
						return defer.promise;
					}

					if (entity.PrcConfigurationFk === value) {
						defer.resolve(true);
						return defer.promise;
					}

					entity.PrcConfigurationFk = value;
					var forceReload = false;
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					if (entity.RubricCategoryFk !== config.RubricCategoryFk) {
						entity.RubricCategoryFk = config.RubricCategoryFk;
						forceReload = true;
						if (output) {
							output.forceReload = true;
						}
					}
					if (!entity.Code || entity.Version === 0) {
						procurementInvoiceNumberGenerationSettingsService.assertLoaded().then(function () {
							platformRuntimeDataService.readonly(entity, [{
								field: 'Code',
								readonly: procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
							}]);
							entity.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);
							validateEmptyCode(entity);
						});

					}

					tunInvTypesArray(invTypes);
					if (invTypes.length > 0) {
						if (frmWizardInvTypeFk !== undefined) {
							self.setDefaultInvType(entity, entity.RubricCategoryFk, frmWizardInvTypeFk, undefined, false);
						}
					} else {
						lookupDataService.getList('InvType').then(function (data) {
							if (!data) {
								defer.resolve(null);
								return defer.promise;
							}

							invTypes = data;

							self.setDefaultInvType(entity, entity.RubricCategoryFk, undefined, undefined, false);
						});
					}

					if (!keepBillingSchemaFK) {
						self.reloadBillingSchema(entity, fireEvent, forceReload);
					}

					var defaultListNotModified = null;
					var sourceSectionId = 32;// 32 is  prcurement Configration
					var targetSectionId = 21;// 21 is  invoice.
					// var rfqMainService = $injector.get('procurementRfqMainService');
					var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
					defaultListNotModified = charDataService.getList();
					var newItem = [];
					angular.forEach(defaultListNotModified, function (item) {
						newItem.push(item);
					});
					if (value) {
						var sourceHeaderId = value;
						var targetHeaderId = dataService.getSelected().Id;
						$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
								var configData = response.data;
								angular.forEach(configData, function (item) {
									var oldItem = _.find(defaultListNotModified, {CharacteristicFk: item.CharacteristicFk});
									if (!oldItem) {
										newItem.push(item);
									}
								});
								charDataService.setList(newItem);
								angular.forEach(newItem, function (item) {
									charDataService.markItemAsModified(item);
								});
							}
						);
					}
					defer.resolve(true);
					return defer.promise;
				};

				service.validateDialogConfigurationFk = function validateDialogConfigurationFk(entity, value) {
					entity.PrcConfigurationFk = value;
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					if (!entity.Code || entity.Version === 0) {
						procurementInvoiceNumberGenerationSettingsService.assertLoaded().then(function () {
							platformRuntimeDataService.readonly(entity, [{
								field: 'Code',
								readonly: procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
							}]);
							entity.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);
							validateEmptyCode(entity);
						});
					}
					dataService.fireItemModified(entity);
					return true;
				};

				service.getDefaultBillingSchemas = function (prcConfigurationFk) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschemas?configurationFk=' +
						prcConfigurationFk);
				};

				service.setPrcConfigurationFk = function (entity, value) {
					self.onPrcConfigurationFk(entity, value, false, true);
				};

				service.setBillingSchemaFk = function (entity, value) {
					self.applyBillingSchema(entity, false, true, _.find(billingSchemas, {Id: value}));
				};

				service.asyncSetPrcConfigFkAndBillingSchemaFk = function (entity, prcConfigFk, billingShcemaFk, dataList) {
					var output = {forceReload: false};
					var promise1 = self.onPrcConfigurationFk(entity, prcConfigFk, false, true, output, dataList, true);
					var promise2 = self.applyBillingSchema(entity, false, output.forceReload, _.find(billingSchemas, {Id: billingShcemaFk}));
					return $q.all([promise1, promise2]);
				};

				service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk, billingShcemaFk, invTypeFk) {
					var output = {forceReload: false};
					var promise1 = self.onPrcConfigurationFkForWizard(entity, prcConfigFk, false, true, output, invTypeFk);
					var promise2 = self.applyBillingSchema(entity, false, output.forceReload, _.find(billingSchemas, {Id: billingShcemaFk}), true);
					return $q.all([promise1, promise2]);
				};

				service.validatePrcConfigurationFk = function validatePrcConfigurationFk(entity, value) {
					if (!entity.ConHeaderFk) {
						self.onPrcConfigurationFk(entity, value, true, false);
					} else {
						self.onPrcConfigurationFk(entity, value, true, false, undefined, undefined, false);
					}
					var defaultListNotModified = null;
					var sourceSectionId = 32;// 32 is  prcurement Configration
					var targetSectionId = 21;// 21 is  invoice.
					// var rfqMainService = $injector.get('procurementRfqMainService');
					var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
					defaultListNotModified = charDataService.getList();
					var newItem = [];
					angular.forEach(defaultListNotModified, function (item) {
						newItem.push(item);
					});
					if (value) {
						var sourceHeaderId = value;
						var targetHeaderId = 0;
						var selectedEntity = dataService.getSelected();
						if (selectedEntity) {
							targetHeaderId = dataService.getSelected().Id;
						}
						$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
								var configData = response.data;
								/* var oldCharData = charDataService.getList();
								angular.forEach(oldCharData,function (oldItem) {
									oldItem.setModified(false);
								});
								charDataService.clear(oldCharData); */
								angular.forEach(configData, function (item) {
									var oldItem = _.find(defaultListNotModified, {CharacteristicFk: item.CharacteristicFk});
									if (!oldItem) {
										newItem.push(item);
									}
								});
								charDataService.setList(newItem);
								angular.forEach(newItem, function (item) {
									charDataService.markItemAsModified(item);
								});
							}
						);
					}
					return true;
				};

				self.onValidateBillingSchemaFk = function onValidateBillingSchemaFk(entity, value, fireEvent, forceReload) {
					var defer = $q.defer();
					self.checkMandatory(entity, value === -1 ? '' : value, 'BillingSchemaFk', true, {
						fieldName: $translate.instant('cloud.common.entityBillingSchema')
					});// backend may return -1

					var oldBillingSchema = _.find(billingSchemas, {Id: entity.BillingSchemaFk});
					var oldIsChained = false;
					if (oldBillingSchema) {
						oldIsChained = oldBillingSchema.IsChained;
					}
					basicsLookupdataLookupDescriptorService.loadItemByKey('BillingSchema', value).then(
						function (response) {
							// response.IsChained
							service.setProgressAndDescriptionByBillingScheme(entity);
							if (response) {
								entity.BillSchemeIsChained = response.IsChained;
							}
							if (!response || !response.IsChained) {
								return;
							}
							if (entity.ConHeaderFk && fireEvent) {
								dataService.autoCreateChainedInvoice.fire();
							}
							if (oldIsChained !== response.IsChained) {
								dataService.refreshPes.fire();
								self.recalculateAmountBalance(entity);
							}

						}
					);
					if (entity.BillingSchemaFk !== value || forceReload) {
						entity.BillingSchemaFk = value;
						dataService.reloadBillingSchemas();

						var serv = $injector.get('invoiceBillingSchemaDataService');
						self.unbindWatchAutoReloadBilling = $rootScope.$watch(function () {
							return serv.getReloadBillingStatus();
						}, function () {
							if (serv.getReloadBillingStatus()) {
								self.unbindWatchAutoReloadBilling();
								defer.resolve(true);
							}
						}, true);
					} else {
						defer.resolve(null);
					}
					return defer.promise;
				};

				// todo- ValidateBillingSchemaFk-->asyncValidateBillingSchemaFk
				service.asyncValidateBillingSchemaFk = function asyncValidateBillingSchemaFk(entity, value) {
					return self.onValidateBillingSchemaFk(entity, value, true);
				};

				service.asyncValidateCode = function (entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = platformDataValidationService.isSynAndAsyncUnique(dataService.getList(), httpRoutBaseUrl + 'iscodeunique',
						entity, value, model, {object: 'entry no'}
					).then(function (result) {
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						return result;
					});

					return asyncMarker.myPromise;
				};

				service.showReferenceDialog = function (validResult) {
					referenceDialogService.setCurrentItems(validResult.data);
					referenceDialogService.setErrorMessage(validResult.error);
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.invoice/partials/invoice-header-reference-dialog.html',
						headerTextKey: 'procurement.invoice.header.headerReference',
						headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
						backdrop: false
					});
				};

				self.onBusinessPartnerChange = function (entity, supplierFk, businessPartnerFk, changeType) {
					if (changeType === 1) {
						businessPartnerValidatorService.businessPartnerValidator(entity, businessPartnerFk);
						lookupDataService.getItemByKey('supplier', supplierFk).then(function (response) {
							service.updatePaymentTermFkBySupplier(entity, response);
						});
					} else if (changeType === 2) {
						businessPartnerValidatorService.supplierValidator(entity, supplierFk);
						if (null !== supplierFk) {
							lookupDataService.getItemByKey('supplier', supplierFk).then(function (response) {
								service.updatePaymentTermFkBySupplier(entity, response);
								var businessPartnerFk1 = response.BusinessPartnerFk;
								/* var businessPartners = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
								var has = _.find(businessPartners, {Id: businessPartnerFk1});
								if (!has) {
								 	lookupDataService.getItemByKey('BusinessPartner', businessPartnerFk1).then(function (response1) {
								 		basicsLookupdataLookupDescriptorService.updateData('BusinessPartner', [response1]);
								 		entity.Description = dataService.getDescription(entity, 'BusinessPartnerFk', businessPartnerFk1);
								 		dataService.fireItemModified(entity);
								 	});
								 }
								 else {
								 	entity.Description = dataService.getDescription(entity, 'BusinessPartnerFk', businessPartnerFk1);
								 	dataService.fireItemModified(entity);
								 } */
								dataService.getDescriptionAsync(entity, {BusinessPartnerFk: businessPartnerFk1}).then(function (desc) {
									entity.Description = desc;
									dataService.fireItemModified(entity);
								});
							});
						}
					}
					service.validateBusinessPartnerFk(entity, businessPartnerFk, 'BusinessPartnerFk');// always vali

				};

				self.isAsyncGroupUnique = function isAsyncGroupUnique(httpRoute, groupObject) {
					var defer = $q.defer();
					$http.post(httpRoute, groupObject).then(function (result) {
						if (result.data) {
							defer.resolve({
								apply: true,
								valid: false,
								error: result.data.error,
								data: result.data.main
							});
						} else {
							defer.resolve({apply: true, valid: true, error: ''});
						}
					});

					return defer.promise;
				};

				self.checkReferenceUnique = function (entity, invStatusFk, reference, supplierFk, businessPartnerFk, changeType) {

					validateResult = self.isAsyncGroupUnique(httpRoutBaseUrl + 'isreferenceunique',
						{
							reference: reference,
							supplierFk: supplierFk || 0,
							businessPartnerFk: businessPartnerFk || 0,
							invStatusFk: invStatusFk,
							id: entity.Id,
							code: entity.Code
						}
					);

					validateResult.then(function (validResult) {
						if (!validResult.valid) {
							service.showReferenceDialog(validResult);
						} else {
							if (changeType) {
								self.onBusinessPartnerChange(entity, supplierFk, businessPartnerFk, changeType);
							}

						}
					});
					return validateResult;
				};

				self.onSupplierChanged = function (entity, supplierFk, businessPartnerFk, changeType, ChangeConHeaderFk) {
					var defer = $q.defer();
					if (!supplierFk && !businessPartnerFk) {
						self.onBusinessPartnerChange(entity, supplierFk, businessPartnerFk, changeType);
						resetVatGroupAndPostingGroupBySupplier(entity, supplierFk, !ChangeConHeaderFk, true);
						service.removeError(entity, true);
						defer.resolve(true);
						return defer.promise;
					} else {
						if (entity.Reference) {
							self.checkReferenceUnique(entity, entity.InvStatusFk, entity.Reference, supplierFk, businessPartnerFk, changeType).then(function (result) {

								platformRuntimeDataService.applyValidationResult(result, entity, 'Reference');

								defer.resolve(result);
							});
							self.onBusinessPartnerChange(entity, supplierFk, businessPartnerFk, changeType);
							resetVatGroupAndPostingGroupBySupplier(entity, supplierFk, !ChangeConHeaderFk, true);
							return defer.promise;
						} else {

							self.checkMandatory(entity, entity.Reference, 'Reference', true);
							self.onBusinessPartnerChange(entity, supplierFk, businessPartnerFk, changeType);
							resetVatGroupAndPostingGroupBySupplier(entity, supplierFk, !ChangeConHeaderFk, true);
							defer.resolve(true);
							return defer.promise;
						}
					}

				};

				self.checkMandatory = function (entity, value, model, apply, errorParam) {
					var result = self.isMandatory(entity, value, model, errorParam);
					if (apply) {
						result.apply = true;
					}

					runtimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				self.checkIsProgress = function (value, newValue) {
					var invType = basicsLookupdataLookupDescriptorService.getData('InvType');
					var typeItem = {};
					var newTypeItem = {};
					if (value) {
						typeItem = _.find(invType, {Id: value});
					}
					if (newValue) {
						newTypeItem = _.find(invType, {Id: newValue});
					}
					return typeItem.IsProgress === newTypeItem.IsProgress;
				};

				service.setProgressAndDescriptionByBillingScheme = function (entity) {
					var billingSchemaFk = entity.BillingSchemaFk;
					var billSchemas = basicsLookupdataLookupDescriptorService.getData('PrcConfig2BSchema');
					var billSchema = _.find(billSchemas, {Id: billingSchemaFk});
					if (billSchema) {
						var goEdit = billSchema.IsChained;
						if (goEdit) {
							var conFk = entity.ConHeaderFk;
							if (!_.isNumber(entity.ProgressId) || null === entity.ProgressId || 0 === entity.ProgressId) {
								entity.ProgressId = 1;
							}
							if (conFk) {
								service.getProgressUniqueByContract(entity, entity.Id, entity.ProgressId, conFk, true);
							}
						} else {
							entity.ProgressId = 0;
						}
						var statusWithEditRight = true;
						var invStatusEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRight');
						if (invStatusEditRight) {
							statusWithEditRight = _.find(invStatusEditRight, {Id: entity.InvStatusFk});
						}
						// entity.Description = dataService.getDescription(entity, 'ProgressId', entity.ProgressId);
						dataService.getDescriptionAsync(entity).then(function (desc) {
							entity.Description = desc;
							dataService.fireItemModified(entity);
						});
						platformRuntimeDataService.readonly(entity, [{field: 'ProgressId', readonly: !statusWithEditRight ? true : !goEdit}]);
						dataService.fireItemModified(entity);
					}
				};

				service.getProgressUniqueByContract = function (entity, id, progressId, conFk, changeFlg) {
					if (id === undefined || id === null) {
						id = 0;
					}
					$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getProgressIdUniqueByContract?id=' + id + '&progressId=' + progressId + '&conFk=' + conFk + '&changeFlg=' + changeFlg).then(function (response) {
						var data = response.data;
						if (data !== progressId) {
							var conHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: conFk});
							var contractName = conHeaderView.Code;
							var warningMessage = $translate.instant('procurement.invoice.warning.progressIdByWarning', {
								conFk: contractName,
								progressId: progressId,
								resetProgressId: data
							});
							var title = $translate.instant('procurement.invoice.warning.warning') || 'Warning';
							entity.ProgressId = data;
							// entity.Description = dataService.getDescription(entity, 'ProgressId', data);
							dataService.getDescriptionAsync(entity).then(function (desc) {
								entity.Description = desc;
								dataService.fireItemModified(entity);
							});
							dataService.fireItemModified(entity);
							if (!isShowingProgressIdWarning) {
								platformModalService.showMsgBox(warningMessage, title, 'warning').finally(function () {
									isShowingProgressIdWarning = false;
								});
								isShowingProgressIdWarning = true;
							}
						} else {
							entity.ProgressId = progressId;
							// entity.Description = dataService.getDescription(entity, 'ProgressId', progressId);
							dataService.getDescriptionAsync(entity).then(function (desc) {
								entity.Description = desc;
								dataService.fireItemModified(entity);
							});
							dataService.fireItemModified(entity);
						}
					});
				};

				service.validateBasAccassignConTypeFk = function validateBasAccassignConTypeFk(entity, value) {
					var accassignConTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignConType'), {Id: value});
					entity.IsInvAccountChangeable = accassignConTypeEntity && accassignConTypeEntity.IsCreateInvAccount;
					entity.BasAccassignConTypeFk = value;
					var invAccountReadonlyProcessor = $injector.get('procurementInvoiceAccountAssignmentReadonlyProcessor');
					if (procurementInvoiceAccountAssignmentDataService) {
						var invAccountList = procurementInvoiceAccountAssignmentDataService.getList();
						angular.forEach(invAccountList, function (item) {
							invAccountReadonlyProcessor.setAccountAssignmentFieldsReadOnly(item);
						});
						procurementInvoiceAccountAssignmentDataService.gridRefresh();
						procurementInvoiceAccountAssignmentDataService.registerUpdateTools(entity.IsInvAccountChangeable);
						procurementInvoiceAccountAssignmentDataService.updateTools(entity.ConHeaderFk);
					}
					return true;
				};

				service.validateReferenceStructured = function (entity, value, model) {
					var validateResult = validationReferenceStructuredService.validationReferenceStructured(value);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validateProgressId = function (entity, value/* , model, apply */) {
					var ProgressId = 0;
					var conFk = 0;
					var changeFlg = false;
					if (_.isNumber(value)) {
						ProgressId = value;
						conFk = entity.ConHeaderFk;
					} else if (_.isObject(value)) {
						changeFlg = true;
						ProgressId = entity.ProgressId;
						conFk = value.Id;
					}
					if (conFk) {
						service.getProgressUniqueByContract(entity, entity.Id, ProgressId, conFk, changeFlg);
					} else {
						// entity.Description = dataService.getDescription(entity, 'ProgressId', ProgressId);
						// dataService.fireItemModified(entity);
						dataService.getDescriptionAsync(entity, {ProgressId: ProgressId}).then(function (desc) {
							entity.Description = desc;
							dataService.fireItemModified(entity);
						});
					}
				};

				// var bpName;
				service.validateBusinessPartnerFk = function (entity, value, model, apply, noRload) {
					if (apply === undefined) {
						apply = true;
					}

					var result = self.checkMandatory(entity, value, model, apply, {
						fieldName: $translate.instant('cloud.common.entityBusinessPartner')
					});

					dataService.getDescriptionAsync(entity, {BusinessPartnerFk: value}).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});

					if (result && result.valid === true) {
						// entity.Description = dataService.getDescription(entity, 'BusinessPartnerFk', value);
						// dataService.fireItemModified(entity);
					} else {
						entity.SubsidiaryFk = null;
						entity.SupplierFk = null;
						entity.BankFk = null;
						entity.ContactFk = null;
						service.validateBankFk(entity, entity.BankFk);
						reloadGeneralsByBusinessPartnerFk(entity, value, noRload);
						if (entity.Reference && entity.BusinessPartnerFk) {
							service.removeError(entity, true);
						}
						dataService.fireItemModified(entity);
					}
					return result;
				};

				// asyncValidateBusinessPartnerFk  asyncValidateReference
				service.asyncValidateBusinessPartnerFk = async function asyncValidateBusinessPartnerFk(entity, value, model, formatterOptions, noRload, ChangeConHeaderFk, pointedSupplierFk, pointedSubsidiaryFk) {
					var defer = $q.defer();
					reloadGeneralsByBusinessPartnerFk(entity, value, noRload);
					if (entity.BusinessPartnerFk !== value && value !== 0) {
						if (entity.Reference) {
							self.checkReferenceUnique(entity, entity.InvStatusFk, entity.Reference, entity.SupplierFk, value).then(function (result) {
								platformRuntimeDataService.applyValidationResult(result, entity, 'Reference');
								platformDataValidationService.finishAsyncValidation(result, entity, value, 'Reference', null, service, dataService);
							});
						}
						await businessPartnerValidatorService.businessPartnerValidator(entity, value, undefined, undefined, pointedSupplierFk, pointedSubsidiaryFk);
						platformRuntimeDataService.readonly(entity, [{field: 'BankFk', readonly: value === null || angular.isUndefined(value)}]);
						if (!isContractBank) {
							businessPartnerValidatorService.GetDefaultSupplier(entity, value).then(function () {
								procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, value);
							});
						}

						service.removeError(entity);
						defer.resolve(true);
						return defer.promise;
					} else {
						var supplier;
						if (angular.isDefined(entity.SupplierFk)) {
							supplier = _.find(basicsLookupdataLookupDescriptorService.getData('subsidiary'), {
								BusinessPartnerFk: value,
								Id: entity.SupplierFk
							});
						}

						// async verify
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

						if (!supplier) {
							// get data from server when cache is not found
							var searchRequest = {
								AdditionalParameters: {
									BusinessPartnerFk: value
								},
								FilterKey: 'businesspartner-main-supplier-common-filter',
								SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
								SearchText: ''
							};
							lookupDataService.getSearchList('supplier', searchRequest).then(function (data) {
								if (!_.isNil(data)) {
									var dataList = data.items ? data.items : [];
									dataList = dataList.sort(function (supplier1, supplier2) {
										return supplier1.Code.toUpperCase() - supplier2.Code.toUpperCase();
									});
									var supplierFk = dataList[0] ? dataList[0].Id : 0;
									// var paymentMethodFk = dataList[0] ? dataList[0].BasPaymentMethodFk : entity.BasPaymentMethodFk;
									if (supplierFk === 0) {
										entity.SupplierFk = null;
									} else {
										entity.SupplierFk = supplierFk;
										service.updatePaymentTermFkBySupplier(entity, dataList[0]);
									}
									if (!isContractBank) {
										procurementInvoiceHeaderFilterService.getBankFkBySupplierFk(entity, supplierFk);
									}
									self.onSupplierChanged(entity, supplierFk, value, 1, ChangeConHeaderFk).then(function (result) {

										defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(result), entity, value, model, asyncMarker, service, dataService));
									});
								} else {
									defer.resolve(true);
								}

							});
							asyncMarker.myPromise = defer.promise;
						} else {
							entity.BasPaymentMethodFk = supplier.BasPaymentMethodFk;
							asyncMarker.myPromise = self.onSupplierChanged(entity, supplier.Id, value, 1, ChangeConHeaderFk).then(function (validateResult) {

								return platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
							});
						}
						/*
                         if(entity.Reference!==null&&entity.Reference!==undefined&&entity.Reference.length>0)
                         {
                         //entity.BusinesspartnerFk=value;
                         self.checkReferenceUnique(entity, entity.Reference, entity.SupplierFk,value).then(function (result) {
                         defer.resolve(result);
                         });
                         }
                         */
						return asyncMarker.myPromise;
					}
				};

				service.validateReference = function (entity, value, model, apply) {
					return self.checkMandatory(entity, value, model, apply);
				};

				service.asyncValidateReference = function asyncValidateReference(entity, value, model) {
					var defer = $q.defer();
					/*
                    if(!value) {
                        var result=self.checkMandatory(entity, value, 'Reference', true);
                        defer.resolve(result);
                        return defer.promise;
                    }
                    */
					if ((!entity.SupplierFk && !entity.BusinessPartnerFk)) {
						defer.resolve(true);
						return defer.promise;
					}
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});

					if ((entity.SupplierFk || entity.BusinessPartnerFk)) {
						validateResult = platformDataValidationService.isMandatory(value, model);

						if (!validateResult.valid) {
							defer.resolve(validateResult);
							return asyncMarker.myPromise;
						} else {
							self.checkReferenceUnique(entity, entity.InvStatusFk, value, entity.SupplierFk, entity.BusinessPartnerFk).then(function (result) {
								defer.resolve(result);
							});
							return asyncMarker.myPromise;
						}
					} else {
						defer.resolve(true);
						return asyncMarker.myPromise;
					}
				};

				service.asyncValidateSupplierFk = function (entity, value, model) {
					// async verify
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var suppliers = basicsLookupdataLookupDescriptorService.getData('Supplier');
					var selectedSup = _.find(suppliers, {Id: value});
					if (selectedSup !== undefined && selectedSup.BasPaymentMethodFk) {
						entity.BasPaymentMethodFk = selectedSup.BasPaymentMethodFk;
					}
					asyncMarker.myPromise = self.onSupplierChanged(entity, value, entity.BusinessPartnerFk, 2, false).then(function (validateResult) {
						return platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
					});
					if (!isContractBank) {
						procurementInvoiceHeaderFilterService.getBankFkBySupplierFk(entity, value);
					}

					return asyncMarker.myPromise;
				};

				service.validateDateInvoiced = self.checkMandatory;
				service.validateDatePosted = self.checkMandatory;
				// service.validateExchangeRate = self.checkMandatory;
				service.validateDateReceived = self.checkMandatory;

				//
				self.onExchangeRateChange = function (entity) {
					var exchangeRate = entity.ExchangeRate;
					entity.AmountGross = getNonOcByOc(entity.AmountGrossOc, exchangeRate);
					entity.AmountNet = getNonOcByOc(entity.AmountNetOc, exchangeRate);
					entity.AmountDiscountBasis = getNonOcByOc(entity.AmountDiscountBasisOc, exchangeRate);
					entity.AmountDiscount = getNonOcByOc(entity.AmountDiscountOc, exchangeRate);
					dataService.exchangeRateChangedEvent.fire(null, {ExchangeRate: exchangeRate});
				};

				function updateDialogAfterUpdateRateForNewEntity(entity, originalRate, originalCurrency) {
					return platformModalService.showDialog({
						headerTextKey: 'procurement.common.changeCurrencyHeader',
						templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-commom-modify-exchangerate-dialog.html'
					}).then(function (result) {
						if (result.yes) {
							const remainNet = result.remainNet;
							const exchangeRate = entity.ExchangeRate;
							if (remainNet) {
								entity.AmountGrossOc = getOcByNonOc(entity.AmountGross, exchangeRate);
								entity.AmountNetOc = getOcByNonOc(entity.AmountNet, exchangeRate);
								entity.AmountDiscountBasisOc = getOcByNonOc(entity.AmountDiscountBasis, exchangeRate);
								entity.AmountDiscountOc = getOcByNonOc(entity.AmountDiscount, exchangeRate);
							} else {
								entity.AmountGross = getNonOcByOc(entity.AmountGrossOc, exchangeRate);
								entity.AmountNet = getNonOcByOc(entity.AmountNetOc, exchangeRate);
								entity.AmountDiscountBasis = getNonOcByOc(entity.AmountDiscountBasisOc, exchangeRate);
								entity.AmountDiscount = getNonOcByOc(entity.AmountDiscountOc, exchangeRate);
								let sumChainInvoices = service.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
								entity.TotalPerformedNet = round(math.bignumber(entity.AmountNet).add(sumChainInvoices));
								let sumGrossChainInvoices = service.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
								entity.TotalPerformedGross = round(math.bignumber(entity.AmountGross).add(sumGrossChainInvoices));
							}
						} else {
							entity.ExchangeRate = originalRate;
							entity.CurrencyFk = originalCurrency;
							if (entity.Version === 0) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'ExchangeRate',
									readonly: entity.CurrencyFk === moduleContext.companyCurrencyId
								}]);
							}
						}
					});
				}

				function validateCurrencyFk(entity, value) {
					if (!entity) {
						return true;
					}
					// value is object,mean is modify contract cause ,then exchangeRate from contract ,otherwise is user modify
					// data.CurrencyFk, data.Exchangerate
					var currencyFk = _.isNumber(value) ? value : ((_.isObject(value) && value.CurrencyFk) ? value.CurrencyFk : moduleContext.companyCurrencyId);
					/** @namespace value.Exchangerate */
					var exchangeRate = (_.isObject(value) && value.Exchangerate) ? value.Exchangerate : 0;
					entity.CurrencyFk = currencyFk;
					if (currencyFk === moduleContext.companyCurrencyId) {
						entity.ExchangeRate = 1;
						self.onExchangeRateChange(entity);
						validateExchangeRate(entity, 1, 'ExchangeRate', true);
					} else {
						if (exchangeRate && exchangeRate > 0) {
							exchangeRateChanged(exchangeRate);
						} else {
							self.getCurrentRate(entity, currencyFk).then(
								function (response) {
									if (response) {
										var rate = response.data;
										exchangeRateChanged(rate);
									}
								}, function (error) {
									window.console.error(error);
								}
							);
						}
					}

					dataService.updateReadOnly(entity);
					return true;

					function exchangeRateChanged(rate) {
						entity.ExchangeRate = rate;
						if (rate) {
							self.onExchangeRateChange(entity);
							dataService.fireItemModified(entity);
						}
						validateExchangeRate(entity, rate, 'ExchangeRate', true);
					}
				}

				service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, value, model) {
					if (!entity) {
						return true;
					}
					var originalCurrency = entity[model];
					var originalRate = entity.ExchangeRate;
					var currencyFk = _.isNumber(value) ? value : ((_.isObject(value) && value.CurrencyFk) ? value.CurrencyFk : moduleContext.companyCurrencyId);
					if (currencyFk === 0 || entity.CurrencyFk === currencyFk) {
						return $q.when(true);
					}
					entity.CurrencyFk = currencyFk;
					var exchangeRate = (_.isObject(value) && value.Exchangerate) ? value.Exchangerate : 0;
					if (exchangeRate && exchangeRate > 0) {
						return updateRateAfterChangeCurrencyFk(entity, exchangeRate);
					} else if (value === moduleContext.companyCurrencyId) {
						return updateRateAfterChangeCurrencyFk(entity, 1);
					} else {
						return self.getCurrentRate(entity, entity.CurrencyFk).then(
							function (response) {
								if (response) {
									return updateRateAfterChangeCurrencyFk(entity, response.data);
								}
							}, function (error) {
								window.console.error(error);
							}
						);
					}

					function updateRateAfterChangeCurrencyFk(entity, newRate) {
						const sameRate = entity.ExchangeRate === newRate;
						entity.ExchangeRate = newRate;
						if (entity.Version === 0) {
							platformRuntimeDataService.readonly(entity, [{
								field: 'ExchangeRate',
								readonly: entity.CurrencyFk === moduleContext.companyCurrencyId
							}]);
						}
						if (entity.Version === 0 && entity.ExchangeRate) {
							var defer = $q.defer();
							if (!sameRate) {
								updateDialogAfterUpdateRateForNewEntity(entity, originalRate, originalCurrency);
								defer.resolve(true);
								return defer.promise;
							} else {
								defer.resolve(true);
								return defer.promise;
							}
						}
						return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
					}
				};

				self.recalculateAmountNetOc = function recalculateAmountNetOc(entity) {
					// AMOUNT_GROSS divided by (100 + MDC_TAX_CODE_FK.VATPERCENT) divided by 100.
					if (entity.TaxCodeFk) {
						lookupDataService.getItemByKey('TaxCode', entity.TaxCodeFk).then(function (data) {
								if (angular.isObject(data)) {
									// entity.AmountGross = entity.AmountGross || 0;
									var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
									entity.AmountNetOc = getPreTaxByAfterTax(entity.AmountGrossOc, vatPercent);
									service.validateAmountNetOc(entity, entity.AmountNetOc, 'AmountNetOc');
									dataService.fireItemModified(entity);
								}
							},
							function (error) {
								window.console.error(error);
							}
						);
					}
				};

				self.updateDiscountBasics = function updateDiscountBasics(entity) {
					entity.AmountDiscountBasis = entity.AmountGross;
					entity.AmountDiscountBasisOc = entity.AmountGrossOc;
					self.recalculateAmountDiscount(entity, null);
				};

				self.recalculateAmountDiscount = function recalculateAmountDiscount(entity/* , data */) {
					if (entity.PaymentTermFk) {
						lookupDataService.getItemByKey('PaymentTerm', entity.PaymentTermFk).then(function (data) {
								if (angular.isObject(data)) {
									self.recalculateAmountDiscountSimple(entity, data);
									dataService.fireItemModified(entity);
								}
							},
							function (error) {
								window.console.error(error);
							}
						);
					}
				};

				self.recalculateAmountDiscountSimple = function recalculateAmountDiscountSimple(entity/* , data */) {
					// The formula is AMOUNT_GROSS times BAS_PAYMENT_TERM.DISCOUNT_PERCENT divided by 100
					// entity.AmountDiscount = (entity.AmountGross * data.DiscountPercent) / 100;
					// entity.AmountDiscountOc = entity.AmountDiscount * entity.ExchangeRate;
					// fix defect 83368 allow entering / modifing Discount Percent manually
					// entity.AmountDiscountOc = prcCommonCalculationHelper.round((entity.AmountGrossOc * data.DiscountPercent) / 100);
					// entity.AmountDiscount = prcCommonCalculationHelper.round(entity.ExchangeRate === 0 ? 0 : entity.AmountDiscountOc / entity.ExchangeRate);
					// entity.AmountDiscountOc = round(math.bignumber(entity.AmountGrossOc).mul(entity.PercentDiscount).div(100));
					entity.AmountDiscountOc = round(math.bignumber(entity.AmountDiscountBasisOc).mul(entity.PercentDiscount).div(100));
					entity.AmountDiscount = getNonOcByOc(entity.AmountDiscountOc, entity.ExchangeRate);
				};

				self.recalculateAmountBalance = function recalculateAmountBalance(entity) {
					self.recalculateAmountReconciliation(entity);
					var originAmountNetBalance = entity.AmountNetBalance;
					var originAmountGrossBalance = entity.AmountGrossBalance;
					// This field is always calculated as AMOUNT_GROSS - AMOUNT_NET – AMOUNT_VATPES
					// – AMOUNT_VATCONTRACT – AMOUNT_VATOTHER – AMOUNT_VATREJECT
					entity.AmountVatBalanceOc = round(math.subtract(entity.AmountVatOcReconciliation, (entity.FromBillingSchemaVatOc + entity.AmountVatPesOc + entity.AmountVatContractOc + entity.AmountVatOtherOc + entity.AmountVatRejectOc)));
					entity.AmountVatBalance = round(math.subtract(entity.AmountVatReconciliation, (entity.FromBillingSchemaVat + entity.AmountVatPes + entity.AmountVatContract + entity.AmountVatOther + entity.AmountVatReject)));

					entity.AmountVatBalanceOc = round(entity.AmountVatBalanceOc);
					entity.AmountVatBalance = round(entity.AmountVatBalance);

					// This field is calculated as AMOUNT_NET – AMOUNT_NETPES – AMOUNT_NETCONTRACT
					// – AMOUNT_NETOTHER – AMOUNT_NETREJECT
					entity.AmountNetBalanceOc = round(math.subtract(entity.AmountNetOcReconciliation, (entity.FromBillingSchemaNetOc + entity.AmountNetPesOc + entity.AmountNetContractOc + entity.AmountNetOtherOc + entity.AmountNetRejectOc)));
					entity.AmountNetBalance = round(math.subtract(entity.AmountNetReconciliation, (entity.FromBillingSchemaNet + entity.AmountNetPes + entity.AmountNetContract + entity.AmountNetOther + entity.AmountNetReject)));

					entity.AmountNetBalanceOc = round(entity.AmountNetBalanceOc);
					entity.AmountNetBalance = round(entity.AmountNetBalance);

					entity.AmountGrossBalanceOc = entity.AmountNetBalanceOc + entity.AmountVatBalanceOc;
					entity.AmountGrossBalance = entity.AmountNetBalance + entity.AmountVatBalance;

					if (originAmountNetBalance !== entity.AmountNetBalance || originAmountGrossBalance !== entity.AmountGrossBalance) {
						service.createOrDeleteWarning(entity);
					}
					dataService.fireAmountNetValueChanged(entity);// notify change to refresh Reconciliation
				};
				service.recalculateAmountBalance = self.recalculateAmountBalance;

				self.recalculateAmountReconciliation = function recalculateAmountReconciliation(entity) {
					var billSchemas = basicsLookupdataLookupDescriptorService.getData('PrcConfig2BSchema');
					var billingSchemaFk = entity.BillingSchemaFk;
					var billSchema = _.find(billSchemas, {Id: billingSchemaFk});
					entity.BillSchemeIsChained = billSchema ? billSchema.IsChained : false;
					if (billSchema && billSchema.IsChained) {
						entity.AmountGrossReconciliation = entity.TotalPerformedGross;
						entity.AmountNetReconciliation = entity.TotalPerformedNet;
						entity.AmountVatReconciliation = entity.TotalPerformedGross - entity.TotalPerformedNet;

						entity.AmountGrossOcReconciliation = entity.TotalPerformedGross * entity.ExchangeRate;
						entity.AmountNetOcReconciliation = entity.TotalPerformedNet * entity.ExchangeRate;
						entity.AmountVatOcReconciliation = prcCommonCalculationHelper.round(prcCommonCalculationHelper.round(entity.TotalPerformedGross * entity.ExchangeRate) - prcCommonCalculationHelper.round(entity.TotalPerformedNet * entity.ExchangeRate));
					} else {
						entity.AmountGrossReconciliation = entity.AmountGross;
						entity.AmountNetReconciliation = entity.AmountNet;
						entity.AmountVatReconciliation = entity.AmountGross - entity.AmountNet;

						entity.AmountGrossOcReconciliation = entity.AmountGross * entity.ExchangeRate;
						entity.AmountNetOcReconciliation = entity.AmountNet * entity.ExchangeRate;
						entity.AmountVatOcReconciliation = (entity.AmountGross - entity.AmountNet) * entity.ExchangeRate;
					}
				};

				function validateExchangeRate(entity, value, model) {
					var result = {apply: true, valid: true};

					runtimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					result = procurementCommonExchangerateFormatterService.test(value);
					if (!result.valid) {
						runtimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						if (!result.isZero) {
							return result;
						}
					}

					if (value) {
						entity.ExchangeRate = value || 0;
						self.onExchangeRateChange(entity);
					}

					return result;
				}

				service.asyncValidateExchangeRate = function (entity, value, model) {
					const defer = $q.defer();
					if (entity.ExchangeRate === value) {
						defer.resolve(true);
						return defer.promise;
					}
					var originalRate = entity.ExchangeRate;
					entity.ExchangeRate = value;
					if (entity.Version === 0 && value) {
						updateDialogAfterUpdateRateForNewEntity(entity, originalRate, entity.CurrencyFk);
						defer.resolve(true);
						return defer.promise;
					}
					return procurementCommonExchangerateValidateService.asyncModifyRate(entity, value, model, service, dataService, updateExchangeRateUrl, originalRate);
				};

				service.sumChainInvoice = function (model, invTypeFk, invHeaderFk) {
					var chainInvoices = basicsLookupdataLookupDescriptorService.getData('InvHeaderChained');
					if (null === chainInvoices) {
						return 0;
					}
					var chainInvoiceList = procurementInvoiceHeader2HeaderDataService.getList();
					chainInvoiceList = (chainInvoiceList && chainInvoiceList.length) ? _.filter(chainInvoiceList, {'InvHeaderFk': invHeaderFk}) : [];
					if (!chainInvoiceList || (chainInvoiceList && chainInvoiceList.length === 0)) {
						return 0;
					}
					var invTypes = basicsLookupdataLookupDescriptorService.getData('invtype');
					var isFicorrection = false;
					var sumChainInvoices;
					if (invTypeFk && invTypes) {
						var invType = _.find(invTypes, {Id: invTypeFk});
						if (invType) {
							isFicorrection = invType.IsFicorrection;
						}
					}
					if (isFicorrection) {
						var maxChianInvoice = _.maxBy(chainInvoiceList, 'InvHeaderChainedProgressId');
						var relatedChianInvoice = maxChianInvoice ? chainInvoices[maxChianInvoice.InvHeaderChainedFk] : null;
						sumChainInvoices = relatedChianInvoice ? relatedChianInvoice['TotalPerformed' + model] : 0;
					} else {
						sumChainInvoices = _.sumBy(chainInvoiceList, function (item) {
							var oneChain = chainInvoices[item.InvHeaderChainedFk];
							return oneChain ? oneChain['Amount' + model] : 0;
						});
					}
					return sumChainInvoices;
				};

				service.sumChainInvoiceObj = function (invTypeFk) {
					var returnObj = {Gross: 0, Net: 0};
					var chainInvoices = basicsLookupdataLookupDescriptorService.getData('InvHeaderChained');
					if (null === chainInvoices) {
						return 0;
					}
					var chainInvoiceList = procurementInvoiceHeader2HeaderDataService.getList();
					var invTypes = basicsLookupdataLookupDescriptorService.getData('invtype');
					var isFicorrection = false;
					if (invTypeFk && invTypes) {
						var invType = _.find(invTypes, {Id: invTypeFk});
						if (invType) {
							isFicorrection = invType.IsFicorrection;
						}
					}
					if (isFicorrection) {
						var maxChianInvoice = _.maxBy(chainInvoiceList, 'InvHeaderChainedProgressId');
						var relatedChianInvoice = maxChianInvoice ? chainInvoices[maxChianInvoice.InvHeaderChainedFk] : null;
						if (relatedChianInvoice) {
							_.forOwn(returnObj, function (value, key) {
								returnObj[key] = relatedChianInvoice['TotalPerformed' + key];
							});
						}
					} else {
						_.forEach(chainInvoiceList, function (item) {
							var oneChain = chainInvoices[item.InvHeaderChainedFk];
							if (oneChain) {
								_.forOwn(returnObj, function (value, key) {
									returnObj[key] += oneChain['Amount' + key];
								});
							}
						});
					}
					return returnObj;
				};

				service.validateAmountGross = function validateAmountGross(entity, value, model, options) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountGross = value;
					entity.AmountGrossOc = (options && _.has(options, 'AmountGrossOc')) ? options.AmountGrossOc : getOcByNonOc(value, entity.ExchangeRate);
					if (model) {
						let vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
						entity.AmountNetOc = getPreTaxByAfterTax(entity.AmountGrossOc, vatPercent);
						entity.AmountVatOc = round(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
						entity.AmountNet = getNonOcByOc(entity.AmountNetOc, entity.ExchangeRate);
						entity.AmountVat = round(math.bignumber(entity.AmountGross).sub(entity.AmountNet));
						let sumChainInvoices = service.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
						entity.TotalPerformedNet = round(math.bignumber(entity.AmountNet).add(sumChainInvoices));
						let sumGrossChainInvoices = service.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
						entity.TotalPerformedGross = round(math.bignumber(entity.AmountGross).add(sumGrossChainInvoices));
						self.updateDiscountBasics(entity);
						self.recalculateAmountBalance(entity);
						dataService.fireItemModified(entity);
					}

					service.removeError();
					return true;
				};

				service.validateTotalPerformedGross = function validateTotalPerformedGross(entity, value) {
					/*
                    if (entity.TaxCodeFk) {
                        lookupDataService.getItemByKey('TaxCode', entity.TaxCodeFk).then(function (data) {
                                if (angular.isObject(data)) {
                                    entity.TotalPerformedNet = prcCommonCalculationHelper.round(value/(100 + data.VatPercent) * 100);
                                    self.recalculateAmountBalance(entity);
                                    dataService.fireItemModified(entity);
                                }
                            },
                            function (error) {
                                window.console.error(error);
                            }
                        );
                    }
                    */
					var sumChainInvoices = service.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
					entity.AmountGross = round(math.bignumber(value).sub(sumChainInvoices));
					service.validateAmountGross(entity, entity.AmountGross, 'AmountGross');
					dataService.fireItemModified(entity);

				};

				service.validateTotalPerformedNet = function validateTotalPerformedNet(entity, value) {
					entity.TotalPerformedNet = value;
					self.recalculateAmountBalance(entity);
					let sumChainInvoices = service.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
					entity.AmountNet = round(math.bignumber(value).sub(sumChainInvoices));
					service.validateAmountNet(entity, entity.AmountNet);
					dataService.fireItemModified(entity);
				};

				service.validateAmountGrossOc = function validateAmountGrossOc(entity, value, model) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}
					// AMOUNT_GROSS has to be updated (AMOUNT_GROSS_OC / EXCHANGE_RATE)
					entity.AmountGrossOc = value;
					entity.AmountGross = getNonOcByOc(value, entity.ExchangeRate);
					service.validateAmountGross(entity, entity.AmountGross, 'AmountGross', {[model]: value});
					return true;
				};

				service.validateAmountNet = function (entity, value, model, options) {
					validateResult = platformDataValidationService.isMandatory(value, 'AmountNet');
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountNet = value;
					entity.AmountVat = round(math.bignumber(entity.AmountGross).sub(entity.AmountNet));
					entity.AmountNetOc = (options && _.has(options, 'AmountNetOc')) ? options.AmountNetOc : getOcByNonOc(entity.AmountNet, entity.ExchangeRate);
					entity.AmountVatOc = round(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
					/* no need to recalculate gross
					let vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					entity.AmountGrossOc = getAfterTaxByPreTax(entity.AmountNetOc, vatPercent);
					entity.AmountGross = getAfterTaxByPreTax(entity.AmountNet, vatPercent); */
					let sumChainInvoices = service.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
					entity.TotalPerformedNet = round(math.bignumber(value).add(sumChainInvoices));
					/* let sumGrossChainInvoices=service.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
					entity.TotalPerformedGross = round(math.bignumber(entity.AmountGross).add(sumGrossChainInvoices)); */
					self.updateDiscountBasics(entity);
					self.recalculateAmountBalance(entity);
					service.removeError();
					dataService.fireItemModified(entity);
					return true;
				};

				service.validateAmountNetOc = function validateAmountNetOc(entity, value, model) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountNetOc = value;
					entity.AmountVatOc = round(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
					// AMOUNT_NET has to be updated (AMOUNT_NET_OC / EXCHANGE_RATE)
					entity.AmountNet = getNonOcByOc(entity.AmountNetOc, entity.ExchangeRate);
					entity.AmountVat = round(math.bignumber(entity.AmountGross).sub(entity.AmountNet));
					service.validateAmountNet(entity, entity.AmountNet, 'AmountNet', {[model]: value});
					self.recalculateAmountBalance(entity);
					service.removeError();
					return true;
				};

				service.validateAmountDiscountBasis = function validateAmountDiscountBasis(entity, value) {
					validateResult = platformDataValidationService.isMandatory(value, 'AmountDiscountBasis');
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountDiscountBasisOc = getOcByNonOc(value, entity.ExchangeRate);
					self.recalculateAmountDiscount(entity, null);
					service.removeError();

					return true;
				};
				service.validateAmountDiscountBasisOc = function validateAmountDiscountBasisOc(entity, value, model) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}

					entity.AmountDiscountBasis = getNonOcByOc(value, entity.ExchangeRate);
					self.recalculateAmountDiscount(entity, null);
					service.removeError();
					return true;
				};

				service.validateAmountDiscount = function validateAmountDiscount(entity, value) {
					validateResult = platformDataValidationService.isMandatory(value, 'AmountDiscount');
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountDiscountOc = getOcByNonOc(value, entity.ExchangeRate);
					service.removeError();
					return true;
				};
				service.validateAmountDiscountOc = function validateAmountDiscount(entity, value, model) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}
					entity.AmountDiscount = getNonOcByOc(value, entity.ExchangeRate);
					service.removeError();
					return true;
				};

				service.validateProjectFk = function validateProjectFk(entity, value) {
					var clerkData = {
						prcStructureFk: entity.PrcStructureFk,
						projectFk: value,
						companyFk: entity.CompanyFk
					};
					if (value !== entity.ProjectFk && value) {
						// copy certificates from other modules such as project and material.
						var options = {
							url: 'procurement/invoice/certificate/copycertificatesfromproject',
							dataService: procurementInvoiceCertificateDataService,
							parameter: {InvHeaderId: entity.Id, PrjProjectId: value}
						};
						procurementInvoiceCertificateDataService.copyCertificatesFromOtherModule(options); // todo livia
						$http.get(globals.webApiBaseUrl + 'procurement/package/package/getpackagedefaultbyprojectfk?projectfk=' + value).then(function (response) {
							if (response.data !== 0) {
								entity.PrcPackageFk = response.data;
								dataService.fireItemModified(entity);
							}
						});
					}
					$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
						if (!_.isNil(response.data[0])) {
							entity.ClerkPrcFk = response.data[0];
						}
						if (!_.isNil(response.data[1])) {
							entity.ClerkReqFk = response.data[1];
						}

						dataService.fireItemModified(entity);
					});

					var oldControllingUnitFk = entity.ControllingUnitFk;
					if (!entity.ConHeaderFk && value) {
						entity.ProjectFk = value;
						$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
							if (res[0] !== '' && res[0] !== null) {
								entity.ControllingUnitFk = res[0];
							}
							validateCurrencyFk(entity, {CurrencyFk: entity.CurrencyFk});
						});

					} else {
						if (!value) {
							entity.ControllingUnitFk = null;
						} else {
							$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
								if (res[0] !== '' && res[0] !== null) {
									entity.ControllingUnitFk = res[0];
								}
								validateCurrencyFk(entity, {CurrencyFk: entity.CurrencyFk});
							});
						}
					}

					dataService.getDescriptionAsync(entity, {ProjectFk: value}).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});

					projectStatus(entity, value);

					return projectValidatorService.projectValidator(entity, value);
				};

				self.onValidatePrcPackageFk = function (entity, value, model, fireEvent) {
					return projectValidatorService.prcPackageValidator(entity, value, model, fireEvent);
				};
				service.validatePrcPackageFk = function (entity, value, model) {
					return self.onValidatePrcPackageFk(entity, value, model, entity.ConHeaderFk);
				};
				// service.validateControllingUnitFk = projectValidatorService.controllingUnitValidator;
				service.validateControllingUnitFk = function (entity, value) {
					if (!entity) {
						return true;
					}

					if (entity.InvStatusFk) {
						var invStatus = _.find(basicsLookupdataLookupDescriptorService.getData('invstatus'), {Id: entity.InvStatusFk});
						/** @namespace invStatus.ToBeVerifiedBL */
						if (invStatus.ToBeVerifiedBL && !value) {
							return self.checkMandatory(entity, value, 'ControllingUnitFk', true, {
								fieldName: $translate.instant('cloud.common.entityControllingUnit')
							});
						}
					}

					// if (entity.ControllingUnitFk !== value) {
					//     var options = {
					//         bodyTextKey: $translate.instant('procurement.invoice.yesNoDialogQuestion'),
					//         showYesButton: true,
					//         showNoButton: true,
					//         iconClass: 'ico-question'
					//     };
					//
					//     platformModalService.showDialog(options).then(function (response) {
					//         if (response.yes === true) {
					//             SetControllingUnit(entity, value);
					//         }
					//     });
					// }
					return true;
				};

				service.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model, isFromConHeader) {
					if (entity.InvStatusFk) {
						var invStatus = _.find(basicsLookupdataLookupDescriptorService.getData('invstatus'), {Id: entity.InvStatusFk});
						/** @namespace invStatus.ToBeVerifiedBL */
						if (invStatus.ToBeVerifiedBL && !value) {
							return self.checkMandatory(entity, value, 'PrcStructureFk', true, {
								fieldName: $translate.instant('cloud.common.entityStructure')
							});
						}
					}

					if (isFromConHeader) {
						return true;
					}

					var clerkData = {
						prcStructureFk: value,
						projectFk: entity.ProjectFk,
						companyFk: entity.CompanyFk
					};
					if (value) {
						$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value).then(function (response) {
							if (response.data) {
								var taxCodeFk = response.data;
								service.validateTaxCodeFk(entity, taxCodeFk, 'TaxCodeFk', true);
							}
						});
					}

					if (!value || entity.Description) {
						$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
							if (!_.isNil(response.data[0])) {
								entity.ClerkPrcFk = response.data[0];
							}
							if (!_.isNil(response.data[1])) {
								entity.ClerkReqFk = response.data[1];
							}
							dataService.fireItemModified(entity);
						});
						return true;
					}

					// If also no package is referenced, then the name of the
					// first PRC_STRUCTURE referenced is copied.
					lookupDataService.getItemByKey('Prcstructure', value).then(function (data) {
							if (angular.isObject(data)) {
								entity.Description = data.DescriptionInfo.Translated;
								$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
									if (!_.isNil(response.data[0])) {
										entity.ClerkPrcFk = response.data[0];
									}
									if (!_.isNil(response.data[1])) {
										entity.ClerkReqFk = response.data[1];
									}
								});
								dataService.fireItemModified(entity);
							}
						},
						function (error) {
							window.console.error(error);
						}
					);
					return true;
				};

				self.setDateDiscount = function setDateDiscount(entity, paymentTermFk, dateReceived, recuclateDiscount) {
					var defer = $q.defer();
					if (!paymentTermFk) {
						self.refresh(entity);
						defer.resolve(true);
					} else {
						lookupDataService.getItemByKey('PaymentTerm', paymentTermFk).then(function (data) {
								if (angular.isObject(data)) {
									entity.PercentDiscount = data.DiscountPercent;

									if (recuclateDiscount) {
										self.recalculateAmountDiscountSimple(entity, data);
									}
									// //Stays NULL if BAS_PAYMENT_TERM.DISCOUNT_DAYS = 0 or BAS_PAYMENT_TERM.DISCOUNT_PERCENT = 0.
									// //Can be modified by the user.
									// if (data.DiscountDays === 0 || data.DiscountPercent === 0) {
									//     entity.DateDiscount = null;
									//     entity.DateNetPayable = entity.DateReceived.clone().add(data.NetDays, 'd');
									//
									// } else {
									//     //The formula is DATE_RECEIVED + BAS_PAYMENT_TERM.DISCOUNT_DAYS
									//     entity.DateDiscount = entity.DateReceived.clone().add(data.DiscountDays, 'd');
									//     entity.DateNetPayable = entity.DateReceived.clone().add(data.NetDays, 'd');
									// }
									paymentTermCalculationService.calculateDate(entity, data);

									self.refresh(entity);

									if (entity.DateNetPayable < entity.DateDiscount) {
										defer.resolve({
											apply: false,
											valid: false,
											error: '...',
											error$tr$: 'procurement.invoice.error.dateNetPayableError'
										});
									} else {
										defer.resolve(true);
									}
								}
							},
							function (error) {
								window.console.error(error);
							}
						);
					}
					return defer.promise;
				};

				service.asyncValidatePaymentTermFk = function validatePaymentTermFk(entity, value) {
					return self.setDateDiscount(entity, value, entity.DateReceived, true);
				};

				service.asyncValidateDateReceived = function validateDateReceived(entity, value) {
					entity.DateReceived = value;
					return self.setDateDiscount(entity, entity.PaymentTermFk, value);
				};

				service.asyncValidateDateInvoiced = function (entity, value) {
					entity.DateInvoiced = value;
					return self.setDateDiscount(entity, entity.PaymentTermFk);
				};

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value) {

					self.checkMandatory(entity, value, 'TaxCodeFk', true, {
						fieldName: $translate.instant('cloud.common.entityTaxCode')
					});

					if (!entity || !value) {
						return true;
					}
					if (entity.TaxCodeFk !== value) {
						entity.TaxCodeFk = value;
						recalculateAmountAfChangeVatPercent(entity);
					}
					let commonMatrixValidationService = $injector.get('procurementCommonMatrixValidationService');
					commonMatrixValidationService.asyncValidateTaxCodeFk(dataService,entity,value,'TaxCodeFk');
					return true;
				};

				service.validatePesHeaderFk = function validatePesHeaderFk(entity, value) {
					dataService.getDescriptionAsync(entity, {PesHeaderFk: value}).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});

					if (!value) {
						platformRuntimeDataService.readonly(entity, [{field: 'SalesTaxMethodFk', readonly: entity.ConHeaderFk !== null}]);
						dataService.clearPesEntity.fire(null, [entity.PesHeaderFk]);
						return true;
					}

					entity.PesHeaderFk = value;
					lookupDataService.getItemByKey('InvoicePes', value).then(function (data) {
							platformRuntimeDataService.readonly(entity, [{field: 'SalesTaxMethodFk', readonly: true}]);
							if (!angular.isObject(data)) {
								return;
							}
							entity.SalesTaxMethodFk = data.SalesTaxMethodFk;

							if (data.ConHeaderFk) {
								entity.ConHeaderFk = data.ConHeaderFk;
								var conHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: data.ConHeaderFk});
								if (!angular.isObject(conHeaderView)) {
									basicsLookupdataLookupDescriptorService.loadItemByKey('ConHeaderView', data.ConHeaderFk).then(function (resdata) {
										if (resdata && resdata.ConHeaderFk && !resdata.ProjectChangeFk) {
											entity.ConHeaderFk = resdata.ConHeaderFk;
										}
										entity.SalesTaxMethodFk = resdata.SalesTaxMethodFk;
										service.asyncValidateConHeaderFk(entity, entity.ConHeaderFk).then(function () {
											dataService.autoCreateInvoiceToPES.fire(value);
										});
									});
								} else {
									entity.ConHeaderFk = (conHeaderView.ConHeaderFk && !conHeaderView.ProjectChangeFk) ? conHeaderView.ConHeaderFk : entity.ConHeaderFk;
									service.asyncValidateConHeaderFk(entity, entity.ConHeaderFk).then(function () {
										if (entity.Id !== undefined) {
											dataService.autoCreateInvoiceToPES.fire(value);
										}
									});
									entity.SalesTaxMethodFk = conHeaderView.SalesTaxMethodFk;
								}
							} else {
								if (entity.Id !== undefined) {
									dataService.autoCreateInvoiceToPES.fire(value);
								}
							}
							// var processDataExtend = new ServiceDataProcessDatesExtension(['DateDelivered', 'DateDeliveredfrom']);
							// processDataExtend.processItem(data);

						},
						function (error) {
							window.console.error(error);
						}
					);

					return true;
				};

				service.updatePaymentTermFkAndRelatedProperties = function (entity, conHeaderEntity) {
					invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
					// var curBillingSchema = _.find(billingSchemas, {Id: entity.BillingSchemaFk});
					if (invTypeItem && conHeaderEntity && entity.PrcConfigurationFk) {
						var paymentTermFk = invTypeItem.IsProgress ? conHeaderEntity.PaymentTermPaFk : conHeaderEntity.PaymentTermFiFk;
						// var paymentTermFk = curBillingSchema.IsChained ? data.PaymentTermPaFk : data.PaymentTermFiFk;
						if (paymentTermFk) {
							service.asyncValidatePaymentTermFk(entity, paymentTermFk).then(function () {
								entity.PaymentTermFk = paymentTermFk;
								dataService.fireItemModified(entity);
							});
						}
					}
				};

				service.initPaymentTermFkWhenInvoiceIsNewlyCreteated = function (entity, configurationEntity) {
					invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
					if (invTypeItem && configurationEntity) {
						var paymentTermFk = invTypeItem.IsProgress ? configurationEntity.PaymentTermPaFk : configurationEntity.PaymentTermFiFk;
						if (paymentTermFk) {
							service.asyncValidatePaymentTermFk(entity, paymentTermFk).then(function () {
								entity.PaymentTermFk = paymentTermFk;
								dataService.fireItemModified(entity);
							});
						}
					}
				};

				service.updatePaymentTermFkBySupplier = function (entity, supplier) {
					invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
					if (invTypeItem && supplier && !entity.ConHeaderFk && entity.PrcConfigurationFk) {
						if (!_.isNil(supplier)) {
							$http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + supplier.Id)
								.then(function (response) {
									var paymentTermFk = null;
									var context = platformContextService.getContext();
									var companyId = context.clientId;
									var supplierWithSameCompany = _.filter(response.data, function (d) {
										return d.BasCompanyFk === companyId;
									});
									var companyPaymentTermFieldFk = invTypeItem.IsProgress ? 'BasPaymentTermPaFk' : 'BasPaymentTermFiFk';
									var paymentTermFieldFk = invTypeItem.IsProgress ? 'PaymentTermPaFk' : 'PaymentTermFiFk';
									if (supplierWithSameCompany.length && response.data && response.data.length > 0) {
										var supplierCompany = _.orderBy(supplierWithSameCompany, ['Id']);
										if (supplierCompany[0][companyPaymentTermFieldFk] !== null) { // jshint ignore:line
											paymentTermFk = supplierCompany[0][companyPaymentTermFieldFk];// jshint ignore:line
										} else if (supplier[paymentTermFieldFk] !== null) {// jshint ignore:line
											paymentTermFk = supplier[paymentTermFieldFk];// jshint ignore:line
										}
										// payment method
										if (supplierCompany[0].BasPaymentMethodFk !== null) { // jshint ignore:line
											entity.BasPaymentMethodFk = supplierCompany[0].BasPaymentMethodFk;// jshint ignore:line
										} else if (supplier.BasPaymentMethodFk !== null) {
											entity.BasPaymentMethodFk = supplier.BasPaymentMethodFk;
										}
									} else {
										if (supplier[paymentTermFieldFk] !== null) {// jshint ignore:line
											paymentTermFk = supplier[paymentTermFieldFk];// jshint ignore:line
										}
										if (supplier.BasPaymentMethodFk !== null) {
											entity.BasPaymentMethodFk = supplier.BasPaymentMethodFk;
										}
									}
									dataService.fireItemModified(entity);
									if (paymentTermFk) {
										service.asyncValidatePaymentTermFk(entity, paymentTermFk).then(function () {
											entity.PaymentTermFk = paymentTermFk;
											dataService.fireItemModified(entity);
										});
									}

								});

						}

					}
				};

				service.updatePaymentTermFkByPrcConfiguration = function (entity, prcConfiguration) {
					invTypeItem = _.find(invTypes, {Id: entity.InvTypeFk});
					if (invTypeItem && !entity.ConHeaderFk && !entity.SupplierFk) {
						var paymentTermFk = invTypeItem.IsProgress ? prcConfiguration.PaymentTermPaFk : prcConfiguration.PaymentTermFiFk;
						if (paymentTermFk) {
							service.asyncValidatePaymentTermFk(entity, paymentTermFk).then(function () {
								entity.PaymentTermFk = paymentTermFk;
								dataService.fireItemModified(entity);
							});
						}
					}
				};

				// ControllingUnitFk
				service.asyncValidateControllingUnitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						defer.resolve(true);
					} else {
						if (!entity.ProjectFk) {
							basicsLookupdataLookupDescriptorService.loadItemByKey('ControllingUnit', value).then(function (res) {
								var projectFk = res && res.PrjProjectFk;
								if (projectFk) {
									if (entity.ProjectFk !== projectFk) {
										projectStatus(entity, projectFk);
									}
									entity.ProjectFk = projectFk;
									dataService.fireItemModified(entity);
								}
							});
						}
						defer.resolve(true);
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.asyncValidateConHeaderFk = function asyncValidateConHeaderFk(entity, value) {
					isContractBank = true;
					if (!value) {
						return service.clearConHeaderFk(entity, value);
					}
					let conHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: value});
					if (!angular.isObject(conHeaderView)) {
						return $q.resolve(null);
					}

					entity.ConHeaderFk = value;
					let processingDeferred = $q.defer();
					if (conHeaderView.PrcConfigHeaderFk) {
						lookupDataService.getSearchList('prcconfiguration', `PrcConfigHeaderFk=${conHeaderView.PrcConfigHeaderFk} And RubricFk=${moduleContext.invoiceRubricFk}`).then(
							function (dataList) {
								if (dataList && dataList.length > 0) {

									$timeout(function () {
										platformRuntimeDataService.readonly(entity, [{field: 'BillingSchemaFk', readonly: true}]);
									}, 1000);

									service.handleConHeaderFk(entity, conHeaderView, value);
									service.asyncSetPrcConfigFkAndBillingSchemaFk(entity, getDefalutID(dataList), conHeaderView.MdcBillingSchemaFk, dataList).then(function () {
										service.updatePaymentTermFkAndRelatedProperties(entity, conHeaderView);
										dataService.autoCreateChainedInvoice.fire(value, conHeaderView.BusinessPartnerFk);
										dataService.onCopyInvGenerals.fire(null, {
											PrcHeaderId: conHeaderView.PrcHeaderId,
											Code: conHeaderView.Code,
											Description: conHeaderView.Description
										});
										processingDeferred.resolve(true);
									});
								} else {
									service.clearConHeaderFk(entity, null);
									platformModalService.showDialog({
											bodyText: $translate.instant('procurement.invoice.error.noConfiguration'),
											iconClass: 'ico-error'
										}
									);
									processingDeferred.resolve({apply: false, valid: true, error: ''});
								}
							});
					} else {
						service.handleConHeaderFk(entity, conHeaderView, value);
						service.validateProgressId(entity, conHeaderView, 'ProgressId', false);// change progress id
						service.updatePaymentTermFkAndRelatedProperties(entity, conHeaderView);
						dataService.autoCreateChainedInvoice.fire(value, conHeaderView.BusinessPartnerFk);
						dataService.onCopyInvGenerals.fire(null, {
							PrcHeaderId: conHeaderView.PrcHeaderId,
							Code: conHeaderView.Code,
							Description: conHeaderView.Description
						});
						processingDeferred.resolve(true);
					}

					return processingDeferred.promise;
				};

				service.handleConHeaderFk = function (entity, conHeaderView, value) {

					dataService.getDescriptionAsync(entity, {ConHeaderFk: value}).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});

					var statusWithEditRight = true;
					var invStatusEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRight');
					if (invStatusEditRight) {
						statusWithEditRight = _.find(invStatusEditRight, {Id: entity.InvStatusFk});
					}
					var suppliers = basicsLookupdataLookupDescriptorService.getData('Supplier') || {};
					if (!entity.BusinessPartnerFk && conHeaderView.BusinessPartnerFk) {
						var pointedSupplierFk = conHeaderView.BpdSupplierFk ? conHeaderView.BpdSupplierFk : null;
						var pointedSubsidiaryFk = conHeaderView.BpdSubsidiaryFk ? conHeaderView.BpdSubsidiaryFk : null;
						service.asyncValidateBusinessPartnerFk(entity, conHeaderView.BusinessPartnerFk, 'BusinessPartnerFk', undefined, true, true, pointedSupplierFk, pointedSubsidiaryFk).then(function () {
							$timeout(function () {
								entity.BusinessPartnerFk = conHeaderView.BusinessPartnerFk;
								entity.ContactFk = conHeaderView.BpdContactFk;
								entity.SubsidiaryFk = conHeaderView.BpdSubsidiaryFk;
								entity.SupplierFk = conHeaderView.BpdSupplierFk;
								asyncGetSupplierById(suppliers, entity.SupplierFk).then(function (theSupplier) {
									if (theSupplier !== undefined && theSupplier.BasPaymentMethodFk) {
										entity.BasPaymentMethodFk = theSupplier.BasPaymentMethodFk;
									}
									platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: !statusWithEditRight}]);
									service.validateBusinessPartnerFk(entity, conHeaderView.BusinessPartnerFk, 'BusinessPartnerFk', true);
									resetVatGroupAndPostingGroupBySupplier(entity, entity.SupplierFk, !conHeaderView.BpdVatGroupFk, true);
									dataService.fireItemModified(entity);
								});
							}, 1000);
						});
					} else if (conHeaderView.BpdSupplierFk) {
						entity.SupplierFk = conHeaderView.BpdSupplierFk;
						asyncGetSupplierById(suppliers, entity.SupplierFk).then(function (theSupplier) {
							if (theSupplier !== undefined && theSupplier.BasPaymentMethodFk) {
								entity.BasPaymentMethodFk = theSupplier.BasPaymentMethodFk;
							}
							platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: !statusWithEditRight}]);
							resetVatGroupAndPostingGroupBySupplier(entity, entity.SupplierFk, !conHeaderView.BpdVatGroupFk, true);
							dataService.fireItemModified(entity);
						});
					}

					if (conHeaderView.BpdVatGroupFk) {
						service.validateBpdVatGroupFk(entity, conHeaderView.BpdVatGroupFk);
					}

					if (!entity.ProjectFk && conHeaderView.ProjectFk) {
						if (conHeaderView.ProjectFk !== entity.ProjectFk) {
							projectStatus(entity, conHeaderView.ProjectFk);
						}
						entity.ProjectFk = conHeaderView.ProjectFk;
					}
					if (!entity.PrcPackageFk && conHeaderView.PrcPackageFk) {
						self.onValidatePrcPackageFk(entity, conHeaderView.PrcPackageFk, 'PrcPackageFk', false);
					}
					if (!entity.ControllingUnitFk && conHeaderView.ControllingUnitFk) {
						entity.ControllingUnitFk = conHeaderView.ControllingUnitFk;
						service.asyncValidateControllingUnitFk(entity, conHeaderView.ControllingUnitFk, 'ControllingUnitFk');
					} else if (entity.PesHeaderFk) {
						var pesHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('InvoicePes'), {Id: entity.PesHeaderFk});
						if (pesHeaderView && pesHeaderView.ControllingUnitFk) {
							entity.ControllingUnitFk = pesHeaderView.ControllingUnitFk;
							service.asyncValidateControllingUnitFk(entity, conHeaderView.ControllingUnitFk, 'ControllingUnitFk');
						}
					}
					if (!entity.PrcStructureFk && conHeaderView.PrcStructureFk) {
						service.validatePrcStructureFk(entity, conHeaderView.PrcStructureFk, 'PrcStructureFk', true);
						entity.PrcStructureFk = conHeaderView.PrcStructureFk;
					}

					entity.ClerkPrcFk = conHeaderView.ClerkPrcFk;
					entity.ClerkReqFk = conHeaderView.ClerkReqFk;
					entity.SalesTaxMethodFk = conHeaderView.SalesTaxMethodFk;

					if (conHeaderView.TaxCodeFk) {
						// entity.TaxCodeFk = data.TaxCodeFk;
						service.validateTaxCodeFk(entity, conHeaderView.TaxCodeFk);
					}

					if (conHeaderView.CurrencyFk) {
						// entity.CurrencyFk = data.CurrencyFk;
						validateCurrencyFk(entity, {CurrencyFk: conHeaderView.CurrencyFk});
					}

					procurementInvoiceCertificateDataService.copyAndUpdateCertificates(conHeaderView, value);
					if (entity.Id !== 0 && entity.Id !== undefined) {
						procurementInvoiceAccountAssignmentDataService.copyAccountAssignmentFromNewContract(entity.Id, value);
						procurementInvoiceAccountAssignmentDataService.updateTools(value);
					}

					if (value) {
						entity.ContractOrderDate = moment.utc(conHeaderView.DateOrdered);
						entity.ConStatusFk = conHeaderView.ConStatusFk;
						var requests = [];
						if (entity.id === null || entity.id === undefined) {
							var request0 = $http.get(globals.webApiBaseUrl + 'procurement/invoice/header/calculateByConHeader?conheaderId=' + value);
							requests.push(request0);
						} else {
							var request1 = $http.get(globals.webApiBaseUrl + 'procurement/invoice/header/calculateByConHeader?invoiceId=' + entity.Id + '&conheaderId=' + value);
							requests.push(request1);
						}

						var request2 = $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + value);
						requests.push(request2);
						if (conHeaderView) {
							if (conHeaderView.ConHeaderFk !== null && conHeaderView.ProjectChangeFk === null) {
								var request3 = $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + conHeaderView.ConHeaderFk);
								requests.push(request3);
							}
						}
						$q.all(requests).then(function (response) {
							if (response[0]) {
								var data = response[0].data;
								entity.ContractTotal = data.ContractTotal;
								entity.ContractChangeOrder = data.ContractChangeOrder;
								entity.Invoiced = data.Invoiced;
								entity.Percent = data.Percent;

								entity.ContractTotalGross = data.ContractTotalGross;
								entity.ContractChangeOrderGross = data.ContractChangeOrderGross;
								entity.InvoicedGross = data.InvoicedGross;
								entity.GrossPercent = data.GrossPercent;
							}
							if (response[1]) {
								var baseContractEntity = response[1].data;
								isContractBank = false;
								entity.BasAccassignBusinessFk = baseContractEntity.BasAccassignBusinessFk;
								entity.BasAccassignControlFk = baseContractEntity.BasAccassignControlFk;
								entity.BasAccassignAccountFk = baseContractEntity.BasAccassignAccountFk;
								entity.BasAccassignConTypeFk = baseContractEntity.BasAccassignConTypeFk;
								if (baseContractEntity.BankFk) {
									entity.BankFk = baseContractEntity.BankFk;
									service.validateBankFk(entity, entity.BankFk);
								} else {
									procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, baseContractEntity.BusinessPartnerFk);
								}
							}
							if (response[2]) {
								var callOffContract = response[2].data;
								if (callOffContract) {
									entity.CallOffMainContractFk = callOffContract.Id;
									entity.CallOffMainContract = callOffContract.Code;
									entity.CallOffMainContractDes = callOffContract.Description;
								}
							}
							dataService.fireItemModified(entity);
						});
					}
					dataService.fireItemModified(entity);
					dataService.updateReadOnly(entity);
				};

				service.clearConHeaderFk = function (entity, value) {
					dataService.clearContractEntity.fire(null, [entity.ConHeaderFk]);
					entity.ConHeaderFk = value;
					entity.ContractOrderDate = null;
					entity.ConStatusFk = 0;
					entity.ContractTotal = 0;
					entity.ContractChangeOrder = 0;
					entity.Invoiced = 0;
					entity.Percent = '0%';

					entity.ContractTotalGross = 0;
					entity.ContractChangeOrderGross = 0;
					entity.InvoicedGross = 0;
					entity.GrossPercent = '0%';
					var billSchemas = basicsLookupdataLookupDescriptorService.getData('PrcConfig2BSchema');
					var oldBillingSchema = _.find(billSchemas, {Id: entity.BillingSchemaFk});
					entity.ProgressId = oldBillingSchema && oldBillingSchema.IsChained ? 1 : 0;

					dataService.fireItemModified(entity);
					dataService.updateReadOnly(entity);
					procurementInvoiceAccountAssignmentDataService.updateTools(value);
					dataService.autoDeleteChainedInvoice.fire();
					entity.TotalPerformedGross = entity.AmountGross;
					entity.TotalPerformedNet = entity.AmountNet;
					entity.CallOffMainContractFk = null;
					entity.CallOffMainContract = '';
					entity.CallOffMainContractDes = '';

					procurementInvoiceCertificateDataService.deleteAll();
					return $q.resolve([]);
				};

				service.validateDateDiscount = function (entity, value, model) {
					if (!value) {
						return true;
					}
					var result = {
						apply: false,
						valid: false,
						error: '...',
						error$tr$: 'procurement.invoice.error.dateNetPayableError'
					};
					// Validation has to be added that DATE_NETPAYABLE > DATE_DISCOUNT
					if (entity.DateNetPayable && value > entity.DateNetPayable) {
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						result.apply = true;
						result.valid = true;
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}
					return result;
				};
				service.validateDateNetPayable = function (entity, value, model) {
					validateResult = platformDataValidationService.isMandatory(value, model);
					if (!validateResult.valid) {
						return validateResult;
					}
					// Validation has to be added that DATE_NETPAYABLE > DATE_DISCOUNT
					if (entity.DateDiscount && value < entity.DateDiscount) {
						return {
							apply: false,
							valid: false,
							error: '...',
							error$tr$: 'procurement.invoice.error.dateNetPayableError'
						};
					}

					return true;

				};

				service.validateInvTypeFk = function (entity, value, model, fireEvent) {

					var oldValue = entity.InvTypeFk;
					entity.InvTypeFk = value;
					// entity.Description = dataService.getDescription(entity);
					if (entity.ConHeaderFk && fireEvent === undefined) {
						dataService.autoCreateChainedInvoice.fire();
					}
					if (entity.ConHeaderFk && !self.checkIsProgress(oldValue, value)) {
						$http.get(globals.webApiBaseUrl + 'procurement/contract/conheaderlookup/getitembykey?id=' + entity.ConHeaderFk).then(function (response) {
							service.updatePaymentTermFkAndRelatedProperties(entity, response.data);
						});
					} else if (entity.SupplierFk && !self.checkIsProgress(oldValue, value)) {
						lookupDataService.getItemByKey('supplier', entity.SupplierFk).then(function (response) {
							service.updatePaymentTermFkBySupplier(entity, response);
						});
					} else if (!self.checkIsProgress(oldValue, value)) {
						$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getConfigHeaderById?configurationFk=' + entity.PrcConfigurationFk).then(function (response) {
							service.updatePaymentTermFkByPrcConfiguration(entity, response.data);
						});
					}

					if (value) {
						invTypes = basicsLookupdataLookupDescriptorService.getData('invtype');
						var invType = _.find(invTypes, {Id: value});
						if (invType && !invType.IsProgress) {
							var companyDeferalTypes = basicsLookupdataLookupDescriptorService.getData('companydeferaltype');
							var companyDeferalType = null;
							if (companyDeferalTypes && entity.CompanyFk) {
								companyDeferalType = _.find(companyDeferalTypes, {BasCompanyFk: entity.CompanyFk, IsDefault: true});
								if (companyDeferalType) {
									service.validateCompanyDeferalTypeFk(entity, companyDeferalType.Id);
								}
							}
						} else {
							entity.CompanyDeferalTypeFk = null;
							entity.DateDeferalStart = null;
						}
						if (invType) {
							var sumChainInvoiceObj = service.sumChainInvoiceObj(value);
							entity.TotalPerformedGross = round(math.bignumber(entity.AmountGross).add(sumChainInvoiceObj.Gross));
							entity.TotalPerformedNet = round(math.bignumber(entity.AmountNet).add(sumChainInvoiceObj.Net));
						}
					}
					dataService.updateReadOnly(entity);

					// change description
					// entity.Description = dataService.getDescription(entity);
					// dataService.fireItemModified(entity);

					dataService.getDescriptionAsync(entity).then(function (desc) {
						entity.Description = desc;
						dataService.fireItemModified(entity);
					});
				};

				service.validatePaymentHint = function (entity, value, model) {
					var result = {apply: true, valid: true};
					if (value) {
						var user = /^[A-Za-z]+$/;
						if (!value.match(user)) {
							result = false;
						}

						if (value.length > 3) {
							result = false;
						}
						value = value.toUpperCase();
						entity.PaymentHint = value;
					}

					if (!result) {
						result = {
							apply: false,
							error: $translate.instant('procurement.invoice.error.paymentHintError'),
							valid: false
						};
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.recalcuteContract = function recalcuteContract(netOc, net, grossOc, gross) {
					var selectedHeader = dataService.getSelected();
					if (!selectedHeader || !selectedHeader.Id) {
						return;
					}
					var vatOc = round(math.bignumber(grossOc).sub(netOc));
					var vat = round(math.bignumber(gross).sub(net));
					selectedHeader.AmountNetContractOc = round(netOc);
					selectedHeader.AmountVatContractOc = round(vatOc);
					selectedHeader.AmountGrossContractOc = round(grossOc);

					selectedHeader.AmountNetContract = round(net);
					selectedHeader.AmountVatContract = round(vat);
					selectedHeader.AmountGrossContract = round(gross);
					self.recalculateAmountBalance(selectedHeader);
					dataService.markCurrentItemAsModified();
				};

				service.recalcuteOther = function recalcuteOther(netOc, net, grossOc, gross) {
					var selectedHeader = dataService.getSelected();
					if (!selectedHeader || !selectedHeader.Id) {
						return;
					}
					var vatOc = round(math.bignumber(grossOc).sub(netOc));
					var vat = round(math.bignumber(gross).sub(net));
					selectedHeader.AmountNetOtherOc = round(netOc);
					selectedHeader.AmountVatOtherOc = round(vatOc);
					selectedHeader.AmountGrossOtherOc = round(grossOc);

					selectedHeader.AmountNetOther = round(net);
					selectedHeader.AmountVatOther = round(vat);
					selectedHeader.AmountGrossOther = round(gross);
					self.recalculateAmountBalance(selectedHeader);
					dataService.markCurrentItemAsModified();
				};

				service.recalcuteReject = function recalcuteReject(netOc, vatOc) {
					var selectedHeader = dataService.getSelected();
					if (!selectedHeader || !selectedHeader.Id) {
						return;
					}
					selectedHeader.AmountNetRejectOc = round(netOc);
					selectedHeader.AmountVatRejectOc = round(vatOc);
					selectedHeader.AmountGrossRejectOc = round(math.bignumber(selectedHeader.AmountNetRejectOc).add(selectedHeader.AmountVatRejectOc));

					selectedHeader.AmountNetReject = getNonOcByOc(netOc, selectedHeader.ExchangeRate);
					selectedHeader.AmountVatReject = getNonOcByOc(vatOc, selectedHeader.ExchangeRate);
					selectedHeader.AmountGrossReject = round(math.bignumber(selectedHeader.AmountNetReject).add(selectedHeader.AmountVatReject));
					self.recalculateAmountBalance(selectedHeader);
					dataService.markCurrentItemAsModified();
				};

				service.recalculateFromPes = function recalculateFromPes(pesValueOc, pesVatOc) {
					var currentItem = dataService.getSelected();
					if (!currentItem || !currentItem.Id) {
						return;
					}
					currentItem.AmountNetPesOc = round(pesValueOc);
					currentItem.AmountVatPesOc = round(pesVatOc);
					currentItem.AmountGrossPesOc = round(math.bignumber(pesValueOc).add(pesVatOc));

					currentItem.AmountNetPes = getNonOcByOc(pesValueOc, currentItem.ExchangeRate);
					currentItem.AmountVatPes = getNonOcByOc(pesVatOc, currentItem.ExchangeRate);
					currentItem.AmountGrossPes = round(math.bignumber(currentItem.AmountNetPes).add(currentItem.AmountVatPes));
					self.recalculateAmountBalance(currentItem);
					dataService.markCurrentItemAsModified();
				};

				var onEntityCreated = function onEntityCreated(e, item) {
					if (item.TaxCodeFk) {
						self.recalculateAmountNetOc(item);
					}

					// service.validateCurrencyFk(item, item.CurrencyFk); if created, the BAS_COMPANY.BAS_CURRENCY_FK is equal to INV_HEADER.BAS_CURRENCY_FK, the exchanageRate is 1, it do not need to calculate
					if (item.PaymentTermFk) {
						service.asyncValidatePaymentTermFk(item, item.PaymentTermFk);
					}
					if (item.BillingSchemaFk) {
						dataService.BillingSchemaChanged.fire(null, item);
					}
				};

				service.validatePercentDiscount = function recalculateFromPercentDiscount(entity, value/* , model */) {
					if (value !== undefined && value !== null) {
						entity.PercentDiscount = value;
						self.recalculateAmountDiscount(entity, null);
					}
				};

				service.validateCompanyDeferalTypeFk = function validateCompanyDeferalTypeFk(entity, value) {
					if (!value) {
						entity.DateDeferalStart = null;
						entity.CompanyDeferalTypeFk = null;
						dataService.fireItemModified(entity);
						service.validateDateDeferalStart(entity, entity.DateDeferalStart, 'DateDeferalStart');
						return;
					}
					var companydeferaltype = _.find(basicsLookupdataLookupDescriptorService.getData('companydeferaltype'), {Id: value});
					entity.CompanyDeferalTypeFk = companydeferaltype.Id;
					if (companydeferaltype && companydeferaltype.IsStartDateMandatory) {
						var currentYear = entity.DatePosted.year();
						var currentMonth = entity.DatePosted.month() + 1;
						var lastDate = new Date(entity.DatePosted.year(), entity.DatePosted.month() + 1, 0).getDate();
						entity.DateDeferalStart = moment.utc(moment.utc(currentYear + '-' + currentMonth + '-' + lastDate).format('YYYY-MM-DDTHH:mm:ssZ'));
					} else {
						entity.DateDeferalStart = null;
					}
					service.validateDateDeferalStart(entity, entity.DateDeferalStart, 'DateDeferalStart');
					dataService.fireItemModified(entity);
				};

				service.validateDateDeferalStart = function validateDateDeferalStart(entity, value, model) {
					var companydeferaltype = _.find(basicsLookupdataLookupDescriptorService.getData('companydeferaltype'), {Id: entity.CompanyDeferalTypeFk});
					var result;
					if (companydeferaltype && companydeferaltype.IsStartDateMandatory && !value) {
						result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: model.toLowerCase()});
						result.entity = entity;
						result.value = value;
						result.model = model;
						result.valideSrv = service;
						result.dataSrv = dataService;
					} else {
						result = platformDataValidationService.createSuccessObject();
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishAsyncValidation(result, entity, value, model, null, service, dataService);
				};

				service.validateBpdVatGroupFk = function validateBpdVatGroupFk(entity, value, model, apply) {
					if (!entity) {
						return true;
					}
					if (entity.BpdVatGroupFk !== value) {
						entity.BpdVatGroupFk = value;
						dataService.vatGroupChanged.fire();
					}
					return self.checkMandatory(entity, value, model, apply, {
						fieldName: $translate.instant('procurement.common.entityVatGroup')
					});
				};

				service.validateBankFk = function validateBankFk(entity, value) {
					if (value) {
						var banks = basicsLookupdataLookupDescriptorService.getData('businesspartner.main.bank');
						let bank = null;
						if (banks) {
							bank = _.find(banks, {Id: value});
							if (bank && bank.BankTypeFk) {
								entity.BpdBankTypeFk = bank.BankTypeFk;
							}
						}
						if (!bank) {
							basicsLookupdataLookupDescriptorService.getItemByKey('businesspartner.main.bank', value, {lookupType: 'businesspartner.main.bank'})
								.then(function (item) {
									bank = item;
									if (bank) {
										basicsLookupdataLookupDescriptorService.updateData('businesspartner.main.bank', [bank]);
										if (bank.BankTypeFk) {
											entity.BpdBankTypeFk = bank.BankTypeFk;
											dataService.gridRefresh();
										}
									}
								});
						}
					} else {
						entity.BpdBankTypeFk = null;
					}
					return true;
				};

				service.createOrDeleteWarning = function createOrDeleteWarning(entity) {
					var remark = $translate.instant('procurement.invoice.reconciliationBalanceWarning', null, null, 'en');
					if (entity.AmountNetBalance === 0 && entity.AmountGrossBalance === 0) {
						validationDataService.deleteItemByMessage(remark);
					} else {
						validationDataService.checkValidation(remark, reconciliationReference.invHeader, remark, undefined, undefined, undefined, entity.Id);
						validationDataService.createValidations();
					}

				};

				service.asyncValidateTaxCodeFk = (entity,value,model)=>{
					return commonMatrixValidationService.asyncValidateTaxCodeFk(dataService,entity,value,model);
				}

				service.asyncValidateBpdVatGroupFk = (entity,value,model)=>{
					return commonMatrixValidationService.asyncValidateBpdVatGroupFk(dataService,entity,value,model);
				}

				/* function SetControllingUnit(entity, value) {
                    var ItemService = $injector.get('procurementInvoiceContractDataService');
                    var ValidateService = $injector.get('procurementInvoiceContractValidationService');
                    var Items = ItemService.getList();
                    if (Items !== null && Items.length > 0) {
                        for (var i = 0; i < Items.length; i++) {
                            Items[i].ControllingUnitFk = value;
                            ValidateService.validateControllingUnitFk(Items[i], value, 'ControllingUnitFk');
                            ItemService.markItemAsModified(Items[i]);
                        }
                    }
                } */

				function validateEmptyCode(entity) {
					if (entity.Code === null || entity.Code === '') {
						var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
						platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
						platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, dataService);
						dataService.fireItemModified(entity);
					} else {
						platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
						platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
						dataService.fireItemModified(entity);
					}
				}

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				function reloadGeneralsByBusinessPartnerFk(entity, value, noRload) {
					if (value !== entity.BusinessPartnerFk && !noRload && value !== null) {
						var procurementInvoiceGeneralDataService = $injector.get('procurementInvoiceGeneralDataService');
						var dataEntity = {};
						dataEntity.MainItemId = entity.Id;
						dataEntity.ControllingunitFk = entity.ControllingUnitFk;
						dataEntity.TaxCodeFk = entity.TaxCodeFk;
						dataEntity.BusinessPartnerFk = value;
						dataEntity.OriginalBusinessPartnerFk = entity.BusinessPartnerFk;
						procurementInvoiceGeneralDataService.reloadGeneralsByBusinessPartnerFk(dataEntity);
					}
				}

				function asyncGetSupplierById(suppliers, supplierFk) {
					var selectedSup = _.find(suppliers, {Id: supplierFk});
					var promise;
					if (!selectedSup) {
						promise = basicsLookupdataLookupDescriptorService.getItemByKey('supplier', supplierFk, {
							displayMember: 'Code',
							lookupType: 'supplier'
						}, null).then(function (pointedSupplier) {
							if (pointedSupplier) {
								suppliers[pointedSupplier.Id] = pointedSupplier;
								basicsLookupdataLookupDescriptorService.updateData('Supplier', [pointedSupplier]);
							}
							return pointedSupplier || undefined;
						});
					} else {
						var deferTemp = $q.defer();
						deferTemp.resolve(selectedSup);
						promise = deferTemp.promise;
					}
					return promise;
				}

				dataService.registerEntityCreated(onEntityCreated);

				function tunInvTypesArray(_invTypes) {
					invTypes = [];
					angular.forEach(_invTypes, function (invType) {
						invTypes.push(invType);
					});
				}

				function getDefalutID(dataList) {
					var list = _.filter(dataList, {IsDefault: true});
					if (list.length > 0) {
						return list[0].Id;
					}
					return dataList[0].Id;
				}

				function resetVatGroupAndPostingGroupBySupplier(entity, supplierFk, isBpdVatGroupFk, isPostingGroupFk) {
					if (isBpdVatGroupFk || isPostingGroupFk) {
						if (!_.isNil(supplierFk)) {
							let suppliers = basicsLookupdataLookupDescriptorService.getData('Supplier');
							let selSupplier = _.find(suppliers, {Id: supplierFk});
							if (!_.isNil(selSupplier)) {
								$http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + supplierFk)
									.then(function (response) {
										let context = platformContextService.getContext();
										let companyId = context.clientId;
										let supplierWithSameCompany = _.filter(response.data, function (d) {
											return d.BasCompanyFk === companyId;
										});
										let supplierCompany = _.orderBy(supplierWithSameCompany, ['Id']);
										if (isBpdVatGroupFk) {
											let list = _.filter(supplierCompany, (item) => {
												return item.VatGroupFk !== null;
											});
											let VatGroupFk = _.isEmpty(list) ? selSupplier.BpdVatGroupFk : list[0].VatGroupFk;
											if (VatGroupFk) {
												service.validateBpdVatGroupFk(entity, VatGroupFk, 'BpdVatGroupFk');// jshint ignore:line
											}
										}
										if (isPostingGroupFk) {
											let list = _.filter(supplierCompany, (item) => {
												return item.BusinessPostingGroupFk !== null;
											});
											entity.BusinessPostingGroupFk = _.isEmpty(list) ? selSupplier.BusinessPostingGroupFk : list[0].BusinessPostingGroupFk;
										}

										if (supplierCompany?.length > 0) {
											entity.BasPaymentMethodFk = supplierCompany[0].BasPaymentMethodFk;
										}

										dataService.fireItemModified(entity);
									});
							}
						}
					}
				}

				function recalculateAmountAfChangeVatPercent(item) {
					const entity = item ? item : dataService.getSelected();
					if (entity) {
						let vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
						entity.AmountNetOc = getPreTaxByAfterTax(entity.AmountGrossOc, vatPercent);
						entity.AmountNet = getPreTaxByAfterTax(entity.AmountGross, vatPercent);
						entity.AmountVatOc = round(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
						entity.AmountVat = round(math.bignumber(entity.AmountGross).sub(entity.AmountNet));
						let sumChainInvoices = service.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
						entity.TotalPerformedNet = round(math.bignumber(entity.AmountNet).add(sumChainInvoices));
						self.updateDiscountBasics(entity);
						self.recalculateAmountBalance(entity);
						let commonMatrixValidationService = $injector.get('procurementCommonMatrixValidationService');
						commonMatrixValidationService.asyncValidateBpdVatGroupFk(dataService,entity,entity.BpdVatGroupFk, 'BpdVatGroupFk')
						dataService.fireItemModified(entity);
					}
				}

				function projectStatus(entity, projectId) {
					var projectLookups = basicsLookupdataLookupDescriptorService.getData('project');
					if (projectLookups && projectId !== null && projectId !== undefined) {
						var relatedPrj = _.find(projectLookups, {Id: projectId});
						if (relatedPrj) {
							entity.ProjectStatusFk = relatedPrj.StatusFk;
						}
					} else {
						entity.ProjectStatusFk = null;
					}
				}

				function getPreTaxByAfterTax(afterTax, vatPercent) {
					var vp = vatPercent ? (math.bignumber(100).add(vatPercent).div(100).toNumber()) : 1;
					return round(math.bignumber(afterTax).div(vp));
				}

				function getAfterTaxByPreTax(preTax, vatPercent) {
					var vp = vatPercent ? (math.bignumber(100).add(vatPercent).div(100).toNumber()) : 1;
					return round(math.bignumber(preTax).mul(vp));
				}

				function getOcByNonOc(nonOc, exchangeRate) {
					return round(math.bignumber(nonOc).mul(exchangeRate));
				}

				function getNonOcByOc(oc, exchangeRate) {
					if (!exchangeRate) {
						return 0;
					}
					return round(math.bignumber(oc).div(exchangeRate));
				}

				function round(value) {
					return prcCommonCalculationHelper.round(value);
				}

				dataService.vatGroupChanged.register(recalculateAmountAfChangeVatPercent);

				return service;
			}]);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementInvoiceCertificateActualValidationService',
		['procurementInvoiceCertificateActualDataService', 'businesspartnerCertificateCertificateValidationServiceFactory',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory.create(dataService);
			}]);
})(angular);
