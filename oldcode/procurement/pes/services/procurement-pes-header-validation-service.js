(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';

	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPesHeaderValidationService',
		['$injector', '$translate', '$q', '$http', 'basicsLookupdataLookupDataService', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'platformDataValidationService', 'procurementContextService',
			'globals', '_', 'procurementCommonExchangerateFormatterService', 'platformModalService', 'procurementCommonCodeHelperService', '$timeout', 'procurementPesNumberGenerationSettingsService', 'businessPartnerLogicalValidator',
			'procurementCommonExchangerateValidateService',
			function ($injector, $translate, $q, $http, basicsLookupdataLookupDataService, platformContextService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService, platformDataValidationService, procurementContextService,
				globals, _, procurementCommonExchangerateFormatterService, platformModalService, codeHelperService, $timeout, procurementPesNumberGenerationSettingsService, businessPartnerLogicalValidator,
				procurementCommonExchangerateValidateService) {
				return function (dataService) {
					var service = {},
						httpRoute = globals.webApiBaseUrl + 'procurement/pes/header/validate';
					var updateExchangeRateUrl = globals.webApiBaseUrl + 'procurement/pes/header/updateExchangeRate';

					var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({
						dataService: dataService,
						needLoadDefaultSupplier: true
					});
					service.validateSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;

					angular.extend(service,
						{
							asyncValidateCode: asyncValidateCode,
							validateClerkPrcFk: validateClerkPrcFk,
							validateClerkReqFk: validateClerkReqFk,
							asyncValidateDescription: asyncValidateDescription,
							validateDocumentDate: validateDocumentDate,
							asyncValidateBusinessPartnerFk: asyncValidateBusinessPartnerFk,
							asyncValidateSupplierFk: asyncValidateSupplierFk,
							validateProjectFk: validateProjectFk,
							asyncValidateConHeaderFk: asyncValidateConHeaderFk,
							validatePackageFk: validatePackageFk,
							asyncValidatePrcConfigurationFk: asyncValidatePrcConfigurationFk,
							validateConHeader: validateConHeader,
							asyncValidateCurrencyFk: asyncValidateCurrencyFk,
							asyncValidateDateEffective:asyncValidateDateEffective,
							asyncValidateExchangeRate: asyncValidateExchangeRate,
							validateDateDelivered: validateDateDelivered,
							validateControllingUnitFk: validateControllingUnitFk,
							asyncValidateControllingUnitFk: asyncValidateControllingUnitFk,
							updateControllingUnit: updateControllingUnit,
							asyncValidateBillingSchemaFk: asyncValidateBillingSchemaFk,
							validateCodeByChangeConfiguration: validateCodeByChangeConfiguration,
							validateBpdVatGroupFk: validateBpdVatGroupFk,
							asyncSetPrcConfigFkAndBillingSchemaFkForWizard: asyncSetPrcConfigFkAndBillingSchemaFkForWizard
						});

					function asyncValidateCode(entity, value, model) {
						var defer = $q.defer();
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						asyncMarker.myPromise = defer.promise;
						var result = {apply: true, valid: true};
						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});

							defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(result), entity, value, model, asyncMarker, service, dataService));

						} else {
							entity.Code = value;
							var postData = {
								HeaderDto: entity,
								Value: value,
								Model: model
							};
							codeValidateHttpService(postData, defer, asyncMarker);
						}

						return defer.promise;
					}

					function validateCodeByChangeConfiguration(entity, value, model) {
						var result = {apply: true, valid: true};
						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: model});
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
						return result;
					}

					/**
					 * @ngdoc service
					 * @name codeValidateHttpService
					 * @description
					 * postData = {Id: Id,HeaderDto: HeaderDto,Value: value,Model: model };
					 */
					function codeValidateHttpService(postData, defer, asyncMarker) {
						var validateResult = {apply: true, valid: true};
						return $http.post(httpRoute, postData).then(
							function (result) {
								if (!result.data) {
									validateResult.valid = false;
									validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: postData.Model});
								} else {
									validateResult.valid = true;
								}
								platformRuntimeDataService.applyValidationResult(validateResult, postData.HeaderDto, postData.Model);
								defer.resolve(platformDataValidationService.finishAsyncValidation(validateResult, postData.HeaderDto, postData.Value, postData.Model, asyncMarker, service, dataService));
								dataService.gridRefresh();
							});
					}

					function validateDateDelivered(entity, value, model) {
						entity.DateDelivered = value;
						entity.DateEffective = value || entity.DateEffective;
						var result = {apply: true, valid: true};
						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
						return result;
					}

					function validateClerkPrcFk(entity, value, model) {
						entity.ClerkPrcFk = value;
						var result = {apply: true, valid: true};
						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
						return result;
					}

					function validateClerkReqFk(entity, value) {
						entity.ClerkReqFk = value;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
						return true;
					}

					function asyncValidateDescription(entity, value, model) {
						var validateResult = {apply: true, valid: true};
						if (validationFk(value)) {
							var defer = $q.defer();
							defer.resolve(validateResult);

							return defer.promise;
						} else {
							var postData = {
								HeaderDto: entity,
								Value: value,
								Model: model
							};
							return descriptionValidateHttpService(postData);
						}
					}

					function updateControllingUnit(entity, value) {
						if (!entity || !value) {
							return true;
						}
						/* if (entity.ControllingUnitFk !== value) {
						 	var options = {
						 		bodyTextKey: $translate.instant('procurement.pes.updateControllingForItemsBoq'),
						 		showYesButton: true,
						 		showNoButton: true,
						 		iconClass: 'ico-question'
						 	};

						 	platformModalService.showDialog(options).then(function (response) {
						 		if (response.yes === true) {
						 			SetControllingUnit(entity, value);
						 		}
						 	});
						} */
						setControllingUnit(entity, value);
						return true;

					}

					function setControllingUnit(entity, value) {
						var pesItemService = $injector.get('procurementPesItemService');
						var pesItemValidateService = $injector.get('procurementPesItemValidationService');
						var validateService = pesItemValidateService(pesItemService);
						var pesItems = pesItemService.getList();
						if (pesItems !== null && pesItems.length > 0) {
							for (var i = 0; i < pesItems.length; i++) {
								if (!pesItems[i].ControllingUnitFk) {
									pesItems[i].ControllingUnitFk = value;
									validateService.validateControllingUnitFk(pesItems[i], value, 'ControllingUnitFk');
									pesItemService.markItemAsModified(pesItems[i]);
								}
							}
						}
						/* var pesBoqService = $injector.get("procurementPesBoqService");
						var pesBoqItems = pesBoqService.getList();
						if (pesBoqItems !== null && pesBoqItems.length > 0) {
							for (var j = 0; j < pesBoqItems.length; j++) {
								pesBoqItems[j].ControllingUnitFk = value;
								pesBoqService.markItemAsModified(pesBoqItems[j]);
							}
						} */
					}

					/**
					 * @ngdoc service
					 * @name descriptionValidateHttpService
					 * @description
					 * postData = {Id: Id,HeaderDto: HeaderDto,Value: value,Model: model };
					 */
					function descriptionValidateHttpService(postData) {
						var validateResult = {apply: true, valid: true};
						let asyncMarker = platformDataValidationService.registerAsyncCall(postData.HeaderDto, 'Description', postData.Value, dataService);
						asyncMarker.myPromise = $http.post(httpRoute, postData).then(
							function (result) {
								if (!result.data) {
									validateResult.valid = false;
									validateResult.error = $translate.instant('procurement.pes.uniqueErrorDescritionMessage', {description: postData.Value});
								} else {
									validateResult.valid = true;
								}
								return platformDataValidationService.finishAsyncValidation(angular.copy(validateResult), postData.HeaderDto, postData.Value, 'Description', asyncMarker, service, dataService);
								//return validateResult;
							});
						return asyncMarker.myPromise;
					}

					function validateDocumentDate(entity, value) {
						entity.DateDelivered = value;
						return {apply: true, valid: true};
					}

					function asyncValidateBusinessPartnerFk(entity, value, model, isMandatoryCheck) {
						businessPartnerValidatorService.resetArgumentsToValidate();
						businessPartnerValidatorService.businessPartnerValidator.apply(null, [entity, value]);

						isMandatoryCheck = (typeof (isMandatoryCheck) === 'boolean') ? isMandatoryCheck : false;
						var defer = $q.defer();
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						asyncMarker.myPromise = defer.promise;
						var validateResult = {apply: true, valid: true},
							postData = {
								HeaderDto: entity,
								Value: value,
								Model: 'BusinessPartnerFk'
							};

						if (validationFk(value)) {
							entity.SubsidiaryFk = null;
							validateResult.valid = false;
							validateResult.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
							/* jshint -W106 */
							validateResult.error$tr$param$ = {fieldName: $translate.instant('cloud.common.entityBusinessPartner')};
							defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(validateResult), entity, value, model, asyncMarker, service, dataService));
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						} else if (!isMandatoryCheck) {
							$http.post(httpRoute, postData).then(function (dataItem) {
								if (dataItem.data) {
									basicsLookupdataLookupDescriptorService.attachData(dataItem.data || {});
									var item = dataItem.data.dtos;
									entity.SubsidiaryFk = item.SubsidiaryFk;
									platformRuntimeDataService.readonly(entity, [{
										field: 'SubsidiaryFk',
										readonly: false
									}]);
									/** @namespace dataItem.data.DescriptionIsUnique */
									descriptionIsUnique(entity,dataItem.data.DescriptionIsUnique);
								}
								const result = platformDataValidationService.finishAsyncValidation(angular.copy(validateResult), entity, value, model, asyncMarker, service, dataService);
								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
								dataService.gridRefresh();
								defer.resolve(result);
							});
						} else {
							const result = platformDataValidationService.finishAsyncValidation(angular.copy(validateResult), entity, value, model, asyncMarker, service, dataService);
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							dataService.gridRefresh();
							defer.resolve(result);
						}
						return defer.promise;
					}

					function descriptionIsUnique(entity, isUnique) {
						var validateResult = {apply: true, valid: true};
						if (isUnique === false) {
							validateResult.valid = false;
							validateResult.error = $translate.instant('procurement.pes.uniqueErrorDescritionMessage', {description: entity.Description});
						}
						platformDataValidationService.finishValidation(angular.copy(validateResult), entity, entity.Description, 'Description', service, dataService);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, 'Description');
					}

					function asyncValidateSupplierFk(entity, value) {
						let defer = $q.defer();
						var validateResult = {apply: true, valid: true},
							postData = {
								HeaderDto: entity,
								Value: value,
								Model: 'SupplierFk'
							};

						if (entity.BusinessPartnerFk === null || entity.BusinessPartnerFk === -1) {
							$http.post(httpRoute, postData).then(function (dataItem) {
								if (dataItem.data) {
									basicsLookupdataLookupDescriptorService.attachData(dataItem.data || {});
									var item = dataItem.data.dtos;
									entity.BusinessPartnerFk = item.BusinessPartnerFk;
									entity.SubsidiaryFk = item.SubsidiaryFk;
									platformRuntimeDataService.readonly(entity, [{
										field: 'SubsidiaryFk',
										readonly: false
									}]);
									descriptionIsUnique(entity,dataItem.data.DescriptionIsUnique);

									// validate businessPartnerFk
									var businessPartnerFkValidateResult = {apply: true, valid: true};
									if (validationFk(entity.BusinessPartnerFk)) {
										businessPartnerFkValidateResult.valid = false;
										businessPartnerFkValidateResult.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
										/* jshint -W106 */
										businessPartnerFkValidateResult.error$tr$param$ = {fieldName: $translate.instant('cloud.common.entityBusinessPartner')};
									}
									platformDataValidationService.finishValidation(angular.copy(businessPartnerFkValidateResult), entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
									platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BusinessPartnerFk');
									businessPartnerValidatorService.resetArgumentsToValidate();
									businessPartnerValidatorService.asyncSupplierValidator(entity, value).then(function () {
										dataService.gridRefresh();
										defer.resolve(validateResult);
									});
								}
								else {
									defer.resolve(validateResult);
								}
							});
						}
						else {
							businessPartnerValidatorService.resetArgumentsToValidate();
							businessPartnerValidatorService.asyncSupplierValidator(entity, value).then(function() {
								defer.resolve(validateResult);
							});
						}
						return defer.promise;
					}

					var procurementCommonControllingUnitFactory = $injector.get('procurementCommonControllingUnitFactory');

					function validateProjectFk(entity, value) {
						if (entity.ProjectFk !== value) {
							var clerkData = {
								prcStructureFk: entity.PrcStructureFk,
								projectFk: value,
								companyFk: entity.CompanyFk
							};

							$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
								if (!_.isNil(response.data[0])) {
									entity.ClerkPrcFk = response.data[0];
								}
								if (!_.isNil(response.data[1])) {
									entity.ClerkReqFk = response.data[1];
								}

								var clerkPrcFkValidateResult = service.validateClerkPrcFk(entity, entity.ClerkPrcFk, 'ClerkPrcFk');
								platformRuntimeDataService.applyValidationResult(clerkPrcFkValidateResult, entity, 'ClerkPrcFk');
								dataService.fireItemModified(entity);
							});

							var oldControllingUnitFk = entity.ControllingUnitFk;

							if (!entity.ConHeaderFk && value) {
								entity.ProjectFk = value;
								$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
									if (res[0] !== '' && res[0] !== null) {
										entity.ControllingUnitFk = res[0];
									}
									validateCurrencyFk(entity, entity.CurrencyFk);
								});
							} else {
								if (!value) {
									entity.ControllingUnitFk = null;
								} else {
									$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
										if (res[0] !== '' && res[0] !== null) {
											entity.ControllingUnitFk = res[0];
										}
										validateCurrencyFk(entity, entity.CurrencyFk);
									});
								}
							}

							projectStatus(entity, value);
						}

						entity.PackageFk = null;
						return {apply: true, valid: true};
					}

					function asyncValidateConHeaderFk(entity, value) {
						dataService.removeChildItems();
						return validateConHeader(entity, value);
					}

					function validateConHeader(entity, value) {

						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, 'ConHeaderFk', value, dataService);

						var validateResult = {apply: true, valid: true},
							postData = {
								HeaderDto: entity,
								Value: value,
								Model: 'ConHeaderFk'
							};

						if (value === null || value === '') {
							entity.BusinessPartnerFk = -1;
							entity.SubsidiaryFk = null;
							entity.SupplierFk = null;
							entity.PrcStructureFk = null;
							entity.CallOffMainContractFk = null;
							entity.CallOffMainContract = '';
							entity.CallOffMainContractDes = '';

							platformRuntimeDataService.readonly(entity, [{field: 'CurrencyFk', readonly: false}]);
							platformRuntimeDataService.readonly(entity, [{field: 'SalesTaxMethodFk', readonly: false}]);
							var businessPartnerFkValidateResult = {apply: true, valid: true};
							if (validationFk(entity.BusinessPartnerFk)) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'SubsidiaryFk',
									readonly: true
								}]);
								businessPartnerFkValidateResult.valid = false;
								businessPartnerFkValidateResult.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
								/* jshint -W106 */
								businessPartnerFkValidateResult.error$tr$param$ = {fieldName: $translate.instant('cloud.common.entityBusinessPartner')};
							}

							platformRuntimeDataService.applyValidationResult(businessPartnerFkValidateResult, entity, 'BusinessPartnerFk');
							platformDataValidationService.finishValidation(angular.copy(businessPartnerFkValidateResult), entity, null, 'BusinessPartnerFk', service, dataService);
							asyncMarker.myPromise = $q.when(platformDataValidationService.finishAsyncValidation(validateResult, entity, null, 'ConHeaderFk', asyncMarker, service, dataService)).finally(function () {
								dataService.gridRefresh();
							});
						} else {
							platformRuntimeDataService.readonly(entity, [{field: 'CurrencyFk', readonly: true}]);
							platformRuntimeDataService.readonly(entity, [{field: 'SalesTaxMethodFk', readonly: true}]);
							var validatePromise = $http.post(httpRoute, postData);
							// eslint-disable-next-line no-unused-vars
							var clerkData = {
								prcStructureFk: entity.PrcStructureFk,
								projectFk: entity.ProjectFk,
								companyFk: entity.CompanyFk
							};
							// var getClerkPromise = $http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData);
							var requests = [];
							requests.push(validatePromise);
							// requests.push(getClerkPromise);
							var conHeader = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: value});
							if (conHeader) {
								if (conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
									var getItemPromise = $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + conHeader.ConHeaderFk);
									requests.push(getItemPromise);
								}

								entity.ClerkPrcFk = conHeader.ClerkPrcFk;
								entity.ClerkReqFk = conHeader.ClerkReqFk;
								entity.SalesTaxMethodFk = conHeader.SalesTaxMethodFk;
								// validate clerkPrcFk
								var clerkPrcFkValidateResult = service.validateClerkPrcFk(entity, entity.ClerkPrcFk, 'ClerkPrcFk');
								platformRuntimeDataService.applyValidationResult(clerkPrcFkValidateResult, entity, 'ClerkPrcFk');

							}
							asyncMarker.myPromise = $q.all(requests).then(function (response) {

								var asyncRequests = [];

								var dataItem = response[0];
								if (dataItem.data) {
									basicsLookupdataLookupDescriptorService.attachData(dataItem.data || {});
									var item = dataItem.data.dtos;
									item.ClerkPrcFk = entity.ClerkPrcFk;
									item.ClerkReqFk = entity.ClerkReqFk;
									removeFileds(item);
									angular.extend(entity, item);
									asyncRequests.push(asyncValidateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk'));
									asyncRequests.push(asyncGetDefaultExchangeRate(entity));

									// validate BusinessPartnerFk
									var businessPartnerFkValidateResult = {apply: true, valid: true};
									if (validationFk(entity.BusinessPartnerFk)) {
										businessPartnerFkValidateResult.valid = false;
										businessPartnerFkValidateResult.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
										/* jshint -W106 */
										businessPartnerFkValidateResult.error$tr$param$ = {fieldName: $translate.instant('cloud.common.entityBusinessPartner')};
									}
									platformDataValidationService.finishValidation(angular.copy(businessPartnerFkValidateResult), entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
									platformRuntimeDataService.applyValidationResult(businessPartnerFkValidateResult, entity, 'BusinessPartnerFk');
									platformRuntimeDataService.readonly(entity, [{
										field: 'SubsidiaryFk',
										readonly: false
									}]);

									platformRuntimeDataService.readonly(entity, [{
										field: 'ExchangeRate',
										readonly: entity.CurrencyFk === procurementContextService.companyCurrencyId
									}]);

								}
								if (response[2]) {
									var callOffContract = response[2].data;
									if (callOffContract) {
										entity.CallOffMainContractFk = callOffContract.Id;
										entity.CallOffMainContract = callOffContract.Code;
										entity.CallOffMainContractDes = callOffContract.Description;
									}
								}
								asyncRequests.push(dataService.conHeaderChanged(entity, value));

								asyncRequests.push(service.asyncValidatePrcConfigurationFk(entity, entity.PrcConfigurationFk, 'PrcConfigurationFk', true));

								// validate PrcConfigurationFk
								asyncRequests.push(asyncValidateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk'));

								// validate PrcConfigurationFk
									return $q.all(asyncRequests).then(function (result) {
										entity.ExchangeRate = result[1] ? result[1] : entity.ExchangeRate;
										$timeout(function () {
											dataService.markItemAsModified(entity);
											dataService.update().then(function () {
												if(dataService.getSelected()) {
													var pesBoqService = $injector.get('procurementPesBoqService');
													pesBoqService.createOtherItems({ConHeaderFk: value}, true);
												}
											});
										}, 100);
										return platformDataValidationService.finishAsyncValidation(validateResult, entity, value, 'ConHeaderFk', asyncMarker, service, dataService);
									}).finally(function () {
										dataService.gridRefresh();
									});

							});
						}

						return asyncMarker.myPromise;
					}

					function validatePackageFk(entity, value) {
						var validateResult = {apply: true, valid: true},
							postData = {
								HeaderDto: entity,
								Value: value,
								Model: 'PackageFk'
							};

						$http.post(httpRoute, postData).then(function (dataItem) {
							if (dataItem.data) {
								basicsLookupdataLookupDescriptorService.attachData(dataItem.data || {});
								var item = dataItem.data.dtos;
								removeFileds(item);
								angular.extend(entity, item);

								// validate clerkPrcFk
								var clerkPrcFkValidateResult = service.validateClerkPrcFk(entity, entity.ClerkPrcFk, 'ClerkPrcFk');
								platformRuntimeDataService.applyValidationResult(clerkPrcFkValidateResult, entity, 'ClerkPrcFk');

								// when choose the package will not affect the params of bp(businessPartners,subsidiaries,suppliers) 2017/09/08 by jack
								// validate BusinessPartnerFk
								var businessPartnerFkValidateResult = {apply: true, valid: true};
								if (validationFk(entity.BusinessPartnerFk)) {
									businessPartnerFkValidateResult.valid = false;
									businessPartnerFkValidateResult.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
									businessPartnerFkValidateResult.error$tr$param$ = {fieldName: $translate.instant('cloud.common.entityBusinessPartner')};
								}
								platformDataValidationService.finishValidation(angular.copy(businessPartnerFkValidateResult), entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
								platformRuntimeDataService.applyValidationResult(businessPartnerFkValidateResult, entity, 'BusinessPartnerFk');

								dataService.gridRefresh();
							}

							return validateResult;
						});

						return validateResult;
					}

					function asyncValidatePrcConfigurationFk(entity, value, model, fromContract) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						var result = {apply: true, valid: true};

						var defaultListNotModified = null;
						var sourceSectionId = 32;// 32 is  prcurement Configration
						var targetSectionId = 20;// 20 is  Pes.

						var sourceHeaderId = value;
						var targetHeaderId;
						if(dataService.getSelected()){
							targetHeaderId = dataService.getSelected().Id;
						}

						var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
						defaultListNotModified = charDataService.getList();
						var newItem = [];
						angular.forEach(defaultListNotModified, function (item) {
							newItem.push(item);
						});

						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							asyncMarker.myPromise = $q.when(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
						} else {
							var postData = {
								HeaderDto: entity,
								Value: value,
								Model: model
							};

							var validatePromise = $http.post(httpRoute, postData).then(function (dataItem) {
								if (dataItem.data) {
									var oldConfig = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.PrcConfigurationFk});
									var item = dataItem.data.dtos;
									var oldCode = entity.Code;
									var oldVersion = entity.Version;
									removeFileds(item);
									angular.extend(entity, item);
									// set to the original version
									if (entity.Version === 0) {
										entity.Version = oldVersion;
									}
									// make sure the existing code not be replaced by isGenerated
									if (entity.Version !== 0) {
										entity.Code = oldCode;
									}

									var newConfig = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});

									if (value && entity.Version === 0 && (oldConfig.Id !== value || fromContract)) {
										procurementPesNumberGenerationSettingsService.assertLoaded().then(function () {
											platformRuntimeDataService.readonly(entity, [{
												field: 'Code',
												readonly: procurementPesNumberGenerationSettingsService.hasToGenerateForRubricCategory(newConfig.RubricCategoryFk)
											}]);
											entity.Code = procurementPesNumberGenerationSettingsService.provideNumberDefaultText(newConfig.RubricCategoryFk, entity.Code);
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

									entity.PrcConfigurationFk = value;
									var asyncRequests = [];
									if (fromContract) {
										if(!_.isNil(dataService.getSelected())) {
											asyncRequests.push(dataService.AsyncBillingSchemaChanged.fireAsync());
										}
										asyncRequests.push(basicsLookupdataLookupDescriptorService.loadItemByKey('PrcConfig2BSchema', value));
									} else {
										asyncRequests.push(asyncValidateBillingSchemaFk(entity, null, 'BillingSchemaFk'));
										asyncRequests.push(fireConfigurationChangeAsync(entity));
									}
									return $q.all(asyncRequests).finally(function () {
										dataService.gridRefresh();
									});
								}
							});

							var getAndSetListPromise = $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
									if(!_.isNil(dataService.getSelected())) {
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
							});

							asyncMarker.myPromise = $q.all([validatePromise, getAndSetListPromise]).then(function () {
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							});
						}

						return asyncMarker.myPromise;
					}

					// validateCurrencyFk
					function validateCurrencyFk(entity, value) {
						value = value || -1;

						platformRuntimeDataService.readonly(entity, [{
							field: 'ExchangeRate',
							readonly: value === procurementContextService.companyCurrencyId
						}]);

						if (value === procurementContextService.companyCurrencyId) {
							entity.ExchangeRate = 1.0;
							dataService.fireExchangeRateChanged(null, {ExchangeRate: entity.ExchangeRate});
							validateExchangeRate(entity, 1, 'ExchangeRate', true);
						} else {
							getCurrentRate(entity, value).then(
								function (response) {
									if (response) {
										entity.ExchangeRate = response.data;
										if (entity.ExchangeRate > 0) {
											dataService.fireExchangeRateChanged(null, {ExchangeRate: entity.ExchangeRate});
										}
										validateExchangeRate(entity, entity.ExchangeRate, 'ExchangeRate', true);
										dataService.gridRefresh();
									}
								});
						}
						return true;
					}

					function asyncValidateCurrencyFk(entity, value, model) {
						var originalCurrency = entity[model];
						var originalRate = entity.ExchangeRate;
						entity.CurrencyFk = value;
						if (value === procurementContextService.companyCurrencyId) {
							entity.ExchangeRate = 1;
							if (entity.Version === 0) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'ExchangeRate',
									readonly: entity.CurrencyFk === procurementContextService.companyCurrencyId
								}]);
							}
							return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
						} else {
							return getCurrentRate(entity, value).then(
								function (response) {
									if (response) {
										entity.ExchangeRate = response.data;
										if (entity.Version === 0) {
											platformRuntimeDataService.readonly(entity, [{
												field: 'ExchangeRate',
												readonly: entity.CurrencyFk === procurementContextService.companyCurrencyId
											}]);
										}
										return procurementCommonExchangerateValidateService.asyncModifyRate(entity, entity.ExchangeRate, model, service, dataService, updateExchangeRateUrl, originalRate, originalCurrency);
									}
								}, function (error) {
									console.error(error);
								}
							);
						}
					}

					function asyncValidateDateEffective(entity,value,model) {
						let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
						// let boqMainSrvc = $injector.get('prcBoqMainService').getService(dataService);
						let prcPesBoqService = $injector.get('procurementPesBoqService');
						let selectHeader =  dataService.getSelected();
						return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,prcPesBoqService, dataService, service, {
							ProjectId: entity.ProjectFk,
							Module: 'procurement.pes',
							BoqHeaderId: entity.Id,
							HeaderId: selectHeader.Id,
							ExchangeRate: entity.ExchangeRate
						});
					}

					function asyncGetDefaultExchangeRate(entity) {
						if (entity.CurrencyFk === procurementContextService.companyCurrencyId) {
							var rate = 1.0;
							var defer = $q.defer();
							defer.resolve(rate);
							return defer.promise;
						} else {
							return getCurrentRate(entity, entity.CurrencyFk).then(
								function (response) {
									if (response) {
										return response.data;
									}
								});
						}
					}

					// noinspection JSUnusedLocalSymbols
					function validateExchangeRate(entity, value, model, isUpdated) {
						isUpdated = isUpdated || false;
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

						if (!isUpdated && value > 0) {
							entity[model] = value;
							dataService.fireExchangeRateChanged(null, {ExchangeRate: value});
						}

						return result;
					}

					function asyncValidateExchangeRate(entity, value, model) {
						if (entity.ExchangeRate === value) {
							const defer = $q.defer();
							defer.resolve(true);
							return defer.promise;
						}
						var originalRate = entity.ExchangeRate;
						entity.ExchangeRate = value;
						return procurementCommonExchangerateValidateService.asyncModifyRate(entity, value, model, service, dataService, updateExchangeRateUrl, originalRate);
					}

					function validationFk(value) {
						return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
					}

					function removeFileds(item) {
						var fileds = ['DocumentDate', 'DateDeliveredFrom', 'DateDelivered', 'DateEffective'];
						for (var i = 0; i < fileds.length; i++) {
							delete item[fileds[i]];
						}
					}

					function getCurrentRate(entity, value) {
						var exchangeRateUri = globals.webApiBaseUrl + 'procurement/common/exchangerate/defaultrate';
						return $http({
							method: 'GET',
							url: exchangeRateUri,
							params: {
								CompanyFk: platformContextService.clientId,
								CurrencyForeignFk: value,
								ProjectFk: entity.ProjectFk
							}
						});
					}

					function validateControllingUnitFk(entity, value) {
						if (value) {
							var controllingUnits = basicsLookupdataLookupDescriptorService.getData('controllingunit');
							if (controllingUnits) {
								var controllingUnit = controllingUnits[value];
								if (controllingUnit && controllingUnit.PrjProjectFk) {
									if (entity.ProjectFk !== controllingUnit.PrjProjectFk) {
										projectStatus(entity, controllingUnit.PrjProjectFk);
									}
									entity.ProjectFk = controllingUnit.PrjProjectFk;
									var projects = basicsLookupdataLookupDescriptorService.getData('prcproject');
									if (projects) {
										var project = projects[controllingUnit.PrjProjectFk];
										if (!project) {
											basicsLookupdataLookupDescriptorService.loadItemByKey('prcproject', controllingUnit.PrjProjectFk);
										}
									}
								}
							}
							dataService.gridRefresh();
						}

						updateControllingUnit(entity, value);
						return true;
					}

					/* function getControllingUnits(projectId) {
						var defer = $q.defer();
						$http.get(globals.webApiBaseUrl + 'controlling/structure/tree?mainItemId=' + projectId).then(function (response) {
							defer.resolve(response.data);
						});
						return defer.promise;
					} */

					/* function getAllLevelUnits(Units, resultUnits) {
						_.forEach(Units, function (unit) {
							resultUnits.push(unit);
							if (unit.ControllingUnits !== null) {
								getAllLevelUnits(unit.ControllingUnits, resultUnits);
							}
						});
					} */

					// ControllingUnitFk
					function asyncValidateControllingUnitFk(entity, value, model) {

						var defer = $q.defer();
						var result = {
							apply: true,
							valid: true
						};
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
						if (null === value) {
							defer.resolve(true);
						} else {
							var ProjectFk = entity.ProjectFk;
							$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
								if (response.data) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('basics.common.error.controllingUnitError')
									};
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									defer.resolve(result);
								} else {
									defer.resolve(true);
								}
							});
							asyncMarker.myPromise = defer.promise;
						}
						asyncMarker.myPromise = defer.promise.then(function (response) {
							return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
						});
						return asyncMarker.myPromise;
					}

					function asyncValidateBillingSchemaFk(entity, value, model) {

						var result = {
							apply: true,
							valid: true
						};

						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);

						if (entity.BillingSchemaFk !== value) {
							entity.BillingSchemaFk = value;

							var loadPrcConfig2BSchemaPromise = basicsLookupdataLookupDescriptorService.loadItemByKey('PrcConfig2BSchema', value);

							asyncMarker.myPromise = $q.all([dataService.AsyncBillingSchemaChanged.fireAsync(), loadPrcConfig2BSchemaPromise]).then(function asyncRequest() {
								return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							}).finally(function () {
								dataService.gridRefresh();
							});
						} else {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							asyncMarker.myPromise = $q.when(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
						}
						return asyncMarker.myPromise;
					}

					function validateBpdVatGroupFk(entity) {
						entity.originVatGroupFk = entity.BpdVatGroupFk;
					}

					function fireConfigurationChangeAsync(entity) {
						if (entity.PrcConfigurationFk) {
							return $http.get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema?configurationFk=' + entity.PrcConfigurationFk).then(function (response) {
								if (entity.BillingSchemaFk !== response.data) {
									return asyncValidateBillingSchemaFk(entity, response.data || null, 'BillingSchemaFk');
								} else {
									return dataService.AsyncBillingSchemaChanged.fireAsync();
								}
							});
						} else {
							return asyncValidateBillingSchemaFk(entity, null, 'BillingSchemaFk');
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

					function applyBillingSchema(entity, value) {
						var defer = $q.defer();
						if (!value) {
							defer.resolve(false);
							return defer.promise;
						}

						if (entity.BillingSchemaFk === value) {
							dataService.markCurrentItemAsModified();
							defer.resolve(true);
							return defer.promise;
						}
						entity.BillingSchemaFk = value;
						dataService.AsyncBillingSchemaChanged.fireAsync();
						dataService.markCurrentItemAsModified();
						defer.resolve(true);
						return defer.promise;
					}

					function asyncSetPrcConfigFkAndBillingSchemaFkForWizard(entity, prcConfigFk, billingShcemaFk) {
						var defer = $q.defer();
						if (entity.PrcConfigurationFk === prcConfigFk && entity.BillingSchemaFk === billingShcemaFk) {
							defer.resolve(true);
						} else {
							asyncValidatePrcConfigurationFk(entity, prcConfigFk, 'PrcConfigurationFk').then(function () {
								applyBillingSchema(entity, billingShcemaFk).then(function () {
									defer.resolve(true);
								});
							});
						}
						return defer.promise;
					}

					return service;
				};
			}
		]);
})(angular);
