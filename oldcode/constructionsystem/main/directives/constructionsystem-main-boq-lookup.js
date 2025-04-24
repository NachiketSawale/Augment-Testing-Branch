/**
 * Created by xsi on 2016-05-18.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('constructionSystemMainBoqLookup',
		['boqMainImageProcessor', 'constructionSystemMainBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
			function (boqMainImageProcessor, constructionSystemMainBoqLookupService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'BoqItem',
					valueMember: 'Id',
					displayMember: 'Reference',
					uuid: '6ccd5aa3382c48cb94f56407152816e3',
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
					},
					events: [
						{
							name: 'onSelectedItemChanged', // register event and event handler here.
							handler: function (e, args) {
								var selectedLineItem = args.entity;
								if (args.selectedItem && selectedLineItem) {
									selectedLineItem.BoqItemFk = args.selectedItem.Id;
									selectedLineItem.BoqHeaderFk = args.selectedItem.BoqHeaderFk;
								}
								// constructionSystemMainInstanceService.markItemAsModified(selectedLineItem);
							}
						}
					]
				};

				/* jshint -W064 */
				function ProcessData(dataList){
					for(var i=0; i<dataList.length; ++i){
						boqMainImageProcessor.processItem(dataList[i]);
						var boqItems=dataList[i].BoqItems;
						if(boqItems&&angular.isArray(boqItems)){
							ProcessData(boqItems);
						}
					}
					return dataList;
				}

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: {
						getList: function () {
							return constructionSystemMainBoqLookupService.getListAsync();
						},
						getItemByKey: function (value) {
							return constructionSystemMainBoqLookupService.getItemByIdAsync(value);
						},
						getDisplayItem: function (value) {
							return constructionSystemMainBoqLookupService.getItemByIdAsync(value);
						}
					},
					processData:ProcessData
				});
			}]);
})(angular);