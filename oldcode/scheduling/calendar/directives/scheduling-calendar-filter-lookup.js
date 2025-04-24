/**
 * Created by leo on 13.03.2019.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic-job-lookup
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('scheduling.calendar').directive('schedulingCalendarFilterLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'schedulingCalendarFilterLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, schedulingCalendarFilterLookupDataService) {

			let formSettings = {
				fid: 'scheduling.main.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'selectionfilter',
						rid: 'calendarType',
						label: 'CalendarType',
						label$tr$: 'basics.customize.calendarType',
						type: 'radio',
						model: 'calendarType',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							groupName: 'calendarType',
							items: [{
								value: 'enterprise',
								label$tr$: 'scheduling.calendar.enterpriseCalendar'
							}, {
								value: 'project',
								label$tr$: 'scheduling.calendar.projectCalendar'
							}, {
								value: 'currentproject',
								label$tr$: 'scheduling.calendar.currentprjCalendar'
							}]
						},
						sortOrder: 1
					},
					{
						gid: 'selectionfilter',
						rid: 'projectId',
						type: 'description',
						model: 'projectId',
						visible: false,
						sortOrder: 2

					}]
			};
			let gridSettings = {
				layoutOptions:{
					translationServiceName: 'schedulingCalendarTranslationService',
					uiStandardServiceName: 'schedulingCalendarUIStandardService',
					schemas: [{
						typeName: 'CalendarDto',
						moduleSubModule: 'Scheduling.Calendar'
					}]
				},
				inputSearchMembers: ['Code', 'DescriptionInfo']
			};
			let lookupOptions = {
				lookupType: 'schedulingCalendar',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'projectCalendar',
					fn: function (item){
						return schedulingCalendarFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'scheduling.calendar.calendarLookup',
				uuid: '84cddaf822f447b6b689b421572e5c17',
				width: 500
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'schedulingCalendarFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
