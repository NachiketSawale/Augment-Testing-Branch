/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainResourceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W074 */
	angular.module(moduleName).controller('estimateMainResourceListController',
		['$injector','$scope','$timeout', 'platformGridControllerService', 'estimateDefaultGridConfig', 'estimateMainResourceService', 'estimateMainResourceDynamicConfigurationService',
			'estimateMainService', 'estimateMainCommonService', 'estimateMainResourceValidationService', 'cloudCommonGridService', 'platformGridAPI',
			'platformModalService', 'estimateMainResourceProcessor', 'estimateMainSubItemCodeGenerator', 'estimateMainResourceImageProcessor',
			'estimateMainClipboardService','estimateMainConfigDetailService', 'estimateMainCommonCalculationService', 'estimateMainCalculatorService','estimateMainDynamicColumnService',
			'estimateMainExchangeRateService','estimateMainResourceFilterService', 'estimateMainGenerateSortingService', 'estimateMainResourceDetailService', 'platformDragdropService','estimateMainResourceType',
			function ($injector,$scope,$timeout, platformGridControllerService, estimateDefaultGridConfig, estimateMainResourceService, estimateMainResourceDynamicConfigurationService,
				estimateMainService, estimateMainCommonService, estimateMainResourceValidationService, cloudCommonGridService, platformGridAPI,
				platformModalService, estimateMainResourceProcessor, estimateMainSubItemCodeGenerator, estimateMainResourceImageProcessor,
				estimateMainClipboardService,estimateMainConfigDetailService, estimateMainCommonCalculationService, estimateMainCalculatorService,estimateMainDynamicColumnService,
				estimateMainExchangeRateService, estimateMainResourceFilterService, estimateMainGenerateSortingService, estimateMainResourceDetailService, platformDragdropService,estimateMainResourceType) {

				// let resList = [];
				let isSorted = false;
				let gridConfig = angular.extend({
					parentProp: 'EstResourceFk',
					childProp: 'EstResources',
					childSort: true,
					type: 'resources',
					dragDropService: estimateMainClipboardService,
					allowedDragActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell];
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						estimateMainResourceDetailService.fieldChange(arg.item, field, column);

						// when cost code has characteristic, reset the focus
						if (estimateMainResourceService.getHasCostCodeCharac() && field === 'Code') {
							let getReadonlyItems = function getReadonlyItems(itemsReadonly, column) {
								return _.find(itemsReadonly, function (itemReadonly) {
									if (column.lookupDisplayColumn || column.IsReadonly) {
										return true;
									} else if (itemReadonly.field.toLowerCase() === column.id) {
										return true;
									} else if (itemReadonly.field === column.filed) {
										return true;
									}
								});
							};

							let columns = arg.grid.getColumns();
							let count = arg.cell + 1;
							if (arg.item) {
								let itemsReadonly = arg.item.__rt$data.readonly;
								for (let i = count; i < columns.length; i++) {
									let nextItemReadonly = getReadonlyItems(itemsReadonly, columns[i]);
									if ((nextItemReadonly && nextItemReadonly.readonly) || (columns[i].keyboard && !columns[i].keyboard.enter) ||
										columns[i].editor === null) {
										count++;
									} else {
										break;
									}
								}
							}

							let options = {
								item: arg.item,
								cell: count,
								forceEdit: true
							};

							estimateMainResourceService.setCellFocus(options);
							estimateMainResourceService.setHasCostCodeCharac(false);
						}

						// TODO: not merge, use the 1 column description
						/* merge cell: type is I/T */
						/* let item = arg.item;
						if (item.EstResourceTypeFk === estimateMainResourceType.TextLine || item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine) {
							estimateMainCommonService.setMergeCell(item, $scope.gridId);
							platformGridAPI.grids.invalidate($scope.gridId);
							platformGridAPI.grids.refresh($scope.gridId);
						} */
					},
					rowChangeCallBack: function rowChangeCallBack(arg) {
						let selectItem = estimateMainResourceService.getSelected();

						let prcItemAssignmentListService =$injector.get('estimateMainPrcItemAssignmentListService');
						if(prcItemAssignmentListService.needLoadData()) {
							prcItemAssignmentListService.load();
						}

						estimateMainResourceService.setResourceCharacteristicPermission(selectItem);
						estimateMainCommonService.resetLookupItem();
						if(isSorted){
							let selected = angular.copy(selectItem);
							let activeCell = arg.grid.getActiveCell();
							isSorted = false;
							setFocusOnSort(activeCell, selected);
						}

					}
				}, estimateDefaultGridConfig);

				platformGridControllerService.initListController($scope, estimateMainResourceDynamicConfigurationService, estimateMainResourceService, estimateMainResourceValidationService, gridConfig);

				if(!estimateMainResourceService.toolHasAdded){
					$scope.addTools(estimateMainResourceFilterService.initFilterTools($scope));
					estimateMainResourceService.toolHasAdded = true;
				}

				function refreshData(parentLineItem) {
					// estimateMainResourceService.gridRefresh();
					angular.forEach(estimateMainResourceService.getList(), function(resItem){
						estimateMainResourceService.fireItemModified(resItem);
					});
					// use this to refresh line item container when the resource is changed
					// #defect: 73220
					estimateMainService.fireItemModified(parentLineItem);
				}

				estimateMainResourceService.setGridId($scope.gridId);

				function itemModified(res) {
					estimateMainResourceService.markItemAsModified(res);
				}

				function refresh(lineItem) {
					refreshData(lineItem);
				}

				function getList() {
					return estimateMainResourceService.getList();
				}

				function setFocusOnSort(cell, selectedItem) {
					estimateMainResourceService.updateList(estimateMainResourceService.getTree());
					if(selectedItem && selectedItem.Id ){
						let options = {
							item : selectedItem,
							cell : cell && cell.cell ? cell.cell : 1,
							forceEdit : true
						};
						estimateMainResourceService.setCellFocus(options);
					}
				}

				function setResources() {
					let list = estimateMainResourceService.getList();

					/* merge cell: type is R */
					list.forEach(function (item) {
						if (item.EstResourceTypeFk === estimateMainResourceType.ComputationalLine) {
							estimateMainCommonService.setCLMergeCell(item, $scope.gridId);
						}
						if (item.EstResourceTypeFk === estimateMainResourceType.TextLine || item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine) {
							estimateMainCommonService.setMergeCell(item, $scope.gridId);
						}
					});

					platformGridAPI.grids.invalidate($scope.gridId);
					platformGridAPI.grids.refresh($scope.gridId);
				}

				function activateIcon(){
					let lastSelectedKey = estimateMainResourceFilterService.getLastSelectedFilterKey();
					let filterKey = _.isString(lastSelectedKey) && lastSelectedKey !== null ? lastSelectedKey : 'allResources';
					estimateMainResourceFilterService.activateIcon($scope, filterKey);
				}

				function refreshResource() {
					let lineItemSelect = estimateMainService.getSelected();
					if (lineItemSelect) {
						estimateMainResourceService.load();
						$injector.get('estimateMainPrcPackageLookupDataService').resetCache({});
						estimateMainResourceService.gridRefresh();
					}
				}

				function onSelectedRowChanged() {
					$injector.get('estimateMainReplaceResourceUIService').setResourceDataServcie(estimateMainResourceService);
				}

				function onBeforeEditCell(e, args){
					// For Resource Characteristics lookup type
					if (args.column.id.indexOf('charactercolumn_') > -1){
						if (!estimateMainResourceService.hasSelection()){ // workaround to select detect selection on estimate resource
							return $timeout(function(){ onBeforeEditCell(e, args);});
						}
						let estimateMainResourceCharacteristicsService = $injector.get('estimateMainResourceCharacteristicsService');
						let charColumnId = parseInt(_.last(args.column.id.split('_')));
						let resCharEntity = _.find(estimateMainResourceCharacteristicsService.getUnfilteredList(), {CharacteristicFk: charColumnId});
						let basicsCharacteristicTypeHelperService = $injector.get('basicsCharacteristicTypeHelperService');

						if (!_.isEmpty(resCharEntity) && resCharEntity.CharacteristicEntity &&  basicsCharacteristicTypeHelperService.isLookupType(resCharEntity.CharacteristicEntity.CharacteristicTypeFk)){
							$injector.get('basicsCharacteristicCharacteristicService').setSelected(resCharEntity.CharacteristicEntity);
						}
					}
				}

				function updateResourcePackageAssignment(){
					let estimateMainPrcItemAssignmentListService = $injector.get('estimateMainPrcItemAssignmentListService');
					let prcItemAssignmentList =[];
					let packageCodes =[];

					let isFilterByResFlag = estimateMainPrcItemAssignmentListService.getFilterByResFlag();
					if(!isFilterByResFlag){
						let resources = estimateMainResourceService.getList ();
						prcItemAssignmentList = estimateMainPrcItemAssignmentListService.getList ();

						_.forEach (resources, function (d) {
							packageCodes = _.map (_.filter (prcItemAssignmentList, {'EstResourceFk': d.Id}), 'PackageCode');
							packageCodes = _.uniq (packageCodes);
							d.PackageAssignments = packageCodes.join (';');
						});
						estimateMainResourceService.gridRefresh ();
					}
				}

				let onCellStyleChanged = function (item,type) {
					$timeout(function () {
						if(type==='CL'){
							estimateMainCommonService.setCLMergeCell(item,$scope.gridId);
						} else{
							estimateMainCommonService.setMergeCell(item,$scope.gridId);
						}
						platformGridAPI.grids.invalidate(estimateMainResourceService.getGridId());
						platformGridAPI.grids.refresh(estimateMainResourceService.getGridId());
					});
				};
				estimateMainResourceDetailService.cellStyleChanged.register(onCellStyleChanged);

				estimateMainCommonCalculationService.resourceItemModified.register(itemModified);
				estimateMainCommonCalculationService.refreshData.register(refresh);
				estimateMainCommonCalculationService.getList.register(getList);
				estimateMainGenerateSortingService.resourceItemModified.register(itemModified);
				estimateMainClipboardService.setResourceSelectionOnSort.register(setFocusOnSort);
				estimateMainService.registerSelectionChanged(activateIcon);
				estimateMainResourceService.registerFilters();
				estimateMainResourceService.refreshData.register(refreshResource);
				estimateMainResourceService.updateResourcePackageAssignment.register(updateResourcePackageAssignment);
				estimateMainResourceService.registerListLoaded(setResources);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				// Register dynamic characteristic columns
				let estimateMainResourceCharacteristicsService = $injector.get('estimateMainResourceCharacteristicsService');
				estimateMainResourceCharacteristicsService.registerEvents();

				function setDynamicColumnsLayoutToGrid(){
					estimateMainResourceDynamicConfigurationService.applyToScope($scope);
				}

				estimateMainResourceDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
				estimateMainResourceDynamicUserDefinedColumnService.initReloadFn();

				function onInitialized() {
					estimateMainResourceDynamicUserDefinedColumnService.loadDynamicColumns();
				}
				platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

				estimateMainResourceService.setScope($scope);

				$scope.newResource = function() {	
					const lineItem = estimateMainService.getSelected();
					if (lineItem && !estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						estimateMainResourceService.createItem();
					}			
				};

				$injector.get('cloudDesktopHotKeyService').register('newResource', $scope.newResource);
				$injector.get('cloudDesktopHotKeyService').registerHotkeyjson('estimate.main/content/json/hotkey.json', moduleName);

				$scope.$on('$destroy', function () {
					estimateMainCommonCalculationService.resourceItemModified.unregister(itemModified);
					estimateMainResourceService.updateResourcePackageAssignment.unregister(updateResourcePackageAssignment);
					estimateMainCommonCalculationService.refreshData.unregister(refresh);
					estimateMainCommonCalculationService.getList.unregister(getList);
					estimateMainGenerateSortingService.resourceItemModified.unregister(itemModified);
					estimateMainClipboardService.setResourceSelectionOnSort.unregister(setFocusOnSort);
					estimateMainService.unregisterSelectionChanged(activateIcon);
					estimateMainResourceService.unregisterFilters();
					estimateMainResourceService.refreshData.unregister(refreshResource);
					estimateMainResourceDetailService.cellStyleChanged.unregister(onCellStyleChanged);


					estimateMainResourceCharacteristicsService.unregisterEvents();

					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
					$injector.get('cloudDesktopHotKeyService').unregister('newResource', $scope.newResource);
					// estimateMainResourceService.unregisterListLoaded(refreshMergerCells);

					estimateMainResourceDynamicUserDefinedColumnService.onDestroy();
					estimateMainResourceDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);

					estimateMainResourceFilterService.setLastSelectedFilterKey(null);

					estimateMainResourceService.unregisterListLoaded(setResources);
				});
			}
		]);
})();
