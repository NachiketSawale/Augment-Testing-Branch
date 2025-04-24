(function (angular) {
	/* global moment globals */
	'use strict';

	var moduleName = 'scheduling.main';
	/**
	 * @ngdoc service
	 * @name schedulingMainLineItemProgressValidationService
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).factory('schedulingMainLineItemProgressValidationService', ['$http', '$q', 'schedulingMainService', 'schedulingMainProgressReportService', 'platformDataValidationService',
		'schedulingMainLineItemProgressService', 'schedulingMainDueDateService',
		/* jshint -W072 */
		function SchedulingMainLineItemProgressValidationService($http, $q, schedulingMainService, schedulingMainProgressReportService, platformDataValidationService, schedulingMainLineItemProgressService, schedulingMainDueDateService) {
			var service = {};

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

				var parameter = provideAsyncProgressCallParameterObject(entity);
				angular.extend(parameter, purpose);

				return service.calculateLineItems(parameter, entity, value, model).then(function (data) {
					schedulingMainLineItemProgressService.takeOverNewValues(data.activity.LineItemProgress);
					schedulingMainProgressReportService.takeOverNewReports(data.activity.ProgressReportsToSave);
				});
			}

			service.asyncValidateDueDateQuantityPerformance = function asyncValidateDueDateQuantityPerformance(entity, value, model) {
				return doAsyncProgressCall(entity, {DueDateQuantityPerformance: value}, value, model);
			};

			service.asyncValidatePCo = function asyncValidatePercentageCompletion(entity, value, model) {
				return doAsyncProgressCall(entity, {PercentageCompletion: value}, value, model);
			};

			service.asyncValidateRemainingLineItemQuantity = function asyncValidateRemainingActivityQuantity(entity, value, model) {
				return doAsyncProgressCall(entity, {RemainingActivityQuantity: value}, value, model);
			};

			service.asyncValidatePeriodQuantityPerformance = function asyncValidatePeriodQuantityPerformance(entity, value, model) {
				return doAsyncProgressCall(entity, {PeriodQuantityPerformance: value}, value, model);
			};

			service.asyncValidateDueDateWorkPerformance = function asyncValidateDueDateWorkPerformance(entity, value, model) {
				return doAsyncProgressCall(entity, {DueDateWorkPerformance: value}, value, model);
			};

			service.asyncValidateRemainingLineItemWork = function asyncValidateRemainingActivityWork(entity, value, model) {
				return doAsyncProgressCall(entity, {RemainingActivityWork: value}, value, model);
			};

			service.asyncValidatePeriodWorkPerformance = function asyncValidatePeriodWorkPerformance(entity, value, model) {
				return doAsyncProgressCall(entity, {PeriodWorkPerformance: value}, value, model);
			};


			service.calculateLineItems = function calculateLineItems(parameter, entity, value, model) {
				var activity = schedulingMainService.getSelected();
				var originalEntity = activity;
				var completeActivity = {
					MainItemId: activity.Id,
					Activities: [activity],
					LineItemProgress: entity,
					ActivityPlanningChange: parameter
				};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingMainService);

				return $http.post(globals.webApiBaseUrl + 'scheduling/main/lineitemprogress/validate', completeActivity
				).then(function (response) {
					platformDataValidationService.cleanUpAsyncMarker(asyncMarker, schedulingMainService);
					schedulingMainService.takeOverActivities(response.data.Activities, true);
					return {param: parameter, activity: response.data};
				}, function () {
					// handle error here
					platformDataValidationService.cleanUpAsyncMarker(asyncMarker, schedulingMainService);
					return {param: parameter, activity: originalEntity};
				});
			};

			return service;

		}
	]);
})(angular);
