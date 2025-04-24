/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* globals globals , _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainResourceValidationService
	 * @description provides validation methods for relationship instances
	 */
	estimateMainModule.factory('estimateMainResourceValidationService',
		['$q', '$http', '$injector', '$translate', 'platformDataValidationService', 'estimateMainResourceProcessor', 'estimateMainResourceService', 'platformRuntimeDataService', 'estimateMainCommonService',
			'platformDialogService', 'estimateMainResourceDetailService','projectCommonJobService', 'estimateMainResourceType',
			function ($q, $http, $injector, $translate, platformDataValidationService, estimateMainResourceProcessor, estimateMainResourceService, platformRuntimeDataService, estimateMainCommonService,
				platformDialogService, estimateMainResourceDetailService, projectCommonJobService, estimateMainResourceType) {

				let service = {};

				service.validateEstResourceTypeShortKey = function validateEstResourceTypeShortKey(entity, value) {
					if (!platformDataValidationService.isEmptyProp(value) && (entity.EstResourceTypeFk === estimateMainResourceType.SubItem )) { // sub item)
						let codeField = 'Code';
						platformRuntimeDataService.applyValidationResult(true, entity, codeField);
						platformDataValidationService.removeFromErrorList(entity, codeField, service, estimateMainResourceService);
					}

					// Support fast input estResource shortKey
					let estType = $injector.get('estimateMainResourceTypeLookupService').getEstResourceType(value);
					if (estType){
						entity.EstResourceTypeFk = estType.EstResourceTypeFk;
					}

					if(entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine){
						estimateMainResourceProcessor.processComputationalLineTypeItem(entity);
					}

					return !platformDataValidationService.isEmptyProp(value);
				};

				service.validateCode = function validateCode(entity, value, model) {
					let resMandatory = platformDataValidationService.isMandatory(value, model);
					if (!resMandatory.valid){
						estimateMainCommonService.extractSelectedItemProp(null, entity);
						if (entity.EstResourceTypeFk === estimateMainResourceType.Assembly && entity.EstAssemblyTypeFk){
							estimateMainResourceService.deleteEntities(entity.EstResources, true);
						}
					}
					return resMandatory;
				};

				service.checkPlantLogisticJob = function checkPlantLogisticJob(lgmJobFk, projectId, value) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/resource/getjobid', {
						params: {
							jobId: lgmJobFk || null,
							projectId: projectId
						}
					}).then(function (response) {
						let res = {};
						if (response.data) {
							let msg = $translate.instant('estimate.main.plantAssemblySearchNotFound') + response.data.Code;

							let plantEstimatePrice = response.data.PlantEstimatePriceListFk;
							if (_.isNull(plantEstimatePrice)) {
								res.valid = false;
								res.apply = true;
								res.error = msg;
								res.error$tr$ = msg;
								res.readonly = true;
							} else {

								if (value == null || value === '') {
									res.valid = false;
									res.apply = true;
									res.error = 'cloud.common.Error_RuleParameterCodeHasError';
									res.error$tr$ = 'cloud.common.Error_RuleParameterCodeHasError';
									res.readonly = false;

								} else {
									res.valid = true;
									res.apply = true;
									res.error = '';
									res.error$tr$ = '';
									res.readonly = false;
								}
							}
						}
						return res;
					}).catch(function (error) {
						console.error(error);
						throw error;
					});
				};


				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					let oldCode = entity[model];
					entity[model] = value;
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainResourceService);

					switch (entity.EstResourceTypeFk){
						case estimateMainResourceType.CostCode:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case estimateMainResourceType.Material:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;
						case estimateMainResourceType.Plant:
						case estimateMainResourceType.EquipmentAssembly:
							let selectedPlantItems = $injector.get('estimateMainPlantAssemblyDialogService').getMultipleSelectedItems();
							if(selectedPlantItems.length > 1){
								$injector.get('estimateMainPlantAssemblyDialogService').setMultipleSelectedItems({});
								defer.resolve(true);
							} else {
								defer.promise = setResourceInfoFromLookup(entity, 'estplantassemblyfk', 'EstAssemblyFk', model);
							}
							break;
						case estimateMainResourceType.Assembly: {
							let selectedAssemblyItems = $injector.get('estimateMainAssemblyTemplateService').getMultipleSelectedItems();
							if (selectedAssemblyItems.length > 1) {
								$injector.get('estimateMainAssemblyTemplateService').setMultipleSelectedItems({});
								defer.resolve(true);
							} else {
								defer.promise = setResourceInfoFromLookup(entity, 'estassemblyfk', 'EstAssemblyFk', model);
							}
							break;
						}
						case estimateMainResourceType.SubItem:
							if(entity.EstAssemblyFk && entity.EstHeaderAssemblyFk && entity.EstResourceTypeFk === estimateMainResourceType.SubItem){
								defer.promise = setResourceInfoFromLookup(entity, 'subitem', 'EstAssemblyFk', model);
							}else{
								defer.promise = validateSubItem(entity, value, model, oldCode, estimateMainResourceService);
							}
							break;
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.myPromise = defer.promise.then(function(result){
						if(entity.EstResourceTypeFk === estimateMainResourceType.Plant /*&& entity.EstResourceFk === null*/){
							value = entity.Code;
						}

						if (result === true && entity.Version === 0){
							entity.CharacteristicSectionId = 33;
							entity.DayWorkRateTotal = entity.DayWorkRateTotal || 0;

							let estimateMainResourceCharacteristicsService = $injector.get('estimateMainResourceCharacteristicsService');
							return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getCharacteristicResourceTypeByCCMaterialId', entity).then(function (response) {
								let responseData = response.data || {};
								let charsToAdd = responseData.dynamicChars || [];
								if (!_.isEmpty(charsToAdd)){
									estimateMainResourceCharacteristicsService.addCharToEntityAndGridUI(charsToAdd, entity);
									estimateMainResourceService.setHasCostCodeCharac(true);
								}
								estimateMainCommonService.setLookupSelected(false);
								return $q.when(true);
							});
						}
						else if(entity.IsIndirectCost === true) {
							entity.IsIndirectCost = false;
							$injector.get('platformRuntimeDataService').readonly(entity, [{
								field: 'IsIndirectCost',
								readonly:false
							}]);
						}
						estimateMainCommonService.setLookupSelected(false);
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						return $q.when(result);
					}).then(function(result) {
						if (result === true || (result && result.valid)) {
							let res = {apply: true, valid: true};
							return checkVirtualJob(entity).then(function (r) {
								res.valid = !!r;
								res.error = !r ? $translate.instant('project.main.noUseJobError.readOnly') : '';
								return platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, model, asyncMarker, service, estimateMainResourceService);
							});
						}
						return platformDataValidationService.finishAsyncValidation(result, entity, entity.Code, model, asyncMarker, service, estimateMainResourceService);
					});
					return asyncMarker.myPromise;
				};

				service.validateSubItemsForAssembly = function validateSubItemsForAssembly(entity, value, model, oldCode, service){
					return validateSubItem(entity, value, model, oldCode, service).then(function(result){
						return result;
					});
				}

				function validateSubItem(entity, value, model, oldCode, service){

					let list = service.getList();
					// Validate unique code
					let subItemsExceptCurrent = _.filter(list, function(res){
						return (isSubItem(res)) && res.Id !== entity.Id;
					});
						// Possible sub item with original code and new code used (Don't pick all subItems, it's unnecessary
					let subItemsWithCodeFound = _.filter(subItemsExceptCurrent, function(subItem){
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
							return platformDialogService.showYesNoDialog('estimate.main.reNumberCode', 'Warning', 'yes').then(function (result) {
								if (result.yes) {
									return validateResourceChangeCode(list, entity, oldCode, service);
								} else {
									let errorObject = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'Code'});
									errorObject.valid = false;
									return $q.when(errorObject);
								}
							});
						}
					}
					if(entity.Code.slice(-1) === '0') {
						return platformDialogService.showYesNoDialog('estimate.main.reNumberCode', 'Warning', 'yes').then(function (result) {
							if (result.yes) {
								let estimateMainSubItemCodeGenerator = $injector.get('estimateMainSubItemCodeGenerator');
								estimateMainSubItemCodeGenerator.getSubItemCode(entity,list);
								entity.NewCode = entity.Code;
								if (entity.EstResources.length > 0) {
									estimateMainResourceDetailService.updateCodeAndSorting(entity.EstResources, entity, service);
								}
								return $q.when(true);
							} else {
								let errorObject = platformDataValidationService.createErrorObject('estimate.main.errors.invalidCode');
								errorObject.valid = false;
								return $q.when(errorObject);
							}
						});
					}
					else{
						return validateResourceChangeCode(list, entity, oldCode, service);
					}
				}

				function validateResourceChangeCode(resList, entity, oldCode, service) {
					let isValid = estimateMainResourceDetailService.estResourceChangeCode(resList, entity, oldCode, service);
					if (isValid) {
						return $q.when(true);
					} else {
						let errorObject = platformDataValidationService.createErrorObject('estimate.main.errors.selfReferencingCode');
						errorObject.valid = false;
						return $q.when(errorObject);
					}
				}

				service.asyncValidateEstResourceTypeShortKey = function asyncValidateEstResourceTypeShortKey(entity, value) {
					let defer = $q.defer();
					let codeField = 'Code';
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, codeField, estimateMainResourceService);

					defer.promise = getResourceTypes(entity, value);

					asyncMarker.myPromise = defer.promise.then(function () {
						if (entity.EstResourceTypeFk === estimateMainResourceType.Plant || entity.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly || entity.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) {
							let estimateMainService = $injector.get('estimateMainService');
							let projectId = estimateMainService.getSelectedProjectId();
							let lgmJobFk = estimateMainService.getLgmJobId(estimateMainResourceService.getSelected());

							platformRuntimeDataService.readonly(entity, [{field: codeField, readonly: true}]);
							return service.checkPlantLogisticJob(lgmJobFk, projectId,entity.Code).then(function (res) {
								platformRuntimeDataService.readonly(entity, [{field: codeField, readonly: res.readonly}]);
								platformRuntimeDataService.applyValidationResult(res, entity, codeField);
								return platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, codeField, asyncMarker, service, estimateMainResourceService);
							});
						}
					});

					return asyncMarker.myPromise;
				};

				function getResourceTypes(entity,value) {
                    let defer = $q.defer();
                    $injector.get('estimateMainResourceTypeLookupService').getListAsync().then(function(resTypes) {
                        let item = _.find(resTypes, function(resType) {
                            return resType.ShortKeyInfo && value.toLowerCase() === resType.ShortKeyInfo.Translated.toLowerCase();
                        });

                        if (!_.isEmpty(item)) {

                            entity.EstResourceTypeFkExtend = item.EstAssemblyTypeFk ? (4000 + item.EstAssemblyTypeFk) : item.Id;
                            entity.EstResourceTypeFk = item.EstResourceTypeFk;
                            entity.EstAssemblyTypeFk = item.EstAssemblyTypeFk ? item.EstAssemblyTypeFk : null;
                            entity.EstResKindFk = item.EstResKindFk ? item.EstResKindFk : null;

                            defer.resolve(entity);

                        } else {
                            let errorMessage = 'estimate.main.errors.codeNotFound';
                            let errorObject = platformDataValidationService.createErrorObject(errorMessage);
                            errorObject.valid = false;

                            entity.EstResourceTypeFkExtend = 0;
                            entity.EstResourceTypeFk = 0;
                            entity.EstAssemblyTypeFk = null;
                            entity.EstResKindFk = null;

                            defer.resolve(errorObject);
                        }

                    }, function(error) {
                        defer.reject(error);
                    });
                    return defer.promise;
                }

				service.validateGcBreakdownTypeFk = function validateGcBreakdownTypeFk(entity, value, field) {
					return $injector.get('estimateMainResourceDetailService').valueChangeCallBack(entity, field, value);
				}

				service.validateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					let lookupItem = estimateMainCommonService.getSelectedLookupItem() || {};
					let codeField = 'Code';

					let resMandatory = entity.EstResourceTypeFk !==5 ? platformDataValidationService.isMandatory(value, model, {fieldName: 'Code'}):  {valid : true};

					if (_.isEmpty(lookupItem) && resMandatory.valid === false && entity.EstResourceTypeFk !==5 && _.isEmpty(entity.Code)) {
						// estimateMainCommonService.extractSelectedItemProp(null, entity);
						if (entity.EstResourceTypeFk === estimateMainResourceType.Assembly && entity.EstAssemblyTypeFk) {
							estimateMainResourceService.deleteEntities(entity.EstResources, true);
						}
					}else{
						resMandatory.valid = true;
					}
					return platformRuntimeDataService.applyValidationResult(resMandatory, entity, codeField);
				};

				service.asyncValidateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainResourceService);

					switch (entity.EstResourceTypeFk){
						case estimateMainResourceType.CostCode:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case estimateMainResourceType.Material:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;

						case estimateMainResourceType.Plant:
							defer.promise = setResourceInfoFromLookup(entity, 'estplantassemblyfk', 'EstAssemblyFk', model);
							break;
						case estimateMainResourceType.Assembly:
							// don't need to validate assembly at description column, this column value is set by code column
							// 1 this column is always readonly for assembly type
							// 2 this validation action will invoke by validation popup up window
							// 3 this validation action will reset description column, so it will lead to an endless loop validation
							defer.resolve(true);
							break;
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.myPromise = defer.promise.then(function(result){
						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateMainResourceService);
					});
					return asyncMarker.myPromise;
				};

				let mandatoryFields = [
					'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
					'ProductivityFactor', 'EfficiencyFactor1', 'EfficiencyFactor2', 'CostUnit', 'CostFactor1',
					'CostFactor2', 'HoursUnit', 'HourFactor', 'DayWorkRateUnit'
				];

				let generateMandatory = function generateMandatory(field) {
					return function (entity, value) {
						if (!value || value === '') {
							value = 0;
							entity[field] = value;
						}
						return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainResourceService);
					};
				};

				function valueChangeCalculation (entity, field){
					return loadMdcCostCode().then(function(){
						return estimateMainResourceDetailService.valueChangeCallBack(entity, field);
					});
				}

				let generateAsyncValidation = function (field) {
					return function generateAsyncValidation(entity, value) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainResourceService);
						if(field !== 'IsDisabled' && field !== 'IsDisabledPrc'){
							entity[field] = value;
						}
						asyncMarker.myPromise = valueChangeCalculation(entity, field).then(function () {
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation({valid:true}, entity, value, field, asyncMarker, service, estimateMainResourceService);
						});
						return asyncMarker.myPromise;
					};
				};

				_.each(mandatoryFields, function (field) {
					if (field !== 'EfficiencyFactor1' && field !== 'EfficiencyFactor2'){
						service['validate' + field] = generateMandatory(field);
					}
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				let optionalFields = [
					'IsLumpsum',
					'IsDisabled',
					'IsDisabledPrc',
					'Sorting',
					'IsFixedBudget',
					'IsFixedBudgetUnit',
					'BudgetUnit',
					'Budget',
					'IsIndirectCost',
					'IsGeneratedPrc',
					'Co2Project'
				];

				_.each(optionalFields, function (field) {
					service['validate' + field] = function () {
						return {valid:true};
					};
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				service.generateAsyncValidateForBulkConfig = function (fields){
					_.each(fields, function (field) {
						service['asyncValidate' + field + 'ForBulkConfig'] = generateAsyncValidation(field);
					});
				};

				service.validateSubItemsUniqueCodeFromAssembly = function validateSubItemsUniqueCodeFromAssembly(assemblyList) {
					let model = 'Code';
					validateSubItemsUniqueCodeV2(assemblyList, model);
				};

				service.validateIsDisabledPrc = function (entity, value, field){
					let considerDisabledDirect = $injector.get('estimateMainService').getConsiderDisabledDirect();
					entity.IsDisabledDirect = considerDisabledDirect ? value : false;

					traverseResource([entity], entity, value, field);

					return true;
				};

				// This will overwrite the above statement for sync validation
				service.validateIsDisabled = function validateIsDisabled(entity, value, field){

					let considerDisabledDirect = $injector.get('estimateMainService').getConsiderDisabledDirect();
					entity.IsDisabledDirect = considerDisabledDirect ? value : false;

					traverseResource([entity], entity, value, field, considerDisabledDirect);

					return true;
				};

				function traverseResource(resources, entity, disabled, fieldName, considerDisabledDirect){
					_.forEach(resources, function(resource){
						let isDisabled =  considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== entity.Id ? resource[fieldName] : disabled) : disabled;
						resource[fieldName] = isDisabled;

						estimateMainResourceService.markItemAsModified(resource);

						if (resource.HasChildren){
							traverseResource(resource.EstResources, entity, isDisabled, fieldName, considerDisabledDirect);
						}
					});
				}

				function validateSubItemsUniqueCodeV2(resourcesTree, model){
					let subItems = [];
					// subItems those converted from assembly, don't need to validate the code
					resourcesTree = _.filter(resourcesTree, function (item){ return !item.EstAssemblyFk;});

					let traverseValidateSubItems = function traverseSubItems(resourcesTree){
						_.forEach(resourcesTree, function (item) {
							if (item.EstResourceTypeFk === estimateMainResourceType.SubItem || item.EstResourceTypeFkExtend === estimateMainResourceType.SubItem) {
								if (item.EstAssemblyFk === null){ // Only validate simple SubItems
									validateSubItemUniqueCode(subItems, item, model, estimateMainResourceService);
									subItems.push(item); // Add sub items to validate later
								}
								if (item.HasChildren) {
									traverseSubItems(item.EstResources);
								}
							}
						});
					};
					traverseValidateSubItems(resourcesTree);
				}

				function validateSubItemUniqueCode(itemList, subItem, model){
					let resSubItemUnique = platformDataValidationService.isValueUnique(itemList, model, subItem.Code, subItem.Id);
					platformRuntimeDataService.applyValidationResult(resSubItemUnique, subItem, model);
				}

				service.validateQuantityDetail = function validateQuantityDetail(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'Quantity');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Quantity, 'Quantity', null, service, estimateMainResourceService);
					}
					return res;
				};

				function divisionByZeroErorr (entity, value, field){
					let result = {apply: true, valid: true};
					if (value === 0 || value === '0') {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.main.divisionByZero')
						};
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					platformDataValidationService.finishAsyncValidation(result, entity, value, field, null, service, estimateMainResourceService);

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

				service.validateEfficiencyFactorDetail1 = function validateEfficiencyFactorDetail1(entity, value, field){
					// map culture
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);

					// division by zero
					if (res && res.valid){
						res = divisionByZeroErorr(entity, value, field);
					}

					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor1, 'EfficiencyFactor1', null, service, estimateMainResourceService);
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

				service.validateEfficiencyFactorDetail2 = function validateEfficiencyFactorDetail2(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);

					// division by zero
					if (res && res.valid){
						res = divisionByZeroErorr(entity, value, field);
					}

					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor2, 'EfficiencyFactor2', null, service, estimateMainResourceService);
					}

					return res;
				};

				service.validateQuantityFactorDetail1 = function validateQuantityFactorDetail1(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor1, 'QuantityFactor1', null, service, estimateMainResourceService);
					}
					return res;
				};

				service.validateQuantityFactorDetail2 = function validateQuantityFactorDetail2(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor2, 'QuantityFactor2', null, service, estimateMainResourceService);
					}
					return res;
				};

				service.validateProductivityFactorDetail = function validateProductivityFactorDetail(entity, value, field){
					let res =  $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'ProductivityFactor');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.ProductivityFactor, 'ProductivityFactor', null, service, estimateMainResourceService);
					}
					return res;
				};

				service.validateCostFactorDetail1 = function validateCostFactorDetail1(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor1, 'CostFactor1', null, service, estimateMainResourceService);
					}
					return res;
				};

				service.validateCostFactorDetail2 = function validateCostFactorDetail2(entity, value, field){
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainResourceService, true);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor2, 'CostFactor2', null, service, estimateMainResourceService);
					}
					return res;
				};

				service.asyncValidateWorkOperationTypeFk = function asyncValidateWorkOperationTypeFk(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainResourceService);
					entity[field] = value;
					asyncMarker.myPromise = $q.when(estimateMainResourceDetailService.valueChangeCallBack(entity, field)).then(function () {
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						return platformDataValidationService.finishAsyncValidation({valid:true}, entity, value, field, asyncMarker, service, estimateMainResourceService);
					});
					return asyncMarker.myPromise;
				};

				service.asyncValidateLgmJobFk = function validateLgmJobFk(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainResourceService);
					let res = {apply: true, valid: true};
					let projectId = $injector.get('estimateMainService').getSelectedProjectId();
					asyncMarker.myPromise = projectCommonJobService.prepareData(projectId).then(function () {
						let isReadOnly = projectCommonJobService.isJobReadOnly(value, projectId);
						if (isReadOnly) {
							return getProjectExistJobResource(entity, value, projectId);
						} else {
							return $q.when(true);
						}
					});
					return asyncMarker.myPromise.then(function (result) {
						res.valid = !!result;
						res.error = !result ? $translate.instant('project.main.noUseJobError.readOnly') : '';
						return platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateMainResourceService);
					});
				};

				function getProjectExistJobResource(entity,value, projectId) {
					let promise = $q.when({data: true});
					let param = '';
					let prjCostCodeId = entity.ProjectCostCodeFk || 0;
					let materialId = entity.MdcMaterialFk || 0;
					let assemblyHeaderId = entity.EstHeaderAssemblyFk || 0;
					let estAssemblyId = entity.EstAssemblyFk || 0;
					let mdcCostCodeId = entity.MdcCostCodeFk || 0;
					switch (entity.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:
							param = '?prjCostCodeId=' + prjCostCodeId + '&jobId=' + value + '&projectId=' + projectId + '&mdcCostCodeId=' + mdcCostCodeId;
							promise = $http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getProjectCodeByJobFk' + param);
							break;
						case estimateMainResourceType.Material:
							param = '?projectId=' + projectId + '&materialId=' + materialId + '&jobId=' + value;
							promise = $http.get(globals.webApiBaseUrl + 'project/material/getProjectMaterialByJobFk' + param);
							break;
						case estimateMainResourceType.SubItem:
						case estimateMainResourceType.Assembly:
							param = '?projectId=' + projectId + '&estAssemblyHeaderId=' + assemblyHeaderId + '&estAssemblyId=' + estAssemblyId + '&jobId=' + value;
							promise = $http.get(globals.webApiBaseUrl + 'estimate/assemblies/getProjectAssemblyByJobFk' + param);
							break;
					}
					return promise.then(function (response) {
						return !!response.data;
					});
				}

				function checkVirtualJob(entity) {
					let estimateMainService = $injector.get('estimateMainService');
					let jobId = estimateMainService.getLgmJobId(entity);
					if (jobId) {
						let projectId = estimateMainService.getSelectedProjectId();
						return projectCommonJobService.prepareData(projectId).then(function(){
							let isReadOnly = projectCommonJobService.isJobReadOnly(jobId, projectId);
							if (isReadOnly) {
								return getProjectExistJobResource(entity, jobId, projectId);
							}else{
								return $q.when(true);
							}
						});
					}
					return $q.when(true);
				}

				service.validateEquipmentAssembly = function validateEquipmentAssembly(entities, currentRes, dataService, isFromMaster, isPrjPlantAssembly, isPrjAssembly) {
					let errorObject = { valid: true };
					let lgmjobfk = (isPrjPlantAssembly || isPrjAssembly) ? $injector.get('estimateCommonJobService').getLgmJobFkForAssembly(isPrjPlantAssembly, isPrjAssembly) 
									: isFromMaster ? 0 : $injector.get('estimateMainService').getLgmJobId(currentRes);

					if(dataService === null || dataService === undefined){
						dataService = estimateMainResourceService;
					}
					return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getdefaultwot?lgmjobfk='+ lgmjobfk)
						.then(response => {
							let defaultWOT = response.data;

							let existingResources = dataService.getList().filter(res =>
								(res.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly || res.EstResourceTypeFk === estimateMainResourceType.Plant ||
								res.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && currentRes.Id !== res.Id
							);

							let matchingCodes = [];
							let matchingIds = [];

							entities.forEach(entity => {
								let isMatchFound = false;
								let isWOPlantMatch = false;
								let withoutPlantNameTranslation = $translate.instant('estimate.main.withoutPlantText', {plantCode:entity.Code});

								existingResources.forEach(res => {
									if (res.EstResourceFk > 0) {
										let matchedRes = _.find(existingResources, { Id: res.EstResourceFk });

										if (matchedRes && matchedRes.WorkOperationTypeFk === defaultWOT) {
											if (res.Code === entity.Code) {
												isMatchFound = true;
											}
										}
									}

									if (!isFromMaster && res.EtmPlantFk === null && (res.EstResourceTypeFk === estimateMainResourceType.Plant || res.EstResourceTypeFk === estimateMainResourceType.PlantDissolved)
										&& String(res.Code.toLowerCase().trim()) === String(withoutPlantNameTranslation.toLowerCase().trim())) {
										isWOPlantMatch = true;
									}

								});

								if (isMatchFound || isWOPlantMatch) {
									matchingCodes.push(entity.Code);
									matchingIds.push(entity.Id);
								}

							});

							if (matchingIds.length > 0) {
								estimateMainResourceService.showWarning('estimate.main.uniqEquipmentAssemblyCode', matchingCodes);
								errorObject = { valid: false, existingCodes: matchingCodes, matchingIds: matchingIds };
							}

							return $q.when(errorObject);
						})
						.catch(error => {
							console.error('Error fetching default WOT:', error);
							$q.when(error);
						});
				};

				function setResourceInfoFromLookup(resource, lookupType, field, model){
   					let estimateMainService = $injector.get('estimateMainService');
					let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

					let lookupItem = estimateMainCommonService.getSelectedLookupItem() || {};
					let isValidLookupItem = false;
					if ((lookupItem && lookupItem.Id) && model === 'DescriptionInfo.Translated'){
						resource.Code = lookupItem.Code;
					}
					resource.IsEstimateCostCode =lookupItem ? lookupItem.IsEstimateCostCode:resource.IsEstimateCostCode;
					if (_.isEmpty(lookupItem)){
						isValidLookupItem = false;
					}else{
						if (resource.Code === lookupItem.Code){
							isValidLookupItem = true;
						}else{
							resource[field] = lookupItem.Id;
							estimateMainCommonService.resetLookupItem();
							lookupItem = _.find(lookupDescriptorService.getData(lookupType), {'Id': resource[field]});
							if (lookupItem && lookupItem.Id){
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
						let existAssemblyFk = resource.EstAssemblyFk;
						estimateMainCommonService.setSelectedCodeItem(null, resource, true, lookupItem);

						// Conditionally only set the Price List Fk
						if (lookupType === 'MaterialRecord') {
							resource.MaterialPriceListFk = lookupItem.MaterialPriceListFk;
						}

						if (lookupType === 'estassemblyfk') {
							if (resource.EstAssemblyTypeFk && resource.EstResources.length > 0) {
								estimateMainResourceService.deleteEntities(resource.EstResources, true);
								// Preserve selection to current resource
								estimateMainResourceService.setSelected(resource);
							}

							let lineItem = estimateMainService.getSelected();
							return estimateMainCommonService.CheckAssemblyCircularDependency(lookupItem.Id).then(function (res) {
								if (res.data) {
									let errorMessage = 'estimate.main.errors.circularReference';
									let errorObject = platformDataValidationService.createErrorObject(errorMessage);
									errorObject.valid = false;
									return $q.when(errorObject);
								} else {
									// Preserve selection to current resource
									estimateMainResourceService.setSelected(resource);
									return estimateMainResourceService.resolveResourcesAndAssign(lineItem, [lookupItem.Id], 4);
								}
							});
						} else if (lookupType === 'estplantassemblyfk') {
							if (resource.EstResourceTypeFk === estimateMainResourceType.Plant && resource.EstResources.length > 0) {
								estimateMainResourceService.deleteEntities(resource.EstResources, true);
								// Preserve selection to current resource
								estimateMainResourceService.setSelected(resource);
							}

							let plantAssemblyDictionary = {};

							let plantAssemblyItems = estimateMainCommonService.getSelectedLookupItems();
							if(plantAssemblyItems && plantAssemblyItems.length > 0){
								plantAssemblyDictionary = estimateMainResourceService.groupEntitiesByPlantFK(plantAssemblyItems);
							}else{
								plantAssemblyDictionary[lookupItem.Id] = lookupItem.PlantFk;
							}
							let lineItem = estimateMainService.getSelected();
							let lookupItemIds = plantAssemblyItems && plantAssemblyItems.length > 0 ? _.uniq(_.map(plantAssemblyItems, 'Id')) : [lookupItem.Id];
							if (!estimateMainService.getShowPlantAsOneRecordOption()) {
								return service.validateEquipmentAssembly([lookupItem], resource, null, false, false, false)
									.then(response => {
										if (!response.valid) {
											// Remove matching code from dictionary and pass it to backend
											plantAssemblyDictionary = _.omit(plantAssemblyDictionary, response.matchingIds);
											lookupItemIds = lookupItemIds.filter(id => !response.matchingIds.includes(id));
										}

										if (_.isEmpty(plantAssemblyDictionary)) {
											return $q.when(false);
										}

										return estimateMainResourceService.resolveResourcesAndAssign(lineItem, lookupItemIds, 3, null, plantAssemblyDictionary);
									})
									.catch(error => {
										console.error('Error in processing Equipment Assembly:', error);
										return $q.when(error);
									});

							} else {
								return estimateMainResourceService.resolveResourcesAndAssign(lineItem, lookupItemIds, 3, null, plantAssemblyDictionary)
									.then( function(){ return $q.when(true); })
									.catch(error => {
										console.error('Error in resolving resources:', error);
										return $q.when(error);
									});
							}

						} else if (lookupType === 'subitem') {
							if (resource.EstResourceTypeFk === estimateMainResourceType.SubItem) {
								estimateMainResourceService.deleteEntities(resource.EstResources, true);
								estimateMainResourceService.setSelected(resource);
							}
							resource.EstAssemblyFk = existAssemblyFk;
							return replaceSubItemInfoFromLookup(resource, lookupItem).then(function () {
								return $q.when(true);
							});
						} else {
							// calculate the quantityUnitTarget before calculate the total
							estimateMainCommonService.calculateResource(resource, estimateMainService.getSelected(), estimateMainResourceService.getList());

							return $q.when(true);
						}
					}else {
						// we cannot retrieve lookup information from lookup, so we try to get it individually depending on resource type and Code(immediate cell change situation)
						if (model === 'Code' && _.isEmpty(resource[field])) {
							resource.Code = _.toUpper(resource.Code);
							let asyncMarker = platformDataValidationService.registerAsyncCall(resource, resource.Code, model, estimateMainResourceService);
							switch (resource.EstResourceTypeFk) {
								case estimateMainResourceType.CostCode:
									asyncMarker.myPromise = $injector.get('estimateMainJobCostcodesLookupService').getEstCCByCodeAsync(resource).then(function (costCodeByCode) {
										if (_.isEmpty(costCodeByCode)) {

											let errorMessage = 'estimate.main.errors.codeNotFound';
											let errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return $q.when(errorObject);

										} else {
											// Set to cache
											$injector.get('basicsLookupdataLookupDescriptorService').updateData('prjCostCodesByJob', [costCodeByCode]);
											estimateMainCommonService.setSelectedLookupItem(costCodeByCode);

											// TODO-Walt: set HourUnit
											resource.HourUnit = costCodeByCode.HourUnit;
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, costCodeByCode);

											return $q.when(true);
										}
									});
									return asyncMarker.myPromise;
								case estimateMainResourceType.Material:
									var materialLookupService = $injector.get('basicsMaterialLookupService');
									var item = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
									if (item) {
										materialLookupService.searchOptions.ProjectId = item.id;
										materialLookupService.searchOptions.SearchText = resource.Code;
										materialLookupService.searchOptions.LgmJobFk = $injector.get('estimateMainPrjMaterialLookupService').getJobFk();

										materialLookupService.searchOptions.MaterialTypeFilter = {
											IsForEstimate: true
										};
									}

									asyncMarker.myPromise = materialLookupService.search().then(function (resultAll) {
										let resultMaterials = resultAll.items;
										var materialByCode = _.find(resultMaterials, {Code: resource.Code});
										if (_.isEmpty(materialByCode)) {
											let errorMessage = 'estimate.main.errors.codeNotFound';
											let errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;

											// clear material lookup  cache data
											materialLookupService.reset();
											return $q.when(errorObject);

										} else {
											if (!Object.prototype.hasOwnProperty.call(materialByCode, 'DescriptionInfo')) {
												angular.extend(materialByCode, {DescriptionInfo: materialByCode.DescriptionInfo1});
												if (_.isEmpty(materialByCode.DescriptionInfo.Translated)) {
													materialByCode.DescriptionInfo.Translated = materialByCode.DescriptionInfo.Description;
												}
											}
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, materialByCode);
											return $injector.get('estimateMainResourceDetailService').valueChangeCallBack(resource,field).then(function(){
												return $q.when(true);
											});
										}
									});
									return asyncMarker.myPromise;
								case estimateMainResourceType.Assembly:
								case estimateMainResourceType.SubItem:
									asyncMarker.myPromise = $injector.get('estimateMainAssemblyTemplateService').getAssemblyByCodeAsync(_.toUpper(resource.Code)).then(function (assemblyByCode) {
										if (_.isEmpty(assemblyByCode)) {
											let errorMessage = 'estimate.main.errors.codeNotFound';
											let errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return $q.when(errorObject);
										} else {
											return estimateMainCommonService.CheckAssemblyCircularDependency(assemblyByCode.Id).then(function (res) {
												if (res.data) {
													let errorMessage = 'estimate.main.errors.circularReference';
													let errorObject = platformDataValidationService.createErrorObject(errorMessage);
													errorObject.valid = false;
													return $q.when(errorObject);
												} else {
													// Compare assembly is the same Composite type from resource
													return estimateMainCommonService.getAssemblyType(assemblyByCode.Id).then(function (response) {
														let assemblyType = response.data;
														let canProcessAssembly = false;

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
															if (resource.EstAssemblyTypeFk) {
																resource.EstResources && resource.EstResources.length > 0 && estimateMainResourceService.deleteEntities(resource.EstResources, true);
															}
															// Preserve selection to current resource
															estimateMainResourceService.setSelected(resource);
															let lineItem = estimateMainService.getSelected();
															if (resource.EstResourceTypeFk === estimateMainResourceType.Assembly) {
																return estimateMainResourceService.resolveResourcesAndAssign(lineItem, [assemblyByCode.Id], 4).then(function () {
																	return $q.when(true);
																});
															} else {
																return replaceSubItemInfoFromLookup(resource, assemblyByCode).then(function () {
																	return $q.when(true);
																});
															}
														}
														return $q.when(true);
													});
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

					if(resource.Version === 0){
						resource.CostUnitOriginal = resource.CostUnit;
						resource.QuantityOriginal = resource.Quantity;
					}
					return $q.when(true);
				}

				let commonValserv = $injector.get('estimateMainCommonFeaturesService');
				let asyncVal = commonValserv.getAsyncDetailValidation(estimateMainResourceService);
				angular.extend(service, asyncVal);

				return service;

				function replaceSubItemInfoFromLookup(resource, lookupItem){
					let defer = $q.defer();
					if(resource.EstAssemblyFk === lookupItem.Id){
						defer.resolve(true);
						return defer.promise;
					}
					let filterData = {
						AssemblyHeaderFk: resource.EstHeaderAssemblyFk,
						ChangeFields: [],
						CurrentElementFk: resource.EstAssemblyFk,
						EstimateScope: 2,
						FunctionType: 131,
						LineItemIds: [resource.EstLineItemFk],
						OnlyGetCount: false,
						ReplacedElementFk: lookupItem.Id,
						ResourceFrom: 1,
						filterRequest: $injector.get('estimateMainService').getLastFilter(),
						IsFromSubItemReplace: true
					};
					resource.DescriptionInfo = lookupItem.DescriptionInfo;
					resource.EstAssemblyFk = lookupItem.Id;
					resource.EstHeaderAssemblyFk = lookupItem.EstHeaderFk;

					let selectedResource = estimateMainResourceService.getSelected();

					$http.post(globals.webApiBaseUrl + 'estimate/main/resource/resourcereplacement', filterData).then(function(response){
						let containerData = estimateMainResourceService.getContainerData();

						// From ItemList remove old assembly child resources
						let oldResources = _.filter(estimateMainResourceService.getContainerData().itemList, function (item) {
							return item.EstResourceFk === selectedResource.Id && item.EstHeaderFk === selectedResource.EstHeaderFk;
						});

						estimateMainResourceService.getContainerData().itemList = _.filter(estimateMainResourceService.getContainerData().itemList, function (item) {
							return item.EstResourceFk !== selectedResource.Id && item.EstHeaderFk === selectedResource.EstHeaderFk;
						});

						containerData.doClearModifications(oldResources, containerData);

						let resourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
						let userDefinedColmsToUpdate = resourceDynamicUserDefinedColumnService.getUpdateData();
						if (userDefinedColmsToUpdate) {
							if ((userDefinedColmsToUpdate.UserDefinedColumnValueToCreate.length > 0) || (userDefinedColmsToUpdate.UserDefinedColumnValueToUpdate.length > 0)) {
								let newUpdateItems = [];
								let oldDeleteItems = [];
								let newCreateItems = [];
								let userDefinedColumnValueToCreate = userDefinedColmsToUpdate.UserDefinedColumnValueToCreate;
								let userDefinedColsToUpdate = userDefinedColmsToUpdate.UserDefinedColumnValueToUpdate;

								angular.forEach(oldResources, function (oldRes) {
									angular.forEach(userDefinedColumnValueToCreate, function (createItem) {
										if (createItem.Pk1 !== oldRes.EstHeaderFk && createItem.Pk2 !== oldRes.EstLineItemFk && createItem.Pk3 !== oldRes.Id) {
											newCreateItems.push(createItem);
										}
									});

									angular.forEach(userDefinedColsToUpdate, function (updateItem) {
										if (updateItem.Pk1 !== oldRes.EstHeaderFk && updateItem.Pk2 !== oldRes.EstLineItemFk && updateItem.Pk3 !== oldRes.Id) {
											let existItem = _.find(newUpdateItems, {Id: updateItem.Id});
											if (!existItem) {
												newUpdateItems.push(updateItem);
											}
										} else {
											if (updateItem.Pk3 === selectedResource.Id) {
												let existItem = _.find(newUpdateItems, {Id: updateItem.Id});
												if (!existItem) {
													newUpdateItems.push(updateItem);
												}
											} else {
												oldDeleteItems.push(updateItem);
											}
										}
									});
								});

								userDefinedColmsToUpdate.UserDefinedColumnValueToCreate = newCreateItems.length > 0 ? newCreateItems : userDefinedColmsToUpdate.UserDefinedColumnValueToCreate;
								userDefinedColmsToUpdate.UserDefinedColumnValueToUpdate = newUpdateItems;
								userDefinedColmsToUpdate.UserDefinedColumnValueToDelete = oldDeleteItems;
							}
						}

						let newResources = response.data.NewAssemblyResources;
						let childrens = _.filter(newResources, function (item) {
							return item.EstResourceFk === selectedResource.Id && item.EstHeaderFk === selectedResource.EstHeaderFk;
						});

						let parentSubitem = _.filter(newResources, function (item) {
							return item.Id === selectedResource.Id && item.EstHeaderFk === selectedResource.EstHeaderFk;
						});

						if (!parentSubitem) {
							return true;
						}
						parentSubitem.EstResources = childrens;

						angular.extend(selectedResource, parentSubitem);
						estimateMainResourceService.fireItemModified(selectedResource);

						angular.forEach(newResources, function (resItem) {
							if (resItem.EstResourceFK !== null && resItem.EstResourceFk === selectedResource.Id && resItem.EstHeaderFk === selectedResource.EstHeaderFk) {
								estimateMainResourceService.getContainerData().itemList.push(resItem);
							}
							estimateMainResourceService.markItemAsModified(resItem);
							estimateMainResourceService.fireItemModified(resItem);
						});
						estimateMainResourceService.gridRefresh();

						// after replace successfully, recalucate lineitem and resources
						let resources = estimateMainResourceService.getList();
						if (resources && resources.length > 0) {
							let lineItemService = estimateMainResourceService.parentService();
							if (lineItemService) {
								estimateMainCommonService.calculateLineItemAndResources(lineItemService.getSelected(), resources);
							}

							// Process resource structure image
							let estimateMainResourceImageProcessor = $injector.get('estimateMainResourceImageProcessor');
							angular.forEach(resources, function (resource) {
								estimateMainResourceImageProcessor.processItem(resource);
							});
						}

						defer.resolve(true);
					});
					return defer.promise;
				}

				function isSubItem(res){
					return (res.EstResourceTypeFk === estimateMainResourceType.SubItem || res.EstResourceTypeFkExtend === estimateMainResourceType.SubItem) && res.EstAssemblyFk === null;
				}

				// download mdc costCode to resolve not assigned totals field in line item dynamic columns
				function loadMdcCostCode(){
					let lookupType = 'costcode';
					let estimateMainService = $injector.get('estimateMainService');
					if (estimateMainService.isMdcCostCodeLookupLoaded()){
						return $q.when(true);
					}

					let defer = $q.defer();
					$injector.get('basicsLookupdataLookupDescriptorService').loadData(lookupType).then(function(){
						estimateMainService.setMdcCostCodeLookupLoaded(true);
						defer.resolve(true);
					});
					return defer.promise;
				}
			}
		]);

})(angular);
