
(function (angular) {
	'use strict';
	/* global globals,angular */
	var moduleName = 'productionplanning.formulaconfiguration';
	globals.lookups.PpsBoqItem = function ($injector){
		var ppsPlannedQuantityMainBoqLookupService = $injector.get('ppsPlannedQuantityMainBoqLookupService');
		var boqMainImageProcessor = $injector.get('boqMainImageProcessor');
		return{
			lookupOptions:{
				lookupType: 'PpsBoqItem',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: 'eff98df43e9c48fd92db5e24c38009e8',
				columns: [
					{
						id: 'ref',
						field: 'Reference',
						name: 'Reference',
						width: 100,
						toolTip: 'Reference',
						formatter: 'description',
						name$tr$: 'boq.main.Reference'
					},
					{
						id: 'brief',
						field: 'BriefInfo',
						name: 'Brief',
						width: 120,
						toolTip: 'Brief',
						formatter: 'translation',
						name$tr$: 'boq.main.BriefInfo'
					}
				],
				showClearButton: true,
				treeOptions: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			},
			dataProvider: {
				getList: function () {
					return ppsPlannedQuantityMainBoqLookupService.getListAsync();
				},
				getItemByKey: function (value) {
					return ppsPlannedQuantityMainBoqLookupService.getItemByIdAsync(value);
				},
				getDisplayItem: function (value) {
					return ppsPlannedQuantityMainBoqLookupService.getItemByIdAsync(value);
				}
			},
			processData:	function ProcessData(dataList){
				for(var i=0; i<dataList.length; ++i){
					boqMainImageProcessor.processItem(dataList[i]);
					var boqItems=dataList[i].BoqItems;
					if(boqItems&&angular.isArray(boqItems)){
						ProcessData(boqItems);
					}
				}
				return dataList;
			}
		};
	};

	angular.module(moduleName).directive('ppsPlannedQuantityMainBoqLookup',
		['$injector',  'BasicsLookupdataLookupDirectiveDefinition',
			function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = globals.lookups.PpsBoqItem($injector);
				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
					dataProvider:defaults.dataProvider,
					processData:defaults.processData
				});
			}]);
})(angular);