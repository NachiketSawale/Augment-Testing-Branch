/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainEstUpp2CostcodeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the Estimate Upp2Costcode Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('estimateMainEstUpp2CostcodeDetailController',
		['$scope', '$timeout','$injector',  'platformGridAPI', 'platformCreateUuid', 'platformRuntimeDataService', 'estimateMainUpp2CostCodeDetailUIConfigService', 'estimateMainUpp2CostcodeDetailDataService', 'platformGridControllerService', 'estimateMainEstUppDataService','estimateMainDialogProcessService', 'basicsLookupdataLookupDescriptorService',
			function ($scope,  $timeout, $injector, platformGridAPI, platformCreateUuid, platformRuntimeDataService, upp2CostCodeDetailUIConfigService, upp2CostcodeDetailDataService, platformGridControllerService, estimateMainEstUppDataService, estimateMainDialogProcessService, basicsLookupdataLookupDescriptorService) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'CostCodeParentFk',
					childProp: 'CostCodes',
					childSort: true,
					enableDraggableGroupBy: false,
					skipPermissionCheck : true,
					enableConfigSave: false,
					cellChangeCallBack :function(arg){
						upp2CostcodeDetailDataService.setUppId(arg);
					}
				};

				$scope.gridId = platformCreateUuid();
				upp2CostcodeDetailDataService.setGuid($scope.gridId);

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function(tools){
					tools.update = function () {
						tools.version += 1;
					};
				};

				$scope.removeToolByClass = function removeToolByClass() {
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't7',
							sort: 60,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								platformGridAPI.rows.collapseNode($scope.gridId);
							}
						},
						{
							id: 't8',
							sort: 70,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								platformGridAPI.rows.expandNode($scope.gridId);
							}
						},
						{
							id: 't10',
							sort: 90,
							caption: 'cloud.common.toolbarExpandAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function expandAll() {
								platformGridAPI.rows.expandAllSubNodes($scope.gridId);
							}
						},
						{
							id: 't9',
							sort: 80,
							caption: 'cloud.common.toolbarCollapseAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function collapseAll() {
								platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
							}
						},
						{
							id: 't1',
							sort: 110,
							caption: 'cloud.common.taskBarSearch',
							type: 'check',
							value: '',// platformGridAPI.filters.showSearch($scope.gridId),
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								$scope.toggleFilter(this.value);
							},
							disabled: function () {
								return $scope.showInfoOverlay;
							}
						},
						{
							id: 'refreshAll',
							sort: 111,
							caption: 'cloud.common.toolbarRefresh',
							type: 'item',
							iconClass: 'tlb-icons ico-refresh',
							fn: function () {
								// refresh the master cost code

								let datalist = upp2CostcodeDetailDataService.getOriginList();
								upp2CostcodeDetailDataService.setDataListFromMdc(datalist, true);
							}
						}
					],
					update : function () {}
				};

				function resize() {
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				function init() {
					// setDataSource(estimateMainEstUppDataService.getUpp2CostcodeDetails());

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					// upp2CostcodeDetailDataService.clearData();
					platformGridControllerService.initListController($scope, upp2CostCodeDetailUIConfigService, upp2CostcodeDetailDataService, null, myGridConfig);

					$injector.get('estimateMainDialogDataService').currentItemChangeFire();
					upp2CostcodeDetailDataService.forceGridRefresh();
				}

				function setDataSource(data) {
					upp2CostcodeDetailDataService.setDataList(data).then(function(items){
						$scope.data = items;
						upp2CostcodeDetailDataService.refreshGrid();
						$scope.onContentResized();
						let scope = estimateMainEstUppDataService.getCurrentScope();
						if(scope) {scope.isLoading = false;}
					});
				}

				function updateData(currentItem) {
					if(currentItem && currentItem.estUpp2CostCodeDetails){
						setDataSource(currentItem.estUpp2CostCodeDetails);
						upp2CostcodeDetailDataService.clear();
					}
				}

				function onRefreshData() {
					upp2CostcodeDetailDataService.refreshGrid();
				}

				estimateMainEstUppDataService.onItemChange.register(updateData);
				estimateMainDialogProcessService.onRefreshUppDetail.register(onRefreshData);

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					estimateMainEstUppDataService.onItemChange.unregister(updateData);
					estimateMainDialogProcessService.onRefreshUppDetail.unregister(onRefreshData);

					basicsLookupdataLookupDescriptorService.removeData('contextcostcodes');
					upp2CostcodeDetailDataService.clear();
					upp2CostcodeDetailDataService.setIsCurrentBoqUppConfiged(false);

				});

				init();
			}
		]);
})();
