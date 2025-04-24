(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name schedulingMainActivityDialogLookup
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity filtered by project and schedule
	 */

	angular.module('scheduling.main').directive('schedulingMainActivityDialogLookup', ['_', 'LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'schedulingMainActivityLookupFilterService', 'schedulingMainActivityImageProcessor', 'schedulingMainService',
		function (_, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, activityLookupFilterService, schedulingMainActivityImageProcessor, schedulingMainService) {
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
				rows: [{
					gid: 'selectionfilter',
					rid: 'project',
					label: 'Project',
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectFk',
					required: true,
					sortOrder: 1
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'schedulingLookupScheduleDataService',
					desMember: 'DescriptionInfo.Translated',
					isComposite: true,
					filter: function (item) {
						return item.projectFk !== null ? item.projectFk : -1;
					},
					showClearButton: true,
					dispMember: 'Code'
				},
				{
					gid: 'selectionfilter',
					rid: 'schedule',
					label: 'Schedule',
					label$tr$: 'scheduling.schedule.entitySchedule',
					type: 'integer',
					model: 'scheduleFk',
					sortOrder: 2,
					required: true
				}),
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'controllingStructureUnitLookupDataService',
					filter: function (item) {
						let prj;
						if (item && item.projectFk ) {
							prj = item.projectFk;
						}
						return prj;
					},
					showClearButton: true,
					dispMember: 'Code'
				},
				{
					gid: 'selectionfilter',
					rid: 'controllingUnitFk',
					label: 'Controlling Unit',
					label$tr$: 'scheduling.main.controllingunit',
					type: 'integer',
					model: 'controllingUnitFk',
					sortOrder: 3,
					required: true,
					visible: false
				})]
			};
			let gridSettings = {
				layoutOptions:{
					uiStandardServiceName: 'schedulingMainActivityStandardConfigurationService',
					schemas: [{
						typeName: 'ActivityDto',
						moduleSubModule: 'Scheduling.Main'
					}]
				},

				treeOptions: {
					parentProp: 'ParentActivityFk',
					childProp: 'Activities'
				},
				inputSearchMembers: ['Code', 'Description']
			};
			let lookupOptions = {
				lookupType: 'SchedulingActivityNew',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'scheduling.main.entityActivity',
				filterOptions: {
					serverSide: true,
					serverKey: 'schedulingActivityFilter',
					fn: function (item) {
						let filter = activityLookupFilterService.getFilterParams(item);
						if (filter && !filter.projectFk && !filter.scheduleFk) {
							if (item && item.scheduleFk) {
								filter = {scheduleFk: item.ScheduleFk};
							} else {
								let selected = schedulingMainService.getSelected();
								if (selected && selected.ScheduleFk) {
									filter = {scheduleFk: schedulingMainService.getSelected().ScheduleFk};
								}
							}
						}
						return filter;
					}
				},
				dataProcessor: function doProcessData(items, opt) {
					_.forEach(items, function (item) {
						if (item) {
							schedulingMainActivityImageProcessor.processItem(item);

							if (opt.treeOptions && item[opt.treeOptions.childProp] && item[opt.treeOptions.childProp].length > 0) {
								doProcessData(item[opt.treeOptions.childProp], opt);
							}
						}
					});
					return items;
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				uuid: '4865a2fe738c45a986e95cfdc0eda99c',
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'schedulingMainActivityLookupFilterService', formSettings, gridSettings);
		}
	]);
})(angular);
