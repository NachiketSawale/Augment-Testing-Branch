/**
 * Created by lav on 7/17/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).controller('ppsDrawingPreviewDialogController',
		[
			'$scope',
			'ppsDrawingPreviewUIService',
			'platformGridAPI',
			'$http',
			'ppsDrawingPreviewImageProcessor',
			'$interval',
			'ppsDrawingPreviewDialogService',
			'basicsCommonToolbarExtensionService',
			function ($scope,
					  ppsDrawingPreviewUIService,
					  platformGridAPI,
					  $http,
					  ppsDrawingPreviewImageProcessor,
					  $interval,
					  ppsDrawingPreviewDialogService,
					  basicsCommonToolbarExtensionService) {

				var gridConfig = ppsDrawingPreviewUIService.getPreviewListView();
				var parameters = $scope.modalOptions.parameters;
				if (parameters) {
					gridConfig.state = parameters.gridId || gridConfig.state;
					if (parameters.dynamicColumns) {
						var index = _.findIndex(gridConfig.columns, ['id', 'isMatch']);
						parameters.dynamicColumns.unshift(index, 0);
						Array.prototype.splice.apply(gridConfig.columns, parameters.dynamicColumns);
					}
				}
				$scope.gridId = gridConfig.state;
				var previewGrid = {
					id: gridConfig.state,
					columns: gridConfig.columns,
					lazyInit: true,
					options: {
						enableModuleConfig: true,
						enableConfigSave: true,
						indicator: true,
						editable: true,
						idProperty: 'Id',
						tree: true,
						collapsed: true,
						//parentProp: 'LocationParentFk',
						childProp: 'ChildItems',
						//allowRowDrag: true,
						hierarchyEnabled: true,
						skipPermissionCheck: true,
						selectionModel: new Slick.RowSelectionModel(),
						saveSearch: false
					},
					state: gridConfig.state
				};
				platformGridAPI.grids.config(previewGrid);

				$scope.gridOptions = {previewGrid: previewGrid};

				ppsDrawingPreviewDialogService.initializeController($scope);

				$scope.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't5',
							sort: 60,
							caption: 'productionplanning.drawing.previousConflict',
							type: 'item',
							iconClass: 'control-icons ico-evaluation-max',
							fn: function () {
								if (!ppsDrawingPreviewDialogService.previousConflict()) {
									ppsDrawingPreviewDialogService.nextConflict();
								}
							}
						},
						{
							id: 't6',
							sort: 60,
							caption: 'productionplanning.drawing.nextConflict',
							type: 'item',
							iconClass: 'control-icons ico-evaluation-min',
							fn: function () {
								ppsDrawingPreviewDialogService.nextConflict();
							}
						},
						{
							id: 'd1',
							sort: 55,
							type: 'divider'
						},
						{
							id: 't7',
							sort: 60,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								if (gridConfig.collapseSelected) {
									gridConfig.collapseSelected();
								} else {
									platformGridAPI.rows.collapseNextNode(previewGrid.id);
								}
							}
						},
						{
							id: 't8',
							sort: 70,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								if (gridConfig.expandSelected) {
									gridConfig.expandSelected();
								} else {
									platformGridAPI.rows.expandNextNode(previewGrid.id);
								}
							}
						},
						{
							id: 't9',
							sort: 80,
							caption: 'cloud.common.toolbarCollapseAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function collapseAll() {
								if (gridConfig.collapseAll) {
									gridConfig.collapseAll();
								} else {
									platformGridAPI.rows.collapseAllSubNodes(previewGrid.id);
								}
							}
						},
						{
							id: 't10',
							sort: 90,
							caption: 'cloud.common.toolbarExpandAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function expandAll() {
								if (gridConfig.expandAll) {
									gridConfig.expandAll();
								} else {
									platformGridAPI.rows.expandAllSubNodes(previewGrid.id);
								}
							}
						}, {
							id: 'd0',
							sort: 54,
							type: 'divider'
						}
					]
				};

				basicsCommonToolbarExtensionService.addBtn($scope, null, null, 'G');

				$scope.onRefresh();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					ppsDrawingPreviewDialogService.successCallback();
				});
			}]);
})(angular);