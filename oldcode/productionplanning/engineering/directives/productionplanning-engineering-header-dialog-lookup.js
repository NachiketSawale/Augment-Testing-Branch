/**
 * Created by zwz on 10/29/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringHeaderDialogLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningEngineeringHeaderDialogLookupDataService is the data service for engineering header look ups
	 */
	angular.module(moduleName).factory('productionplanningEngineeringHeaderDialogLookupDataService', Service);
	Service.$inject = ['lookupFilterDialogDataService'];
	function Service(lookupFilterDialogDataService) {
		var config = {};
		return lookupFilterDialogDataService.createInstance(config);
	}


	angular.module(moduleName).directive('productionplanningEngineeringHeaderDialogLookup', Lookup);
	Lookup.$inject = [
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'LookupFilterDialogDefinition',
		'productionplanningEngineeringHeaderDialogLookupDataService'];
	function Lookup(basicsLookupdataConfigGenerator,
					basicsLookupdataLookupFilterService,
					LookupFilterDialogDefinition,
					lookupDataService) {
		var formSettings = {
			fid: 'productionplanning.engineering.header.selectionfilter',
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
					rid: 'project',
					label: 'Project',
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectId', // 'projectId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
					sortOrder: 1
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.engineeringtype','',
					{
						gid: 'selectionfilter',
						rid: 'engineeringType',
						label: 'Engineering Type',
						label$tr$: 'productionplanning.engineering.entityEngTypeFk',
						type: 'integer',
						model: 'engTypeId',// 'engTypeId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
						sortOrder: 2
					}, false, {required: false, showIcon: true}
				)
			]
		};

		var gridSettings = {
			columns: [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true
				}, {
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					readonly: true
				}, {
					id: 'projectNo',
					field: 'ProjectFk',
					name: 'Project',
					name$tr$: 'cloud.common.entityProjectNo',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					},
					readonly: true
				}, {
					id: 'projectName',
					field: 'ProjectFk',
					name: 'Project Name',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectName'
					},
					readonly: true
				},{
					id: 'engTypeFk',
					field: 'EngTypeFk',
					name: 'Type',
					name$tr$: 'cloud.common.entityType',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringtype',null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{
					id: 'engStatusFk',
					field: 'EngStatusFk',
					name: 'EngStatusFk',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringstatus',null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{
					id: 'insertedat',
					field: 'InsertedAt',
					name: 'InsertedAt',
					name$tr$: 'cloud.common.entityInsertedAt',
					formatter: 'datetime'
				}],
			inputSearchMembers: ['Code', 'Description']

		};

		var lookupOptions = {
			lookupType: 'EngHeader',
			valueMember: 'Id',
			displayMember: 'Code',
			title: 'productionplanning.engineering.assignEngineeringHeader',
			filterOptions: {
				serverSide: true,
				serverKey: 'productionplanning-engineering-header-filter',
				fn: function (entity) {
					return lookupDataService.getFilterParams(entity);
				}
			},
			pageOptions: {
				enabled: true,
				size: 100
			},
			version: 3,
			uuid: 'f8b13155772e4227b197eb1eeef3503e'
		};

		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningEngineeringHeaderDialogLookupDataService', formSettings, gridSettings);
	}
})(angular);
