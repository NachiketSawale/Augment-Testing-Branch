/**
 * Created by leo on 11.01.2021.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name project-main-action-lookup
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('project.main').directive('projectMainActionLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'projectMainActionLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, projectMainActionLookupDataService) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'project-main-controlling-unit-filter',
				serverSide: true,
				serverKey: 'basics.masterdata.controllingunit.filterkey',
				fn: function (item) {
					return {
						ProjectFk: item.projectFk
					};
				}
			}]);
			var formSettings = {
				fid: 'project.action.selectionfilter',
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
					sortOrder: 1
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'timekeepingEmployeeByRightsLookupDataService',
					dispMember: 'DescriptionInfo.Translated',
					showClearButton: true
				},  {
					gid: 'selectionfilter',
					rid: 'employee',
					label: 'Employee',
					label$tr$: 'cloud.common.entityEmployee',
					type: 'lookup',
					model: 'employeeFk',
					sortOrder: 2
				}, false, {required: false}),
				{
					gid: 'selectionfilter',
					rid: 'controllingunit',
					label: 'Controlling',
					label$tr$: 'cloud.common.entityControllingUnit',
					type: 'directive',
					directive: 'basics-master-data-context-controlling-unit-lookup',
					options: {
						eagerLoad: true,
						filterKey: 'project-main-controlling-unit-filter',
						showClearButton: true
					},
					model: 'controllingUnitFk',
					sortOrder: 3
				},
				{
					gid: 'selectionfilter',
					rid: 'schedulingActivity',
					label: 'Activity',
					label$tr$: 'scheduling.main.entityActivity',
					type: 'directive',
					directive: 'scheduling-main-activity-dialog-lookup',
					options: {
						showClearButton: true,
						defaultFilter: {projectFk: 'projectFk'}
					},
					model: 'activityFk',
					sortOrder: 4
				},
				{
					gid: 'selectionfilter',
					rid: 'validationDate',
					label: 'Validation Date',
					label$tr$: 'project.main.validationDate',
					type: 'dateutc',
					model: 'validationDate',
					sortOrder: 5
				}]
			};

			var gridSettings = {
				layoutOptions:{
					translationServiceName: 'projectMainTranslationService',
					uiStandardServiceName: 'projectMainActionLayoutService',
					schemas: [{
						typeName: 'ActionDto',
						moduleSubModule: 'Project.Main'
					}]
				}
			};
			var lookupOptions = {
				lookupType: 'ProjectAction',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'project.main.assignAction',
				filterOptions: {
					serverSide: true,
					serverKey: 'projectActionFilter',
					fn: function (item){
						return projectMainActionLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: '4c618792e01e46118023e59387e83d4f'
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'projectMainActionLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
