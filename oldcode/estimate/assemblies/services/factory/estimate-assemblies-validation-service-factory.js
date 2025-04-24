/**
 * Created by lnt on 31.08.2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesValidationServiceFactory
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('estimateAssembliesValidationServiceFactory', [
		'$http', '$q', '$translate', '$timeout', 'platformDataValidationService',
		'$injector', 'platformRuntimeDataService',
		'estimateAssembliesRuleService','estimateAssembliesRuleUpdateService', '_', 'estimateParamUpdateService', 'estimateCommonAssemblyType',
		function ($http, $q, $translate, $timeout, platformDataValidationService,
			$injector, platformRuntimeDataService,
			estimateRuleService,estimateAssembliesRuleUpdateService, _, estimateParamUpdateService, estimateCommonAssemblyType) {

			let factoryService = {};

			factoryService.createEstAssembliesValidationService = function createEstAssembliesValidationService(estimateAssembliesService, ignoreRuleParamPopupWin) {
				let service = {};
				let mainItemName = 'EstLineItems';

				service.validateCode = function validateCode(entity, value, field) {
					let fieldErrorTr = {fieldName: $translate.instant('cloud.common.entityCode')};
					let res;
					if (platformDataValidationService.isEmptyProp(value)) {
						res = platformDataValidationService.isMandatory(value, field, fieldErrorTr);
						return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateAssembliesService);
					}

					// if can find same code in the page data, return false validation
					let assemblies = estimateAssembliesService.getList();
					let distAssemblies = _.filter(assemblies, function (item) {
						if (item.EstAssemblyCatFk === entity.EstAssemblyCatFk) {
							return true;
						}
					});
					if (distAssemblies && distAssemblies.length > 0) {
						fieldErrorTr = {object: $translate.instant('cloud.common.entityCode')};
						res = platformDataValidationService.isValueUnique(distAssemblies, field, value, entity.Id, fieldErrorTr);
						return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateAssembliesService);
					}

					res = platformDataValidationService.isMandatory(value, field, fieldErrorTr);
					return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateAssembliesService);
					// return platformDataValidationService.validateMandatory(value, field);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateAssembliesService);
					// Now the data service knows there is an outstanding asynchronous request.

					let postData = {
						Id: entity.Id,
						estHeaderFk: entity.EstHeaderFk,
						Code: value,
						EstAssemblyCatFk: entity.EstAssemblyCatFk
					};// Call data prepared

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/assemblies/isuniquecode', postData).then(function (response) {
						// Interprete result.
						let res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.assemblies.errors.uniqCode';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateAssembliesService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				let originalEstAssemblyCatFk = null;
				service.validateEstAssemblyCatFk = function (entity, value, field) {
					// AssemblyCatFk is cleared
					if (value === null) {
						return true;
					}

					// Validation will keep updating the entity assembly category fk, so I keep the original catFk in this variable
					if (!platformRuntimeDataService.hasError(entity, field)) {
						originalEstAssemblyCatFk = entity[field];
					}

					return platformDataValidationService.finishValidation(true, entity, value, field, service, estimateAssembliesService);
				};

				service.asyncValidateEstAssemblyCatFk = function (entity, value, field) {
					let estimateAssembliesResourceService = $injector.get('estimateAssembliesResourceService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, entity[field], field, estimateAssembliesService);

					let postData = {
						Id: value,
						IdBefore: originalEstAssemblyCatFk,
						HasAssemblyResources: !_.isEmpty(estimateAssembliesResourceService.getList())
					};

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/assemblies/isvalidassemblycat', postData).then(function (response) {
						let res = platformDataValidationService.createErrorObject(moduleName + '.errors.assemblyTypeError');
						res.valid = response.data;

						platformDataValidationService.finishAsyncValidation(res, entity, entity[field], field, asyncMarker, service, estimateAssembliesService);

						// If category is valid, next we validate unique code
						if (res.valid) {
							// Validate Assembly 'Code' unique code
							let postCodeData = {
								Id: entity.Id,
								estHeaderFk: entity.EstHeaderFk,
								Code: entity.Code,
								EstAssemblyCatFk: value
							};// Call data prepared
							return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/isuniquecode', postCodeData).then(function (response) {
								let fieldCode = 'Code';
								let resCode = platformDataValidationService.createErrorObject(moduleName + '.errors.uniqCode');
								resCode.valid = response.data;

								// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
								platformDataValidationService.finishAsyncValidation(resCode, entity, entity[fieldCode], field, asyncMarker, service, estimateAssembliesService);
								platformRuntimeDataService.applyValidationResult(resCode, entity, fieldCode);

								return resCode;
							});
						}

						return res;
					});

					return asyncMarker.myPromise;
				};

				// do not apply the value by the lookup editor, but apply it manually
				service.validateRule = function (entities, value, field) {

					let validateRs = {
						apply: false, // do not apply the value by the lookup editor, but apply it manually
						valid: true,
						error: ''
					};

					let entity = entities;
					if (_.isArray(entities)) {
						entity = entities[0];
					}

					let ruleIds = estimateAssembliesRuleUpdateService.getRuleToSave() || [];
					// do not apply the value by the lookup editor, but apply it manually
					for (let i = 0; i < ruleIds.lenth; ++i) {
						$injector.get('estimateAssembliesMdcRuleRelationCommonService').fns.manipulateRuleLookupEditorValueApply(entity, ruleIds[i], field);
					}

					let creationData = {
						estHeaderFk: entity.EstHeaderFk,
						ruleIds: ruleIds,
						mainItemName: mainItemName,
						mainItemId: entity.Id
					};

					!ignoreRuleParamPopupWin && $http.post(globals.webApiBaseUrl + 'estimate/assemblies/getFormulaParameterEntities', creationData).then(
						function (response) {
							let result = {};
							let containerData = estimateAssembliesService.getContainerData();
							result.FormulaParameterEntities = response.data;

							let includeUserForm = !!_.find(entity.RuleAssignment, function (item) {
								return !!item.FormFk;
							});
							if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm) {
								result.containerData = containerData;
								result.EstHeaderId = entity.EstHeaderFk;
								result.entity = entity;
								result.MainItemName = containerData.itemName;
								result.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, entity, 'estimateAssembliesService');
								let estimateAssembliesCopyParameterService = $injector.get('estimateAssembliesCopyParameterService');
								estimateAssembliesCopyParameterService.init(entities, result.FormulaParameterEntities, mainItemName);

								let paramDialogServiceNew = $injector.get('estimateAssembliesDetailsParamDialogService');
								paramDialogServiceNew.showDialog(result, estimateAssembliesService.getDetailsParamReminder());
							}
						}
					);

					return validateRs;
				};

				service.validateQuantityDetail = function validateQuantityDetail(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateQuantityTargetDetail = function validateQuantityTargetDetail(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateQuantityFactorDetail1 = function validateQuantityFactorDetail1(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateQuantityFactorDetail2 = function validateQuantityFactorDetail2(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateProductivityFactorDetail = function validateProductivityFactorDetail(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateCostFactorDetail1 = function validateCostFactorDetail1(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.validateCostFactorDetail2 = function validateCostFactorDetail2(entity, value, field) {
					return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateAssembliesService, true);
				};

				service.asyncValidateBasUomFk = function asyncValidateBasUomFk(entity, value, field, source, isBulkEditor) {
					if (entity.MdcCostCodeFk || entity.MdcMaterialFk) {
						let isCostCodeFieldAssigned = entity.MdcCostCodeFk !== null;
						let lookupItemId = isCostCodeFieldAssigned ? entity.MdcCostCodeFk : entity.MdcMaterialFk;
						return asyncWarningUomConversion(value, lookupItemId, isCostCodeFieldAssigned, isBulkEditor);
					}
					return $q.when(true);
				};

				service.asyncValidateMdcCostCodeFk = function asyncValidateMdcCostCodeFk(entity, value, field, source, isBulkEditor) {
					if (value) {
						return asyncWarningUomConversion(entity.BasUomFk, value, true, isBulkEditor);
					}
					return $q.when(true);
				};

				service.asyncValidateMdcMaterialFk = function asyncValidateMdcMaterialFk(entity, value, field, source, isBulkEditor) {
					if (value) {
						return asyncWarningUomConversion(entity.BasUomFk, value, false, isBulkEditor);
					}
					return $q.when(true);
				};

				function asyncValidateOption(entity, value, field){

					let selectedEntities = estimateAssembliesService.getSelectedEntities();

					if(selectedEntities && _.isArray(selectedEntities)){
						_.forEach(selectedEntities, function(item){
							item[field] = value;
						});
					}

					entity[field] = value;

					let assemblyId = getAssemblyIdWithResLoaded();

					let resourceList = getAssemblyResourceList();

					if(selectedEntities && _.isArray(selectedEntities) && selectedEntities.length > 1) // multi select
					{
						// calculate selected item in client side, other items will calculate in serve side.
						let assemblyWithoutRes = _.filter(selectedEntities, function(item){
							return item.Id !== assemblyId;
						});

						let assemblyWithRes = _.find(selectedEntities, function(item){
							return item.Id === assemblyId;
						});

						let promises = [];

						if(assemblyWithRes){
							const assemblyResourceService = getAssemblyResourceService();
							if (field === 'IsGc') {
								if (assemblyResourceService && getAssemblyResourceList()) {
									assemblyResourceService.setIndirectCost(getAssemblyResourceList(), entity.IsGc);
									_.forEach(getAssemblyResourceList(), function(item){
										assemblyResourceService.fireItemModified(item);
										assemblyResourceService.markItemAsModified(item);
									});
								}
							}
							promises.push($injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function () {
								/* calculate quantity and cost of lineItem and resources */
								const assemblyType = assemblyResourceService && assemblyResourceService.getAssemblyType ? assemblyResourceService.getAssemblyType() : estimateCommonAssemblyType.MasterAssembly;
								$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(assemblyWithRes, resourceList, assemblyType);
								return true;
							}));
						}else{
							promises.push($q.when(false));
						}

						if(assemblyWithoutRes && _.isArray(assemblyWithoutRes) && assemblyWithoutRes.length > 0){
							let postData = {
								LineItemCreationData: {
									SelectedItems: assemblyWithoutRes,
									EstHeaderFk: assemblyWithoutRes[0].EstHeaderFk,
									ChangedField: field
								},
								IsAssembly: true,
							};
							promises.push($http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolvecalculationlineitem', postData));

							getAssemblyResourceService().setDoNotLoadOnSelectionChange(true);
						}else{
							promises.push($q.when(false));
						}

						return $q.all(promises).then(function(response){
							if(response[1]){
								mergeLineItemUpdated(response[1].data);
								refreshResourceContainer();
							}
							return true;
						}, function(){
							getAssemblyResourceService().setDoNotLoadOnSelectionChange(false);
						});
					}else{
						if(entity.Id === assemblyId){
							const assemblyResourceService = getAssemblyResourceService();
							if (field === 'IsGc') {
								if (assemblyResourceService && getAssemblyResourceList()) {
									assemblyResourceService.setIndirectCost(getAssemblyResourceList(), entity.IsGc);
									_.forEach(getAssemblyResourceList(), function(item){
										assemblyResourceService.fireItemModified(item);
										assemblyResourceService.markItemAsModified(item);
									});
								}
							}
							return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function () {
								/* calculate quantity and cost of lineItem and resources */
								const assemblyType = assemblyResourceService && assemblyResourceService.getAssemblyType ? assemblyResourceService.getAssemblyType() : estimateCommonAssemblyType.MasterAssembly;
								$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(entity, resourceList, assemblyType);

								return true;
							});
						}

						let postData = {
							LineItemCreationData: {
								SelectedItems: [entity],
								EstHeaderFk: entity.EstHeaderFk,
								ChangedField: field
							},
							IsAssembly: true
						};

						getAssemblyResourceService().setDoNotLoadOnSelectionChange(true);

						return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolvecalculationlineitem', postData).then(function(response){
							mergeLineItemUpdated(response.data);
							refreshResourceContainer();
							return true;
						}, function(){
							getAssemblyResourceService().setDoNotLoadOnSelectionChange(false);
						});
					}
				}

				function mergeLineItemUpdated(lineItemComposite){
					let lineItemsUpdated = lineItemComposite.lineItemsUpdated || [];
					if(_.isArray(lineItemsUpdated) && lineItemsUpdated.length > 0){
						let assemblies = estimateAssembliesService.getList();
						_.forEach(lineItemsUpdated, function(item){
							let itemToUpdate = _.find(assemblies,{'Id':item.Id});
							if (itemToUpdate){
								angular.extend(itemToUpdate, item);
								estimateAssembliesService.fireItemModified(itemToUpdate);
							}
						});

						// Update recalculated lineitem and resoruce user defined column value
						if(angular.isArray(lineItemComposite.UserDefinedcolsOfLineItemModified)){
							let dynamicUserDefinedColumnService = estimateAssembliesService.getDynamicUserDefinedColumnsService();
							if(dynamicUserDefinedColumnService){
								dynamicUserDefinedColumnService.attachUpdatedValueToColumn(assemblies, lineItemComposite.UserDefinedcolsOfLineItemModified, true);
							}
						}
					}
				}

				function generateOptionAsyncValidation() {
					return function generateAsyncValidation(entity, value, field) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateAssembliesService);
						entity[field] = value;
						asyncMarker.myPromise = asyncValidateOption(entity, value, field).then(function () {
							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation({valid : true}, entity, value, field, asyncMarker, service, estimateAssembliesService);
						});
						return asyncMarker.myPromise;
					};
				}

				service.asyncValidateIsGc = generateOptionAsyncValidation();

				service.asyncValidateIsDisabled = generateOptionAsyncValidation();

				function isPrjAssembly(){
					return $injector.get('platformGridAPI').grids.element('id', '20c0401f80e546e1bf12b97c69949f5b');
				}

				function getAssemblyResourceService(){
					return isPrjAssembly() ? $injector.get('projectAssemblyResourceService') : $injector.get('estimateAssembliesResourceService');
				}

				function getAssemblyResourceList(){
					return getAssemblyResourceService().getList();
				}

				function refreshResourceContainer(){
					let resourceService = getAssemblyResourceService();
					if(resourceService){
						resourceService.setDoNotLoadOnSelectionChange(false);
						if(resourceService.load){
							$timeout(function(){
								resourceService.load();
							}, 10);
						}
					}
				}

				function getAssemblyIdWithResLoaded(){
					let assemblyRes = getAssemblyResourceList();
					if(_.isArray(assemblyRes) && assemblyRes.length >= 1){
						return assemblyRes[0].EstLineItemFk;
					}
					return null;
				}

				service.validateAssemblyItemsUniqueCode = function validateAssemblyItemsUniqueCode(assemblyItemsToDelete) {
					let model = 'Code';
					let assemblyItemsWithErrors = [];

					_.forEach(estimateAssembliesService.getList(), function (item) {
						if (_.map(assemblyItemsToDelete, 'Id').indexOf(item.Id) === -1) {
							if (platformRuntimeDataService.hasError(item, model) && _.map(assemblyItemsWithErrors, model).indexOf(item[model]) === -1) {
								assemblyItemsWithErrors.push(item);
							}
						}
					});

					setTimeout(function () {
						estimateAssembliesService.markEntitiesAsModified(assemblyItemsWithErrors);
					}, 50);

					_.forEach(assemblyItemsWithErrors, function (item) {
						platformDataValidationService.finishValidation(true, item, item[model], model, service, estimateAssembliesService);
						platformRuntimeDataService.applyValidationResult(true, item, model);
					});
				};

				let commonValserv = $injector.get('estimateMainCommonFeaturesService');
				let asyncVal = commonValserv.getAsyncDetailValidation(estimateAssembliesService);
				angular.extend(service, asyncVal);

				function asyncWarningUomConversion(assemblyUomFk, lookUpItemId, isCostCodeField, isBulkEditor) {
					let defer = $q.defer();

					if (isBulkEditor || assemblyUomFk === 0 || assemblyUomFk === null || lookUpItemId === null) {
						// assembly uom is empty
						return $q.when(true);
					}

					let lookupType = isCostCodeField ? 'costcode' : 'MaterialCommodity';
					let uomLookupField = isCostCodeField ? 'UomFk' : 'BasUomFk';
					let uomLookupKey = 'basicsUnitLookupDataService';

					let promises = [
						$injector.get(uomLookupKey).getList({dataServiceName: uomLookupKey}),
						$injector.get('basicsLookupdataLookupDescriptorService').getItemByKey(lookupType, lookUpItemId)
					];

					let showWarningPrompt = function showWarningPrompt(message) {
						let modalOptions = {
							headerTextKey: moduleName + '.assembly',
							bodyTextKey: message,
							showOkButton: true,
							iconClass: 'ico-warning'
						};
						$injector.get('platformModalService').showDialog(modalOptions);
					};

					$q.all(promises).then(function (result) {
						let uomList = result[0], lookupSelectedItem = result[1];
						let uomAssembly = _.find(uomList, {Id: assemblyUomFk});
						let uomLookupItem = _.find(uomList, {Id: lookupSelectedItem[uomLookupField]});

						if (uomAssembly && uomLookupItem) {
							if (uomAssembly.LengthDimension === uomLookupItem.LengthDimension &&
								uomAssembly.TimeDimension === uomLookupItem.TimeDimension &&
								uomAssembly.MassDimension === uomLookupItem.MassDimension) {
								// Valid uom/able to convert
								defer.resolve(true);
							} else {
								// showWarningPrompt('Cannot convert Assembly\'s UoM ' + uomAssembly.Unit + ' to ' + uomLookupItem.Unit);
								showWarningPrompt($translate.instant(moduleName + '.dialog.WarningAssemblyUomAssignConversion', {
									assemblyUoM: uomAssembly.Unit,
									lookupItemUoM: uomLookupItem.Unit
								}));
							}
						}

						// resolve promise
						defer.resolve(true);
					});

					return defer.promise;
				}

				return service;
			};

			return factoryService;
		}

	]);

})();
