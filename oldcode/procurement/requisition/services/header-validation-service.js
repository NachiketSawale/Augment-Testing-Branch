/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */


	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').factory('procurementRequisitionHeaderValidationService',
		['$injector', '$http', '$q', '$translate', 'procurementContextService', 'platformDataValidationService',
			'basicsLookupdataLookupDescriptorService', 'procurementRequisitionHeaderDataService', 'basicsLookupdataLookupDataService',
			'businessPartnerLogicalValidator', 'procurementCommonGeneralsDataService', 'procurementCommonCertificateNewDataService',
			'procurementCommonCodeHelperService', 'procurementCommonTotalDataService', 'platformRuntimeDataService', 'platformDialogService',
			'procurementCommonPrcItemDataService', 'basicsMaterialPriceConditionFactoryDataService', 'procurementCommonExchangerateFormatterService', '$timeout',
			'procurementRequisitionNumberGenerationSettingsService','platformTranslateService','procurementCommonTaxCodeChangeService', 'platformContextService','procurementCommonCharacteristicDataService', 'prcCommonCalculationHelper',
			'overDiscountValidationService', 'platformCreateUuid',
			'procurementCommonExchangerateValidateService','prcCommonDomainMaxlengthHelper', 'boqMainLookupFilterService',
			function ($injector, $http, $q, $translate, moduleContext, platformDataValidationService, basicsLookupdataLookupDescriptorService,
				dataService, lookupDataService, businessPartnerLogicalValidator,
				procurementCommonGeneralsDataService, procurementCommonCertificateDataService, codeHelperService, procurementCommonTotalDataService,
				platformRuntimeDataService, platformDialogService, procurementCommonPrcItemDataService, basicsMaterialPriceConditionFactoryDataService, procurementCommonExchangerateFormatterService, $timeout,
				procurementRequisitionNumberGenerationSettingsService,platformTranslateService,procurementCommonTaxCodeChangeService, platformContextService,procurementCommonCharacteristicDataService, prcCommonCalculationHelper,
				overDiscountValidationService, platformCreateUuid,
				procurementCommonExchangerateValidateService,prcCommonDomainMaxlengthHelper, boqMainLookupFilterService) {
				var service = {},
					self = this;
				var packageUpdatingAddress = false;
				var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/requisition/requisition/updateExchangeRate';
				let deliverDateUpdateToItemInfoDialogId = platformCreateUuid();
				let updatePaymentTermFIToItemsDialogId = platformCreateUuid();
				let updatePaymentTermPAToItemsDialogId = platformCreateUuid();
				let updatePaymentTermFIandPAToItemsDialogId = platformCreateUuid();
				let updateIncotermToItemDialogId = platformCreateUuid();
				let willClearAllBoqsDialogId = platformCreateUuid();


				var validateBusinessPartnerFkService = businessPartnerLogicalValidator.getService({dataService: dataService, PaymentTermFiFk:'BasPaymentTermFiFk', PaymentTermPaFk: 'BasPaymentTermPaFk'});
				procurementCommonGeneralsDataService = procurementCommonGeneralsDataService.getService(dataService);
				procurementCommonCertificateDataService = procurementCommonCertificateDataService.getService(dataService);
				procurementCommonTotalDataService = procurementCommonTotalDataService.getService(dataService);
				procurementCommonPrcItemDataService = procurementCommonPrcItemDataService.getService(dataService);
				service.validateSubsidiaryFk = validateBusinessPartnerFkService.subsidiaryValidator;
				// get validators from business partner
				// service.validateBusinessPartnerFk = validateBusinessPartnerFkService.businessPartnerValidator;
				// service.validateSupplierFk = validateBusinessPartnerFkService.supplierValidator;

				// get validators from business partner
				service.validateBusinessPartnerFk = function (entity, value, model, pointedSupplierFk, pointedSubsidiaryFk, isFromConfigDialog) {
					if (value !== entity.BusinessPartnerFk) {
						if (!isFromConfigDialog) {
							var dataEntity = {};
							dataEntity.MainItemId = entity.PrcHeaderFk;
							dataEntity.BusinessPartnerFk = value;
							dataEntity.OriginalBusinessPartnerFk = entity.BusinessPartnerFk;
							procurementCommonGeneralsDataService.reloadGeneralsByBusinessPartnerFk(dataEntity);
						}

						var businessPartner = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartner'), {Id: value});
						if(businessPartner && businessPartner.PrcIncotermFk){
							service.validateIncotermFk(entity,businessPartner.PrcIncotermFk);
							entity.IncotermFk = businessPartner.PrcIncotermFk;
						}
					}
					validateBusinessPartnerFkService.resetArgumentsToValidate();
					validateBusinessPartnerFkService.businessPartnerValidator.apply(null, [entity, value, true, false, pointedSupplierFk, pointedSubsidiaryFk]);
				};

				service.validateSupplierFk = function (entity, value, model, dontSetPaymentTerm) {
					validateBusinessPartnerFkService.resetArgumentsToValidate();
					validateBusinessPartnerFkService.supplierValidator(entity, value, dontSetPaymentTerm);
				};

				var attachLookupByKey = function attachLookupByKey(lookup, key) {
					if (!key) { // undefined or null
						dataService.gridRefresh();
						return;
					}
					basicsLookupdataLookupDescriptorService.loadItemByKey(lookup, key).then(function () {
						dataService.gridRefresh();
					});
				};

				self.checkMandatory = function (entity, value, model, apply, errrParam) {
					var result = platformDataValidationService.isMandatory(value, model, errrParam);
					if (apply) {
						result.apply = true;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				self.getCurrentRate = function getCurrentRate(entity, value) {
					var exchangeRateUri = globals.webApiBaseUrl + 'procurement/common/exchangerate/rate';
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
					var validateResult = platformDataValidationService.isUnique(dataService.getList(), 'Code', value, entity.Id);
					if (!validateResult.valid) {
						validateResult.error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');
					}
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					dataService.fireItemModified(entity);
					return validateResult;
				};

				service.asyncValidateCode = function (entity, value, model) {
					var error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'procurement/requisition/requisition/isunique', entity, value, model, error)
						.then(function (validateResult) {
							platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
							return validateResult;
						});
					dataService.fireItemModified(entity);

					return asyncMarker.myPromise;
				};

				service.validateDialogCode = function (entity, value, model) {
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
					/** @namespace translationObject.cloud.common.isGenerated */
					if((value === null || _.isUndefined(value) || value === '') && entity.Code !== null && entity.Code !== translationObject.cloud.common.isGenerated){
						var emptyError = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');
						var result1 = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: emptyError || {object: model.toLowerCase()}
						};
						defer.resolve(result1);
					}else{
						var error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');

						var id = entity.Id;
						if(_.isUndefined(id)){
							id = 0;
						}

						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.ConfigurationFk});
						var hasToGenerate = procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
						if(hasToGenerate && entity.Version === 0){
							defer.resolve(true);
						}else{
							$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/isunique' + '?id=' + id + '&code=' + value)
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
									}else{
										defer.resolve(true);
									}
								});
						}
					}
					dataService.fireItemModified(entity);
					asyncMarker.myPromise = defer.promise.then(function (validateResult) {
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
						if(validateResult === true || validateResult.valid){
							platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
							platformDataValidationService.finishAsyncValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', asyncMarker, service, dataService);
						}
						return validateResult;
					});

					return asyncMarker.myPromise;

				};
				var validateStructureFk;
				// validatePackageFk
				service.validatePackageFk = function validatePackageFk(entity, value, model, isFromConfigDialog) {
					if (!value) {
						dataService.updateReadOnly(entity, 'TaxCodeFk', value, model);
						return true;
					}

					if (entity.PackageFk !== value) {
						lookupDataService.getItemByKey('PrcPackage', value).then(function (data) {
							if (!data) {
								return true;
							}

							// apply changed data
							entity.ClerkPrcFk = data.ClerkPrcFk;
							entity.ClerkReqFk = data.ClerkReqFk;

							if (service.validateProjectFk(entity, data.ProjectFk, 'ProjectFk', isFromConfigDialog)) {
								entity.ProjectFk = data.ProjectFk;
							}
							if (service.validateTaxCodeFk(entity, data.TaxCodeFk, 'TaxCodeFk', true, isFromConfigDialog)) {
								entity.TaxCodeFk = data.TaxCodeFk;
							}

							if (!entity.Description) {
								const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Requisition', 'ReqHeaderDto', 'Description');
								entity.Description = data.Description ? data.Description.substr(0, descriptionLength): '';
							}

							if (validateStructureFk(entity, data.StructureFk, 'PrcHeaderEntity.StructureFk', isFromConfigDialog)) {
								entity.PrcHeaderEntity.StructureFk = data.StructureFk;
							}

							dataService.updateReadOnly(entity, 'TaxCodeFk', value, model);
							attachLookupByKey('Project', entity.ProjectFk);
							attachLookupByKey('Clerk', entity.ClerkPrcFk);
							attachLookupByKey('Clerk', entity.ClerkReqFk);
							attachLookupByKey('PrcStructure', entity.PrcHeaderEntity.StructureFk);

							if (!isFromConfigDialog) {
								procurementCommonTotalDataService.copyTotalsFromPackage(data);
							}

							dataService.fireItemModified(entity);

							// delivery address ************
							if (value) {
								packageUpdatingAddress = true;
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
							}
						},
						function (error) {
							window.console.error(error);
						}
						);
					}
					return true;
				};

				service.validateDateRequired = function validateDateRequired(entity, value, model, isFromConfigDialog) {
					if (!entity) {
						return true;
					}
					if (entity.DateRequired !== value) {
						if (!isFromConfigDialog) {
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
										if (!items[i].Hasdeliveryschedule) {
											items[i].DateRequired = value;
											procurementCommonPrcItemDataService.markItemAsModified(items[i]);
										}
									}
								}
							});
						}

						entity.DateRequired = value;
						entity.DateEffective = value || entity.DateEffective;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				var overWriteGeneralsAndCertificates;

				service.validateReqHeaderFk = function (entity, value, model, isFromConfigDialog) {
					entity.ReqHeaderFk = value;
					if (value) {
						$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getitembyId?id=' + value).then(function (response1) {
							var reqHeaderEntity = response1.data;
							if (entity.ProjectFk !== reqHeaderEntity.ProjectFk) {
								projectStatus(entity, reqHeaderEntity.ProjectFk);
							}
							entity.ProjectFk = reqHeaderEntity.ProjectFk;
							entity.PackageFk = reqHeaderEntity.PackageFk;
							entity.TaxCodeFk = reqHeaderEntity.TaxCodeFk;
							entity.ClerkPrcFk = reqHeaderEntity.ClerkPrcFk;
							entity.ClerkReqFk = reqHeaderEntity.ClerkReqFk;
							entity.BasCurrencyFk = reqHeaderEntity.BasCurrencyFk;
							entity.ExchangeRate = reqHeaderEntity.ExchangeRate;
							entity.MaterialCatalogFk = reqHeaderEntity.MaterialCatalogFk;
							entity.BasPaymentTermFiFk = reqHeaderEntity.BasPaymentTermFiFk;
							entity.BasPaymentTermPaFk = reqHeaderEntity.BasPaymentTermPaFk;
							entity.BasPaymentTermAdFk = reqHeaderEntity.BasPaymentTermAdFk;
							if (entity.MaterialCatalogFk && !isFromConfigDialog) {
								var param = {
									paymentTermFI: entity.BasPaymentTermFiFk,
									paymentTermPA: entity.BasPaymentTermPaFk,
									paymentTermAD: entity.BasPaymentTermAdFk
								};
								dataService.basisChanged.fire(null, param);
							}
							entity.ReqTypeFk = reqHeaderEntity.ReqTypeFk;
							entity.PrcAwardmethodFk = reqHeaderEntity.PrcAwardmethodFk;
							entity.ControllingUnitFk = reqHeaderEntity.ControllingUnitFk;
							entity.BusinessPartnerFk = reqHeaderEntity.BusinessPartnerFk;
							entity.SubsidiaryFk = reqHeaderEntity.SubsidiaryFk;
							entity.SupplierFk = reqHeaderEntity.SupplierFk;
							entity.IncotermFk = reqHeaderEntity.IncotermFk;
							// total copy
							var oldConfiguration = entity.PrcHeaderEntity.ConfigurationFk;
							if (oldConfiguration !== reqHeaderEntity.PrcHeaderEntity.ConfigurationFk && !isFromConfigDialog) {
								entity.PrcHeaderEntity.ConfigurationFk = reqHeaderEntity.PrcHeaderEntity.ConfigurationFk;
								procurementCommonTotalDataService.copyTotalsFromConfiguration();
							}
							entity.PrcHeaderEntity.StructureFk = reqHeaderEntity.PrcHeaderEntity.StructureFk;
							// readonly
							dataService.setEntityReadOnly(entity);
							// in requisition module, the BusinessPartnerFk is not Required
							// remove error
							// applyManualValidation(service.validateBusinessPartnerFk(entity, reqHeaderEntity.BusinessPartnerFk), entity, 'BusinessPartnerFk', reqHeaderEntity.BusinessPartnerFk);
							// general certificate
							if (!isFromConfigDialog) {
								overWriteGeneralsAndCertificates(reqHeaderEntity, entity);
							}
							// copy address
							var oldAddressEntityId = entity.AddressFk;
							if (reqHeaderEntity.AddressEntity) {
								if (oldAddressEntityId) {
									entity.AddressEntity.Id = oldAddressEntityId;
									entity.AddressEntity.Address = reqHeaderEntity.AddressEntity.Address;
									entity.AddressEntity.AddressLine = reqHeaderEntity.AddressEntity.AddressLine;
									entity.AddressEntity.City = reqHeaderEntity.AddressEntity.City;
									entity.AddressEntity.County = reqHeaderEntity.AddressEntity.County;
									entity.AddressEntity.Street = reqHeaderEntity.AddressEntity.Street;
								}
								else {
									$http.get(globals.webApiBaseUrl + 'basics/common/address/create').then(function (addressResponse) {
										var _address = addressResponse.data;
										if (_address) {
											entity.AddressEntity = _address;
											entity.AddressEntity.Address = reqHeaderEntity.AddressEntity.Address;
											entity.AddressEntity.AddressLine = reqHeaderEntity.AddressEntity.AddressLine;
											entity.AddressEntity.City = reqHeaderEntity.AddressEntity.City;
											entity.AddressEntity.County = reqHeaderEntity.AddressEntity.County;
											entity.AddressEntity.Street = reqHeaderEntity.AddressEntity.Street;
											dataService.fireItemModified(entity);
										}
									});

								}
							}
							else {
								entity.AddressEntity = null;
								entity.AddressFk = null;
							}

							if (!isFromConfigDialog) {
								// characteristic
								var targetSectionId = 6;// 6 is  req.
								var target2SectionId = 51;// 6 is  req.
								procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, targetSectionId, reqHeaderEntity.Characteristic, entity.Id);
								procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, target2SectionId, reqHeaderEntity.Characteristic2, entity.Id);
							}

							dataService.fireItemModified(entity);
						});
					}
					else {
						dataService.setEntityReadOnly(entity);
						dataService.fireItemModified(entity);
					}
					return true;
				};

				// validateTaxCodeFk
				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model, isInject, isFromConfigDialog) {

					self.checkMandatory(entity, value === -1 ? '' : value, 'TaxCodeFk', true, {
						fieldName: $translate.instant('cloud.common.entityTaxCode')
					});// backend may return -1

					if (entity.TaxCodeFk !== value) {
						lookupDataService.getItemByKey('TaxCode', value).then(
							function (data) {
								if (angular.isObject(data)) {
									if (entity.VatPercent !== data.VatPercent && !isFromConfigDialog) {
										dataService.isTotalDirty = true;
									}
									entity.TaxCodeFk = value;
									entity.VatPercent = data.VatPercent;
									if (isInject === undefined && !isFromConfigDialog) {
										procurementCommonTaxCodeChangeService.taxCodeChanged(value, 'procurement.requisition', dataService, entity);
									}
									else if (!isFromConfigDialog){
										dataService.totalFactorsChangedEvent.fire();
										dataService.taxCodeFkChanged.fire();

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

				// conStatusValidator
				service.validateReqStatusFk = function reqStatusValidator(entity, value) {
					if (entity.ReqStatusFk !== value) {
						value = value || -1;
						lookupDataService.getItemByKey('ReqStatus', value).then(function (data) {
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
				service.validateBasPaymentTermFiFk = function validateBasPaymentTermFiFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.BasPaymentTermFiFk !== value) {
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
						entity.BasPaymentTermFiFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				// validatePaymentTermPaFk
				service.validateBasPaymentTermPaFk = function validateBasPaymentTermPaFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.BasPaymentTermPaFk !== value) {
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
						entity.BasPaymentTermPaFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
					return true;
				};

				// validatePaymentTermAdFk
				service.validateBasPaymentTermAdFk = function validateBasPaymentTermAdFk(entity, value) {
					if (!entity) {
						return true;
					}
					entity.BasPaymentTermAdFk = value;
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

					if (entity.BasPaymentTermPaFk !== paymentTermPaFk || entity.BasPaymentTermFiFk !== paymentTermFiFk) {
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

						entity.BasPaymentTermPaFk = paymentTermPaFk;
						entity.BasPaymentTermFiFk = paymentTermFiFk;
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
						if(items.length>0) {
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

				// validateBasCurrencyFk
				service.validateBasCurrencyFk =function validateBasCurrencyFk(entity, value, model, isFromConfigDialog) {
					dataService.updateReadOnly(entity, 'ExchangeRate', value, model);
					value = value || -1;
					if (value === moduleContext.companyCurrencyId) {
						entity.ExchangeRate = 1.0;
						entity.OverallDiscount = entity.OverallDiscountOc;
						if (!isFromConfigDialog) {
							dataService.exchangeRateChanged.fire(null, {
								ExchangeRate: entity.ExchangeRate,
								IsCurrencyChanged: true
							});
							dataService.totalFactorsChangedEvent.fire();
						}
						validateExchangeRate(entity, 1, 'ExchangeRate', true);
						dataService.gridRefresh();
					} else {
						self.getCurrentRate(entity, value).then(
							function (response) {
								if (response) {
									var rate = response.data;
									entity.ExchangeRate = rate;
									entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / rate);
									if (rate && !isFromConfigDialog) {
										// validateExchangeRate(entity, response.data);
										dataService.totalFactorsChangedEvent.fire();
										dataService.exchangeRateChanged.fire(null, {
											ExchangeRate: entity.ExchangeRate,
											IsCurrencyChanged: true
										});
										dataService.fireItemModified(entity);
									}
									validateExchangeRate(entity, rate, 'ExchangeRate', true);
									dataService.gridRefresh();
								}
							}, function (error) {
								window.console.error(error);
							}
						);
					}
					return true;
				}

				function checkForRelatedVersionBoqs(prcHeaderFk) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/boq/checkforrelatedversionboqs' + '?prcHeaderFk=' + prcHeaderFk);
				}

				service.asyncValidateBasCurrencyFk = function asyncValidateBasCurrencyFk(entity, value, model) {
					var originalCurrency = entity[model];
					var originalRate = entity.ExchangeRate;
					entity.BasCurrencyFk = value;
					var checkBoqWhenModifyRateProm = checkBoqWhenModifyRate(entity.PrcHeaderFk);
					if (value === moduleContext.companyCurrencyId) {
						entity.ExchangeRate = 1;
						if (entity.Version === 0) {
							dataService.updateReadOnly(entity, 'ExchangeRate', entity.ExchangeRate, 'ExchangeRate');
						}
						return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
					}
					else {
						return self.getCurrentRate(entity, entity.BasCurrencyFk).then(
							function (response) {
								if (response) {
									entity.ExchangeRate = response.data;
									if (entity.Version === 0) {
										dataService.updateReadOnly(entity, 'ExchangeRate', entity.ExchangeRate, 'ExchangeRate');
									}
									return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
								}
							}, function (error) {
								window.console.error(error);
							}
						);
					}
				};

				service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
					let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
					let prcHeaderService = moduleContext.getMainService();
					let prcRequisitionBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
					let selectHeader = prcHeaderService.getSelected();
					return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcRequisitionBoqService, dataService, service, {
						ProjectId: selectHeader.ProjectFk,
						Module: 'procurement.requisition',
						BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
						HeaderId: entity.Id,
						ExchangeRate: entity.ExchangeRate
					});
				};

				// validateMaterialCatalogFk
				service.validateMaterialCatalogFk = function validateMaterialCatalogFk(entity, value, model) {
					var ItemLists = procurementCommonPrcItemDataService.getList();
					if (moduleContext.getMainService().name === 'procurement.requisition' || moduleContext.getMainService().name === 'procurement.contract') {
						dataService.taxMaterialCatalogFkChanged.fire(null, {item: entity, value: value});
					}
					if (!value) {
						frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);

						for (var i = 0; i < ItemLists.length; i++) {
							if (ItemLists[i].MdcMaterialFk !== null) {
								procurementCommonPrcItemDataService.setColumnsReadOnly(ItemLists[i], false);
								procurementCommonPrcItemDataService.markItemAsModified(ItemLists[i]);
							}
						}
						return true;
					}
					if (entity.MaterialCatalogFk !== value) {
						value = value || -1;
						lookupDataService.getItemByKey('MaterialCatalog', value).then(function (data) {
							if (!angular.isObject(data)) {
								return true;
							}
							// trigger changed event
							var hasMdcCatPaymentTermFks = !!(data.PaymentTermAdFk || data.PaymentTermFiFk || data.PaymentTermFk);
							var dontSetPaymentTerm = hasMdcCatPaymentTermFks;
							service.validateBusinessPartnerFk(entity, data.BusinessPartnerFk, 'BusinessPartnerFk', data.SupplierFk, data.SubsidiaryFk);
							service.validateSupplierFk(entity, data.SupplierFk, 'SupplierFk', dontSetPaymentTerm);

							// apply changed values
							entity.BusinessPartnerFk = data.BusinessPartnerFk;
							entity.SubsidiaryFk = data.SubsidiaryFk;
							entity.SupplierFk = data.SupplierFk;
							entity.IncotermFk = data.IncotermFk;
							if (hasMdcCatPaymentTermFks) {
								entity.BasPaymentTermFiFk = data.PaymentTermFiFk;
								entity.BasPaymentTermPaFk = data.PaymentTermFk;
								entity.BasPaymentTermAdFk = data.PaymentTermAdFk;
							}

							for (var i = 0; i < ItemLists.length; i++) {
								if (ItemLists[i].MdcMaterialFk !== null) {
									ItemLists[i].BasPaymentTermFiFk = data.PaymentTermFiFk;
									ItemLists[i].BasPaymentTermPaFk = data.PaymentTermFk;
									ItemLists[i].BasPaymentTermAdFk = data.PaymentTermAdFk;
									ItemLists[i].PrcIncotermFk = entity.IncotermFk;
									procurementCommonPrcItemDataService.setColumnsReadOnly(ItemLists[i], true);
									procurementCommonPrcItemDataService.markItemAsModified(ItemLists[i]);
								}
							}

							frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);

							attachLookupByKey('subsidiary', data.SubsidiaryFk);
							attachLookupByKey('PrcIncoterm', data.IncotermFk);
							dataService.fireItemModified(entity);
						}, function (error) {
							window.console.error(error);
						});
					}
					return true;
				};

				service.validateProjectFk = function validateProjectFk(entity, value, model, isFromConfigDialog) {
					if (entity.ProjectFk === value) {
						return true;
					}

					if (entity.ProjectFk !== value) {
						entity.ProjectFk = value;

						var clerkData = {
							prcStructureFk: entity.PrcHeaderEntity.StructureFk,
							projectFk: value,
							companyFk: entity.CompanyFk
						};

						projectStatus(entity, value);

						$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
							if(!_.isNil(response.data[0])) {
								entity.ClerkPrcFk = response.data[0];
							}
							if(!_.isNil(response.data[1])) {
								entity.ClerkReqFk = response.data[1];
							}
							dataService.fireItemModified(entity);
						});

						if(value > 0 && !isFromConfigDialog){
							// copy certificates from other modules.
							var options = {
								url: 'procurement/common/prccertificate/copycertificatesfromproject',
								dataService: procurementCommonCertificateDataService,
								parameter: {PrcHeaderId: entity.PrcHeaderFk, PrjProjectId: value}
							};
							procurementCommonCertificateDataService.copyCertificatesFromOtherModule(options);
						}
					}
					var oldControllingUnitFk = entity.ControllingUnitFk;

					if (!value) {
						entity.ControllingUnitFk = null;
						entity.ProjectChangeFk = null;
						dataService.gridRefresh();
						dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);
						return true;
					}
					// var addressUri = globals.webApiBaseUrl + 'basics/common/address/clone?id=';

					function getAddressAndProjectChange() {
						var loadval = $q.defer();
						lookupDataService.getItemByKey('project', value).then(function () {
							dataService.updateReadOnly(entity, 'ProjectChangeFk', value, model);
							if (!entity.AddressEntity && !packageUpdatingAddress) {
								$http.get(globals.webApiBaseUrl + 'procurement/package/package/getdeliveryaddress?projectId=' + value).then(function (xhr) {
									if (xhr && xhr.data) {
										entity.AddressFk = xhr.data.Id;
										entity.AddressEntity = xhr.data;

										dataService.fireItemModified(entity);
										dataService.gridRefresh();
									}
									loadval.resolve(entity);
								});
							}
							else {
								loadval.resolve(entity);
							}
						});
						return loadval.promise;
					}

					$q.all([$injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldControllingUnitFk), getAddressAndProjectChange()]).then(function (res) {
						if (res[0] !== '' && res[0] !== null) {
							entity.ControllingUnitFk = res[0];
							dataService.controllingUnitChanged.fire();
							dataService.wantToUpdateCUToItemsAndBoq(entity,true,isFromConfigDialog);
						}else{
							service.validateBasCurrencyFk(entity, entity.BasCurrencyFk, 'BasCurrencyFk', isFromConfigDialog);
						}
						entity.AddressFk = res[1].AddressFk;
						entity.AddressEntity = res[1].AddressEntity;
						dataService.gridRefresh();
					});

					if (!isFromConfigDialog) {
						dataService.reloadHeaderText(entity, {
							isOverride: true
						});
					}
					return true;
				};

				service.validateControllingUnitFk = function validateControllingUnitFk(entity, value) {
					if (!entity) {
						return true;
					}
					if (entity.ControllingUnitFk !== value) {
						entity.ControllingUnitFk = value;
						/* var question = $translate.instant('procurement.common.yesNoDialogQuestionToUpdate');
						platformModalService.showYesNoDialog(question, '', 'yes').then(function (response) {
							if (response.yes === true) {
								codeHelperService.updateControllingUnit(dataService, entity.ControllingUnitFk,1);
							}
						}); */
					}
					return true;

				};

				function validateExchangeRate(entity, value, model, skipFireEvent) {
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
						if (!skipFireEvent) {
							dataService.exchangeRateChanged.fire(null, {ExchangeRate: value});
						}
					}

					dataService.gridRefresh();
					return result;
				}

				service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
					if (entity.ExchangeRate === value) {
						const defer = $q.defer();
						defer.resolve(true);
						return defer.promise;
					}
					var originalRate = entity.ExchangeRate;
					var checkBoqWhenModifyRateProm = checkBoqWhenModifyRate(entity.PrcHeaderFk);
					entity.ExchangeRate = value;
					return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate);
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
				// over write general and certificate
				overWriteGeneralsAndCertificates = function overWriteGeneralsAndCertificates(entity, originalEntity) {
					procurementCommonGeneralsDataService.overWriteData(entity, originalEntity);
					procurementCommonCertificateDataService.overWriteData(entity, originalEntity);
				};


				service.validatePrcHeaderEntity$ConfigurationFk = function validateConfigurationFk(entity, value, model, isFromWizard) {
					/* if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== value && entity.PrcHeaderEntity.StructureFk) {
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						entity.PrcHeaderEntity.ConfigurationFk = value;
						reloadGeneralsAndCertificates(entity, originalEntity);
						procurementCommonTotalDataService.reload();
					 } */
					if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== value) {
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;

						var oldConfigHeadId = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.PrcHeaderEntity.ConfigurationFk});
						var newConfigHeadId = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});


						if (newConfigHeadId) {
							// service.validateBasPaymentTermPaFk(entity, newConfigHeadId.PaymentTermPaFk);
							// service.validateBasPaymentTermFiFk(entity, newConfigHeadId.PaymentTermFiFk);
							entity.PrcContracttypeFk = newConfigHeadId.PrcContractTypeFk;
							entity.PrcAwardmethodFk =newConfigHeadId.PrcAwardMethodFk;

							service.validatePaymentTermPaFkandPaymentTermFiFk(entity, newConfigHeadId.PaymentTermPaFk, newConfigHeadId.PaymentTermFiFk, false);

							if (value && entity.Version === 0) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(newConfigHeadId.RubricCategoryFk)
								}]);
								entity.Code = procurementRequisitionNumberGenerationSettingsService.provideNumberDefaultText(newConfigHeadId.RubricCategoryFk, entity.Code);
								if(entity.Code === null || entity.Code === ''){
									var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'} );
									platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
									platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, dataService);
									dataService.fireItemModified(entity);
								}else{
									platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
									platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
								}
								dataService.markCurrentItemAsModified();
								dataService.fireItemModified(entity);
							}
						}

						entity.PrcHeaderEntity.ConfigurationFk = value;
						dataService.markCurrentItemAsModified();
						if (entity.PrcHeaderEntity.StructureFk) {
							reloadGeneralsAndCertificates(entity, originalEntity);
						}
						if (oldConfigHeadId.Id !== newConfigHeadId.Id&&!isFromWizard) {
							procurementCommonTotalDataService.copyTotalsFromConfiguration();
						}
					}

					/* if(value){
					 entity.PrcHeaderEntity.ConfigurationFk = value;
					 procurementCommonTotalDataService.reload();
					 } */

					var defaultListNotModified = null;
					var sourceSectionId = 32;// 32 is  prcurement Configration
					var targetSectionId = 6;// 6 is    requisition.
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
							// var oldCharData = charDataService.getList();
							// charDataService.clear(oldCharData);
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

						/* var parsentService = $injector.get('procurementCommonHeaderTextNewDataService').getService();
						angular.forEach(parsentService.getList(), function (item) {
							parsentService.deleteItem(item);
						}); */
						var projectFk=null;
						if(entity.ProjectFk!==null&&entity.ProjectFk!==undefined)
						{
							// eslint-disable-next-line no-unused-vars
							projectFk=entity.ProjectFk;
						}

						// not from change configuration wizard
						if(!isFromWizard){
							dataService.reloadHeaderText(entity, {
								isOverride: true
							});
						}
					}
					dataService.fireItemModified(entity);
					return true;
				};

				service.asyncValidateDialogConfigurationFk = function (entity, value){

					if (entity && entity.ConfigurationFk !== value || entity.Code === null) {
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						if (value && (!entity.Code || entity.Version === 0)) {
							return procurementRequisitionNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
								}]);
								entity.Code = procurementRequisitionNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);
								if(entity.Code === null || entity.Code === ''){
									var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'} );
									platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
									platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, dataService);
									dataService.fireItemModified(entity);
								}else{
									platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
									platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
									dataService.fireItemModified(entity);

								}
								return true;
							});
						}
					}

					return $q.when(true);
				};

				service.validateDialogProjectFk = function validateDialogProjectFk(entity, value, model) {
					return service.validateProjectFk(entity, value, model, true);
				};

				service.validateDialogBusinessPartnerFk = function validateDialogBusinessPartnerFk(entity, value, model) {
					return service.validateBusinessPartnerFk(entity, value, model, null, null, true);
				};

				service.validateDialogPackageFk = function validateDialogPackageFk(entity, value, model) {
					return service.validatePackageFk(entity, value, model, true);
				};

				service.validateDialogReqHeaderFk = function validateDialogReqHeaderFk(entity, value, model) {
					return service.validateReqHeaderFk(entity, value, model, true);
				};

				service.validateDialogTaxCodeFk = function validateDialogTaxCodeFk(entity, value, model) {
					return service.validateTaxCodeFk(entity, value, model, undefined, true);
				};

				service.validateDialogDateRequired = function validateDialogDateRequired(entity, value, model) {
					return service.validateDateRequired(entity, value, model, true);
				};

				validateStructureFk = service.validatePrcHeaderEntity$StructureFk = function validateStructureFk(entity, value, model, isFromConfigDialog) {
					if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk !== value && !isFromConfigDialog) {
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						entity.PrcHeaderEntity.StructureFk = value;
						reloadGeneralsAndCertificates(entity, originalEntity);
						var targetSectionId = 6;// 6 is  req.
						var target2SectionId = 51;// 6 is  req.
						procurementCommonCharacteristicDataService.takeCharacteristicByStructure(dataService, targetSectionId,target2SectionId,entity.PrcHeaderEntity,entity.Id);
					}

					var clerkData = {
						prcStructureFk: value,
						projectFk: entity.ProjectFk,
						companyFk: entity.CompanyFk
					};
					var structure;
					if (value) {
						structure = _.find(basicsLookupdataLookupDescriptorService.getData('PrcStructure'), {Id: value});
						$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId='+value).then(function (response) {
							if(response.data) {
								var taxCodeFk=response.data;
								service.validateTaxCodeFk(entity, taxCodeFk, 'TaxCodeFk', true);
							}
						});
					}

					$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
						if(!_.isNil(response.data[0])) {
							entity.ClerkPrcFk = response.data[0];
						}
						if(!_.isNil(response.data[1])) {
							entity.ClerkReqFk = response.data[1];
						}

						// set reference when package and reference null but structure have value
						if (value && !entity.Description && !entity.PackageFk) {
							const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Requisition', 'ReqHeaderDto', 'Description');
							entity.Description = structure ? structure.DescriptionInfo.Translated.substr(0, descriptionLength): '';
						}

						dataService.fireItemModified(entity);
					});

					return true;
				};

				service.validateDialogStructureFk = function validateDialogStructureFk(entity, value, model) {
					return service.validatePrcHeaderEntity$StructureFk(entity, value, model, true);
				};
				service.validateModel = function () {
					return true;
				};

				service.validateDateReceived = function (entity, value, model) {
					return self.checkMandatory(entity, value, model, true);
				};

				function onEntityCreated(/* e, item */) {
					// dataService.setEntityReadOnly(item);
					// reloadGeneralsAndCertificates(item);
				}

				service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk/* , billingShcemaFk */) {
					var arrPromise=[];
					if(entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== prcConfigFk) {
						var promise1 = procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
						arrPromise.push(promise1);
					}
					var promise2 = service.validatePrcHeaderEntity$ConfigurationFk(entity, prcConfigFk, 'ConfigurationFk', true);
					arrPromise.push(promise2);
					return $q.all(arrPromise);
				};

				service.validateBpdVatGroupFk = function validateBpdVatGroupFk(entity) {
					entity.originVatGroupFk = entity.BpdVatGroupFk;
				};

				service.validatePrcHeaderEntity$StrategyFk = function validateStrategyFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if ((_.isNil(value) || value < 1) &&
						(_.isNil(entity.PrcHeaderEntity.StrategyFk) || entity.PrcHeaderEntity.StrategyFk < 1)
					) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('procurement.requisition.headerGrid.reqheaderStrategy')};
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
						boqMainLookupFilterService.setSelectedWicGroupIds([]);
						boqMainLookupFilterService.setSelectedBoqHeader(null);
					}
					else {
						boqMainLookupFilterService.setSelectedWicGroupIds([value]);
					}
					if (originBoqWicCatFk !== value) {
						frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
					}
					return true;
				};

				function changeBoqWicCatBoqFk(entity, value, model) {
					var defer = $q.defer();
					if (value && entity.BoqWicCatBoqFk !== value) {
						entity.BoqWicCatBoqFk = value;
						var wicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
						if (wicCatBoqs) {
							var wicCatBoq = _.find(wicCatBoqs, {Id: value});
							if (wicCatBoq && wicCatBoq.WicBoq) {
								var boqHeaderIds = {};
								var hasPaymentTermFk = !!(wicCatBoq.WicBoq.BasPaymentTermFk || wicCatBoq.WicBoq.BasPaymentTermFiFk || wicCatBoq.WicBoq.BasPaymentTermAdFk);
								boqHeaderIds[entity.BoqWicCatFk] = [wicCatBoq.BoqHeader.Id];
								boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(boqHeaderIds);
								if (hasPaymentTermFk) {
									entity.BasPaymentTermPaFk = wicCatBoq.WicBoq.BasPaymentTermFk;
									entity.BasPaymentTermFiFk = wicCatBoq.WicBoq.BasPaymentTermFiFk;
									entity.BasPaymentTermAdFk = wicCatBoq.WicBoq.BasPaymentTermAdFk;
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
										validateBusinessPartnerFkService.resetArgumentsToValidate();
										return validateBusinessPartnerFkService.resetRelatedFieldsBySupplier(entity, entity.SupplierFk, hasPaymentTermFk).then(function () {
											if (hasPaymentTermFk) {
												entity.BasPaymentTermPaFk = wicCatBoq.WicBoq.BasPaymentTermFk;
												entity.BasPaymentTermFiFk = wicCatBoq.WicBoq.BasPaymentTermFiFk;
												entity.BasPaymentTermAdFk = wicCatBoq.WicBoq.BasPaymentTermAdFk;
											}
											frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
											dataService.gridRefresh();
										});
									}
									else {
										entity.SupplierFk = null;
									}
								}
							}
						}
					}
					if (!value) {
						boqMainLookupFilterService.setSelectedBoqHeader(null);
					}
					frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model);
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
					defer.resolve(true);
					return defer.promise;
				};

				dataService.registerEntityCreated(onEntityCreated);


				// apply valiation result to correct module validation state.
				/* function applyManualValidation(result, item, model, value) {
					platformRuntimeDataService.applyValidationResult(result, item, model);
					platformDataValidationService.finishValidation(result, item, value, model, service, dataService);
				} */

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
					}
					else {
						entity.ProjectStatusFk = null;
					}
				}

				function checkBoqWhenModifyRate(prcHeaderFk) {
					return function () {
						return checkForRelatedVersionBoqs(prcHeaderFk);
					};
				}

				function checkBoqWhenModifyRateMsgBox() {
					return platformDialogService.showMsgBox('procurement.common.changeCurrencyRelatedVersionBoqsText', 'procurement.common.changeCurrencyRelatedVersionBoqsHeader', 'info');
				}

				function frameworkMdcOrBoqChangeUpdateReadonly(entity, value, model) {
					dataService.updateFieldsReadOnly(entity,
						['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk', 'IncotermFk', 'BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'BasPaymentTermAdFk', 'Subsidiary2Fk', 'BusinessPartner2Fk', 'Supplier2Fk', 'TaxCodeFk', 'BoqWicCatBoqFk'],
						value, model);
				}

				service.validateControllingUnitFk = function validateControllingUnitFk(entity, value) {
					if (value && entity.ControllingUnitFk !== value) {
						entity.ControllingUnitFk = value;
						dataService.controllingUnitChanged.fire();
						dataService.wantToUpdateCUToItemsAndBoq(value);
					}
				};

				return service;
			}
		]);
})(angular);
