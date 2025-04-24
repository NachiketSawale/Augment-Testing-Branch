/**
 * Created by leo on 16.09.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWorkhourValidationService
	 * @description provides validation methods for workhour instances
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarWorkhourValidationService', ['platformDataValidationService', 'calendarUtilitiesService', 'schedulingCalendarWorkHourService',

		function (platformDataValidationService, calendarUtilitiesService, schedulingCalendarWorkHourService) {

			var service = {};

			/**
			 * Did the validation of changes to work start field. Errros are registered on the client
			 * @param entity The entity for which the valdation is done
			 * @param value The new value to be set
			 * @param model The field / attribute of the entity to which the new value is set
			 * @returns {An valdation object giving information if the new value is valid}
			 */
			service.validateWorkStart = function (entity, value, model) {

				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkHourService);
				}

				const listWorkdays = schedulingCalendarWorkHourService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.WeekdayFk===entity.WeekdayFk && item.Id!==entity.Id && entity.WorkEnd!==null){
						if (checkOverlap(item.WorkStart, item.WorkEnd, value, entity.WorkEnd)) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlapsday', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkHourService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['WeekdayFk'], self, schedulingCalendarWorkHourService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkEnd'], self, schedulingCalendarWorkHourService);
				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkHourService);
			};

			service.validateWorkEnd = function (entity, value, model) {
				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkHourService);
				}

				const listWorkdays = schedulingCalendarWorkHourService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.WeekdayFk===entity.WeekdayFk && item.Id!==entity.Id && entity.WorkStart!==null){
						if (checkOverlap(item.WorkStart, item.WorkEnd, entity.WorkStart, value )) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlapsday', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkHourService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['WeekdayFk'], self, schedulingCalendarWorkHourService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkStart'], self, schedulingCalendarWorkHourService);

				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkHourService);
			};

			service.validateWeekdayFk = function (entity, value, model) {

				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkHourService);
				}

				const listWorkdays = schedulingCalendarWorkHourService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.WeekdayFk===value && item.Id!==entity.Id && entity.WorkStart!==null && entity.WorkEnd!==null){
						if (checkOverlap(item.WorkStart, item.WorkEnd, entity.WorkStart, entity.WorkEnd )) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlapsday', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkHourService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkStart'], self, schedulingCalendarWorkHourService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkEnd'], self, schedulingCalendarWorkHourService);
				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkHourService);
			};

			function checkOverlap(existingStartTime, existingEndTime, newStartTime, newEndTime) {
				return (newStartTime < existingEndTime && newEndTime > existingStartTime);
			}

			return service;
		}

	]);

})(angular);
