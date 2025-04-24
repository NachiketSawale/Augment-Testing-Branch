(function (angular) {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarConstantValues
	 * @function
	 *
	 * @description
	 */
	angular.module(moduleName).value('projectCalendarConstantValues', {
		calendar: {
			type: {
				enterprise: 1,
				project: 2,
				edays: 3
			}
		},
		permissionUuid: {
			calendars: 'afecdb4a08404395855258b70652d04b',
			workhours: '50d82415e24c47aca182c0f634ee9515',
			exceptions: '3159c0a0c6d34287bf80fa1398f879ec',
			workdays: '50d82415e24c47aca182c0f634ee9515',
			weekdays: '4196114c284b49efac5b4431bf9836b2'
		},
		schemes: {
			calendar: {typeName: 'ProjectCalendarDto', moduleSubModule: 'Project.Calendar'},
			exceptionday: {typeName: 'ProjectExceptionDayDto', moduleSubModule: 'Project.Calendar'}
		}
	});
})(angular);

