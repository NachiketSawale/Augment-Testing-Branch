/**
 * Created by leo on 17.03.2015.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarMainUIConfig
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingCalendarMainUIConfig', ['basicsLookupdataConfigGenerator',

		function (basicsLookupdataConfigGenerator) {

			return {
				getCalendarDetailLayout: function () {
					return {
						fid: 'scheduling.calendar.calendardetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'calendartypefk', 'isdefault', 'workhourdefinesworkday', 'islive']
							},
							{
								'gid': 'workHours',
								'attributes': ['workhoursperday', 'workhoursperweek', 'workhourspermonth', 'workhoursperyear', 'basuomhourfk', 'basuomdayfk',
									'basuomworkdayfk', 'basuomweekfk', 'basuommonthfk', 'basuomyearfk', 'basuomminutefk']
							},
							{
								'gid': 'userDefTextGroup',
								'attributes': ['userdefinedtext01', 'userdefinedtext02', 'userdefinedtext03', 'userdefinedtext04', 'userdefinedtext05']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'isdefault': {
								'validator': 'validateDefaults'
							},
							'islive': {
								'readonly': true
							},
							basuomdayfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-day-filter'
							}),
							basuomhourfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-hour-filter'
							}),
							basuomworkdayfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-work-day-filter'
							}),
							basuomweekfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-week-filter'
							}),
							basuommonthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-month-filter'
							}),
							basuomyearfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-year-filter'
							}),
							basuomminutefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitCalendarLookupDataService',
								filterKey: 'scheduling-calendar-unit-minute-filter'
							}),
							calendartypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.calendartype', null, {
								showIcon: true, imageSelectorService: 'basicsCustomizeCalendarTypeIconService'})
						}
					};
				},
				getWorkhourDetailLayout: function () {
					return {
						fid: 'scheduling.calendar.calendarworkhourdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['weekdayfk', 'isworkingday', 'workstart', 'workend']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							weekdayfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupCalendarWeekdayDataService',
								filter: function (item) {
									var calendar;
									if (item) {
										calendar = item.CalendarFk;
									}

									return calendar;
								}
							})
						}
					};
				},
				getWeekdayDetailLayout: function () {
					return {
						'fid': 'scheduling.calendar.calendarweekdaydetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['acronyminfo', 'descriptioninfo', 'sorting', 'isweekend', 'backgroundcolor']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
					};
				}
			};
		}
	]);
})(angular);

