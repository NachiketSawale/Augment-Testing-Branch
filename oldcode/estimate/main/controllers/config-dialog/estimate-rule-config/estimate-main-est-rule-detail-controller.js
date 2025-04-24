/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainEstRuleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the Estimate Rule Config Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('estimateMainEstRuleDetailController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformRuntimeDataService', 'estimateMainRuleDetailUIConfigService', 'estimateMainRuleConfigDetailDataService', 'platformGridControllerService', 'estimateMainEstRuleDataService', 'estimateMainDialogProcessService','estimateMainEstRuleAssignValidationService', 'estimateMainEstRuleAssignmentParamDataService',
			function ($scope,  $timeout, $injector, platformGridAPI, platformCreateUuid, platformRuntimeDataService, ruleDetailUIConfigService, ruleDetailDataService, platformGridControllerService, estimateMainEstRuleDataService, estimateMainDialogProcessService, validationService, estimateMainEstRuleAssignmentParamDataService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					enableConfigSave: false,
					skipPermissionCheck : true,
					cellChangeCallBack :function(arg){
						ruleDetailDataService.setItemToSave(arg.item);
					},
					rowChangeCallBack: function rowChangeCallBack() {
						onSelectedRowsChanged();
					}
				};

				$scope.gridId = platformCreateUuid();
				ruleDetailDataService.gridId = $scope.gridId;

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function(tools){
					tools.update = function () {
						tools.version += 1;
					};
				};

				// Define standard toolbar Icons and their function on the scope
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
							fn: function(){
								let strConfig = estimateMainEstRuleDataService.getRootAssignConfig();
								ruleDetailDataService.createItem(strConfig && strConfig.Id ? strConfig.Id : 0);
							},
							disabled: false
						},
						{
							id: 'delete',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function(){
								let items =  ruleDetailDataService.getSelectedEntities();
								angular.forEach(items,function (item) {
									ruleDetailDataService.deleteItem(item);
								});
								// Update params grid
								ruleDetailDataService.selectToLoad.fire();
							},
							disabled: true
						}
					],
					update : function () {return;}
				};

				function resize() {
					$timeout(function () {
						updateTools();
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, ruleDetailUIConfigService, ruleDetailDataService, validationService, myGridConfig);

					$injector.get('estimateMainDialogDataService').currentItemChangeFire();
				}

				function setDataSource(data) {
					$scope.data = data;
					ruleDetailDataService.setDataList(data);
					estimateMainEstRuleAssignmentParamDataService.clear();

					// Wait for UI to show
					$timeout(function(){
						ruleDetailDataService.refreshGrid();
					});

					$scope.selectedEntityID = -1;
				}

				function updateData(currentItem) {
					setDataSource(currentItem.estRootAssignmentDetails);
				}

				// set/reset toolbar items readonly
				function updateTools() {
					let readOnly = estimateMainDialogProcessService.isRootAssignTypeDetailReadOnly();
					angular.forEach($scope.tools.items, function (item) {
						item.disabled = readOnly;
						if(!readOnly && item.id === 'delete'){
							item.disabled = !ruleDetailDataService.getSelected();
						}
					});
				}

				estimateMainEstRuleDataService.onItemChange.register(updateData);
				estimateMainDialogProcessService.onRefreshRootAssignDetail.register(updateTools);
				// ruleDetailDataService.selectionChanged.register(updateTools);


				function onSelectedRowsChanged(){
					let gridInstance = platformGridAPI.grids.element('id', $scope.gridId).instance;
					let row = gridInstance.getSelectedRows();
					if(row.length > 0){
						let selectedItems = gridInstance.getDataItem(_.head(row));
						ruleDetailDataService.setSelected(selectedItems);
					}
					updateTools();
					ruleDetailDataService.selectChange();
				}

				// ruleDetailDataService.registerSelectionChanged(onSelectedRowsChanged);
				// platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				ruleDetailDataService.registerLookupFilter();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					estimateMainEstRuleDataService.onItemChange.unregister(updateData);
					estimateMainDialogProcessService.onRefreshRootAssignDetail.unregister(updateTools);
					// platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					// ruleDetailDataService.unregisterSelectionChanged(onSelectedRowsChanged);

					ruleDetailDataService.unregisterLookupFilter();
				});

				init();
			}
		]);
})();
