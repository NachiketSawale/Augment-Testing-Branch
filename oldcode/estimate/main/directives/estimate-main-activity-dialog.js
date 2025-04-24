/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainActivityLookup
	 * @requires  estimateMainActivityLookupService
	 * @description dropdown lookup grid to select the project activity item
	 */
	angular.module(moduleName).directive('estimateMainActivityDialog',['$http', 'schedulingMainActivityImageProcessor', 'estimateMainService', 'estimateMainActivityLookupService',
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainLookupStateService', 'cloudCommonGridService',
		function ($http, schedulingMainActivityImageProcessor, estimateMainService, estimateMainActivityLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateMainLookupStateService, cloudCommonGridService) {
			let defaults = {
				lookupType: 'estlineitemactivity',
				valueMember: 'Id',
				displayMember: 'Code',
				isClientSearch: true,
				isExactSearch: false,
				uuid: 'e303a290641c4d048278064ecbad70cd',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 70,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'dec',
						field: 'Description',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'qty',
						field: 'Quantity',
						name: 'Quantity',
						width: 120,
						toolTip: 'Quantity',
						formatter: 'quantity',
						name$tr$: 'cloud.common.entityQuantity'
					},
					{
						id: 'qtyuom',
						field: 'QuantityUoMFk',
						name: 'QuantityUoMFk',
						width: 120,
						toolTip: 'QuantityUoM',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				],
				title: {
					name: 'Activities',
					name$tr$: 'estimate.main.activityContainer'
				},
				treeOptions: {
					parentProp: 'ParentActivityFk',
					childProp: 'Activities',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					dataProcessor : function (dataList) {
						let output = [];
						cloudCommonGridService.flatten(dataList, output, 'Activities');
						for (let i = 0; i < output.length; ++i) {
							schedulingMainActivityImageProcessor.processItem(output[i]);
						}
						return dataList;
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let selectedLineItem = args.entity,
								selectedItem = args.selectedItem;
							if (!selectedItem) {
								return;
							}
							function assignItem (lineItem){
								lineItem.MdcControllingUnitFk = selectedItem.ControllingUnitFk ? selectedItem.ControllingUnitFk : lineItem.MdcControllingUnitFk;
								estimateMainService.markItemAsModified(lineItem);
							}
							if (selectedLineItem) {
								assignItem(selectedLineItem);
							}else{
								let selectedLineItems = estimateMainService.getSelectedEntities();
								if(selectedLineItems && selectedLineItems.length){
									angular.forEach(selectedLineItems, function(lineItem){
										assignItem(lineItem);
									});
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
					estimateMainActivityLookupService.loadAsync().then(function (data) {
						$scope.refreshData(data);
					});
				},
				selectableCallback: function (dataItem) {
					let isSelectable = true;
					if (dataItem && angular.isString(dataItem.Id) && dataItem.Id.indexOf(/[a-z]/i) === -1) {
						isSelectable = false;
						return isSelectable;
					}
					if (dataItem.ActivityTypeFk === 2 || dataItem.HasChildren || !angular.isDefined(dataItem.ActivityTypeFk)) {
						isSelectable = false;
					}
					return isSelectable;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'EstimateMainActivityLookupDataHandler',

					getList: function () {
						return estimateMainActivityLookupService.getListAsync();
					},

					getItemByKey: function (value,options) {
						return estimateMainActivityLookupService.getItemByIdAsync(value,options);
					},

					getDisplayItem: function (value,options) {
						return estimateMainActivityLookupService.getItemByIdAsync(value,options);
					},

					getSearchList: function (value) {
						return estimateMainActivityLookupService.getSearchList(value);
					}
				}
			});
		}]);
})(angular);
