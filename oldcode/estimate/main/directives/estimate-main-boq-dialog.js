/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainBoqSearchDialog
	 * @requires  estimateMainBoqLookupService
	 * @description dropdown lookup grid to select the boq reference item
	 */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('estimateMainBoqDialog',['$injector', 'boqMainImageProcessor', 'estimateMainService', 'estimateMainBoqService', 'estimateMainBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService',
		function ($injector, boqMainImageProcessor, estimateMainService, estimateMainBoqService, estimateMainBoqLookupService, BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService) {
			let defaults = {
				lookupType: 'estboqitems',
				valueMember: 'Id',
				displayMember: 'Reference',
				isClientSearch: true,
				// changed isExactSearch from true to false causing issue ALM task  103703
				isExactSearch: false,
				uuid: 'f068ac8be1714d05aec0b8de825cd97f',
				columns:[
					{ id: 'ref', field: 'Reference', name: 'Reference', width:100, toolTip: 'Reference', formatter: 'description', name$tr$: 'boq.main.Reference'},
					{ id: 'ref2', field: 'Reference2', name: 'Reference2', width: 100, toolTip: 'Reference2', formatter: 'description', name$tr$: 'boq.main.Reference2'},
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'},
					{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity'},
					{ id: 'qtyuom', field: 'BasUomFk', name: 'BasUomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}}
				],
				title: {
					name: 'Boqs',
					name$tr$: 'estimate.main.boqContainer'
				},
				treeOptions: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					dataProcessor : function (dataList) {
						let output = [];
						cloudCommonGridService.flatten(dataList, output, 'BoqItems');
						for (let i = 0; i < output.length; ++i) {
							boqMainImageProcessor.processItem(output[i]);
						}
						// return output;
						return dataList;
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let selectedLineItem = args.entity;
							let lookupItem = args.selectedItem;
							function assignItem (lineItem){
								lineItem.OldBoqHeaderFk = angular.copy(lineItem.BoqHeaderFk);
								lineItem.BoqHeaderFk = lookupItem.BoqHeaderFk;
								lineItem.IsIncluded = lookupItem.Included;
								lineItem.IsFixedPrice = lookupItem.IsFixedPrice;
								estimateMainService.markItemAsModified(lineItem);
							}
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								if(selectedLineItem) {
									selectedLineItem.OldBoqHeaderFk = angular.copy(selectedLineItem.BoqHeaderFk);
									if(!selectedLineItem.BoqSplitQuantityFk) {
										selectedLineItem.BoqHeaderFk = null;
										selectedLineItem.IsFixedPrice = 0;
										estimateMainService.markItemAsModified(selectedLineItem);
									}
								}
							}
							// add item
							else if (lookupItem !== null) {
								let selectedLineItems;
								if (selectedLineItem) {
									assignItem(selectedLineItem);

									selectedLineItems = estimateMainService.getSelectedEntities();
									if (selectedLineItems && selectedLineItems.length) {
										angular.forEach(selectedLineItems, function (item) {
											item.BoqHeaderFk = lookupItem.BoqHeaderFk;
											item.IsIncluded = lookupItem.Included;
											item.IsFixedPrice = lookupItem.IsFixedPrice;
										});
									}
								}
							}
						}
					}
				],
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					return searchValue;
				},
				onDataRefresh: function ($scope) {
					estimateMainBoqLookupService.loadData().then(function (data) {
						estimateMainBoqLookupService.clear();
						estimateMainBoqLookupService.setLookupData(data);
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'EstimateMainBoqLookupDataHandler',

					getList: function () {
						return estimateMainBoqLookupService.getListAsync();
					},

					getItemByKey: function (value,options) {
						return estimateMainBoqLookupService.getItemByIdAsync(value,options);
					},

					getDisplayItem: function (value,options) {
						return estimateMainBoqLookupService.getItemByIdAsync(value,options);
					},

					getSearchList: function (value) {
						return estimateMainBoqLookupService.getSearchList(value);
					}
				},

			});
		}]);
})(angular);
