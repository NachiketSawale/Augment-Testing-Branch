/**
 * Created by wuj on 9/9/2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name basicsMaterialRecordValidationService
	 * @description provides validation methods for materialRecordItem
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.material').factory('basicsMaterialRecordValidationService',
		['validationService', 'basicsMaterialRecordService', 'platformDataValidationService', 'basicsLookupdataLookupDataService',
			'$http', 'basicsMaterialPriceConditionDataServiceNew', '$translate', '$q', 'basicsMaterialCharacteristicService', 'basicsLookupdataLookupDescriptorService', 'prcCommonCalculationHelper',
			'globals', 'materialNumberGenerationSettingsService', 'basicsLookupdataSimpleLookupService', 'platformRuntimeDataService', 'basicsMaterialInheritCodeValue', '_',
			function (validationService, dataService, platformDataValidationService, lookupService,
					$http, priceConditionService, $translate, $q, characteristicService, basicsLookupdataLookupDescriptorService, prcCommonCalculationHelper,
					globals, materialNumberGenerationSettingsService, basicsLookupdataSimpleLookupService, platformRuntimeDataService, basicsMaterialInheritCodeValue, _) {
				var service = validationService.create('materialGroupsItem', 'basics/material/schema');
				var self = this;
				service.validateUomFk = function (entity, value, model) {
					var tempValue = value === -1 ? '' : value;

					entity.BasUomPriceUnitFk = value;
					entity.FactorPriceUnit = 1;
					return platformDataValidationService.validateMandatory(entity, tempValue, model, service, dataService);
				};

				service.validateBasUomPriceUnitFk = function (entity, value) {
					entity.FactorPriceUnit = 1;
					var uoms = basicsLookupdataLookupDescriptorService.getData('Uom');
					if (uoms) {
						var uomObj = uoms[entity.UomFk];
						var uomPriceObj = uoms[value];
						if (uomObj && uomPriceObj) {
							if ((uomPriceObj.LengthDimension !== 0 && uomObj.LengthDimension === uomPriceObj.LengthDimension) ||
								(uomPriceObj.MassDimension !== 0 && uomObj.MassDimension === uomPriceObj.MassDimension) ||
								(uomPriceObj.TimeDimension !== 0 && uomObj.TimeDimension === uomPriceObj.TimeDimension)) {
								if (uomPriceObj.Factor !== 0 && uomPriceObj.Factor) {
									entity.FactorPriceUnit = uomObj.Factor / uomPriceObj.Factor;
								}
							}
						}
					}
				};
				service.validateCode = function validateCode(entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					if (!value) {
						validateResult.apply = true;
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model.toLowerCase()});
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
					var items = _.filter(dataService.getList(), function (item) {
						return value === item.Code && item.Id !== entity.Id && item.MaterialCatalogFk === entity.MaterialCatalogFk;
					});

					if (items.length && items.length > 0) {
						validateResult.apply = true;
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()});
					}
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.asyncValidateCode = function (entity, value, model) {
					var defer = $q.defer();

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					var result = platformDataValidationService.isMandatory(value, model);
					if (!result.valid) {
						defer.resolve(result);
					} else {
						service.checkIsUniqueMaterialCode(entity.Id, value, entity.MaterialGroupFk).then(function (response) {
							if (!response.data) {
								defer.resolve({
									apply: true, valid: false,
									error: $translate.instant('basics.material.error.materialCodeUniqueError')
								});
							} else {
								defer.resolve(true);
							}
						});
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});

					return asyncMarker.myPromise;
				};

				var onTaxCodeChange = function (prcStructureId, entity) {
					lookupService.getItemByKey('PrcStructure', prcStructureId).then(function (response) {
						if (!angular.isObject(response)) {
							return;
						}
						entity.MdcTaxCodeFk = response.TaxCodeFk;
						dataService.fireItemModified(entity);
					});
				};

				service.asyncValidateMaterialGroupFk = function (entity, value, model) {
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});

					if (value < 0) {
						defer.resolve({apply: true, valid: false, error: $translate.instant('basics.material.error.materialGroupSelectError')});
						return asyncMarker.myPromise;
					}

					service.checkIsUniqueMaterialCode(entity.Id, entity.Code, value).then(function (response) {
						if (response.data) {
							lookupService.getItemByKey('MaterialGroup', value).then(function (response) {
								if (!angular.isObject(response)) {
									return;
								}
								entity.MaterialCatalogFk = response.MaterialCatalogFk;
								if (response.PrcStructureFk) {
									onTaxCodeChange(response.PrcStructureFk, entity);
								} else {
									dataService.fireItemModified(entity);
								}
							});
						}
						if (!response.data) {
							defer.resolve({
								apply: true, valid: false,
								error: $translate.instant('basics.material.error.materialCodeUniqueError')
							});
						} else {
							characteristicService.createItems(entity, value);
							defer.resolve(response.data);
						}
					});

					return asyncMarker.myPromise;
				};

				service.validateMdcTaxCodeFk = function (entity, value) {
					entity.MdcTaxCodeFk = value;
					dataService.setCostPriceGross(entity);
					return true;
				};

				service.validateCostPriceGross = function (entity, value) {
					dataService.recalculatePriceByPriceGross(entity, value);
					return true;
				};

				service.costPriceValidator = function (entity, value, model) {
					let defer = $q.defer();
					// entity[model] = value ? value : 0;
					let originalValue = entity[model];
					dataService.recalculateCost(entity, value, model);
					// priceConditionService.recalculate(entity, entity.PrcPriceConditionFk);
					entity[model] = value;
					recalculatePriceCondition(entity).then(function () {
						entity[model] = originalValue;
						defer.resolve(true);
					});
					return defer.promise;
				};

				service.asyncValidateListPrice = service.costPriceValidator;
				service.asyncValidateDiscount = service.costPriceValidator;
				service.asyncValidateCharges = service.costPriceValidator;
				service.asyncValidatePriceExtra = service.costPriceValidator;
				service.asyncValidateRetailPrice = doRecalculatePriceCondition;
				service.asyncValidateWeight = doRecalculatePriceCondition;
				service.asyncValidateMaterialTempTypeFk = asyncValidateMaterialTempTypeFk;
				service.asyncValidateMaterialTempFk = asyncValidateMaterialTempFk;
				service.asyncValidatePackageTypeFk = asyncValidatePackageTypeFk;
				service.asyncValidateDangerClassFk = asyncValidateDangerClassFk;

				function recalculatePriceCondition(entity) {
					return priceConditionService.recalculate(entity, entity.PrcPriceConditionFk);
				}

				function doRecalculatePriceCondition(entity, value, model) {
					let defer = $q.defer();
					let originalValue = entity[model];
					entity[model] = value;
					recalculatePriceCondition(entity).then(function () {
						entity[model] = originalValue;
						defer.resolve(true);
					});
					return defer.promise;
				}

				service.validateNeutralMaterialCatalogFk = function (entity) {
					entity.MdcMaterialFk = null;
					return true;
				};

				service.validateStockMaterialCatalogFk = function (entity) {
					entity.MdcMaterialStockFk = null;
					service.asyncValidateMdcMaterialStockFk(entity, null, 'MdcMaterialStockFk');
					return true;
				};

				service.asyncValidateMdcMaterialStockFk = function (entity, value, model) {
					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (_.isNil(value)) {
						if (entity && entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors[model]) {
							delete entity.__rt$data.errors[model];
						}
						defer.resolve(true);
					} else {
						self.getMaterialInformationBasUoM(entity.Id).then(function (materialObject) {
							var materialItem = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', value);
							var arrayUomKeys = _.union(_.map(materialObject, 'BasUomFk'), _.castArray(entity.UomFk));

							if (_.includes(arrayUomKeys, materialItem.BasUomFk)) {
								defer.resolve(true);
							} else {
								result = {
									valid: false,
									apply: true,
									error: $translate.instant('basics.material.error.materialShouldCoversionUom')
								};
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							}
						});
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.asyncValidatePrcPriceconditionFk = function (entity, value) {
					var defer = $q.defer();
					dataService.priceConditionSelectionChanged.fire({Id: value});
					entity.PrcPriceConditionFk = value;
					priceConditionService.reload(entity, value).then(function () {
						defer.resolve(true);
					});

					return defer.promise;
				};

				service.checkIsUniqueMaterialCode = function (id, code, groupid) {
					return $http.get(globals.webApiBaseUrl + 'basics/material/isunique?id=' + id + '&&code=' + code + '&&groupFK=' + groupid);
				};

				self.getMaterialInformationBasUoM = function getMaterialInformationBasUoM(materialId) {
					return $http.get(globals.webApiBaseUrl + 'basics/material/basuom/list', {
						params: {
							mainItemId: materialId
						}
					}).then(function (response) {
						if (response.data) {
							return response.data;
						}
					});
				};

				return service;
				// /////////////////

				// validate danger class
				function asyncValidateDangerClassFk(entity, value) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					if (!value || value < 0) {
						defer.resolve(result);
					} else {
						var dangerClass = _.find(basicsLookupdataLookupDescriptorService.getData('DangerClass'), {Id: value});
						if (dangerClass && dangerClass.PackageTypeFk) {
							entity.PackageTypeFk = dangerClass.PackageTypeFk;
							asyncValidatePackageTypeFk(entity, entity.PackageTypeFk).then(function () {
								defer.resolve(result);
							});
						} else {
							defer.resolve(result);
						}
					}

					return defer.promise;
				}

				// validate packaging type.
				function asyncValidatePackageTypeFk(entity, value) {
					var defer = $q.defer();
					var result = {valid: true, apply: true};
					if (!value || value < 0) {
						defer.resolve(result);
					} else {
						var packageType = _.find(basicsLookupdataLookupDescriptorService.getData('PackagingType'), {Id: value});
						if (packageType) {
							entity.UomVolumeFk = packageType.UomFk || entity.UomVolumeFk;
							entity.Volume = packageType.DefaultCapacity;
							defer.resolve(result);
						} else {
							basicsLookupdataLookupDescriptorService.getItemByKey('PackagingType', value).then(function (packageType) {
								if (packageType) {
									entity.UomVolumeFk = packageType.UomFk || entity.UomVolumeFk;
									entity.Volume = packageType.DefaultCapacity;
								}
								defer.resolve(result);
							});
						}
					}

					return defer.promise;
				}

				function asyncValidateMaterialTempTypeFk(entity, value, model) {
					var defer = $q.defer();
					var result = {valid: true, apply: true};
					var asyncMarker = null;

					var hasToGenerate = entity.BasRubricCategoryFk && materialNumberGenerationSettingsService.hasToGenerateForRubricCategory(entity.BasRubricCategoryFk);
					var tempTypes = basicsLookupdataLookupDescriptorService.getData('materialTempType');
					var newTempType = tempTypes[value];

					if (!newTempType) {
						throw new Error('Please refresh the page because of the material temp type is not updated.');
					}

					if (newTempType && newTempType.Istemplate) {
						entity.MaterialTempFk = null;
					}

					var modifiedEntity = angular.copy(entity);
					modifiedEntity.MaterialTempTypeFk = value;
					dataService.setItemReadonly(null, modifiedEntity).processItem(entity);
					asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (entity.Version > 0) {
						asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/material/canchangetemptype?materialId=' + entity.Id + '&isTemplateOfNewType=' + newTempType.Istemplate)
							.then(function (response) {
								if (!response) {
									platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
									return result;
								}

								if (!response.data) {
									result.valid = false;
									result.error$tr$ = 'basics.material.error.materialCanNotBeSetToTypeOfNotTemplate';
									platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
									return result;
								}

								platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
								return result;
							});
					} else {
						asyncMarker.myPromise = defer.promise;
						defer.resolve(result);
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						DealWithCode();
						return asyncMarker.myPromise;
					}

					return asyncMarker.myPromise;

					// ///////////////////////////////////

					function DealWithCode() {
						if (entity.Version > 0 || hasToGenerate ||
							newTempType.InheritCodeFk === basicsMaterialInheritCodeValue.newCode || !entity.MaterialTempFk) {
							return;
						}

						var tempEntity = angular.copy(entity);
						tempEntity.MaterialTempTypeFk = value;
						tempEntity.Code = '';
						$http.post(globals.webApiBaseUrl + 'basics/material/generatecodeontemptypechanged', tempEntity)
							.then(function (response) {

								if (!response || !response.data) {
									return;
								}

								entity.Code = response.data;
								var codeResult = service.validateCode(entity, entity.Code, 'Code');
								platformRuntimeDataService.applyValidationResult(codeResult, entity, 'Code');
								dataService.gridRefresh();
							});
					}
				}

				function asyncValidateMaterialTempFk(entity, value, model) {
					var defer = $q.defer();
					var result = {valid: true, apply: true};

					var tempTypes = basicsLookupdataLookupDescriptorService.getData('materialTempType');
					var tempType = tempTypes[entity.MaterialTempTypeFk];

					if (tempType && tempType.Istemplate && value) {
						result.valid = false;
						result.error$tr$ = 'basics.material.error.materialIsTemplateShouldNoTempFk';
						defer.resolve(result);
						return defer.promise;
					}

					if (entity.Id === value) {
						result.valid = false;
						result.error$tr$ = 'basics.material.error.materialShouldNotSetTemplateToItSelf';
						defer.resolve(result);
						return defer.promise;
					}

					if (!value) {
						var modifiedEntity = angular.copy(entity);
						modifiedEntity.MaterialTempFk = value;
						dataService.setItemReadonly(null, modifiedEntity).processItem(entity);
						defer.resolve(result);
						return defer.promise;
					}

					dataService.setIsMaterialTempModified();
					dataService.materialTempChanged.fire();
					var materialLookups = basicsLookupdataLookupDescriptorService.getData('MaterialRecord');
					var oldMaterialTemp = entity.MaterialTempFk ? materialLookups[entity.MaterialTempFk] : null;
					var newMaterialTemp = materialLookups[value];
					var promises = [];
					var index = 0;
					var getFieldsUpdateStatusPromise = -1;
					var codeGeneratePromise = -1;
					var hasToGenerate = entity.BasRubricCategoryFk && materialNumberGenerationSettingsService.hasToGenerateForRubricCategory(entity.BasRubricCategoryFk);

					var tempUpdateStatuses = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
					var tempUpdateStatus = null;
					if (tempUpdateStatuses) {
						tempUpdateStatus = tempUpdateStatuses[value];
					}
					if (!tempUpdateStatus) {
						// getFieldsUpdateStatusPromise
						getFieldsUpdateStatusPromise = index++;
						promises.push($http.get(globals.webApiBaseUrl + 'basics/material/getmaterialfieldsupdatestatus?materialTempId=' + value));
					} else {
						var readonlyFields = dataService.buildFieldsReadonlyStatusFromUpdateStatuses([tempUpdateStatus]);
						if (angular.isArray(readonlyFields) && readonlyFields.length > 0) {
							dataService.setItemReadonly(readonlyFields).processItem(entity);
							updateUomFromMaterialTemp(entity, readonlyFields, newMaterialTemp);
						}
					}

					if (entity.Version <= 0 && !hasToGenerate && ((oldMaterialTemp && newMaterialTemp && oldMaterialTemp.Code.toLowerCase() !== newMaterialTemp.Code.toLowerCase()) ||
						!oldMaterialTemp) && (!tempType || (tempType && tempType.InheritCodeFk !== basicsMaterialInheritCodeValue.newCode))) {
						// codeGeneratePromise
						codeGeneratePromise = index++;
						var tempEntity = angular.copy(entity);
						tempEntity.MaterialTempFk = value;
						promises.push($http.post(globals.webApiBaseUrl + 'basics/material/generatecodeontemptypechanged', tempEntity));
					}

					if (promises.length > 0) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						asyncMarker.myPromise = $q.all(promises).then(function (responses) {
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							if (!angular.isArray(responses) || responses.length <= 0 /* || !responses.valueUpdatePromise */) {
								return result;
							}

							if (responses[getFieldsUpdateStatusPromise]) {
								var updateStatuses = [responses[getFieldsUpdateStatusPromise].data];
								basicsLookupdataLookupDescriptorService.updateData('materialTempUpdateStatus', updateStatuses);
								var readonlyFields = dataService.buildFieldsReadonlyStatusFromUpdateStatuses(updateStatuses);
								if (angular.isArray(readonlyFields) && readonlyFields.length > 0) {
									dataService.setItemReadonly(readonlyFields).processItem(entity);
									updateUomFromMaterialTemp(entity, readonlyFields, newMaterialTemp);
								}
							}

							if (responses[codeGeneratePromise]) {
								var codeGeneratedResult = responses[codeGeneratePromise].data;
								if (codeGeneratedResult) {
									var codeResult = {apply: true, valid: true};
									if (codeGeneratedResult.startsWith('Error:')) {
										var errMsg = codeGeneratedResult.substr(6);
										entity.Code = null;
										codeResult = {apply: true, valid: false, error: errMsg};
										platformRuntimeDataService.applyValidationResult(codeResult, entity, 'Code');
										platformDataValidationService.finishValidation(codeResult, entity, null, 'Code', service, dataService);
									} else {
										entity.Code = codeGeneratedResult;
										codeResult = service.validateCode(entity, entity.Code, 'Code');
										platformRuntimeDataService.applyValidationResult(codeResult, entity, 'Code');
										platformDataValidationService.finishValidation(codeResult, entity, codeGeneratedResult, 'Code', service, dataService);
									}
								}
							}

							dataService.gridRefresh();
							return result;
						}, function () {
							platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							return result;
						});
						return asyncMarker.myPromise;
					}

					defer.resolve(result);
					return defer.promise;

					// ////////////////////
					function updateUomFromMaterialTemp(entity, readonlyFields, materialTemp) {
						if ((entity.UomFk && entity.UomFk !== -1) || !angular.isArray(readonlyFields) || readonlyFields <= 0 || !materialTemp) {
							return;
						}
						var uomField = _.find(readonlyFields, {field: 'UomFk'});
						if (uomField && uomField.readonly) {
							entity.UomFk = materialTemp.BasUomFk;
							var uomResult = service.validateUomFk(entity, entity.UomFk, 'UomFk');
							platformRuntimeDataService.applyValidationResult(uomResult, entity, 'UomFk');
						}
					}
				}
			}
		]);
})(angular);
