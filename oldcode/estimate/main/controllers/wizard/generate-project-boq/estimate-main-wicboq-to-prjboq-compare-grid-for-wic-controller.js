/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name estimateMainWicboqToPrjboqCompareGridForWicController
     * @requires $scope
     * @description
     */
	angular.module(moduleName).controller('estimateMainWicboqToPrjboqCompareGridForWicController',
		['_', '$scope', '$injector', 'platformCreateUuid', 'platformGridAPI',
			'platformGridControllerService',
			'estimateMainWicboqToPrjboqCompareUiForWicService',
			'estimateMainWicboqToPrjboqCompareDataForWicService',
			'estimateMainWidboqValidationService',
			'boqMainCommonService',
			'generateWipBoqStructureService',
			'estimateMainGeneratePrjboqClipboardService',
			function (_, $scope, $injector, platformCreateUuid, platformGridAPI, platformGridControllerService,
				gridUIConfigService,
				gridDataService,
				estimateMainWidboqValidationService,
				boqMainCommonService,
				generateWipBoqStructureService,
				estimateMainGeneratePrjboqClipboardService) {
				let parentScope = $scope.$parent;
				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					type: 'wicitem',
					property: 'Reference',
					collapsed: false,
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					multiSelect: true,
					dragDropService: estimateMainGeneratePrjboqClipboardService,
					cellChangeCallBack: function cellChangeCallBack(arg) {
						if (angular.isDefined(arg) && (arg !== null) && angular.isDefined(arg.grid) && (arg.grid !== null) &&
                        angular.isDefined(arg.grid.getColumns) && (arg.grid.getColumns !== null) && angular.isDefined(arg.cell) &&
                        (arg.cell !== null) && angular.isDefined(arg.item) && (arg.item !== null)) {

							let column = arg.grid.getColumns()[arg.cell];
							let item = arg.item;

							if ((column.field === 'Reference') && angular.isDefined(column.$$postApplyValue) && _.isFunction(column.$$postApplyValue)) {
								return;
							}

							// fixed defect 80701
							// Change position type item with assigned Boq Item Flag to Note/ Design Description type,  BoQ Item Flag info should be clear
							if(column.field ==='BoqLineTypeFk' && (item.BoqLineTypeFk === 105 || item.BoqLineTypeFk === 107 || item.BoqLineTypeFk === 110)){
								item.BoqItemFlagFk = null;
							}

							$injector.get('boqMainChangeService').reactOnChangeOfBoqItem(item, column.field, generateWipBoqStructureService, boqMainCommonService);
							gridDataService.reGenerateMatchBoqsRefNoByNo(item);
							if(!boqMainCommonService.isRoot(item)){
								gridDataService.checkRepeatedForNoMatched(item, generateWipBoqStructureService);
								gridDataService.reGenerateMatchBoqsRefNoByNo(item);
								gridDataService.gridRefresh();
							}
						}
					}
				};


				$scope.gridId = '5b6b9d54d46b42b5bb8c655f2470a43a';

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'create',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () { generateWipBoqStructureService.createTempNewItem(false);},
							disabled: true
						},
						{
							id: 'newDivision',
							sort: 1,
							caption: 'cloud.common.toolbarNewDivision',
							type: 'item',
							iconClass: 'tlb-icons ico-fld-ins-below',
							fn: function () { generateWipBoqStructureService.createTempNewDivision(false);},
							disabled: true
						},
						{
							id: 'newSubDivision',
							sort: 2,
							caption: 'cloud.common.toolbarNewSubdivision',
							type: 'item',
							iconClass: ' tlb-icons ico-sub-fld-new',
							fn: function () { generateWipBoqStructureService.createTempNewSubDivision(false);},
							disabled: true
						},
						{
							id: 'delete',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () { gridDataService.deleteEntities();},
							disabled: true
						},
						{
							id: 'collapse',
							sort: 20,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: ' tlb-icons ico-tree-collapse-all',
							fn: function () { platformGridAPI.rows.collapseAllSubNodes($scope.gridId);},
							disabled: false
						},
						{
							id: 'expand',
							sort: 21,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: ' tlb-icons ico-tree-expand-all',
							fn: function () { platformGridAPI.rows.expandAllSubNodes($scope.gridId);},
							disabled: false
						}
					],
					update: function () {
						return;
					}
				};

				$scope.getContainerUUID = function () {
					return $scope.gridId;
				};

				gridDataService.clear();

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, estimateMainWidboqValidationService, myGridConfig);
					// if (platformGridAPI.grids.exist($scope.gridId)) {
					//     platformGridAPI.grids.element('id', $scope.gridId).isStaticGrid = true;
					// }

					gridDataService.gridId = $scope.gridId;

					if(!parentScope.entity.loadedWicBoq){
						gridDataService.loadData(parentScope.entity).then(function () {
							parentScope.isReady = true;
							// parentScope.entity.loadedWicBoq = true;
							gridDataService.expandBoqTree();
							gridDataService.loadToolsChange.fire();
						});
					}
					else{
						parentScope.isReady = true;
					}

					parentScope.$watch('isCatLoading', function(isLoading){
						$scope.isLoading = isLoading;
					});

					gridDataService.setIsOpening(true);

					gridDataService.setScope($scope);
				}

				// function onBeforeEditCell(e, arg) {// can not select item whose 'IsLive' is false.
				//     let root = gridDataService.getCurrentRootItem(arg.item);
				//     if(root && root.BoqHeaderFk){
				//         generateWipBoqStructureService.setSelectedHeaderFk(root.BoqHeaderFk);
				//     }
				// }
				//
				// platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				function onChangeGridContent() {
					let selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					selected = _.isArray(selected) ? selected[0] : selected;
					let root = gridDataService.getCurrentRootItem(selected);
					if(root && root.BoqHeaderFk){
						updateTools();
						$injector.get('estimateMainGeneratePrjboqStructureService').getBoqStructure(root.BoqHeaderFk).then(function (data) {
							generateWipBoqStructureService.setSelectedHeaderFkByHeader(data);
							angular.forEach($scope.tools.items, function (item) {
								if (item.id === 'create'){
									item.disabled = !generateWipBoqStructureService.createTempNewItem(true, selected);
								}
								else if (item.id === 'newDivision'){
									item.disabled = !generateWipBoqStructureService.createTempNewDivision(true,selected);
								}
								else if (item.id === 'newSubDivision'){
									item.disabled = !generateWipBoqStructureService.createTempNewSubDivision(true, selected);
								}
								else if (item.id === 'delete'){
									item.disabled = selected === null;
								}
							});

							$scope.tools.update();
						});
					}
				}

				function updateTools(){
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'create'){
							item.disabled = true;
						}
						else if (item.id === 'newDivision'){
							item.disabled = true;
						}
						else if (item.id === 'newSubDivision'){
							item.disabled = true;
						}
						else if (item.id === 'delete'){
							item.disabled = true;
						}
					});
				}

				gridDataService.loadToolsChange.register(updateTools);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

				$scope.$on('$destroy', function () {
					gridDataService.loadToolsChange.unregister(updateTools);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
						// platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					}
					gridDataService.setIsOpening(false);
				});

				init();
			}]);
})();
