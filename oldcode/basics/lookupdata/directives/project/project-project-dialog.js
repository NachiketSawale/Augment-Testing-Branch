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
	angular.module('basics.lookupdata').directive('basicsLookupDataProjectProjectDialog', ['basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'platformDataServiceProcessDatesBySchemeExtension',
		function (basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, platformDataServiceProcessDatesBySchemeExtension) {

			var defaults = {
				lookupType: 'project',
				valueMember: 'Id',
				displayMember: 'ProjectNo',
				version: 3,
				dialogOptions: {
					width: '680px'
				},
				uuid: '039b02f62e964148831ec77618c20f2f',
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
						id: 'ProjectLongNo',
						field: 'ProjectLongNo',
						name: 'Project Long No.',
						width: 100,
						name$tr$: 'project.main.projectLongNo'
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
					},
					{
						id: 'ProjectIndex',
						field: 'ProjectIndex',
						name: 'Project Index',
						width: 100,
						name$tr$: 'cloud.common.entityProjectIndex',
						searchable: false
					}
				],
				events: [],
				title: {
					name: 'cloud.common.dialogTitleProject'
				},
				pageOptions: {
					enabled: true
				},
				dataProcessors: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ProjectLookupDto',
					moduleSubModule: 'Project.Main'
				})]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);