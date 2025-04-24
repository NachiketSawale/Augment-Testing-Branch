/**
 * Created by leo on 18.09.2014.
 */

(function (angular) {
	/* global moment */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWorkdayValidationService
	 * @description provides validation methods for workday instances
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarWorkdayValidationService', ['platformDataValidationService', 'calendarUtilitiesService', 'schedulingCalendarWorkdayService',

		function (platformDataValidationService, calendarUtilitiesService, schedulingCalendarWorkdayService) {

			var service = {};

			service.validateWorkStart = function (entity, value, model) {

				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkdayService);
				}

				const listWorkdays = schedulingCalendarWorkdayService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.ExceptDate.format('YYYY-MM-DD')===entity.ExceptDate.format('YYYY-MM-DD') && item.Id!==entity.Id && entity.WorkEnd!==null){

						if (checkOverlap(item.WorkStart, item.WorkEnd, value, entity.WorkEnd)) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlaps', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkdayService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['ExceptDate'], self, schedulingCalendarWorkdayService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkEnd'], self, schedulingCalendarWorkdayService);
				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkdayService);
			};

			service.validateWorkEnd = function (entity, value, model) {
				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkdayService);
				}

				const listWorkdays = schedulingCalendarWorkdayService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.ExceptDate.format('YYYY-MM-DD')===entity.ExceptDate.format('YYYY-MM-DD') && item.Id!==entity.Id && entity.WorkStart!==null){
						if (checkOverlap(item.WorkStart, item.WorkEnd, entity.WorkStart, value )) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlaps', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkdayService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['ExceptDate'], self, schedulingCalendarWorkdayService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkStart'], self, schedulingCalendarWorkdayService);

				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkdayService);
			};

			service.validateExceptDate = function (entity, value, model) {

				if (_.isNull(value) || value === 0)
				{
					return platformDataValidationService.finishValidation(false, entity, value, model, self, schedulingCalendarWorkdayService);
				}

				const listWorkdays = schedulingCalendarWorkdayService.getList();
				let isOverlap = false;
				_.forEach(listWorkdays, function (item) {
					if(item.ExceptDate.format('YYYY-MM-DD')===value.format('YYYY-MM-DD') && item.Id!==entity.Id && entity.WorkStart!==null && entity.WorkEnd!==null){
						if (checkOverlap(item.WorkStart, item.WorkEnd, entity.WorkStart, entity.WorkEnd )) {
							isOverlap = true;
						}
					}
				});

				if (isOverlap === true) {
					const result = platformDataValidationService.createErrorObject('scheduling.calendar.overlaps', {object: model.toLowerCase()});
					return platformDataValidationService.finishValidation(result, entity, value, model, self, schedulingCalendarWorkdayService);
				}
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkStart'], self, schedulingCalendarWorkdayService);
				platformDataValidationService.ensureNoRelatedError(entity, model,['WorkEnd'], self, schedulingCalendarWorkdayService);
				return platformDataValidationService.finishValidation(true, entity, value, model, self, schedulingCalendarWorkdayService);
			};

			function checkOverlap(existingStartTime, existingEndTime, newStartTime, newEndTime) {
				return (newStartTime < existingEndTime && newEndTime > existingStartTime);
			}
			return service;
		}

	]);

})(angular);
