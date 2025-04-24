(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemScopeReplacementController', procurementPackageItemScopeReplacementController);

	procurementPackageItemScopeReplacementController.$inject = ['globals','_', '$scope', '$translate', '$http', 'procurementCommonItemUIStandardService', 'procurementCommonPrcItemDataService', 'procurementPackageDataService', 'platformGridAPI', 'platformTranslateService', 'procurementPackageItemAssignmentDataService','procurementCommonTotalDataService','basicsLookupdataLookupControllerFactory','platformRuntimeDataService','prcCommonCalculationHelper'];

	function procurementPackageItemScopeReplacementController(globals,_, $scope, $translate, $http, procurementCommonItemUIStandardService, procurementCommonPrcItemDataService, procurementPackageDataService, platformGridAPI, platformTranslateService, procurementPackageItemAssignmentDataService,procurementCommonTotalDataService,lookupControllerFactory,platformRuntimeDataService,prcCommonCalculationHelper) {


		$scope.selectGridId = 'C10DDE19ED424A19AF345ABCD5785611';
		$scope.gridId = 'C10DDE19ED424A19AF345ABCD5785688';
		$scope.selectedPrcItemData = {
			state: $scope.selectGridId
		};
		$scope.prcItemGridData = {
			state: $scope.gridId
		};
		let itemSelected = procurementCommonPrcItemDataService.getService().getSelected();
		$scope.disableTargetItem =true;
		$scope.cantEditDisableTargetItem=false;
		loadSelectItem();
		loadItemGrid();
		loadItems();


		var tempData=[];
		function loadItems(){
			let packageId=itemSelected.PrcPackageFk;
			let prcHeaderFk=itemSelected.PrcHeaderFk;
			let prcItemId=itemSelected.Id;
			$http.get(globals.webApiBaseUrl + 'procurement/package/wizard/canReplacementPrcitemList?packageId='+packageId+'&prcHeaderId=' + prcHeaderFk+'&prcItemId='+prcItemId).then(function (res) {
				let itemData = res.data;
				let showPrcItemList=[];
				let noCheckNum=0;
				_.forEach(itemData, function (item) {
					if (item) {
						var showPrcItem=item.prcItem;
						showPrcItem.IsChecked=item.IsChecked;
						showPrcItemList.push(showPrcItem);
					}
					if(!item.IsChecked){
						noCheckNum=noCheckNum+1;
					}
					if(item.IsChecked&&itemSelected.BudgetTotal!==0){
						validateBudgetTotal(showPrcItem,showPrcItem.BudgetTotal);
					}
					else{
						showPrcItem.BudgetPercent=0;
					}
					if(itemSelected.BudgetTotal!==0) {
						if (!item.IsChecked) {
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetTotal', readonly: true}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetPercent', readonly: true}]);
						} else {
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetTotal', readonly: false}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetPercent', readonly: false}]);
						}
					}
					else{
						if (!item.IsChecked) {
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'Total', readonly: true}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetTotal', readonly: true}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetPercent', readonly: true}]);
						} else {
							showPrcItem.BudgetPercent=null;
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'Total', readonly: false}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetTotal', readonly: false}]);
							platformRuntimeDataService.readonly(showPrcItem, [{field: 'BudgetPercent', readonly: true}]);
						}
					}

				});
				if(noCheckNum>0&&noCheckNum===itemData.length){
					$scope.cantEditDisableTargetItem=true;
				}
				else{
					$scope.cantEditDisableTargetItem=false;
				}
				var defaultChecked=_.find(showPrcItemList,function(item){return item.IsChecked;});
				if(defaultChecked) {
					$scope.disableOk =false;
				}
				platformGridAPI.items.data($scope.gridId, showPrcItemList);
				platformGridAPI.grids.refresh($scope.gridId);
				tempData=_.map(showPrcItemList,function(item){return {id:item.Id,isChecked:item.IsChecked,BudgetTotal:item.BudgetTotal};});
			});
		}

		function loadSelectItem() {
			let columns = procurementCommonItemUIStandardService.getStandardConfigForListView().columns;
			let tempColumns = angular.copy(columns);
			let showColumns = _.filter(tempColumns, function (c) {
				return [
					'itemno', 'description1',
					'mdcmaterialfk', 'quantity', 'price', 'basuomfk', 'total', 'totalprice','budgettotal'
				].indexOf(c.id) >= 0;
			});
			_.forEach(tempColumns, function (o) {
				o.readonly = true;
				o.editor = null;
				o.navigator = null;
			});
			if (platformGridAPI.grids.exist($scope.selectGridId)) {
				platformGridAPI.grids.unregister($scope.selectGridId);
			}
			if (!platformGridAPI.grids.exist($scope.selectGridId)) {
				let grid = {
					data: [itemSelected],
					columns: angular.copy(showColumns),
					id: $scope.selectGridId,
					options: {
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: false,
						enableColumnSort: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
				platformTranslateService.translateGridConfig(grid.columns);
			}
		}

		function checkAllBudgetTotal(){
			if(itemSelected.BudgetTotal!==0) {
				let gridData = platformGridAPI.items.data($scope.gridId);
				let selectItemList=_.filter(gridData,function(item){ return item.IsChecked;});
				var allBudgetTotal=_.sumBy(selectItemList,'BudgetTotal');
				if(allBudgetTotal<=itemSelected.BudgetTotal){
					_.forEach(selectItemList,function(item){
						removeError(item);
						item.BudgetPercent = item.BudgetTotal/itemSelected.BudgetTotal * 100;
					});
					platformGridAPI.grids.refresh($scope.gridId,true);
				}
			}
		}

		function round(value) {
			return _.isNaN(value) ? 0 : prcCommonCalculationHelper.round(value);
		}

		function validateBudgetTotal(entity,value){
			var validateResult = {
				apply: true,
				valid: true
			};
			if(entity.IsChecked) {
				if(itemSelected.BudgetTotal!==0) {
					let gridData = platformGridAPI.items.data($scope.gridId);
					let otherItemList = _.filter(gridData, function (item) {
						return item.IsChecked && item.Id !== entity.Id;
					});
					var otherBudgetTotal = _.sumBy(otherItemList, 'BudgetTotal');
					var allBudgetTotal = otherBudgetTotal + value;
					if ((allBudgetTotal > itemSelected.BudgetTotal || itemSelected.BudgetTotal > itemSelected.BudgetTotal) && value !== 0) {
						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError');
						platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BudgetTotal');
						entity.BudgetPercent = value / itemSelected.BudgetTotal * 100;
						entity.BudgetTotal = value;
						if(entity.Quantity !== 0) {
							entity.BudgetPerUnit = round(math.bignumber(value).div(entity.Quantity));
						}
					} else {
						entity.BudgetPercent = value / itemSelected.BudgetTotal * 100;
						entity.BudgetTotal = value;
						if(entity.Quantity !== 0) {
							entity.BudgetPerUnit = round(math.bignumber(value).div(entity.Quantity));
						}
						checkAllBudgetTotal();
					}
				}
			}
			return validateResult;
		}

		function loadItemGrid() {
			let columns = procurementCommonItemUIStandardService.getStandardConfigForListView().columns;
			let tempColumns = angular.copy(columns);
			_.forEach(tempColumns, function (o) {
				if(!(o.id==='budgettotal'||o.id==='total')) {
					o.readonly = true;
					o.editor = null;
					o.navigator = null;
				}
				else if(o.id==='total'){
					o.readonly=false;
					o.editor='money';
				}
				else if(o.id==='budgettotal'){
					o.validator=validateBudgetTotal;
				}
			});
			let colDef = {
				id: 'IsChecked',
				field: 'IsChecked',
				name$tr$: 'procurement.requisition.variant.check',
				formatter: 'boolean',
				editor: 'boolean',
				width: 50,
				sortable: true,
				validator:function (entity,value){
					if(value) {
						let gridData = platformGridAPI.items.data($scope.gridId);
						let otherItemList=_.filter(gridData,function(item){ return item.IsChecked&&item.Id!==entity.Id;});
						var otherBudgetTotal=_.sumBy(otherItemList,'BudgetTotal');
						var allBudgetTotal=otherBudgetTotal+entity.BudgetTotal;
						if(itemSelected.BudgetTotal!==0) {
							if (allBudgetTotal > itemSelected.BudgetTotal) {
								var validateResult = {
									apply: true,
									valid: true
								};
								validateResult.apply = false;
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError');
								platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BudgetTotal');
							} else {
								entity.BudgetPercent = (entity.BudgetTotal / itemSelected.BudgetTotal) * 100;
							}
							platformRuntimeDataService.readonly(entity, [{field: 'BudgetTotal', readonly: false}]);
							platformRuntimeDataService.readonly(entity, [{field: 'BudgetPercent', readonly: false}]);
						}
						else{
								entity.BudgetPercent =null;
								platformRuntimeDataService.readonly(entity, [{field: 'Total', readonly: false}]);
								platformRuntimeDataService.readonly(entity, [{field: 'BudgetTotal', readonly: false}]);
								platformRuntimeDataService.readonly(entity, [{field: 'BudgetPercent', readonly: true}]);
						}
					}
					else{
						entity.BudgetPercent=0;
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetTotal', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetPercent', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'Total', readonly: true}]);
						removeError(entity);
						entity.IsChecked=false;
						checkAllBudgetTotal();
					}
				}
			};
			tempColumns.unshift(colDef);
			let budgetPercent={
				id: 'BudgetPercent',
				field: 'BudgetPercent',
				name$tr$: 'procurement.package.wizard.scopeReplacement.BudgetPercent',
				formatter: 'percent',
				editor: 'percent',
				width: 50,
				sortable: true,
				validator:function (entity,value){
					var validateResult = {
						apply: true,
						valid: true
					};
					if(entity.IsChecked) {
						let gridData = platformGridAPI.items.data($scope.gridId);
						let otherItemList=_.filter(gridData,function(item){ return item.IsChecked&&item.Id!==entity.Id;});
						var otherPercent=_.sumBy(otherItemList,'BudgetPercent');
						var allPercent=otherPercent+value;
						if(allPercent>100&&value!==0){
							validateResult.apply = false;
							validateResult.valid = false;
							validateResult.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumPercentError');
							platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BudgetPercent');
							entity.BudgetTotal = (value * itemSelected.BudgetTotal) / 100;
							entity.BudgetPercent=value;
							if(entity.Quantity !== 0) {
								entity.BudgetPerUnit = round(math.bignumber(entity.BudgetTotal).div(entity.Quantity));
							}
						}
						else{
							if(itemSelected.BudgetTotal!==0) {
								entity.BudgetTotal = (value * itemSelected.BudgetTotal) / 100;
								if(entity.Quantity !== 0) {
									entity.BudgetPerUnit = round(math.bignumber(entity.BudgetTotal).div(entity.Quantity));
								}
							}
							else{
								validateResult.apply = false;
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.package.wizard.scopeReplacement.budgetTotalIsZero');
								platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BudgetPercent');
							}
							entity.BudgetPercent=value;
							checkAllBudgetTotal();
						}
					}
					return validateResult;
				}
			};

			tempColumns.push(budgetPercent);
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				let gridConfig = {
					data: [],
					columns: angular.copy(tempColumns),
					id: $scope.gridId,
					gridId: $scope.gridId,
					options: {
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: true,
						enableColumnSort: true,
						enableModuleConfig: true,
						enableConfigSave: true
					},
					lazyInit: true
				};
				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
				if (!$scope.tools) {
					lookupControllerFactory.create({
						grid: true,
						dialog: true,
						search: true
					}, $scope, gridConfig);
				}
				if($scope.tools){
					$scope.tools.items.unshift({
						id: 't4',
						caption: 'procurement.package.wizard.scopeReplacement.budgetSplit',
						type: 'check',
						iconClass: 'control-icons ico-recalculate',
						fn: function () {
							recalculatedReplacementItem();
					  }
					});
				}
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
			}
		}

		function recalculatedReplacementItem(){
			let selectTotal=itemSelected.BudgetTotal;
			let gridData = platformGridAPI.items.data($scope.gridId);
			let checkedItems=_.filter(gridData,function(item){return item.IsChecked;});
			let total=_.sumBy(checkedItems,'Total');
			let checkLen=checkedItems.length;
			_.forEach(checkedItems,function(item){
				if(total>0) {
					item.weight = item.Total / total;
				}
				else{
					item.weight =1/checkLen;
				}
			});
			let lastItem=checkedItems[checkedItems.length-1];
			let notLastItemBudgetTotal=0;
			_.forEach(checkedItems,function(item){
				if(selectTotal!==0) {
					if(lastItem.Id!==item.Id) {
						item.BudgetTotal = parseFloat((item.weight * selectTotal).toFixed(2));
						item.BudgetPercent = (item.BudgetTotal / selectTotal) * 100;
						notLastItemBudgetTotal=notLastItemBudgetTotal+item.BudgetTotal;
					}
					else{
						item.BudgetTotal =selectTotal-notLastItemBudgetTotal;
						item.BudgetPercent = (item.BudgetTotal / selectTotal) * 100;
					}
				}
				else{
					item.BudgetTotal = 0;
					item.BudgetPercent = 0;
				}
				if(item.Quantity !== 0) {
					item.BudgetPerUnit = round(math.bignumber(item.BudgetTotal).div(item.Quantity));
				}
				removeError(item);
			});
			platformGridAPI.grids.refresh($scope.gridId,true);
			checkAllData();
		}

		 function removeError(entity) {
			if (entity.__rt$data && entity.__rt$data.errors) {
				entity.__rt$data.errors = null;
			}
		}

		$scope.disableOk=true;

		function checkAllData(){
			var grid = platformGridAPI.grids.element('id', $scope.gridId);
			var hasError=false;
			if(grid&&grid.dataView) {
				var gridDatas = grid.dataView.getRows();
				if(gridDatas.length>0) {
					var hasErrorItem = _.find(gridDatas, function (item) {
						return item.__rt$data && item.__rt$data.errors&&(item.__rt$data.errors.BudgetPercent&&item.__rt$data.errors.BudgetPercent.error||item.__rt$data.errors.BudgetTotal&&item.__rt$data.errors.BudgetTotal.error);
					});
					if (hasErrorItem) {
						hasError = true;
					}
				}
			}
			if(hasError) {
				$scope.disableOk = !!hasError;
			}
			else{
				let dataList = platformGridAPI.items.data($scope.gridId);
				let gridData=angular.copy(dataList);
				let gridList = _.map(gridData, function (item) {
					return {id: item.Id, isChecked: item.IsChecked};
				});

				let gridMap=_.keyBy(gridList, 'id');
				let differentItem=[];
				_.forEach(tempData,function(item){
					let id=item.id;
					let _item=gridMap[id];
					if (_item &&(_item.isChecked !== item.isChecked||_item.BudgetTotal !== item.BudgetTotal)) {
						differentItem.push(item);
					}
				});
				let hasChange=differentItem.length>0;
				$scope.disableOk=!hasChange;
			}
		}


		function onCellModified(e, arg) {
			var col = arg.grid.getColumns()[arg.cell].field;
			if(col === 'IsChecked'&&tempData.length>0){
				let dataList=arg.grid.getData().getItems();
				let gridData=angular.copy(dataList);
			   let unCheckList=_.filter(gridData,function(item){return !item.IsChecked;});
			   if(unCheckList.length>0&&unCheckList.length===gridData.length) {
				   $scope.cantEditDisableTargetItem = true;
			   }
			   else{
				   $scope.cantEditDisableTargetItem = false;
			   }
			}
			checkAllData();
		}


		$scope.okClicked = function () {
			platformGridAPI.grids.commitAllEdits();
			let grid = platformGridAPI.grids.element('id', $scope.gridId);
			let gridDatas = grid.dataView.getRows();
			let ItemReplacementList = [];
			_.forEach(gridDatas, function (item) {
				ItemReplacementList.push({IsChecked:item.IsChecked,PrcItemId:item.Id,BudgetTotal:item.BudgetTotal,Total:item.Total});
			});
			let disableTargetItem = $scope.disableTargetItem;
			let packageId=procurementPackageDataService.getSelected().Id;
			let params = {
				PackageId:packageId,
				DisableTargetItem: disableTargetItem,
				BasePrcItemId: itemSelected.Id,
				ItemReplacementList:ItemReplacementList
			};
			$http.post(globals.webApiBaseUrl + 'procurement/package/wizard/createItemScopeReplacement', params).then(function () {
				$scope.$parent.$close(true);
				procurementPackageItemAssignmentDataService.load();
				procurementCommonPrcItemDataService.getService().load();
				procurementCommonTotalDataService.getService(procurementPackageDataService).load();
			});
		};

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
			platformGridAPI.grids.unregister($scope.gridId);
			platformGridAPI.grids.unregister($scope.selectGridId);
		});
	}

})(angular);