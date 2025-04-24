/*
 * $Id: project-calendar-ui-configuration-service.js 535284 2019-02-27 06:26:30Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('projectCalendarUIConfigurationService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			var service = {};

			function getOvlCalendarFk() {
				return {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'schedulingCalendar',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: '',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'Code',
								additionalColumns: true,
								addGridColumns: [{
									id: 'description',
									field: 'DescriptionInfo',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'translation',
									readonly: true
								}]
							}
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'scheduling-calendar-filter-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							displayMember: 'Code',
							version: 3
						}
					}
				};
			}

			service.getCalendarLayout = function () {
				return {
					fid: 'project.calendar.calendarForm',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['calendarfk', 'calendartypefk', 'comment', 'calendarsourcefk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						calendarfk: getOvlCalendarFk(),
						calendarsourcefk: getOvlCalendarFk(),
						calendartypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.calendartype', null, {
							showIcon: true, imageSelectorService: 'basicsCustomizeCalendarTypeIconService',
						})
					}
				};
			};

			return service;
		}
	]);
})(angular);
