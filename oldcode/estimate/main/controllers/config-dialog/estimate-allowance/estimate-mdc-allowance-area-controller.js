
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMdcAllowanceAreaController', ['_','$scope','platformCreateUuid','platformGridAPI','$timeout','platformGridControllerService','estimateMdcAllowanceAreaService','estimateMdcAllowanceAreaUIService',
		function (_,$scope,platformCreateUuid,platformGridAPI,$timeout,platformGridControllerService,dataServices,estimateAllowanceAreaUIService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				ContainerType : 'Grid',
				parentProp: 'AreaParentFk',
				childProp: 'Areas',
				childSort: true,
				enableDraggableGroupBy: false,
				skipPermissionCheck : true,
				skipToolbarCreation :true,
				cellChangeCallBack: function cellChangeCallBack(arg) {
					let column = arg.grid.getColumns()[arg.cell];
					let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
					dataServices.fieldChange(arg.item,column,field);
				}
			};

			$scope.gridId = platformCreateUuid();
			dataServices.setGridId($scope.gridId);

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, estimateAllowanceAreaUIService, dataServices, null, myGridConfig);

				$timeout(function () {
					dataServices.load();
				});
			}

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};
			init();
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
					},
					{
						id: 'add',
						sort: 2,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						disabled: function () {
							if( !(dataServices.getList() && dataServices.getList().length)) {
								return true;
							}
							let selItem = dataServices.getSelected();
							if(!selItem){
								return true;
							}
							return selItem.Id === -2;
						},
						fn: function onClick() {
							dataServices.addItem();
						}
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						disabled: function () {
							if( !(dataServices.getList() && dataServices.getList().length)) {
								return true;
							}
							let selItem = dataServices.getSelectedEntities();
							if(!selItem.length){
								return true;
							}
							if(selItem.length === 1){
								let areayType = selItem[0].AreaType;
								return selItem[0].Id < 0 || (areayType === 2 || areayType === 4) ? true : !selItem.length;
							}
							let data = _.filter(selItem,function (item) {
								return item.Id < 0 || item.AreaType === 2 || item.AreaType === 4;
							});
							if(data.length){
								return true;
							}
						},
						fn: function onDelete() {
							dataServices.deleteEntities();
						}
					}
				],
				update: function () {
				}
			};
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
	]);
})();
