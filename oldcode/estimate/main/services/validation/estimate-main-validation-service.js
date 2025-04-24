/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global moment, globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainValidationService
	 * @description provides validation methods for estimate instances
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	estimateMainModule.factory('estimateMainValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateMainService',
			'estimateMainResourceService', 'estimateMainResourceProcessor', 'estimateMainTranslationService', 'platformModalService', 'estimateParamUpdateService', 'estimateMainCompleteCalculationService',
			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService, estimateMainService,
				estimateMainResourceService, estimateMainResourceProcessor, estimateMainTranslationService, platformModalService, estimateParamUpdateService, estimateMainCompleteCalculationService) {

				let service = {},
					validationResult = {valid: true};

				let mandatoryFields = [
					'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
					'ProductivityFactor', 'CostFactor1', 'CostFactor2', 'QuantityTarget',
					'QuantityTotal', 'WqQuantityTarget'
				];

				let optionalFields = [
					'EstLineItemFk',
					'SortCode01Fk',
					'SortCode02Fk',
					'SortCode03Fk',
					'SortCode04Fk',
					'SortCode05Fk',
					'SortCode06Fk',
					'SortCode07Fk',
					'SortCode08Fk',
					'SortCode09Fk',
					'SortCode10Fk',
					'FromDate',
					'ToDate',
					'IsFixedBudget',
					'IsFixedBudgetUnit',
					'BudgetUnit',
					'Budget',
					'BasUomFk'
				];

				_.each(mandatoryFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				_.each(optionalFields, validateOptionalFields);

				let commonValServ = $injector.get('estimateMainCommonFeaturesService');
				let asyncVal = commonValServ.getAsyncDetailValidation(estimateMainService);
				angular.extend(service, asyncVal);

				angular.extend(service, {

					validateCode: validateCode,
					asyncValidateCode: asyncValidateCode,

					validateEstAssemblyFkForBulkConfig: validateEstAssemblyFkForBulkConfig,
					asyncValidateEstAssemblyFk: asyncValidateEstAssemblyFk,

					getLineItems: getLineItems,

					asyncValidateRule: asyncValidateRule,
					asyncValidateDragDropRule: asyncValidateDragDropRule,
					validateFromDate: validateFromDate,
					validateFromDateForBulkConfig: validateFromDateForBulkConfig,
					validateToDate: validateToDate,
					validateToDateForBulkConfig: validateToDateForBulkConfig,
					validateQuantityDetail: validateQuantityDetail,
					validateQuantityTargetDetail: validateQuantityTargetDetail,
					validateWqQuantityTargetDetail: validateWqQuantityTargetDetail,
					validateQuantityFactorDetail1: validateQuantityFactorDetail1,
					validateQuantityFactorDetail2: validateQuantityFactorDetail2,
					validateProductivityFactorDetail: validateProductivityFactorDetail,
					validateCostFactorDetail1: validateCostFactorDetail1,
					validateCostFactorDetail2: validateCostFactorDetail2,
					asyncValidateBoqItemFk: asyncValidateBoqItemFk,
					validateBoqItemFk: validateBoqItemFk,
					updateQuantityUomEstConfigSorting: updateQuantityUomEstConfigSorting,
					validateWicBoqItemFk: validateWicBoqItemFk,
					validateLineItemsUniqueCode: validateLineItemsUniqueCode,

					validateSortCode01Fk: validateSortCodeFk,
					validateSortCode02Fk: validateSortCodeFk,
					validateSortCode03Fk: validateSortCodeFk,
					validateSortCode04Fk: validateSortCodeFk,
					validateSortCode05Fk: validateSortCodeFk,
					validateSortCode06Fk: validateSortCodeFk,
					validateSortCode07Fk: validateSortCodeFk,
					validateSortCode08Fk: validateSortCodeFk,
					validateSortCode09Fk: validateSortCodeFk,
					validateSortCode10Fk: validateSortCodeFk,

					validateSortDesc01Fk: validateSortDescFk,
					validateSortDesc02Fk: validateSortDescFk,
					validateSortDesc03Fk: validateSortDescFk,
					validateSortDesc04Fk: validateSortDescFk,
					validateSortDesc05Fk: validateSortDescFk,
					validateSortDesc06Fk: validateSortDescFk,
					validateSortDesc07Fk: validateSortDescFk,
					validateSortDesc08Fk: validateSortDescFk,
					validateSortDesc09Fk: validateSortDescFk,
					validateSortDesc10Fk: validateSortDescFk,
					validateGcBreakdownTypeFk:validateGcBreakdownTypeFk,

					asyncValidatePsdActivityFk: asyncValidatePsdActivityFk,
					asyncValidatePrjLocationFk: asyncValidatePrjLocationFk,
					asyncValidateMdcControllingUnitFk: asyncValidateMdcControllingUnitFk,
					updateByEstConfigSorting: updateByEstConfigSorting,
					asyncValidateBoqSplitQuantityFk: asyncValidateBoqSplitQuantityFk,
					asyncValidateBoqItemFkForBulkConfig: asyncValidateBoqItemFkForBulkConfig,
					validateBoqItemFkForBulkConfig:validateBoqItemFkForBulkConfig,

					// DynamicConfigSetUp: 4. Register Validation For Dynamic Fields Which will be used to track changes to specificied service.
					//* *// Dynamic validations
					validateConfDetail: validateConfDetail,
					asyncValidateConfDetail: asyncValidateConfDetail,
					validateLicCostGroupCatalog: validateLicCostGroupCatalog,
					asyncValidateLicCostGroupCatalog: asyncValidateLicCostGroupCatalog,
					/**/
					validateIsOptional: validateIsOptional,
					validateIsDaywork: validateIsDaywork,
					validateIsNoMarkup: validateIsNoMarkup,
					validateIsFixedPrice: validateIsFixedPrice,
					validateIsGc: validateIsGc,
					validateGrandCostUnitTarget: validateGrandCostUnitTarget,
					validateManualMarkupUnit: validateManualMarkupUnit,
					asyncValidateAssemblyType:asyncValidateAssemblyType,
					asyncValidateIsDurationQuantityActivity: asyncValidateIsDurationQuantityActivity,
				});

				return service;

				function calculateStandardAllowance(entity) {
					if (!entity) {
						return;
					}

					let resourceList = $injector.get('estimateMainResourceService').getList();
					$injector.get('estimateMainStandardAllowanceCalculationService').calculateStandardAllowance(entity, resourceList || []);
				}

				function resetAdvancedAll(entity) {
					entity.AdvancedAllUnit = 0;
					entity.AdvancedAllUnitItem = 0;
					entity.AdvancedAll = 0;
				}

				function setAdvancedAllReadOnly(entity) {
					const readonly = entity.IsOptional || entity.IsDaywork || entity.IsNoMarkup || entity.IsGc;
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnit', readonly: readonly }]);
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnitItem', readonly: readonly }]);
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAll', readonly: readonly }]);
				}

				function validateIsOptional(entity, value, model) {

					let items = estimateMainService.getSelectedEntities();

					_.forEach(items, function (entity) {
						if (value) {
							resetAdvancedAll(entity);
						} else {
							entity.IsOptionalIT = false;
						}
						entity.IsOptional = value;
						platformRuntimeDataService.readonly(entity, [{field: 'IsOptionalIT', readonly: !value}]);
						setAdvancedAllReadOnly(entity);
					});

					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				function validateIsDaywork(entity, value, model) {
					if (value) {
						resetAdvancedAll(entity);
					}
					entity.IsDaywork = value;
					setAdvancedAllReadOnly(entity);
					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				function validateIsNoMarkup(entity, value, model) {
					entity.originalAdvancedAllUnit = entity.AdvancedAllUnit;
					entity.originalManualMarkupUnit = entity.ManualMarkupUnit;
					entity.AdvancedAllUnit = 0;
					entity.AdvancedAllUnitItem = 0;
					entity.AdvancedAll = 0;
					entity.URDUnitItem = 0;
					entity.ManualMarkupUnit = 0;
					entity.ManualMarkupUnitItem = 0;
					entity.ManualMarkup = 0;
					entity.IsNoMarkup = value;
					if (value) {
						entity.GcUnitItem = entity.GcUnit = entity.Gc = 0;
						entity.GaUnitItem = entity.GaUnit = entity.Ga = 0;
						entity.AmUnitItem = entity.AmUnit = entity.Am = 0;
						entity.RpUnitItem = entity.RpUnit = entity.Rp = 0;
						entity.Allowance = entity.AllowanceUnitItem = entity.AllowanceUnit = 0;
						entity.Fm = 0;
						entity.GrandTotal = entity.CostTotal;
						entity.GrandCostUnitTarget = entity.CostUnitTarget;
						entity.GrandCostUnit = entity.CostUnit;
						entity.URD = 0;
					}

					if (value) {
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnit', readonly: value}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnit', readonly: value}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnitItem', readonly: value}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkup', readonly: value}]);
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnitItem', readonly: value}]);
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAll', readonly: value}]);
					} else if (!entity.IsGc) {
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnit', readonly: entity.IsOptional || entity.IsDaywork}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnit', readonly: entity.IsFixedPrice}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnitItem', readonly: entity.IsFixedPrice}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkup', readonly: entity.IsFixedPrice}]);
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnitItem', readonly: entity.IsOptional || entity.IsDaywork }]);
						platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAll', readonly: entity.IsOptional || entity.IsDaywork}]);
					}

					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				function validateIsFixedPrice(entity, value, model) {
					let items = estimateMainService.getSelectedEntities();
					_.forEach(items, function (entity) {
						if (value) {
							platformRuntimeDataService.readonly(entity, [{field: 'GrandCostUnitTarget', readonly: !value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnit', readonly: value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnitItem', readonly: value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkup', readonly: value}]);
						} else if (!entity.IsGc && !entity.IsNoMarkup) {
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnit', readonly: value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkupUnitItem', readonly: value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'ManualMarkup', readonly: value}]);

						}
					});

					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				function validateIsGc(entity, value, model) {
					let items = estimateMainService.getSelectedEntities() || [entity];

					if (_.isArray(items)) {
						_.forEach(items, function (item) {
							platformRuntimeDataService.readonly(item, [{field: 'IsFixedPrice', readonly: value}]);

							if (value) {
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAllUnit', readonly: value}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkupUnit', readonly: value}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkupUnitItem', readonly: value}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkup', readonly: value}]);
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAllUnitItem', readonly: value}]);
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAll', readonly: value}]);
							} else if (!item.IsNoMarkup) {
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAllUnit', readonly: item.IsOptional || entity.IsDaywork}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkupUnit', readonly: item.IsFixedPrice}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkupUnitItem', readonly: item.IsFixedPrice}]);
								platformRuntimeDataService.readonly(item, [{field: 'ManualMarkup', readonly: item.IsFixedPrice}]);
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAllUnitItem', readonly: item.IsOptional || entity.IsDaywork  }]);
								platformRuntimeDataService.readonly(item, [{field: 'AdvancedAll', readonly: item.IsOptional || entity.IsDaywork}]);
							}

							if (value) {
								entity.AdvancedAllUnit = 0;
								entity.AdvancedAllUnitItem = 0;
								entity.AdvancedAll = 0;
								entity.ManualMarkupUnit = 0;
								entity.ManualMarkupUnitItem = 0;
								entity.ManualMarkup = 0;
								entity.IsOptionalIT = !value;
								entity.IsOptional = !value;
								entity.IsDaywork = !value;
								platformRuntimeDataService.readonly(entity, [{field: 'IsOptionalIT', readonly: value}]);
							}
							platformRuntimeDataService.readonly(entity, [{field: 'IsOptional', readonly: value}]);
							platformRuntimeDataService.readonly(entity, [{field: 'IsDaywork', readonly: value}]);
						});
					}

					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				function validateGrandCostUnitTarget(entity, value, model) {

					let validationResult = platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);

					if (entity) {
						entity.GrandCostUnitTarget = value;

						calculateStandardAllowance(entity);
					}

					return validationResult;
				}

				function validateManualMarkupUnit(entity, value, model) {
					if (entity) {
						entity.ManualMarkupUnit = value;

						calculateStandardAllowance(entity);
					}

					return platformDataValidationService.finishValidation({
						valid: true
					}, entity, value, model, service, estimateMainService);
				}

				// ALM 114550
				function getListByLineItem(entity, field, originalValue) {
					let serv = $injector.get('estimateMainLineItemDetailService');
					let allResources = estimateMainResourceService.getList();
					let resourceList = allResources && allResources.length ? _.filter(allResources, {EstLineItemFk: entity.Id, EstHeaderFk: entity.EstHeaderFk}) : [];
					if (resourceList.length) {
						return $q.when(serv.valueChangeCallBack(entity, field, originalValue, true, resourceList));
					} else {

						let postData = {
							estLineItemFks: [entity.Id],
							estHeaderFk: estimateMainService.getSelectedEstHeaderId(),
							projectId: estimateMainService.getProjectId()
						};
						return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', postData).then(function (response) {
								let resourceList = response && response.data && response.data.dtos ? response.data.dtos : [];

								// load user defined column value
								let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
								let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
								if (udpData.length > 0) {
									estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(resourceList, udpData, false);
								}

								estimateMainResourceService.setList(resourceList);
								return serv.valueChangeCallBack(entity, field, originalValue, true, resourceList);
							},
							function (/* error */) {
							});
					}
				}

				function valueChangeCalculation(entity, field, originalValue, isFromBulkEditor, value) {
					let serv = $injector.get('estimateMainLineItemDetailService');
					// ALM 114550
					if (entity.CombinedLineItems) {
						return serv.valueChangeCallBack(entity, field, originalValue);
					} else {
						if (field === 'EstLineItemFk' && !value) {
							return serv.valueChangeCallBack(entity, field, originalValue);
						} else if (entity.EstLineItemFk) {
							let estimateMainRefLineItemService = $injector.get('estimateMainRefLineItemService');
							return estimateMainRefLineItemService.getResourcesByRefLineitem(entity).then(function (resourceList) {
								return serv.valueChangeCallBack(entity, field, originalValue, true, resourceList);
							});
						} else {
							return getListByLineItem(entity, field, originalValue);
						}
					}
				}

				function validateCode(entity, value, field) {
					let subItemHasChildren = entity.EstResources && entity.EstResources.length > 0;
					let editable = subItemHasChildren ? false : _.isEmpty(value);
					estimateMainResourceProcessor.setLineTypeReadOnly(entity, !editable);
					return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainService);
				}

				function asyncValidateCode(entity, value, field) {

					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainService);

					let postData = {Id: entity.Id, estHeaderFk: entity.EstHeaderFk, Code: value};// Call data prepared
					let estimateMainResourceType = $injector.get('estimateMainResourceType');
					// eslint-disable-next-line no-prototype-builtins
					if (entity.hasOwnProperty('EstResourceTypeFkExtend')) {
						let defer = $q.defer();
						if (parseInt(value) === 0) {
							defer.$$resolve({valid: false, apply: true, error$tr$: 'estimate.main.errors.restrictCode'});
						} else {
							if (entity.EstResourceTypeFk === estimateMainResourceType.SubItem) {
								let resList = estimateMainResourceService.getList();
								let list = _.filter(resList, function (item) {
									return item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.Code === value && item.Id !== entity.Id;
								});
								defer.$$resolve(!list.length ? true : {valid: false, apply: true, error$tr$: 'estimate.main.errors.uniqCode'});
							} else {
								defer.$$resolve({valid: true});
							}
						}
					}

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/isuniquecode', postData).then(function (response) {
						let res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.main.errors.uniqCode';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateMainService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				}

				function validateEstAssemblyFkForBulkConfig(entity, value) {
					if (value === null || value === undefined) {
						if (Object.hasOwnProperty.call(entity, 'EstAssemblyFkPrjProjectAssemblyFk')) {
							delete entity.EstAssemblyFkPrjProjectAssemblyFk;
						}
					}
					return true;
				}

				function asyncValidateAssemblyType(entity, value, field) {
					let defer = $q.defer();
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainService);
					entity[field] = value;

					let newField = 'EstAssemblyFk'

					if(value){

						let estimateMainService = $injector.get('estimateMainService');
						let lgmJobFk = estimateMainService.getLineItemJobId(entity);
						let projectId = estimateMainService.getSelectedProjectId();

						platformRuntimeDataService.readonly(entity, [{field:newField, readonly:true}]);

						$injector.get('estimateMainResourceValidationService').checkPlantLogisticJob(lgmJobFk, projectId).then(function(res) {
							platformRuntimeDataService.applyValidationResult(res, entity, newField);
							platformRuntimeDataService.readonly(entity, [{ field: newField, readonly: !res.valid }]);
							platformDataValidationService.finishAsyncValidation(res, entity, entity.EstAssemblyFk, newField, asyncMarker, service, estimateMainService);
							defer.resolve(platformDataValidationService.ensureNoRelatedError(entity, field,['AssemblyType'], self, estimateMainService));
						}).catch(function(error) {
							console.error(error);
							defer.reject(error);
						});

					} else {
						$q.when().then(function () {
							platformRuntimeDataService.readonly(entity, [{field: newField, readonly:false}]);
							platformRuntimeDataService.applyValidationResult({valid:true}, entity, newField);
							defer.resolve(platformDataValidationService.finishAsyncValidation({valid:true}, entity, entity.EstAssemblyFk, newField, asyncMarker, service, estimateMainService));
						});
					}

					return defer.promise;
				}

				function asyncValidateEstAssemblyFk(entity, value, model, arg4, isFromBulkEditor) {

					if (value === null || value === undefined) {
						if (Object.hasOwnProperty.call(entity, 'EstAssemblyFkPrjProjectAssemblyFk')) {
							delete entity.EstAssemblyFkPrjProjectAssemblyFk;
						}
						delete entity.EstAssemblyFk;
						delete entity.EstAssemblyCatFk;
						delete entity.EstHeaderAssemblyFk;
						entity.EstAssemblyDescriptionInfo = null;
					}

					if (value) {
						let isResolvedFromValidation = true;
						let res = {};
						res.valid = true;
						res.apply = true;
						if (entity.AssemblyType === 0) {
							return estimateMainService.getAssemblyLookupSelectedItems(entity, [{Id: value}], isResolvedFromValidation).then(function (result) {
								if (isFromBulkEditor) {
									res.valid = result;
								}
								return res;
							});
						} else {
							return estimateMainService.getPlantAssemblyLookupSelectedItems(entity, [{Id: value}], isResolvedFromValidation, true).then(function (result) {
								if (isFromBulkEditor) {
									res.valid = result;
								}
								return res;
							});
						}
					}
					return $q.when(true);
				}

				function generateMandatory(field) {
					return function (entity, value) {
						if (!value || value === '') {
							value = 0;
							entity[field] = value;
						}
						return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainService);
					};
				}

				function generateAsyncValidation(field) {
					return function generateAsyncValidation(entity, value, model, arg4, isFromBulkEditor) {
						let dataService = entity && (entity.hasOwnProperty('BoqDivisionTypeFk') && entity.hasOwnProperty('BriefInfo')) ? $injector.get('estimateMainBoqService') : estimateMainService;
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
						let originalValue = entity[field];
						entity[field] = value;
						let promise = entity && (entity.hasOwnProperty('BoqDivisionTypeFk') && entity.hasOwnProperty('BriefInfo')) ?  $q.when(true) : valueChangeCalculation(entity, field, originalValue, isFromBulkEditor, value);

						asyncMarker.myPromise = promise.then(function () {
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation(validationResult, entity, value, field, asyncMarker, service, dataService);
						});
						return asyncMarker.myPromise;
					};
				}

				function getLineItems(estEstHeaderFk) {
					let deferList = $q.defer();
					if (estEstHeaderFk === null) {
						estEstHeaderFk = 1;
					}

					let data = {
						estHeaderFk: estEstHeaderFk
					};

					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/list', data
					).then(function (response) {
							deferList.resolve(response.data);
						}
					);
					return deferList.promise;
				}

				function asyncValidateRule(entity, value, model, options) {
					let containerData = estimateMainService.getContainerData();
					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					let updateData = modTrackServ.getModifications(estimateMainService);
					// updateData.EstLineItem = entity && entity.hasOwnProperty('IsGc') ? entity : updateData.EstLineItem;

					if (!options) {
						options = {};
						options.dataServiceMethod = 'getItemByRuleAsync';
						options.dataServiceName = 'estimateRuleFormatterService';
						options.itemName = 'EstLineItems';
						options.itemServiceName = 'estimateMainService';
						options.serviceName = 'basicsCustomizeRuleIconService';
						options.validItemName = 'EstLineItems';
					}

					if (options && options.itemServiceName) {
						updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, entity, options.itemServiceName);
						updateData.MainItemName = options.itemName;
					}
					updateData.ConsiderParamLevelFromSystemOption = true;

					//collect the lineItem Ids in current page, used to filter the return LineItems when delete rule
					updateData.lineItemIds = _.map(estimateMainService.getList(), function(e){ return e.Id;});

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);
					let rulePromise = $http.post(containerData.httpUpdateRoute + containerData.endUpdate, updateData);
					asyncMarker.myPromise = rulePromise;

					return rulePromise.then(function (response) {
							let result = response.data;
							containerData.onUpdateSucceeded(result, containerData, updateData);
							// clear updateData
							modTrackServ.clearModificationsInRoot(estimateMainService);
							updateData = {};

							if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || (_.find(entity.RuleAssignment, function (item) {
								return !!item.FormFk;
							}))) {
								result.IsUpdated = true;
								result.containerData = containerData;
								result.isFormula = false;
								result.options = options;
								result.entity = entity;
								result.MainItemName = options.itemName;
								result.EstLeadingStuctureContext = updateData.EstLeadingStuctureContext ? updateData.EstLeadingStuctureContext :
									estimateParamUpdateService.getLeadingStructureContext({}, entity, options.itemServiceName);
								result.EstLeadingStuctEntities = angular.copy(options.selectedItems);
								result.fromModule = 'EstLineItem';
							}

							// merge new estimate rule to project rule and add a user form data if need.
							let estRules = entity.RuleAssignment.filter(function (item) {
								return !item.IsPrjRule;
							});

							let allPermission = [];
							if (estRules && result.PrjEstRuleToSave) {
								_.forEach(estRules, function (item) {
									let prjRule = result.PrjEstRuleToSave.find(function (r) {
										return r.Code === item.Code;
									});
									if (prjRule) {
										item.OriginalMainId = item.MainId = prjRule.MainId;
										item.IsPrjRule = true;
									}

									if (item.FormFk && item.MainId) {
										let completeDto = {formFk: item.FormFk, contextFk: item.MainId, rubricFk: 79};
										allPermission.push($http.post(globals.webApiBaseUrl + 'basics/userform/data/saveruleformdata', completeDto));
									}
								});
							}
							let includeUserForm = entity.RuleAssignment && entity.RuleAssignment.length > 0 && entity.RuleAssignment[entity.RuleAssignment.length - 1].FormFk;
							if (allPermission.length <= 0) {
								if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm) {
									let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
									$injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService($injector.get(options.itemServiceName));
									paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
								}
							} else {
								$q.all(allPermission).then(function () {
									if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm) {
										let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
										$injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService($injector.get(options.itemServiceName));
										paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
									}
								});
							}

							// Merge result into data on the client.
							platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, estimateMainService);
						},
						// when failed to update, this function will be excuted, this make the asyncValidate can return
						// if no this wrong response function, the rule column validate can't return and remove the pending-validation css, as that make always loading errors
						function () {
							// if failed, clear items.
							let args = {entity: entity};
							let scope = {
								entity: entity,
								$parent: {
									$parent: {
										config: {
											formatterOptions: options
										}
									}
								}
							};
							$injector.get('estimateRuleComplexLookupCommonService').clearAllItems(args, scope, true);

							// handler the reponse which failed to update. The rule validation is still ok even failed updated
							platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, estimateMainService);
						});
				}

				function asyncValidateDragDropRule(entities, destService) {

					let entity = destService.getIfSelectedIdElse(null) ? destService.getSelected() : entities && entities.length ? entities[0] : null,
						options = {itemName: destService.getItemName(), itemServiceName: destService.getServiceName(), itemService: destService, selectedItems: angular.copy(entities)};
					options.RootServices = ['EstHeader', 'EstBoq', 'EstActivity'].indexOf(options.itemName) >= 0 ? ['estimateMainRootService', 'estimateMainBoqService', 'estimateMainActivityService'] : null;
					return service.asyncValidateRule(entity, null, null, options);
				}

				function validateFromDateForBulkConfig(entity, value, model) {
					// removal of value
					if (value === null) {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
					let fromDate = moment.isMoment(value) ? value : moment.utc(value);
					let toDate = moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid: false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainService);
					} else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
				}

				function validateFromDate(entity, value, model) {
					let fromDate = moment.isMoment(value) ? value : moment.utc(value);
					let toDate = moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid: false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainService);
					} else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
				}

				function validateToDateForBulkConfig(entity, value, model) {
					// removal of value
					if (value === null) {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
					let toDate = moment.isMoment(value) ? value : moment.utc(value);
					let fromDate = moment.isMoment(entity.ToDate) ? entity.ToDate : moment.utc(entity.ToDate);

					if (!fromDate.isValid()) {
						return {valid: false};
					}
					if (!toDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainService);
					} else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
				}

				function validateToDate(entity, value, model) {
					let toDate = moment.isMoment(value) ? value : moment.utc(value);
					let fromDate = moment.isMoment(entity.FromDate) ? entity.FromDate : moment.utc(entity.FromDate);

					if (!toDate.isValid()) {
						// return moment.parsingFlags;
						return {valid: false};
					}
					if (!fromDate.isValid()) {
						return validationResult;
					}
					if (Date.parse(toDate) < Date.parse(fromDate)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.Error_EndDateTooEarlier',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainService);
					} else {
						return platformDataValidationService.finishValidation({
							valid: true
						}, entity, value, model, service, estimateMainService);
					}
				}

				function validateGcBreakdownTypeFk(entity, value, field) {
					let serv = $injector.get('estimateMainLineItemDetailService');
					return serv.valueChangeCallBack(entity, field, value);
				}

				function validateQuantityDetail(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'Quantity');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Quantity, 'Quantity', null, service, estimateMainService);
					}
					return res;
				}

				function validateQuantityTargetDetail(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
				}

				function validateWqQuantityTargetDetail(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
				}

				function validateQuantityFactorDetail1(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor1, 'QuantityFactor1', null, service, estimateMainService);
					}
					return res;
				}

				function validateQuantityFactorDetail2(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.QuantityFactor2, 'QuantityFactor2', null, service, estimateMainService);
					}
					return res;
				}

				function validateProductivityFactorDetail(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ProductivityFactor');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.ProductivityFactor, 'ProductivityFactor', null, service, estimateMainService);
					}
					return res;
				}

				function validateCostFactorDetail1(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor1');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor1, 'CostFactor1', null, service, estimateMainService);
					}
					return res;
				}

				function validateCostFactorDetail2(entity, value, field) {
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainService, true);
					if (res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'CostFactor2');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.CostFactor2, 'CostFactor2', null, service, estimateMainService);
					}
					return res;
				}

				function setIsIndirectCostAndRecalculate(lineItem, resources){
					recalculate(lineItem, resources, function(item, res){
						if(item.IsGc !== res.IsIndirectCost){
							res.IsIndirectCost = item.IsGc;
							estimateMainResourceService.markItemAsModified(res);
						}
					});
				}

				function setIsIndirectCostInBoq(lineItem, resources, model){
					recalculate(lineItem, resources, function(item, res){
						const isIndirectCost = res.IsIndirectCost;
						res.IsIndirectCost = item.IsGc && model === 'BoqItemFk';
						if(isIndirectCost !== res.IsIndirectCost){
							estimateMainResourceService.markItemAsModified(res);
						}
					});
				}

				function recalculate(lineItem, resources, handleFunc){
					if(!lineItem || !angular.isArray(resources)){
						return;
					}
					estimateMainService.markItemAsModified(lineItem);
					estimateMainResourceService.setList(resources);
					angular.forEach(resources, function (res) {
						if(handleFunc){
							handleFunc(lineItem, res);
						}
					});
					$injector.get('estimateMainCommonService').calculateLineItemAndResources(lineItem, resources);
				}

				function updateByEstConfigSorting(result, promise, entity, value, model, item, sourceStructure, modelObjects) {
					service.updateQuantityUomEstConfigSorting(entity, item, sourceStructure, modelObjects);
					setQuantityTarget(entity);
					let getResourcesByLineItems = false;
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);
					if (!promise) {
						// calculate LineItem
						const resourceList = $injector.get('estimateMainResourceService').getList();
						let lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {
							EstLineItemFk: entity.Id,
							EstHeaderFk: entity.EstHeaderFk
						}) : [];
						if (lineItemResources.length !== 0) {
							setIsIndirectCostInBoq(entity, lineItemResources, model);
							promise = $q.when(true);
						} else {
							let projectId = estimateMainService.getProjectId();
							let postData = {
								estLineItemFks: [entity.Id],
								estHeaderFk: estimateMainService.getSelectedEstHeaderId(),
								projectId: projectId
							};
							let url = $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', postData);
							getResourcesByLineItems = true;
							if (model === 'BoqItemFk') {
								url = $http.post(globals.webApiBaseUrl + 'estimate/main/resource/resolveResourceByIsGCChanging?' + 'lineItemId=' + entity.Id + '&headerId=' + entity.EstHeaderFk + '&isGc=' + entity.IsGc + '&projectId=' + projectId);
								getResourcesByLineItems = false;
							}
							promise = url;
						}
						asyncMarker.myPromise = promise;
					}
					return promise.then(function (response) {
							promise = null;
							setQuantityTarget(entity);
							let newResourceList;
							if (getResourcesByLineItems) {
								newResourceList = response && response.data && response.data.dtos ? response.data.dtos : [];

								// load user defined column value
								let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
								let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
								if (newResourceList.length > 0 && udpData.length > 0) {
									estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(newResourceList, udpData, false);
								}
							} else {
								newResourceList = response && response.data ? response.data : null;
							}

							if (newResourceList) {
								setIsIndirectCostAndRecalculate(entity, newResourceList);
								$injector.get('estimateMainDynamicUserDefinedColumnService').setReAttachDataToResource(!getResourcesByLineItems);
							}
							estimateMainService.markItemAsModified(entity);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateMainService);
						},
						function () {
							// handler the response which failed to update. The boq validation is still ok even failed updated
							platformRuntimeDataService.applyValidationResult(true, entity, model);
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, estimateMainService);
						});
				}

				function setQuantityTarget(entity) {
					entity.QuantityTargetDetail = entity.QuantityTarget;
					entity.WqQuantityTargetDetail = entity.WqQuantityTarget;
					if (entity.IsGc || entity.IsIncluded) {
						entity.GrandTotal = 0;
					}
				}

				// boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
				function isItemOrSurcharge(item){
					return [0, 11, 200, 201, 202, 203].indexOf(item.BoqLineTypeFk) > -1;
				}

				function checkLineTypeOfBoQ(boqItem, result, value){
					if (boqItem && !isItemOrSurcharge(boqItem)) {
						value = null;
						let translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}
				}

				// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
				function checkSubQuantityOfBoQ(boqItem, result){
					if (boqItem && boqItem.Id && boqItem.BoqLineTypeFk === 0) {
						if (_.isArray(boqItem.BoqItems) && boqItem.BoqItems.length > 0) {
							let crbChildren = _.filter(boqItem.BoqItems, {'BoqLineTypeFk': 11});
							if (crbChildren && crbChildren.length) {
								let translation = estimateMainTranslationService.getTranslationInformation('subQuantityBoQItemsErrormsg');
								result.valid = false;
								result.error = $translate.instant(translation.location + '.' + translation.identifier);
							}
						}
					}
				}

				function checkBoqSplitQuantityFk(result){
					let translationSplitQuantity = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExist');
					result.valid = false;
					result.apply = false;
					result.error = $translate.instant(translationSplitQuantity.location + '.' + translationSplitQuantity.identifier);
					let translationHeader = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExistHeaderInfo');
					let headerMessage = $translate.instant(translationHeader.location + '.' + translationHeader.identifier);
					platformModalService.showMsgBox(result.error, headerMessage, 'info');
				}

				function asyncValidateBoqItemFkForBulkConfig(entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);

					let result = {apply: true, valid: true, error: ''};
					let boqPromise = null;
					if (entity.BoqSplitQuantityFk !== null && entity.BoqItemFk !== value) {
						entity.BoqHeaderFk = entity.OldBoqHeaderFk;
						checkBoqSplitQuantityFk(result);
						asyncMarker.myPromise = $q.when().then(function () {
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateMainService);
						});
						return asyncMarker.myPromise;
					}

					if (value === 0) {
						value = null;
					}

					let item = $injector.get('estimateMainBoqItemService').getItemById(value);

					checkLineTypeOfBoQ(item, result, value);
					checkSubQuantityOfBoQ(item, result);

					if (item && item.Id) {
						let boqHeaderList = $injector.get('estimateMainBoqService').getBoqHeaderEntities();
						let boqHeader = _.find(boqHeaderList, {'Id': item.BoqHeaderFk});
						if (boqHeader) {
							entity.IsGc = boqHeader.IsGCBoq;
						}

						let readData = {
							'EstHeaderFk': entity.EstHeaderFk,
							'EstLineItemFk': entity.Id
						};
						readData.Data = [];
						readData.Data.push({EstHeaderFk: entity.EstHeaderFk, EstLineItemFk: entity.Id});
						asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/listbyselection', readData).then(function (response) {
							return updateByEstConfigSorting(result, boqPromise, entity, value, model, item, $injector.get('estimateMainParamStructureConstant').BoQs, response.data);
						});
						return asyncMarker.myPromise;
					} else {
						entity.IsGc = false;
						entity.GrandTotal = entity.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(entity) ? 0 : entity.CostTotal + entity.MarkupCostTotal + entity.Allowance;
						return resolveResourceByIsGCChanging(result, entity, value, model);
					}
				}

				function validateBoqItemFkForBulkConfig(entity, value, model) {
					let item = $injector.get('estimateMainBoqItemService').getItemById(value);
					let result = {apply: true, valid: true, error: ''};
					checkSubQuantityOfBoQ(item, result);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainService);
				}

				function asyncValidateBoqItemFk(entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);

					let item = $injector.get('estimateMainBoqItemService').getItemById(value);

					let result = {apply: true, valid: true, error: ''};
					let boqPromise = null;

					if (entity.BoqSplitQuantityFk !== null && entity.BoqItemFk !== value) {
						entity.BoqHeaderFk = entity.OldBoqHeaderFk;
						checkBoqSplitQuantityFk(result);
						asyncMarker.myPromise = $q.when().then(function () {
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateMainService);
						});
						return asyncMarker.myPromise;
					}

					if (value === 0) {
						value = null;
					}

					if (item && item.Id) {
						let estimateMainBoqService = $injector.get('estimateMainBoqService');
						let boqHeaderList = estimateMainBoqService.getBoqHeaderEntities();
						let boqHeader = _.find(boqHeaderList, {'Id': item.BoqHeaderFk});
						if (boqHeader) {
							entity.IsGc = boqHeader.IsGCBoq;
						}

						entity.IsOptional = entity.IsGc ? false : estimateMainBoqService.IsLineItemOptional(item);
						entity.IsOptionalIT = entity.IsGc ? false : estimateMainBoqService.IsLineItemOptionalIt(item);
						entity.IsDaywork = entity.IsGc ? false : item.IsDaywork;

						let readData = {
							'EstHeaderFk': entity.EstHeaderFk,
							'EstLineItemFk': entity.Id
						};
						readData.Data = [];
						readData.Data.push({EstHeaderFk: entity.EstHeaderFk, EstLineItemFk: entity.Id});

						if (item.BoqLineTypeFk === 11 && [1, 4, 6, 7].includes(entity.EstQtyRelBoqFk)){
							let output = [];
							let data = _.map($injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemFk'),function (item) {
								return item;
							});
							$injector.get('cloudCommonGridService').flatten(data, output, 'BoqItems');
							let parentBoqItem = _.find(output, {'Id': item.BoqItemFk});
							if(parentBoqItem){
								item.BasUomFk = parentBoqItem.BasUomFk;
							}
						}

						asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/listbyselection', readData).then(function (response) {
							return updateByEstConfigSorting(result, boqPromise, entity, value, model, item, $injector.get('estimateMainParamStructureConstant').BoQs, response.data);
						});
						return asyncMarker.myPromise;
					} else {
						entity.IsGc = false;
						entity.GrandTotal = entity.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(entity) ? 0 : entity.CostTotal + entity.MarkupCostTotal + entity.Allowance;
						return resolveResourceByIsGCChanging(result, entity, value, model);
					}
				}

				function resolveResourceByIsGCChanging(result, entity) {
					let resourceList = [];
					resourceList = !resourceList || !resourceList.length ? $injector.get('estimateMainResourceService').getList() : resourceList;
					let lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {
						EstLineItemFk: entity.Id,
						EstHeaderFk: entity.EstHeaderFk
					}) : [];
					let projectId = estimateMainService.getProjectId();

					if (lineItemResources.length === 0) {
						let url = $http.post(globals.webApiBaseUrl + 'estimate/main/resource/resolveResourceByIsGCChanging?' + 'lineItemId=' + entity.Id + '&headerId=' + entity.EstHeaderFk + '&isGc=' + entity.IsGc + '&projectId=' + projectId);
						return $q.when(url).then(function (response) {
							setIsIndirectCostAndRecalculate(entity, response.data);
							$injector.get('estimateMainDynamicUserDefinedColumnService').setReAttachDataToResource(true);
							return $q.when(true);
						});

					} else {
						setIsIndirectCostAndRecalculate(entity, lineItemResources);
						return $q.when(true);
					}
				}

				function asyncValidatePsdActivityFk(entity, value, model) {
					let response = $injector.get('estimateMainActivityLookupService').getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = reactOnLeadingStructure(entity, value, model, item, $injector.get('estimateMainParamStructureConstant').ActivitySchedule);
					let isReadOnly = !!entity.IsDurationQuantityActivity;

					$injector.get('estimateMainLineItemProcessor').processIsDurationQuantityActivity(isReadOnly, entity);

					if (isReadOnly) {
						let estimateMainActivityHandlerService = $injector.get('estimateMainActivityHandlerService');
						return estimateMainActivityHandlerService.handleActivityAssignmentForLineItems(entity, value, model);
					}
					return result;
				}

				function reactOnLeadingStructure(entity, value, model, item, structureConstant) {
					let result = {apply: true, valid: true, error: ''};
					let structurePromise = null;
					if (value === 0) {
						value = null;
					}
					if (item && item.Id) {
						return updateByEstConfigSorting(result, structurePromise, entity, value, model, item, structureConstant, null);
					} else {
						return $q.when(true);
					}
				}

				function asyncValidatePrjLocationFk(entity, value, model) {
					let response = $injector.get('estimateMainLocationLookupService').getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					return reactOnLeadingStructure(entity, value, model, item, $injector.get('estimateMainParamStructureConstant').Location);
				}

				function asyncValidateMdcControllingUnitFk(entity, value, model) {
					if (value) {
						return $injector.get('estimateMainControllingService').getControllingUnitById(value).then(function (controllingUnit) {
							if (controllingUnit) {
								let item = controllingUnit;
								let result = {apply: true, valid: true, error: ''};
								let controllingPromise = null;
								if (item && item.Id) {
									return updateByEstConfigSorting(result, controllingPromise, entity, value, model, item, $injector.get('estimateMainParamStructureConstant').Controllingunits, null);
								}
							}
						});
					} else {
						return $q.when(true);
					}
				}

				function validateBoqItemFk(entity, value, model) {
					let item = $injector.get('estimateMainBoqItemService').getItemById(value);
					let result = {apply: true, valid: true, error: ''};

					if(entity && item){
						entity.IsDaywork = item.IsDaywork;
					}else {
						entity.IsDaywork = false;
					}
					if (value === 0 || value === null) {
						value = null;
						entity.BoqItemFk = null;
						entity.BoqHeaderFk = null;
					}

					checkLineTypeOfBoQ(item, result, value);
					checkSubQuantityOfBoQ(item, result);

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainService);
					return result;
				}

				function validateWicBoqItemFk(entity, value, model) {
					let response = $injector.get('boqWicItemService').getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = {apply: true, valid: true, error: ''};

					if (value === 0 || value === null) {
						value = null;
						entity.BoqWicCatFk = null;
						entity.WicBoqHeaderFk = null;
					}

					checkLineTypeOfBoQ(item, result, value);
					checkSubQuantityOfBoQ(item, result);

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainService);
					return result;
				}

				function validateOptionalFields(field) {
					if (field !== 'FromDate' && field !== 'ToDate') {
						service['validate' + field] = function () {
							return validationResult;
						};
					}
					service['asyncValidate' + field] = generateAsyncValidation(field);
				}

				function validateSortCodeFk( entity, value, model ) {
					 switch (model){
						case 'SortCode01Fk':
							entity.SortDesc01Fk = value;
							break;
						case 'SortCode02Fk':
							entity.SortDesc02Fk = value;
							break;
						case 'SortCode03Fk':
							entity.SortDesc03Fk = value;
							break;
						case 'SortCode04Fk':
							entity.SortDesc04Fk = value;
							break;
						case 'SortCode05Fk':
							entity.SortDesc05Fk = value;
							break;
						case 'SortCode06Fk':
							entity.SortDesc06Fk = value;
							break;
						case 'SortCode07Fk':
							entity.SortDesc07Fk = value;
							break;
						case 'SortCode08Fk':
							entity.SortDesc08Fk = value;
							break;
						case 'SortCode09Fk':
							entity.SortDesc09Fk = value;
							break;
						case 'SortCode10Fk':
							entity.SortDesc10Fk = value;
							break;
					}

					return true;
				}

				function validateSortDescFk(entity, value, model) {
					switch (model) {
						case 'SortDesc01Fk':
							entity.SortCode01Fk = value;
							break;
						case 'SortDesc02Fk':
							entity.SortCode02Fk = value;
							break;
						case 'SortDesc03Fk':
							entity.SortCode03Fk = value;
							break;
						case 'SortDesc04Fk':
							entity.SortCode04Fk = value;
							break;
						case 'SortDesc05Fk':
							entity.SortCode05Fk = value;
							break;
						case 'SortDesc06Fk':
							entity.SortCode06Fk = value;
							break;
						case 'SortDesc07Fk':
							entity.SortCode07Fk = value;
							break;
						case 'SortDesc08Fk':
							entity.SortCode08Fk = value;
							break;
						case 'SortDesc09Fk':
							entity.SortCode09Fk = value;
							break;
						case 'SortDesc10Fk':
							entity.SortCode10Fk = value;
							break;
					}
					return {valid: true};
				}

				function validateLineItemsUniqueCode(lineItemsToDelete) {
					let model = 'Code';
					let lineItemsWithErrors = [];

					_.forEach(estimateMainService.getList(), function (item) { // platformRuntimeDataService.hasError(item, model) &&
						if (_.map(lineItemsToDelete, 'Id').indexOf(item.Id) === -1) {
							if (platformRuntimeDataService.hasError(item, model) && _.map(lineItemsWithErrors, model).indexOf(item[model]) === -1) {
								lineItemsWithErrors.push(item);
							}
						}
					});

					setTimeout(function () {
						estimateMainService.markEntitiesAsModified(lineItemsWithErrors);
					}, 50);

					_.forEach(lineItemsWithErrors, function (item) {
						platformDataValidationService.finishValidation(true, item, item[model], model, service, estimateMainService);
						platformRuntimeDataService.applyValidationResult(true, item, model);
					});
				}

				function asyncValidateBoqSplitQuantityFk(entity, value, model) {
					let basicsBoqSplitQuantityLookupDataService = $injector.get('basicsBoqSplitQuantityLookupDataService');
					return basicsBoqSplitQuantityLookupDataService.getItemByIdAsync(value, {dataServiceName: 'basicsBoqSplitQuantityLookupDataService'}).then(function (item) {
						let result = {apply: true, valid: true, error: ''};
						let boqSplitQuantityPromise = null;
						if (value === 0) {
							value = null;
						}
						if (item && item.Id) {
							item.IsBoqSplitQuantity = true;
							return updateByEstConfigSorting(result, boqSplitQuantityPromise, entity, value, model, item, $injector.get('estimateMainParamStructureConstant').BoQs, null);
						} else {
							return $q.when(true);
						}
					});
				}

				function updateQuantityUomEstConfigSorting(entity, item, structureFk, mdlObjects) {
					let estConfigData = estimateMainService.getEstiamteReadData();

					if (estConfigData.EstStructureDetails && estConfigData.EstStructureDetails.length >= 1) {
						let sourceStructureItem;
						if (structureFk === 17 || structureFk === 18) {
							sourceStructureItem = _.find(estConfigData.EstStructureDetails, {Code: item.Code});
						} else {
							sourceStructureItem = _.find(estConfigData.EstStructureDetails, {EstStructureFk: structureFk});
						}

						let lessSortingStructureItems;

						if (sourceStructureItem) {
							lessSortingStructureItems = _.filter(estConfigData.EstStructureDetails, function (item) {
								if (item.Sorting < sourceStructureItem.Sorting) {
									return item;
								}
							});
							getLeadingStructureBasedOnSort(entity, item, structureFk, lessSortingStructureItems, mdlObjects);
						} else {
							lessSortingStructureItems = estConfigData.EstStructureDetails;
							getLeadingStructureBasedOnSort(entity, item, structureFk, lessSortingStructureItems, mdlObjects);
						}
					} else {
						let qtyRel = 'AotRel';
						// eslint-disable-next-line no-prototype-builtins
						if (item.hasOwnProperty('BoqLineTypeFk') || item.hasOwnProperty('IsBoqSplitQuantity')) {
							qtyRel = 'BoqRel';
						}
						// eslint-disable-next-line no-prototype-builtins
						else if (item.hasOwnProperty('ActivityTypeFk')) {
							qtyRel = 'ActRel';
						}
						// eslint-disable-next-line no-prototype-builtins
						else if (item.hasOwnProperty('ControllingunitFk')) {
							qtyRel = 'GtuRel';
						}
						updateQuantities(entity, item, qtyRel);
						// defer.resolve();
					}
				}

				function getLeadingStructureBasedOnSort(entity, item, structureFk, lessSortingStructureItems, mdlObjects) {
					let estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');
					let sourceItemFk;
					let asyncMarker = {};

					switch (structureFk) {
						case estimateMainParamStructureConstant.BoQs:
							asyncMarker = platformDataValidationService.registerAsyncCall(entity, item.Id, 'BoqItemFk', estimateMainService);
							if (entity.BoqSplitQuantityFk !== null && entity.BoqItemFk !== item.Id) {
								let result = {apply: true, valid: true, error: ''};
								checkBoqSplitQuantityFk(result);
								result.valid = true;
								asyncMarker.myPromise = $q.when().then(function () {
									return platformDataValidationService.finishAsyncValidation(result, entity, item.Id, 'BoqItemFk', asyncMarker, service, estimateMainService);
								});
								return asyncMarker.myPromise;
							}

							entity.BoqItemFk = item.Id;

							// eslint-disable-next-line no-prototype-builtins
							if (!item.hasOwnProperty('BoqLineTypeFk') && !item.hasOwnProperty('IsBoqSplitQuantity')) {
								// defer.resolve();
								break;
							}
							if (mdlObjects && mdlObjects.length > 0) {
								let quantityUpdated = false;
								let result = {apply: true, valid: true, error: ''};
								_.forEach(mdlObjects, function (mdlObject) {
									if (mdlObject.Quantity && mdlObject.QuantityTarget && mdlObject.WqQuantityTarget) {
										quantityUpdated = true;
									}
								});
								if (quantityUpdated) {
									return platformDataValidationService.finishAsyncValidation(result, entity, item.Id, 'BoqItemFk', asyncMarker, service, estimateMainService);
								} else {
									sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
									if (!sourceItemFk) {
										updateQuantities(entity, item, 'BoqRel');
										return platformDataValidationService.finishAsyncValidation(result, entity, item.Id, 'BoqItemFk', asyncMarker, service, estimateMainService);
									}
								}
							} else {
								let result = {apply: true, valid: true, error: ''};
								sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
								if (!sourceItemFk) {
									updateQuantities(entity, item, 'BoqRel');
									return platformDataValidationService.finishAsyncValidation(result, entity, item.Id, 'BoqItemFk', asyncMarker, service, estimateMainService);
								}
							}
							break;
						case estimateMainParamStructureConstant.ActivitySchedule:
							sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
							if (!sourceItemFk) {
								updateQuantities(entity, item, 'ActRel');
							}
							break;
						case estimateMainParamStructureConstant.Location:
							sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
							if (!sourceItemFk) {
								updateQuantities(entity, item, 'AotRel');
							}
							break;
						case estimateMainParamStructureConstant.Controllingunits:
							sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
							if (!sourceItemFk) {
								updateQuantities(entity, item, 'GtuRel');
							}
							// defer.resolve();
							break;
						case estimateMainParamStructureConstant.ProjectCostGroup:
							sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
							if (!sourceItemFk) {
								updateQuantities(entity, item, 'AotRel');
							}
							break;
						case estimateMainParamStructureConstant.EnterpriseCostGroup:
							sourceItemFk = getLessSortingLeadingStructureExist(entity, item, lessSortingStructureItems);
							if (!sourceItemFk) {
								updateQuantities(entity, item, 'AotRel');
							}
							// defer.resolve();
							break;
					}
				}

				function getLessSortingLeadingStructureExist(entity, sourceItem, structureItems) {
					let estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');
					let sourceItemFk;
					let allCostGroupCatalogs = {};
					let enterpriseCostGroupCatalogs = {};

					angular.forEach(structureItems, function (tempStructureItem) {
						if (!sourceItemFk) {
							switch (tempStructureItem.EstStructureFk) {
								case estimateMainParamStructureConstant.BoQs:
									if (entity.BoqItemFk) {
										sourceItemFk = entity.BoqItemFk;
									}
									break;
								case estimateMainParamStructureConstant.ActivitySchedule:
									if (entity.PsdActivityFk) {
										sourceItemFk = entity.PsdActivityFk;
									}
									break;
								case estimateMainParamStructureConstant.Location:
									if (entity.PrjLocationFk) {
										sourceItemFk = entity.PrjLocationFk;
									}
									break;
								case estimateMainParamStructureConstant.Controllingunits:
									if (entity.MdcControllingUnitFk) {
										sourceItemFk = entity.MdcControllingUnitFk;
									}
									break;
								case estimateMainParamStructureConstant.ProjectCostGroup:
									allCostGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
									if (allCostGroupCatalogs && _.size(allCostGroupCatalogs) > 0) {
										let allPrjCostGroupCatalogs = _.filter(allCostGroupCatalogs, function (item) {
											return item.ProjectFk && !item.LineItemContextFk && item.Code === tempStructureItem.Code;
										});
										let lineItemPrjCostGroupCatalogs = _.filter(allPrjCostGroupCatalogs, function (item) {
											return !!entity['costgroup_' + item.Id];
										});
										if (lineItemPrjCostGroupCatalogs.length >= 1) {
											sourceItemFk = lineItemPrjCostGroupCatalogs[0];
										}
									}
									break;
								case estimateMainParamStructureConstant.EnterpriseCostGroup:
									enterpriseCostGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
									if (enterpriseCostGroupCatalogs && _.size(enterpriseCostGroupCatalogs) > 0) {
										let enterpriseCostGroups = _.filter(enterpriseCostGroupCatalogs, function (item) {
											return !item.ProjectFk && item.LineItemContextFk && item.Code === tempStructureItem.Code;
										});
										let entcostGroups = _.filter(enterpriseCostGroups, function (item) {
											return !!entity['costgroup_' + item.Id];
										});
										if (entcostGroups.length >= 1) {
											sourceItemFk = entcostGroups[0];
										}
									}
									break;
							}
						}
					});
					return sourceItemFk;
				}

				function updateQuantities(entity, sourceItem, qtyRel) {
					if (entity.HasSplitQuantities) {
						return;
					}
					let quantity = sourceItem.Quantity || sourceItem.QuantityAdj;
					let uomFk = sourceItem.BasUomFk || sourceItem.UomFk || sourceItem.QuantityUoMFk;
					switch (qtyRel) {
						case 'BoqRel':
							if (entity.EstQtyRelBoqFk === 1 || entity.EstQtyRelBoqFk === 4 || entity.EstQtyRelBoqFk === 6 || entity.EstQtyRelBoqFk === 7) {
								entity.BoqItemFk = sourceItem.Id;
								entity.QuantityTarget = sourceItem.QuantityAdj;
								entity.WqQuantityTarget = sourceItem.Quantity;
								entity.BasUomTargetFk = !sourceItem.IsBoqSplitQuantity ? sourceItem.BasUomFk : entity.BasUomTargetFk;
								entity.BasUomFk = !entity.BasUomFk ? (!sourceItem.IsBoqSplitQuantity ? sourceItem.BasUomFk : entity.BasUomFk) : entity.BasUomFk;
							}
							break;
						case 'ActRel':
							if (entity.EstQtyRelActFk === 1 || entity.EstQtyRelActFk === 4 || entity.EstQtyRelActFk === 6 || entity.EstQtyRelActFk === 7) {
								entity.QuantityTarget = quantity;
								entity.BasUomTargetFk = uomFk;
								entity.WqQuantityTarget = quantity;
								entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
							}
							break;
						case 'GtuRel':
							if (entity.EstQtyRelGtuFk === 1 || entity.EstQtyRelGtuFk === 4 || entity.EstQtyRelGtuFk === 6 || entity.EstQtyRelGtuFk === 7) {
								entity.QuantityTarget = quantity;
								entity.BasUomTargetFk = uomFk;
								entity.WqQuantityTarget = quantity;
								entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
							}
							break;
						case 'AotRel':
							if (entity.EstQtyTelAotFk === 1 || entity.EstQtyTelAotFk === 4 || entity.EstQtyTelAotFk === 6 || entity.EstQtyTelAotFk === 7) {
								entity.QuantityTarget = quantity;
								entity.WqQuantityTarget = quantity;
								// eslint-disable-next-line no-prototype-builtins
								if (!sourceItem.hasOwnProperty('LocationParentFk')) {
									entity.BasUomTargetFk = uomFk;
									entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
								}
								if ((!entity.DescriptionInfo || !entity.DescriptionInfo.Translated) && sourceItem.DescriptionInfo) {
									entity.DescriptionInfo.Translated = sourceItem.DescriptionInfo.Translated;
									entity.DescriptionInfo.Modified = true;
								}
							}
							break;
					}
					entity.BasUomTargetFk = entity.BasUomTargetFk ? entity.BasUomTargetFk : 0;
					entity.BasUomFk = entity.BasUomFk ? entity.BasUomFk : 0;
					$injector.get('estimateMainCommonService').setQuantityByLsumUom(entity, true);
					$injector.get('estimateMainLineItemProcessor').processItem(entity);
				}

				// Validate Est.Configuration Detail
				function validateConfDetail() {
					return true;
				}

				function asyncValidateConfDetail() {
					return $q.when(true);
				}

				// Validate CostGroup Catalogs - LicCostGroupCatalog
				function validateLicCostGroupCatalog() {
					// Logic here
					return true;
				}

				function asyncValidateLicCostGroupCatalog() {
					// Logic here
					let defer = $q.defer();
					defer.resolve(true);
					return defer.promise;
				}

				/**
				 * asyncValidateIsDurationQuantityActivity - Validate if the line item is a duration quantity activity and handle the activity assignment
				 */
				function asyncValidateIsDurationQuantityActivity(entity, value, model) {
					$injector.get('estimateMainLineItemProcessor').processIsDurationQuantityActivity(value, entity);

					if (entity.PsdActivityFk && value) {
						return $injector.get('estimateMainActivityHandlerService')
							.handleActivityAssignmentForLineItems(entity, value, model);
					}
					return $q.when();
				}
			}
		]);
})();
