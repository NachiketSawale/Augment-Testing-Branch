(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainBoqItemLookupColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{ id: 'ref', field: 'Reference', name: 'Reference', width:100, toolTip: 'Reference', formatter: 'description', name$tr$: 'boq.main.Reference'},
					{ id: 'ref2', field: 'Reference2', name: 'Reference2', width: 100, toolTip: 'Reference2', formatter: 'description', name$tr$: 'boq.main.Reference2'},
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'},
					{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity'},
					{
						id: 'qtyuom',
						field: 'BasUomFk',
						name: 'BasUomFk',
						width: 120,
						toolTip: 'QuantityUoM',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				]
			};
		}
	});

	angular.module(moduleName).directive('estimateMainBoqItemLookup', [
		'$q', '$injector', 'estimateMainCommonService', 'cloudCommonGridService', 'boqMainImageProcessor', 'estimateMainBoqItemService', 'BasicsLookupdataLookupDirectiveDefinition',
		'estimateMainBoqItemLookupColumns', 'platformTranslateService', 'estimateMainService',
		function ($q, $injector, estimateMainCommonService, cloudCommonGridService, boqMainImageProcessor, estimateMainBoqItemService, BasicsLookupdataLookupDirectiveDefinition,estimateMainBoqItemLookupColumns, platformTranslateService, estimateMainService) {

			let settings = estimateMainBoqItemLookupColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			let defaults = {
				uuid: '0A28716177894263BF42E3B02FA44807',
				lookupType: 'estboqitems',
				valueMember: 'Id',
				displayMember: 'Reference',
				resizeable: true,
				minWidth: '900px',
				maxWidth: '90%',
				height: '700px',
				columns: angular.copy(estimateMainBoqItemLookupColumns.getStandardConfigForListView().columns),
				dialogOptions: {
					headerText: 'Assign Templates',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/esimate-main-boq-item-lookup-dialog.html',
					controller: 'basicsLookupdataGridDialogController'
				},
				popupOptions: {
					width: 420,
					height: 300,
					templateUrl: 'grid-popup-lookup.html',
					footerTemplateUrl: 'lookup-popup-footer.html',
					controller: 'basicsLookupdataGridPopupController',
					showLastSize: true
				},
				disableDataCaching: true,
				treeOptions: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedLineItem = args.entity;
							let lookupItem = args.selectedItem;
							function assignItem (lineItem){
								lineItem.OldBoqHeaderFk = angular.copy(lineItem.BoqHeaderFk);
								lineItem.BoqHeaderFk = lineItem.BoqHeaderItemFk = lookupItem.BoqHeaderFk;
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
				onDataRefresh: function onDataRefresh($scope) {
					estimateMainBoqItemService.getSearchList('',null).then(function (data) {
						let output = [];
						cloudCommonGridService.flatten(data, output, 'BoqItems');
						for (let i = 0; i < output.length; ++i) {
							boqMainImageProcessor.processItem(output[i]);
						}
						$scope.refreshData(data);
					});
				},

				resolveStringValueCallback: function resolveStringValueCallback(options) {
					return function (value){
						let filterParams = {
							codeProp: 'Reference',
							descriptionProp: 'Reference',
							isSpecificSearch: null,
							searchValue: value,
						};
						let boqItemsCopy = estimateMainBoqItemService.getSearchList(null,value, null);

						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, boqItemsCopy, 'BoqItems', 'BoqItemFk', true);

						const lowercaseValue = value.toLowerCase();

						const filteredItem = _.find(existItems, (item) => item.Code === value) || _.find(existItems, (item) => item.Code.toLowerCase() === lowercaseValue);

						if (filteredItem) {
							return {
								apply: true,
								valid: true,
								value: filteredItem.Id,
							};
						} else {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'Not found!'
							};
						}
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'estimateMainBoqItemLookupHandler',

					getList: function getList() {
						return estimateMainBoqItemService.getSearchList(null, null);
					},

					getDefault: function getDefault() {
						return $q.when({}); // TODO: return default
					},

					getItemByKey: function getItemByKey(value) {
						let item = estimateMainBoqItemService.getItemById(value);
						return $q.when(item);
					},

					getSearchList: function getSearchList(searchString, displayMember, scope, searchListSettings) {
						let defer = $q.defer();
						let searchStr = _.get(searchListSettings, 'searchString');
						if (searchStr) {
							searchStr = searchStr && searchStr.length > 0 ? searchStr.toLowerCase() : '';
							estimateMainBoqItemService.getSearchList(searchStr,null).then(function (data) {

								let output = [];
								cloudCommonGridService.flatten(data, output, 'BoqItems');
								for (let i = 0; i < output.length; ++i) {
									boqMainImageProcessor.processItem(output[i]);
								}
								defer.resolve(output);
							});
							return defer.promise;
						} else {
							return $q.when([]);
						}
					}
				}
			});
		}
	]);
})();
