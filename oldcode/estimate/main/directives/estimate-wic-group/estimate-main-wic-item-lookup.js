/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */
(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainWicItemLookupListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'briefInfo',
						field: 'BriefInfo',
						name: 'Description',
						name$tr$: 'boq.main.Brief',
						formatter: 'translation',
						readonly: true
					},
					{
						id: 'reference',
						field: 'Reference',
						name: 'Reference',
						name$tr$: 'boq.main.Reference',
						readonly: true,
						width: 100
					},
					{
						id: 'reference2',
						field: 'Reference2',
						name: 'Reference2',
						name$tr$: 'boq.main.Reference2',
						readonly: true,
						width: 100
					},
					{
						id: 'basUomFk',
						field: 'BasUomFk',
						name: 'BasUomFk',
						toolTip: 'QuantityUoM',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						directive: 'basics-lookupdata-uom-lookup'
					}
				]
			};
		}
	});

	angular.module(moduleName).directive('estimateMainWicItemLookup', [
		'$q', '$injector', 'estimateMainCommonService', 'cloudCommonGridService', 'boqMainImageProcessor', 'boqWicItemService', 'BasicsLookupdataLookupDirectiveDefinition',
		'estimateMainWicItemLookupListColumns', 'platformTranslateService', 'estimateMainService',
		function ($q, $injector, estimateMainCommonService, cloudCommonGridService, boqMainImageProcessor, boqWicItemService, BasicsLookupdataLookupDirectiveDefinition,
			estimateMainWicItemLookupListColumns, platformTranslateService, estimateMainService) {

			let settings = estimateMainWicItemLookupListColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			let defaults = {
				uuid: '7EC94AD09A914EBBB5DA1DDC49515991',
				lookupType: 'wicboqitems',
				valueMember: 'Id',
				displayMember: 'Reference',
				resizeable: true,
				minWidth: '900px',
				maxWidth: '90%',
				height: '700px',
				columns: angular.copy(estimateMainWicItemLookupListColumns.getStandardConfigForListView().columns),
				dialogOptions: {
					headerText: 'Assign Templates',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/esimate-main-wic-item-lookup-dialog.html',
					// controller: 'estimateMainWicItemLookupDialogController'
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

							function assignItem(lineItem) {
								// lineItem.WicBoqItemFk = args.selectedItem.Id;
								lineItem.BoqWicCatFk = args.selectedItem.BoqWicCatFk;
								lineItem.WicBoqHeaderFk = args.selectedItem.BoqHeaderFk;
								estimateMainService.markItemAsModified(lineItem);

								// for bulkEditor: make sure the BoqWicCatFk can be updated.
								let selectedLineItems = estimateMainService.getSelectedEntities();
								if (selectedLineItems && selectedLineItems.length) {
									angular.forEach(selectedLineItems, function (Item) {
										Item.BoqWicCatFk = args.selectedItem.BoqWicCatFk;
										Item.WicBoqHeaderFk = args.selectedItem.BoqHeaderFk;
									});
								}

								//  let estMainValidationService = $injector.get('estimateMainValidationService');
								// estMainValidationService.validateWicBoqItemFk(lineItem, args.selectedItem.Id, 'WicBoqItemFk');
							}

							// clear all items
							if (e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1) {
								if (selectedLineItem) {
									selectedLineItem.WicBoqItemFk = null;
									selectedLineItem.BoqWicCatFk = null;
									selectedLineItem.WicBoqHeaderFk = null;
									estimateMainService.markItemAsModified(selectedLineItem);
									let estMainValidationService = $injector.get('estimateMainValidationService');
									estMainValidationService.validateWicBoqItemFk(args.entity, 0, 'WicBoqItemFk');
								}
							}
							// add item
							else if (args.selectedItem !== null) {
								if (selectedLineItem) {
									assignItem(selectedLineItem);
								} else {
									let selectedLineItems = estimateMainService.getSelectedEntities();
									if (selectedLineItems && selectedLineItems.length) {
										angular.forEach(selectedLineItems, function (lineItem) {
											assignItem(lineItem);
										});
									}
								}
							}
						}
					}
				],
				onDataRefresh: function onDataRefresh($scope) {
					boqWicItemService.getSearchList('', 0).then(function (data) {
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'wicBoqItemLookupHandler',

					getList: function getList() {
						return boqWicItemService.getSearchList(null, null);
					},

					getDefault: function getDefault() {
						return $q.when({}); // TODO: return default
					},

					getItemByKey: function getItemByKey(value, options, scope) {
						if (_.isNumber(value)) {
							return $q.when(boqWicItemService.getItemByIdAsync(value));
						} else {
							if (scope && scope.entity && scope.entity.BoqItemFk > 0) {
								return $q.when(boqWicItemService.getItemByIdAsync(scope.entity.BoqItemFk));
							}
							return $q.when();
						}
					},

					getSearchList: function getSearchList(searchString, displayMember, scope, searchListSettings) {
						let defer = $q.defer();
						let searchStr = _.get(searchListSettings, 'searchString');
						if (searchStr) {
							searchStr = searchStr && searchStr.length > 0 ? searchStr.toLowerCase() : '';
							boqWicItemService.getSearchList(searchStr, 0).then(function (data) {

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
