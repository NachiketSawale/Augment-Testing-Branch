
(function (angular) {
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2StockLayout', Site2StockLayout);
	Site2StockLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService'];
	function Site2StockLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService) {
		return {
			'fid': 'basics.site.site2StockLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['prjstockfk', 'prjstocklocationfk', 'isdefault', 'isproductionstock', 'iscomponentmaterialstock', 'isactualstock', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				prjstockfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-site-stock-lookup-dialog',
							lookupOptions: {
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription',
									width: 200
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectStockNew',
							displayMember: 'Code',
							version: 3
						}
					}
				},
				/*
				prjstocklocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectStockLocationLookupDataService',
					enableCache: true,
					valMember: 'Id',
					dispMember: 'Code',
					filter: function (item) {
						var prj;
						if (item) {
							prj = item.PrjStockFk;
						}
						return prj;
					}
				}),
*/
				'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
					'projectFk': 'ProjectFk',
					projectFkReadOnly: true,
					getAdditionalEntity: function () {
						let prj = null;
						return {'ProjectFk' : prj};
					}
				}, {
					'projectStockFk': 'PrjStockFk',
					projectStockFkReadOnly: true,
					getAdditionalEntity: function (item) {
						return item;
					}
				}]),

			}
		};
	}
})(angular);
