/**
 * Created by zwz on 12/17/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderDialogLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningHeaderDialogLookupDataService is the data service for header look ups
	 */
	angular.module(moduleName).factory('productionplanningHeaderDialogLookupDataService', Service);
	Service.$inject = ['lookupFilterDialogDataService'];
	function Service(lookupFilterDialogDataService) {
		var config = {};
		return lookupFilterDialogDataService.createInstance(config);
	}


	angular.module(moduleName).directive('productionplanningHeaderDialogLookup', Lookup);
	Lookup.$inject = [
		'_',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'LookupFilterDialogDefinition',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformLayoutHelperService',
		'productionplanningHeaderDialogLookupDataService',
	'productionplanningCommonLayoutHelperService'];
	function Lookup(_,
					basicsLookupdataConfigGenerator,
					basicsLookupdataLookupFilterService,
					LookupFilterDialogDefinition,
					platformDataServiceProcessDatesBySchemeExtension,
					platformLayoutHelperService,
		lookupDataService,
		ppsCommonLayoutHelperService) {

		var gid = 'selectionFilter';

		var formSettings = {
			fid: 'productionplanning.header.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [
				{
					gid: gid,
					isOpen: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [
				{
					gid: gid,
					rid: 'project',
					label: 'Project',
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectId' // 'projectId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
				},
				_.assign(
					ppsCommonLayoutHelperService.provideJobExtensionLookupOverload().detail,
					{
						gid: gid,
						rid: 'job',
						label: '*Job',
						label$tr$: 'logistic.job.entityJob',
						model: 'jobId'
					}),
				_.assign(
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesCommonContractLookupDataService',
						filter: function (item) {
							return item && item.projectId ? item.projectId : -1;
						},
						showClearButton: true
					}).detail,
					{
						gid: gid,
						rid: 'ordHeader',
						label: 'Order Header',
						label$tr$: 'productionplanning.common.ordHeaderFk',
						model: 'ordHeaderId'
					}
				),
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
					'basics.customize.ppsheaderstatus',
					'Description',
					{
						gid: gid,
						rid: 'status',
						label: '*Status',
						label$tr$: 'cloud.common.entityStatus',
						model: 'statusId',
						type: 'integer'
					},
					false,
					{
						showIcon: true
					}
				)

			]
		};

		var gridSettings = {
			columns: [
				{
					id: 'headerStatusFk',
					field: 'HeaderStatusFk',
					name: 'Status',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsheaderstatus',null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode'

				}, {
					id: 'descriptionInfo',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'translation'
				}
				,{
					id: 'projectNo',
					field: 'PrjProjectFk',
					name: 'Project',
					name$tr$: 'cloud.common.entityProjectNo',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					},

				}, {
					id: 'projectName',
					field: 'PrjProjectFk',
					name: 'Project Name',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectName'
					}
				},{
					id: 'ordHeaderFk',
					field: 'OrdHeaderFk',
					name: 'Order Header',
					formatter: 'lookup',
					name$tr$: 'productionplanning.common.ordHeaderFk',
					formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesCommonContractLookupDataService',
						filter: function (item) {
							return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
						},
					}).grid.formatterOptions,
				},
				{
					id: 'lgmjobfk',
					name: 'Job',
					name$tr$: 'basics.customize.jobfk',
					field: 'LgmJobFk',
					formatter: 'lookup',
					formatterOptions:{
						displayMember: 'Code',
						lookupType: 'logisticJobEx',
						version: 3
					}
				},
				{
					id: 'insertedat',
					field: 'InsertedAt',
					name: 'Inserted At',
					name$tr$: 'cloud.common.entityInsertedAt',
					formatter: 'datetime'
				}
			],
			inputSearchMembers: ['Code', 'DescriptionInfo']

		};

		var lookupOptions = {
			lookupType: 'PpsHeader',
			valueMember: 'Id',
			displayMember: 'Code',
			title: 'productionplanning.common.dialogTitleHeader',
			filterOptions: {
				serverSide: true,
				serverKey: 'productionplanning-header-filter',
				fn: function (entity) {
					return lookupDataService.getFilterParams(entity);
				}
			},
			pageOptions: {
				enabled: true,
				size: 100
			},
			dataProcessors: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'HeaderDto',
				moduleSubModule: 'ProductionPlanning.Header'})
			],
			version: 3,
			uuid: '3d29aa251d9f450c965129bb750545b0'
		};

		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningHeaderDialogLookupDataService', formSettings, gridSettings);
	}
})(angular);
