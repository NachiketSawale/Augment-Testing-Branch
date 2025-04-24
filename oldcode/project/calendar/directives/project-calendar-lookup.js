/**
 * Created by leo on 18.03.2019.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-parent-lookup
	 * @requires  schedulingLookupService
	 * @description ComboBox to select a activity
	 */

	angular.module('project.calendar').directive('projectCalendarLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator', 'cloudDesktopPinningContextService','_',
		function (BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator, cloudDesktopPinningContextService, _) {
			var tpyeOvl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.calendartype', null, {
				showIcon: true, imageSelectorService: 'basicsCustomizeCalendarTypeIconService',
			}).grid;
			var defaults = {
				lookupType: 'schedulingCalendar',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'projectCalendar',
					fn: function (item){
						var params = {};
						var pinningProject = cloudDesktopPinningContextService.getPinningItem('project.main');
						params = {
							projectId: item && !_.isNil(item.ProjectFk) ? item.ProjectFk : pinningProject ? pinningProject.id : null,
							calendarType: 'currentproject'
						};
						return params;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				columns:[{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true
				},
				{
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'translation',
					readonly: true
				},
				{
					id: 'calendarType',
					field: 'CalendarTypeFk',
					name: 'CalendarTypeFk',
					name$tr$: 'basics.customize.calendartype',
					formatter: tpyeOvl.formatter,
					formatterOptions: tpyeOvl.formatterOptions,
					readonly: true
				}],
				version: 3,
				uuid: 'df1f5ebb088a4f6eba0b16a09ffe1005'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);

})(angular);
