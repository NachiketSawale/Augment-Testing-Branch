/**
 * Created by ltn on 4/19/2017.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups['PrcProject'] = function () {// jshint ignore:line
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcProject',
				valueMember: 'Id',
				displayMember: 'ProjectNo',
				dialogOptions: {
					width: '680px'
				},
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
						id: 'Company',
						field: 'CompanyFk',
						name: 'Company',
						width: 120,
						name$tr$: 'cloud.common.entityCompany',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						}
					},
					{
						id: 'AssetMaster',
						field: 'AssetMasterFk',
						name: 'Asset Master',
						name$tr$: 'procurement.package.entityAssetMaster',
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'AssertMaster',
							displayMember: 'Code'
						}
					},
					{
						id: 'AssetMasterDescription',
						field: 'AssetMasterFk',
						name: 'Asset Master Description',
						name$tr$: 'procurement.package.entityAssetMasterDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'AssertMaster',
							displayMember: 'DescriptionInfo.Translated'
						}
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
				},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

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
	angular.module('procurement.common').directive('procurementProjectLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var lookup = globals.lookups['PrcProject']();// jshint ignore:line
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', lookup.lookupOptions);
		}]);

})(angular, globals);

