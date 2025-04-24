(function(angular){
	/* global globals */
	'use strict';
	angular.module('estimate.main').directive('estimateMainAllowanceBoqItemLookup', ['_', '$q', '$injector', 'estimateMainCommonService', 'cloudCommonGridService', 'boqMainImageProcessor', 'estimateMainBoqItemService', 'BasicsLookupdataLookupDirectiveDefinition',
		'estimateMainBoqItemLookupColumns', 'platformTranslateService',
		function (_, $q, $injector, estimateMainCommonService, cloudCommonGridService, boqMainImageProcessor, estimateMainBoqItemService, BasicsLookupdataLookupDirectiveDefinition,estimateMainBoqItemLookupColumns, platformTranslateService) {

			let settings = estimateMainBoqItemLookupColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			function getBoqHeaderIdOfBoqAreaAssignmentSelected(){
				let areaBoqRangeSelected = $injector.get('estimateMainAllowanceBoqAreaAssigmentService').getSelected();
				return areaBoqRangeSelected ? (areaBoqRangeSelected.FromBoqHeaderFk || areaBoqRangeSelected.ToBoqHeaderFk) : null;
			}

			function getIsGcBoq(){
				let areaSelected = $injector.get('estimateMainAllowanceAreaService').getSelected();
				return (areaSelected && areaSelected.AreaType === 3);
			}

			let defaults = {
				uuid: 'D7A8681E1086403A92B2910BB879ED68',
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
				filter: function(items){
					// let areaSelected = $injector.get('estimateMainAllowanceAreaService').getSelected();
					let areaBoqRangeSelected = $injector.get('estimateMainAllowanceBoqAreaAssigmentService').getSelected();
					if(areaBoqRangeSelected && (areaBoqRangeSelected.FromBoqHeaderFk || areaBoqRangeSelected.ToBoqHeaderFk)){
						let boqHeaderFk = areaBoqRangeSelected.FromBoqHeaderFk || areaBoqRangeSelected.ToBoqHeaderFk;
						return _.filter(items, function(item){
							return item.BoqHeaderFk === boqHeaderFk;
						});
					}else{
						let areaSelected = $injector.get('estimateMainAllowanceAreaService').getSelected();

						if(areaSelected){
							return areaSelected.AreaType === 3 ? _.filter(items, function(item){ return item.IsGCBoq;}) : _.filter(items, function(item){ return !item.IsGCBoq;});
						}

						return items;
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedLineItem = args.entity;
							let lookupItem = args.selectedItem;

							// clear all items

							// add item
							if (lookupItem !== null) {
								selectedLineItem.BoqHeaderFk = lookupItem.BoqHeaderFk;
							}
						}
					}
				],
				onDataRefresh: function onDataRefresh($scope) {
					let boqHeaderId = getBoqHeaderIdOfBoqAreaAssignmentSelected();
					let isGcBoq = getIsGcBoq();
					estimateMainBoqItemService.getSearchList('',boqHeaderId, isGcBoq).then(function (data) {
						$scope.refreshData(data);
					});
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
							let boqHeaderId = getBoqHeaderIdOfBoqAreaAssignmentSelected();
							let isGcBoq = getIsGcBoq();
							estimateMainBoqItemService.getSearchList(searchStr, boqHeaderId, isGcBoq).then(function (data) {

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
})(angular);
