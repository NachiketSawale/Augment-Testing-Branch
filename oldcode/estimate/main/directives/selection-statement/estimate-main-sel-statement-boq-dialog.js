/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainSelStatementBoqDialog
	 * @requires  estimateMainBoqLookupService
	 * @description dropdown lookup grid to select the boq reference item in selection statement container
	 */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('estimateMainSelStatementBoqDialog',['$injector', 'boqMainImageProcessor', 'estimateMainLineItemSelStatementListService', 'estimateMainBoqService', 'estimateMainBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService',
		function ($injector, boqMainImageProcessor, estimateMainLineItemSelStatementListService, estimateMainBoqService, estimateMainBoqLookupService, BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService) {
			let defaults = {
				lookupType: 'estselstatementboqitems',
				valueMember: 'Id',
				displayMember: 'Reference',
				isClientSearch: true,
				isExactSearch: true,
				uuid: 'c51eeb2dfc364713b1cba17fdca38b64',
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
							let selectedItem = args.entity;
							function assignItem (item){
								item.BoqHeaderItemFk = args.selectedItem.BoqHeaderFk;
							}
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								selectedItem.BoqHeaderItemFk = null;
							}
							// add item
							else if (args.selectedItem !== null) {
								if (selectedItem) {
									assignItem(selectedItem);
								} else {
									let selectedItems = estimateMainLineItemSelStatementListService.getSelectedEntities();
									if (selectedItems && selectedItems.length) {
										angular.forEach(selectedItems, function (item) {
											assignItem(item);
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

					getItemByKey: function (value) {
						return estimateMainBoqLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateMainBoqLookupService.getItemByIdAsync(value);
					},

					getSearchList: function (value) {
						return estimateMainBoqLookupService.getSearchList(value);
					}
				}
			});
		}]);
})(angular);
