(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.lookupdata.directive: basicsLookupDataProjectProjectDialog
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 *a dialog directive for prj_project.
	 *
	 */
	angular.module('boq.main').directive('boqMainProjectLookupDialog', ['basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'boqMainLookupFilterService',
		function (basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, boqMainLookupFilterService) {

			var defaults = {
				version: 3,
				lookupType: 'project',
				valueMember: 'Id',
				displayMember: 'ProjectNo',
				showClearButton: true,
				uuid: '18dfd7591a2f4f0abc0daaa21265128c',
				columns: [
					{
						id: 'ProjectNo',
						field: 'ProjectNo',
						name: 'Project No.',
						width: 100,
						name$tr$: 'cloud.common.entityProjectNo'
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'Project Name',
						width: 120,
						name$tr$: 'cloud.common.entityProjectName'
					},
					{
						id: 'ProjectName2',
						field: 'ProjectName2',
						name: 'Project Name2',
						width: 120,
						name$tr$: 'cloud.common.entityProjectName2'
					},
					{
						id: 'StartDate',
						field: 'StartDate',
						name: 'Start',
						formatter: 'dateutc',
						width: 120,
						name$tr$: 'cloud.common.entityStartDate'
					},
					{
						id: 'prjStatusFk',
						field: 'StatusFk',
						name$tr$: 'cloud.common.entityState',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'project.main.status',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						},
						width: 150
					},
					{
						id: 'Group',
						field: 'GroupDescription',
						name: 'Group',
						width: 150,
						name$tr$: 'cloud.common.entityGroup',
						searchable: false
					}
				],
				title: {
					name: 'Assign project',
					name$tr$: 'cloud.common.dialogTitleProject'
				},
				pageOptions: {
					enabled: true
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							boqMainLookupFilterService.clearFilter(true);

							if (angular.isDefined(args.selectedItem) && args.selectedItem !== null) {
								boqMainLookupFilterService.boqHeaderLookupFilter.projectId = args.selectedItem.Id;
								boqMainLookupFilterService.setSelectedProject(args.selectedItem);
							}

							boqMainLookupFilterService.isFilterValueChanged = true;
							boqMainLookupFilterService.filterValueChanged.fire();
						}
					}
				]
			};

			basicsLookupdataSimpleLookupService.getListSync({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'project.main.status'
			});

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);
