/**
 * Created by salopek on 03.01.2019.
 */

/* global _ */

(function (angular) {

	'use strict';
	var moduleName = 'estimate.main';

	/*
     * @ngdoc controller
     * @name estimateMainCombineLineItemListController
     * @function
     * @description
     * Controller for the combined list view of Estimate Line Item entities.
      */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainCombineLineItemListController',
		['$scope','$injector', '$timeout',
			'$translate', 'platformGridControllerService', 'estimateMainCombineLineItemService',
			'estimateMainFilterService', 'estimateMainDynamicConfigurationService', 'estimateMainCombineLineItemConfigurationService',
			'estimateMainValidationService', 'platformDataValidationService', 'estimateMainResourceService',
			'cloudDesktopInfoService', 'basicsLookupdataLookupDescriptorService', 'estimateMainAssemblyTemplateService',
			'estimateMainRefLineItemService', 'estimateMainSidebarWizardService', 'estimateMainClipboardService',
			'estimateMainDynamicColumnService', 'cloudCommonGridService', 'estimateMainConfigDetailService',
			'estimateMainDialogDataService', 'estimateMainCommonCalculationService', 'estimateRuleComboService',
			'estimateRuleComplexLookupService', 'estimateMainLineItem2MdlObjectService','estimateMainOutputDataService',
			'projectCostCodesMainService', 'projectMaterialMainService', 'platformGridAPI',
			'estimateMainDynamicQuantityColumnService','estimateConfigTotalService', 'estimateMainLineItemDetailService',
			'estimateMainService',
			function ($scope,$injector, $timeout,
				$translate, platformGridControllerService, estimateMainCombineLineItemService,
				estimateMainFilterService, estimateMainDynamicConfigurationService, estimateMainCombineLineItemConfigurationService,
				estimateMainValidationService, platformDataValidationService, estimateMainResourceService,
				cloudDesktopInfoService, basicsLookupdataLookupDescriptorService, estimateMainAssemblyTemplateService,
				estimateMainRefLineItemService, estimateMainSidebarWizardService, estimateMainClipboardService,
				estimateMainDynamicColumnService, cloudCommonGridService, estimateMainConfigDetailService,
				estimateMainDialogDataService, estimateMainCommonCalculationService, estimateRuleComboService,
				estimateRuleComplexLookupService, estimateMainLineItem2MdlObjectService,estimateMainOutputDataService,
				projectCostCodesMainService, projectMaterialMainService, platformGridAPI,
				dyQuantityColService, estimateConfigTotalService, estimateMainLineItemDetailService,
				estimateMainService) {

				var myGridConfig = {
					initCalled: false, columns: [],
					type: 'combinelineItems',
					cellChangeCallBack: function (arg) {
						var column = arg.grid.getColumns()[arg.cell];
						var field = arg.grid.getColumns()[arg.cell].field;
						estimateMainLineItemDetailService.fieldChange(arg.item, field, column);
					},
					rowChangeCallBack: function rowChangeCallBack() {
						var selectedLineItem = estimateMainCombineLineItemService.getSelected();

						estimateMainService.setSelected(selectedLineItem);

						if (!_.isEmpty(selectedLineItem)) {

							if(selectedLineItem.CombinedLineItemsSimple === null) {
								estimateMainResourceService.hasToLoadOnSelectionChange(selectedLineItem);
							}
							else {
								angular.forEach(selectedLineItem.CombinedLineItemsSimple, function(lineItem){
									estimateMainResourceService.hasToLoadOnSelectionChange(lineItem);
								});
							}

							if (selectedLineItem && selectedLineItem.EstLineItemFk > 0) {
								estimateMainRefLineItemService.getRefBaseResources(selectedLineItem, false, true).then(function (resList) {
									calculate(resList, true);
									estimateMainResourceService.updateList(resList, true);

									// get and set resource characteristics
									var resCharsService = $injector.get('estimateMainResourceCharacteristicsService');
									resCharsService.getResourceCharacteristicsByLineItem(selectedLineItem.EstHeaderFk, selectedLineItem.EstLineItemFk).then(function(response){
										resCharsService.setDynamicColumnsLayout({ dynamicColumns: { Characteristics: response.data}, dtos: resList });
									});
								});
							}
							// show the rule output error for this lineitem
							estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();

							estimateMainLineItem2MdlObjectService.showModelViewer(selectedLineItem);
						}
					}
				};

				var CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');

				platformGridControllerService.initListController($scope, estimateMainDynamicConfigurationService, estimateMainCombineLineItemService, estimateMainValidationService, myGridConfig);

				// platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				estimateMainCombineLineItemService.setIsEstimate(true);

				estimateMainCombineLineItemService.getGridId($scope.gridId);

				estimateMainCombineLineItemService.setGridIdForRest($scope.gridId);

				estimateMainCombineLineItemService.setScope($scope);

				function clearSelectedItemOnRefresh(){
					$scope.selectedEntityID = null;
				}
				estimateMainCombineLineItemService.registerListLoaded(clearSelectedItemOnRefresh);

				estimateMainCombineLineItemService.gridId = $scope.gridId;

				function resetSortcodes(sortCodeInfo){
					angular.forEach(sortCodeInfo, function(sc){
						if(sc && sc.Field){
							var service = $injector.get('estimateMain'+sc.Field+'LookupDataService');
							if(service){
								service.resetCache(estimateMainCombineLineItemService.getSelectedProjectId());
							}
						}
					});
				}

				function calculate(resList, isRef){
					var selectedLineItem = estimateMainCombineLineItemService.getSelected();
					// var flatResList = [];
					// cloudCommonGridService.flatten(resList, flatResList, 'EstResources');
					estimateMainCommonCalculationService.calcResNLineItem(resList, selectedLineItem, isRef);
					estimateMainCombineLineItemService.fireItemModified(selectedLineItem);

					// fix defect 90413, Activating grouping function, any modifications would not showing on the Line item immediately
					var estimateMainGridId = 'b46b9e121808466da59c0b2959f09960';
					var grid = platformGridAPI.grids.element('id', estimateMainGridId);

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
								estimateMainCombineLineItemService.gridRefresh();
							}

						}, 0);
					}
				}

				// connect to filter service
				// estimateMainFilterService.setServiceToBeFiltered(estimateMainCombineLineItemService);
				// estimateMainFilterService.setFilterFunction(estimateMainFilterService.getCombinedFilterFunction); // default filter
				// $scope.setTools(estimateMainFilterService.getToolbar());

				var tools = [
					{
						id: 'combineGroup',
						caption: 'radio group caption',
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							activeValue: 'views',
							showTitles: true,
							items: [
								{
									id: 'combineItemsRefresh',
									caption: 'Refresh',
									type: 'item',
									cssClass: 'tlb-icons ico-refresh',
									fn: function () {
										estimateMainCombineLineItemService.load();
									}
								},
								{
									id: 'combineItemsStandardView',
									caption: 'Standard View',
									caption$tr$: 'estimate.main.combineLineItems.standardView',
									type: 'radio',
									value: 'views',
									iconClass: 'tlb-icons tlb-icons ico-combined-standard',
									fn: function() {
										estimateMainCombineLineItemService.setListView(0, null);
										estimateMainCombineLineItemService.load();
									},
									disabled: function () {
										return !!estimateMainCombineLineItemService.getHeaderStatus();
									}
								},
								{
									id: 'combineItemsItemUnitCost',
									caption: 'Item, Unit Cost View',
									caption$tr$: 'estimate.main.combineLineItems.itemUnitCostView',
									type: 'radio',
									value: 'viewu',
									iconClass: 'tlb-icons tlb-icons ico-combined-unit-cost',
									fn: function () {
										estimateMainCombineLineItemService.setListView(1, null);
										estimateMainCombineLineItemService.load();
									},
									disabled: function () {
										return !!estimateMainCombineLineItemService.getHeaderStatus();
									}
								}
								/* ,
                                {
                                    id: 'combineItemsCustomView',
                                    caption: 'Custom View',
                                    caption$tr$: 'estimate.main.combineLineItems.customView',
                                    type: 'item',
                                    //type: 'radio',
                                    //value: 'viewc',
                                    iconClass: 'tlb-icons tlb-icons tlb-icons ico-combined-custom',
                                    fn: function() {
                                        //var columns = platformGridAPI.columns.getColumns($scope.gridId);
                                        var getPromise = estimateMainCombineLineItemCustomViewDialogService.showCustomCombinedViewDialog();

                                        getPromise.then(function(result) {
                                            estimateMainCombineLineItemService.setListView(2, result.currentCustomView);
                                            estimateMainCombineLineItemService.refresh();
                                        });
                                    },
                                    disabled: function () {
                                        return !!estimateMainCombineLineItemService.getHeaderStatus();
                                    }
                                } */
							]
						}
					}
				];


				$scope.addTools(tools);

				// remove create and delete buttons
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create' || item.id === 'delete';
				});

				estimateMainCombineLineItemService.setListView(0, null);
				estimateMainCombineLineItemService.gridRefresh();

				// update header info
				/* estimateMainCombineLineItemService.setShowHeaderAfterSelectionChanged(function (lineItemEntity /!*, data*!/) {
                    estimateMainCombineLineItemService.updateModuleHeaderInfo(lineItemEntity);
                });
                estimateMainCombineLineItemService.updateModuleHeaderInfo(); */

				estimateMainSidebarWizardService.activate();

				function refreshData(){
					// estimateRuleComboService.init();
					estimateRuleComplexLookupService.clear();
				}

				function onSelectedRowsChanged(){
					// filter rule execution output data based on selected line items
					estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();

					// recalculate the total value based on selected line items
					estimateConfigTotalService.multiLineItemsChanged.fire();
				}

				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
				function onActiveCellChanged(e, arg) {
					var column = arg.grid.getColumns()[arg.cell];
					if(column) {
						var isCharacteristic = $injector.get('estimateMainCommonService').isCharacteristicCulumn(column);
						if (isCharacteristic) {
							var lineItem = estimateMainCombineLineItemService.getSelected();
							if (lineItem !== null) {
								var col = column.field;
								var colArray = _.split(col, '_');
								if(colArray && colArray.length> 1) {
									var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									var value = parseInt(characteristicType);
									var isLookup = CharacteristicTypeService.isLookupType(value);
									var updateColumn= isLookup ? col : undefined;
									estimateMainCombineLineItemService.setCharacteristicColumn(updateColumn);
								}
							}
						}
					}
				}

				function updateDynamicQuantityColumns() {
					var dyQtyColumns = dyQuantityColService.getDynamicQuantityColumns();
					angular.forEach(dyQtyColumns, function(col){
						estimateMainDynamicColumnService.addQuantityColumn(col);
					});
					estimateMainDynamicColumnService.resizeLineItemGrid();
				}
				estimateMainResourceService.calcResources.register(calculate);

				estimateMainCombineLineItemService.onRefreshLookup.register(refreshData);
				/* if(!estimateMainCombineLineItemService.getIsRegisterContextUpdated()) {
                    estimateMainCombineLineItemService.onContextUpdated.register(estimateRuleComboService.init);
                    estimateMainCombineLineItemService.setIsRegisterContextUpdated(true);
                } */
				estimateMainDialogDataService.onDataLoaded.register(estimateMainCombineLineItemService.setEstConfigData);
				estimateMainCombineLineItemService.registerLookupFilter();

				estimateMainCombineLineItemService.onSortCodeReset.register(resetSortcodes);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				dyQuantityColService.updateDynamicQuantityColumns.register(updateDynamicQuantityColumns);

				refreshData();

				var inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
				inquiryService.handleInquiryToolbarButtons($scope,  true/* include all button, depending on selection */);

				function updateInquiryService() {
					inquiryService.unRegisterProvider();
					inquiryService.registerProvider(estimateMainCombineLineItemService.getInquiryOptions());
					inquiryService.activateSidebarInquiryProvider(true);
					inquiryService.checkStartupInfoforInquiry();
				}

				estimateMainCombineLineItemService.registerListLoadStarted(updateInquiryService);

				// Register dynamic characteristic columns
				var estimateMainLineItemCharacteristicsService = $injector.get('estimateMainLineItemCharacteristicsService');
				estimateMainLineItemCharacteristicsService.registerEvents();

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				/* add costGroupService to mainService */
				if(!estimateMainService.costGroupService){
					estimateMainService.costGroupService = $injector.get('estimateMainLineItemCostGroupService');
				}
				estimateMainService.costGroupService.registerCellChangedEvent($scope.gridId);

				function setDynamicColumnsLayoutToGrid(){
					estimateMainDynamicConfigurationService.applyToScope($scope);
				}

				estimateMainDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainSidebarWizardService.deactivate();
					estimateMainResourceService.calcResources.unregister(calculate);
					estimateMainCombineLineItemService.onRefreshLookup.unregister(refreshData);
					// estimateMainCombineLineItemService.onContextUpdated.unregister(estimateRuleComboService.init);
					// estimateMainCombineLineItemService.setIsRegisterContextUpdated(false);
					estimateMainDialogDataService.onDataLoaded.unregister(estimateMainCombineLineItemService.setEstConfigData);
					estimateMainCombineLineItemService.unregisterLookupFilter();
					estimateMainCombineLineItemService.onSortCodeReset.unregister(resetSortcodes);
					// platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);

					dyQuantityColService.updateDynamicQuantityColumns.unregister(updateDynamicQuantityColumns);
					estimateMainCombineLineItemService.setDetailsParamReminder(null);
					estimateMainCombineLineItemService.clearLookupCache();
					estimateMainCombineLineItemService.setIsEstimate(false);
					estimateMainCombineLineItemService.unregisterListLoadStarted(updateInquiryService);
					estimateMainCombineLineItemService.unregisterListLoaded(clearSelectedItemOnRefresh);

					estimateMainDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
				});
			}
		]);
})(angular);