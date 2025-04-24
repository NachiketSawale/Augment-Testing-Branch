/**
 * Created by leo on 16.09.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWeekdayValidationService
	 * @description provides validation methods for weekday instances
	 */
	angular.module('scheduling.calendar').factory('schedulingCalendarWeekdayValidationService', ['platformDataValidationService', 'schedulingCalendarWeekdayService',

		function (platformDataValidationService, schedulingCalendarWeekdayService) {

			var service = {};

			service.validateSorting = function (entity, value, model) {
				platformDataValidationService.finishValidation(value >= 1 && value <= 7, entity, value, model, service, schedulingCalendarWeekdayService);
			};

			service.validateAcronym = function (entity, value, model){
				var items = schedulingCalendarWeekdayService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, schedulingCalendarWeekdayService);
			};

			return service;
		}

	]);

})(angular);
