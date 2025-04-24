(function (angular) {
	'use strict';
	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarConstantValues
	 * @function
	 *
	 * @description
	 * schedulingCalendarConstantValues provides definitions and constants frequently used in scheduling calendar module
	 */
	angular.module(moduleName).value('schedulingCalendarConstantValues', {
		schemes: {
			calendar: {typeName: 'CalendarDto', moduleSubModule: 'Scheduling.Calendar'}
		},
		uuid: {
			container: {
			},
			permission: {
				calendars: 'afecdb4a08404395855258b70652d04b',
				workhours: '50d82415e24c47aca182c0f634ee9515',
				exceptiondays: '3159c0a0c6d34287bf80fa1398f879ec',
				workdays: '50d82415e24c47aca182c0f634ee9515',
				weekdays: '4196114c284b49efac5b4431bf9836b2'
			}
		},
		types: {
			calendar: {
				enterpriseType: 1,
				projectType: 2,
				eDaysType: 3
			}
		}
	});
})(angular);
