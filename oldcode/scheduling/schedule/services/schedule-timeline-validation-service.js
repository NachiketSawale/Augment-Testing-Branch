(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleTimelineValidationService
	 * @description provides validation methods for object header instances
	 */
	var moduleName = 'scheduling.schedule';
	angular.module(moduleName).service('schedulingScheduleTimelineValidationService', SchedulingScheduleTimelineValidationService);

	SchedulingScheduleTimelineValidationService.$inject = ['$q', '$http', 'platformDataValidationService', 'schedulingScheduleTimelineEditService'];

	function SchedulingScheduleTimelineValidationService($q, $http, platformDataValidationService, schedulingScheduleTimelineEditService) {
		var self = this;

		self.validateDate = function validateDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, this, schedulingScheduleTimelineEditService, 'EndDate');
		};

		self.validateEndDate = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.Date, value, entity, model, this, schedulingScheduleTimelineEditService, 'Date');
		};

	}

})(angular);

