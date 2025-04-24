/**
 * Created by lcn on 9/06/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	/**
     * @ngdoc directive
     * @name basics.materia.directive: basicsMaterialProjectLookupDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for stock_project.
     *
     */
	angular.module(moduleName).directive('basicsMaterialProjectLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				version: 2,
				lookupType: 'ProjectStock2Project',
				valueMember: 'Id',
				displayMember: 'ProjectNo',
				dialogOptions: {
					width: '680px'
				},
				dialogUuid: '988d0c8a37064ac89c2d931083ad7c31',
				uuid: '26FF871C01CA4D6EAFE88C5B471B9993',
				columns: [
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
						width: 110
					},
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
						width: 200,
						name$tr$: 'cloud.common.entityProjectName2'
					},
					{
						id: 'StartDate',
						field: 'StartDate',
						name: 'Start',
						formatter: 'dateutc',
						width: 100,
						name$tr$: 'cloud.common.entityStartDate'
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
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);

