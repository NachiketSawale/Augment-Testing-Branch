/**
 * Created by anl on 5/28/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).directive('productionplanningActivityLookupNewDirective', PpsCommonProductLookupNew);

	PpsCommonProductLookupNew.$inject = ['platformLayoutHelperService',
		'productionplanningActivityActivityUIStandardService',
		'LookupFilterDialogDefinition',
		'productionplanningActivityLookupNewDataService',
		'basicsLookupdataConfigGenerator',
		'productionplanningCommonActivityDateshiftService',
	'productionplanningCommonLayoutHelperService'];

	function PpsCommonProductLookupNew(platformLayoutHelperService,
									   uiService,
									   LookupFilterDialogDefinition,
									   productionplanningActivityLookupNewDataService,
									   basicsLookupdataConfigGenerator,
		ppsCommonActivityDateshiftService,
		ppsCommonLayoutHelperService) {

		var formSettings = {
			fid: 'productionplanning.activity.lookup.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'selectionFilter',
				isOpen: true,
				visible: true,
				sortOrder: 1,
				attributes: ['ProjectId', 'JobId', 'LocationId']
			}],

			rows: [
				_.assign(
					platformLayoutHelperService.provideProjectLookupOverload().detail,
					{
						gid: 'selectionFilter',
						rid: 'projectId',
						label: 'Project',
						label$tr$: 'productionplanning.common.prjProjectFk',
						model: 'ProjectId',
						sortOrder: 1
					}),
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'projectLocationLookupDataService',
						filter: function (entity) {
							return entity.ProjectId ? entity.ProjectId : 0;
						},
						showClearButton: true
					},
					{
						gid: 'selectionFilter',
						rid: 'locationId',
						label: '*Location',
						label$tr$: 'productionplanning.common.prjLocationFk',
						model: 'LocationId',
						sortOrder: 2
					}
				),
				_.assign(
					ppsCommonLayoutHelperService.provideJobExtensionLookupOverload().detail,
					{
						gid: 'selectionFilter',
						rid: 'jobId',
						label: '*Job',
						label$tr$: 'logistic.job.entityJob',
						model: 'JobId',
						sortOrder: 3
					})
			]
		};
		var gridColumns = _.cloneDeep(uiService.getStandardConfigForListView().columns);
		_.forEach(gridColumns, function (o) {
			o.editor = null;
			o.navigator = null;
		});

		var gridSettings = {
			columns: gridColumns,
			inputSearchMembers: ['Code', 'DescriptionInfo']
		};

		var lookupOptions = {
			lookupType: 'MntActivity',
			valueMember: 'Id',
			displayMember: 'Code',
			filterOptions: {
				serverSide: true,
				serverKey: 'pps-activity-filter',
				fn: function (item) {
					return productionplanningActivityLookupNewDataService.getFilterParams(item);
				}
			},
			pageOptions: {
				enabled: true,
				size: 100
			},
			version: 3,
			title: 'productionplanning.activity.activity.dialogTitle',
			uuid: '649f8a3be78645b1bf66b059758c8c26'
		};
		ppsCommonActivityDateshiftService.extendSuperEventLookupOptions(lookupOptions);
		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningActivityLookupNewDataService', formSettings, gridSettings);


	}
})(angular);
