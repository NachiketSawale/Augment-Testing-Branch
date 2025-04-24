/**
 * Created by lnt on 8/3/2016.
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
	 * @name estimateMainTotalsConfigDetailController
	 * @function
	 *
	 * @description
	 * Controller for the Totals configuration details view.
	 */
	angular.module(moduleName).controller('estimateMainTotalsConfigDetailController', ['_',
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainEstTotalsConfigDetailDataService', 'platformGridControllerService', 'estimateMainDialogProcessService', 'estimateMainEstTotalsConfigDetailValidationService', 'estimateMainEstTotalsConfigDataService', 'estimateMainCostCodeAssignmentDetailDataService',
		function (_, $scope, $timeout, $injector, platformGridAPI, platformCreateUuid, configDetailDataService, platformGridControllerService, estimateMainDialogProcessService, configDetailValidationService, estimateMainEstTotalsConfigDataService, assignDetailDataService) {
			let isMove = false;
			let readOnly = false;
			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				enableConfigSave: false,
				skipPermissionCheck: true,
				rowChangeCallBack: function () {
					let selectedItem = configDetailDataService.getSelected();
					if(selectedItem && (_.isNull(selectedItem.DescriptionInfo.Translated) || selectedItem.DescriptionInfo.Translated === '')){
						configDetailDataService.onTotalsConfigStatusChange.fire(false);
					}
					if (!isMove) {
						let isMoveUporDwon = configDetailDataService.getIsMove(); // if move up/dwon, no cost code assignment load
						if(!isMoveUporDwon) {
							// To do: when selecting totals change,to show the cost code assignment
							configDetailDataService.selectChange();
						}
						else {
							isMove = isMoveUporDwon;
						}
					}
					else {
						isMove = false;
						configDetailDataService.setIsNoMove();
					}
				},
				cellChangeCallBack: function (arg) {
					let col = arg.grid.getColumns()[arg.cell].field;
					if(col === 'DescriptionInfo'){
						let items = configDetailDataService.getList();
						let errorData = _.filter(items,function (item) {
							return _.isNull(item.DescriptionInfo.Translated) || item.DescriptionInfo.Translated === '';
						});
						configDetailDataService.onTotalsConfigStatusChange.fire(!errorData.length > 0);
					}
					configDetailDataService.setItemToSave(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();
			configDetailDataService.gridId = $scope.gridId;

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
						id: 'copy',
						sort: 0,
						caption: 'cloud.common.toolbarCopy',
						type: 'item',
						iconClass: 'tlb-icons ico-copy',
						fn: function () {
							let colConfig = estimateMainEstTotalsConfigDataService.getTotalsConfigData();
							let items = configDetailDataService.getSelectedEntities();
							angular.forEach(items,function (item) {
								let sorting = colConfig.EstTotalsConfigDetails && colConfig.EstTotalsConfigDetails.length > 0 ? _.maxBy(colConfig.EstTotalsConfigDetails, 'Sorting').Sorting + 1: 0;
								configDetailDataService.createDeepCopy(colConfig && colConfig.EstTotalsConfig ? colConfig.EstTotalsConfig.Id : 0, item, sorting);
							});
						},
						disabled: false
					},
					{
						id: 'create',
						sort: 1,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							let colConfig = estimateMainEstTotalsConfigDataService.getTotalsConfigData();
							let sorting = colConfig.EstTotalsConfigDetails && colConfig.EstTotalsConfigDetails.length > 0 ? _.maxBy(colConfig.EstTotalsConfigDetails, 'Sorting').Sorting + 1: 0;
							configDetailDataService.createItem(colConfig && colConfig.EstTotalsConfig ? colConfig.EstTotalsConfig.Id : 0, sorting);
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							let items = configDetailDataService.getSelectedEntities();
							angular.forEach(items,function (item) {
								configDetailDataService.deleteItem(item);
							});
							assignDetailDataService.setDataList([]);
							assignDetailDataService.refreshGrid();
						},
						disabled: true
					},
					{
						id: 'moveUp',
						sort: 3,
						caption: 'estimate.main.totalsConfigDetails.toolsUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							configDetailDataService.moveUp(1,$scope.gridId);
						},
						disabled: true
					},
					{
						id: 'moveDown',
						sort: 4,
						caption: 'estimate.main.totalsConfigDetails.toolsDown',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							configDetailDataService.moveDown(3,$scope.gridId);
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

				let config = $injector.get('estimateMainDialogProcessService').getDialogConfig();

				let configDetailUIConfigService = $injector.get('estimateMainEstTotalsConfigDetailUIConfigurationService');

				if(config && config.editType && config.editType === 'assemblies') {
					configDetailUIConfigService = $injector.get('estimateMainAssemblyTotalsConfigDetailUIConfigurationService');
				}

				platformGridControllerService.initListController($scope, configDetailUIConfigService, configDetailDataService, configDetailValidationService, myGridConfig);


				if(config && config.editType && (config.editType === 'customizefortotals' || config.editType === 'assemblies')){
					$injector.get('estimateMainDialogDataService').currentItemChangeFire();
				}

				// workaround for setting the header checkbox read only // or we have to update the framework js file: checkbox-column
				$timeout(function(){
					configDetailDataService.setIsLaborHeaderChkBoxReadonly(estimateMainDialogProcessService.isTolDetailReadOnly());
				});
			}

			function setDataSource(data) {
				$scope.data = data;
				configDetailDataService.setDataList(data);
				assignDetailDataService.clear();
				// Wait for UI to show
				$timeout(function(){
					configDetailDataService.refreshGrid();
				});

				$scope.selectedEntityID = -1;
				// $scope.onContentResized();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.EstTotalsConfigDetails);
			}
			// set/reset toolbar items readonly
			function updateTools() {
				readOnly = estimateMainDialogProcessService.isTolDetailReadOnly();

				if (!readOnly){
					configDetailDataService.setIsLaborHeaderChkBoxReadonly(estimateMainDialogProcessService.isTolDetailReadOnly());
				}

				let disableMoveUp = true;
				let disableMoveDown = true;

				let gridInstance = platformGridAPI.grids.element('id', $scope.gridId).instance;
				if(gridInstance) {
					let cell = gridInstance.getActiveCell();
					let selectedRows = gridInstance.getSelectedRows();
					let dataServiceLength = estimateMainEstTotalsConfigDataService.getTotalsConfigDetails() ? estimateMainEstTotalsConfigDataService.getTotalsConfigDetails().length-1 : -1;
					if(cell) {
						let rowIndex = cell.row;
						disableMoveUp = rowIndex === 0;
						disableMoveDown = rowIndex ===  dataServiceLength;
					} else if(configDetailDataService.getSelectedEntities().length > 0) {
						angular.forEach(selectedRows,function (data) {
							disableMoveUp = data === 0;
							disableMoveDown = data === dataServiceLength;
						});
					}
				}

				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					let disable = !gridInstance;
					if (!readOnly && item.id === 'delete') {
						item.disabled = disable;
					}
					if (!readOnly && item.id === 'copy') {
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

			function onLineTypeChange(lineType) {
				let selectedItem = configDetailDataService.getSelected ();
				if (selectedItem) {
					let fields = [];
					fields.push ({field: 'BasUomFk', readonly: !!lineType});
					fields.push ({field: 'IsLabour', readonly: !!lineType});
					fields.push ({field: 'EstTotalDetail2CostTypes', readonly: !!lineType});
					fields.push ({field: 'EstTotalDetail2ResourceFlags', readonly: !!lineType});
					$injector.get ('platformRuntimeDataService').readonly (selectedItem, fields);

					if(lineType){
						selectedItem.BasUomFk = null;
						selectedItem.IsLabour = null;
						selectedItem.EstTotalDetail2CostTypes = null;
						selectedItem.EstTotalDetail2ResourceFlags = null;
					}
				}
			}
			$scope.configItems = platformGridAPI.configuration.getPropConfig();

			estimateMainEstTotalsConfigDataService.onItemChange.register(updateData);

			configDetailDataService.onLineTypeChange.register(onLineTypeChange);

			estimateMainDialogProcessService.onRefreshTolDetail.register(updateTools);
			configDetailDataService.registerSelectionChanged(updateTools);

			// pre-load the cost type and resource flag data, work around for total cost types and resource flags labels for 1 checked item
			$injector.invoke(['basicsLookupdataSimpleLookupService', function(basicsLookupdataSimpleLookupService){
				basicsLookupdataSimpleLookupService.getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'estimate.lookup.costtype'});
				basicsLookupdataSimpleLookupService.getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'estimate.lookup.resourceflag'});
				basicsLookupdataSimpleLookupService.getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'estimate.lookup.costtype2'});
				basicsLookupdataSimpleLookupService.getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'estimate.lookup.resourceflag2'});
			}]);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainEstTotalsConfigDataService.onItemChange.unregister(updateData);
				estimateMainDialogProcessService.onRefreshTolDetail.unregister(updateTools);
				configDetailDataService.unregisterSelectionChanged(updateTools);
				configDetailDataService.onLineTypeChange.unregister(onLineTypeChange);
			});

			init();
		}
	]);
})();
