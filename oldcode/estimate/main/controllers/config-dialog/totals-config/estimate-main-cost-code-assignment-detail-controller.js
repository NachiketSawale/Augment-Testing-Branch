/**
 * Created by lnt on 8/4/2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainCostCodeAssignmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the cost code assignment details view.
	 */
	angular.module(moduleName).controller('estimateMainCostCodeAssignmentDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainCostCodeAssignmentDetailUIConfigurationService', 'estimateMainCostCodeAssignmentDetailDataService', 'platformGridControllerService', 'estimateMainDialogProcessService', 'estimateMainEstTotalsConfigDetailValidationService',
		'estimateMainEstTotalsConfigDetailDataService', 'basicsLookupdataLookupDescriptorService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, assginmentDetailUIConfigService, assignmentDetailDataService, platformGridControllerService, estimateMainDialogProcessService, configDetailValidationService,
			estimateMainEstTotalsConfigDetailDataService, basicsLookupdataLookupDescriptorService) {

			let readOnly = false;
			let config = $injector.get('estimateMainDialogProcessService').getDialogConfig();
			let editType = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getEditType();

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				enableConfigSave: false,
				skipPermissionCheck: true,
				rowChangeCallBack: function () {
					updateTools();
				},
				cellChangeCallBack: function (arg) {
					let col = arg.grid.getColumns()[arg.cell].field;
					if(col === 'MdcCostCodeFk'){
						let lookupType = editType === 'estimate' ? 'estmasterprojectcostcode': 'costcode';
						let costcodeItem =  basicsLookupdataLookupDescriptorService.getLookupItem(lookupType, arg.item.MdcCostCodeFk);
						if(costcodeItem) {
							arg.item.BasUomFk = costcodeItem.UomFk;
							arg.item.CurrencyFk = costcodeItem.CurrencyFk;
							arg.item.CostcodeTypeFk = costcodeItem.CostCodeTypeFk;
						}
					}
					assignmentDetailDataService.setItemToSave(arg.item);
					assignmentDetailDataService.refreshGrid();
				}
			};

			$scope.gridId = '6a61b64e80a1478c991276b77c70484d';
			assignmentDetailDataService.gridId = $scope.gridId;
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
							let tolCofDetailItem = estimateMainEstTotalsConfigDetailDataService.getSelected();
							assignmentDetailDataService.createItem(tolCofDetailItem ? tolCofDetailItem.Id : 0);
							assignmentDetailDataService.updateColumn(readOnly, true);
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
							let items =  assignmentDetailDataService.getSelectedEntities();
							angular.forEach(items,function (item) {
								assignmentDetailDataService.deleteItem(item);
							});

						},
						disabled: true
					}
				],
				update: function () {
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
				platformGridControllerService.initListController($scope, assginmentDetailUIConfigService, assignmentDetailDataService, configDetailValidationService, myGridConfig);
				estimateMainEstTotalsConfigDetailDataService.selectToLoad.fire();
			}

			function setDataSource(data) {
				$scope.data = data;
				assignmentDetailDataService.setDataList(data);
				assignmentDetailDataService.refreshGrid();
				$scope.onContentResized();
			}

			function updateData(currentItem) {
				setDataSource(currentItem);
				if((config && config.editType && config.editType === 'customizeforall') || readOnly){
					readOnly = true;
				}
				else {
					readOnly = false;
				}
				assignmentDetailDataService.updateColumn(readOnly);
			}

			// set/reset toolbar items readonly
			function updateTools(isReadOnlyCostCodeAssignment) {

				let  estTotalsConfigDetail = estimateMainEstTotalsConfigDetailDataService.getSelected();
				readOnly = estimateMainDialogProcessService.isTolDetailReadOnly();
				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					if (!readOnly && item.id === 'create') {
						item.disabled = !estTotalsConfigDetail || (estTotalsConfigDetail && estTotalsConfigDetail.LineType !==0);
					}

					if (!readOnly && item.id === 'delete') {
						item.disabled = !assignmentDetailDataService.getSelected() || (estTotalsConfigDetail && estTotalsConfigDetail.LineType !==0);
					}
				});

				if(estTotalsConfigDetail && isReadOnlyCostCodeAssignment) {
					let costCodeAssignmentGrid = $injector.get ('platformGridAPI').grids.element ('id', assignmentDetailDataService.gridId);
					if (estTotalsConfigDetail.LineType !== 0 && costCodeAssignmentGrid) {
						let items =  assignmentDetailDataService.getList();
						angular.forEach(items,function (item) {
							assignmentDetailDataService.deleteItem(item);
						});

					}
				}
			}

			estimateMainEstTotalsConfigDetailDataService.selectToLoad.register(updateData);


			function onSelectedRowsChanged() {
				updateTools();
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


			function readOnlyCostCodeAssignment(){
				updateTools(true);
			}
			assignmentDetailDataService.readOnlyCostCodeAssignment.register(readOnlyCostCodeAssignment);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainEstTotalsConfigDetailDataService.selectToLoad.unregister(updateData);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				assignmentDetailDataService.readOnlyCostCodeAssignment.unregister(readOnlyCostCodeAssignment);
			});

			init();
		}
	]);
})();
