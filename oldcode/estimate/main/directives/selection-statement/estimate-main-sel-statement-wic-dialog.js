/**
 * Created by mov on 5/7/2018.
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainSelStatementWicDialog', [
		'$q','$injector', 'estimateMainCommonService','cloudCommonGridService','boqMainImageProcessor', 'boqWicItemService', 'BasicsLookupdataLookupDirectiveDefinition',
		'estimateMainWicItemLookupListColumns', 'platformTranslateService','estimateMainLineItemSelStatementListService',
		function ($q,$injector, estimateMainCommonService,cloudCommonGridService,boqMainImageProcessor, boqWicItemService, BasicsLookupdataLookupDirectiveDefinition,
			estimateMainWicItemLookupListColumns, platformTranslateService,estimateMainLineItemSelStatementListService) {

			let settings = estimateMainWicItemLookupListColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			let defaults = {
				uuid: 'a88e0578b3f54297b68a2688a03c5645',
				lookupType: 'wicselstatementboqitems',
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
							let selectedItem = args.entity;
							function assignItem (lineItem){
								lineItem.WicHeaderItemFk = args.selectedItem.BoqHeaderFk;
								lineItem.WicCatFk =  args.selectedItem.BoqWicCatFk;

								let selectedLineItems = estimateMainLineItemSelStatementListService.getSelectedEntities();
								if (selectedLineItems && selectedLineItems.length) {
									angular.forEach(selectedLineItems, function (Item) {
										Item.WicCatFk = args.selectedItem.BoqWicCatFk;
										Item.WicHeaderItemFk = args.selectedItem.BoqHeaderFk;
									});
								}

							}
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								selectedItem.WicHeaderItemFk = null;
								selectedItem.WicCatFk = null;
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
				onDataRefresh: function onDataRefresh($scope) {
					boqWicItemService.getSearchList('', 0).then(function(data){
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

					getDefault: function getDefault(){
						return $q.when({}); // TODO: return default
					},

					getItemByKey: function getItemByKey(value, options, scope) {
						if (_.isNumber(value)){
							return $q.when(boqWicItemService.getItemByIdAsync(value));
						}else{
							if (scope && scope.entity && scope.entity.BoqItemFk > 0){
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
							boqWicItemService.getSearchList(searchStr, 0).then(function(data){

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
