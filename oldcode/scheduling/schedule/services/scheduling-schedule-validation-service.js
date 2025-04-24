/**
 * Created by baf on 02.09.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleValidationService
	 * @description provides validation methods for schedule instances
	 */
	angular.module('scheduling.schedule').factory('schedulingScheduleValidationService', ['_', '$q', '$injector', '$http', 'platformDataValidationService', 'schedulingScheduleCodeGenerationService', 'schedulingScheduleEditService', 'platformDataServiceProcessDatesBySchemeExtension','moment',

		function (_, $q, $injector, $http, platformDataValidationService, schedulingScheduleCodeGenerationService, schedulingScheduleEditService, platformDataServiceProcessDatesBySchemeExtension, moment) {

			var service = {};


			service.validateCode = function (entity, value) {

				if (entity.Version > 0 || !schedulingScheduleCodeGenerationService.hasToGenerate()) {
					var items = schedulingScheduleEditService.getList();

					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', items, service, schedulingScheduleEditService);
				}
				return true;
			};

			service.validateTargetStart = function validateTargetStart(entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.TargetEnd, entity, model, service, schedulingScheduleEditService, 'TargetEnd');
			};

			service.asyncValidateTargetStart = function asyncValidateTargetStart(entity, value, model) {
				if(!value) {
					return $q.when(true);
				}

				var validationData = {
					DateValue: value,
					ScheduleId: entity.Id
				};
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingScheduleEditService);

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/schedule/validateTargetStart', validationData).then(function (result) {

					if (result.data.length > 0) {
						var insertedDate = value._i;
						var activitiesErrorCodeText = '';
						var activityEarliestTimeEntity = result.data[0];
						platformDataServiceProcessDatesBySchemeExtension.parseString(entity, model, 'datetimeutc');
						var activityEarliestTime = moment(activityEarliestTimeEntity.ActivityEarliestTime).format('L');

						_.each(result.data, function (element, index) {
							if (index === (result.data.length - 1)) {
								activitiesErrorCodeText += element.ActivityEarliestTimeCode + '\n';
							}
							else {
								activitiesErrorCodeText += element.ActivityEarliestTimeCode + ',' + '\n';
							}
						});
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: 'invalid date',
							error$tr$: 'scheduling.schedule.notValidEarliestActivityMessage',
							error$tr$param$: {
								insertedDate: insertedDate,
								activityEarliestTime: activityEarliestTime,
								activitiesErrorCodeText: activitiesErrorCodeText
							}
						}, entity, value, model, asyncMarker, service, schedulingScheduleEditService);
					} else {
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, schedulingScheduleEditService);
					}
				});

				return asyncMarker.myPromise;
			};

			service.validateTargetEnd = function validateTargetEnd(entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.TargetStart, value, entity, model, service, schedulingScheduleEditService, 'TargetStart');
			};

			service.asyncValidateTargetEnd = function asyncValidateTargetStart(entity, value, model) {
				if(!value) {
					return $q.when(true);
				}

				var validationData = {
					DateValue: value,
					ScheduleId: entity.Id
				};
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingScheduleEditService);

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/schedule/validateTargetEnd', validationData).then(function (result) {
					if (result.data.length > 0) {
						var insertedDate = value._i;
						var activitiesErrorCodeText = '';
						var activityLatestTimeEntity = result.data[0];
						platformDataServiceProcessDatesBySchemeExtension.parseString(activityLatestTimeEntity, model, 'datetimeutc');
						var activityLatestTime = moment(activityLatestTimeEntity.ActivityLatestTime).format('L');

						_.each(result.data, function (element, index) {
							if (index === (result.data.length - 1)) {
								activitiesErrorCodeText += element.ActivityLatestTimeCode + '\n';
							}
							else {
								activitiesErrorCodeText += element.ActivityLatestTimeCode + ',' + '\n';
							}
						});

						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: 'invalid date',
							error$tr$: 'scheduling.schedule.notValidLatestActivityMessage',
							error$tr$param$: {
								insertedDate: insertedDate,
								activityLatestTime: activityLatestTime,
								activitiesErrorCodeText: activitiesErrorCodeText
							}
						}, entity, value, model, asyncMarker, service, schedulingScheduleEditService);
					} else {
						return platformDataValidationService.validatePeriod(entity.TargetStart, value,  entity, model, service, schedulingScheduleEditService, 'TargetStart');
					}
				});
				return asyncMarker.myPromise;
			};

			service.asyncValidateScheduleTypeFk = function asyncValidateScheduleTypeFk(entity, value, model) {
				if(!value) {
					return $q.when(true);
				}
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingScheduleEditService);
				let validationData = {
					ScheduleTypeId: value,
					ScheduleId: entity.Id
				};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/schedule/setdefstatusandrubriccatbytype', validationData).then(function (result) {
					if (result && result.data) {
						entity.ScheduleStatusFk = result.data.ScheduleStatusFk;
						entity.RubricCategoryFk = result.data.RubricCategoryFk;
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, schedulingScheduleEditService);
					} else {
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: 'invalid date',
							error$tr$: 'scheduling.schedule.noStatusDefault',
						}, entity, value, model, asyncMarker, service, schedulingScheduleEditService);
					}
				});
				return asyncMarker.myPromise;
			};

			return service;
		}

	]);

})(angular);
