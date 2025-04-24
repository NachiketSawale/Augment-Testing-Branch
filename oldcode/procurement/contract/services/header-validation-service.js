/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* global globals, _ */
	var moduleName = 'procurement.contract';

	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('contractHeaderElementValidationService',
		['$translate', '$injector', '$q', '$http', 'procurementContextService', 'procurementContractHeaderDataService',
			'platformDataValidationService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			'businessPartnerLogicalValidator', 'platformRuntimeDataService',
			'procurementCommonGeneralsDataService', 'procurementCommonCertificateNewDataService',
			'procurementCommonCodeHelperService', 'procurementCommonTotalDataService', 'contractHeaderPurchaseOrdersDataService',
			'platformDialogService', 'procurementCommonPrcItemDataService', 'procurementCommonExchangerateFormatterService', '$timeout',
			'procurementContractNumberGenerationSettingsService', 'platformTranslateService', 'procurementCommonTaxCodeChangeService', 'procurementInvoiceHeaderFilterService', 'platformContextService', 'procurementCommonCharacteristicDataService', 'platformModuleStateService', 'prcCommonCalculationHelper',
			'overDiscountValidationService', 'platformCreateUuid',
			'procurementCommonExchangerateValidateService', 'prcCommonDomainMaxlengthHelper',
			'businesspartnerCertificateCertificateContainerServiceFactory',
			'procurementCopyMode',
			'purchaseOrderType',
			function ($translate, $injector, $q, $http, moduleContext, dataService, platformDataValidationService, lookupDataService,
				basicsLookupdataLookupDescriptorService, businessPartnerLogicalValidator, platformRuntimeDataService,
				procurementCommonGeneralsDataService, procurementCommonCertificateDataService, codeHelperService, procurementCommonTotalDataService,
				contractHeaderPurchaseOrdersDataService, platformDialogService, procurementCommonPrcItemDataService, procurementCommonExchangerateFormatterService, $timeout,
				procurementContractNumberGenerationSettingsService, platformTranslateService, procurementCommonTaxCodeChangeService, procurementInvoiceHeaderFilterService, platformContextService, procurementCommonCharacteristicDataService, platformModuleStateService, prcCommonCalculationHelper,
				overDiscountValidationService, platformCreateUuid,
				procurementCommonExchangerateValidateService, prcCommonDomainMaxlengthHelper,
				certificateContainerServiceFactory,
				procurementCopyMode,
				purchaseOrderType) {

				var service = {};
				let deliverDateUpdateToItemInfoDialogId = platformCreateUuid();
				let updatePaymentTermFIToItemsDialogId = platformCreateUuid();
				let updatePaymentTermPAToItemsDialogId = platformCreateUuid();
				let updatePaymentTermFIandPAToItemsDialogId = platformCreateUuid();
				let updateIncotermToItemDialogId = platformCreateUuid();
				let willClearAllItemsDialogId = platformCreateUuid();
				let willClearAllBoqsDialogId = platformCreateUuid();
				var self = this;
				var packageUpdatingAddress = false;
				var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/contract/header/updateExchangeRate';
				var argumentsToValidate = {
					BusinessPartnerFk: 'BusinessPartner2Fk',
					SubsidiaryFk: 'Subsidiary2Fk',
					SupplierFk: 'Supplier2Fk',
					ContactFk: 'Contact2Fk'
				};
				var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
				procurementCommonGeneralsDataService = procurementCommonGeneralsDataService.getService(dataService);
				procurementCommonCertificateDataService = procurementCommonCertificateDataService.getService(dataService);
				procurementCommonTotalDataService = procurementCommonTotalDataService.getService(dataService);
				procurementCommonPrcItemDataService = procurementCommonPrcItemDataService.getService(dataService);
				// get validators from business partner
				service.validateBusinessPartnerFk = function (entity, value, model, isFromBasic, pointedSupplierFk, pointedSubsidiaryFk) {
					if (value === 0) {
						value = null;
					}
					businessPartnerValidatorService.resetArgumentsToValidate();
					businessPartnerValidatorService.businessPartnerValidator.apply(null, [entity, value, true, false, pointedSupplierFk, pointedSubsidiaryFk]);

					if (value !== entity.BusinessPartnerFk) {
						var dataEntity = {};
						dataEntity.MainItemId = entity.PrcHeaderFk;
						dataEntity.BusinessPartnerFk = value;
						dataEntity.OriginalBusinessPartnerFk = entity.BusinessPartnerFk;
						if(entity.PrcHeaderFk>0) {
							procurementCommonGeneralsDataService.reloadGeneralsByBusinessPartnerFk(dataEntity);
						}
						var businessPartner = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartner'), {Id: value});
						if (businessPartner && businessPartner.PrcIncotermFk) {
							service.validateIncotermFk(entity, businessPartner.PrcIncotermFk);
							entity.IncotermFk = businessPartner.PrcIncotermFk;
						}
					}
					var isContactFromBpDialog = entity.ContactFromBpDialog;
					if(!_.isNil(isContactFromBpDialog)){
						entity.ContactFromBpDialog = null;
					}

					var result;
					result = self.checkMandatory(entity, value, model, true, {
						fieldName: $translate.instant('cloud.common.entityBusinessPartner')
					});

					platformRuntimeDataService.readonly(entity, [{field: 'BankFk', readonly: value === null || angular.isUndefined(value)}]);
					if (value !== entity.BusinessPartnerFk) {
						procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, value);
					}
					return result;
				};

				service.asyncValidateBusinessPartnerFk = function (entity, value, model) {
					entity[model] = value;
					return reloadActualCertificate();
				}

				// get validators from business partner
				service.validateBusinessPartner2Fk = function (entity, value/* , model */) {
					businessPartnerValidatorService.resetArgumentsToValidate(argumentsToValidate);
					businessPartnerValidatorService.businessPartnerValidator.apply(null, arguments);
					var isContactFromBpDialog = entity.ContactFromBpDialog;
					if (_.isNil(isContactFromBpDialog) || _.isNil(entity.Contact2Fk)) {
						businessPartnerValidatorService.setDefaultContact(entity, value, 'Contact2Fk').then(function () {
							dataService.fireItemModified(entity);
						});
					}
					if(!_.isNil(isContactFromBpDialog)){
						entity.ContactFromBpDialog = null;
					}

					return {apply: true, valid: true};
				};

				service.asyncValidateBusinessPartner2Fk = function (entity, value, model) {
					entity[model] = value;
					return reloadActualCertificate();
				}

				service.validateSupplierFk = function (entity, value, model, dontSetPaymentTerm) {
					businessPartnerValidatorService.resetArgumentsToValidate();
					businessPartnerValidatorService.supplierValidator(entity, value, dontSetPaymentTerm);
					businessPartnerValidatorService.resetRelatedFieldsBySupplier(entity,value,dontSetPaymentTerm);
					dataService.fireItemModified(entity);
				};

				service.validateSupplier2Fk = function (entity, value) {
					businessPartnerValidatorService.resetArgumentsToValidate(argumentsToValidate);
					businessPartnerValidatorService.supplierValidator(entity, value);
				};

				// service.oldCertificate = [];
				service.validateSubsidiaryFk = function (entity, value) {
					businessPartnerValidatorService.resetArgumentsToValidate();
					businessPartnerValidatorService.subsidiaryValidator(entity, value);
				};
				service.validateSubsidiary2Fk = function (entity, value) {
					businessPartnerValidatorService.resetArgumentsToValidate(argumentsToValidate);
					businessPartnerValidatorService.subsidiaryValidator(entity, value);
				};

				var attachLookupByKey = function attachLookupByKey(lookup, key) {
					if (!key) {
						return;
					}
					basicsLookupdataLookupDescriptorService.loadItemByKey(lookup, key).then(function () {
						dataService.gridRefresh();
					});
				};

				// region reload certificates and generals when configuration or structure changed in prc header
				var reloadGeneralsAndCertificates = function reloadGeneralsAndCertificates(entity, originalEntity) {
					procurementCommonCertificateDataService.clearConfiguration2certCache();
					if (originalEntity && originalEntity.originalConfigurationFk && originalEntity.originalStructureFk) {
						procurementCommonGeneralsDataService.reloadData(originalEntity);
						procurementCommonCertificateDataService.reloadData(originalEntity);
					} else if (entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
						procurementCommonGeneralsDataService.reloadData();
						procurementCommonCertificateDataService.reloadData();
					}
				};

				service.overWriteGeneralsAndCertificates= function overWriteGeneralsAndCertificates(entity, originalEntity) {
					procurementCommonGeneralsDataService.overWriteData(entity, originalEntity);
					procurementCommonCertificateDataService.overWriteData(entity, originalEntity);
				};

				var reloadBillingSchema = function reloadBillingSchema(entity, prcConfigFk) {
					const deferred = $q.defer();
					if (entity && (entity.PrcHeaderEntity.ConfigurationFk || prcConfigFk)) {
						var configurationFk = prcConfigFk || entity.PrcHeaderEntity.ConfigurationFk;
						service.getDefaultBillingSchemas(configurationFk).then(function (response) {
							var isReloadBillingSchema = true;
							if (angular.isArray(response.data) && response.data.length) {
								var items = response.data;
								var target = _.find(items, {Id: entity.BillingSchemaFk});
								if (!target) {
									isReloadBillingSchema = false;
									// if current billing schema is not exist in current procurement configuration context
									$http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschema?configurationFk=' + configurationFk).then(
										function (res) {
											var data = res.data;
											if (data) {
												basicsLookupdataLookupDescriptorService.loadItemByKey('BillingSchema', data.Id).then(
													function () {
														dataService.fireItemModified(entity);
													}
												);
												entity.BillingSchemaFk = data.Id;
											} else {
												entity.BillingSchemaFk = 0;
												dataService.fireItemModified(entity);
											}
											dataService.BillingSchemaChanged.fire();
											deferred.resolve(true);
										}
									);
								} else {
									deferred.resolve(true);
								}
							}
							if (isReloadBillingSchema) {
								dataService.BillingSchemaChanged.fire();
								deferred.resolve(true);
							}
						});
					}
					return deferred.promise;
				};

				var validateStructureFk = service.validatePrcHeaderEntity$StructureFk = function validateStructureFk(entity, value) {
					if (entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk !== value) {
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						entity.PrcHeaderEntity.StructureFk = value;
						dataService.markItemAsModified(entity);
						if (!_.isNil(entity.Id)) {
							reloadGeneralsAndCertificates(entity, originalEntity);
							var targetSectionId = 8;// 8 is  Contract.
							var target2SectionId = 46;// 46 is  ContractCharacteristics2.
							procurementCommonCharacteristicDataService.takeCharacteristicByStructure(dataService, targetSectionId, target2SectionId, entity.PrcHeaderEntity, entity.Id);
						}

					}

					var clerkData = {
						prcStructureFk: value,
						projectFk: entity.ProjectFk,
						companyFk: entity.CompanyFk
					};
					var structure;
					if (value) {
						structure = _.find(basicsLookupdataLookupDescriptorService.getData('PrcStructure'), {Id: value});
						if (!_.isNil(structure)) {
							$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value).then(function (response) {
								if (response.data) {
									var taxCodeFk = response.data;
									service.validateTaxCodeFk(entity, taxCodeFk, 'TaxCodeFk', true);
								}
							});
						}
					}

					$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
						if (!_.isNil(response.data[0])) {
							entity.ClerkPrcFk = response.data[0];
						}
						if (!_.isNil(response.data[1])) {
							entity.ClerkReqFk = response.data[1];
						}

						// set reference when package and reference null but structure have value
						if (value && !entity.Description && !entity.PackageFk) {
							const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Contract', 'ConHeaderDto', 'Description');
							var description = structure ? structure.DescriptionInfo.Translated : '';
							entity.Description = description.substr(0, descriptionLength);
						}

						dataService.fireItemModified(entity);
					});

					return true;
				};

				self.checkMandatory = function (entity, value, model, apply, errParam) {
					var result = platformDataValidationService.isMandatory(value, model, errParam);
					if (apply) {
						result.apply = true;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
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
							currencyRateTypeFk: 2
						}
					});
				};

				// validateCode
				service.validateCode = function (entity, value, model) {
					var rubricIndex = dataService.getRubricIndex(entity);
					var rubricCategoryFk = entity.RubricCategoryFk;
					var configurateFk = 0;
					if(entity.ConfigurationFk !== undefined && entity.ConfigurationFk !== null){
						configurateFk = entity.ConfigurationFk;
					}
					if(configurateFk === 0 && entity.PrcHeaderEntity !== undefined && entity.PrcHeaderEntity !== null){
						configurateFk = entity.PrcHeaderEntity.ConfigurationFk;
					}
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: configurateFk});
					if(config){
						rubricCategoryFk = config.RubricCategoryFk;
					}
					entity.hasToGenerate = entity.Version === 0 && procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(rubricCategoryFk, rubricIndex);

					if (entity.Version === 0 && entity.hasToGenerate) {
						entity.Code = procurementContractNumberGenerationSettingsService.provideNumberDefaultText(rubricCategoryFk, entity.Code, rubricIndex);
						platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
						platformDataValidationService.finishValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', service, dataService);
						platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
						platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
						return true;
					}
					var validateResult = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
					if (!validateResult.valid) {
						validateResult.error = $translate.instant('procurement.contract.ConHeaderReferenceUniqueError');
					}
					platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
					platformDataValidationService.finishValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', service, dataService);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.asyncValidateCode = function (entity, value, model) {
					if (entity.Version === 0 && entity.hasToGenerate) {
						return $q.when(true);
					}

					var error = $translate.instant('procurement.contract.ConHeaderReferenceUniqueError');
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'procurement/contract/header/isunique', entity, value, model, error)
						.then(function (validateResult) {
							platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
							return validateResult;
						});
					return asyncMarker.myPromise;
				};

				service.validateDialogCode = function (entity, value, model) {
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
					/** @namespace translationObject.cloud.common.isGenerated */
					if ((value === null || _.isUndefined(value) || value === '') && entity.Code !== null && entity.Code !== translationObject.cloud.common.isGenerated) {
						var emptyError = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');
						var result1 = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: emptyError || {object: model.toLowerCase()}
						};
						defer.resolve(result1);
					} else {
						var error = $translate.instant('procurement.contract.ConHeaderReferenceUniqueError');

						var id = entity.Id;
						if (_.isUndefined(id)) {
							id = 0;
						}

						var rubricIndex = dataService.getRubricIndex(entity);
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.ConfigurationFk});
						var hasToGenerate = procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk, rubricIndex);
						if (hasToGenerate && entity.Version === 0) {
							defer.resolve(true);
						} else {
							$http.get(globals.webApiBaseUrl + 'procurement/contract/header/isunique' + '?id=' + id + '&code=' + value)
								.then(function (result) {
									if (!result.data) {
										var result2 = {
											apply: true,
											valid: false,
											error: '...',
											error$tr$: 'cloud.common.uniqueValueErrorMessage',
											error$tr$param$: error || {object: model.toLowerCase()}
										};
										defer.resolve(result2);
									} else {
										defer.resolve(true);
									}
								});
						}
					}
					dataService.fireItemModified(entity);
					asyncMarker.myPromise = defer.promise.then(function (validateResult) {
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						if (validateResult === true || validateResult.valid) {
							platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
							platformDataValidationService.finishAsyncValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', asyncMarker, service, dataService);
						}
						platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);

						return validateResult;
					});

					return asyncMarker.myPromise;

				};

				service.validateDateDelivery = function validateDateDelivery(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.PaymentTermFiFk !== value) {
						var options = {
							bodyText: $translate.instant('procurement.common.deliverDateUpdateToItemInfo'),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question',
							id: deliverDateUpdateToItemInfoDialogId,
							dontShowAgain: true
						};

						moduleContext.showDialogAndAgain(options).then(function (response) {
							if (response.yes === true) {
								var items = procurementCommonPrcItemDataService.getList();
								for (var i = 0; i < items.length; i++) {
									items[i].DateRequired = value;
									procurementCommonPrcItemDataService.markItemAsModified(items[i]);
								}
							}
						});

						entity.DateDelivery = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;

				};

				// validatePackageFk
				service.asyncValidatePackageFk = function validatePackageFk(entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = setDataByPackage(entity, value,model).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				function setDataByPackage(entity,value,model){
					if (!value) {
						dataService.updateReadOnly(entity, 'TaxCodeFk', value, model);
						let result = {apply: true, valid: true};
						return $q.when(result);
					}

					if (entity.PackageFk !== value) {
						if (!entity || !value) {
							let result = {apply: true, valid: true};
							return $q.when(result);
						}
					 return lookupDataService.getItemByKey('PrcPackage', value).then(function (data) {
								if (!data) {
									return true;
								}
								packageUpdatingAddress = true;
								// apply changed data
								// entity.ProjectFk = data.ProjectFk;
								entity.ClerkPrcFk = data.ClerkPrcFk;
								entity.ClerkReqFk = data.ClerkReqFk;
								entity.ExecutionStart = data.PlannedStart;
								entity.ExecutionEnd = data.PlannedEnd;
								entity.ValidFrom = data.ValidFrom;
								entity.ValidTo = data.ValidTo;
								// entity.PrcHeaderEntity.StructureFk = data.StructureFk;
								if (service.validateProjectFk(entity, data.ProjectFk)) {
									entity.ProjectFk = data.ProjectFk;
								}
								if (service.validateTaxCodeFk(entity, data.TaxCodeFk, 'TaxCodeFk', true)) {
									entity.TaxCodeFk = data.TaxCodeFk;
								}

								if (!entity.Description) {
									const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Contract', 'ConHeaderDto', 'Description');
									entity.Description = data.Description.substr(0, descriptionLength);
								}

								if (validateStructureFk(entity, data.StructureFk)) {
									entity.PrcHeaderEntity.StructureFk = data.StructureFk;
								}

								// trigger changed event
								/* service.validateTaxCodeFk(entity, data.TaxCodeFk);
										 entity.TaxCodeFk = data.TaxCodeFk; */

								dataService.updateReadOnly(entity, 'TaxCodeFk', value, model);
								attachLookupByKey('Project', entity.ProjectFk);
								attachLookupByKey('Clerk', entity.ClerkPrcFk);
								attachLookupByKey('Clerk', entity.ClerkReqFk);
								attachLookupByKey('TaxCode', entity.TaxCodeFk);
								attachLookupByKey('PrcStructure', entity.PrcHeaderEntity.StructureFk);

								procurementCommonTotalDataService.copyTotalsFromPackage(data);

								dataService.fireItemModified(entity);

								// delivery address ************
								// if (value) {
								$http
									.get(globals.webApiBaseUrl + 'procurement/package/package/getdeliveryaddress?packageId=' + value)
									.then(function (xhr) {
										if (xhr && xhr.data) {
											entity.AddressFk = xhr.data.Id;
											entity.AddressEntity = xhr.data;

											dataService.fireItemModified(entity);
											dataService.gridRefresh();
											packageUpdatingAddress = false;
										}
									}, function () {
										packageUpdatingAddress = false;
									});
								// }
							 let result = {apply: true, valid: true};
							 return $q.when(result);
							},
							function (error) {
								window.console.error(error);
							}
					);

					}
				}

				// validateTaxCodeFk
				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model, isInject) {

					self.checkMandatory(entity, value === -1 ? '' : value, 'TaxCodeFk', true, {
						fieldName: $translate.instant('cloud.common.entityTaxCode')
					});// backend may return -1

					if (!entity || !entity.TaxCodeFk) {
						return true;
					}
					if (entity.TaxCodeFk !== value) {
						let commonMatrixValidationService = $injector.get('procurementCommonMatrixValidationService');
						commonMatrixValidationService.asyncValidateTaxCodeFk(dataService,entity,value,model);
						lookupDataService.getItemByKey('TaxCode', value).then(
							function (data) {
								if (angular.isObject(data)) {
									if (entity.VatPercent !== data.VatPercent) {
										dataService.isTotalDirty = true;
									}
									entity.TaxCodeFk = value;
									entity.VatPercent = data.VatPercent;

									if (isInject === undefined) {
										procurementCommonTaxCodeChangeService.taxCodeChanged(value, moduleName, dataService, entity);
									} else {
										dataService.totalFactorsChangedEvent.fire();
										dataService.taxCodeFkChanged.fire();
										dataService.wantToUpdateTXToItemsAndBoq();
									}
									dataService.fireItemModified(entity);
								}
							},
							function (error) {
								window.console.error(error);
							}
						);
					}
					return true;
				};

				// validateConStatusFk
				service.validateConStatusFk = function validateConStatusFk(entity, value) {
					if (!entity || !entity.ConStatusFk) {
						return true;
					}
					if (entity.ConStatusFk !== value) {
						lookupDataService.getItemByKey('ConStatus', value).then(function (data) {
							var dateCanceled = null;
							if (data && data.Iscanceled === true) {
								dateCanceled = new Date();
							} else {
								dateCanceled = undefined;
							}
							entity.DateCanceled = dateCanceled;
							moduleContext.setModuleStatus(data);
							dataService.fireItemModified(entity);
						});
					}
					return true;
				};

				// validatePaymentTermFiFk
				service.validatePaymentTermFiFk = function validatePaymentTermFiFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.PaymentTermFiFk !== value) {
						var items = procurementCommonPrcItemDataService.getList();
						if (items.length > 0) {
							var itemsFi = _.uniq(_.map(items, 'BasPaymentTermFiFk'));
							if (!(itemsFi.length === 1 && itemsFi.includes(value))) {
								var options = {
									headerText: '',
									bodyText: $translate.instant('procurement.common.updatePaymentTermFIToItems'),
									showYesButton: true,
									showNoButton: true,
									iconClass: 'ico-question',
									id: updatePaymentTermFIToItemsDialogId,
									dontShowAgain: true
								};
								moduleContext.showDialogAndAgain(options).then(function (response) {
									if (response.yes === true) {
										for (var i = 0; i < items.length; i++) {
											items[i].BasPaymentTermFiFk = value;
											procurementCommonPrcItemDataService.markItemAsModified(items[i]);
										}
									}
								});
							}
						}
						entity.PaymentTermFiFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				// validatePaymentTermPaFk
				service.validatePaymentTermPaFk = function validatePaymentTermPaFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.PaymentTermPaFk !== value) {
						var items = procurementCommonPrcItemDataService.getList();
						if (items.length > 0) {
							var itemsPa = _.uniq(_.map(items, 'BasPaymentTermPaFk'));
							if (!(itemsPa.length === 1 && itemsPa.includes(value))) {
								var options = {
									headerText: '',
									bodyText: $translate.instant('procurement.common.updatePaymentTermPAToItems'),
									showYesButton: true,
									showNoButton: true,
									iconClass: 'ico-question',
									id: updatePaymentTermPAToItemsDialogId,
									dontShowAgain: true
								};
								moduleContext.showDialogAndAgain(options).then(function (response) {
									if (response.yes === true) {
										for (var i = 0; i < items.length; i++) {
											items[i].BasPaymentTermPaFk = value;
											procurementCommonPrcItemDataService.markItemAsModified(items[i]);
										}
									}
								});
							}
						}
						entity.PaymentTermPaFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				// validatePaymentTermAdFk
				service.validatePaymentTermAdFk = function validatePaymentTermAdFk(entity, value) {
					if (!entity) {
						return true;
					}
					entity.PaymentTermAdFk = value;
					dataService.fireItemModified(entity);
					dataService.gridRefresh();
					return true;
				};

				// validate PaymentTermPaFk and PaymentTermFiFk
				service.validatePaymentTermPaFkandPaymentTermFiFk = function validatePaymentTermPaFkandPaymentTermFiFk(entity, paymentTermPaFk, paymentTermFiFk, isFromSupplierFk) {
					if (!entity) {
						return true;
					}
					if (entity.SupplierFk && !isFromSupplierFk) {
						return true;
					}

					if (entity.PaymentTermPaFk !== paymentTermPaFk || entity.PaymentTermFiFk !== paymentTermFiFk) {
						var items = procurementCommonPrcItemDataService.getList();
						if (items.length > 0) {
							var itemsPa = _.uniq(_.map(items, 'BasPaymentTermPaFk'));
							var itemsFi = _.uniq(_.map(items, 'BasPaymentTermFiFk'));
							if (!(itemsPa.length === 1 && itemsPa.includes(paymentTermPaFk) &&
								itemsFi.length === 1 && itemsFi.includes(paymentTermFiFk))) {
								var options = {
									headerText: '',
									bodyText: $translate.instant('procurement.common.updatePaymentTermFIandPAToItems'),
									showYesButton: true,
									showNoButton: true,
									iconClass: 'ico-question',
									id: updatePaymentTermFIandPAToItemsDialogId,
									dontShowAgain: true
								};
								moduleContext.showDialogAndAgain(options).then(function (response) {
									if (response.yes === true) {
										for (var i = 0; i < items.length; i++) {
											items[i].BasPaymentTermPaFk = paymentTermPaFk;
											items[i].BasPaymentTermFiFk = paymentTermFiFk;
											procurementCommonPrcItemDataService.markItemAsModified(items[i]);
										}
									}
								});
							}
						}

						entity.PaymentTermPaFk = paymentTermPaFk;
						entity.PaymentTermFiFk = paymentTermFiFk;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				// validateIncotermFk
				service.validateIncotermFk = function validateIncotermFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.IncotermFk !== value) {
						var items = procurementCommonPrcItemDataService.getList();
						if (items.length > 0) {
							var itemIncoterms = _.uniq(_.map(items, 'PrcIncotermFk'));
							if (!(itemIncoterms.length === 1 && itemIncoterms.includes(value))) {
								var options = {
									headerText: '',
									bodyText: $translate.instant('procurement.common.updateIncotermToItem'),
									showYesButton: true,
									showNoButton: true,
									iconClass: 'ico-question',
									id: updateIncotermToItemDialogId,
									dontShowAgain: true
								};
								moduleContext.showDialogAndAgain(options).then(function (response) {
									if (response.yes === true) {
										var items = procurementCommonPrcItemDataService.getList();
										for (var i = 0; i < items.length; i++) {
											items[i].PrcIncotermFk = value;
											procurementCommonPrcItemDataService.markItemAsModified(items[i]);
										}
									}
								});
							}
						}
						entity.IncotermFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				service.validateBasAccassignConTypeFk = function validateBasAccassignConTypeFk(entity, value) {
					var invHeaderService = $injector.get('procurementInvoiceHeaderDataService');
					if (invHeaderService) {
						var accassignConTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignConType'), {Id: value});
						entity.IsInvAccountChangeable = accassignConTypeEntity && accassignConTypeEntity.IsCreateInvAccount;
						var invHeaderEntity = invHeaderService.getSelected();
						if (invHeaderEntity && invHeaderEntity.ConHeaderFk === entity.Id) {
							invHeaderEntity.BasAccassignConTypeFk = value;
							invHeaderEntity.IsInvAccountChangeable = entity.IsInvAccountChangeable;
							invHeaderService.SetAccountAssignReadOnlyByIsInvAccountChangeable(invHeaderEntity);
						}
					}
					return true;
				};

				// validateBasCurrencyFk
				function validateBasCurrencyFk(entity, value, model) {
					if (entity.BasCurrencyFk === value && entity.Id !== undefined) {
						return true;
					}
					entity.BasCurrencyFk = value;

					dataService.updateReadOnly(entity, 'ExchangeRate', value, model);
					value = value || -1;

					if (value === moduleContext.companyCurrencyId) {
						entity.ExchangeRate = 1;
						entity.OverallDiscount = entity.OverallDiscountOc;
						dataService.totalFactorsChangedEvent.fire();
						dataService.exchangeRateChanged.fire(null, {
							ExchangeRate: entity.ExchangeRate,
							IsCurrencyChanged: true
						});
						validateExchangeRate(entity, 1, 'ExchangeRate', true);
					} else {
						self.getCurrentRate(entity, value).then(
							function (response) {
								if (response) {
									var rate = response.data;
									entity.ExchangeRate = rate;
									entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / rate);
									if (rate) {
										// service.validateExchangeRate(entity, rate);
										dataService.totalFactorsChangedEvent.fire();
										dataService.exchangeRateChanged.fire(null, {
											ExchangeRate: rate,
											IsCurrencyChanged: true
										});
									}
									dataService.fireItemModified(entity);
									validateExchangeRate(entity, rate, 'ExchangeRate', true);
								}
							}, function (error) {
								window.console.error(error);
							}
						);
					}
					return true;
				}

				service.syncValidateBasCurrencyFk = validateBasCurrencyFk;

				service.asyncValidateBasCurrencyFk = function asyncValidateBasCurrencyFk(entity, value, model) {
					var originalCurrency = entity[model];
					var originalRate = entity.ExchangeRate;
					entity.BasCurrencyFk = value;
					if (value === moduleContext.companyCurrencyId) {
						entity.ExchangeRate = 1;
						dataService.updateReadOnly(entity, 'ExchangeRate', entity.ExchangeRate, 'ExchangeRate');
						return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
					} else {
						return self.getCurrentRate(entity, value).then(
							function (response) {
								if (response) {
									entity.ExchangeRate = response.data;
									dataService.updateReadOnly(entity, 'ExchangeRate', entity.ExchangeRate, 'ExchangeRate');
									return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
								}
							}, function (error) {
								window.console.error(error);
							}
						);
					}
				};

				service.changeMaterialCatalogFk = function changeMaterialCatalogFk(entity, value, model) {
					if (value && entity.MaterialCatalogFk !== value) {
						let originalMdcCatalogFk = entity.MaterialCatalogFk;
						entity.MaterialCatalogFk = value;
						contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
						if (entity.PurchaseOrders === purchaseOrderType.frameworkContractCallOff) {
							entity.PrcCopyModeFk = procurementCopyMode.OnlyAllowedCatalogs;
							if(!_.isNil(entity.Id)){
								dataService.frameworkMdcCatalogChanged.fire(null, {headerId: entity.Id, newValue: value, oldValue: originalMdcCatalogFk});
							}
						}
						return lookupDataService.getItemByKey('MaterialCatalog', value).then(function (data) {
							if (!angular.isObject(data)) {
								return true;
							}
							entity.SubsidiaryFk = data.SubsidiaryFk;
							entity.IncotermFk = data.IncotermFk;
							entity.FrameworkConHeaderFk = data.ConHeaderFk ? data.ConHeaderFk : entity.FrameworkConHeaderFk;

							// trigger changed event
							var hasMdcCatPaymentTermFks = !!(data.PaymentTermAdFk || data.PaymentTermFiFk || data.PaymentTermFk);
							var dontSetPaymentTerm = hasMdcCatPaymentTermFks;
							var bpResult = service.validateBusinessPartnerFk(entity, data.BusinessPartnerFk, 'BusinessPartnerFk', null, data.SupplierFk, data.SubsidiaryFk);
							service.validateSupplierFk(entity, data.SupplierFk, 'SupplierFk', dontSetPaymentTerm);
							// fix defect #76742 - Validation error when assigning a framework contract
							applyManualValidation(bpResult, entity, 'BusinessPartnerFk', data.BusinessPartnerFk);

							// apply changed values
							entity.BusinessPartnerFk = data.BusinessPartnerFk;
							procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, entity.BusinessPartnerFk);
							entity.SubsidiaryFk = data.SubsidiaryFk;
							entity.SupplierFk = data.SupplierFk;
							entity.IncotermFk = data.IncotermFk;
							if (hasMdcCatPaymentTermFks) {
								entity.PaymentTermFiFk = data.PaymentTermFiFk;
								entity.PaymentTermPaFk = data.PaymentTermFk;
								entity.PaymentTermAdFk = data.PaymentTermAdFk;
							}

							frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);

							attachLookupByKey('subsidiary', data.SubsidiaryFk);
							attachLookupByKey('PrcIncoterm', data.IncotermFk);
							if (data.ConHeaderFk) {
								return asyncGetFrameworkContract(data.ConHeaderFk).then(function (con) {
									if (con && con.PrcHeaderEntity && con.PrcHeaderEntity.StructureFk) {
										entity.PrcHeaderEntity.StructureFk = con.PrcHeaderEntity.StructureFk;
										dataService.fireItemModified(entity);
									}
									return true;
								});
							}
							else {
								dataService.fireItemModified(entity);
								return true;
							}
						}, function (error) {
							window.console.error(error);
						});
					}
					var defer = $q.defer();
					defer.resolve(true);
					return defer.promise;
				}

				service.asyncValidateMaterialCatalogFk = function asyncValidateMaterialCatalogFk(entity, value, model) {
					var defer = $q.defer();
					var ItemLists = procurementCommonPrcItemDataService.getList();
					if (moduleContext.getMainService().name === 'procurement.requisition' || moduleContext.getMainService().name === 'procurement.contract') {
						dataService.taxMaterialCatalogFkChanged.fire(null, {item: entity, value: value});
					}
					if (!value) {
						dataService.frameworkMdcCatalogChanged.fire(null, {headerId: entity.Id, newValue: null, oldValue: entity[model]});
						frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);

						for (var i = 0; i < ItemLists.length; i++) {
							if (ItemLists[i].MdcMaterialFk !== null) {
								procurementCommonPrcItemDataService.setColumnsReadOnly(ItemLists[i], false);
								procurementCommonPrcItemDataService.markItemAsModified(ItemLists[i]);
							}
						}
						contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
						entity.FrameworkConHeaderFk = null;
						if (entity.BoqWicCatBoqFk) {
							var con2BoqWicCatBoq = getConHeader2BoqWicCatBoq(entity.BoqWicCatBoqFk);
							if (con2BoqWicCatBoq && con2BoqWicCatBoq.ConHeaderFk) {
								entity.FrameworkConHeaderFk = con2BoqWicCatBoq.ConHeaderFk;
								return asyncGetFrameworkContract(con2BoqWicCatBoq.ConHeaderFk).then(function (con) {
									if (con && con.PrcHeaderEntity && con.PrcHeaderEntity.StructureFk) {
										entity.PrcHeaderEntity.StructureFk = con.PrcHeaderEntity.StructureFk;
									}
									return true;
								});
							}
						}
						defer.resolve(true);
						return defer.promise;
					}
					if (entity.MaterialCatalogFk !== value) {
						var items = procurementCommonPrcItemDataService.getList();
						if (items && items.length) {
							var options = {
								headerText: $translate.instant('procurement.contract.conFrameworkMaterialCatalog'),
								bodyText: $translate.instant('procurement.contract.willClearAllItems'),
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question',
								id: willClearAllItemsDialogId,
								dontShowAgain: true
							};
							return moduleContext.showDialogAndAgain(options).then(function (response) {
								if (response.yes === true) {
									return service.changeMaterialCatalogFk(entity, value, model).then(function () {
										procurementCommonPrcItemDataService.data.selectedEntities = items;
										return procurementCommonPrcItemDataService.deleteEntities(items);
									});
								}
								else {
									return {apply: false, valid: true};
								}
							});
						}
						else {
							return service.changeMaterialCatalogFk(entity, value);
						}
					}
				};

				// validateProjectFk
				service.validateProjectFk = function validateProjectFk(entity, value, model) {

					if (entity.ProjectFk !== value) {
						entity.ProjectFk = value;

						getClerkByProject(value, entity);
						dataService.projectFkChanged.fire();
					}
					// update readonly field.
					dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);

					projectStatus(entity, value);

					if (!value) {
						entity.ControllingUnitFk = null;
						// dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);
						entity.ProjectFk = value;
						dataService.projectFkChanged.fire();
						return true;
					}

					var oldControllingUnitFk = entity.ControllingUnitFk;

					if (entity.PrcHeaderFk !== 0) {
						dataService.reloadHeaderText(entity, {
							isOverride: true
						});
					}

					$q.all([$injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldControllingUnitFk), getAddressByProject(value, entity)]).then(function (res) {
						if (res[0] !== '' && res[0] !== null) {
							entity.ControllingUnitFk = res[0];
							dataService.controllingUnitChanged.fire();
							dataService.wantToUpdateCUToItemsAndBoq(entity.ControllingUnitFk);
						}
						// entity.AddressFk = res[1].AddressFk;
						// entity.AddressEntity = res[1].AddressEntity;

						validateBasCurrencyFk(entity, entity.BasCurrencyFk);
						dataService.gridRefresh();
					});

					copyCertificatesFormProject(value, entity);

					return true;
				};

				// validateDialogProjectFk
				service.validateDialogProjectFk = function validateDialogProjectFk(entity, value, model) {

					if (entity.ProjectFk !== value) {
						entity.ProjectFk = value;

						getClerkByProject(value, entity);
						dataService.projectFkChanged.fire();
					}
					// update readonly field.
					dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);

					projectStatus(entity, value);

					if (!value) {
						entity.ControllingUnitFk = null;
						// dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);
						entity.ProjectFk = value;
						dataService.projectFkChanged.fire();
						return true;
					}
					return true;
				};

				// copy certificates.
				function copyCertificatesFormProject(value, entity) {
					if (_.isNil(entity.Id)) {
						return;
					}
					// copy certificates from other modules such as material and project. now, copy from project.
					var options = {
						url: 'procurement/common/prccertificate/copycertificatesfromproject',
						dataService: procurementCommonCertificateDataService,
						parameter: {PrcHeaderId: entity.PrcHeaderFk, PrjProjectId: value}
					};
					procurementCommonCertificateDataService.copyCertificatesFromOtherModule(options);
				}

				// get clerk.
				function getClerkByProject(value, entity) {

					var clerkData = {
						prcStructureFk: entity.PrcHeaderEntity.StructureFk,
						projectFk: value,
						companyFk: entity.CompanyFk
					};

					if (entity.ClerkPrcFk === null || entity.ClerkReqFk === null) {
						$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
							if (!_.isNil(response.data[0])) {
								entity.ClerkPrcFk = response.data[0];
							}
							if (!_.isNil(response.data[1])) {
								entity.ClerkReqFk = response.data[1];
							}
							dataService.fireItemModified(entity);
						});
					}
				}

				// get address.
				function getAddressByProject(value, entity) {
					var loadval = $q.defer();
					if (!entity.AddressEntity && !packageUpdatingAddress) {
						$http
							.get(globals.webApiBaseUrl + 'procurement/package/package/getdeliveryaddress?projectId=' + value)
							.then(function (xhr) {
								if (xhr && xhr.data) {
									entity.AddressFk = xhr.data.Id;
									entity.AddressEntity = xhr.data;

									dataService.fireItemModified(entity);
									dataService.gridRefresh();
								}
								loadval.resolve(entity);
							});
					} else {
						loadval.resolve(entity);
					}
					return loadval.promise;
				}

				// ControllingUnitFk
				service.asyncValidateControllingUnitFk = function asyncValidateControllingUnitFk(entity, value, model) {

					var defer = $q.defer();
					/* var result = {
						apply: true,
						valid: true
					}; */
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						defer.resolve(true);
					} else {
						/* var ProjectFk = entity.ProjectFk;
						$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + "&ProjectFk=" + ProjectFk).then(function (response) {
							if (response.data) {
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('basics.common.error.controllingUnitError')
								};
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							}
							else {
								defer.resolve(true);
							}
						}); */
						// if entity.ProjectFk is null, then should derived from controlling unit.
						if (!entity.ProjectFk) {

							basicsLookupdataLookupDescriptorService.loadItemByKey('ControllingUnit', value).then(function (res) {
								var projectFk = res && res.PrjProjectFk;
								if (projectFk) {
									if (entity.ProjectFk !== projectFk) {
										projectStatus(entity, projectFk);
									}
									entity.ProjectFk = projectFk;
									dataService.updateReadOnly(entity, 'ProjectChangeFk', projectFk, 'ProjectFk');
									dataService.projectFkChanged.fire();
									getClerkByProject(projectFk, entity);
									getAddressByProject(projectFk, entity);
									copyCertificatesFormProject(projectFk, entity);
									dataService.fireItemModified(entity);
									dataService.controllingUnitChanged.fire();
									dataService.wantToUpdateCUToItemsAndBoq(value);
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

				function validateExchangeRate(entity, value, model) {

					var result = {apply: true, valid: true};

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					result = procurementCommonExchangerateFormatterService.test(value);
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						if (!result.isZero) {
							return result;
						}
					}

					moduleContext.exchangeRate = entity.ExchangeRate;
					if (moduleContext.exchangeRate !== value) {
						dataService.isTotalDirty = true;
						entity.ExchangeRate = value;
						entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / value);
						moduleContext.exchangeRate = value;
						dataService.exchangeRateChanged.fire(null, {ExchangeRate: value});
					}
					return result;
				}

				service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
					if (entity.ExchangeRate === value) {
						const defer = $q.defer();
						defer.resolve(true);
						return defer.promise;
					}
					var originalRate = entity.ExchangeRate;
					entity.ExchangeRate = value;
					return procurementCommonExchangerateValidateService.asyncModifyRate(entity, value, model, service, dataService, updateExchangeRateUrl, originalRate);
				};

				service.validateDateCallofffrom = function validateDateCallofffrom(entity, value, model) {
					let callOffForm = value ? new Date(value) : undefined;
					let callOffTo = entity.DateCalloffto ? new Date(entity.DateCalloffto) : undefined;
					return platformDataValidationService.validatePeriod(callOffForm, callOffTo, entity, model, service, dataService, 'DateCalloffto');
				};

				service.validateDateCalloffto = function validateDateCalloffto(entity, value, model) {
					let callOffForm = entity.DateCallofffrom ? new Date(entity.DateCallofffrom) : undefined;
					let callOffTo = value ? new Date(value) : undefined;
					return platformDataValidationService.validatePeriod(callOffForm, callOffTo, entity, model, service, dataService, 'DateCallofffrom');
				};

				service.validatePrcHeaderEntity$ConfigurationFk = function validateConfigurationFk(entity, value, model, isFromWizard) {
					if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== value) {
						var prcConfigurationEntity = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						if (prcConfigurationEntity) {
							entity.IsNotAccrualPrr = prcConfigurationEntity.IsNotAccrualPrr;
							// service.validatePaymentTermPaFk(entity, prcConfigurationEntity.PaymentTermPaFk);
							// service.validatePaymentTermFiFk(entity, prcConfigurationEntity.PaymentTermFiFk);
							service.validatePaymentTermPaFkandPaymentTermFiFk(entity, prcConfigurationEntity.PaymentTermPaFk, prcConfigurationEntity.PaymentTermFiFk, false);
							entity.ContracttypeFk = prcConfigurationEntity.PrcContractTypeFk;
							entity.AwardmethodFk = prcConfigurationEntity.PrcAwardMethodFk;

							entity.ApprovalPeriod = (!prcConfigurationEntity.ApprovalPeriod && prcConfigurationEntity.ApprovalPeriod !== 0) ? entity.ApprovalPeriod : prcConfigurationEntity.ApprovalPeriod;
							entity.ApprovalDealdline = (!prcConfigurationEntity.ApprovalDealdline && prcConfigurationEntity.ApprovalDealdline !== 0) ? entity.ApprovalDealdline : prcConfigurationEntity.ApprovalDealdline;
							entity.ProvingPeriod = (!prcConfigurationEntity.ProvingPeriod && prcConfigurationEntity.ProvingPeriod !== 0) ? entity.ProvingPeriod : prcConfigurationEntity.ProvingPeriod;
							entity.ProvingDealdline = (!prcConfigurationEntity.ProvingDealdline && prcConfigurationEntity.ProvingDealdline !== 0) ? entity.ProvingDealdline : prcConfigurationEntity.ProvingDealdline;
							entity.IsFreeItemsAllowed = prcConfigurationEntity.IsFreeItemsAllowed;

							if (!prcConfigurationEntity.IsMaterial) {
								entity.MaterialCatalogFk = null;
							}
							if (!prcConfigurationEntity.IsService) {
								entity.BoqWicCatFk = null;
								entity.BoqWicCatBoqFk = null;
							}
							contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
							dataService.updateFieldsReadOnly(entity,
								['ContractHeaderFk', 'MaterialCatalogFk', 'BoqWicCatFk', 'BoqWicCatBoqFk'],
								entity.MaterialCatalogFk, 'MaterialCatalogFk');
						}

						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						if (entity.PrcHeaderEntity.StructureFk) {
							originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						}
						entity.PrcHeaderEntity.ConfigurationFk = value;
						entity.ConfigurationFk = value;
						dataService.markCurrentItemAsModified();
						reloadGeneralsAndCertificates(entity, originalEntity);
						// procurementCommonTotalDataService.reload();
						if (!_.isNil(entity.Id)&&!isFromWizard) {
							procurementCommonTotalDataService.copyTotalsFromConfiguration();
						}
						if (!value) {
							entity.BillingSchemaFk = 0;
						}
					}
					if (value && !_.isNil(entity.Id)&&!isFromWizard) {
						// entity.PrcHeaderEntity.ConfigurationFk = value;
						// procurementCommonTotalDataService.reload();
						reloadBillingSchema(entity);
					}

					if (value && !entity.Code || entity.Version === 0) {
						entity.ConfigurationFk = value;
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						procurementContractNumberGenerationSettingsService.assertLoaded().then(function () {
							var rubricIndex = dataService.getRubricIndex(entity);
							platformRuntimeDataService.readonly(entity, [{
								field: 'Code',
								readonly: procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk, rubricIndex)
							}]);
							entity.Code = procurementContractNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code, rubricIndex);

							if (entity.Code === null || entity.Code === '') {
								var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
								platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
								platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, dataService);
								dataService.fireItemModified(entity);
							} else {
								platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
								platformDataValidationService.finishValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', service, dataService);
								platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
								platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
								dataService.fireItemModified(entity);
							}
						});
					}
					var defaultListNotModified = null;
					var sourceSectionId = 32;// 32 is  prcurement Configration
					var targetSectionId = 8;// 8 is  Contract.
					// var rfqMainService = $injector.get('procurementRfqMainService');
					var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
					defaultListNotModified = charDataService.getUnfilteredList();

					if (value && !_.isNil(entity.Id)) {
						var sourceHeaderId = value;
						var targetHeaderId = dataService.getSelected().Id;
						$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
							if (entity.Version === 0) { // because when version=0   ==>the defalut from contract not in container.so get data modifications.
								var modState = platformModuleStateService.state(dataService.getModule());
								var updateData = angular.copy(modState.modifications);
								if (updateData && updateData.CharacteristicDataToSave) {
									defaultListNotModified = updateData.CharacteristicDataToSave;
								}
							}

							var newItem = [];
							angular.forEach(defaultListNotModified, function (item) {
								if (item.CharacteristicSectionFk === targetSectionId) {
									newItem.push(item);
								}
							});

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

						/* var parsentService = $injector.get('procurementCommonHeaderTextNewDataService').getService(); */
						/* angular.forEach(parsentService.getList(), function (item) {
							parsentService.deleteItem(item);
						}); */
						var projectFk = null;
						if (entity.ProjectFk !== null && entity.ProjectFk !== undefined) {
							// eslint-disable-next-line no-unused-vars
							projectFk = entity.ProjectFk;
						}

						// not from change configuration wizard
						if (!isFromWizard) {
							dataService.reloadHeaderText(entity, {
								isOverride: true
							});
						}
					}

					/* var sourceSectionId=32;32 is  prcurement Configration
					 var targetSectionId=8; 8 is  contract
					 if(value){
					 	var sourceHeaderId=value;
					 	var targetHeaderId=dataService.getSelected().Id;
					 	$http.get(globals.webApiBaseUrl +  'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId+'&sourceSectionId='+sourceSectionId+'&targetSectionId='+targetSectionId).then(function (response) {
					 		var configData = response.data;
					 		var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService,targetSectionId);
					 		var oldCharData=charDataService.getList();
					 		angular.forEach(configData,function (item) {
					 			var oldItem = _.find(oldCharData, {Code: item.CharacteristicEntity.Code});
					 			if (!oldItem) {
					 				oldCharData.push(item);
					 			}
					 		});
					 		charDataService.setList(oldCharData);
					 		angular.forEach(oldCharData,function (item) {
					 			charDataService.markItemAsModified(item);
					 		});
					 		charDataService.gridRefresh();
					 		}
					 	);
					 } */
					dataService.fireItemModified(entity);

					return true;
				};

				service.validateDialogConfigurationFk = function (entity, value) {
					if (entity && entity.ConfigurationFk !== value || entity.Code === null) {
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						if (value && (!entity.Code || entity.Version === 0)) {
							procurementContractNumberGenerationSettingsService.assertLoaded().then(function () {
								var rubricIndex = dataService.getRubricIndex(entity);
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk, rubricIndex)
								}]);
								entity.Code = procurementContractNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code, rubricIndex);
								if (entity.Code === null || entity.Code === '') {
									var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'ConfigurationFk'});
									platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'ConfigurationFk');
									platformDataValidationService.finishValidation(validdateResult, entity, entity.ConfigurationFk, 'ConfigurationFk', service, dataService);
									dataService.fireItemModified(entity);
								} else {
									platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
									platformDataValidationService.finishValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', service, dataService);
									platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
									platformDataValidationService.finishValidation(true, entity, entity.ConfigurationFk, 'Code', service, dataService);
									dataService.fireItemModified(entity);

								}
							});
						}
					}
					return true;
				};

				service.validateDialogBusinessPartnerFk = function (entity, value) {
					if (entity) {
						let readOnly = value === null;
						if (readOnly) {
							entity.ContactFk = entity.SubsidiaryFk = entity.SupplierFk = null;
						}

						let readOnlyField = [
							{field: 'ContactFk', readonly: readOnly},
							{field: 'SubsidiaryFk', readonly: readOnly},
							{field: 'SupplierFk', readonly: readOnly}];
						platformRuntimeDataService.readonly(entity, readOnlyField);
					}
					return true;
				};

				service.SelectedItemChanged2BusinessPartnerFk= function (e, args){
					let entity= args.entity;
					let selectedItem = args.selectedItem;

					if (!selectedItem) {
						entity.BusinessPartnerFk = null;
						entity.ContactFk = null;
						entity.SubsidiaryFk = null;
						entity.SupplierFk = null;
					}
					else{
						entity.BusinessPartnerFk = selectedItem.Id;
						entity.SubsidiaryFk = selectedItem.SubsidiaryFk;
						if(selectedItem && selectedItem.ContactFromBpDialog){
							entity.ContactFk = selectedItem.ContactFk;
							selectedItem.ContactFromBpDialog = false;
						}else{
							businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function () {
								dataService.fireItemModified(entity);
							});
						}
						setDefaultSupplier(entity,selectedItem.Id, entity.SubsidiaryFk);
					}
					service.validateDialogBusinessPartnerFk(entity,entity.BusinessPartnerFk);
				};
				function setDefaultSupplier(entity, bpId, subsidiaryId) {
					// load bp's suppliers and set the first supplier as default when SupplierId not set.
					var searchRequest = {
						FilterKey: 'businesspartner-main-supplier-common-filter',
						SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
						SearchText: '',
						AdditionalParameters: {
							BusinessPartnerFk: bpId,
							SubsidiaryFk: subsidiaryId
						}
					};
					lookupDataService.getSearchList('supplier', searchRequest).then(function (dataList) {
						let data = dataList.items ? dataList.items : [];
						data = data.sort(function (supplier1, supplier2) {
							return supplier1.Code.toUpperCase() - supplier2.Code.toUpperCase();
						});
						var subsidiaryFk = entity.SubsidiaryFk;
						var supplierFk = data[0] ? data[0].Id : undefined;
						var existSupplier =  _.find(data, {Id: entity.SupplierFk});
						if(existSupplier !== null && existSupplier !== undefined){
							supplierFk = existSupplier.Id;
						}else{
							if(subsidiaryFk !== null && subsidiaryFk !== undefined){
								var assignedSubsSupp =  _.find(data, {SubsidiaryFk: subsidiaryFk});
								if(assignedSubsSupp !== null && assignedSubsSupp !== undefined){
									supplierFk = assignedSubsSupp.Id;
								}
							}
						}
						if (data && data.length > 0) {
							basicsLookupdataLookupDescriptorService.attachData({'supplier': data});
							entity.SupplierFk = supplierFk;
						}else{
							entity.SupplierFk = null;
						}
					});
				}

				function GetContactCheck(contacts, isFromBpDialog) {
					if (!_.isEmpty(contacts)) {
						let checkedList = _.filter(contacts, {bpContactCheck: true});
						if (_.isEmpty(checkedList)) {
							if(isFromBpDialog){
								return null;
							}else{
								checkedList = _.orderBy(contacts, ['IsDefault', 'Id'], ['desc', 'asc']);
							}
						}
						return checkedList.length > 0 ? checkedList[0].Id : contacts[0].Id;
					}
					return null;
				}

				service.validateModel = function (entity) {
					dataService.setEntityReadOnly(entity);
					var result = service.validateCode(entity, entity.Code, 'Code');
					platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
					dataService.fireItemModified(entity);
				};

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(/* e, item */) {
					// service.validateModel(item);
					// reloadGeneralsAndCertificates(item);
				}

				service.validateDateOrdered = function (entity, value, model) {
					entity.DateEffective = value || entity.DateEffective;
					return self.checkMandatory(entity, value, model, true);
				};

				service.validateContractHeaderFk = function (entity, value) {
					entity.ConHeaderFk = value;
					entity.ContractHeaderFk = value;
					if (value) {
						$http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + value).then(function (response1) {
							var baseContractEntity = response1.data;
							//todo create by modules Configuration
							entity.parent = baseContractEntity;
							entity.parent.ChildItems = [];

							if (entity.ProjectFk !== baseContractEntity.ProjectFk) {
								projectStatus(entity, baseContractEntity.ProjectFk);
							}
							entity.ProjectFk = baseContractEntity.ProjectFk;
							entity.PackageFk = baseContractEntity.PackageFk;
							if (baseContractEntity.packagePlannedStart) {
								entity.ExecutionStart = baseContractEntity.packagePlannedStart;
							}
							if (baseContractEntity.packagePlannedEnd) {
								entity.ExecutionEnd = baseContractEntity.packagePlannedEnd;
							}
							if (baseContractEntity.ValidFrom) {
								entity.ValidFrom = baseContractEntity.ValidFrom;
							}
							if (baseContractEntity.ValidTo) {
								entity.ValidTo = baseContractEntity.ValidTo;
							}
							if (baseContractEntity.Description && !entity.Description) {
								entity.Description = baseContractEntity.Description;
							}
							// begin of defect #102225 - Tax Code Issue in CO & CALL OFF
							// entity.TaxCodeFk = baseContractEntity.TaxCodeFk;
							if (service.validateTaxCodeFk(entity, baseContractEntity.TaxCodeFk, 'TaxCodeFk', true)) {
								entity.TaxCodeFk = baseContractEntity.TaxCodeFk;
							}
							// end of defect #102225
							entity.ClerkPrcFk = baseContractEntity.ClerkPrcFk;
							entity.ClerkPrcItem = baseContractEntity.ClerkPrcItem;
							entity.ClerkReqFk = baseContractEntity.ClerkReqFk;
							entity.ClerkReqItem = baseContractEntity.ClerkReqItem;
							entity.BasCurrencyFk = baseContractEntity.BasCurrencyFk;
							entity.ExchangeRate = baseContractEntity.ExchangeRate;
							entity.MaterialCatalogFk = baseContractEntity.MaterialCatalogFk;
							entity.PaymentTermFiFk = baseContractEntity.PaymentTermFiFk;
							entity.PaymentTermPaFk = baseContractEntity.PaymentTermPaFk;
							entity.PaymentTermAdFk = baseContractEntity.PaymentTermAdFk;
							entity.SalesTaxMethodFk = baseContractEntity.SalesTaxMethodFk;

							if (entity.MaterialCatalogFk) {
								var param = {
									paymentTermFI: entity.PaymentTermFiFk,
									paymentTermPA: entity.PaymentTermPaFk,
									paymentTermAD: entity.PaymentTermAdFk
								};
								dataService.basisChanged.fire(null, param);
							}
							entity.ConTypeFk = baseContractEntity.ConTypeFk;
							entity.AwardmethodFk = baseContractEntity.AwardmethodFk;
							entity.ContracttypeFk = baseContractEntity.ContracttypeFk;
							entity.ControllingUnitFk = baseContractEntity.ControllingUnitFk;
							entity.BusinessPartnerFk = baseContractEntity.BusinessPartnerFk;
							if (baseContractEntity.BankFk === null) {
								procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, entity.BusinessPartnerFk);
							} else {
								entity.BankFk = baseContractEntity.BankFk;
							}
							entity.SubsidiaryFk = baseContractEntity.SubsidiaryFk;
							entity.SupplierFk = baseContractEntity.SupplierFk;
							entity.IncotermFk = baseContractEntity.IncotermFk;
							entity.CompanyInvoiceFk = baseContractEntity.CompanyInvoiceFk;
							entity.BillingSchemaFk = baseContractEntity.BillingSchemaFk;
							entity.BillingSchemaFk = baseContractEntity.BillingSchemaFk;
							entity.PrcCopyModeFk = baseContractEntity.PrcCopyModeFk;
							// total
							var oldConfiguration = entity.PrcHeaderEntity.ConfigurationFk;
							if (oldConfiguration !== baseContractEntity.PrcHeaderEntity.ConfigurationFk) {
								entity.PrcHeaderEntity.ConfigurationFk = baseContractEntity.PrcHeaderEntity.ConfigurationFk;
								if (!_.isNil(entity.Id)) {
									procurementCommonTotalDataService.copyTotalsFromConfiguration();
								}
							}
							entity.PrcHeaderEntity.StructureFk = baseContractEntity.PrcHeaderEntity.StructureFk;

							if (entity.Version === 0) {
								service.validatePrcHeaderEntity$ConfigurationFk(entity, entity.PrcHeaderEntity.ConfigurationFk, 'ConfigurationFk', false);
							}

							contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);

							// readonly
							dataService.setEntityReadOnly(entity);

							// remove error
							applyManualValidation(service.validateBusinessPartnerFk(entity, baseContractEntity.BusinessPartnerFk, 'BusinessPartnerFk', true), entity, 'BusinessPartnerFk', baseContractEntity.BusinessPartnerFk);

							// contact should come from baseContractEntity
							entity.ContactFk = baseContractEntity.ContactFk;
							// general certificate
							if (entity.PrcHeaderEntity.Id > 0) {
								service.overWriteGeneralsAndCertificates(baseContractEntity, entity);
							}
							// address
							var oldAddressEntityId = entity.AddressFk;
							if (baseContractEntity.AddressEntity) {
								if (oldAddressEntityId) {
									entity.AddressEntity.Id = oldAddressEntityId;
									entity.AddressEntity.Address = baseContractEntity.AddressEntity.Address;
									entity.AddressEntity.AddressLine = baseContractEntity.AddressEntity.AddressLine;
									entity.AddressEntity.City = baseContractEntity.AddressEntity.City;
									entity.AddressEntity.County = baseContractEntity.AddressEntity.County;
									entity.AddressEntity.Street = baseContractEntity.AddressEntity.Street;
								} else {
									$http.get(globals.webApiBaseUrl + 'basics/common/address/create').then(function (addressResponse) {
										var _address = addressResponse.data;
										if (_address) {
											entity.AddressEntity = _address;
											entity.AddressEntity.Address = baseContractEntity.AddressEntity.Address;
											entity.AddressEntity.AddressLine = baseContractEntity.AddressEntity.AddressLine;
											entity.AddressEntity.City = baseContractEntity.AddressEntity.City;
											entity.AddressEntity.County = baseContractEntity.AddressEntity.County;
											entity.AddressEntity.Street = baseContractEntity.AddressEntity.Street;
											dataService.fireItemModified(entity);
										}
									});

								}
							} else {
								entity.AddressEntity = null;
								entity.AddressFk = null;
							}

							if (!_.isNil(entity.Id)) {
								// characteristic
								var targetSectionId = 8;// 8 is  Contract.
								var target2SectionId = 46;// 46 is  Contract.
								procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, targetSectionId, baseContractEntity.Characteristic, entity.Id);
								procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, target2SectionId, baseContractEntity.Characteristic2, entity.Id);
							}
							dataService.fireItemModified(entity);
						});
					} else {
						updateCodeByConfiguration(entity, entity.PrcHeaderEntity.ConfigurationFk);
						// if has basicContract will set general items as readOnly
						// if remove the basicContract, Should revert readOnly status
						procurementCommonGeneralsDataService.setGeneralItemsReadOnly(false);
						// revert certificate readOnly status
						procurementCommonCertificateDataService.setCertificateItemsReadOnly(false);
						contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
						dataService.setEntityReadOnly(entity);
						dataService.fireItemModified(entity);
					}
					procurementCommonPrcItemDataService.updateCopyMainCallOffItemsTool(entity.ProjectChangeFk !== null || entity.ConHeaderFk === null);
					return true;
				};

				service.validateProjectChangeFk = function (entity, value) {
					entity.ProjectChangeFk = value;
					contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
					if (value === null && entity.ConHeaderFk !== null) {
						procurementCommonGeneralsDataService.setGeneralItemsReadOnly(false);
						procurementCommonCertificateDataService.setCertificateItemsReadOnly(false);
						dataService.setEntityReadOnly(entity);
						dataService.fireItemModified(entity);
					} else if (entity.ConHeaderFk !== null) {
						procurementCommonGeneralsDataService.setGeneralItemsReadOnly(true);
						procurementCommonCertificateDataService.setCertificateItemsReadOnly(true);
						dataService.setEntityReadOnly(entity);
						dataService.fireItemModified(entity);
					}
					updateCodeByConfiguration(entity, entity.PrcHeaderEntity.ConfigurationFk);
					procurementCommonPrcItemDataService.updateCopyMainCallOffItemsTool(entity.ProjectChangeFk !== null || entity.ConHeaderFk === null);
				};

				service.validateBillingSchemaFk = function (entity, value) {
					if (entity.BillingSchemaFk !== value && value !== null) {
						entity.BillingSchemaFk = value;
						dataService.BillingSchemaChanged.fire();
					}
					return true;
				};

				service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk, billingSchemaFk) {
					var arrPromise = [];
					entity.BillingSchemaFk = billingSchemaFk;
					dataService.markCurrentItemAsModified();

					if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== prcConfigFk) {
						var promise1 = procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
						arrPromise.push(promise1);
					}
					if (prcConfigFk && !_.isNil(entity.Id)) {
						var promise2 = reloadBillingSchema(entity, prcConfigFk);
						arrPromise.push(promise2);
					}
					var promise3 = service.validatePrcHeaderEntity$ConfigurationFk(entity, prcConfigFk, 'ConfigurationFk', true);
					arrPromise.push(promise3);
					return $q.all(arrPromise);
				};

				// Invalid code
				self.applyBillingSchema = function (entity, value) {
					var defer = $q.defer();
					if (!value) {
						defer.resolve(false);
						return defer.promise;
					}

					if (entity.BillingSchemaFk === value) {
						defer.resolve(true);
						return defer.promise;
					}
					entity.BillingSchemaFk = value;
					dataService.BillingSchemaChanged.fire();
					dataService.markCurrentItemAsModified();
					defer.resolve(true);
					return defer.promise;
				};

				service.getDefaultBillingSchemas = function (prcConfigurationFk) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschemas?configurationFk=' +
						prcConfigurationFk);
				};

				service.validateBpdVatGroupFk = function validateBpdVatGroupFk(entity) {
					entity.originVatGroupFk = entity.BpdVatGroupFk;
				};

				service.validateExecutionStart = function validateExecutionStart(entity, value, model) {
					if (!entity.ExecutionEnd) {
						return true;
					}
					var executionStart = new Date(value);
					var executionEnd = new Date(entity.ExecutionEnd);

					return platformDataValidationService.validatePeriod(executionStart, executionEnd, entity, model, service, dataService, 'ExecutionEnd');
				};

				service.validateExecutionEnd = function validateExecutionEnd(entity, value, model) {
					if (!entity.ExecutionStart) {
						return true;
					}
					var executionStart = new Date(entity.ExecutionStart);
					var executionEnd = new Date(value);

					return platformDataValidationService.validatePeriod(executionStart, executionEnd, entity, model, service, dataService, 'ExecutionStart');
				};

				service.validateValidFrom = function validateValidFrom(entity, value, model) {
					if (!entity.ValidTo) {
						return true;
					}
					const validFrom = new Date(value);
					const validTo = new Date(entity.ValidTo);

					return platformDataValidationService.validatePeriod(validFrom, validTo, entity, model, service, dataService, 'ValidTo');
				};

				service.validateValidTo = function validateValidTo(entity, value, model) {
					if (!entity.ValidFrom) {
						return true;
					}
					const validFrom = new Date(entity.ValidFrom);
					const validTo = new Date(value);

					return platformDataValidationService.validatePeriod(validFrom, validTo, entity, model, service, dataService, 'ValidFrom');
				};

				service.validatePrcHeaderEntity$StrategyFk = function validateStrategyFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if ((_.isNil(value) || value < 1) &&
						(_.isNil(entity.PrcHeaderEntity.StrategyFk) || entity.PrcHeaderEntity.StrategyFk < 1)
					) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.EntityStrategy')};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateContracttypeFk = function validateContracttypeFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if ((_.isNil(value) || value < 1)) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.entityType')};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateAwardmethodFk = function validateAwardmethodFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if ((_.isNil(value) || value < 1)) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.entityAwardMethod')};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validatePrcCopyModeFk = function validatePrcCopyModeFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if ((_.isNil(value) || value < 1)) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('procurement.contract.entityPrcCopyModeFk')};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateOverallDiscount = function validateOverallDiscount(entity, value, model) {
					return overDiscountValidationService.validateOverallDiscount(entity, value, model, service, dataService, procurementCommonTotalDataService);
				};

				service.validateOverallDiscountOc = function validateOverallDiscountOc(entity, value, model) {
					return overDiscountValidationService.validateOverallDiscountOc(entity, value, model, service, dataService, procurementCommonTotalDataService);
				};

				service.validateOverallDiscountPercent = function validateOverallDiscountPercent(entity, value, model) {
					return overDiscountValidationService.validateOverallDiscountPercent(entity, value, model, service, dataService, procurementCommonTotalDataService);
				};

				service.validateBoqWicCatFk = function validateBoqWicCatFk(entity, value, model) {
					var originBoqWicCatFk = entity.BoqWicCatFk;
					entity.BoqWicCatFk = value;
					if (entity.BoqWicCatBoqFk !== null) {
						entity.BoqWicCatBoqFk = null;
						if (!entity.MaterialCatalogFk) {
							entity.FrameworkConHeaderFk = null;
						}
					}
					if (originBoqWicCatFk !== value) {
						frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
					}
					contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
					return true;
				};

				function changeBoqWicCatBoqFk(entity, value, model) {
					var defer = $q.defer();
					if (value && entity.BoqWicCatBoqFk !== value) {
						entity.BoqWicCatBoqFk = value;
						contractHeaderPurchaseOrdersDataService.updatePurchaseOrders(entity);
						var con2BoqWicCatBoq = getConHeader2BoqWicCatBoq(entity.BoqWicCatBoqFk);
						var getContractPromise = [];
						if (!entity.FrameworkConHeaderFk && con2BoqWicCatBoq && con2BoqWicCatBoq.ConHeaderFk) {
							entity.FrameworkConHeaderFk = con2BoqWicCatBoq.ConHeaderFk;
							getContractPromise.push(asyncGetFrameworkContract(con2BoqWicCatBoq.ConHeaderFk).then(function (con) {
								if (con && con.PrcHeaderEntity && con.PrcHeaderEntity.StructureFk) {
									entity.PrcHeaderEntity.StructureFk = con.PrcHeaderEntity.StructureFk;
								}
								if (con && con.ContactFk) {
									entity.ContactFk = con.ContactFk;
								}
								return true;
							}));
						}
						var wicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
						if (wicCatBoqs) {
							var wicCatBoq = _.find(wicCatBoqs, {Id: value});
							if (wicCatBoq && wicCatBoq.WicBoq) {
								var hasPaymentTermFk = !!(wicCatBoq.WicBoq.BasPaymentTermFk || wicCatBoq.WicBoq.BasPaymentTermFiFk || wicCatBoq.WicBoq.BasPaymentTermAdFk);
								if (hasPaymentTermFk) {
									entity.PaymentTermPaFk = wicCatBoq.WicBoq.BasPaymentTermFk;
									entity.PaymentTermFiFk = wicCatBoq.WicBoq.BasPaymentTermFiFk;
									entity.PaymentTermAdFk = wicCatBoq.WicBoq.BasPaymentTermAdFk;
								}
								if (wicCatBoq.WicBoq.BpdBusinessPartnerFk) {
									entity.BusinessPartnerFk = wicCatBoq.WicBoq.BpdBusinessPartnerFk;
									platformRuntimeDataService.applyValidationResult(true, entity, 'BusinessPartnerFk');
									platformDataValidationService.finishValidation(true, entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
									if (wicCatBoq.WicBoq.BpdSubsidiaryFk) {
										entity.SubsidiaryFk = wicCatBoq.WicBoq.BpdSubsidiaryFk;
										platformRuntimeDataService.applyValidationResult(true, entity, 'SubsidiaryFk');
										platformDataValidationService.finishValidation(true, entity, entity.SubsidiaryFk, 'SubsidiaryFk', service, dataService);
									}
									else {
										entity.SubsidiaryFk = null;
									}
									if (wicCatBoq.WicBoq.BpdSupplierFk) {
										entity.SupplierFk = wicCatBoq.WicBoq.BpdSupplierFk;
										businessPartnerValidatorService.resetArgumentsToValidate();
										return $q.all(getContractPromise).then(function () {
											return procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, entity.BusinessPartnerFk).then(function () {
												businessPartnerValidatorService.resetRelatedFieldsBySupplier(entity, entity.SupplierFk, hasPaymentTermFk).then(function () {
													if (hasPaymentTermFk) {
														entity.PaymentTermPaFk = wicCatBoq.WicBoq.BasPaymentTermFk;
														entity.PaymentTermFiFk = wicCatBoq.WicBoq.BasPaymentTermFiFk;
														entity.PaymentTermAdFk = wicCatBoq.WicBoq.BasPaymentTermAdFk;
													}
													frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
													dataService.gridRefresh();
												});
											});
										});
									}
									else {
										entity.SupplierFk = null;
									}
								}
							}
						}
						frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
						return $q.all(getContractPromise).then(function(){});
					}
					defer.resolve(true);
					return defer.promise;
				}

				service.asyncValidateBoqWicCatBoqFk = function asyncValidateBoqWicCatBoqFk(entity, value, model) {
					var prcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
					var prcBoqService = prcBoqServiceFactory.getService(dataService);
					var boqs = prcBoqService.getList();
					var defer = $q.defer();
					if (value && entity.BoqWicCatBoqFk !== value) {
						if (boqs && boqs.length) {
							var options = {
								headerText: $translate.instant('procurement.contract.conEntityBoqWicCatBoqFk'),
								bodyText: $translate.instant('procurement.contract.willClearAllBoqs'),
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question',
								id: willClearAllBoqsDialogId,
								dontShowAgain: true
							};
							return moduleContext.showDialogAndAgain(options).then(function (response) {
								if (response.yes === true) {
									return changeBoqWicCatBoqFk(entity, value, model).then(function () {
										var deleteBoqPromises = [];
										_.forEach(boqs, function(b) {
											deleteBoqPromises.push(prcBoqService.deleteItem(b));
										});
										return $q.all(deleteBoqPromises).then(function() {
											return true;
										});
									});
								}
								else {
									return {apply: false, valid: true};
								}
							});
						}
						else {
							return changeBoqWicCatBoqFk(entity, value, model);
						}
					}
					if (!value) {
						if (!entity.MaterialCatalogFk) {
							entity.FrameworkConHeaderFk = null;
						}
					}
					defer.resolve(true);
					return defer.promise;
				};

				dataService.registerEntityCreated(onEntityCreated);

				service.validateAddressEntity = function validateAddressEntity(entity, value) {
					if (entity.AddressEntity !== value) {
						entity.AddressEntity=value;
						/* if(value===null){
							entity.AddressFk=value;
						}else{
							entity.AddressFk=value.Id;
						} */
					}
					return true;
				};

				function updateCodeByConfiguration(entity, value) {
					if (entity.Version === 0) {
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						procurementContractNumberGenerationSettingsService.assertLoaded().then(function () {
							var rubricIndex = dataService.getRubricIndex(entity);
							platformRuntimeDataService.readonly(entity, [{
								field: 'Code',
								readonly: procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk, rubricIndex)
							}]);
							entity.Code = procurementContractNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code, rubricIndex);

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
						});
					}
				}

				// apply valiation result to correct module validation state.
				function applyManualValidation(result, item, model, value) {
					platformRuntimeDataService.applyValidationResult(result, item, model);
					platformDataValidationService.finishValidation(result, item, value, model, service, dataService);
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

				function frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model) {
					dataService.updateFieldsReadOnly(entity,
						['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk', 'IncotermFk', 'PaymentTermFiFk', 'PaymentTermPaFk', 'PaymentTermAdFk', 'Subsidiary2Fk', 'BusinessPartner2Fk', 'Supplier2Fk', 'TaxCodeFk', 'Contact2Fk', 'ContactFk', 'ContractHeaderFk', 'BoqWicCatBoqFk', 'BankFk'],
						value, model);
				}

				function getConHeader2BoqWicCatBoq(boqWicCatBoqFk) {
					var result = null;
					var con2icCatBoqs = basicsLookupdataLookupDescriptorService.getData('ConHeader2BoqWicCatBoq');
					if (con2icCatBoqs) {
						con2icCatBoqs = _.orderBy(con2icCatBoqs, ['Id'], ['desc']);
						var con2icCatBoq = _.find(con2icCatBoqs, {BoqWicCatBoqFk: boqWicCatBoqFk});
						if (con2icCatBoq) {
							result = con2icCatBoq;
						}
					}
					return result;
				}

				service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
					let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
					let prcHeaderService = $injector.get('procurementContextService').getMainService();
					let prcContractBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
					// let boqMainSrvc = $injector.get('prcBoqMainService').getService(dataService);
					let selectHeader = prcHeaderService.getSelected();
					return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcContractBoqService, dataService, service, {
						ProjectId: selectHeader.ProjectFk,
						Module: 'procurement.contract',
						BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
						HeaderId: entity.Id,
						ExchangeRate: entity.ExchangeRate
					});
				};

				function asyncGetFrameworkContract(conHeaderFk) {
					if (conHeaderFk) {
						return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' +conHeaderFk).then(function(res) {
							return res.data;
						});
					}
					else {
						var defer = $q.defer();
						defer.resolve({});
						return defer.promise;
					}
				}

				function reloadActualCertificate() {
					const deferred = $q.defer();
					let parentService = $injector.get('procurementContractHeaderDataService');
					let certificateDataService = certificateContainerServiceFactory.getDataService('procurement.contract', parentService);
					certificateDataService.loadSubItemList().then(function () {
						deferred.resolve(true);
					});
					return deferred.promise;
				}

				return service;
			}
		]);

})(angular);
