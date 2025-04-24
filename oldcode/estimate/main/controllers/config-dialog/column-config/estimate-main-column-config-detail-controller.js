/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainColumnConfigDetailController
	 * @function
	 *
	 * @description
	 * Controller for the column configuration details view.
	 */
	angular.module(moduleName).controller('estimateMainColumnConfigDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformContextService',
		'estimateMainEstColumnConfigDetailUIStandardService', 'estimateMainEstColumnConfigDetailDataService', 'platformGridControllerService', 'estimateMainEstColumnConfigDataService', 'estimateMainDialogProcessService', 'estimateMainEstColumnConfigDetailValidationService','$http',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, platformContextService,
			configDetailUIConfigService, estimateMainEstColumnConfigDetailDataService, platformGridControllerService, estimateMainEstColumnConfigDataService, estimateMainDialogProcessService, configDetailValidationService,$http) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				enableConfigSave: false,
				skipPermissionCheck: true,
				cellChangeCallBack: function (arg) {
					estimateMainEstColumnConfigDetailDataService.setItemToSave(arg.item);
					configDetailValidationService.validGridItems(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();
			estimateMainEstColumnConfigDetailDataService.gridId = $scope.gridId;

			$scope.onContentResized = function () {
				resize();
			};

			$scope.setTools = function (tools) {
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
						fn: function () {
							let colConfig = estimateMainEstColumnConfigDataService.getColumnConfigData();
							estimateMainEstColumnConfigDetailDataService.createItem(colConfig && colConfig.estColumnConfig ? colConfig.estColumnConfig.Id : 0);
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 10,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							let SelectedEntities = estimateMainEstColumnConfigDetailDataService.getSelectedEntities();
							angular.forEach(SelectedEntities,function(cItem){
								estimateMainEstColumnConfigDetailDataService.deleteItem(cItem);
							});
						},
						disabled: true
					},
					{
						id: 'moveUp',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							estimateMainEstColumnConfigDetailDataService.moveUp(1,$scope.gridId);
						},
						disabled: true
					},
					{
						id: 'moveDown',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsDown',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							estimateMainEstColumnConfigDetailDataService.moveDown(3,$scope.gridId);
						},
						disabled: true
					}
				],
				update: function () {
					return;
				}
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
				platformGridControllerService.initListController($scope, configDetailUIConfigService, estimateMainEstColumnConfigDetailDataService, configDetailValidationService, myGridConfig);

				let config = $injector.get('estimateMainDialogProcessService').getDialogConfig();

				if (config && config.editType && config.editType === 'customizeforcolumn') {
					$injector.get('estimateMainDialogDataService').currentItemChangeFire();
				}

				$injector.get('estimateMainEstColumnConfigColumnIdsComboboxService').initColumnUserLabelName();
			}

			function setDataSource(data) {
				$scope.data = data;
				estimateMainEstColumnConfigDetailDataService.setDataList(data);
				estimateMainEstColumnConfigDetailDataService.refreshGrid();

				// refreshGrid() function will remove Event onSelectedRowsChanged
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			function updateData(currentItem) {
				loadCostCode().then(function () {
					setDataSource(currentItem.estColumnConfigDetails);
				});
			}

			function loadCostCode() {
				let estimateMainService = $injector.get('estimateMainService');
				var postData = {
					ProjectId: estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0,
					EstHeaderId: estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0,
					FilterByType: false
				};
				let loadCostCode = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/masterCCandProjectCCChildOnlyForConfig',postData);
				return  loadCostCode.then(function (response) {
					let costCode = response.data;
					if(costCode.length){
						let flattenDatas = [];
						$injector.get('cloudCommonGridService').flatten(costCode, flattenDatas,'CostCodes');
						$injector.get('estimateMainOnlyCostCodeAssignmentDetailLookupDataService').setFlattenDatas(flattenDatas);
					}
				});
			}

			// set/reset toolbar items readonly
			function updateTools(args) {
				let readOnly = estimateMainDialogProcessService.isColDetailReadOnly();

				let disableMoveUp = false;
				let disableMoveDown = false;

				let dataService=estimateMainEstColumnConfigDetailDataService.getList();

				if(args){
					for(let index in args.rows){
						if(args.rows[index] === 0) {
							disableMoveUp = true;
							break;
						}
					}

					for(let index1 in args.rows){
						if(args.rows[index1] === dataService.length-1) {
							disableMoveDown = true;
							break;
						}
					}

				}else{
					disableMoveUp = true;
					disableMoveDown = true;
				}


				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					let disable = !(args && args.rows.length>0);
					if (!readOnly && item.id === 'delete') {
						item.disabled = disable;
					}

					if (!readOnly && item.id === 'moveUp') {
						item.disabled = disableMoveUp;
					}

					if (!readOnly && item.id === 'moveDown') {
						item.disabled = disableMoveDown;
					}
				});
			}

			estimateMainEstColumnConfigDataService.onItemChange.register(updateData);
			estimateMainDialogProcessService.onRefreshColDetail.register(updateTools);

			function onSelectedRowsChanged(e, args){
				updateTools(args);
			}


			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainEstColumnConfigDataService.onItemChange.unregister(updateData);
				estimateMainDialogProcessService.onRefreshColDetail.unregister(updateTools);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			init();
		}
	]);
})();
