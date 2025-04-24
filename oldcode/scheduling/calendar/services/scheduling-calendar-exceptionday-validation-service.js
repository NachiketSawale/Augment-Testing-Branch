/**
 * Created by leo on 18.09.2014.
 */

(function (angular) {
	/* global moment */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarExceptionDayValidationService
	 * @description provides validation methods for exceptionDay instances
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarExceptionDayValidationService', ['platformDataValidationService', 'platformRuntimeDataService', 'calendarUtilitiesService', 'schedulingCalendarExceptionDayService',

		function (platformDataValidationService, platformRuntimeDataService, calendarUtilitiesService, schedulingCalendarExceptionDayService) {

			var service = {};

			function createWorkTimeToHour(time) {
				var worktime = moment().hour(time);
				worktime.minute(0);
				worktime.seconds(0);
				worktime.millisecond(0);

				return worktime;
			}

			service.validateWorkStart = function (entity, value, model) {
				calendarUtilitiesService.assertSameDate(value, entity.WorkEnd);

				return platformDataValidationService.validatePeriod(value, entity.WorkEnd, entity, model, service, schedulingCalendarExceptionDayService, 'WorkEnd');
			};

			service.validateWorkEnd = function (entity, value, model) {
				calendarUtilitiesService.assertSameDate(value, entity.WorkStart);

				return platformDataValidationService.validatePeriod(entity.WorkStart, value, entity, model, service, schedulingCalendarExceptionDayService, 'WorkStart');
			};

			service.validateIsWorkday = function (entity, value) {
				var fields = null;
				if (value === false) {
					fields = [
						{
							field: 'WorkStart',
							readonly: true
						},
						{
							field: 'WorkEnd',
							readonly: true
						}
					];
					platformRuntimeDataService.readonly(entity, fields);

				} else {
					if (!entity.WorkStart && !entity.WorkEnd) {
						entity.WorkStart = createWorkTimeToHour(8);
						entity.WorkEnd = createWorkTimeToHour(17);
					}
					fields = [
						{
							field: 'WorkStart',
							readonly: false
						},
						{
							field: 'WorkEnd',
							readonly: false
						}
					];
					platformRuntimeDataService.readonly(entity, fields);
				}
			};

			service.validateExceptDate = function (entity, value, model) {
				var items = schedulingCalendarExceptionDayService.getList();
				var result = true;
				angular.forEach(items, function (exception) {
					if (moment(exception.ExceptDate).isSame(value) && exception.Id !== entity.Id) {
						result = false;
					}
				});

				if(result) {
					entity.Year = moment(value).year();
					entity.Month = moment(value).month() + 1;
				}

				return platformDataValidationService.finishValidation(result, entity, value, model, service, schedulingCalendarExceptionDayService);
			};

			return service;
		}

	]);

})(angular);
