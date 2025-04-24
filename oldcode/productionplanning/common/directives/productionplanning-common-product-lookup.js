(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonProductLookup', ProductionplanningCommonProductLookup);

	ProductionplanningCommonProductLookup.$inject = [
		'platformLayoutHelperService',
		'lookupFilterDialogDataService',
		'LookupFilterDialogDefinition',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataConfigGenerator',
		'BasicsLookupdataLookupDirectiveDefinition',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonLookupParamStorage'];

	function ProductionplanningCommonProductLookup(platformLayoutHelperService,
	                                               lookupFilterDialogDataService,
	                                               LookupFilterDialogDefinition,
	                                               basicsLookupdataLookupFilterService,
	                                               basicsLookupdataConfigGenerator,
	                                               BasicsLookupdataLookupDirectiveDefinition,
	                                               uiService,
	                                               lookupParamStorage) {
		function registerLookupFilters() {
			if (basicsLookupdataLookupFilterService.hasFilter('productionplanning-common-product-lookup-ppsitem-filter')) {
				return;
			}

			var filters = [{
				key: 'productionplanning-common-product-lookup-ppsitem-filter',
				fn: function (requisitionItem, request) {
					return request.projectId ? requisitionItem.ProjectFk === request.projectId : true;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		}

		var filterFormConfig = {
			fid: 'transportplanning.bundle.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'selectionfilter',
				isOpen: true,
				visible: true,
				sortOrder: 1
			}],
			rows: [
				_.assign(
					platformLayoutHelperService.provideProjectLookupOverload().detail,
					{
						gid: 'selectionfilter',
						rid: 'project',
						label: 'Project',
						label$tr$: 'productionplanning.common.prjProjectFk',
						model: 'projectId',
						sortOrder: 1
					}),
				basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
					'productionplanning-item-item-lookup-dialog',
					'PPSItem',
					'Code',
					true,
					{
						gid: 'selectionfilter',
						rid: 'ppsItem',
						label: 'Pps Item',
						label$tr$: 'productionplanning.common.ppsItem',
						model: 'ppsItemId',
						sortOrder: 2
					},
					'productionplanning-common-product-lookup-ppsitem-filter')]
		};
		var gridConfig = {
			columns: _.map(uiService.getStandardConfigForListView().columns, function (column) {
				return _.merge({}, column, {editor: null, navigator: null});
			}),
			inputSearchMembers: ['code', 'DescriptionInfo']
		};
		var lookupOptions = {
			lookupType: 'CommonProduct',
			editable: 'false',
			valueMember: 'Id',
			displayMember: 'Code',
			title: 'productionplanning.common.assignProduct',
			uuid: 'e557aa2f1a804ffa9e8d4ca11d786bb6',
			defaultFilter: function (request) {
				request.projectId = lookupParamStorage.get('productionplanning.common.product', 'projectId');
				return request;
			},
			version: 3
		};
		var dataProvider = lookupFilterDialogDataService.createInstance({
			httpRoute: 'productionplanning/common/product/',
			endPointRead: 'lookup',
			usePostForRead: true,
			filterParam: {
				projectId: null,
				ppsItemId: null
			}
		});
		dataProvider.getItemByKey = function () {
			//getItemByIdAsync(); -- do not know the intend, -zov
		};

		registerLookupFilters();
		return new LookupFilterDialogDefinition(lookupOptions, dataProvider, filterFormConfig, gridConfig);
	}
})(angular);