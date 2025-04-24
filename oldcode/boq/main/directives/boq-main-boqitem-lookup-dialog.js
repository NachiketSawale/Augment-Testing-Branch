/**
 * Created by xia on 4/11/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainBoqSearchDialog
	 * @requires  estimateMainBoqLookupService
	 * @description dropdown lookup grid to select the boq reference item
	 */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('boqMainBoqItemLookupDialog', ['$injector', 'boqMainImageProcessor', 'estimateMainBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService',
		function ($injector, boqMainImageProcessor, estimateMainBoqLookupService, BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService) {
			var defaults = {
				lookupType: 'boqitemlookup',
				valueMember: 'Id',
				displayMember: 'Reference',
				isClientSearch: true,
				isExactSearch: true,
				uuid: 'f068ac8be1714d05aec0b8de825cd923',
				columns: [
					{id: 'ref', field: 'Reference', name: 'Reference', width: 100, toolTip: 'Reference', formatter: 'description', name$tr$: 'boq.main.Reference'},
					{id: 'brief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'},
					{id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'number', name$tr$: 'cloud.common.entityQuantity'},
					{
						id: 'qtyuom', field: 'BasUomFk', name: 'BasUomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
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
					dataProcessor: function (dataList) {
						var output = [];
						cloudCommonGridService.flatten(dataList, output, 'BoqItems');
						for (var i = 0; i < output.length; ++i) {
							boqMainImageProcessor.processItem(output[i]);
						}
						return dataList;
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (/* e, args */) {
							// var selectedLineItem = args.entity;
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
