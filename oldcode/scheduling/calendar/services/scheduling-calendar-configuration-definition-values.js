(function (angular) {
	'use strict';

	var mod = angular.module('scheduling.calendar');

	// Layout specs

	mod.value('schedulingCalendarWorkdayDetailLayout', {
		fid: 'scheduling.calendar.calendarworkdaydetailform',
		version: '1.0.0',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				'gid': 'baseGroup',
				'attributes':['descriptioninfo', 'commenttext', 'exceptdate', 'workstart', 'workend', 'year', 'month' ]
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		overloads: {
			year: { readonly: true },
			month: { readonly: true }
		}
	} );

	mod.value('schedulingCalendarExceptionDayDetailLayout',  {
		fid: 'scheduling.calendar.calendarexceptiondaydetailform',
		version: '1.0.0',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes:['descriptioninfo', 'commenttext', 'exceptdate', 'backgroundcolor', 'isworkday', 'isshowninchart', 'workstart', 'workend', 'year', 'month' ]
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		overloads: {
			year: { readonly: true },
			month: { readonly: true }
		}
	} );

})(angular);

