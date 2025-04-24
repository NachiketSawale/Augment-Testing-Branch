/**
 * Created by henkel on 16.04.2015.
 */


(function (angular) {
	'use strict';
	angular.module('scheduling.calendar').service('schedulingCalendarTypeProcessor', SchedulingCalendarTypeProcessor);

	SchedulingCalendarTypeProcessor.$inject = ['_', 'platformRuntimeDataService', 'schedulingCalendarConstantValues'];

	function SchedulingCalendarTypeProcessor(_, platformRuntimeDataService, schedulingCalendarConstantValues) {
		this.processItem = function processItem(calendar) {
			platformRuntimeDataService.readonly(calendar, calendar.CalendarTypeFk === schedulingCalendarConstantValues.types.calendar.projectType);
		};
	}
})(angular);