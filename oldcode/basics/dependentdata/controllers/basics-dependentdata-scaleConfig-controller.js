(function (angular) {
	'use strict';
	var moduleName = 'basics.dependentdata';
	var angModule = angular.module(moduleName);
	angModule.controller('basicsDependentScaleConfigController',
		['$scope','platformGridAPI','platformTranslateService',function ($scope,platformGridAPI,platformTranslateService) {
			$scope.inputOpen=true;
			$scope.positionOptions= {
				displayMember: 'description',
				valueMember: 'id',
				items: [{id: 'top', description: 'Top'}, {id: 'left', description: 'Left'}, {
					id: 'right',
					description: 'Right'
				}, {id: 'bottom', description: 'Bottom'}]
			};

			$scope.unitOptions={
				displayMember: 'description',
				valueMember: 'id',
				items: [{id: 'millisecond', description: 'Millisecond'}, {id: 'second', description: 'Second'},
					{id: 'minute',description: 'Minute'}, {id: 'hour', description: 'Hour'}, {id: 'day', description: 'Day'},
					{id: 'week', description: 'Week'}, {id: 'month', description: 'Month'}, {id: 'quarter', description: 'Quarter'}, {id: 'year', description: 'Year'}
				]
			};

			$scope.formatOptions={
				displayMember: 'description',
				valueMember: 'id',
				items: [{id: 'MM/DD/YYY HH:mm', description: 'MM/DD/YYY HH:mm'}, {id: 'MM/DD/YYY', description: 'MM/DD/YYY'},
					{id: 'DD-MM-YYY HH:mm',description: 'DD-MM-YYY HH:mm'}, {id: 'DD-MM-YYY', description: 'DD-MM-YYY'}
				]
			};

			$scope.scaleYOptions= {
				displayMember: 'Description',
				valueMember: 'Id',
				items:[{Id: 'linear', Description: 'Numeric Linear'}]
			};
			var categorys=$scope.modalOptions.dataItem.scale.x.categorys;
			var gridData=categorys?categorys:[];
			if('category'===$scope.modalOptions.dataItem.scale.x.type){
				createGrid();
			}

			$scope.scaleTypeChanged=function(type){
				if('category'===type) {
					createGrid();
				}
			};

			$scope.clearLinearXValue=function(p1){
				var obj=$scope.modalOptions.dataItem.scale.x.linear;
				obj[p1]=null;
				this.scaleStepChange(obj);
			};
			$scope.clearTimeXValue=function(p1){
				var obj=$scope.modalOptions.dataItem.scale.x.time;
				obj[p1]=null;
				this.scaleStepChange(obj);
			};

			$scope.clearLinearYValue=function(p1){
				var obj=$scope.modalOptions.dataItem.scale.y.linear;
				if(obj[p1]) {
					obj[p1] = null;
					this.scaleStepChange(obj);
				}
			};


			$scope.scaleStepChange=function(modelOption){
				if(modelOption.step&&''!==modelOption.step) {
					if (modelOption.step <= 0) {
						return;
					}
					modelOption.tickCount = parseInt((modelOption.max - modelOption.min) / modelOption.step) + 1;
				}
				else{
					modelOption.tickCount =null;
				}
			};

			$scope.scaleTickChange=function(modelOption){
				if(modelOption.tickCount&&''!==modelOption.tickCount) {
					if (modelOption.tickCount <= 1) {
						return;
					}
					modelOption.step = (modelOption.max - modelOption.min) / (modelOption.tickCount - 1);
				}
				else{
					modelOption.step=null;
				}
			};
			$scope.scaleMinMaxChange=function(modelOption){
				if(modelOption.max&&modelOption.min) {
					if (modelOption.min > modelOption.max) {
						return;
					}
					this.scaleStepChange(modelOption);
				}
				else{
					modelOption.tickCount =null;
				}
			};

			$scope.modalOptions.dataItem.scale.x.categorys=gridData;

			$scope.createItem = function () {
				platformGridAPI.grids.commitEdit($scope.gridId);
				var Id=gridData.length + 1;
				gridData.push({
					Id: Id,
					color:3355443,
					category:'Category '+Id
				});
				platformGridAPI.items.data($scope.gridId,gridData);
			};

			$scope.deleteItem = function () {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId,	wantsArray: true});
				if (selectedItems) {
					angular.forEach(selectedItems,function (item){
						var index=_.findIndex(gridData, function(o) { return o.Id === item.Id; });
						gridData.splice(index, 1);
					});
					platformGridAPI.items.data($scope.gridId,gridData);
				}
			};


			function createGrid() {
				var _gridId = '1cf32e710ad84d299c55ca404083b721';
				$scope.gridId = _gridId;
				$scope.gridData = {
					state: $scope.gridId
				};
				//platformGridAPI.items.data( $scope.gridId, data);
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridCols = [{
						actionList: [],
						domain:function(){return 'description';},
						//editor:'dynamic',
						field: 'category',
						formatter: 'dynamic',
						id: 'category',
						name: 'category',
						name$tr$: 'basics.dependentdata.category',
						navigator: false,
						readonly: true,
						searchable: false
					}, {
						actionList: [],
						domain:function(){return 'color';},
						editor:'dynamic',
						formatter: 'dynamic',
						field: 'color',
						id: 'color',
						name: 'color',
						name$tr$: 'basics.dependentdata.color',
						navigator: false, //type: 'color',
						searchable: false
					}];
					var grid = {
						data: [],
						columns: angular.copy(gridCols),
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: true,
							skipPermissionCheck: true,
							enableDraggableGroupBy: true
						},
						enableConfigSave: true
					};
					platformGridAPI.grids.config(grid);
					platformTranslateService.translateGridConfig(grid.columns);
					platformGridAPI.items.data($scope.gridId, gridData);
				}
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: $scope.createItem,
						disabled: false
					},
					{
						id: 't2',
						sort: 10,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: $scope.deleteItem,
						disabled: function() {
							return false;
						}
					}
				]
			};

			$scope.$on('$destroy', function () {
				if ($scope.gridId&&platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
		]);
})(angular);
