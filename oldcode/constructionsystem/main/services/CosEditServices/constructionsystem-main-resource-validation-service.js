/**
 * Created by waldrop 10/12/2018
 */

(function (angular) {

	'use strict';

	/* global _ */
	var moduleName = 'constructionsystem.main';
	var estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name constructionsystemMainResourceValidationService
	 * @description provides validation methods for relationship instances
	 */
	estimateMainModule.factory('constructionsystemMainResourceValidationService',
		['$q', '$http', '$injector', 'platformDataValidationService', 'estimateMainResourceProcessor', 'constructionsystemMainResourceDataService', 'platformRuntimeDataService', 'estimateMainCommonService',
			function ($q, $http, $injector, platformDataValidationService, estimateMainResourceProcessor, constructionsystemMainResourceDataService, platformRuntimeDataService, estimateMainCommonService) {

				var service = {};

				service.validateEstResourceTypeFkExtend = function validateEstResourceTypeFkExtend(entity, value) {
					if (value === 3 || value === 5) { // plant && sub item)
						var codeField = 'Code';
						platformRuntimeDataService.applyValidationResult(true, entity, codeField);
						platformDataValidationService.removeFromErrorList(entity, codeField, service, constructionsystemMainResourceDataService);
					}

					return !platformDataValidationService.isEmptyProp(value);
				};

				service.validateCode = function validateCode(entity, value, model) {
					var resMandatory = platformDataValidationService.isMandatory(value, model);
					if (!resMandatory.valid){
						entity.DescriptionInfo = {};
						estimateMainCommonService.extractSelectedItemProp(null, entity);
						if (entity.EstResourceTypeFk === 4 && entity.EstAssemblyTypeFk){
							deleteRecursivelyFn(entity.EstResources);
						}
					}
					return platformDataValidationService.finishValidation(resMandatory, entity, value, model, service, constructionsystemMainResourceDataService);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					entity[model] = value;

					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, constructionsystemMainResourceDataService);

					switch (entity.EstResourceTypeFk){
						case 1:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case 2:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;
						case 4:
							defer.promise = setResourceInfoFromLookup(entity, 'estassemblyfk', 'EstAssemblyFk', model);
							break;
						case 5:
							var subItems = _.filter(constructionsystemMainResourceDataService.getList(), function(item){
								return item.EstResourceTypeFk === 5 || item.EstResourceTypeFkExtend === 5;
							});
							var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, subItems, service, constructionsystemMainResourceDataService);
							defer.resolve(result);
							break;
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.promise = defer.promise;
					return asyncMarker.promise;
				};

				service.validateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					var lookupItem = estimateMainCommonService.getSelectedLookupItem() || {};
					var codeField = 'Code';

					var resMandatory = entity.EstResourceTypeFk !==5 ? platformDataValidationService.isMandatory(value, model, {fieldName: 'Code'}):  {valid : true};

					if (_.isEmpty(lookupItem) && resMandatory.valid === false && entity.EstResourceTypeFk !==5){
						entity.Code = '';
						estimateMainCommonService.extractSelectedItemProp(null, entity);
						if (entity.EstResourceTypeFk === 4 && entity.EstAssemblyTypeFk){
							deleteRecursivelyFn(entity.EstResources);
						}
					}else{
						resMandatory.valid = true;
					}
					platformRuntimeDataService.applyValidationResult(resMandatory, entity, codeField);
					return platformDataValidationService.finishValidation(resMandatory, entity, value, codeField, service, constructionsystemMainResourceDataService);
				};

				service.asyncValidateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, constructionsystemMainResourceDataService);

					switch (entity.EstResourceTypeFk){
						case 1:
							defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes', 'MdcCostCodeFk', model);
							break;
						case 2:
							defer.promise = setResourceInfoFromLookup(entity, 'MaterialRecord', 'MdcMaterialFk', model);
							break;
						case 4:
							defer.promise = setResourceInfoFromLookup(entity, 'estassemblyfk', 'EstAssemblyFk', model);
							break;
						default:
							defer.resolve(true);
							break;
					}

					asyncMarker.promise = defer.promise;
					return asyncMarker.promise;
				};

				var mandatoryFields = [
					'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
					'ProductivityFactor', 'EfficiencyFactor1', 'EfficiencyFactor2', 'CostUnit', 'CostFactor1',
					'CostFactor2', 'HoursUnit', 'HourFactor'
				];

				var generateMandatory = function generateMandatory(field) {
					return function (entity, value) {
						return platformDataValidationService.isMandatory(value, field);
					};
				};

				function valueChangeCalculation (entity, field){
					var serv = $injector.get('constructionsystemMainResourceDetailService');
					return serv.valueChangeCallBack(entity, field);
				}

				var generateAsyncValidation = function (field) {
					return function generateAsyncValidation(entity, value) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, constructionsystemMainResourceDataService);
						if(field !== 'IsDisabled') {
							entity[field] = value;
						}
						asyncMarker.myPromise = valueChangeCalculation(entity, field).then(function () {
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation({valid:true}, entity, value, field, asyncMarker, service, constructionsystemMainResourceDataService);
						});
						return asyncMarker.myPromise;
					};
				};

				_.each(mandatoryFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				var optionalFields = [
					'IsLumpsum',
					'IsDisabled',
					'IsDisabledPrc',
					'Sorting',
					'IsFixedBudget',
					'BudgetUnit',
					'Budget',
					'IsIndirectCost'
				];

				_.each(optionalFields, function (field) {
					service['validate' + field] = function () {
						return {valid:true};
					};
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				// This will overwrite the above statement for sync validation
				service.validateIsDisabled = function validateIsDisabled(entity, value, model){

					let considerDisabledDirect = $injector.get('constructionsystemMainCommonLookupService').getConsiderDisabledDirect();
					entity.IsDisabledDirect = considerDisabledDirect ? value : false;

					let traverseResource = function traverseResource(resources, disabled, fieldName){
						_.forEach(resources, function(resource){
							let isDisabled =  considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== entity.Id ? resource[fieldName] : disabled) : disabled;
							resource[fieldName] = isDisabled;

							constructionsystemMainResourceDataService.markItemAsModified(resource);

							if (resource.HasChildren){
								traverseResource(resource.EstResources, isDisabled, fieldName);
							}
						});
					};

					traverseResource([entity], value, model);

					return true;
				};

				service.validateSubItemsUniqueCodeFromAssembly = function validateSubItemsUniqueCodeFromAssembly(assemblyList) {
					var model = 'Code';
					validateSubItemsUniqueCodeV2(assemblyList, model);
				};

				function validateSubItemsUniqueCodeV2(resourcesTree, model){
					var subItems = [];
					var traverseValidateSubItems = function traverseSubItems(resourcesTree){
						_.forEach(resourcesTree, function (item) {
							if ((item.EstResourceTypeFk === 5 || item.EstResourceTypeFkExtend === 5) && item.EstAssemblyFk === null) {

								validateSubItemUniqueCode(subItems, item, model, constructionsystemMainResourceDataService);
								subItems.push(item); // Add sub items to validate later

								if (item.HasChildren) {
									traverseSubItems(item.EstResources);
								}
							}
						});
					};
					traverseValidateSubItems(resourcesTree);
				}

				function validateSubItemUniqueCode(itemList, subItem, model, dataService){
					var resSubItemUnique = platformDataValidationService.isValueUnique(itemList, model, subItem.Code, subItem.Id);
					var resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.Code, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, model);
				}

				service.validateQuantityDetail = function validateQuantityDetail(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'Quantity');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Quantity, 'Quantity', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateEfficiencyFactorDetail1 = function validateEfficiencyFactorDetail1(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor1, 'EfficiencyFactor1', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateEfficiencyFactorDetail2 = function validateEfficiencyFactorDetail2(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'EfficiencyFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.EfficiencyFactor2, 'EfficiencyFactor2', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateQuantityFactorDetail1 = function validateQuantityFactorDetail1(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor1, 'QuantityFactor1', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateQuantityFactorDetail2 = function validateQuantityFactorDetail2(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor2, 'QuantityFactor2', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateProductivityFactorDetail = function validateProductivityFactorDetail(entity, value, field){
					var res =  $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'ProductivityFactor');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.ProductivityFactor, 'ProductivityFactor', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateCostFactorDetail1 = function validateCostFactorDetail1(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor1, 'CostFactor1', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				service.validateCostFactorDetail2 = function validateCostFactorDetail2(entity, value, field){
					var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, constructionsystemMainResourceDataService);
					if(res && res.valid){
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor2, 'CostFactor2', null, service, constructionsystemMainResourceDataService);
					}
					return res;
				};

				function setResourceInfoFromLookup(resource, lookupType, field, model){
					var defer = $q.defer();

					var estimateMainService = $injector.get('estimateMainService');
					var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
					// eslint-disable-next-line no-unused-vars
					var estimateMainResourceImageProcessor =$injector.get('estimateMainResourceImageProcessor');

					var lookupItem = estimateMainCommonService.getSelectedLookupItem() || {};
					var isValidLookupItem = false;
					if ((lookupItem && lookupItem.Id) && model === 'DescriptionInfo.Translated'){
						resource.Code = lookupItem.Code;
					}

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

					if (isValidLookupItem){
						if(resource.DescriptionInfo === null){
							resource.DescriptionInfo ={};
						}
						angular.extend(resource.DescriptionInfo, lookupItem.DescriptionInfo);
						estimateMainCommonService.setSelectedCodeItem(null, resource, true, lookupItem);

						if (lookupType === 'estassemblyfk'){
							if (resource.EstAssemblyTypeFk){
								deleteRecursivelyFn(resource.EstResources);
							}

							var lineItem = estimateMainService.getSelected();
							// eslint-disable-next-line no-unused-vars
							var isResolveToSubItem = false;
							constructionsystemMainResourceDataService.resolveResourcesAndAssign(lineItem, [lookupItem.Id], 4);

							defer.resolve(true);
						}else{
							// calculate the quantityUnitTarget before calculate the total
							estimateMainCommonService.calQuantityUnitTarget(estimateMainService.getSelected());
							estimateMainCommonService.calculateResource(resource, estimateMainService.getSelected(), constructionsystemMainResourceDataService.getList());

							defer.resolve(true);
						}
					}else{
						// we cannot retrieve lookup information from lookup, so we try to get it individually depending on resource type and Code(immediate cell change situation)
						if (model === 'Code' && _.isEmpty(resource[field])){
							resource.Code = _.toUpper(resource.Code);
							var asyncMarker = platformDataValidationService.registerAsyncCall(resource, resource.Code, model, constructionsystemMainResourceDataService);
							switch (resource.EstResourceTypeFk){
								case 1:
									asyncMarker.myPromise = $injector.get('estimateMainJobCostcodesLookupService').getEstCCByCodeAsync(resource).then(function (costCodeByCode) {
										if (_.isEmpty(costCodeByCode)) {
											var errorMessage = 'estimate.main.errors.codeNotFound';
											var errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return platformDataValidationService.finishAsyncValidation(errorObject, resource, resource.Code, model, asyncMarker, service, constructionsystemMainResourceDataService);
										}else{
											// TODO-Walt: set HourUnit
											resource.HourUnit = costCodeByCode.HourUnit;
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, costCodeByCode);
											defer.resolve(true);
										}
									});
									return asyncMarker.myPromise;
								case 2:
									var materialLookupService = $injector.get('basicsMaterialLookupService');
									var item = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
									if (item) {
										materialLookupService.searchOptions.ProjectId = item.id;
										materialLookupService.searchOptions.SearchText = resource.Code;
										materialLookupService.searchOptions.LgmJobFk = $injector.get('estimateMainPrjMaterialLookupService').getJobFk();
									}

									asyncMarker.myPromise = materialLookupService.search().then(function(resultAll){
										var resultMaterials = resultAll.items;

										var materialByCode = resultMaterials.length > 0 ? _.first(resultMaterials) : {};
										if (_.isEmpty(materialByCode)) {
											var errorMessage = 'estimate.main.errors.codeNotFound';
											var errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return platformDataValidationService.finishAsyncValidation(errorObject, resource, resource.Code, model, asyncMarker, service, constructionsystemMainResourceDataService);
										}else{
											if (!Object.prototype.hasOwnProperty.call(materialByCode,'DescriptionInfo')){
												angular.extend(materialByCode,{ DescriptionInfo: materialByCode.DescriptionInfo1 });
												if (_.isEmpty(materialByCode.DescriptionInfo.Translated)){
													materialByCode.DescriptionInfo.Translated = materialByCode.DescriptionInfo.Description;
												}
											}
											estimateMainCommonService.setSelectedCodeItem(null, resource, true, materialByCode);
											defer.resolve(true);
										}
									});
									return asyncMarker.myPromise;
								case 4:
									asyncMarker.myPromise =  $injector.get('estimateMainAssemblyTemplateService').getAssemblyByCodeAsync(_.toUpper(resource.Code)).then(function(assemblyByCode){
										if (_.isEmpty(assemblyByCode)) {
											var errorMessage = 'estimate.main.errors.codeNotFound';
											var errorObject = platformDataValidationService.createErrorObject(errorMessage);
											errorObject.valid = false;
											return platformDataValidationService.finishAsyncValidation(errorObject, resource, resource.Code, model, asyncMarker, service, constructionsystemMainResourceDataService);
										}else{
											// Assembly to subitem
											if (resource.EstAssemblyTypeFk){
												deleteRecursivelyFn(resource.EstResources);
											}

											var lineItem = estimateMainService.getSelected();
											// eslint-disable-next-line no-unused-vars
											var isResolveToSubItem = false;
											constructionsystemMainResourceDataService.resolveResourcesAndAssign(lineItem, [assemblyByCode.Id], 4);

											defer.resolve(true);
										}
									});
									return asyncMarker.myPromise;
								default:
									defer.resolve(true);
									break;
							}
						}
					}

					if(resource.Version === 0){
						resource.CostUnitOriginal = resource.CostUnit;
						resource.QuantityOriginal = resource.Quantity;
					}
					// estimateMainResourceImageProcessor.processItem(resource);
					return defer.promise;
				}

				var commonValserv = $injector.get('constructionSystemMainCommonFeaturesService');
				var asyncVal = commonValserv.getAsyncDetailValidation(constructionsystemMainResourceDataService);
				angular.extend(service, asyncVal);

				function deleteRecursivelyFn(resources){
					_.forEach(resources, function(resourceToDelete){
						if (!_.isEmpty(resourceToDelete.EstResources)){
							deleteRecursivelyFn(resourceToDelete.EstResources);
						}
						constructionsystemMainResourceDataService.deleteItem(resourceToDelete);
					});
				}

				return service;
			}
		]);

})(angular);
