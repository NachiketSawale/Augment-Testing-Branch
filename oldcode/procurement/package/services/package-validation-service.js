/**
 * Created by wwa on 8/11/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,console */

	var moduleName = 'procurement.package';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageValidationService', ['$injector', '$http', '$q', '$translate', 'procurementPackageDataService', 'platformDataValidationService',
		'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'procurementCommonCodeHelperService',
		'procurementContextService', 'procurementCommonTotalDataService', 'businessPartnerLogicalValidator', 'basicsLookupdataLookupDataService', 'platformContextService',
		'procurementCommonExchangerateFormatterService', 'procurementCommonPrcBoqService', 'prcBoqMainService', 'procurementPackageClerkService', 'procurementCommonPrcItemDataService', '$timeout',
		'procurementPackageNumberGenerationSettingsService', 'platformTranslateService', 'procurementCommonTaxCodeChangeService', 'prcCommonCalculationHelper',
		'overDiscountValidationService',
		'procurementCommonExchangerateValidateService', 'prcCommonDomainMaxlengthHelper',
		function ($injector, $http, $q, $translate, dataService, platformDataValidationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, codeHelperService,
			moduleContext, procurementCommonTotalDataService, businessPartnerLogicalValidator, lookupDataService, platformContextService,
			procurementCommonExchangerateFormatterService, procurementCommonPrcBoqService, prcBoqMainService, procurementPackageClerkService, procurementCommonPrcItemDataService, $timeout,
			procurementPackageNumberGenerationSettingsService, platformTranslateService, procurementCommonTaxCodeChangeService, prcCommonCalculationHelper,
			overDiscountValidationService,
			procurementCommonExchangerateValidateService, prcCommonDomainMaxlengthHelper) {
			var service = {}, self = this;
			procurementCommonTotalDataService = procurementCommonTotalDataService.getService(dataService);
			var commonBoqService = procurementCommonPrcBoqService.getService(dataService);
			var boqMainService = prcBoqMainService.getService(dataService);
			var validateBusinessPartnerFkService = businessPartnerLogicalValidator.getService({dataService: dataService});
			var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/package/package/updateExchangeRate';
			// get validators from business partner
			service.validateBusinessPartnerFk = function (entity) {
				var bPartnerFk = entity.BusinessPartnerFk;
				validateBusinessPartnerFkService.businessPartnerValidator.apply(null, arguments);
				dataService.onBusinessPartnerFkChanged.fire(bPartnerFk);
			};

			service.validateSupplierFk = validateBusinessPartnerFkService.supplierValidator;
			service.validateSubsidiaryFk = validateBusinessPartnerFkService.subsidiaryValidator;

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
				if (model === 'Description') {
					return service.validateDescription(entity, value, model);
				}

				var packages = _.filter(dataService.getList(), function (item) {
					return item.ProjectFk === entity.ProjectFk;
				});
				var validateResult = platformDataValidationService.isUnique(packages, 'Code', value, entity.Id);
				if (!validateResult.valid) {
					validateResult.error = $translate.instant('procurement.package.packageCodeUniqueError');
				}
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				dataService.fireItemModified(entity);
				return validateResult;
			};

			service.asyncValidateCode = function (entity, value, model) {
				if (model === 'Description') {
					return $q.when(true);
				}
				var error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

				var defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/package/package/isunique' + '?id=' + entity.Id + '&projectFk=' + entity.ProjectFk + '&code=' + value)
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

				dataService.fireItemModified(entity);
				asyncMarker.myPromise = defer.promise.then(function (validateResult) {
					platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
					return validateResult;
				});

				return asyncMarker.myPromise;
			};

			service.validateDialogCode = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
				if ((value === null || _.isUndefined(value) || value === '') && !_.isNil(entity.Code) && entity.Code !== translationObject.cloud.common.isGenerated) {
					var emptyError = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');
					var emptyResult = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: emptyError || {object: model.toLowerCase()}
					};
					return $q.when(emptyResult);
				} else {
					// remove configurationFK error
					platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
					if (entity.ProjectFk === null) {
						return $q.when(true);
					}
					var error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');

					var id = entity.Id;
					if (_.isUndefined(id)) {
						id = 0;
					}
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.ConfigurationFk}) || {RubricCategoryFk: -1};
					var hasToGenerate = procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
					if (hasToGenerate && entity.Version === 0) {
						defer.resolve(true);
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/package/package/isunique' + '?id=' + id + '&projectFk=' + entity.ProjectFk + '&code=' + value)
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
					platformRuntimeDataService.applyValidationResult(true, entity, 'ConfigurationFk');
					platformDataValidationService.finishAsyncValidation(true, entity, entity.ConfigurationFk, 'ConfigurationFk', asyncMarker, service, dataService);
					platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
					dataService.fireItemModified(entity);
					return validateResult;
				});

				return asyncMarker.myPromise;

			};

			service.validateDescription = function validateDescription(entity, value, model) {
				dataService.firePropertyChanged(entity, value, model);
				return true;
			};

			function setClerkPrcFkAndClerkReqFk(entity, prcStructureFk, projectFk, companyFk) {
				var clerkData = {
					prcStructureFk: prcStructureFk,
					projectFk: projectFk,
					companyFk: companyFk
				};
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

			service.validateStructureFk = function validateStructureFk(entity, value/* , model */) {
				var OriginalPrcStructureId = angular.copy(entity.StructureFk);
				var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: value});
				if (entity.StructureFk !== value && !_.isNil(value)) {
					// if clear strcutre, the configuration should keep and no need change to default value. by lcn #130249
					entity.IsChangedStructure = true;
					// change default configration
					var keepChange = true;
					var strValue = value === -1 ? null : value;
					if (structure && _.isNil(structure.PrcConfigHeaderFk)) {
						keepChange = false;
						entity.IsChangedStructure = false;
					}

					if (keepChange) {
						var urlStr = 'basics/procurementconfiguration/configuration/getByStructure?' + (strValue === null ? 'rubricId=31' : 'structureId=' + strValue + '&rubricId=31');
						$http.get(globals.webApiBaseUrl + urlStr).then(function (response) {
							var prcConfigurationData = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
							var oldConfigHeader = _.find(prcConfigurationData, {Id: entity.ConfigurationFk});
							var newConfigHeader = _.find(prcConfigurationData, {Id: response.data});

							oldConfigHeader = _.isUndefined(oldConfigHeader) ? {PrcConfigHeaderFk: -1} : oldConfigHeader;
							if (oldConfigHeader.PrcConfigHeaderFk !== newConfigHeader.PrcConfigHeaderFk) {
								entity.ConfigurationFk = response.data;
								service.validateConfigurationFk(entity, entity.ConfigurationFk, 'ConfigurationFk');
								dataService.fireItemModified(entity);
							}
						});
					}
				}

				const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Package', 'PrcPackageDto', 'Description');

				if (!entity.Description) {
					if (angular.isDefined(structure) && structure.DescriptionInfo.Translated) {
						entity.Description = structure.DescriptionInfo.Translated.substr(0, descriptionLength);
					}
					entity.StructureFk = value;
					dataService.onStructureFkChanged.fire(false, {OriginalPrcStructureId: OriginalPrcStructureId});
				} else {
					if (angular.isDefined(structure)) {
						// var oldStructure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: entity.StructureFk});
						codeHelperService.getUpdatePackageDescriptionByStructure().then(function (val) {
							if (val) {
								if (angular.isDefined(structure) && structure.DescriptionInfo.Translated) {
									entity.Description = structure.DescriptionInfo.Translated.substr(0, descriptionLength);
								}
								dataService.markItemAsModified(entity);
								var _structureData = {
									id: entity.Id,
									value: entity.Description,
									OriginalPrcStructureId: OriginalPrcStructureId
								};
								dataService.onStructureFkChanged.fire(true, _structureData);
							}
						});
					} else {
						entity.StructureFk = value;
						dataService.onStructureFkChanged.fire(false, {OriginalPrcStructureId: OriginalPrcStructureId});
					}
				}

				setClerkPrcFkAndClerkReqFk(entity, value, entity.ProjectFk, entity.CompanyFk);

				/** *update textcode when structure change***/
				if (angular.isDefined(structure)) {
					/* var TaxCodeFk = structure.TaxCodeFk;
					if (TaxCodeFk) {
						entity.TaxCodeFk = TaxCodeFk;
						dataService.taxCodeFkChanged.fire();
					}
					to alm: because taxCodeFkChanged watcher depends on VatPercent which is set in validateTaxCodeFk function */
					$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value).then(function (response) {
						if (response.data) {
							var taxCodeFk = response.data;
							service.validateTaxCodeFk(entity, taxCodeFk, 'TaxCodeFk', true);
						}
					});
				}
				if (entity.Version === 0) {
					dataService.firePropertyChanged(entity, value, 'StructureFk');
				}

				dataService.markItemAsModified(entity);
				return true;
			};

			service.validateDialogStructureFk = function (entity, value, model, noSetConfigurationFk) {
				const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Package', 'PrcPackageDto', 'Description');
				value = value || -1;
				var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: value});
				if (!entity.Description) {
					if (angular.isDefined(structure) && structure.DescriptionInfo.Translated) {
						entity.Description = structure.DescriptionInfo.Translated.substr(0, descriptionLength);
					}
				} else {
					if (angular.isDefined(structure) && entity.StructureFk) {
						var oldStructure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: entity.StructureFk});
						if (angular.isDefined(oldStructure) && entity.Description === oldStructure.DescriptionInfo.Translated && structure.DescriptionInfo.Translated) {
							entity.Description = structure.DescriptionInfo.Translated.substr(0, descriptionLength);
						}
					}
				}

				// change default configration
				// if clear strcutre, the configuration should keep and no need change to default value. by lcn #130249
				if (!(value === -1 && entity.StructureFk !== -1)) {// todo: create new data
					var keepChange = true;
					var strValue = value === -1 ? null : value;
					if (structure && _.isNil(structure.PrcConfigHeaderFk)) {
						keepChange = false;
					}
					if (keepChange) {
						var urlStr = 'basics/procurementconfiguration/configuration/getByStructure?' + (strValue === null ? 'rubricId=31' : 'structureId=' + strValue + '&rubricId=31');
						$http.get(globals.webApiBaseUrl + urlStr).then(function (response) {
							if (_.isNil(noSetConfigurationFk)) {
								var prcConfigurationData = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
								var oldConfigHeader = _.find(prcConfigurationData, {Id: entity.ConfigurationFk});
								var newConfigHeader = _.find(prcConfigurationData, {Id: response.data});

								oldConfigHeader = _.isUndefined(oldConfigHeader) ? {PrcConfigHeaderFk: -1} : oldConfigHeader;
								if (oldConfigHeader.PrcConfigHeaderFk !== newConfigHeader.PrcConfigHeaderFk) {
									if (entity.ConfigurationFk !== response.data) {
										entity.ConfigurationFk = response.data;
										service.validateDialogConfigurationFk(entity, entity.ConfigurationFk, 'ConfigurationFk');
										dataService.fireItemModified(entity);

										if (_.isNil(entity.isCreateByPackage)) {// the poped up message only in contract module to create package,and it should allow to select option"no show in future"
											var modalOptions = {
												bodyText: $translate.instant('procurement.package.createDialog4ConfigurationWarning'),
												iconClass: 'ico-warning'
											};
											$injector.get('platformModalService').showDialog(modalOptions);

										}
									}
								}
							}
						});
					}
				}

				entity.StructureFk = value;
				if (angular.isDefined(structure)) {
					var TaxCodeFk = structure.TaxCodeFk;
					if (TaxCodeFk) {
						entity.TaxCodeFk = TaxCodeFk;
					}
				}

				if (value && value > 0) {
					return true;
				}
				return {apply: false, valid: false, error: $translate.instant('cloud.common.required')};
			};

			service.validatePlannedStart = function (entity, value, model) {
				entity.DateEffective = value || entity.DateEffective;
				return platformDataValidationService.validatePeriod(value, entity.PlannedEnd, entity, model, service, dataService, 'PlannedEnd');
			};
			service.validatePlannedEnd = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.PlannedStart, value, entity, model, service, dataService, 'PlannedStart');
			};
			service.validateActualStart = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.ActualEnd, entity, model, service, dataService, 'ActualEnd');
			};
			service.validateActualEnd = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.ActualStart, value, entity, model, service, dataService, 'ActualStart');
			};

			service.validateScheduleFk = function (entity, value, model) {
				// if click clear button ,then should reset Activity to null
				// if selected another Schedule then should be reset Activity to null
				if (!value || entity.ScheduleFk !== value) {
					entity.ActivityFk = null;
				}
				dataService.updateReadOnly(entity, 'ActivityFk', value, model);
				dataService.fireItemModified(entity);
				return {apply: true, valid: true};
			};

			// validateTaxCodeFk
			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model, isInject) {
				var result = true;
				if (!entity || !entity.TaxCodeFk || value === -1) {
					result = {apply: true, valid: false, error: 'should not empty'};
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return true;
				}
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				if (entity.TaxCodeFk !== value) {
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

			service.validateCurrencyFn =function validateCurrencyFn(entity, value, model) {

				if (model) {
					dataService.updateReadOnly(entity, 'ExchangeRate', value, model);
				}
				value = value || -1;
				if(entity.Version === 0){
					return false;
				}

				if (value === moduleContext.companyCurrencyId) {
					entity.ExchangeRate = 1.0;
					entity.OverallDiscount = entity.OverallDiscountOc;
					dataService.totalFactorsChangedEvent.fire();
					dataService.exchangeRateChanged.fire(null, {ExchangeRate: entity.ExchangeRate, IsCurrencyChanged: true});
					validateExchangeRate(entity, 1, 'ExchangeRate', true);
				} else {
					self.getCurrentRate(entity, value).then(
						function (response) {
							if (response) {
								var rate = response.data;
								entity.ExchangeRate = rate;
								entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / rate);
								if (rate) {
									dataService.totalFactorsChangedEvent.fire();
									dataService.exchangeRateChanged.fire(null, {
										ExchangeRate: entity.ExchangeRate,
										IsCurrencyChanged: true
									});
									dataService.fireItemModified(entity);
								}
								if (entity[model] && entity.Version) {
									validateExchangeRate(entity, rate, 'ExchangeRate', true);
								}
							}
						}, function (error) {
							console.error(error);
						}
					);
				}
				return true;
			}

			function checkForVersionBoqs(packageFk) {
				return $http.get(globals.webApiBaseUrl + 'procurement/common/boq/checkforversionboqs' + '?packageFk=' + packageFk);
			}

			service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, value, model, options) {
				var originalCurrency = entity[model];
				var originalRate = entity.ExchangeRate;
				dataService.updateReadOnly(entity, 'ExchangeRate', value, model);
				if (options && options === true) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					defer.resolve(true);
					return defer.promise;
				}
				entity.CurrencyFk = value;
				var checkBoqWhenModifyRateProm = checkBoqWhenModifyRate(entity.Id);
				if (value === moduleContext.companyCurrencyId) {
					entity.ExchangeRate = 1;
					return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
				} else {
					return self.getCurrentRate(entity, entity.CurrencyFk).then(
						function (response) {
							if (response) {
								entity.ExchangeRate = response.data;
								return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
							}
						}, function (error) {
							console.error(error);
						}
					);
				}
			};

			service.asyncValidateDateEffective = function(entity, value, model) {
				let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
				let prcHeaderService = $injector.get('procurementContextService').getMainService();
				let prcPackageBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
				// let package2HeaderService = $injector.get('procurementPackagePackage2HeaderService');
				// let boqMainSrvc = prcBoqMainService.getService(package2HeaderService);
				let selectHeader = prcHeaderService.getSelected();
				return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcPackageBoqService, dataService, service, {
					ProjectId: entity.ProjectFk,
					Module: 'procurement.package',
					BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
					HeaderId: entity.Id,
					ExchangeRate: entity.ExchangeRate
				});
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

				if (entity.ExchangeRate !== value) {
					dataService.isTotalDirty = true;
					entity.ExchangeRate = value;
					entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / value);
					if (!skipFireEvent) {
						dataService.exchangeRateChanged.fire(null, {ExchangeRate: value});
					}
				}

				dataService.gridRefresh();
				return result;
			}

			service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
				if (entity.ExchangeRate !== value) {
					var originalRate = entity.ExchangeRate;
					var checkBoqWhenModifyRateProm = checkBoqWhenModifyRate(entity.Id);
					entity.ExchangeRate = value;
					return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate);
				}
				var defer = $q.defer();
				defer.resolve(true);
				return defer.promise;
			};

			/* service.validateUomFk = function(entity, value, model){
				var result = true;
				if(!value){
					result = {apply: true, valid: false, error: 'should not empty'};
				}
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}; */
			service.validateProjectFk = function (entity, value, model, fromNewButton) {
				value = value || 0;
				if (angular.isDefined(entity) && entity.ProjectFk !== value) {
					entity.ProjectFk= value;
					setClerkPrcFkAndClerkReqFk(entity, entity.StructureFk, value, entity.CompanyFk);
					dataService.projectFkChanged.fire('projectFkChanged', {entity: entity, value: value, model: model});
					//if (value > 0 && entity.CurrencyFk) {
					//	validateCurrencyFk(entity, entity.CurrencyFk);
					//}
					if (angular.isUndefined(fromNewButton) || fromNewButton === '' || fromNewButton === null) {
						dataService.firePropertyChanged(entity, value, model);
					}
					if (value > 0) {
						// copy certificates from other modules such as project and material.
						var package2headerService = $injector.get('procurementPackagePackage2HeaderService');
						var package2headerItem = package2headerService.getSelected();
						if (package2headerItem) {
							if (!fromNewButton) {
								var certificateDataService = $injector.get('procurementCommonCertificateNewDataService').getService(package2headerService);
								var options = {
									url: 'procurement/common/prccertificate/copycertificatesfromproject',
									dataService: certificateDataService,
									parameter: {PrcHeaderId: package2headerItem.PrcHeaderFk, PrjProjectId: value},
									subModule: package2headerService.getItemName()
								};
								certificateDataService.copyCertificatesFromOtherModule(options);
							}
						}
						$http.get(globals.webApiBaseUrl + 'procurement/package/package/gettelephone?projectFk=' + value).then(function callback(response) {
							var telephoneData = response.data;
							entity.TelephoneNumber = telephoneData.TelephoneNumber;
							entity.TelephoneNumberTelefax = telephoneData.TelephoneNumberTelefax;
							entity.TelephoneMobil = telephoneData.TelephoneMobil;
							entity.TelephoneNumberFk = telephoneData.TelephoneNumberFk;
							entity.TelephoneTelefaxFk = telephoneData.TelephoneTelefaxFk;
							entity.TelephoneMobileFk = telephoneData.TelephoneMobileFk;
							entity.CountryFk = telephoneData.CountryFk;
							entity.RegionFk = telephoneData.RegionFk;
							entity.Email = telephoneData.Email;
							entity.AddressEntity = telephoneData.AddressEntity;
							entity.AddressFk = telephoneData.AddressFk;
						});
						var oldFk = entity.MdcControllingUnitFk;
						$injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldFk).then(function (res) {
							if (res !== '' && res !== null) {
								entity.MdcControllingUnitFk = res;
								dataService.markItemAsModified(entity);

								if (!fromNewButton) {
									dataService.controllingUnitChanged.fire();
									dataService.wantToUpdateCUToItemsAndBoq(entity, true);
								}
							} else {
								service.validateCurrencyFn(entity, entity.CurrencyFk, 'CurrencyFk');
							}
						});
					}
				}
				if (value > 0) {
					platformDataValidationService.finishValidation(true, entity, entity.ProjectFk, 'ProjectFk', service, dataService);
					return true;
				}
				platformDataValidationService.finishValidation(false, entity, entity.ProjectFk, 'ProjectFk', service, dataService);
				return {apply: false, valid: false, error: $translate.instant('cloud.common.required')};
			};

			/*
			 service.asyncValidateProjectFk = function (entity, value, model) {
			 value = value || -1;
			 var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			 var deffer = $q.defer();
			 if(angular.isDefined(entity) && entity.ProjectFk !== value)
			 {
			 entity.ProjectFk = value;
			 asyncMarker.myPromise=procurementPackageClerkService.copyClerksFromProject(value).then(function(){
			 deffer.resolve(null);
			 });
			 }
			 return asyncMarker.myPromise;
			 };
			 */

			service.validateAssetMasterFk = function (entity, value, model) {
				if (value && value > 0) {
					if (angular.isDefined(entity) && entity.AssetMasterFk !== value) {
						entity.AssetMasterFk = value;
						dataService.assetMasterFkChanged.fire('assetMasterFkChanged', {
							entity: entity,
							value: value,
							model: model
						});
						// update package code and procurement BoQs reference No.
						var assetMasterList = basicsLookupdataLookupDescriptorService.getData('assertmaster');
						if (assetMasterList && assetMasterList[value] && entity.Code && entity.Version !== 0) {
							$http.post(globals.webApiBaseUrl + 'procurement/package/package/generatepackagecode', entity).then(function (response) {
								// var assetMaster = assetMasterList[value];
								entity.Code = response.data;
								var boqRootItem = [];
								var boqList = commonBoqService.getList();
								if(_.isEmpty(boqList)){
									return;
								}
								basicsLookupdataLookupDescriptorService.loadItemByKey('prcpackage',entity.Id).then(prcPackage=>{
									if (prcPackage) {
										prcPackage.Code = entity.Code;      // update the prcpackage code
										_.forEach(boqList, function (item) {     // update item.BoqRootItem.Reference
											item.BoqRootItem.Reference = formatBoqReference(entity.Code, item.BoqRootItem.Reference, 42);
											boqRootItem.push(item.BoqRootItem);
										});
										$http.post(globals.webApiBaseUrl + 'procurement/common/boq/updateboqrootitem', boqRootItem).then(function (response) {
											_.forEach(boqList, function (item) {
												const resItem = _.find(response.data, {Id: item.BoqRootItem.Id});
												angular.extend(item.BoqRootItem, resItem);
											});
											// update BoQ Structure
											const mainBoqList = boqMainService.getTree();
											const mainItem = _.find(response.data, {Id: mainBoqList[0].Id});
											mainBoqList[0].Reference = mainItem.Reference;
											mainBoqList[0].UpdatedAt = mainItem.UpdatedAt;
											mainBoqList[0].UpdatedBy = mainItem.UpdatedBy;
											mainBoqList[0].Version = mainItem.Version;
											boqMainService.gridRefresh();
											commonBoqService.gridRefresh();
										});
									}
								});
							});
						}
					}

					var result = true;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				}

				// If value is empty we must check from system options(Show Asset Master in Procurement (Yes/No)) then determine whether field is required or not.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
					var _showAssetMaster = response.data;
					var result = _showAssetMaster ? {apply: false, valid: false,  error: $translate.instant('cloud.common.required')} : true;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
				});
				return asyncMarker.myPromise;
			};

			function formatBoqReference(packageCode, boqRef, num) {
				var pos = boqRef.indexOf('(');
				if (pos === -1) {
					boqRef = packageCode;
				} else {
					boqRef = packageCode + boqRef.substring(pos);
				}
				return boqRef.substring(0, num);
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

			/* function validationFk(value) {
				return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
			} */

			service.validatePrcPackageTemplateFk = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				if (value <= 0 || value === null) {
					var result1 = {apply: false, valid: false,error: $translate.instant('cloud.common.required')};
					defer.resolve(result1);
				} else {
					var errorMessage = 'procurement.package.cannotgeneratecodefromtemplate';
					$http.get(globals.webApiBaseUrl + 'procurement/package/package/cangeneratecodefromtemplate' + '?templateFk=' + value)
						.then(function (result) {
							if (!result.data.Result) {
								if (result.data.TemplateItemCount <= 0) {
									errorMessage = 'procurement.package.hasnottemplateitem';
								}
								var result2 = {
									apply: true,
									valid: false,
									error: '...',
									error$tr$: errorMessage
								};
								defer.resolve(result2);
							} else {
								defer.resolve(true);
							}
						});
				}
				// dataService.fireItemModified(entity);
				asyncMarker.myPromise = defer.promise.then(function (validateResult) {
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
					return validateResult;
				});

				return asyncMarker.myPromise;

			};

			service.validateConfigurationFk = function (entity, value, model, isFromWizard) {
				if (entity) {
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					if (entity.Version === 0) {
						platformRuntimeDataService.readonly(entity, [{
							field: 'Code',
							readonly: procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
						}]);
						entity.Code = procurementPackageNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);

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

						dataService.fireItemModified(entity);
					}
					var oldConfigurationFk = angular.copy(entity.ConfigurationFk);
					var oldConfigHeadId = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.ConfigurationFk});
					var newConfigHeadId = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
					entity.ConfigurationFk = value;
					procurementPackageClerkService.copyClerksFromConfiguration(oldConfigurationFk);
					if (config) {
						entity.PrcContractTypeFk = config.PrcContractTypeFk;
					}
					if (isFromWizard) {
						dataService.firePropertyChanged(entity, value, 'AllConfigurationFk');
					} else {
						dataService.firePropertyChanged(entity, value, model);
					}
					dataService.markCurrentItemAsModified();
					if (!_.isNil(oldConfigHeadId) && (oldConfigHeadId.Id !== newConfigHeadId.Id)&&!isFromWizard) {
						procurementCommonTotalDataService.copyTotalsFromConfiguration();
					}
					// procurementCommonTotalDataService.reload();
				}
				var defaultListNotModified = null;
				var sourceSectionId = 32;// 32 is  prcurement Configration
				var targetSectionId = 18;// 18 is    package.
				// var rfqMainService = $injector.get('procurementRfqMainService');
				var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
				defaultListNotModified = charDataService.getList();
				var newItem = [];
				angular.forEach(defaultListNotModified, function (item) {
					newItem.push(item);
				});
				if (value) {
					var sourceHeaderId = value;
					var selectedEntity = dataService.getSelected();
					if (selectedEntity !== null) {
						var targetHeaderId = selectedEntity.Id;
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
					}

				}
				dataService.fireItemModified(entity);
				return true;
			};

			service.validateDialogConfigurationFk = function (entity, value/* , model */) {
				entity.ConfigurationFk = value;
				if (entity) {
					lookupDataService.getSearchList('prcconfiguration',' RubricFk=' + 31).then(function (data) {
						var config = _.find(data, {Id: value});
						if (config) {
							if (value) {
								// procurementPackageNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
								}]);
								entity.Code = procurementPackageNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, entity.Code);
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
								// });
							}
						}
					});
				}
				dataService.fireItemModified(entity);
				return true;
			};

			service.validateMainEventDto$EndRelevant = function (entity, value, model) {
				_.set(entity, model, value);
				dataService.firePropertyChanged(entity, value, model);
				return {apply: true, valid: true};
			};

			service.validateMainEventDto$StartRelevant = function (entity, value, model) {
				_.set(entity, model, value);
				dataService.firePropertyChanged(entity, value, model);
				return {apply: true, valid: true};
			};

			service.validateActivityFk = function (entity, value) {
				dataService.showDateDecisionDialog(entity, value);
			};

			service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk) {
				var arrPromise=[];
				if(entity.ConfigurationFk!==prcConfigFk) {
					var promise1 = procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
					arrPromise.push(promise1);
				}
				var promise2 = service.validateConfigurationFk(entity, prcConfigFk, 'ConfigurationFk', true);
				arrPromise.push(promise2);
				return $q.all(arrPromise);
			};

			service.validateBpdVatGroupFk = function validateBpdVatGroupFk(entity) {
				entity.originVatGroupFk = entity.BpdVatGroupFk;
			};

			service.asyncValidateMdcControllingUnitFk = function validateMdcControllingUnitFk(entity, value) {
				const defer = $q.defer();
				if (entity.MdcControllingUnitFk !== value) {
					entity.MdcControllingUnitFk = value;
					dataService.controllingUnitChanged.fire();
					dataService.wantToUpdateCUToItemsAndBoq(value).then(function () {
						defer.resolve(true);
					})
				}else{
					defer.resolve(true);
				}
				return defer.promise;
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

			service.validateAddressEntity = function validateAddressEntity(entity, value) {
				if (value && value.CountryFk && entity.CountryFk !== value.CountryFk) {
					entity.CountryFk = value.CountryFk;
				}
			};

			function checkBoqWhenModifyRate(id) {
				return function () {
					return checkForVersionBoqs(id);
				};
			}

			function checkBoqWhenModifyRateMsgBox() {
				var platformModalService = $injector.get('platformModalService');
				return platformModalService.showMsgBox('procurement.common.changeCurrencyVersionBoqText', 'procurement.common.changeCurrencyVersionBoqHeader', 'info');
			}

			return service;

		}]);
})(angular);