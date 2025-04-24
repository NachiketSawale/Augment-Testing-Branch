/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemListController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainLineItemListController',
		['$q','$rootScope','$scope','$injector', '$timeout', '$translate', 'platformGridControllerService', 'estimateMainService', 'estimateMainFilterService', 'estimateMainDynamicConfigurationService', 'estimateMainValidationService',
			'platformDataValidationService', 'estimateMainResourceService', 'cloudDesktopInfoService', 'basicsLookupdataLookupDescriptorService', 'estimateMainAssemblyTemplateService',
			'estimateMainRefLineItemService', 'estimateMainSidebarWizardService', 'estimateMainClipboardService','estimateMainDynamicColumnService', 'cloudCommonGridService', 'estimateMainConfigDetailService', 'estimateMainDialogDataService',
			'estimateMainCommonCalculationService', 'estimateRuleComboService', 'estimateRuleComplexLookupService', 'estimateMainLineItem2MdlObjectService','estimateMainOutputDataService',
			'projectCostCodesMainService', 'projectMaterialMainService', 'platformGridAPI', 'estimateMainDynamicQuantityColumnService','estimateConfigTotalService', 'estimateMainLineItemDetailService', 'platformDragdropService',
			'estimateMainExchangeRateService','estimateMainCopySourceCopyOptionsDialogService', 'platformContextMenuItems', 'platformSidebarWizardConfigService',
			function ($q,$rootScope,$scope,$injector, $timeout, $translate, platformGridControllerService, estimateMainService, estimateMainFilterService, estimateMainDynamicConfigurationService, estimateMainValidationService,
				platformDataValidationService, estimateMainResourceService, cloudDesktopInfoService, basicsLookupdataLookupDescriptorService, estimateMainAssemblyTemplateService, estimateMainRefLineItemService, estimateMainSidebarWizardService,
				estimateMainClipboardService,estimateMainDynamicColumnService, cloudCommonGridService, estimateMainConfigDetailService, estimateMainDialogDataService, estimateMainCommonCalculationService, estimateRuleComboService, estimateRuleComplexLookupService,
				estimateMainLineItem2MdlObjectService,estimateMainOutputDataService, projectCostCodesMainService, projectMaterialMainService, platformGridAPI, dyQuantityColService,estimateConfigTotalService, estimateMainLineItemDetailService, platformDragdropService,
				estimateMainExchangeRateService,estimateMainCopySourceCopyOptionsDialogService, platformContextMenuItems, platformSidebarWizardConfigService) {
				var platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
				platformSidebarWizardConfigService.setCurrentScope($scope);
				let myGridConfig = {
					initCalled: false,
					columns: [],
					type: 'lineItems',
					bulkEditorSettings:{
						serverSideBulkProcessing: true,
						skipEntitiesToProcess: false
					},
					skipPermissionCheck:true,
					allowedDragActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy, platformDragdropService.actions.link],
					dragDropService: estimateMainClipboardService,
					extendDraggedData: function (draggedData) {
						draggedData.modelDataSource = estimateMainClipboardService.myDragdropAdapter;
					},
					cellChangeCallBack: function (arg) {
						let column = arg.grid.getColumns()[arg.cell];
						let field = arg.grid.getColumns()[arg.cell].field;
						estimateMainLineItemDetailService.fieldChange(arg.item, field, column);
					},
					rowChangeCallBack: function rowChangeCallBack() {
						let selectedLineItem = estimateMainService.getSelected();
						if (!_.isEmpty(selectedLineItem)) {
							if (estimateMainService.getSelectedEstHeaderIsColumnConfig()) {
								estimateMainConfigDetailService.addLineItemId(estimateMainService.getSelectedEstHeaderId(), selectedLineItem.Id);
							}
							// show the rule output error for this lineitem
							estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();

							estimateMainLineItem2MdlObjectService.showModelViewer(selectedLineItem);

							$injector.get('pesHeaderLookupDataService').setProjectId(selectedLineItem.ProjectFk);

							$injector.get('salesWipLookupDataService').setProjectId(selectedLineItem.ProjectFk);

						}
					}
				};

				let cloudDesktopHotKeyService = $injector.get('cloudDesktopHotKeyService');
				cloudDesktopHotKeyService.registerHotkeyjson('estimate.main/content/json/hotkey.json', moduleName);

				let CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');

				platformGridControllerService.initListController($scope, estimateMainDynamicConfigurationService, estimateMainService, estimateMainValidationService, myGridConfig);

				estimateMainService.setIsEstimate(true);

				estimateMainService.setGridId($scope.gridId);

				estimateMainService.setGridIdForRest($scope.gridId);

				estimateMainService.setScope($scope);

				function clearSelectedItemOnRefresh(){
					$scope.selectedEntityID = null;
				}
				estimateMainService.registerListLoaded(clearSelectedItemOnRefresh);

				estimateMainService.gridId = $scope.gridId;

				function resetSortcodes(sortCodeInfo){
					angular.forEach(sortCodeInfo, function(sc){
						if(sc && sc.Field){
							let service = $injector.get('estimateMain'+sc.Field+'LookupDataService');
							if(service){
								service.reload(sc.Field);
							}
						}
					});
				}

				function calculate(resList, isRef){
					let selectedLineItem = estimateMainService.getSelected();
					// let flatResList = [];
					// cloudCommonGridService.flatten(resList, flatResList, 'EstResources');
					estimateMainCommonCalculationService.calcResNLineItem(resList, selectedLineItem, isRef);
					estimateMainService.fireItemModified(selectedLineItem);

					// fix defect 90413, Activating grouping function, any modifications would not showing on the Line item immediately
					let estimateMainGridId = '681223e37d524ce0b9bfa2294e18d650';
					let grid = platformGridAPI.grids.element('id', estimateMainGridId);

					let gridDatas = grid.dataView.getRows();

					let gridDataToChange = isRef ? gridDatas :_.find(gridDatas, {__group : true});
					if(gridDataToChange){
						let changed = false;
						for(let index = 0; index < gridDatas.length; index++){
							let gridData=gridDatas[index];
							if( selectedLineItem) {
								if(gridData.Id === selectedLineItem.Id ) {
									changed = true;
								}
							}
						}

						setTimeout(function () {
							if(changed){
								estimateMainService.gridRefresh();
							}

						}, 0);
					}
				}

				// connect to filter service
				estimateMainFilterService.setServiceToBeFiltered(estimateMainService);
				estimateMainFilterService.setFilterFunction(estimateMainFilterService.getCombinedFilterFunction); // default filter
				$scope.setTools(estimateMainFilterService.getToolbar());

				// update the module info
				var project = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
				if (!project){
					estimateMainService.setSelectedProjectInfo(null);
				}
				var estHeader = $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
				if (!estHeader){
					estimateMainService.setSelectedPrjEstHeader(null);
				}

				let tools = [
					{
						id: 'modalConfig',
						caption: $translate.instant('estimate.main.estConfigDialogTitle'),// 'Estimate Configuration Dialog',
						// caption$tr$: 'estimate.main.estConfigDialogTitle',
						type: 'item',
						cssClass: 'tlb-icons ico-settings-doc',
						fn: function() {
							estimateMainDialogDataService.setUsageContext(moduleName);
							estimateMainDialogDataService.showDialog();
						},
						disabled: function () {
							return !!estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission();
						}
					},
					{
						id: 'modalConfig',
						caption: $translate.instant('estimate.main.estConfigEstBoqUppTitle'),// 'Estimate Configuration Dialog',
						// caption$tr$: 'estimate.main.estConfigDialogTitle',
						type: 'item',
						cssClass: 'tlb-icons ico-copy-settings',
						fn: function() {
							$injector.get('estimateMainBoqUppConfigService').showDialog();
						}
					},
					{
						id: 'updatePrjBoq',
						caption: 'estimate.main.updateEstimateFromBoq',
						type: 'item',
						iconClass: 'tlb-icons ico-update-estimate-from-boq',
						fn:updatePrjBoq
					},
					{
						id: 'copyasbase',
						caption: $translate.instant('estimate.main.copyAsBaseItem'),// 'Copy Line Item',
						// caption$tr$: 'estimate.main.copyAsBaseItem',
						type: 'item',
						iconClass: 'tlb-icons ico-copy-line-item',
						fn: function () {
							estimateMainService.deepCopy(false);
						},
						disabled: function () {
							return !!estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission();
						}
					},
					{
						id: 'copyasreference',
						caption: $translate.instant('estimate.main.copyAsRefItem'),// 'Copy Reference Line Item',
						// caption$tr$: 'estimate.main.copyAsRefItem',
						type: 'item',
						iconClass: 'tlb-icons ico-copy-line-item-ref',
						fn: function () {
							estimateMainService.deepCopy(true);
						},
						disabled: function () {
							return !!estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission();
						}
					},
					{
						id: 'estimateMainCopyOptions',
						caption: $translate.instant('estimate.main.copyOptions'),
						type: 'item',
						iconClass: 'tlb-icons  ico-copy-line-item-quantity',
						fn: function () {
							return estimateMainCopySourceCopyOptionsDialogService.showDialog();
						}
					},
					Object.assign({
						id: 'lineItemCreate',
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn:function(){
							if(!estimateMainService.isReadonly() && $injector.get('platformPermissionService').hasCreate($scope.gridId)){
								estimateMainService.createItem();
							}
						}
					}, platformContextMenuItems.setContextGroupNew())
				];

				function updatePrjBoq() {
					let dialogUserSettingService = $injector.get('dialogUserSettingService');
					let dialogId = $injector.get('estimateMainEstUppDataService').getDialogId();
					let IsDisabled= dialogUserSettingService.getCustomConfig(dialogId, 'IsDisabled') || false;
					let IsFixedPrice= dialogUserSettingService.getCustomConfig(dialogId, 'IsFixedPrice') || false;
					let IsAQOptionalItems= dialogUserSettingService.getCustomConfig (dialogId, 'IsAQOptionalItems') || false;
					let IsDayWork = dialogUserSettingService.getCustomConfig (dialogId, 'IsDayWork') || false;

					let postData = {
						data: {
							updBoq: false,
							updFromBoq: true,
							updCompositeAssembly: true,
							updProtectedAssembly: true,
							IsDisabled: IsDisabled,
							IsFixedPrice: IsFixedPrice,
							IsAQOptionalItems: IsAQOptionalItems,
							IsDayWork: IsDayWork
						}
					};
					$injector.get('estimateMainUpdateItemsService').updateEstimateFromProject(postData);
				}

				$scope.addTools(tools);
				// update header info
				estimateMainService.setShowHeaderAfterSelectionChanged(function (lineItemEntity /* , data */) {
					estimateMainService.updateModuleHeaderInfo(lineItemEntity);
				});

				estimateMainService.updateModuleHeaderInfo(estimateMainService.getSelected());

				function updateToolsWA() { // TODO: try to remove this workaround and analyse the problem...
					$timeout($scope.tools.update, 50);
				}

				// estimateMainSidebarWizardService.activate(); //
				estimateMainFilterService.onUpdated.register(updateToolsWA);


				function refreshData(){
					// estimateRuleComboService.init();
					estimateRuleComplexLookupService.clear();
				}

				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
					if (toState.name === 'app.projectmain' && fromState.name === 'app.estimatemain') {
						updateProjectData();
					}

					if (toState.name !== 'app.estimatemain' && fromState.name === 'app.estimatemain') {
						estimateMainService.clearBoqEvent.fire();
						estimateMainService.clearSelectedProjectInfo();
					}
				});

				// update project costcodes and material
				function updateProjectData(){
					let prjMainServ = $injector.get('projectMainService');
					if( prjMainServ.getIfSelectedIdElse(null)){
						let selectedItem = prjMainServ.getSelected();
						prjMainServ.setSelected({}).then(function(){
							prjMainServ.setSelected(selectedItem).then(function(){
								estimateMainService.updateModuleHeaderInfo();
							});
						});
					}
				}

				function onSelectedRowsChanged(){
					// filter rule execution output data based on selected line items
					estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();

					// recalculate the total value based on selected line items
					// estimateConfigTotalService.multiLineItemsChanged.fire();
				}

				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
				function onActiveCellChanged(e, arg) {
					let column = arg.grid.getColumns()[arg.cell];
					if(column) {
						let isCharacteristic = $injector.get('estimateMainCommonService').isCharacteristicCulumn(column);
						if (isCharacteristic) {
							let lineItem = estimateMainService.getSelected();
							if (lineItem !== null) {
								let col = column.field;
								let colArray = _.split(col, '_');
								if(colArray && colArray.length> 1) {
									let characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									let value = parseInt(characteristicType);
									let isLookup = CharacteristicTypeService.isLookupType(value);
									let updateColumn= isLookup ? col : undefined;
									estimateMainService.setCharacteristicColumn(updateColumn);
								}
							}
						}
					}
					return;
				}

				estimateMainResourceService.calcResources.register(calculate);

				estimateMainService.onRefreshLookup.register(refreshData);
				if(!estimateMainService.getIsRegisterContextUpdated()) {
					estimateMainService.onContextUpdated.register(estimateRuleComboService.init);
					estimateMainService.setIsRegisterContextUpdated(true);
				}
				estimateMainDialogDataService.onDataLoaded.register(estimateMainService.setEstConfigData);
				estimateMainService.registerLookupFilter();

				estimateMainService.onSortCodeReset.register(resetSortcodes);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				refreshData();

				function setDynamicColumnsLayoutToGrid(){
					estimateMainDynamicConfigurationService.applyToScope($scope);
				}
				estimateMainDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				let inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
				inquiryService.handleInquiryToolbarButtons($scope,  true/* include all button, depending on selection */);
				estimateMainService.onEstHeaderSet.register(updateToolsWA);

				let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
				estimateMainDynamicUserDefinedColumnService.initReloadFn();

				function onInitialized() {
					estimateMainDynamicUserDefinedColumnService.loadDynamicColumns();
				}
				platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

				function updateInquiryService() {
					inquiryService.unRegisterProvider();
					inquiryService.registerProvider(estimateMainService.getInquiryOptions());
					inquiryService.activateSidebarInquiryProvider(true);
					inquiryService.checkStartupInfoforInquiry();
				}

				function onListLoadStarted(){
					updateInquiryService();
				}

				estimateMainService.registerListLoadStarted(onListLoadStarted);

				// drag & drop
				let origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
						if(!estimateMainLineItem2MdlObjectService.parentService().hasUpdatePermission()){
							return false;
						}
						return !!estimateMainLineItem2MdlObjectService.parentService().getSelected();
					} else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				let origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
						// handle dragged data
						estimateMainClipboardService.copyObjectsFromViewer(info);
					} else {
						origDrop.call($scope.ddTarget, info);
					}
				};

				// Register dynamic characteristic columns
				let estimateMainLineItemCharacteristicsService = $injector.get('estimateMainLineItemCharacteristicsService');
				estimateMainLineItemCharacteristicsService.registerEvents();

				function lineItemStructureMarkersChanged(e, args){
					estimateMainService.lineItemStructureMarkersChanged(args);
				}

				let deregisterLineItemStructureMarkersChanged =  $rootScope.$on('filterIsActive',lineItemStructureMarkersChanged);

				function updatePackageAssignment(){
					let estimateMainPrcItemAssignmentListService= $injector.get('estimateMainPrcItemAssignmentListService');
					let isFilterByResFlag = estimateMainPrcItemAssignmentListService.getFilterByResFlag();
					if(!isFilterByResFlag) {
						let prcItemAssignmentList = estimateMainPrcItemAssignmentListService.getList ();
						let selectedLineItem = estimateMainService.getSelected ();

						let packageCodes = _.map (prcItemAssignmentList, 'PackageCode');
						packageCodes = _.uniq (packageCodes);
						if (selectedLineItem) {
							selectedLineItem.PackageAssignments = packageCodes.join (';');
							estimateMainService.gridRefresh ();
						}
					}
				}
				estimateMainService.updatePackageAssignment.register(updatePackageAssignment);

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				/* add costGroupService to mainService */
				if(!estimateMainService.costGroupService){
					estimateMainService.costGroupService = $injector.get('estimateMainLineItemCostGroupService');
				}
				estimateMainService.costGroupService.registerCellChangedEvent($scope.gridId);

				function reloadExchangeRate(){
					let projectInfo = estimateMainService.getSelectedProjectInfo();
					if(projectInfo && projectInfo.ProjectId && projectInfo.ProjectId !== estimateMainService.getCacheExchangePrjId()){
						estimateMainService.setCacheExchangePrjId(projectInfo.ProjectId);
						estimateMainExchangeRateService.loadData(projectInfo.ProjectId, true);
					}
				}

				estimateMainService.registerListLoaded(reloadExchangeRate);

				// remove the loading icon after concurrency exception
				function removeLoadingIcon(){
					$scope.isLoading = false;
				}

				$scope.toBoq = function(){
					if($scope && $scope.$parent && $scope.$parent.hasFocus) {
						$injector.get('estimateCommonNavigationService').navigateToBoq(estimateMainService.getSelected(), {moduleName: 'boq.main'});
					}
				};

				$injector.get('platformConcurrencyExceptionHandler').registerConcurrencyExceptionHandler(removeLoadingIcon);

				$injector.get('estimateAssembliesAssemblyTypeDataService').getAssemblyTypes();

				$scope.newLineItem = function(){
					const canCreateItem = estimateMainService.hasCreateUpdatePermission() || !estimateMainService.getHeaderStatus() || !estimateMainService.isReadonly();
					if (canCreateItem) {
						estimateMainService.createItem();
					}
				};

				cloudDesktopHotKeyService.register('newLineItem', $scope.newLineItem);

				$scope.newPackageItemAssignment = function(){
					let lineItem = estimateMainService.getSelected();
					let isOpenPrcItemAssignmentListContainer= platformGridAPI.grids.exist('4cf3bc54dd38437b8aaae2005cc80ae4');
					if(lineItem && isOpenPrcItemAssignmentListContainer && !estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						// Set the focus on the PRC item assignment grid in order to prevent the row changed trigger from invoking the auto-save.
						let grid = platformGridAPI.grids.element('id', '4cf3bc54dd38437b8aaae2005cc80ae4');
						if (grid && grid.instance) {
							grid.instance.focus();
						}

						$injector.get('estimateMainPrcItemAssignmentListService').createItem();
					}
				};

				cloudDesktopHotKeyService.register('toBoq', $scope.toBoq);

				cloudDesktopHotKeyService.register('newPackageItemAssignment', $scope.newPackageItemAssignment);

				function updateCopyPasteFunc(){
					if($scope.tools && $scope.tools.items){
						let clipboardButton = _.find($scope.tools.items, function (item) {
							return item.id === 't199';
						});
						if(clipboardButton && clipboardButton.list && clipboardButton.list.items){
							let copyPasteButton = _.find(clipboardButton.list.items, function (item) {
								return item.id === 'exportPaste';
							});
							if(copyPasteButton){
								copyPasteButton.fn = $injector.get('estimateMainLineItemCopyPasteService').copyPaste;
							}
						}
					}
				}

				updateCopyPasteFunc();

				/**
				 * set cell css style for the modified fields
				 */
				function highlightFields(list, confidenceCheckId) {
					if (_.isEmpty(list)) {
						return;
					}

					if (gridIsReady($scope.gridId)) {
						let localGrid = platformGridAPI.grids.element('id', $scope.gridId);
						let result = $injector.get('estimateMainLineItemHighlightColumnService').getHighlightFields(list, confidenceCheckId);

						// Add CSS classes for all changed properties (remove old css)
						localGrid.instance.setCellCssStyles('changedLineItemFields', result);
						platformGridAPI.grids.refresh($scope.gridId);
					}
				}

				// eslint-disable-next-line no-unused-vars
				function gridIsReady(gridId) {
					let localGrid;
					let result = false;
					if (platformGridAPI.grids.exist(gridId)) {
						localGrid = platformGridAPI.grids.element('id', gridId);
						if (localGrid.instance && localGrid.dataView) {
							result = true;
						}
					}
					return result;
				}

				estimateMainService.onHighlightFields.register(highlightFields);
				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainService.onHighlightFields.unregister(highlightFields);
					estimateMainService.setGridId(null);
					estimateMainService.updatePackageAssignment.unregister(updatePackageAssignment);
					estimateMainFilterService.onUpdated.unregister(updateToolsWA);
					estimateMainResourceService.calcResources.unregister(calculate);
					estimateMainService.onRefreshLookup.unregister(refreshData);
					estimateMainService.onContextUpdated.unregister(estimateRuleComboService.init);
					estimateMainService.setIsRegisterContextUpdated(false);
					estimateMainDialogDataService.onDataLoaded.unregister(estimateMainService.setEstConfigData);
					estimateMainService.unregisterLookupFilter();
					estimateMainService.onSortCodeReset.unregister(resetSortcodes);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);

					// dyQuantityColService.updateDynamicQuantityColumns.unregister(updateDynamicQuantityColumns);
					estimateMainService.setDetailsParamReminder(null);
					estimateMainService.clearLookupCache();
					estimateMainService.setIsEstimate(false);
					estimateMainService.onEstHeaderSet.unregister(updateToolsWA);
					estimateMainService.unregisterListLoadStarted(onListLoadStarted);
					// estimateMainService.clearEstConfigData();
					estimateMainService.unregisterListLoaded(clearSelectedItemOnRefresh);

					estimateMainService.unregisterListLoaded(reloadExchangeRate);

					estimateMainDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);

					deregisterLineItemStructureMarkersChanged();

					if(Object.prototype.hasOwnProperty.call(estimateMainService, 'costGroupCatalogs')){
						delete estimateMainService.costGroupCatalogs;
					}

					$injector.get('platformConcurrencyExceptionHandler').unregisterConcurrencyExceptionHandler(removeLoadingIcon);

					estimateMainDynamicUserDefinedColumnService.onDestroy();

					cloudDesktopHotKeyService.unregister('newLineItem', $scope.newLineItem);
					cloudDesktopHotKeyService.unregister('toBoq', $scope.toBoq);
					cloudDesktopHotKeyService.unregister('newPackageItemAssignment', $scope.newPackageItemAssignment);
				});
			}
		]);
})(angular);

