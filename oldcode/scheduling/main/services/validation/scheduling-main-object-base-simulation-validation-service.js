/**
 * Created by baf on 26.09.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainObjectBaseSimulationValidationService
	 * @description provides validation methods for relationship instances
	 */
	angular.module('scheduling.main').service('schedulingMainObjectBaseSimulationValidationService', SchedulingMainObjectBaseSimulationValidationService);
	SchedulingMainObjectBaseSimulationValidationService.$inject = ['moment', '_', '$http', '$q', 'globals', 'platformValidationServiceFactory', 'schedulingMainObjectBaseSimulationDataService',
		'schedulingMainConstantValues', 'schedulingMainService', 'platformDataValidationService', 'schedulingMainActivityValidationService',
		'schedulingMainProgressReportValidationService', 'schedulingMainDueDateService', 'schedulingMainProgressReportService', 'schedulingMainLineItemProgressService'];

	function SchedulingMainObjectBaseSimulationValidationService(moment, _, $http, $q, globals, platformValidationServiceFactory, schedulingMainObjectBaseSimulationDataService,
		schedulingMainConstantValues, schedulingMainService, platformDataValidationService, schedulingMainActivityValidationService,
		schedulingMainProgressReportValidationService, schedulingMainDueDateService, schedulingMainProgressReportService, schedulingMainLineItemProgressService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(schedulingMainConstantValues.schemes.objectSimulation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schedulingMainConstantValues.schemes.objectSimulation)
		},
		self,
		schedulingMainObjectBaseSimulationDataService);

		function validDate (value, model){
			let selectedActivity = schedulingMainService.getSelected();
			let res = platformDataValidationService.createSuccessObject();
			if (Date.parse(value) > Date.parse(selectedActivity.PlannedFinish) || Date.parse(value) < Date.parse(selectedActivity.PlannedStart)){
				let message = model === 'PlannedStart' ? 'scheduling.main.modelobject.errorPlannedStart' : 'scheduling.main.modelobject.errorPlannedFinish';
				res = platformDataValidationService.createErrorObject(message,{});
			}
			return res;
		}

		self.validatePlannedStart = function (entity, value, model) {
			let res = platformDataValidationService.createSuccessObject();
			let plannedStart = moment.isMoment(value) ? value : moment.utc(value);
			plannedStart.startOf('day');
			if (!plannedStart.isValid()) {
				res = platformDataValidationService.createErrorObject('scheduling.main.errors.noValidDate',{});
			} else {
				res = validDate(value, model);
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, schedulingMainObjectBaseSimulationDataService);
		};

		self.asyncValidatePlannedStart = function asyncValidatePlannedStart(entity, value, model) {
			let parameter = {
				StartDate: value// Use case: Change of duration will change the planned finnish. Negative duration is not accepted.
			};
			if (entity.PlannedDuration) {
				parameter.Duration = entity.PlannedDuration;
			}
			else if (entity.PlannedFinish) {
				parameter.EndDate = entity.PlannedFinish;
			}
			return calculate(parameter, entity, value, model).then(function (data) {
				if (data.valid) {
					schedulingMainObjectBaseSimulationDataService.takeOver([data.activity2ModelObject]);
					platformDataValidationService.ensureNoRelatedError(entity, model, ['PlannedFinish', 'PlannedDuration'], self, schedulingMainObjectBaseSimulationDataService);
				}
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		self.validatePlannedFinish = function (entity, value, model) {
			let res = platformDataValidationService.createSuccessObject();
			let m = moment.isMoment(value) ? value : moment.utc(value);
			let plannedStart = moment.isMoment(entity.PlannedStart) ? entity.PlannedStart : moment.utc(entity.PlannedStart);
			plannedStart.startOf('day');

			if (!m.isValid()) {
				// return moment.parsingFlags;
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.noValidDate',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}
			if (plannedStart.isValid()) {// Use case: Change of end should shorten or extend duration. Negative duration not possible. Therefore never accept dates before start
				if (m.isBefore(plannedStart)) {
					return platformDataValidationService.finishValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'scheduling.main.errors.finishBeforeStart',
						error$tr$param: {}
					}, entity, value, model, self, schedulingMainService);
				}
			}
			res = validDate(value, model);
			/*
				if (_.isNil(value) && (_.isNil(entity.PlannedDuration) || _.isNil(entity.PlannedStart))){
					res = platformDataValidationService.createErrorObject('scheduling.main.modelobject.errorFieldEmpty',{});
				} else if (_.isNil(value) && !_.isNil(entity.PlannedDuration)) {
					// calculate plannedFinish
				} else {
					res = validDate(value, model);
				}
	*/
			return platformDataValidationService.finishValidation(res, entity, value, model, self, schedulingMainObjectBaseSimulationDataService);
		};

		self.asyncValidatePlannedFinish = function asyncValidatePlannedFinish(entity, value, model) {
			let parameter = {
				EndDate: value// Use case: Change of duration will change the planned finnish. Negative duration is not accepted.
			};
			if (entity.PlannedStart) {
				parameter.StartDate = entity.PlannedStart;
			} else if (entity.PlannedDuration) {
				parameter.Duration = entity.PlannedDuration;
			}
			return calculate(parameter, entity, value, model).then(function (data) {
				if (data.valid) {
					schedulingMainObjectBaseSimulationDataService.takeOver([data.activity2ModelObject]);
					platformDataValidationService.ensureNoRelatedError(entity, model, ['PlannedStart', 'PlannedDuration'], self, schedulingMainObjectBaseSimulationDataService);
				}
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		self.validatePlannedDuration = function (entity, value, model) {
			let res = platformDataValidationService.createSuccessObject();
			let selected = schedulingMainService.getSelected();
			if (_.isNil(value) || value <= 0 || (selected && selected.PlannedDuration < value) ) {
				res.valid = false;
				res.error =  '...';
				res.error$tr$ = 'scheduling.main.modelobject.errorPlannedDuration';
				res.error$tr$param = {};
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, self, schedulingMainObjectBaseSimulationDataService);
		};

		self.asyncValidatePlannedDuration = function asyncValidatePlannedDuration(entity, value, model) {

			let parameter = {
				Duration: value// Use case: Change of duration will change the planned finnish. Negative duration is not accepted.
			};
			if (entity.PlannedStart) {
				parameter.StartDate = entity.PlannedStart;
			} else if (entity.PlannedFinish) {
				parameter.EndDate = entity.PlannedFinish;
			}
			return calculate(parameter, entity, value, model).then(function (data) {
				if (data.valid) {
					schedulingMainObjectBaseSimulationDataService.takeOver([data.activity2ModelObject]);
					platformDataValidationService.ensureNoRelatedError(entity, model, ['PlannedStart', 'PlannedFinish'], self, schedulingMainObjectBaseSimulationDataService);
				}
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		self.validateActualStart = function validateActualStart(entity, value, model) {
			return schedulingMainActivityValidationService.validateActualStart(entity, value, model);
		};

		self.asyncValidateActualStart = function asyncValidateActualStart(entity, value, model) {
			let selected = schedulingMainService.getSelected();
			if (selected) {
				let actualStart = moment.isMoment(value) ? value : moment.utc(value);
				let activityActualStart = moment.isMoment(selected.ActualStart) ? selected.ActualStart : moment.utc(selected.ActualStart);
				if (actualStart.isBefore(activityActualStart)) {
					return schedulingMainActivityValidationService.asyncValidateActualStart(selected, actualStart, model);
				}else {
					return $q.when(true);
				}
			} else {
				return $q.when(true);
			}
		};

		function getAllModelObjectsWithoutId(entity) {
			let allModelObjects = schedulingMainObjectBaseSimulationDataService.getList();
			allModelObjects = _.filter(allModelObjects, function (item) {
				return item.Id !== entity.Id && item.EstLineItemFk === entity.EstLineItemFk && item.EstHeaderFk === entity.EstHeaderFk;
			});
			return allModelObjects;
		}
		function getAllModelObjects(entity) {
			let allModelObjects = schedulingMainObjectBaseSimulationDataService.getList();
			allModelObjects = _.filter(allModelObjects, function (item) {
				return item.EstLineItemFk === entity.EstLineItemFk && item.EstHeaderFk === entity.EstHeaderFk;
			});
			return allModelObjects;
		}
		self.validateActualFinish = function validateActualFinish(entity, value, model) {
			return schedulingMainActivityValidationService.validateActualFinish(entity, value, model);
		};

		self.asyncValidateActualFinish = function asyncValidateActualFinish(entity, value, model) {
			if (value && entity.ActualStart !== null && entity.ActualStart.isValid()) {// Use case: Change of end should shorten or extend duration. Negative duration not possible. Therefore never accept dates before start
				if (value.isBefore(entity.ActualStart)) {
					return $q.when(false);
				}
				let parameter = {
					EndDate: value// Use case: Change of duration will change the planned finnish. Negative duration is not accepted.
				};
				if (entity.ActualStart) {
					parameter.StartDate = entity.ActualStart;
				}
				let newEntity = _.cloneDeep(entity);
				newEntity.PlannedStart = entity.ActualStart;
				newEntity.PlannedFinish = value;
				calculate(parameter, entity, value, model).then(function (data) {
					if (data.valid) {
						entity.ActualDuration = data.activity2ModelObject.PlannedDuration;
					}
				});
			}

			if (value) {
				entity.ActualFinish = value;
				entity.ActualStart = entity.PlannedStart;
				entity.PCo = 100;
				entity.Quantity = entity.PlannedQuantity;
				entity.RemainingQuantity = 0;
				entity.RemainingPCo = 0;
				entity.ExecutionStarted = true;

				return self.asyncValidatePCo(entity, 100, 'PCo');
			} else {
				entity.ActualFinish = null;
				entity.ActualDuration = null;
				return $q.when(true);
			}
		};

		self.validateExecutionStarted = function validateExecutionStarted(entity, value, model) {
			if (!value && entity.ExecutionFinished) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.noValidDate',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}
			return true;
		};

		self.asyncValidateExecutionStarted = function asyncValidateExecutionStarted(entity, value, model) {
			let selected = schedulingMainService.getSelected();
			let allModelObjects = getAllModelObjectsWithoutId(entity);
			let allStarted = allModelObjects.every((item) => { item.ExecutionStarted }) && value;
			if (value) {
				entity.ActualStart = entity.PlannedStart;
			} else {
				entity.ActualStart = null;
			}
			if (selected && (!selected.ExecutionStarted && value|| selected.ExecutionStarted && !allStarted)) {
				return schedulingMainActivityValidationService.asyncValidateExecutionStarted(selected, value, model);
			} else {
				return $q.when(true);
			}
		};

		self.asyncValidateExecutionFinished = function asyncValidateExecutionFinished(entity, value, model) {
			if (value) {
				entity.ActualFinish = entity.PlannedFinish;
				entity.ActualStart = entity.PlannedStart;
				entity.PCo = 100;
				entity.Quantity = entity.PlannedQuantity;
				entity.RemainingQuantity = 0;
				entity.RemainingPCo = 0;
				entity.ExecutionStarted = true;
				entity.ActualDuration = entity.PlannedDuration;
				return self.asyncValidatePCo(entity, 100, 'PCo');
			} else {
				entity.ActualFinish = null;
			}
			return $q.when(true);
		};

		function calculate(parameter, entity, value, fieldsOrModel) {
			let info = {
				Id: entity.Id,
				Activity: schedulingMainService.getSelected(),
				Activity2ModelObject: entity
			};
			angular.extend(info, parameter);
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, fieldsOrModel, schedulingMainObjectBaseSimulationDataService);

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/main/ojectmodelsimulation/calculate', info
			).then(function (response) {
				if (response.data.Valid) {
					return {
						valid: response.data.Valid,
						activity2ModelObject: response.data.Activity2ModelObject,
						apply: true,
					};
				} else {
					return {
						valid: response.data.Valid,
						error: response.data.ValidationMessage,
						activity2ModelObject: response.data.Activity2ModelObject,
						apply: true,
					};
				}
			}, function () {
				platformDataValidationService.finishAsyncValidation({
					valid: false,
					error: 'Unknown issue'
				}, entity, value, fieldsOrModel, asyncMarker, self, schedulingMainObjectBaseSimulationDataService);
				return {valid: false, error: 'Unknown issue', activity2ModelObject: entity};
			});

			return asyncMarker.myPromise;
		}

		self.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			let clone = _.cloneDeep(entity);
			entity.RemainingQuantity = entity.PlannedQuantity - value;
			if (entity.PlannedQuantity > 0) {
				entity.PCo = value * 100 / entity.PlannedQuantity;
				entity.RemainingPCo = 100 - entity.PCo;
			}
			entity.ExecutionStarted = true;
			if (entity.PlannedQuantity  === value) {
				entity.ExecutionFinished = true;
			}

			return doAsyncProgressCall(clone, {PeriodQuantityPerformance: value, RemainingActivityQuantity: entity.PlannedQuantity}, value, model).then(function(){
				entity.PerformanceDate = clone.PerformanceDate;
			});
		};

		self.asyncValidateRemainingQuantity = function asyncValidateRemainingQuantity(entity, value, model) {
			let clone = _.cloneDeep(entity);
			entity.Quantity = entity.PlannedQuantity - value
			entity.ExecutionStarted = true;
			if (entity.PlannedQuantity > 0) {
				entity.PCo = entity.Quantity * 100 / entity.PlannedQuantity;
				entity.RemainingPCo = 100 - entity.PCo;
			} else {
				entity.PCo = 100;
				entity.RemainingPCo = 0;
				entity.ExecutionFinished = true;
			}
			return doAsyncProgressCall(clone, {RemainingActivityQuantity: value}, value, model).then(function(){
				entity.PerformanceDate = clone.PerformanceDate;
			});
		};

		self.asyncValidatePCo = function asyncValidatePCo(entity, value, model) {
			entity.Quantity = entity.PlannedQuantity * value / 100;
			entity.RemainingQuantity = entity.PlannedQuantity - entity.Quantity;
			entity.RemainingPCo = 100 - value;
			entity.ExecutionStarted = true;
			entity.ExecutionFinished = value >= 100;
			return doAsyncProgressCall(entity, {PercentageCompletion: value}, value, model);
		};

		self.asyncValidateRemainingPCo = function asyncValidateRemainingPCo(entity, value, model) {
			let allModelObjects = getAllModelObjectsWithoutId(entity);
			let sumQty = _.sumBy(allModelObjects, function (item) {
				return item.Quantity;
			});
			sumQty += entity.PlannedQuantity * (100 - value) / 100;
			let sumPlannedQty = _.sumBy(getAllModelObjects(entity), function (item) {
				return item.PlannedQuantity;
			});
			if (sumPlannedQty !== 0) {
				let pco = 100 - value;
				entity.PCo = pco;
				entity.Quantity = entity.PlannedQuantity * entity.PCo / 100;
				entity.RemainingQuantity = entity.PlannedQuantity - entity.Quantity;
				entity.ExecutionStarted = true;
				entity.ExecutionFinished = pco >= 100;

				return doAsyncProgressCall(entity, {PercentageCompletion: pco}, value, model);
			} else {
				return $q.when(true);
			}
		};

		function provideAsyncProgressCallParameterObject(entity) {
			return {
				Id: entity.Id,
				DueDate: schedulingMainDueDateService.getPerformanceDueDateAsString(),
				ProgressDescription: schedulingMainDueDateService.getPerformanceDescription()
			};
		}

		function doAsyncProgressCall(entity, purpose, value, model) {
			if (!schedulingMainDueDateService.hasDueDate()) {
				schedulingMainDueDateService.setPerformanceDueDate(moment());
			}

			let parameter = provideAsyncProgressCallParameterObject(entity);
			angular.extend(parameter, purpose);

			return calculateLineItems(parameter, entity, value, model).then(function (data) {
				if (data.activity.ProgressReportsToSave){
					let date = data.activity.ProgressReportsToSave[0].PerformanceDate;
					entity.PerformanceDate = moment.isMoment(date) ? date : moment.utc(date);
				}
				schedulingMainLineItemProgressService.takeOverNewValues(data.activity.LineItemProgress);
				schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
			});
		}
		function calculateLineItems(parameter, entity, value, model) {
			let activity = schedulingMainService.getSelected();
			let originalEntity = activity;
			let completeActivity = {
				MainItemId: activity.Id,
				Activities: [activity],
				ObjModelSimulationToSave: [entity],
				ActivityPlanningChange: parameter
			};

			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingMainService);

			return $http.post(globals.webApiBaseUrl + 'scheduling/main/ojectmodelsimulation/validate', completeActivity
			).then(function (response) {
				platformDataValidationService.cleanUpAsyncMarker(asyncMarker, schedulingMainService);
				schedulingMainService.takeOverActivities(response.data.Activities, true);
				return {param: parameter, activity: response.data};
			}, function () {
				// handle error here
				platformDataValidationService.cleanUpAsyncMarker(asyncMarker, schedulingMainService);
				return {param: parameter, activity: originalEntity};
			});
		}
	}
})(angular);
