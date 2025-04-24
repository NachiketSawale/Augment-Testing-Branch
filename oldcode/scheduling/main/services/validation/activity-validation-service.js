/**
 * Created by Baedeker on 28.07.2014.
 */
/* global moment globals */

(function (angular) {
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityValidationService
	 * @description provides validation methods for activities
	 */

	angular.module(moduleName).service('schedulingMainActivityValidationService', SchedulingMainActivityValidationService);

	SchedulingMainActivityValidationService.$inject = ['$http', '$injector', '$timeout', '$q', '_', 'platformRuntimeDataService', 'schedulingMainService', 'schedulingMainEventService',
		'schedulingMainRelationshipAllService', 'schedulingMainProgressReportService', 'platformDataValidationService', 'schedulingMainDueDateService',
		'schedulingMainConstantValues', 'schedulingMainModifyActivityProcessor', 'platformDialogService', 'schedulingMainObjectBaseSimulationDataService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function SchedulingMainActivityValidationService($http, $injector, $timeout, $q, _, platformRuntimeDataService, schedulingMainService, schedulingMainEventService, schedulingMainRelationshipAllService, schedulingMainProgressReportService, platformDataValidationService, schedulingMainDueDateService,
		schedulingMainConstantValues, schedulingMainModifyActivityProcessor, platformDialogService, schedulingMainObjectBaseSimulationDataService) {

		var self = this;

		this.validateCode = function validateCode(entity, value, model) {
			let filteredList = _.filter(schedulingMainService.getList(), function (candidate) {
				return candidate.ScheduleFk === entity.ScheduleFk;
			});
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, filteredList, self, schedulingMainService);
		};

		this.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			var isunique = {
				id: entity.Id,
				code: value,
				scheduleFk: entity.ScheduleFk
			};
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingMainService);

			asyncMarker.myPromise =
				$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/isunique', isunique).then(function (result) {
					if (!result.data) {
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.codeMustBeUnique',
							error$tr$param: {}
						}, entity, value, model, asyncMarker, self, schedulingMainService);
					} else {
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, schedulingMainService);
					}
				});

			return asyncMarker.myPromise;
		};

		this.validatePlannedDuration = function validatePlannedDuration(entity, value, model) {
			if(entity.ActivityTypeFk === 3){
				return platformDataValidationService.finishValidation(value >=0, entity, value, model, self, schedulingMainService);
			}
			else {
				return platformDataValidationService.finishValidation(value > 0, entity, value, model, self, schedulingMainService);
			}
		};

		// noinspection JSUnusedGlobalSymbols
		this.asyncValidatePlannedDuration = function asyncValidatePlannedDuration(entity, value, model) {

			var parameter = {
				Id: entity.Id,
				Duration: value// Use case: Change of duration will change the planned finnish. Negative duration is not accepted.
			};

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
				schedulingMainObjectBaseSimulationDataService.takeOver(data.activity.ObjModelSimulationToSave, true);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.asyncValidatePlannedMove = function asyncValidatePlannedMove(entity, value, fieldsOrModel, indent) {
			var parameter = {
				Id: entity.Id,
				StartDate: value[0].startOf('d'),
				EndDate: value[1].endOf('d')
			};
			if (_.isString(indent)) {
				parameter.ChangedField = indent;
			}
			fieldsOrModel = _.isArray(fieldsOrModel) ? fieldsOrModel : [fieldsOrModel];
			return self.calculateActivities(parameter, entity, value, fieldsOrModel).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				if (_.isString(indent) && data.activity.RelationshipsToSave && data.activity.RelationshipsToSave.length > 0) {
					schedulingMainRelationshipAllService.takeOverRelations(data.activity.RelationshipsToSave);
				}
				if (_.isString(indent) && data.activity.RelationshipsToDelete && data.activity.RelationshipsToDelete.length > 0) {
					schedulingMainRelationshipAllService.markRelationsAsDeleted(data.activity.RelationshipsToDelete);
				}

				return {valid: data.valid, error: data.error, error$tr$: data.error, invalidFields: data.invalidFields};
			});
		};

		this.validateQuantity = function validateQuantity(entity, value, model) {
			return platformDataValidationService.finishValidation(value >= 0, entity, value, model, self, schedulingMainService);
		};

		this.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.Quantity = value;

			if (entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.PerformanceFactor || entity.HasReports) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);
					if (entity.HasReports && data.activity.ProgressReportsToSave !== null){
						schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
					}
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else if (entity.ParentActivityFk !== null) {
				parameter.Quantity = null;
				parameter.ChangedField = 'CalculateSummary';
				entity.Quantity = value;
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else
			{
				return $q.when(true);
			}
		};

		this.asyncValidateResourceFactor = function asyncValidateResourceFactor(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.ResourceFactor = value;
			if (entity.QuantityUoMFk && entity.PerformanceFactor && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidatePerformanceFactor = function asyncValidatePerformanceFactor(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.PerformanceFactor = value;
			if (entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateQuantityUoMFk = function asyncValidateQuantityUoMFk(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.UoM = value;

			if (entity.PerformanceFactor && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else if (entity.ParentActivityFk !== null || entity.ActivityTypeFk === 2) {
				parameter.UoM = null;
				parameter.ChangedField = 'CalculateSummary';
				entity.QuantityUoMFk = value;
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateIsQuantityEvaluated = function asyncValidateIsQuantityEvaluated(entity, value, model) {
			let parameter = {
				Id: entity.Id,
				ChangedField: 'CalculateSummary'
			};

			if (entity.ParentActivityFk !== null) {
				entity.IsQuantityEvaluated = value;
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidatePerf1UoMFk = function asyncValidatePerf1UoMFk(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.UoM1 = value;
			if (entity.PerformanceFactor && entity.QuantityUoMFk && entity.Perf2UoMFk && entity.Quantity) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidatePerf2UoMFk = function asyncValidatePerf2UoMFk(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.UoM2 = value;

			if (entity.PerformanceFactor && entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Quantity) {
				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateActivityTemplateFk = function asyncValidateActivityTemplateFk(entity, value, model) {
			if (value !== null) {
				var parameter = {
					Id: entity.Id
				};
				parameter.ActivityTemplateFk = value;
				parameter.LocationFk = entity.LocationFk;

				var copyData = {
					sourceMainItemId: value,
					sourceSectionId: 13,
					destMainItemId: entity.Id,
					destSectionId: 12
				};
				$injector.get('basicsCharacteristicDataServiceFactory').copyCharacteristicAndSynchronisize(schedulingMainService, copyData);

				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.mergeItemAfterTemplateHasBeenAssigned(data.activity.Activities[0]);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			}
			return $q.when(true);
		};

		function isRequiredConstraintDateAvailable(constraintType, constraintDate) {
			var res = true;

			if (!!constraintType &&
				constraintType !== schedulingMainConstantValues.constraintTypes.AsLateAsPossible &&
				constraintType !== schedulingMainConstantValues.constraintTypes.AsSoonAsPossible &&
				constraintType !== schedulingMainConstantValues.constraintTypes.NoConstraint
			) {
				res = !!constraintDate;
			}

			return res;
		}

		function isConstraintDateEditable(constraintType) {
			var res = true;

			if (!constraintType ||
				constraintType === schedulingMainConstantValues.constraintTypes.AsLateAsPossible ||
				constraintType === schedulingMainConstantValues.constraintTypes.AsSoonAsPossible ||
				constraintType === schedulingMainConstantValues.constraintTypes.NoConstraint
			) {
				res = false;
			}

			return res;
		}

		this.validateConstraintTypeFk = function validateConstraintTypeFk(entity, value, model) {
			var dateAvailable = isRequiredConstraintDateAvailable(value, entity.ConstraintDate);

			if (isConstraintDateEditable(entity.ConstraintTypeFk) !== isConstraintDateEditable(value)) {
				var oldValue = entity.ConstraintTypeFk;
				entity.ConstraintTypeFk = value;
				schedulingMainModifyActivityProcessor.processItem(entity);
				entity.ConstraintTypeFk = oldValue;
			}

			if (!isConstraintDateEditable(value)) {
				entity.ConstraintDate = null;
			}

			if (!dateAvailable) {
				let res = {
					valid: false,
					apply: true,
					error: '',
					error$tr$: 'scheduling.main.errors.dateIsRequiredForConstraint'
				};
				platformDataValidationService.finishWithError(res, entity, entity['ConstraintDate'], 'ConstraintDate', self, schedulingMainService);
				platformRuntimeDataService.applyValidationResult(res, entity, 'ConstraintDate');
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: 'For the select constraint type a constraint date must be set',
					error$tr$: 'scheduling.main.error_constraintTypeRequiresDate'
				}, entity, value, model, self, schedulingMainService);
			} else {
				platformDataValidationService.ensureNoRelatedError(entity, model, ['ConstraintDate'], self, schedulingMainService);
			}

			return platformDataValidationService.finishValidation({
				valid: true,
				apply: true,
				error: '',
				error$tr$: ''
			}, entity, value, model, self, schedulingMainService);
		};

		this.asyncValidateConstraintTypeFk = function asyncValidateConstraintTypeFk(entity, value) {
			if ((value !== null && value !== schedulingMainConstantValues.constraintTypes.AsLateAsPossible &&
				value !== schedulingMainConstantValues.constraintTypes.AsSoonAsPossible) ||
				entity.ExecutionStarted) {
				return $q.when(true);
			}
			var parameter = {
				Id: entity.Id,
				ConstraintTypeFk: value
			};

			return self.calculateActivities(parameter, entity).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.asyncValidateLocationFk = function asyncValidateLocationFk(entity, value, model) {
			if (entity.ActivityTemplateFk && !entity.ControllingUnitFk) {
				var parameter = {
					Id: entity.Id
				};
				parameter.LocationFk = value;
				parameter.ActivityTemplateFk = entity.ActivityTemplateFk;

				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.mergeItemAfterTemplateHasBeenAssigned(data.activity.Activities[0]);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			}
			return $q.when(true);
		};

		/* jshint -W074 */ // For me there is no cyclomatic complexity
		this.validateConstraintDate = function validateConstraintDate(entity, value, model) {
			if (value === null) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.dateIsRequiredForConstraint',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}

			platformRuntimeDataService.applyValidationResult(true, entity, 'ConstraintTypeFk');
			platformDataValidationService.finishValidation(true, entity, entity.ConstraintTypeFk, 'ConstraintTypeFk', self, schedulingMainService);

			return platformDataValidationService.finishValidation({
				valid: true,
				apply: true,
				error: '...',
				error$tr$: 'scheduling.main.errors.dateIsRequiredForConstraint',
				error$tr$param: {}
			}, entity, value, model, self, schedulingMainService);
		};

		this.asyncValidateConstraintDate = function asyncValidateConstraintDate(entity, value) {
			if (value === null) {
				return $q.when(true);
			}
			var parameter;

			if (entity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustFinishOn) {
				parameter = {
					Id: entity.Id,
					EndDate: value,// Use case: Change of end should shorten or extend duration. Duration is calculated new
					ConstraintDate: value // set Constraint date must finish on leads to new end date
				};

				return self.calculateActivities(parameter, entity).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				}, function () {
					// handle error here
				});
			}
			if (entity.ConstraintTypeFk === schedulingMainConstantValues.constraintTypes.MustStartOn) {
				parameter = {
					Id: entity.Id,
					StartDate: value,// set Constraint date must finish on leads to new start date
					ConstraintDate: value // set Constraint date must finish on leads to new start date
				};

				return self.calculateActivities(parameter, entity).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);

					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			}

			return $q.when(true);
		};

		this.validatePlannedStart = function validatePlannedStart(entity, value, model) {

			var plannedStart = moment.isMoment(value) ? value : moment.utc(value);
			plannedStart.startOf('day');
			var constraintDate = moment.isMoment(entity.ConstraintDate) ? entity.ConstraintDate : moment.utc(entity.ConstraintDate);

			if (!plannedStart.isValid()) {
				// return moment.parsingFlags;
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.noValidDate',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}

			switch (entity.ConstraintTypeFk) {
				case 1:// AsLateAsPossible
					return true;
				case 2:// AsSoonAsPossible
					return true;
				case 3:// FinishNoEarlierThan
					return true; // couldn't validate without duration => calculate at server
				case 4:// FinishNoLaterThan
					return true; // couldn't validate without duration => calculate at server
				case 5:// MustFinishOn
					return true; // couldn't validate without duration => calculate at server
				case 6:// MustStartOn
					if (!constraintDate.isSame(plannedStart)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.mustStartOn',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				case 7:// StartNoEarlierThan
					if (constraintDate.isAfter(plannedStart)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.startNoEarlierThan',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				case 8:// StartNoLaterThan
					if (constraintDate.isBefore(plannedStart)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.startNoLaterThan',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				default:
					return true;
			}
			return true;
		};

		this.asyncValidateCalendarFk = function asyncValidateCalendarFk(entity, value, model) {
			if (entity.PlannedStart || entity.PlannedFinish) {
				var parameter = {
					Id: entity.Id
				};
				parameter.CalendarFk = value;
				entity.CalendarFk = value;

				return self.calculateActivities(parameter, entity, value, model).then(function (data) {
					schedulingMainService.calculateActivities(data.param, data.activity);
					schedulingMainEventService.updateEvents(data.activity.EventsToSave);
					return {valid: data.valid, error: data.error, error$tr$: data.error, invalidFields: data.invalidFields};
				});
			}
		};

		this.asyncValidatePlannedStart = function asyncValidatePlannedStart(entity, value, model) {
			var parameter = {
				Id: entity.Id
			};
			parameter.StartDate = moment.isMoment(value) ? value : moment.utc(value);// Use case: Change of start should move the entire activivty on the time line. Duration is kept constant
			parameter.StartDate.startOf('d');

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				let apply = true;
				if ((entity.ConstraintTypeFk === 1 || entity.ConstraintTypeFk === 2) && !value.isSame(data.activity.Activities[0].PlannedStart, 'day')){
					apply = false;
				}

				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
				schedulingMainObjectBaseSimulationDataService.takeOver(data.activity.ObjModelSimulationToSave, true);

				return {valid: data.valid, error: data.error, error$tr$: data.error, invalidFields: data.invalidFields, apply: apply};
			});
		};

		this.validateActualStart = function validateActualStart(entity, value, model) {
			var actualStart = moment.isMoment(value) ? value : moment.utc(value);
			var actualFinish = moment.isMoment(entity.ActualFinish) ? entity.ActualFinish : moment.utc(entity.ActualFinish);
			var plannedStart = moment.isMoment(entity.PlannedStart) ? entity.PlannedStart : moment.utc(entity.PlannedStart);

			var actualDuration = actualFinish.diff(actualStart, 'days');

			if (actualFinish.isBefore(actualStart) || actualDuration < 0 || (!plannedStart.isValid() || actualFinish.isBefore(plannedStart))) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '',
					error$tr$: 'scheduling.main.finishBeforeStartOrMissingStart'
				}, entity, value, model, self, schedulingMainService);
			}
			return platformDataValidationService.validatePeriod(value, entity.ActualFinish, entity, model, self, schedulingMainService, 'ActualFinish');
		};

		this.asyncValidateActualStart = function asyncValidateActualStart(entity, value, model) {
			var parameter = {
				Id: entity.Id,
				ActualStart: moment.isMoment(value) ? value : moment.utc(value),
				ChangedField: model
			};

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.validatePlannedFinish = function validatePlannedFinish(entity, value, model) {
			var m = moment.isMoment(value) ? value : moment.utc(value);
			var plannedStart = moment.isMoment(entity.PlannedStart) ? entity.PlannedStart : moment.utc(entity.PlannedStart);
			var plannedFinish = moment.isMoment(value) ? value : moment.utc(value);
			var constraintDate = moment.isMoment(entity.ConstraintDate) ? entity.ConstraintDate : moment.utc(entity.ConstraintDate);
			plannedFinish.endOf('day');
			plannedStart.startOf('day');
			if (!plannedFinish.isValid() || plannedFinish.isBefore(plannedStart)) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '',
					error$tr$: 'scheduling.main.finishBeforeStart'
				}, entity, value, model, self, schedulingMainService);
			}
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

			switch (entity.ConstraintTypeFk) {
				case schedulingMainConstantValues.constraintTypes.AsLateAsPossible:
					return true;
				case schedulingMainConstantValues.constraintTypes.AsSoonAsPossible:
					return true;
				case schedulingMainConstantValues.constraintTypes.FinishNoEarlierThan:
					if (constraintDate.isAfter(m)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.finishNoEarlierThan',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				case schedulingMainConstantValues.constraintTypes.FinishNoLaterThan:
					if (constraintDate.isBefore(m)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.finishNoLaterThan',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				case schedulingMainConstantValues.constraintTypes.MustFinishOn:
					if (!constraintDate.isSame(m, 'day')) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.mustFinishOn',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
					break;
				case schedulingMainConstantValues.constraintTypes.MustStartOn:
					return true; // couldn't validate without duration => calculate at server
				case schedulingMainConstantValues.constraintTypes.StartNoEarlierThan:
					return true; // couldn't validate without duration => calculate at server
				case schedulingMainConstantValues.constraintTypes.StartNoLaterThan:
					return true; // couldn't validate without duration => calculate at server
				default:
					return true;
			}

			return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingMainService);
		};

		this.asyncValidatePlannedFinish = function asyncValidatePlannedFinish(entity, value, model) {
			var m = moment.isMoment(value) ? value : moment.utc(value);
			var parameter = {
				Id: entity.Id
			};

			parameter.EndDate = m; // Use case: Change of end should shorten or extend duration. Duration is calculated new
			parameter.EndDate.endOf('d');

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
				schedulingMainObjectBaseSimulationDataService.takeOver(data.activity.ObjModelSimulationToSave, true);
				let apply = true;
				if ((entity.ConstraintTypeFk === 1 || entity.ConstraintTypeFk === 2) && !value.isSame(data.activity.Activities[0].PlannedFinish,'day')){
					apply = false;
				}
				return {
					valid: data.valid,
					error: data.error,
					error$tr$: data.error,
					apply: apply,
					invalidFields: data.invalidFields
				};
			}, function () {
				// handle error here
			});
		};

		this.validateActualFinish = function validateActualFinish(entity, value, model) {
			var plannedStart = moment.isMoment(entity.PlannedStart) ? entity.PlannedStart : moment.utc(entity.PlannedStart);
			var actualStart = moment.isMoment(entity.ActualStart) ? entity.ActualStart : moment.utc(entity.ActualStart);
			var actualFinish = moment.isMoment(value) ? value : moment.utc(value);
			if ((!plannedStart.isValid() || actualFinish.isBefore(plannedStart)) || actualFinish.isBefore(actualStart)) {
				platformRuntimeDataService.applyValidationResult(false, entity, 'ActualFinish');
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '',
					error$tr$: 'scheduling.main.finishBeforeStartOrMissingStart'
				}, entity, value, model, self, schedulingMainService);
			}
			return platformDataValidationService.validatePeriod(entity.ActualStart, value, entity, model, self, schedulingMainService, 'ActualStart');
		};

		this.asyncValidateActualFinish = function asyncValidateActualFinish(entity, value, model) {
			if (value && entity.ActualStart !== null && entity.ActualStart.isValid()) {// Use case: Change of end should shorten or extend duration. Negative duration not possible. Therefore never accept dates before start
				if (value.isBefore(entity.ActualStart)) {
					return $q.when(false);
				}
			}
			var parameter = {
				Id: entity.Id,
				ActualFinish: moment.isMoment(value) ? value : moment.utc(value),
				ChangedField: model
			};
			if (!schedulingMainDueDateService.hasDueDate()) {
				schedulingMainDueDateService.setPerformanceDueDate(moment());
			}
			parameter.DueDate = schedulingMainDueDateService.getPerformanceDueDateAsString();
			parameter.ProgressDescription = schedulingMainDueDateService.getPerformanceDescription();

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				if (!data.valid) {
					platformRuntimeDataService.applyValidationResult(false, entity, 'ActualFinish');
					return $q.reject({
						valid: false,
						error: data.error || '',
						error$tr$: data.error$tr$ || 'scheduling.main.invalidFinishDate'
					});
				}
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
				if(data.activity.ProgressReportsToSave !== null){
					schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
				}

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.validateExecutionStarted = function validateExecutionStarted(entity, value, model) {
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

		this.asyncValidateExecutionStarted = function asyncValidateExecutionStarted(entity, value, model) {

			var parameter = {
				Id: entity.Id,
				ChangedField: model
			};

			parameter.ExecutionStarted = value;

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.asyncValidateExecutionFinished = function asyncValidateExecutionFinished(entity, value, model) {
			if (!schedulingMainDueDateService.hasDueDate()) {
				schedulingMainDueDateService.setPerformanceDueDate(moment());
			}
			var parameter = {
				Id: entity.Id,
				ChangedField: model
			};

			parameter.ExecutionFinished = value;
			parameter.DueDate = schedulingMainDueDateService.getPerformanceDueDateAsString();
			parameter.ProgressDescription = schedulingMainDueDateService.getPerformanceDescription();

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
				if(data.activity.ProgressReportsToSave !== null){
					schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
				}

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		/* jshint -W074 */
		this.validateEntityPlannedDate = function validateEntityPlannedDate(entity, model, value) {
			var m = moment.isMoment(value) ? value : moment.utc(value);
			var plannedStart = moment.isMoment(entity.PlannedStart) ? entity.PlannedStart : moment.utc(entity.PlannedStart);
			var plannedFinish = moment.isMoment(entity.PlannedFinish) ? entity.PlannedFinish : moment.utc(entity.PlannedFinish);
			plannedStart.startOf('d');
			plannedFinish.endOf('d');
			var parameter = {
				Id: entity.Id
			};
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
			if (model === 'PlannedStart') {
				if (plannedFinish.isValid()) {
					if (plannedFinish.isBefore(m)) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'scheduling.main.errors.finishBeforeStart',
							error$tr$param: {}
						}, entity, value, model, self, schedulingMainService);
					}
				}
				parameter.StartDate = m.toDate();
			} else if (model === 'PlannedFinish') {
				if (plannedStart.isValid()) {
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
				parameter.EndDate = m;
			} else if (model === 'PlannedDuration') {
				parameter.Duration = value;
			}

			self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);
			});
			return true;
			// 3) Use complex validation on server to check
			// url: globals.webApiBaseUrl + 'scheduling/main/activity/validate'
		};

		this.asyncValidateScheduleSubFk = function asyncValidateScheduleSubFk(entity, value, model) {

			var parameter = {
				Id: entity.Id,
				ScheduleSubFk: value
			};

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		this.asyncValidateActivitySubFk = function asyncValidateActivitySubFk(entity, value, model) {

			var parameter = {
				Id: entity.Id,
				ActivitySubFk: value
			};

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainService.calculateActivities(data.param, data.activity);
				schedulingMainEventService.updateEvents(data.activity.EventsToSave);

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		function provideAsyncProgressCallParameterObject(entity) {
			return {
				Id: entity.Id,
				DueDate: schedulingMainDueDateService.getPerformanceDueDateAsString(),
				ProgressDescription: schedulingMainDueDateService.getPerformanceDescription(),
			};
		}

		function doAsyncProgressCall(entity, purpose, value, model) {
			if (!schedulingMainDueDateService.hasDueDate()) {
				schedulingMainDueDateService.setPerformanceDueDate(moment());
			}

			var parameter = provideAsyncProgressCallParameterObject(entity);
			angular.extend(parameter, purpose);

			return self.calculateActivities(parameter, entity, value, model).then(function (data) {
				schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
				$timeout(function calculateNewValuesOfActivities() {
					schedulingMainService.calculateActivities(null, data.activity);
				});

				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		}

		this.asyncValidateDueDateQuantityPerformance = function asyncValidateDueDateQuantityPerformance(entity, value, model) {
			return doAsyncProgressCall(entity, {
				DueDateQuantityPerformance: value,
				RemainingActivityQuantity: entity.RemainingActivityQuantity
			}, value, model);
		};

		this.validatePredecessor = function validatePredecessor(entity, value, model) {
			if (value[0].value === entity.Code) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.parentChildAreTheSame',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}
			return true;
		};

		this.validateSuccessor = function validateSuccessor(entity, value, model) {
			if (value[0].value === entity.Code) {
				return platformDataValidationService.finishValidation({
					valid: true,
					apply: false,
					error: '...',
					error$tr$: 'scheduling.main.errors.parentChildAreTheSame',
					error$tr$param: {}
				}, entity, value, model, self, schedulingMainService);
			}
			return true;
		};

		this.asyncValidatePercentageCompletion = function asyncValidatePercentageCompletion(entity, value, model) {
			return doAsyncProgressCall(entity, {PercentageCompletion: value}, value, model);
		};

		this.asyncValidateRemainingActivityQuantity = function asyncValidateRemainingActivityQuantity(entity, value, model) {
			return doAsyncProgressCall(entity, {RemainingActivityQuantity: value}, value, model);
		};

		this.asyncValidatePeriodQuantityPerformance = function asyncValidatePeriodQuantityPerformance(entity, value, model) {
			return doAsyncProgressCall(entity, {PeriodQuantityPerformance: value}, value, model);
		};

		this.asyncValidateDueDateWorkPerformance = function asyncValidateDueDateWorkPerformance(entity, value, model) {
			return doAsyncProgressCall(entity, {DueDateWorkPerformance: value}, value, model);
		};

		this.asyncValidateRemainingActivityWork = function asyncValidateRemainingActivityWork(entity, value, model) {
			return doAsyncProgressCall(entity, {RemainingActivityWork: value}, value, model);
		};

		this.asyncValidatePeriodWorkPerformance = function asyncValidatePeriodWorkPerformance(entity, value, model) {
			return doAsyncProgressCall(entity, {PeriodWorkPerformance: value}, value, model);
		};

		this.validateIsDurationEstimationDriven = function validateIsDurationEstimationDriven(entity, value, model) {
				entity.IsDurationEstimationDriven = value;
				schedulingMainService.updateFromEstimate(entity, entity.EstimateHoursTotal);
				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingMainService);
		};

		this.getEffectedActivities = function getEffectedActivities(parameter, entity) {
			if (parameter.ChangedField) {
				var effected = [];
				var parent = entity;
				while (parent) {
					effected.push(parent);
					if (parent.ParentActivityFk) {
						parent = schedulingMainService.getItemById(parent.ParentActivityFk);
					} else {
						parent = null;
					}
				}

				return effected;
			}

			return [entity];
		};

		this.calculateActivities = function calculateActivities(parameter, entity, value, fieldsOrModel) {
			var completeActivity = {
				MainItemId: entity.Id,
				Activities: self.getEffectedActivities(parameter, entity),
				Activity: entity,
				ActivityPlanningChange: parameter,
				HasTransientRootEntityInclude: schedulingMainService.isTransientRootEntityActive()
			};
			completeActivity.ActivityPlanningChange.CalculationNeeded= true;
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, fieldsOrModel, schedulingMainService);

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/validate', completeActivity
			).then(function (response) {
				var invalidFields = _.isArray(fieldsOrModel) ? fieldsOrModel : [fieldsOrModel];
				var planningChange = response.data.ActivityPlanningChange;

				if (planningChange && !_.isEmpty(planningChange.InvalidFields)) {
					invalidFields = planningChange.InvalidFields;
				}
				if (!response.data.Valid && response.data.ValidationError.startsWith('Model:')) {
					if (!response.data.Valid) {
						platformDialogService.showMsgBox(response.data.ValidationError.replace('Model:',''), 'scheduling.main.modalInfoMessage', 'info');
						response.data.Valid = true;
						response.data.ValidationError = '';
					}
				}
				_.each(invalidFields, function (invalidField) {
					platformDataValidationService.finishAsyncValidation({
						valid: response.data.Valid,
						error: response.data.ValidationError
					}, entity, value, invalidField, asyncMarker, self, schedulingMainService);
				});
				if (response.data.Valid) {
					fieldsOrModel = _.isArray(fieldsOrModel) ? fieldsOrModel : [fieldsOrModel];
					_.each(fieldsOrModel, function (field) {
						platformDataValidationService.ensureNoRelatedError(entity, field, invalidFields, self, schedulingMainService);
					});

					return {
						valid: response.data.Valid,
						param: parameter,
						activity: response.data,
						apply: true,
						invalidFields: invalidFields
					};
				} else {
					return {
						valid: response.data.Valid,
						error: response.data.ValidationError,
						param: parameter,
						activity: entity,
						apply: true,
						invalidFields: invalidFields
					};
				}
			}, function () {
				platformDataValidationService.finishAsyncValidation({
					valid: false,
					error: 'Unknown issue'
				}, entity, value, fieldsOrModel, asyncMarker, self, schedulingMainService);
				return {valid: false, error: 'Unknown issue', param: parameter, activity: entity};
			});

			return asyncMarker.myPromise;
		};
	}
})(angular);
