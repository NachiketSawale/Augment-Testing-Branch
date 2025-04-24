/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc service
	 * @name controllingStructureValidationService
	 * @description provides validation methods for controlling structure instances
	 */
	angular.module('controlling.structure').factory('controllingStructureValidationService',
		['_', '$q', 'globals', 'moment', '$injector', '$http', '$translate', 'platformDataValidationService', 'controllingStructureMainService',
			'platformRuntimeDataService', 'platformPropertyChangedUtil', 'basicsLookupdataLookupDescriptorService',
			function (_, $q, globals, moment, $injector, $http, $translate, platformDataValidationService, controllingStructureMainService,
				platformRuntimeDataService, platformPropertyChangedUtil, basicsLookupdataLookupDescriptorService) {

				var service = {},
					self = this;

				service.validateCode = function (entity, newCode) {
					var fieldErrorTr = { fieldName: $translate.instant('cloud.common.entityCode') };
					var result = platformDataValidationService.isMandatory(newCode, 'Code', fieldErrorTr);
					if (!result.valid) {
						return platformDataValidationService.finishValidation(result, entity, newCode, 'Code', service, controllingStructureMainService);
					}

					var item = _.find(controllingStructureMainService.getList(), function (item) {
						return _.get(item, 'Code') === newCode && item.Id !== entity.Id;
					});

					var res = item ? platformDataValidationService.createErrorObject('controlling.structure.errorCodeMustBeUniquePrjContext') : platformDataValidationService.createSuccessObject();

					return platformDataValidationService.finishValidation(res, entity, newCode, 'Code', service, controllingStructureMainService);
				};

				service.asyncValidateCode = function (entity, modelValue, field) {
					var asyncMarker = {};
					var projectId = entity.ProjectFk || -1,
						code = modelValue,
						url = globals.webApiBaseUrl + 'controlling/structure/isuniquecodeprjcontext?code=' + code + '&projectId=' + projectId;

					var finishAsyncValidationHelper = function (apply, valid) {
						return platformDataValidationService.finishAsyncValidation({
							apply: apply,
							valid: valid,
							error$tr$: 'controlling.structure.errorCodeMustBeUniquePrjContext'
						}, entity,
						modelValue, field, asyncMarker, self, controllingStructureMainService);
					};

					asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, code, controllingStructureMainService);
					asyncMarker.myPromise = $http.get(url).then(function (result) {
						return finishAsyncValidationHelper(true, result.data);
					},
					function () {
						return finishAsyncValidationHelper(false, false);
					});

					return asyncMarker.myPromise;
				};

				service.validateQuantity = function validateQuantity(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};

				service.validateUomFk = function validateUomFk(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};

				service.validatePlannedStart = function (entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.PlannedEnd, entity, model, self, controllingStructureMainService, 'PlannedEnd');
				};
				service.validatePlannedEnd = function (entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.PlannedStart, value, entity, model, self, controllingStructureMainService, 'PlannedStart');
				};

				service.asyncValidatePlannedStart = function (entity, value, model) {
					// setting up the new planned start date to entity
					entity.PlannedStart = value;
					var promise = $injector.get('controllingStructurePlannedAttributesService').calculateAllPlannedAttributes('plannedstart', entity).then(function () {
						platformDataValidationService.cleanUpAsyncMarkerByModuleName(asyncMarker, moduleName);
					});
					var asyncMarker = platformDataValidationService.registerAsyncCallByModuleName(entity, model, value, moduleName, promise);
					return asyncMarker.myPromise;
				};

				service.asyncValidatePlannedEnd = function (entity, value, model) {
					entity.PlannedEnd = value;
					var promise = $injector.get('controllingStructurePlannedAttributesService').calculateAllPlannedAttributes('plannedend', entity).then(function () {
						platformDataValidationService.cleanUpAsyncMarkerByModuleName(asyncMarker, moduleName);
					});
					var asyncMarker = platformDataValidationService.registerAsyncCallByModuleName(entity, model, value, moduleName, promise);

					return asyncMarker.myPromise;
				};

				service.validatePlannedDuration = function (entity, newPlannedDuration) {
					if (newPlannedDuration < 0) {
						return {
							apply: true,
							valid: false,
							error$tr$: 'controlling.structure.durationValidation'
						};
					}
					// setting up the new planned end date to entity
					entity.PlannedDuration = newPlannedDuration;
					// setting up planned start and end date
					$injector.get('controllingStructurePlannedAttributesService').calculateAllPlannedAttributes('plannedduration', entity);// TODO: #134943 - see above
					return true;
				};

				/**
				 * Validates and updates the stock foreign key (StockFk) for a given entity.
				 * If a new stock foreign key is provided, it updates the ControllingUnitFk of the corresponding stock.
				 * If no new stock foreign key is provided, it resets the ControllingUnitFk of the current stock.
				 *
				 * @param {Object} entity - The entity object containing stock information.
				 * @param {number} newStockFk - The new stock foreign key to be validated and updated.
				 */
				service.validateStockFk = function validateStockFk(entity, newStockFk) {
					const projectStockView = basicsLookupdataLookupDescriptorService.getData('projectStockLookupDataService');
					if (!projectStockView || _.isEmpty(projectStockView))
					{
						entity.ProjectStock = null;
						return;
					}

					let projectStock = null;
					if(newStockFk) {
						if(projectStockView[newStockFk] && !projectStockView[newStockFk].ControllingUnitFk){
							projectStock = projectStockView[newStockFk];
							projectStock.ControllingUnitFk = entity.Id;
						}
					}else{
						if(projectStockView[entity.StockFk] && projectStockView[entity.StockFk].ControllingUnitFk === entity.Id){
							projectStock = projectStockView[entity.StockFk];
							projectStock.ControllingUnitFk = null;
						}
					}

					entity.ProjectStock = projectStock;
				};

				service.validateIsStockmanagement = function (curUnit, IsStockmanagement) {
					// show lookups only when corresponing flag is set to true (#82834)
					platformRuntimeDataService.readonly(curUnit, [{field: 'StockFk', readonly: !IsStockmanagement}]);

					if (!IsStockmanagement) {
						service.validateStockFk(curUnit, null);
						curUnit.StockFk = null;
					}
				};

				service.validateIsPlantmanagement = function (curUnit, IsPlantmanagement) {
					// show lookups only when corresponing flag is set to true (#82834)
					platformRuntimeDataService.readonly(curUnit, [{field: 'EtmPlantFk', readonly: !IsPlantmanagement}]);

					if (!IsPlantmanagement) {
						curUnit.EtmPlantFk = null;
					}
				};

				// create ["Assignment01", "Assignment02", ... "Assignment10"]
				var assignmentFields = _.map(_.range(1, 11), function (i) {return 'Assignment' + _.padStart(i, 2, 0);});
				_.each(assignmentFields, function (assignmentField) {

					service['validate' + assignmentField] = function (curUnit, assignmentValue) {
						var assignmentsService = $injector.get('controllingStructureDynamicAssignmentsService');
						assignmentsService.validateAssignment(assignmentField, assignmentValue, curUnit);
					};
				});

				service.validateIsFixedBudget = function (entity, value) {
					$injector.get('controllingStructureReadonlyProcessor').processItemBudget(entity, value);
					if(value !== null) {
						entity.IsFixedBudget = value;
						controllingStructureMainService.calculateBudget(entity);
						controllingStructureMainService.gridRefresh();
						return platformDataValidationService.finishValidation(true, entity, value, 'IsFixedBudget', service, controllingStructureMainService);
					}
				};

				service.validateBudget = function (entity, value) {
					var result = platformDataValidationService.isEmptyProp(value);
					if (!result) {
						// calculate budget difference of the entity
						// calculate budget of all parents
						entity.Budget = value;
						controllingStructureMainService.calculateBudget(entity);
						controllingStructureMainService.gridRefresh();
						return platformDataValidationService.finishValidation(!result, entity, value, 'Budget', service, controllingStructureMainService);
					} else {
						return !result;
					}
				};

				service.validateEstimateCost = function (entity, value) {
					var result = platformDataValidationService.isEmptyProp(value);
					if (!result) {
						entity.EstimateCost = value;
						// calculate estimateCost of all parents
						controllingStructureMainService.calculateEstimateCost(entity);
						controllingStructureMainService.calculateBudget(entity);
						controllingStructureMainService.gridRefresh();
						return platformDataValidationService.finishValidation(!result, entity, value, 'EstimateCost', service, controllingStructureMainService);
					} else {
						return !result;
					}
				};

				service.validateIsPlanningElement = function (entity, value) {
					$injector.get('controllingStructureReadonlyProcessor').processPlanningElement(entity, value);
				};

				service.validateIsDefault = function validateIsDefault(entity, value, field) {
					platformPropertyChangedUtil.onlyOneIsTrue(controllingStructureMainService, entity, value, field);
					return {apply: value, valid: true};
				};

				return service;
			}]);

})(angular);
