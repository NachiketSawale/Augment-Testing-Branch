/**
 * Created by henkel on 16.04.2015.
 */


(function (angular) {
	'use strict';
	angular.module('scheduling.calendar').service('schedulingCalendarSubEntityTypeProcessor', SchedulingCalendarSubEntityTypeProcessor);

	SchedulingCalendarSubEntityTypeProcessor.$inject = ['_', 'platformRuntimeDataService', 'schedulingCalendarConstantValues', 'schedulingCalendarMainService'];

	function SchedulingCalendarSubEntityTypeProcessor(_, platformRuntimeDataService, schedulingCalendarConstantValues, schedulingCalendarMainService) {
		this.processItem = function processItem(subEntity) {
			var calId = subEntity.CalendarFk || subEntity.Calendar;
			var calendar = schedulingCalendarMainService.getItemById(calId);

			platformRuntimeDataService.readonly(subEntity, calendar.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.projectType);
		};
	}
})(angular);