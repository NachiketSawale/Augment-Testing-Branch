/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesResourceValidationServiceFactory
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('estimateAssembliesResourceValidationServiceFactory', [
		'$q', '$http', '$injector', '$translate', 'estimateMainResourceProcessor', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateMainCommonService',
		'estimateMainResourceType', 'estimateCommonAssemblyType',
		function ($q, $http, $injector, $translate, estimateMainResourceProcessor, platformDataValidationService, platformRuntimeDataService, estimateMainCommonService,
			estimateMainResourceType, estimateCommonAssemblyType) {

			let factoryService = {};

			factoryService.createEstAssemblyResourceValidationService = function createEstAssemblyResourceValidationService(estimateAssembliesResourceService, estimateAssembliesService, isPrjAssembly, isPlantAssembly, isPrjPlantAssembly, isMasterAssembly) {
				let service = {},
					plantAssembly = isPlantAssembly;

				service.getAssemblyType = function getAssemblyType() {
					if(estimateAssembliesResourceService && estimateAssembliesResourceService.getAssemblyType){
						return estimateAssembliesResourceService.getAssemblyType();
					}
					if(isPrjPlantAssembly){
						return estimateCommonAssemblyType.ProjectPlantAssembly;
					}else if(isPrjAssembly){
						return estimateCommonAssemblyType.ProjectAssembly;
					}else if(isPlantAssembly && !isPrjAssembly){
						return estimateCommonAssemblyType.PlantAssembly;
					}else{
						return estimateCommonAssemblyType.MasterAssembly;
					}
				};

				service.validateEstResourceTypeShortKey = function validateEstResourceTypeShortKey(entity, value, model) {
					if (entity.EstResourceTypeFk === estimateMainResourceType.SubItem || entity.EstResourceTypeFk === estimateMainResourceType.TextLine || entity.EstResourceTypeFk === estimateMainResourceType.InternalTextLine) { // sub item && I && T
						let codeField = 'Code';
						platformRuntimeDataService.applyValidationResult(true, entity, codeField);
						platformDataValidationService.removeFromErrorList(entity, codeField, service, estimateAssembliesResourceService);

						// if SubItem type is selected, reset EstAssemblyFk to null only in the assemblies module
						if (entity.EstResourceTypeFk === estimateMainResourceType.SubItem) {
							entity.EstAssemblyFk = null;
						}

						if (estimateMainResourceType){
							entity.EstResourceTypeFk = estimateMainResourceType.EstResourceTypeFk;
						}
					}
					if (entity.EstResourceTypeFk === estimateMainResourceType.Plant && !plantAssembly && !isPrjPlantAssembly) { // plant
						let processor = $injector.get('estimateMainResourceProcessor');
						processor.readOnly([entity], true);
						processor.setColumnReadOnly(entity, model, false);
					}

					if (entity.EstResourceTypeFk === estimateMainResourceType.Plant && isPrjPlantAssembly) { // plant
						platformRuntimeDataService.readonly(entity, [{field:'Code', readonly:true}]);
					}

					return !platformDataValidationService.isEmptyProp(value);
				};

				service.asyncValidateEstResourceTypeShortKey = function asyncValidateEstResourceTypeShortKey(entity, value) {
					let defer = $q.defer();
					let codeField = 'Code';
					let resourceService = $injector.get('projectPlantAssemblyResourceService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, codeField, resourceService);
					let resourceType = $injector.get('estimateMainResourceType');

					$injector.get('estimateMainResourceTypeLookupService').getAssignLookupData().then(function (resTypes) {
						let item = _.find(resTypes, function (resType) {
							return resType.ShortKeyInfo && value.toLowerCase() === resType.ShortKeyInfo.Translated.toLowerCase();
						});

						if((entity.EstResourceTypeFk === resourceType.Plant || entity.EstResourceTypeFk === resourceType.EquipmentAssembly) && isPrjPlantAssembly){
							let lgmJobFk = service.getAssemblyLgmJobId(entity);
							let projectId = $injector.get('projectMainService').getSelected().Id;

							platformRuntimeDataService.readonly(entity, [{field:codeField, readonly:true}]);

							$injector.get('estimateMainResourceValidationService').checkPlantLogisticJob(lgmJobFk, projectId).then(function(res) {
								platformRuntimeDataService.applyValidationResult(res, entity, codeField);
								platformRuntimeDataService.readonly(entity, [{ field: codeField, readonly: !res.valid }]);
								defer.resolve(platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, codeField, asyncMarker, service, resourceService));
							}).catch(function(error) {
								defer.reject(error);
							});

						} else {

							platformRuntimeDataService.readonly(entity, [{field: codeField, readonly:false}]);

							if(!_.isEmpty(item)){
								entity.EstResourceTypeFkExtend = item.EstAssemblyTypeFk ? (4000 + item.EstAssemblyTypeFk) : item.Id;
								entity.EstResourceTypeFk = item.EstResourceTypeFk;
								entity.EstAssemblyTypeFk = item.EstAssemblyTypeFk ? item.EstAssemblyTypeFk : null;
								entity.EstResKindFk = item.EstResKindFk ? item.EstResKindFk : null;
								if(entity.EstResourceTypeFk === estimateMainResourceType.SubItem){
									$injector.get('platformRuntimeDataService').readonly(entity, [{ field: 'BasUomFk', readonly: false }]);
								}

								//reset error
								platformDataValidationService.removeFromErrorList(entity, codeField, service, resourceService);
								defer.resolve(platformRuntimeDataService.applyValidationResult(true, entity, codeField));

							}else{
								let errorMessage = 'estimate.main.errors.codeNotFound';
								let errorObject = platformDataValidationService.createErrorObject(errorMessage);
								errorObject.valid = false;

								entity.EstResourceTypeFkExtend = 0;
								entity.EstResourceTypeFk = 0;
								entity.EstAssemblyTypeFk = null;
								entity.EstResKindFk = null;
								defer.resolve(errorObject);
							}
						}
					});

					return defer.promise;
				};

				service.validateCode = function validateCode(entity, value, model) {
					let resMandatory = platformDataValidationService.isMandatory(value, model);

					if(resMandatory.valid && (isPrjAssembly || isPlantAssembly || isPrjPlantAssembly)){
						if (isSubItem(entity)) {
							// Validate unique code
							let subItemsExceptCurrent = _.filter(estimateAssembliesResourceService.getList(), function (res) {
								return (isSubItem(res)) && res.Id !== entity.Id;
							});
							// Possible sub item with original code and new code used (Don't pick all subItems, it's unnecessary
							let subItemsWithCodeFound = _.filter(subItemsExceptCurrent, function (subItem) {
								return subItem.Code === value || subItem.Code === entity.Code;
							});

							if (subItemsWithCodeFound.length) {
								// Validate items with Original Code
								let subItemsWithOriginalCode = _.filter(subItemsWithCodeFound, function (subItem) {
									return subItem.Code === entity.Code;
								});
								if (subItemsWithOriginalCode.length === 1) { // If there is only one sub-item we clear the error, otherwise we keep the error
									platformRuntimeDataService.applyValidationResult(true, _.first(subItemsWithOriginalCode), model); // Manual validation
								}
								// Validate items with New Code
								let subItemsWithNewCodeFound = _.filter(subItemsWithCodeFound, function (subItem) {
									return subItem.Code === value;
								});
								if (subItemsWithNewCodeFound.length) {
									return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'Code'}); // Default validation
								}
							}
						}
					} else {
						if (!resMandatory.valid){
							entity.DescriptionInfo = {};
							estimateMainCommonService.extractSelectedItemProp(null, entity);
							if (entity.EstResourceTypeFk === estimateMainResourceType.Assembly && entity.EstAssemblyTypeFk) {
								estimateAssembliesResourceService.deleteEntities(entity.EstResources);
							}
						}
					}

					return resMandatory;
				};

				service.asyncValidateCode = function (entity, value, model) {
					entity[model] = value;
					let oldCode = entity[model];
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateAssembliesResourceService);

					switch (entity.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case estimateMainResourceType.Material:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;
						case estimateMainResourceType.Plant:
						case estimateMainResourceType.EquipmentAssembly:
							let selectedPlantAssemblies = $injector.get('estimateMainPlantAssemblyDialogService').getMultipleSelectedItems();
							if (selectedPlantAssemblies.length > 1) {
								$injector.get('estimateMainPlantAssemblyDialogService').setMultipleSelectedItems({});
								defer.resolve(true);
							} else {
								defer.promise = setResourceInfoFromLookup(entity, 'estplantassemblyfk', 'EstAssemblyFk', model);
							}
							break;
						case estimateMainResourceType.Assembly:
							defer.promise = setResourceInfoFromLookupWithAllColumns(entity, 'estassemblyfk', 'EstAssemblyFk', model);
							break;
						case estimateMainResourceType.SubItem:
							if(isPrjAssembly || isPlantAssembly || isPrjPlantAssembly){
								var subItems = validateSubItemsUniqueCode(entity, value, model, estimateAssembliesResourceService);
								var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, subItems, service, estimateAssembliesResourceService);
								defer.resolve(result);
							} else {
								defer.promise = $injector.get('estimateMainResourceValidationService').validateSubItemsForAssembly(entity, value, model, oldCode, estimateAssembliesResourceService);
							}
							break;
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.myPromise = defer.promise.then(function (result) {
						if (result == null) return;

						let promise = null;
						if (isPlantAssembly || result === false || (angular.isObject(result) && !result.valid)) {
							promise = $q.when(true);
						} else {
							let argData = {item: entity, field: model, colName: model};
							promise = estimateAssembliesResourceService.estimateAssemblyResources(argData);
						}

						return promise.then(function () {
							if (result === true && entity.Version === 0) {
								entity.CharacteristicSectionId = 45;
								entity.BasUomFk = entity.BasUomFk ? entity.BasUomFk : 0;
								let estimateResourceCharacteristicsService = isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
								return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getCharacteristicResourceTypeByCCMaterialId', entity).then(function (response) {
									let responseData = response.data || {};
									let charsToAdd = responseData.dynamicChars || [];
									if (!_.isEmpty(charsToAdd)) {
										estimateResourceCharacteristicsService.addCharToEntityAndGridUI(charsToAdd, entity);
									}
									estimateMainCommonService.setLookupSelected(false);
									return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateAssembliesResourceService);
								});
							}
							estimateMainCommonService.setLookupSelected(false);
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateAssembliesResourceService);
						});
					});
					// asyncMarker.myPromise = defer.promise;
					return asyncMarker.myPromise;
				};

				service.validateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					return platformDataValidationService.finishValidation(true, entity, value, model, service, estimateAssembliesResourceService);
				};

				service.asyncValidateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateAssembliesResourceService);

					switch (entity.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case estimateMainResourceType.Material:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;
						case estimateMainResourceType.Assembly:
							defer.promise = setResourceInfoFromLookup(entity, 'estassemblyfk', 'EstAssemblyFk', model, asyncMarker);
							break;
							// Commented code to fix ALM 128700 Descriptions of Assembly Sub-Items need to be unique within certain Sub-Item levels
						/* case 5:
							// eslint-disable-next-line no-case-declarations
							let subItems = validateSubItemsUniqueCode(entity, value, model, estimateAssembliesResourceService);
							// eslint-disable-next-line no-case-declarations
							let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, subItems, service, estimateAssembliesResourceService);
							defer.resolve(result);
							break; */
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.myPromise = defer.promise.then(function (result) {
						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateAssembliesResourceService);
					});
					return asyncMarker.myPromise;
				};

				service.validateBasUomFk = function validateBasUomFk(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};

				service.validateQuantityFactorCc = function validateQuantityFactorCc(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateQuantityReal = function validateQuantityReal(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateQuantityInternal = function validateQuantityInternal(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateQuantityUnitTarget = function validateQuantityUnitTarget(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateQuantityTotal = function validateQuantityTotal(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateCostFactorCc = function validateCostFactorCc(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateCostUnitSubItem = function validateCostUnitSubItem(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateCostUnitLineItem = function validateCostUnitLineItem(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateCostUnitTarget = function validateCostUnitTarget(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateCostTotal = function validateCostTotal(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateHoursUnitSubItem = function validateHoursUnitSubItem(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateHoursUnitLineItem = function validateHoursUnitLineItem(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateHoursUnitTarget = function validateHoursUnitTarget(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateHoursTotal = function validateHoursTotal(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateIsLumpsum = function validateIsLumpsum(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};
				service.validateIsDisabled = function validateIsDisabled(entity, value, field) {
					let assemblySerivice = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
					let considerDisabledDirect = assemblySerivice.getConsiderDisabledDirect();
					entity.IsDisabledDirect = considerDisabledDirect ? value : false;

					let traverseResource = function traverseResource(resources, disabled, fieldName) {
						_.forEach(resources, function (resource) {
							let isDisabled = considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== entity.Id ? resource[fieldName] : disabled) : disabled;
							resource[fieldName] = isDisabled;
							estimateAssembliesResourceService.markItemAsModified(resource);

							if (resource.HasChildren) {
								traverseResource(resource.EstResources, isDisabled, fieldName);
							}
						});
					};

					traverseResource([entity], value, field);

					return true;
				};

				service.validateQuantityDetail = function validateQuantityDetail(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'Quantity');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Quantity, 'Quantity', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateQuantityFactorDetail1 = function validateQuantityFactorDetail1(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor1, 'QuantityFactor1', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateQuantityFactorDetail2 = function validateQuantityFactorDetail2(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor2, 'QuantityFactor2', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateProductivityFactorDetail = function validateProductivityFactorDetail(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ProductivityFactor');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.ProductivityFactor, 'ProductivityFactor', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateCostFactorDetail1 = function validateCostFactorDetail1(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor1, 'CostFactor1', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateCostFactorDetail2 = function validateCostFactorDetail2(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor2, 'CostFactor2', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				let commonValserv = $injector.get('estimateMainCommonFeaturesService');
				let asyncVal = commonValserv.getAsyncDetailValidation(estimateAssembliesResourceService);
				angular.extend(service, asyncVal);

				let mandatoryFields = [
					'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
					'ProductivityFactor', 'CostUnit', 'CostFactor1', 'CostFactor2', 'HoursUnit'
				];
				_.each(mandatoryFields, function (field) {
					service['validate' + field] = function (entity, value) {
						return platformDataValidationService.isMandatory(value, field);
					};
				});

				let asycnFactorFields = {
					'Quantity': 'QuantityDetail',
					'QuantityFactor1': 'QuantityFactorDetail1',
					'QuantityFactor2': 'QuantityFactorDetail2',
					'QuantityFactor3': '',
					'QuantityFactor4': '',
					'CostFactor1': 'CostFactorDetail1',
					'CostFactor2': 'CostFactorDetail2',
					'ProductivityFactor' : 'ProductivityFactorDetail' ,
					'EfficiencyFactor1' : 'EfficiencyFactorDetail1',
					'EfficiencyFactor2' : 'EfficiencyFactorDetail2'
				};
				let generateAsyncValidation = function generateAsyncValidation(field) {
					return function generateAsyncValidation(entity, value) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateAssembliesResourceService);
						entity[field] = value;
						if (field !== 'QuantityFactor3' && field !== 'QuantityFactor4') {
							entity[asycnFactorFields[field]] = value;
						}
						asyncMarker.myPromise = estimateAssembliesResourceService.valueChangeCallBack(entity, field).then(function () {
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation({valid: true}, entity, value, field, asyncMarker, service, estimateAssembliesResourceService);
						});
						return asyncMarker.myPromise;
					};
				};
				_.each(asycnFactorFields, function (val, key) {
					service['asyncValidate' + key] = generateAsyncValidation(key);
				});
				function divisionByZeroErorr(entity, value, field) {
					let result = {apply: true, valid: true};
					if (value === 0 || value === '0') {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.main.divisionByZero')
						};
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					platformDataValidationService.finishAsyncValidation(result, entity, value, field, null, service, estimateAssembliesResourceService);

					return result;
				}

				service.validateEfficiencyFactor1 = function validateEfficiencyFactor1(entity, value, field) {
					let res = platformDataValidationService.isMandatory(value, field);

					if (!res.valid) {
						return res;
					}

					res = divisionByZeroErorr(entity, value, field);
					return res;
				};

				service.validateEfficiencyFactorDetail1 = function validateEfficiencyFactorDetail1(entity, value, field) {
					// map culture
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);

					// division by zero
					if (res && res.valid) {
						res = divisionByZeroErorr(entity, value, field);
					}

					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor1, 'EfficiencyFactor1', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.validateEfficiencyFactor2 = function validateEfficiencyFactor2(entity, value, field) {
					let res = platformDataValidationService.isMandatory(value, field);

					if (!res.valid) {
						return res;
					}

					res = divisionByZeroErorr(entity, value, field);
					return res;
				};

				service.validateEfficiencyFactorDetail2 = function validateEfficiencyFactorDetail2(entity, value, field) {
					// map culture
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesResourceService, true);

					// division by zero
					if (res && res.valid) {
						res = divisionByZeroErorr(entity, value, field);
					}

					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor2, 'EfficiencyFactor2', null, service, estimateAssembliesResourceService);
					}
					return res;
				};

				service.asyncValidateIsLumpsumForBulkConfig = function asyncValidateIsLumpsumForBulkConfig(entity, value, field) {
					return asyncCalculationForBulkConfig(entity, value, field);
				};

				service.asyncValidateIsDisabledForBulkConfig = function asyncValidateIsDisabledForBulkConfig(entity, value, field) {
					return asyncCalculationForBulkConfig(entity, value, field);
				};

				service.asyncValidateWorkOperationTypeFk = function asyncValidateWorkOperationTypeFk(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateAssembliesResourceService);
					entity[field] = value;
					entity.LgmJobFk = service.getAssemblyLgmJobId(entity);
					asyncMarker.myPromise = $q.when(estimateAssembliesResourceService.valueChangeCallBack(entity, field)).then(function () {
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						return platformDataValidationService.finishAsyncValidation({valid:true}, entity, value, field, asyncMarker, service, estimateAssembliesResourceService);
					});
					return asyncMarker.myPromise;
				};

				service.getAssemblyLgmJobId = function getAssemblyLgmJobId(entity){
					let childService =  $injector.get('projectPlantAssemblyResourceService');
					let parentService = $injector.get('projectPlantAssemblyMainService');
					let resourceItem = entity || childService.getSelected();
					let mainItem = parentService.getSelected();

					if(!resourceItem){return null;}
					if(resourceItem.LgmJobFk){return resourceItem.LgmJobFk;}

					return getAssemblyJobId(mainItem);
				}

				return service;

				function validateSubItemsUniqueCode(entity, value, model, dataService) {
					let subItems = [], subItemsWithError = [], subItemsWithoutError = [];
					let resourceList = dataService.getList();

					_.filter(resourceList, function (item) {
						if (item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.EstAssemblyFk === null && item.Id !== entity.Id) {
							if (platformRuntimeDataService.hasError(item, model)) {
								subItemsWithError.push(item);
							} else if (item.Code === value && !platformRuntimeDataService.hasError(item, model)) {
								subItemsWithoutError.push(item);
							}
							subItems.push(item);
						}
					});

					angular.forEach(subItemsWithoutError, function (subItem) {
						validateSubItemUniqueCode(subItemsWithoutError, subItem, model, dataService);
					});
					angular.forEach(subItemsWithError, function (subItem) {
						validateSubItemUniqueCode(subItems, subItem, model, dataService);
					});

					function validateSubItemUniqueCode(itemList, subItem, model, dataService) {
						let resSubItemUnique = platformDataValidationService.isValueUnique(itemList, model, subItem.Code, subItem.Id);
						let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.Code, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, model);
					}

					return subItems;
				}

				function setResourceInfoFromLookupWithAllColumns(resource, lookupType, field, model) {
					let selectedLookupItem = estimateMainCommonService.getSelectedLookupItem()
					if(selectedLookupItem) {
						let project = isPrjAssembly || isPrjPlantAssembly ? $injector.get('projectMainService').getSelected() : null;
						let projectId = project ? project.Id : -1;
						return $http.get(globals.webApiBaseUrl + 'estimate/assemblies/getprojectassembly?id=' + selectedLookupItem.Id + '&estHeaderFk=' + selectedLookupItem.EstHeaderFk + '&projectId=' + projectId).then(function (response) {
							if (!_.isEmpty(response && response.data)) {
								estimateMainCommonService.setSelectedLookupItem(response.data);
							}
							return setResourceInfoFromLookup(resource, lookupType, field, model);
						});
					}
					return setResourceInfoFromLookup(resource, lookupType, field, model);
				}


				function setResourceInfoFromLookup(resource, lookupType, field, model) {
					let projectMainServ = $injector.get('projectAssemblyMainService');
					if(isPrjPlantAssembly !== undefined){
						projectMainServ.setIsPrjAssembly(!isPrjPlantAssembly);
						projectMainServ.setIsPrjPlantAssembly(isPrjPlantAssembly);
					}

					let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
					let lookupItem = estimateMainCommonService.getSelectedLookupItem() || {};
					let isValidLookupItem = false;
					let assemblyTypeLogicDic = {};
					assemblyTypeLogicDic.CrewAssembly = 3;
					assemblyTypeLogicDic.MaterialAssembly = 4;
					assemblyTypeLogicDic.MaterialAssemblyUpdated = 5;
					assemblyTypeLogicDic.CrewAssemblyUpdated = 6;

					if ((lookupItem && lookupItem.Id) && model === 'DescriptionInfo.Translated') {
						resource.Code = lookupItem.Code;
					}

					if (_.isEmpty(lookupItem)) {
						isValidLookupItem = false;
					} else {
						if (resource.Code === lookupItem.Code) {
							isValidLookupItem = true;
						} else {
							// resource[field] = lookupItem.Id;
							// Reset Entity Assembly Id to null
							resource[field] = null;
							estimateMainCommonService.resetLookupItem();
							lookupItem = _.find(lookupDescriptorService.getData(lookupType), {'Id': resource[field]});
							if (lookupItem && lookupItem.Id) {
								estimateMainCommonService.setSelectedLookupItem(lookupItem);
								isValidLookupItem = true;
							}
						}
					}

					if (isValidLookupItem) {
						if (resource.DescriptionInfo === null) {
							resource.DescriptionInfo = {};
						}
						angular.extend(resource.DescriptionInfo, lookupItem.DescriptionInfo);

						if (lookupType === 'estassemblyfk') {
							// Assign current company currency to lookup which will be assigned to assembly
							lookupItem.CurrencyFk = estimateAssembliesService.getCompanyCurrency();
						}
						estimateMainCommonService.setSelectedCodeItem(null, resource, true, lookupItem, true);

						// Conditionally only set the Price List Fk
						if (lookupType === 'MaterialRecord') {
							resource.MaterialPriceListFk = lookupItem.MaterialPriceListFk;
						}

						if (lookupType === 'estassemblyfk') {
							let selectedAssembly = estimateAssembliesService.getSelected();

							return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/isassemblyassigned?id=' + lookupItem.Id + '&assemblyId=' + selectedAssembly.Id).then(function (response) {
								let isAssemblyAssigned = response.data;
								let resultValidation = isAssemblyAssigned ? platformDataValidationService.createErrorObject('estimate.assemblies.errors.assemblyAlreadyAssigned') : true;

								if (resultValidation) {
									return estimateMainCommonService.getAssemblyType(lookupItem.Id).then(function (response) {
										let assemblyType = response.data;
										if (assemblyType) {
											resource.IsBudget = assemblyType.IsBudget;
											resource.IsCost = assemblyType.IsCost;
										}

										if (!lookupItem.MdcCostCodeFk && !lookupItem.MdcMaterialFk) {
											resource.EstAssemblyTypeFk = null;
										}

										return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(estimateAssembliesResourceService.getList()).then(function () {
											/* calculate assembly and assembly resources */
											$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(estimateAssembliesService.getSelected(), estimateAssembliesResourceService.getList(), estimateAssembliesResourceService.getAssemblyType());

											if ((assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.CrewAssembly && lookupItem.MdcCostCodeFk) ||
												(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.MaterialAssembly && lookupItem.MdcMaterialFk) ||
												(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.MaterialAssemblyUpdated && lookupItem.MdcMaterialFk) ||
												(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.CrewAssemblyUpdated && lookupItem.MdcCostCodeFk)
											) {
												return estimateMainCommonService.getResourceTypeByAssemblyType(assemblyType).then(function (resourceType) {
													if (resourceType) {
														resource.EstResourceTypeFk = 4;
														resource.EstResourceTypeFkExtend = resourceType.Id;
														resource.EstAssemblyTypeFk = resourceType.EstAssemblyTypeFk;
													}
													return $q.when(true);
												});
											} else {
												resource.EstAssemblyTypeFk = null;
												resource.EstResourceTypeFkExtend = resource.EstResourceTypeFk;
												return $q.when(true);
											}
										});
									});
								} else {
									return $q.when(true);
								}
							});

						} else if (lookupType === 'estplantassemblyfk') {
							if (resource.EstResourceTypeFk === estimateMainResourceType.Plant && resource.EstResources.length > 0) {
								estimateAssembliesResourceService.deleteEntities(resource.EstResources, true);
								// Preserve selection to current resource
								estimateAssembliesResourceService.setSelected(resource);
							}

							let plantAssemblyDictionary = {};
							let plantAssemblyItems = estimateMainCommonService.getSelectedLookupItems();
							if(plantAssemblyItems && plantAssemblyItems.length > 0){
								for (let i = 0; i < plantAssemblyItems.length; i++) {
									const entity = plantAssemblyItems[i];
									const entityId = entity.Id;
									if (!plantAssemblyDictionary[entityId]) {
										plantAssemblyDictionary[entityId] = [];
									}
									plantAssemblyDictionary[entityId] = entity.PlantFk;
								}
							}else{
								plantAssemblyDictionary[lookupItem.Id] = lookupItem.PlantFk;
							}

							let selectedPlantAssembly = estimateAssembliesService.getSelected();
							let validationService = $injector.get('estimateMainResourceValidationService');
							let dataService = estimateAssembliesResourceService;
							let isFromMaster = false;

							if(isMasterAssembly){
								isFromMaster = true;
							}
							let lookupItemIds = plantAssemblyItems && plantAssemblyItems.length > 0 ? _.uniq(_.map(plantAssemblyItems, 'Id')) : [lookupItem.Id];

							if (!isPlantAssembly) {
								return validationService.validateEquipmentAssembly([lookupItem], resource, dataService, isFromMaster, isPrjPlantAssembly, isPrjAssembly)
									.then(response => {
										if (!response.valid) {
											// Remove matching code from dictionary and pass it to backend
											plantAssemblyDictionary = _.omit(plantAssemblyDictionary, response.matchingIds);
											lookupItemIds = lookupItemIds.filter(id => !response.matchingIds.includes(id));
										}

										if (_.isEmpty(plantAssemblyDictionary)) {
											return $q.when(false);
										}

										return estimateAssembliesResourceService.resolveResourcesAndAssign(
											selectedPlantAssembly,
											lookupItemIds,
											3,
											null,
											plantAssemblyDictionary
										);
									})
									.catch(error => {
										console.error('Error in processing Equipment Assembly:', error);
										return $q.when(error);
									});

							} else {
								return estimateAssembliesResourceService.resolveResourcesAndAssign(
									selectedPlantAssembly,
									lookupItemIds,
									3,
									null,
									plantAssemblyDictionary
								)
								.then(response => {
									return $q.when(response);
								})
								.catch(error => {
									console.error('Error in resolving resources:', error);
									return $q.when(error);
								});
							}
						} else {
							/* calculate assembly and assembly resources */
							$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(estimateAssembliesService.getSelected(), estimateAssembliesResourceService.getList(), estimateAssembliesResourceService.getAssemblyType());
							return $q.when(true);
						}
					} else {
						// we cannot retrieve lookup information from lookup, so we try to get it individually depending on resource type and Code(immediate cell change situation)
						if (model === 'Code' && _.isEmpty(resource[field])) {
							resource.Code = _.toUpper(resource.Code);
							let asyncMarker = platformDataValidationService.registerAsyncCall(resource, resource.Code, model, estimateAssembliesResourceService);
							switch (resource.EstResourceTypeFk) {
								case estimateMainResourceType.CostCode:
									if (isPrjAssembly) {
										// $injector.get('estimateMainJobCostcodesLookupService').getEstCostCodesTreeByJob(null, isPrjAssembly).then(function(data){
										asyncMarker.myPromise = $injector.get('estimateMainJobCostcodesLookupService').getSearchList(resource.Code, 'CODE', true, null, isPrjAssembly).then(function (data) {
											// First flatten tree then find item
											let mdcPrjCostCodesList = [];
											$injector.get('cloudCommonGridService').flatten(data, mdcPrjCostCodesList, 'CostCodes');
											let costCodeByCode = _.find(mdcPrjCostCodesList, {Code: resource.Code});
											if (!costCodeByCode || costCodeByCode.Id <= 0) {
												let errorMessage = 'estimate.main.errors.codeNotFound';
												let errorObject = platformDataValidationService.createErrorObject(errorMessage);
												errorObject.valid = false;
												return $q.when(errorObject);

											} else {
												// Set to cache
												$injector.get('basicsLookupdataLookupDescriptorService').updateData('estmdccostcodes', [costCodeByCode]);
												estimateMainCommonService.setSelectedLookupItem(costCodeByCode);

												// TODO-Walt: set HourUnit
												resource.HourUnit = costCodeByCode.HourUnit;
												estimateMainCommonService.setSelectedCodeItem(null, resource, true, costCodeByCode, true);
												return $q.when(true);
											}
										});
										return asyncMarker.myPromise;
									}
									asyncMarker.myPromise = $injector.get('estimateMainLookupService').getMdcCCByCodeAsync(resource.Code).then(function (costCodeByCode) {
										// if (_.isEmpty(costCodeByCode)) {
										if (!costCodeByCode || costCodeByCode.Id <= 0) {

											let errorMessage = 'estimate.main.errors.codeNotFound';
											let errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return $q.when(errorObject);

										} else {
											// Set to cache
											$injector.get('basicsLookupdataLookupDescriptorService').updateData('estmdccostcodes', [costCodeByCode]);
											estimateMainCommonService.setSelectedLookupItem(costCodeByCode);

											// TODO-Walt: set HourUnit
											resource.HourUnit = costCodeByCode.HourUnit;
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, costCodeByCode, true);
											$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(estimateAssembliesService.getSelected(), estimateAssembliesResourceService.getList(), estimateAssembliesResourceService.getAssemblyType());
											return $q.when(true);
										}
									});
									return asyncMarker.myPromise;
								case estimateMainResourceType.Material:
									// AssemblyMaterialRecord
									var materialLookupService = $injector.get('basicsMaterialLookupService');

									// Material search configuration
									materialLookupService.searchOptions.isMaster = true;
									materialLookupService.searchOptions.CategoryIdsFilter = [];
									materialLookupService.searchOptions.MaterialTypeFilter = {
										IsForEstimate: true,
										IsPrjAssembly: isPrjAssembly
									};

									var assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
									if (isPrjAssembly){
										var project = $injector.get('projectMainService').getSelected();
										materialLookupService.searchOptions.ProjectId = project ? project.Id : null;
										var itemSelected = assemblyService.getSelected();
										materialLookupService.searchOptions.LgmJobFk = itemSelected ? itemSelected.LgmJobFk : null;
									}

									var assemblyCategory = assemblyService.getAssemblyCategory();
									var estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();
									if (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly ||
										assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)) {
										materialLookupService.searchOptions.IsLabour = true;
									}
									materialLookupService.searchOptions.SearchText = resource.Code;

									asyncMarker.myPromise = materialLookupService.search().then(function (resultAll) {
										var resultMaterials = resultAll.items;
										var materialByCode = _.find(resultMaterials, {Code: resource.Code});
										if (_.isEmpty(materialByCode)) {
											var errorMessage = 'estimate.main.errors.codeNotFound';
											var errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;

											// clear material lookup  cache data
											materialLookupService.reset();

											return $q.when(errorObject);
										} else {
											// eslint-disable-next-line no-prototype-builtins
											if (!materialByCode.hasOwnProperty('DescriptionInfo')) {
												angular.extend(materialByCode, {DescriptionInfo: materialByCode.DescriptionInfo1});
												if (_.isEmpty(materialByCode.DescriptionInfo.Translated)) {
													materialByCode.DescriptionInfo.Translated = materialByCode.DescriptionInfo.Description;
												}
											}
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, materialByCode);
											return $q.when(true);
										}
									});
									return asyncMarker.myPromise;
								case estimateMainResourceType.Assembly:
									asyncMarker.myPromise = $injector.get('estimateMainAssemblyTemplateService').getAssemblyByCodeAsync(_.toUpper(resource.Code)).then(function (assemblyByCode) {
										if (_.isEmpty(assemblyByCode)) {

											var errorMessage = 'estimate.main.errors.codeNotFound';
											var errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return $q.when(errorObject);
										} else {
											// Validate Circular reference
											var assembly = estimateAssembliesService.getSelected() || {}; // TODO: move service to UI settings
											var ids = _.map([assemblyByCode], 'Id');
											if (_.indexOf(ids, assembly.Id) > -1) {
												let errorMessage = 'estimate.main.errors.circularReference';
												let errorObject = platformDataValidationService.createErrorObject(errorMessage);
												errorObject.valid = false;
												return $q.when(errorObject);
											}

											// Compare assembly is the same Composite type from resource
											return estimateMainCommonService.getAssemblyType(assemblyByCode.Id).then(function (response) {
												let assemblyType = response.data;
												var canProcessAssembly = false;

												// Validate assembly type
												if (resource.EstAssemblyTypeFk > 0 && resource.EstAssemblyTypeFk !== assemblyType.Id) {
													let errorMessage = 'estimate.main.errors.codeNotFound';
													let errorObject = platformDataValidationService.createErrorObject(errorMessage);
													errorObject.valid = false;
													return $q.when(errorObject);
												} else if (resource.EstAssemblyTypeFk === assemblyType.Id) {
													canProcessAssembly = true;
												} else {
													canProcessAssembly = true;
												}

												if (canProcessAssembly) {
													// Validate Circular reference
													return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', {
														assemblyId: assembly.Id,
														ids: ids,
														estAssemblyHeaderFk: assembly.EstHeaderAssemblyFk,
														estAssemblyFk: assembly.EstAssemblyFk
													}).then(function (response) {
														var circleDependencyAssemblies = response.data;
														var listFiltered = ids.filter(function (assemblyId) {
															// return _.indexOf(circleDependencyAssemblies, assemblyId) === -1;
															return _.indexOf(circleDependencyAssemblies, assemblyId) > -1;
														});

														if (!_.isEmpty(listFiltered)) {
															var errorMessage = 'estimate.main.errors.circularReference';
															var errorObject = platformDataValidationService.createErrorObject(errorMessage);
															errorObject.valid = false;
															return $q.when(errorObject);
														} else {

															// Do assignments
															lookupItem = assemblyByCode;

															// Assign current company currency to lookup which will be assigned to assembly
															if(!resource.BasCurrencyFk && lookupType === 'estassemblyfk'){
																lookupItem.CurrencyFk = estimateAssembliesService.getCompanyCurrency();
															}

															estimateMainCommonService.setSelectedCodeItem(null, resource, true, lookupItem, true);
															if (assemblyType) {
																resource.IsBudget = assemblyType.IsBudget;
																resource.IsCost = assemblyType.IsCost;
															}
															if ((assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.CrewAssembly && lookupItem.MdcCostCodeFk) ||
																(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.MaterialAssembly && lookupItem.MdcMaterialFk) ||
																(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.MaterialAssemblyUpdated && lookupItem.MdcMaterialFk) ||
																(assemblyType && assemblyType.EstAssemblyTypeLogicFk === assemblyTypeLogicDic.CrewAssemblyUpdated && lookupItem.MdcCostCodeFk)
															) {
																return estimateMainCommonService.getResourceTypeByAssemblyType(assemblyType).then(function (resourceType) {
																	if (resourceType) {
																		resource.EstResourceTypeFk = 4;
																		resource.EstResourceTypeFkExtend = resourceType.Id;
																		resource.EstAssemblyTypeFk = resourceType.EstAssemblyTypeFk;
																	}
																	return $q.when(true);
																});
															} else {
																resource.EstAssemblyTypeFk = null;
																resource.EstResourceTypeFkExtend = resource.EstResourceTypeFk;
																return $q.when(true);
															}
														}
													});

												} else {
													return $q.when(true);
												}
											});
										}
									});
									return asyncMarker.myPromise;
								default:
									return $q.when(true);
							}
						}
					}

					return $q.when(true);
				}

				function isSubItem(res) {
					return (res.EstResourceTypeFk === estimateMainResourceType.SubItem || res.EstResourceTypeFkExtend === estimateMainResourceType.SubItem) && res.EstAssemblyFk === null;
				}

				function asyncCalculationForBulkConfig(entity, value, field) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateAssembliesResourceService);
					entity[field] = value;
					let argData = {item: entity, field: field, colName: field};
					defer.promise = estimateAssembliesResourceService.estimateAssemblyResources(argData);
					asyncMarker.myPromise = defer.promise.then(function () {
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						return platformDataValidationService.finishAsyncValidation({valid: true}, entity, value, field, asyncMarker, service, estimateAssembliesResourceService);
					});
					// asyncMarker.myPromise = defer.promise;
					return asyncMarker.myPromise;
				}

				function getAssemblyJobId(mainItem){
					if(!mainItem){return null;}

					if(mainItem.LgmJobFk){return mainItem.LgmJobFk;}

					if(mainItem && mainItem.LgmJobFk){
						return mainItem.LgmJobFk;
					} else{
						let project = $injector.get('projectMainService').getSelected();
						return !_.isUndefined(project.LgmJobFk) && !_.isNull(project.LgmJobFk) ? project.LgmJobFk : null;
					}
				}
			};
			return factoryService;
		}
	]);
})();
