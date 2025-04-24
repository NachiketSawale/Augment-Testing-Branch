
// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */
	angular.module(moduleName).controller('constructionsystemMainLineItemController', [
		'$scope','$http', '$injector', 'platformControllerExtendService', 'platformGridAPI','constructionsystemMainLineItemDynamicConfigurationService',
		'constructionsystemMainCompareFlags', 'constructionsystemMainLineItemDataEditService','estimateMainService',
		'constructionSystemMainInstanceService', 'constructionsystemMainCommonLookupService', 'constructionsystemMainValidationService',
		'$translate','constructionsystemMainConfigDialogService','constructionsystemMainResourceDataService',
		'estimateMainRefLineItemService','$q','constructionsystemMainLineItemService',
		'estimateMainCommonCalculationService', 'constructionSystemHighlightToggleService',
		function ($scope, $http, $injector, platformControllerExtendService, platformGridAPI, uiDynamicConfigurationService,
			compareFlags, constructionsystemMainLineItemDataEditService,estimateMainService,
			constructionSystemMainInstanceService,cosMainCommonLookupService, constructionsystemMainValidationService,
			$translate,constructionsystemMainConfigDialogService,constructionsystemMainResourceDataService,
			estimateMainRefLineItemService,$q,constructionsystemMainLineItemService,
			estimateMainCommonCalculationService, constructionSystemHighlightToggleService
		) {



			/* var dataServiceName = $scope.getContentValue('dataService');
			var dataService = $injector.get(dataServiceName); */

			constructionsystemMainLineItemDataEditService.getDataService(constructionsystemMainLineItemService);


			var myGridConfig = {
				initCalled: false, columns: [],
				type: 'lineitems',

				cellChangeCallBack: function (arg) {
					var column = arg.grid.getColumns()[arg.cell];
					var field = arg.grid.getColumns()[arg.cell].field;

					// eslint-disable-next-line no-unused-vars
					var row = arg.grid.getSelectedRows();
					// highlightModifiedFieldsUserEdited(arg.item,row);
					constructionsystemMainLineItemDataEditService.fieldChange(arg.item, field, column);
					// arg.item.CompareFlag = compareFlags.modified;
					// arg.item.changedProperties = [field];



				},
				rowChangeCallBack: function rowChangeCallBack() {
				// reload resources if container not open
					var resourceContainerGridId = '51543C12BB2D4888BC039A5958FF8B96';

					// eslint-disable-next-line no-unused-vars
					var exists = platformGridAPI.grids.exist(resourceContainerGridId);
					/* if (!exists) {
			           // constructionsystemMainResourceDataService.load();
			            var selectedLineItem = constructionsystemMainLineItemService.getSelected();
			            constructionsystemMainResourceDataService.hasToLoadOnSelectionChange(selectedLineItem);
			            if (selectedLineItem) {
				            estimateMainRefLineItemService.getRefBaseResources(selectedLineItem, false).then(function (resList) {
					            calculate(resList, true);
					            constructionsystemMainResourceDataService.updateList(resList, true);

					           /!* //get and set resource characteristics
					            var resCharsService = $injector.get('estimateMainResourceCharacteristicsService');
					            resCharsService.getResourceCharacteristicsByLineItem(selectedLineItem.EstHeaderFk, selectedLineItem.EstLineItemFk).then(function(response){
						            resCharsService.setDynamicColumnsLayout({ dynamicColumns: { Characteristics: response.data}, dtos: resList });
					            });*!/

					            var defer = $q.defer();
					            defer.resolve($injector.get('constructionsystemMainResourceDataService').gridRefresh());
					            return defer.promise;

				            });
			            }
		            } */

				},
				costGroupConfig:{
					dataLookupType: 'LineItem2CostGroups',
					identityGetter: function (entity) {
						return {
							RootItemId: entity.EstHeaderFk,
							MainItemId: entity.Id
						};
					}
				}
			};

			platformControllerExtendService.initListController($scope, uiDynamicConfigurationService, constructionsystemMainLineItemService, constructionsystemMainValidationService, myGridConfig);

			var tools = [
				{
					id: 'modalConfig',
					caption: $translate.instant('constructionsystem.main.column.title'),
					type: 'item',
					cssClass: 'tlb-icons ico-settings-doc',
					fn: function() {
						constructionsystemMainConfigDialogService.setUsageContext(moduleName);
						constructionsystemMainConfigDialogService.showDialog();
					},
					disabled: function () {
						return false;// return !!estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission();
					}
				}
			];

			$scope.addTools(tools);

			/**
			 * set cell css style for the modified fields
			 */
			/* function highlightModifedFields() {
				var items = dataService.getList();

				if (_.isEmpty(items) || items[0].CompareFlag === compareFlags.noComparison) {
					return;
				}

				if (gridIsReady($scope.gridId)) {
					var localgrid = platformGridAPI.grids.element('id', $scope.gridId);
					var result = {};

					//set css for each item's changed properties
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						var cssobject = {};

						if (item && item.changedProperties ) {
							item.changedProperties.map(function (field) { //jshint ignore: line
								//noinspection JSReferencingMutableVariableFromClosure
								cssobject[field.toLowerCase()] = compareFlags.cellCss.modified;
							}); // jshint ignore:line
							result[i] = {};
							angular.extend(result[i], cssobject);
						}
					}

					// Add CSS classes for all changed properties (remove old css)
					localgrid.instance.setCellCssStyles('changedLineItemFields', result);
					platformGridAPI.grids.refresh($scope.gridId);
				}
			} */

			/* function highlightModifiedFieldsUserEdited(item,row) {
				var items = [item];

				if (_.isEmpty(items)) {
					return;
				}

				if (gridIsReady($scope.gridId)) {
					var localgrid = platformGridAPI.grids.element('id', $scope.gridId);
					var result = {};

					//set css for each item's changed properties
					for (var i = 0; i < items.length; i++) {
						item = items[i];
						var cssobject = {};

						if (item && item.changedProperties ) {
							item.changedProperties.map(function (field) { //jshint ignore: line
								//noinspection JSReferencingMutableVariableFromClosure
								cssobject[field.toLowerCase()] = compareFlags.cellCss.modified;
							}); // jshint ignore:line
							result[row] = {};
							angular.extend(result[row], cssobject);
						}
					}

					// Add CSS classes for all changed properties (remove old css)
					localgrid.instance.setCellCssStyles('changedLineItemFields', result);
					platformGridAPI.grids.refresh($scope.gridId);
				}
			} */

			// eslint-disable-next-line no-unused-vars
			function gridIsReady(gridid) {
				var localgrid;
				var result = false;
				if (platformGridAPI.grids.exist(gridid)) {
					localgrid = platformGridAPI.grids.element('id', gridid);
					if (localgrid.instance && localgrid.dataView) {
						result = true;
					}
					constructionsystemMainLineItemService.setOnBeforeFunction(onBeforeEditCell);
					constructionsystemMainLineItemService.setGridId(gridid);

				}
				return result;
			}

			function onBeforeEditCell(e,args){
				var selectedColumn = args.column.field;
				angular.forEach(args.item,function (value,key) {
					if(selectedColumn === key){
						constructionsystemMainLineItemDataEditService.setSelectedLineItemColumnValue(value);
						constructionsystemMainLineItemDataEditService.setSelectedFieldItem({
							SelectedColumn:key,
							ValueOfColumn: value
						});
					}
				});

				var cosInstance = constructionSystemMainInstanceService.getSelected();

				var cosInstanceModified = cosInstance.IsUserModified;

				if(cosInstanceModified === null){
					cosInstanceModified = false;
				}

				return cosInstanceModified === true;

			}

			function calculate(resList, isRef){
				var selectedLineItem = constructionsystemMainLineItemService.getSelected();
				// var flatResList = [];
				// cloudCommonGridService.flatten(resList, flatResList, 'EstResources');
				estimateMainCommonCalculationService.calcResNLineItem(resList, selectedLineItem, isRef);
				constructionsystemMainLineItemService.fireItemModified(selectedLineItem);

				// fix defect 90413, Activating grouping function, any modifications would not showing on the Line item immediately
				var cosMainGridId = 'efec989037bc431187bf166fc31666a0';
				var grid = platformGridAPI.grids.element('id', cosMainGridId);

				var gridDatas = grid.dataView.getRows();
				if(_.find(gridDatas, {__group : true})){
					var changed = false;
					for(var index = 0; index < gridDatas.length; index++){
						var gridData=gridDatas[index];
						if(gridData.Id === selectedLineItem.Id ) {
							changed = true;
						}
					}

					setTimeout(function () {
						if(changed){
							constructionsystemMainLineItemService.gridRefresh();
						}

					}, 0);
				}
			}

			let constructionsystemMainDynamicUserDefinedColumnService = $injector.get('constructionsystemMainDynamicUserDefinedColumnService');
			constructionsystemMainDynamicUserDefinedColumnService.initReloadFn();

			function setDynamicColumnsLayoutToGrid(){
				uiDynamicConfigurationService.applyToScope($scope);
			}
			uiDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

			function onInitialized() {
				constructionsystemMainDynamicUserDefinedColumnService.loadDynamicColumns();
			}
			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

			constructionsystemMainResourceDataService.calcResources.register(calculate);

			constructionsystemMainLineItemService.registerSelectedEntitiesChanged(setLineItemSelectionOnViewer);

			function setLineItemSelectionOnViewer() {
				var selectedItems = constructionsystemMainLineItemService.getSelectedEntities();

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/getall', selectedItems.map(function (selectedItem) {
					return {
						EstHeaderFk: selectedItem.EstHeaderFk,
						EstLineItemFk: selectedItem.Id
					};
				})).then(function (res) {
					constructionSystemHighlightToggleService.setLineItemSelectionOnViewer(res.data);
				});
			}

			function highlight(id, item) {
				if (item.value) {
					var selectedItems = constructionsystemMainLineItemService.getSelectedEntities();

					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/getall', selectedItems.map(function (selectedItem) {
						return {
							EstHeaderFk: selectedItem.EstHeaderFk,
							EstLineItemFk: selectedItem.Id
						};
					})).then(function (res) {
						constructionSystemHighlightToggleService.toggleHighlight(res.data,
							constructionSystemHighlightToggleService.highlight.lineItem);
					});

				} else {
					constructionSystemHighlightToggleService.toggleHighlight([], '');
				}
			}

			var highlightAction = {
				id: 't1234',
				sort: 2,
				caption: $translate.instant('constructionsystem.main.toggleHighlight'),
				type: 'check',
				iconClass: 'tlb-icons ico-view-select',
				value: constructionSystemHighlightToggleService.highlight.isLineItem(),
				fn: highlight
			};

			var toggleHighlight = function toggleHighlight() {
				highlightAction.value = constructionSystemHighlightToggleService.highlight.isLineItem();
				$scope.tools.update();
			};

			$scope.addTools([highlightAction]);

			/**
			 * remove create buttons.
			 */
			_.remove($scope.tools.items, function (item) {
				return item.id === 'create';
			});
			$scope.tools.update();
			function registerUpdateTools(isUpdateDelete) {
				_.find($scope.tools.items, {id: 'delete'}).disabled = !isUpdateDelete;
				$scope.tools.update();
			}
			constructionsystemMainLineItemService.registerUpdateTools(registerUpdateTools);
			constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.register(toggleHighlight);

			$scope.$on('$destroy',function(){
				constructionsystemMainLineItemService.unRegisterUpdateTools(registerUpdateTools);
				constructionsystemMainResourceDataService.calcResources.unregister(calculate);

				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);
				constructionsystemMainLineItemService.unregisterSelectedEntitiesChanged(setLineItemSelectionOnViewer);
			});
		}
	]);
})(angular);
