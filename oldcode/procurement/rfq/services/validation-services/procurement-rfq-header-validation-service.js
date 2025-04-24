(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	/** @namespace entity.reqSelectedItem */
	/**
	 * @ngdoc service
	 * @name procurementRfqHeaderValidationService
	 * @function
	 * @requires platformDataValidationService
	 *
	 * @description
	 * #validation service for rfq header.
	 */

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,console */

	angular.module(moduleName).factory('procurementRfqHeaderValidationService',
		['$injector', 'platformDataValidationService', 'procurementCommonCodeHelperService', '$http', 'basicsLookupdataLookupDescriptorService', 'procurementContextService', 'platformRuntimeDataService', 'basicsCharacteristicDataServiceFactory',
			'_', 'procurementRfqNumberGenerationSettingsService', '$q', '$translate',
			function ($injector, platformDataValidationService, procurementCommonCodeHelperService, $http, basicsLookupdataLookupDescriptorService, procurementContextService, platformRuntimeDataService, basicsCharacteristicDataServiceFactory,
				_, procurementRfqNumberGenerationSettingsService, $q, $translate) {
				return function (dataService) {

					var service = {};

					service.removeError = function (entity) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							entity.__rt$data.errors = null;
						}
					};
					service.validateModel = function () {
						return true;
					};
					service.validatePlannedStart = function (entity, value, model) {
						return platformDataValidationService.validatePeriod(value, entity.PlannedEnd, entity, model, service, dataService, 'PlannedEnd');
					};
					service.validatePlannedEnd = function (entity, value, model) {
						return platformDataValidationService.validatePeriod(entity.PlannedStart, value, entity, model, service, dataService, 'PlannedStart');
					};

					var reloadBillingSchema = function reloadBillingSchema(entity, value) {
						if (entity) {
							$http.get(globals.webApiBaseUrl + 'procurement/common/configuration/defaultbillingschemas?configurationFk=' + value)
								.then(function (response) {
									if (angular.isArray(response.data) && response.data.length > 0) {
										var items = response.data;
										entity.BillingSchemaFk = items[0].Id;
									} else {
										entity.BillingSchemaFk = null;
									}
									dataService.gridRefresh();
								});
						}
					};

					// update 'Code' if PrcConfiguration changed, then validate.
					service.validatePrcConfigurationFk = function validatePrcConfigurationFk(entity, value, model, isFromWizard) {
						var prcConfigurationEntity = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
						if (prcConfigurationEntity) {
							entity.PrcContractTypeFk = prcConfigurationEntity.PrcContractTypeFk;
						}
						if (entity.Version === 0) {
							procurementRfqNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(entity, [{
									field: 'Code',
									readonly: procurementRfqNumberGenerationSettingsService.hasToGenerateForRubricCategory(prcConfigurationEntity.RubricCategoryFk)
								}]);
								entity.Code = procurementRfqNumberGenerationSettingsService.provideNumberDefaultText(prcConfigurationEntity.RubricCategoryFk, entity.Code);

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
							});

							// not from change configuration wizard
							if (!isFromWizard) {
								dataService.reloadHeaderText(entity, {
									isOverride: true
								});
							}
						}

						entity.PrcConfigurationFk = value;
						if (prcConfigurationEntity) {
							entity.PaymentTermPaFk = prcConfigurationEntity.PaymentTermPaFk;
							entity.PaymentTermFiFk = prcConfigurationEntity.PaymentTermFiFk;
							entity.PaymentTermAdFk = prcConfigurationEntity.PaymentTermAdFk;
						}
						dataService.markCurrentItemAsModified();
						var defaultListNotModified = null;
						var sourceSectionId = 32;// 32 is  prcurement Configration
						var targetSectionId = 19;// 19 is  Rfq.
						// var rfqMainService = $injector.get('procurementRfqMainService');
						var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
						defaultListNotModified = charDataService.getList();
						var newItem = [];
						angular.forEach(defaultListNotModified, function (item) {
							newItem.push(item);
						});
						if (value) {
							var sourceHeaderId = value;
							if(dataService.getSelected())
							{
								const targetHeaderId = dataService.getSelected().Id;
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

							reloadBillingSchema(entity, value);
						}
						var result = platformDataValidationService.isMandatory(value === -1 ? 0 : value, model);
						result.apply = true;
						return result;
					};

					service.validateCode = function (entity, value, field) {
						var filter = function (item) {
							return item.CompanyFk === entity.CompanyFk && item.PrcConfigurationFk === entity.PrcConfigurationFk;
						};
						var result = platformDataValidationService.isUnique(_.filter(dataService.getList(), filter), field, value, entity.Id);
						platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);
						return result;
					};

					service.validateProjectFk = function (entity, value) {
						if (entity.reqSelectedItem) {
							var reqHeaderId = entity.reqSelectedItem.Targetfk;
							$http.get(globals.webApiBaseUrl + 'procurement/rfq/header/getStructureFk?reqHeaderId=' + reqHeaderId).then(function (response) {
								var clerkData = {
									prcStructureFk: response.data,
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
									dataService.fireItemModified(entity);
								});
							});
						}

						entity.ProjectFk = value;
						dataService.reloadHeaderText(entity, {
							isOverride: true
						});

						projectStatus(entity, value);
						updateExchangeRate(entity, entity.CurrencyFk);
						return true;
					};

					service.asyncValidateCode = function (entity, value, model) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						return platformDataValidationService.isAsyncGroupUnique(globals.webApiBaseUrl + 'procurement/rfq/header/isreferenceunique',
							{
								code: value,
								companyFk: entity.CompanyFk,
								configurationFk: entity.PrcConfigurationFk
							},
							entity.Id, model, 'referenceUniqueError'
						).then(function (validationResult) {
							platformDataValidationService.finishAsyncValidation(validationResult, entity, value, model, asyncMarker, service, dataService);
							return validationResult;
						});
					};

					service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk/* , billingShcemaFk */) {
						var promise1 = service.validatePrcConfigurationFk(entity, prcConfigFk, 'PrcConfigurationFk', true);
						return $q.all([promise1]);
					};

					service.validatePrcStrategyFk = function validatePrcStrategyFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if ((_.isNil(value) || value < 1)) {
							result.valid = false;
							result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
							result.error$tr$param$ = {'p_0': $translate.instant('procurement.requisition.headerGrid.reqheaderStrategy')};
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					};

					service.validatePrcContractTypeFk = function validatePrcContractTypeFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if ((_.isNil(value) || value < 1)) {
							result.valid = false;
							result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
							result.error$tr$param$ = {'p_0': $translate.instant('procurement.requisition.headerGrid.headerPrcContractType')};
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					};

					service.validateRfqTypeFk = function validateRfqTypeFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if ((_.isNil(value) || value < 1)) {
							result.valid = false;
							result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
							result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.entityType')};
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					};

					return service;

					// //////////////////////////
					function updateExchangeRate(entity, currencyId) {
						currencyId = currencyId || -1;

						if (currencyId === procurementContextService.companyCurrencyId) {
							entity.ExchangeRate = 1.0;
							dataService.exchangeRateChanged.fire();
							validateExchangeRate(entity, 1, 'ExchangeRate');
						} else {
							getCurrentRate(entity, currencyId).then(
								function (response) {
									if (response) {
										var rate = response.data;
										entity.ExchangeRate = rate;
										if (rate) {
											dataService.exchangeRateChanged.fire();
										}
										validateExchangeRate(entity, rate, 'ExchangeRate');
										dataService.gridRefresh();
									}
								}, function (error) {
									console.error(error);
								}
							);
						}
					}

					function getCurrentRate(entity, value) {
						var exchangeRateUri = globals.webApiBaseUrl + 'procurement/common/exchangerate/rate';
						return $http({
							method: 'GET',
							url: exchangeRateUri,
							params: {
								CompanyFk: procurementContextService.loginCompany,
								CurrencyForeignFk: value,
								ProjectFk: entity.ProjectFk
							}
						});
					}

					function validateExchangeRate(entity, value, model) {
						var result = {apply: true, valid: true};
						if (!value) {
							result = {apply: true, valid: false, error: 'should not zero'};
						}

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
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
				};
			}
		]);
})(angular);
