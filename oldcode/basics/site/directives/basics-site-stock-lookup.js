
(function (angular) {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).directive('basicsSiteStockLookupDialog', ['platformLayoutHelperService',
		'LookupFilterDialogDefinition', 'basicsSiteStockLookupDialogDataService',
		function (platformLayoutHelperService, LookupFilterDialogDefinition, basicsSiteStockLookupDialogDataService) {

			var lookupOptions = {
				lookupType: 'ProjectStockNew',
				valueMemeber: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'basics-site-stock-filter',
					fn: function (item) {
						return basicsSiteStockLookupDialogDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'basics.site.stockLookupDialogTitle',
				uuid: '59e6e6cb47f54030ae0a0fcc6b602bbc'
			};

			var formSetting = {
				fid: 'basics.site.stocklookupdialog',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'selectionFilter',
					isOpen: true,
					visible: true,
					sortOrder: 1,
					attributes: ['ProjectId']
				}],
				rows: [
					_.assign(
						platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'selectionFilter',
							rid: 'project',
							label: 'Project',
							label$tr$: 'productionplanning.common.prjProjectFk',
							model: 'ProjectId',
							sortOrder: 1
						})]
			};

			var gridSettings = {
				columns: [{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true,
					formatter: 'code'
				}, {
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					readonly: true,
					width: 270
				}],
				inputSearchMembers: ['Code', 'Description']
			};

			return new LookupFilterDialogDefinition(lookupOptions, basicsSiteStockLookupDialogDataService, formSetting, gridSettings);
		}]);

})(angular);
