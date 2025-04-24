/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global $ */
	'use strict';
	let moudleName= 'estimate.main';
	angular.module(moudleName).controller('costTransferOptionProfileDialogController',['_','$timeout','$injector', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsCommonHeaderColumnCheckboxControllerService', 'costTransferOptionProfileService','platformRuntimeDataService','cloudCommonGridService',
		'basicsLookupdataLookupDataService','basicsLookupdataLookupViewService','basicsLookupdataLookupControllerFactory',
		function (_,$timeout,$injector, $scope, platformGridAPI, platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService,
			costTransferOptionProfileService,platformRuntimeDataService,cloudCommonGridService,lookupDataService,
			basicsLookupdataLookupViewService,basicsLookupdataLookupControllerFactory) {

			let options = $scope.modalOptions || {};
			let resultGridId = options.gridId;
			let data = costTransferOptionProfileService.getResourceTypeList() || [];

			let resultTreeEntities = angular.copy(data);
			let resultTreeEntitiesOutput = [];
			cloudCommonGridService.flatten(resultTreeEntities, resultTreeEntitiesOutput, 'resultChildren');

			let costCodeFksOfResources = costTransferOptionProfileService.getCostCodeFksOfResources() || [];

			let columns = options.columns;
			let defaultColumns = $injector.get('costTransferOptionProfileCostCodeUIService').getListColumnsView();
			defaultColumns = angular.isArray(columns) ? columns : defaultColumns;
			$scope.gridId = resultGridId;

			if ($scope.options.dataView === undefined) {
				$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
				$scope.options.dataView.dataPage.size = 100;
				$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('costtransfer');
			}

			$scope.costType =[];
			$scope.isDirectCost = options.parentScope.entity.boqPackageAssignmentEntity.IsDirectCost;
			$scope.isIndirectCost = options.parentScope.entity.boqPackageAssignmentEntity.IsIndirectCost;
			$scope.isMarkUpCost = options.parentScope.entity.boqPackageAssignmentEntity.isMarkUpCost;
			$scope.gridData = {
				state: resultGridId
			};


			let isDirectCostIndeterminate = options.parentScope.entity.isDirectCostIndeterminate;
			let isIndirectCostIndeterminate = options.parentScope.entity.isIndirectCostIndeterminate;
			let isMarkUpCostIndeterminate = options.parentScope.entity.isMarkUpCostIndeterminate;


			let gridConfig = {
				columns: defaultColumns,
				data: [],
				id: resultGridId,
				gridId:resultGridId,
				idProperty: 'Id',
				lazyInit: true,
				options: {
					tree: true,
					parentProp: 'CostCodeParentFk',
					collapsed: false,
					expanded:true,
					showHeaderRow: false,
					showFilterRow: false,
					childProp: 'resultChildren'
				},
				treeOptions: {
					tree: true,
					idProperty: 'Id',
					parentProp: 'CostCodeParentFk',
					childProp: 'resultChildren',
					collapsed: false,
					expanded:true,
					showFilterRow: false,
					showHeaderRow: false
				},
				gridOptions:{
					showFilterRow: false
				}
			};

			platformGridAPI.events.register(resultGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
			platformGridAPI.events.register(resultGridId, 'onCellChange', onCellChange);

			$scope.ok = ok;
			$scope.cancel = cancel;

			if (!$scope.tools) {
				basicsLookupdataLookupControllerFactory.create({grid: true,dialog: true,search: false},$scope, gridConfig);
			}

			let toolItems =[];
			toolItems.push(
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
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes($scope.gridId);
					}
				});

			platformTranslateService.translateGridConfig(gridConfig);

			$scope.tools.items = toolItems.concat($scope.tools.items);

			$scope.onModeResult= function onModeResult(costType){
				let grid = platformGridAPI.grids.element('id',resultGridId).instance;
				let gridlist = grid.getData().getRows();
				setReadonlyItem(gridlist,costType,($scope.isDirectCost || $scope.isIndirectCost));
				controlGridHeaderChecked();
				grid.invalidate();
			};

			function setupGrid() {

				let columns = angular.copy(defaultColumns);

				if (!platformGridAPI.grids.exist(resultGridId)) {
					let resultGridConfig = {
						columns: columns,
						data: [],
						id: resultGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
					platformTranslateService.translateGridConfig(resultGridConfig.columns);

					let headerCheckBoxFields = ['isSelect'];
					let headerCheckBoxEvents = [
						{
							source: 'grid',
							name: 'onHeaderCheckboxChanged',
							fn: onHeaderCheckboxChanged
						}
					];
					basicsCommonHeaderColumnCheckboxControllerService.setGridId(resultGridId);
					basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
				}
			}

			function updateGrid(resultGridData) {
				platformGridAPI.grids.invalidate(resultGridId);
				platformGridAPI.items.data(resultGridId, resultGridData);
				platformGridAPI.rows.expandAllNodes($scope.gridId);
			}

			function init(){
				if (data){
					setupGrid();
					updateGrid(data);

					let output = [];
					let tempData = cloudCommonGridService.flatten(data, output, 'resultChildren');
					processItems(tempData);

					// indeterIndirectCostChecBox(tempData);
					// indeterDirectCostCostChecBox(tempData);
					// indeterMarkUpCostChecBox(tempData);

					$timeout(function(){
						controlGridHeaderChecked();
						platformGridAPI.rows.expandAllNodes($scope.gridId);
					},200);
				}
			}

			init();

			function setCanSelectedCostCodes(data,isSelect,costType){
				let ids = costCodeFksOfResources;
				_.forEach(data,function(item){
					item.Selected=false;
					if(ids && ids.indexOf(item.Id)<=-1 && item.Id!== -1){
						item.Selected='readonly';
						item.isSelect = false;
						platformRuntimeDataService.readonly(item, [{field: 'isSelect', readonly: item.Selected}]);
					}else {
						if (isSelect !== undefined) {
							if (costType === 'IndirectCost'){
								if (item.IsIndirectCost) {
									if(!item.IsCost){
										isSelect = item.isSelect  = $scope.isMarkUpCost;
									}else {
										isSelect = item.isSelect = $scope.isIndirectCost;
									}
								}
							} else if (costType === 'DirectCost'){
								if (!item.IsIndirectCost) {

									if(!item.IsCost){
										isSelect = item.isSelect  = $scope.isMarkUpCost;
									}else{
										isSelect = item.isSelect = $scope.isDirectCost;
									}
								}
							}else if(costType === 'isMarkUpCost'){
								if(!item.IsCost){
									isSelect = item.isSelect  = $scope.isMarkUpCost;
								}
							} else {
								if (isSelect) {
									if (item.IsIndirectCost) {
										item.isSelect = (!item.IsCost) ? $scope.isMarkUpCost: $scope.isIndirectCost;
									} else {
										item.isSelect = (!item.IsCost) ? $scope.isMarkUpCost: $scope.isDirectCost;
									}
								} else {
									item.isSelect = isSelect;
								}
							}
						}else {
							if (item.IsIndirectCost) {
								if (!item.IsCost) {
									item.isSelect = isMarkUpCostIndeterminate ? item.isSelect : $scope.isMarkUpCost;
								} else {
									item.isSelect = isIndirectCostIndeterminate ? item.isSelect : $scope.isIndirectCost;
								}
							}

							if (!item.IsIndirectCost) {

								if (!item.IsCost) {
									item.isSelect = isMarkUpCostIndeterminate ? item.isSelect : $scope.isMarkUpCost;
								} else {
									item.isSelect = isDirectCostIndeterminate ? item.isSelect : $scope.isDirectCost;
								}
							}

							if (!item.IsCost) {
								item.isSelect = isMarkUpCostIndeterminate ? item.isSelect : $scope.isMarkUpCost;
							}
						}
						platformRuntimeDataService.readonly(item, [{field: 'isSelect', readonly: false}]);
					}
					if(item.resultChildren){
						setCanSelectedCostCodes(item.resultChildren,isSelect,costType);
					}
				});
			}

			function ok() {
				let selectedItems =[];
				let estimateMainCreateBoQPackageWizardService =$injector.get('estimateMainCreateBoQPackageWizardService');
				if (costTransferOptionProfileService && angular.isFunction(costTransferOptionProfileService.getSelectedItem)) {
					selectedItems = costTransferOptionProfileService.getSelectedItem();
				}
				options.parentScope.entity.boqPackageAssignmentEntity.CostTransferOptprofile = selectedItems;

				options.parentScope.entity.isDirectCostIndeterminate = isDirectCostIndeterminate;
				options.parentScope.entity.isIndirectCostIndeterminate = isIndirectCostIndeterminate;
				options.parentScope.entity.isMarkUpCostIndeterminate = isMarkUpCostIndeterminate;

				estimateMainCreateBoQPackageWizardService.validateBoqPackageItem(options.parentScope.entity.boqPackageAssignmentEntity);
				$scope.$close({isOk: true, data: selectedItems,isDirectCost:$scope.isDirectCost,isIndirectCost:$scope.isIndirectCost,isMarkUpCost:$scope.isMarkUpCost});
			}

			function cancel() {
				$scope.$close();
			}

			function onHeaderCheckboxChanged(e,arg) {
				keepSpecFieldsSelected(e.target.checked);
				if(!e.target.checked){
					onCellChange(e,arg);
					$scope.safeApply();
				}else{
					if($scope.isDirectCost){
						let isDirectCostElement = $('#isDirectCost');
						isDirectCostElement.prop('checked', true);
						isDirectCostElement.prop('indeterminate', false);
					}

					if($scope.isIndirectCost) {
						let isIndirectCostElement = $('#isIndirectCost');
						isIndirectCostElement.prop('checked', true);
						isIndirectCostElement.prop('indeterminate', false);
					}
				}
			}

			function keepSpecFieldsSelected(isSelect) {
				setCanSelectedCostCodes(data,isSelect);
			}

			function processItems(data) {
				setReadonlyItem(data);

				let readonlyColums = ['Code','Remark','DayWorkRate','CurrencyFk','Rate','UomFk','IsRate','IsLabour',
					'CostCodeTypeFk','CostCodePortionsFk','CostGroupPortionsFk','AbcClassificationFk','PrcStructureFk',
					'ContrCostCodeFk','EfbType221Fk','EfbType222Fk','FactorHour','UserDefined5','UserDefined4','UserDefined3','UserDefined2','UserDefined1',
					'RealFactorQuantity','FactorQuantity','RealFactorCosts','FactorCosts','Description2Info','IsCost','IsProjectChildAllowed','IsEditable',
					'IsBudget','IsIndirectCost','Description','EstCostTypeFk'];

				let fields = [];

				_.each(readonlyColums, function (column) {
					fields.push({field: column, readonly: true});
				});

				_.forEach(data, function (item) {
					platformRuntimeDataService.readonly(item, fields);
				});

			}


			function onCellChange(e,arg){
				let gridList  = arg.grid.getData().getRows();

				indeterIndirectCostChecBox(gridList);
				indeterDirectCostCostChecBox(gridList);
				indeterMarkUpCostChecBox(gridList);

				if(e.target){
					setReadonlyItem(gridList,'change',e.target.checked);
				}
				// else{
				//   //  indeterminateTheCheckBox(arg.item,gridList);
				// }
				controlGridHeaderChecked();
				arg.grid.invalidate();
			}


			function indeterMarkUpCostChecBox(gridList){
				let isMarkUpCostElement = $('#isMarkUpCost');
				let ids = costCodeFksOfResources;
				let isMarkUpCostCodes  =[];

				_.forEach(gridList,function(item) {
					item.Selected = false;
					if (ids && ids.indexOf(item.Id)>=0 ) {
						if(!item.IsCost){
							isMarkUpCostCodes.push(item);
						}
					}
				});

				let noisMarkUpCostCodesSelectedList  = _.filter(isMarkUpCostCodes,function(item){
					return !item.isSelect;
				});

				if(noisMarkUpCostCodesSelectedList && noisMarkUpCostCodesSelectedList.length === isMarkUpCostCodes.length ){
					isMarkUpCostElement.prop('checked', false);
					isMarkUpCostElement.prop('indeterminate', false);
					$scope.isMarkUpCost = false;
					isMarkUpCostIndeterminate =  false;
				}else if(noisMarkUpCostCodesSelectedList && noisMarkUpCostCodesSelectedList.length ===0){
					isMarkUpCostElement.prop('checked', true);
					isMarkUpCostElement.prop('indeterminate', false);
					$scope.isMarkUpCost = true;
					isMarkUpCostIndeterminate =  false;
				}else{
					isMarkUpCostElement.prop('checked', false);
					isMarkUpCostElement.prop('indeterminate', true);
					isMarkUpCostIndeterminate =  true;
					$scope.isMarkUpCost = true;
				}
			}

			function  indeterIndirectCostChecBox(gridList){
				let isIndirectCostElement = $('#isIndirectCost');
				let ids = costCodeFksOfResources;
				let indirectCostCodes  =[];

				_.forEach(gridList,function(item) {
					item.Selected = false;
					if (ids && ids.indexOf(item.Id)>=0 ) {
						if(item.IsIndirectCost && item.IsCost){
							indirectCostCodes.push(item);
						}
					}
				});

				let noIndirectCostCodesSelectedList  = _.filter(indirectCostCodes,function(item){
					return !item.isSelect;
				});


				if(noIndirectCostCodesSelectedList && noIndirectCostCodesSelectedList.length === indirectCostCodes.length ){
					isIndirectCostElement.prop('checked', false);
					isIndirectCostElement.prop('indeterminate', false);
					isIndirectCostIndeterminate = false;
					$scope.isIndirectCost = false;
				}else if(noIndirectCostCodesSelectedList && noIndirectCostCodesSelectedList.length ===0){
					isIndirectCostElement.prop('checked', true);
					isIndirectCostElement.prop('indeterminate', false);
					isIndirectCostIndeterminate = false;
					$scope.isIndirectCost = true;
				}else{
					isIndirectCostElement.prop('checked', false);
					isIndirectCostElement.prop('indeterminate', true);
					isIndirectCostIndeterminate = true;
					$scope.isIndirectCost = true;
				}

			}

			function  indeterDirectCostCostChecBox(gridList){
				let ids = costCodeFksOfResources;
				let directCostCodes  =[];

				_.forEach(gridList,function(item) {
					item.Selected = false;
					if (ids && ids.indexOf(item.Id)>=0 ) {
						if(!item.IsIndirectCost && item.IsCost){
							directCostCodes.push(item);
						}
					}
				});

				let noDirectCostCodesSelectedList  = _.filter(directCostCodes,function(item){
					return !item.isSelect;
				});

				let isDirectCostElement = $('#isDirectCost');

				if(noDirectCostCodesSelectedList && noDirectCostCodesSelectedList.length === directCostCodes.length ){
					isDirectCostElement.prop('checked', false);
					isDirectCostElement.prop('indeterminate', false);
					isDirectCostIndeterminate = false;
					$scope.isDirectCost = false;
				}else if(noDirectCostCodesSelectedList && noDirectCostCodesSelectedList.length ===0){
					isDirectCostElement.prop('checked', true);
					isDirectCostElement.prop('indeterminate', false);
					isDirectCostIndeterminate = false;
					$scope.isDirectCost = true;
				}else{
					isDirectCostElement.prop('checked', false);
					isDirectCostElement.prop('indeterminate', true);
					isDirectCostIndeterminate = true;
					$scope.isDirectCost = true;
				}
			}

			// control the button on the header
			function controlGridHeaderChecked (){

				let grid = platformGridAPI.grids.element('id',resultGridId).instance;

				if(grid){
					let columnId = 'isSelect';
					let readOnlyKey =  '_readonly';
					let headers = grid.getColumnHeaders();
					let rel = headers.find('#chkbox_' + grid.getUID() + readOnlyKey + '_' + columnId);

					let rel2 = headers.find('#chkbox_' + grid.getUID() + '_'+ columnId);


					if( !$scope.isDirectCost && !$scope.isIndirectCost){
						rel.prop('disabled', true);
						rel.prop('indeterminate',false);
						rel.prop('checked',false);
						rel.prop('id', 'chkbox_' + grid.getUID() + readOnlyKey + '_'+ columnId);

						rel2.prop('disabled', true);
						rel2.prop('indeterminate',false);
						rel2.prop('checked',false);
						rel2.prop('id', 'chkbox_' + grid.getUID() + readOnlyKey + '_'+ columnId);

						platformGridAPI.grids.refresh(resultGridId, true);
					}else{
						rel.prop('disabled', false);
						rel.prop('id', 'chkbox_' + grid.getUID() + '_' + columnId);
						rel.prop('indeterminate',true);
						rel.prop('checked',true);

						rel2.prop('indeterminate',true);
						rel2.prop('disabled', false);
						rel2.prop('checked',true);
						rel2.prop('id', 'chkbox_' + grid.getUID() + '_' + columnId);

						platformGridAPI.grids.refresh(resultGridId, true);

					}
				}
			}

			function setReadonlyItem(gridList,costType,isSelected){

				if(costType === 'DirectCost')
				{
					_.filter(gridList, function (item) {
						if(!item.IsIndirectCost && costCodeFksOfResources.indexOf(item.Id)>-1 ){
							if(!item.IsCost){
								isSelected = item.isSelect  = ($scope.isMarkUpCost &&  $scope.isDirectCost);
							}else{
								isSelected = item.isSelect  = $scope.isDirectCost;
							}
						}

					});
				}else if(costType === 'IndirectCost'){
					_.filter(gridList, function (item) {
						if(item.IsIndirectCost && costCodeFksOfResources.indexOf(item.Id)>-1){
							isSelected = item.isSelect  = $scope.isIndirectCost;
						}
					});
				}else if(costType ==='change') {
					_.filter(gridList, function (item) {
						if(!item.IsIndirectCost && costCodeFksOfResources.indexOf(item.Id)>-1 ){
							item.isSelect  = $scope.isDirectCost;
						}else if(item.IsIndirectCost && costCodeFksOfResources.indexOf(item.Id)>-1){
							item.isSelect  = $scope.isIndirectCost;
						}
					});
				}else if(costType === 'isMarkUpCost'){
					_.filter(gridList, function (item) {
						if(!item.IsCost){
							item.isSelect  = $scope.isMarkUpCost;
						}
					});
				}

				setCanSelectedCostCodes(gridList,isSelected,costType);
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(resultGridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister(resultGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
			});
		}
	]);
})(angular);

