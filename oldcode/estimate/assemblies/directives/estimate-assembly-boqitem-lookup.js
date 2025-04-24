/**
 * Created by benny on 18.09.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc directive
	 * @name estimateAssemblyBoqitemLookup
	 * @requires  BasicsLookupdataLookupDirectiveDefinition
	 * @description modal dialog window with list of boqitem records
	 */

	angular.module(moduleName).directive('estimateAssemblyBoqitemLookup',
		['boqMainImageProcessor','BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService', '_', function (imageProcessor, BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService, _) {
			let defaults = {
				lookupType: 'BoqItem',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: 'fb050b0ff370491abd62ee0d1590ce73',
				selectableCallback: function(dataItem, entity) {
					if(dataItem && entity){
						entity.BoqLineTypeFk = dataItem.BoqLineTypeFk;
						if(entity.EstAssemblyWicItem) {
							entity.EstAssemblyWicItem.BoqItemFk = dataItem.Id;
						}
					}
					return true;
				},
				columns: [
					{
						id: 'reference',
						field: 'Reference',
						name: 'Reference',
						formatter: 'description',
						name$tr$: 'cloud.common.entityReference'
					},
					{
						id: 'brief',
						field: 'BriefInfo.Translated',
						name: 'Brief',
						formatter: 'description',
						name$tr$: 'cloud.common.entityBrief'
					},
					{
						id: 'basuomfk',
						field: 'BasUomFk',
						name: 'BasUomFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						name$tr$: 'cloud.common.entityUoM'
					}
				],
				width: 1200,
				height: 800,
				title: {
					name: 'BoqItems',
					name$tr$: 'estimate.assemblies.lookups.boqItem'
				},
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					let searchString = 'Reference.Contains("%SEARCH%") Or BriefInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g,searchValue);
				},
				treeOptions: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					dataProcessor: function (dataList) {
						let output = [];
						cloudCommonGridService.flatten(dataList, output, 'BoqItems'); // Assemblies

						_.forEach(output, function (item) {
							imageProcessor.processItem(item);
						});
						return dataList;
					}
				},
				events: [{
					name: 'onSelectedItemChanged',
					handler: function selectedBoqHeaderChanged(e, args) {
						// only select item (BoqLineTypeFk) not division
						let lineitemtype = [0,200,201,202];

						if (args.selectedItem && args.entity && args.entity.EstAssemblyWicItem) {

							let correctlyType = true;
							if(angular.isDefined(args.selectedItem.BoqLineTypeFk)) {
								// set entity BoqLineTypeFk using in validation
								args.entity.BoqLineTypeFk = args.entity.EstAssemblyWicItem.BoqLineTypeFk = args.selectedItem.BoqLineTypeFk;
								correctlyType = _.includes(lineitemtype, args.selectedItem.BoqLineTypeFk);
							}
							if(correctlyType) {
								args.entity.EstAssemblyWicItem.BoqItemFk = args.selectedItem.Id;
								args.entity.BriefInfo = args.selectedItem.BriefInfo.Translated;
								args.entity.UomFk = args.selectedItem.BasUomFk;
							}
							else{
								args.entity.BoqItemFk = null;
								args.entity.EstAssemblyWicItem.BoqItemFk = null;
								args.entity.BriefInfo = null;
								args.entity.UomFk = null;
							}
						}
						else if (!args.selectedItem && args.entity && args.entity.EstAssemblyWicItem) {
							args.entity.BoqItemFk = null;
							args.entity.EstAssemblyWicItem.BoqItemFk = null;
						}
					}
				}]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
		]);
})(angular);
