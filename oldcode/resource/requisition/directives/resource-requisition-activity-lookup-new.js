/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resource-requisition-lookup
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.requisition').directive('resourceRequisitionActivityLookupNew', ['_', 'LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceRequisitionActivityLookupDataServiceNew', 'schedulingMainActivityImageProcessor', 'resourceRequisitionDataService',
		function (_, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, resourceRequisitionActivityLookupDataServiceNew,
			schedulingMainActivityImageProcessor, resourceRequisitionDataService) {
			var formSettings = {
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
						showClearButton: false
					},
					model: 'projectFk',
					required: true,
					sortOrder: 1,
					readonly: true
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'schedulingLookupScheduleDataService',
					desMember: 'DescriptionInfo.Translated',
					isComposite: true,
					filter: function (item) {
						return item.projectFk !== null ? item.projectFk : null;
					},
					showClearButton: true,
					dispMember: 'Code',
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
				})]
			};
			var gridSettings = {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true,
						width: 270
					}
				],
				treeOptions: {
					parentProp: 'ParentActivityFk',
					childProp: 'Activities'
				},
				inputSearchMembers: ['Code', 'Description']
			};
			var lookupOptions = {
				lookupType: 'SchedulingActivityNew',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'resource.requisition.lookupAssignActivity',
				filterOptions: {
					serverSide: true,
					serverKey: 'schedulingActivityFilter',
					fn: function (item) {
						return resourceRequisitionActivityLookupDataServiceNew.getFilterParams(item);
					}
				},
				defaultFilter: function (entity) {
					entity.projectFk = resourceRequisitionDataService.getSelected().ProjectFk;
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
				uuid: 'c088550900394bcf99ac4dc3e80a7300',
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceRequisitionActivityLookupDataServiceNew', formSettings, gridSettings);
		}
	]);
})(angular);
