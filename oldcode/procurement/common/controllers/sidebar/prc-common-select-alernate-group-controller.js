(function(angular){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonSelectAlernateGroupController',procurementCommonSelectAlernateGroupController);

	procurementCommonSelectAlernateGroupController.$inject = ['$scope','_','$translate','platformRuntimeDataService','procurementCommonSelectAlternateGroupService','platformGridAPI','platformTranslateService'];
	function procurementCommonSelectAlernateGroupController($scope,_,$translate,platformRuntimeDataService,procurementCommonSelectAlternateGroupService,platformGridAPI,platformTranslateService){
		$scope.gridId='C10DDE19ED424A19AF345ABCD5785611';
		var _params = $scope.$parent.modalOptions.params;
		$scope.prcItemGridData = {
			state: $scope.gridId
		};
		loadGrid();
		$scope.canStart=true;
		function loadGrid() {
			var columns = [{
				id: 'Selected',
				field: 'Selected',
				editor: 'boolean',
				formatter: 'boolean',
				name$tr$: 'procurement.common.selected',
			}, {
				id: 'ItemType',
				field: 'BasItemTypeFk',
				name$tr$: 'procurement.common.prcItemType',
				readonly: true,
				formatter: 'lookup',
				formatterOptions: {
					'lookupType': 'PrcItemType',
					'displayMember': 'DescriptionInfo.Translated'
				}
			}, {
				id: 'ItemType2',
				field: 'BasItemType2Fk',
				name$tr$: 'procurement.common.prcItemType2',
				validator:validationBasItemType2Fk,
				editor: 'lookup',
				editorOptions: {
					'directive': 'procurement-common-item-type2-combobox'
				},
				formatter: 'lookup',
				formatterOptions: {
					'lookupType': 'PrcItemType2',
					'displayMember': 'DescriptionInfo.Translated'
				}
			}, {
				id: 'Agn',
				field: 'AGN',
				name: 'Description',
				name$tr$: 'procurement.common.AGN',
				width: 120,
				readonly: true,
				sortable: true
			}, {
				id: 'AAN',
				field: 'AAN',
				name: 'Description',
				name$tr$: 'procurement.common.AAN',
				width: 120,
				readonly: true,
				sortable: true
			}, {
				id: 'ItemNumber',
				field: 'Itemno',
				name: 'Description',
				name$tr$: 'procurement.common.prcItemItemNo',
				width: 120,
				readonly: true,
				sortable: true
			}, {
				id: 'MdcMaterialFk',
				field: 'MdcMaterialFk',
				name$tr$: 'procurement.common.prcItemMaterialNo',
				readonly: true,
				formatter: 'lookup',
				formatterOptions: {
					'lookupType': 'MaterialCommodity',
					'displayMember': 'Code'
				}
			}, {
				id: 'Description1',
				field: 'Description1',
				name: 'Description1',
				name$tr$: 'procurement.common.prcItemDescription1',
				width: 120,
				readonly: true,
				sortable: true
			}];
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
			var readonlyFields = [
				{field: 'BasItemType2Fk', readonly: true},
				{field: 'Selected', readonly: true}
			];
			var prcItems=_params.prcItems;
			prcItems=_.filter(prcItems,function(item){return item.AGN!==null;});
			_.forEach(prcItems,function(item){
				if(item.BasItemType2Fk===2||item.BasItemType2Fk===7){
					item.Selected=true;
				}
				else {
					item.Selected = false;
				}
				item.sort = (1000 * item.AGN) + item.AAN || 0;
			});

			var _prcItems=_.sortBy(prcItems,'sort');
			var maxItem=_.maxBy(_prcItems,'Id');
			var maxId = maxItem?maxItem.Id+1:0;
			var prcItemGroup=[];
			var agn = -1;
			var aan = -1;
			var baseItem,groupItem;
			_.forEach(_prcItems,function(item){
				if (item.AGN !== agn) {
					maxId++;
					agn =item.AGN;
					baseItem={Id: maxId, AGN:agn,Items:[]};
					baseItem._isDummyNode = true;
					platformRuntimeDataService.readonly(baseItem, readonlyFields);
					prcItemGroup.push(baseItem);
				}
				if (item.AAN !== aan) {
					maxId++;
					aan = item.AAN;
					groupItem={Id: maxId, AGN:item.AGN,AAN:item.AAN,Items:[],ParentId:baseItem.Id};
					groupItem._isDummyNode = true;
					platformRuntimeDataService.readonly(groupItem, readonlyFields);
					baseItem.Items.push(groupItem);
				}
				var clone = _.clone(item);
				clone.ParentId = groupItem.Id;
				clone.Items=null;
				groupItem.Items.push(clone);
			});
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: prcItemGroup,
					columns: angular.copy(columns),
					id: $scope.gridId,
					options: {
						tree: true,
						parentId: 'ParentId',
						childProp: 'Items',
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
				platformTranslateService.translateGridConfig(grid.columns);
			}
		}

		function validationBasItemType2Fk(entity, value/* , model */){
			var validateResult = {
				apply: true,
				valid: true
			};
			var dataListGroup= platformGridAPI.items.data($scope.gridId);
			var dataList=[];
			_.forEach(dataListGroup,function(item){
				_.forEach(item.Items,function(_item){
					_.forEach(_item.Items,function(_item2) {
						dataList.push(_item2);
					});
				});
			});
			if (value === 1) {
				let sameAGNAlternativeWizardDataList = _.filter(dataList, function (item) {
					return item.AGN === entity.AGN && (item.Id !== entity.Id) && (item.BasItemType2Fk === 7 || item.BasItemType2Fk === 5);
				});
				if (sameAGNAlternativeWizardDataList.length > 0 && (entity.BasItemType2Fk === 3 || entity.BasItemType2Fk === 2)) {
					validateResult = {
						apply: false,
						valid: false,
						error: $translate.instant('procurement.common.prcBaseToNormalErrorMessage')
					};
				}
				else{
					var oldEntity=angular.copy(entity);
					var sameAgnAnnItems = _.filter(dataList, function (item) {
						return item.AGN === entity.AGN && item.AAN === entity.AAN;
					});
					_.forEach(sameAgnAnnItems, function (item) {
						item.PrcItemAltFk = null;
						item.AAN = null;
						item.AGN = null;
						item.BasItemType2Fk=value;
						item.Selected=false;
					});
					if(oldEntity.BasItemType2Fk===7){
						let sameAGNBaseponstponedDataList = _.filter(dataList, function (item) {
							return item.AGN === oldEntity.AGN && (item.Id !== entity.Id) && (item.BasItemType2Fk === 3);
						});
						if (sameAGNBaseponstponedDataList.length > 0) {
							_.forEach(sameAGNBaseponstponedDataList, function (item) {
								item.BasItemType2Fk = 2;
								item.Selected=true;
							});
						}
					}
				}
			}
			else if(value === 2){
				entity.Selected=true;
				if((_.isNull(entity.AGN)||''===entity.AGN)&&value === 2){
					let hasAGN = _.filter(dataList, function (item) {
						return !_.isNull(item.AGN)&& (entity.Id !== item.Id);
					});
					if (hasAGN.length === 0) {
						entity.AGN = 100;
					} else {
						entity.AGN = _.maxBy(dataList, function (o) {
							return o.AGN;
						}).AGN + 1;
					}
				}
				else{
					if(entity.BasItemType2Fk===5||entity.BasItemType2Fk===7) {
						var oldEntity = angular.copy(entity);
						var sameAgnAnnItems = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && item.AAN === entity.AAN;
						});
						var sameAgnAnnItemIds=_.map(sameAgnAnnItems, 'Id');
						let sameAGNDataList = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && (item.Id !== entity.Id)&&!_.includes(sameAgnAnnItemIds,item.Id);
						});
						_.forEach(sameAgnAnnItems, function (item) {
							item.BasItemType2Fk = value;
							item.AAN = 0;
							item.Selected=true;
						});
						if (sameAGNDataList.length > 0 && (oldEntity.BasItemType2Fk === 7||oldEntity.BasItemType2Fk ===5)) {
							_.forEach(sameAGNDataList, function (item) {
								if(item.BasItemType2Fk===2||item.BasItemType2Fk===3){
									item.AAN = oldEntity.AAN;
								}
								item.BasItemType2Fk = 5;
								item.Selected=false;
							});
						}
					}else if(entity.BasItemType2Fk===3){
						let sameAGNAlternativeWizardDataList = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN&&(item.Id !==entity.Id) && (item.BasItemType2Fk === 7);
						});
						var sameAgnAnnItems = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && item.AAN === entity.AAN;
						});
						_.forEach(sameAgnAnnItems,function(item){
							item.BasItemType2Fk=value;
							item.Selected=true;
						});
						if(sameAGNAlternativeWizardDataList.length>0){
							_.forEach(sameAGNAlternativeWizardDataList,function(item){
								item.BasItemType2Fk=5;
								item.Selected=false;
							});
						}
					}
					else{
						entity.PrcItemAltFk = angular.copy(entity.Id);
					}
				}
			} else if(value===3){
				validateResult = {
					apply: false,
					valid: false,
					error: $translate.instant('procurement.common.prcCantSelectBasePostponedMessage')
				};
			}
			else if(value === 5||value === 7) {
				var filterBaseDataList = _.filter(dataList, function (item) {
					return (item.Id !==entity.Id) && (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3);
				});
				if(filterBaseDataList.length>0) {
					if(entity.BasItemType2Fk===2||entity.BasItemType2Fk===3){
						var sameAgnAnnItems = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && item.AAN === entity.AAN && (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3);
						});
						var sameAgnAnnItemIds=_.map(sameAgnAnnItems, 'Id');
						if(sameAgnAnnItemIds.length>1) {
							filterBaseDataList = _.filter(filterBaseDataList, function (item) {
								return !_.includes(sameAgnAnnItemIds,item.Id);
							});
						}
					}
				}
				if (filterBaseDataList.length > 0) {
					if (_.isNull(entity.AGN) || '' === entity.AGN) {
						let maxBasObj = _.maxBy(filterBaseDataList, function (item) {
							return item.Id;
						});
						if (maxBasObj) {
							entity.AGN = maxBasObj.AGN;
							var showAltByBase=_.find(filterBaseDataList,function(item){
								return item.AGN===maxBasObj.AGN&&maxBasObj.AAN===maxBasObj.AAN;
							});
							if(showAltByBase){
								entity.PrcItemAltFk =showAltByBase.PrcItemAltFk;
							}
							else{
								entity.PrcItemAltFk =maxBasObj.PrcItemAltFk;
							}
						}
					}
					if (!_.isNull(entity.AGN)) {
						let sameAGNBaseDataList = _.filter(filterBaseDataList, function (item) {
							return item.AGN === entity.AGN;
						});
						if (sameAGNBaseDataList.length > 0) {
							let sameAGNs = _.filter(dataList, function (item) {
								return (entity.AGN === item.AGN) && (entity.Id !== item.Id);
							});
							if(sameAGNs.length > 0) {
								if (_.isNull(entity.AAN) || '' === entity.AAN) {
									entity.AAN = _.maxBy(sameAGNs, function (o) {
										return o.AAN;
									}).AAN + 1;
								}
								if (value === 5)
								{
									const samegroups = _.filter(sameAGNs, function (item) {
										return item.AAN===entity.AAN;
									});
									_.forEach(samegroups,function(item){
										item.BasItemType2Fk=value;
										if(value === 5){
											item.Selected=false;
										}
										else if(value === 7){
											item.Selected=true;
										}
									});
									const hasAlternativeWardItem = _.find(dataList, function (item) {
										return item.AGN === entity.AGN && (item.BasItemType2Fk === 7)&&(entity.Id !== item.Id);
									});
									_.forEach(sameAGNBaseDataList,function(item){
										if (item.BasItemType2Fk === 3&&!hasAlternativeWardItem) {
											item.BasItemType2Fk = 2;
											item.Selected=true;
										}
									});
								}
								else if (value === 7) {
									const groups = _.groupBy(sameAGNs, function (item) {
										return [item.AGN, item.AAN].join(',');
									});
									_.each(groups, function (groupItems, index) {
										_.forEach(groupItems, function (item) {
											if (item.BasItemType2Fk === 2) {
												item.BasItemType2Fk = 3;
												item.Selected=false;
											}
											else if (item.BasItemType2Fk === 5 && item.AAN === entity.AAN && item.Id !== entity.Id) {
												item.BasItemType2Fk = 7;
												item.Selected=true;
											}
											else if(item.BasItemType2Fk === 7){
												item.BasItemType2Fk = 5;
												item.Selected=false;
											}
										});
									});
								}
							}
						}
						else{
							validateResult = {
								apply: false,
								valid: false,
								error: $translate.instant('procurement.common.prcNoBaseError')
							};
						}
					}
				} else {
					validateResult = {
						apply: false,
						valid: false,
						error: $translate.instant('procurement.common.prcNoBaseError')
					};
				}
			}
			if(validateResult.valid){
				entity.BasItemType2Fk=value;
			}
			if (value === 3 || value === 5) {
				entity.TotalNoDiscount = 0;
				entity.TotalCurrencyNoDiscount = 0;
				entity.Total = 0;
				entity.TotalOc = 0;
				entity.TotalGross = 0;
				entity.TotalGrossOc = 0;
			}
			return validateResult;
		}


		function onCellModified(e, arg) {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
			if (selected) {
				var col = arg.grid.getColumns()[arg.cell].field;
				if (col === 'BasItemType2Fk') {
					if(selected.BasItemType2Fk === 3||selected.BasItemType2Fk  === 5){
						selected.Selected=false;
					}
					else if(selected.BasItemType2Fk === 7||selected.BasItemType2Fk === 2){
						selected.Selected=true;
					}
				}
				else if (col === 'Selected') {
					if(selected.Selected) {
						if (selected.BasItemType2Fk === 3 || selected.BasItemType2Fk === 5) {
							if (selected.BasItemType2Fk === 3) {
								validationBasItemType2Fk(selected,2);
							} else if (selected.BasItemType2Fk === 5) {
								validationBasItemType2Fk(selected,7);
							}
						}
					}
					else{
						if(selected.BasItemType2Fk ===7){
							validationBasItemType2Fk(selected,5);
						}
					}
				}
				updateGrid();
				checkAllData();
			}
		}

		function updateGrid(){
			platformGridAPI.grids.refresh($scope.gridId, true);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);


		function checkAllData() {
			var grid = platformGridAPI.grids.element('id', $scope.gridId);
			var hasError=false;
			if(grid&&grid.dataView) {
				var gridDatas = grid.dataView.getRows();
				if(gridDatas.length>0) {
					var hasErrorItem = _.find(gridDatas, function (item) {
						return item.__rt$data && item.__rt$data.errors&& item.__rt$data.errors.BasItemType2Fk&&item.__rt$data.errors.BasItemType2Fk.error;
					});
					if (hasErrorItem) {
						hasError = true;
					}
				}
			}
			$scope.canStart=!hasError;
		}
		$scope.okClicked=function(){
			platformGridAPI.grids.commitAllEdits();
			var grid = platformGridAPI.grids.element('id', $scope.gridId);
			var gridDatas = grid.dataView.getRows();
         var gridItemDatas=_.filter(gridDatas,function(item){ return !item._isDummyNode;});
			procurementCommonSelectAlternateGroupService.saveChangedItems(gridItemDatas).then(function () {
				_params.prcItemService.load();
				$scope.$parent.$close(true);
			}
			);
		};

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
			platformGridAPI.grids.unregister($scope.gridId);

		});
	}

})(angular);