(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.lookupdata.directive: qtoMainProjectLookupDialog
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 *a dialog directive for prj_project.
	 *
	 */
	angular.module('qto.main').directive('qtoMainProjectLookupDialog', ['basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'qtoMainDetailLookupFilterService',
		function (basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, qtoMainDetailLookupFilterService) {

			var defaults = {
				version: 3,
				lookupType: 'project',
				valueMember: 'Id',
				displayMember: 'ProjectNo',
				showClearButton: true,
				uuid: 'f0ced232207341c391b1ae560e8c88bc',
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
							qtoMainDetailLookupFilterService.clearFilter(true);

							if (angular.isDefined(args.selectedItem) && args.selectedItem !== null) {
								qtoMainDetailLookupFilterService.boqHeaderLookupFilter.projectId = args.selectedItem.Id;
								qtoMainDetailLookupFilterService.qtoHeaderLookupFilter.projectId = args.selectedItem.Id;
								qtoMainDetailLookupFilterService.setSelectedProject(args.selectedItem);
							}
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
