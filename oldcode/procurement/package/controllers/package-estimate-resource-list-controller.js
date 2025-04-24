/**
 * Created by zos on 9/9/2015.
 */
(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.package';

	/**
	 * @ngdoc controller
	 * @name estimateMainResourceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Currency Conversion entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageEstimateResourceListController',
		['$scope', 'platformGridAPI', 'platformGridControllerService', 'estimateDefaultGridConfig', 'procurementPackageEstimateResourceDataService',
			'packageEstimateResourceUIStandardService', 'procurementPackageDataService',
			function ($scope, platformGridAPI, platformGridControllerService, estimateDefaultGridConfig, dataService,
				uiStandardService, packageDataService) {

				var gridConfig = angular.extend({
					parentProp: 'EstResourceFk',
					childProp: 'EstResources',
					childSort: true
				}, estimateDefaultGridConfig);

				// set the all column readonly except packagefk
				angular.forEach(uiStandardService.getStandardConfigForListView().columns, function (entity) {
					if (entity.field !== 'PrcPackageFk') {
						entity.editor = null;
						entity.readonly = true;
					}
				});

				function setReadOnlyGrid(data) {
					if ($scope.gridId) {
						if (platformGridAPI.grids.exist($scope.gridId)) {

							var cols = platformGridAPI.columns.configuration($scope.gridId);
							if (cols.current) {
								angular.forEach(cols.current, function (col) {
									if (col && col.editor) {
										col.editor = null;
									}
								});
							}
							platformGridAPI.columns.configuration($scope.gridId, angular.copy(cols.current));

							if (cols.current.length > 0 && data) {
								dataService.fireListLoaded();
								// platformGridAPI.items.data($scope.gridId, data);
							}
						}
					}
				}

				$scope.onRenderCompleted = function () {
					var gridData = dataService.getTree();
					if (gridData.length === 0) {
						return;
					}
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					if (grid && grid.instance) {
						angular.forEach(gridData, function (item) {
							chickChild(item, addCssToRow);
						});
					}

					function chickChild(item, runFun) {
						runFun(item);
						angular.forEach(item.ChildItems, function (child) {
							chickChild(child, runFun);
						});
					}

					function addCssToRow(item) {
						var row = grid.dataView.getRowById(item.Id);
						var elementL = grid.instance.getCellNode(row, 0);
						var elementR = grid.instance.getCellNode(row, 2);
						if (item.HasChildren) {
							if (elementL) {
								elementL.parent().removeClass('even').addClass('odd');
							}
							if (elementR) {
								elementR.parent().removeClass('even').addClass('odd');
							}
						}
						if (item.PrcPackageFk !== packageDataService.getSelected().Id) {
							if (elementL) {
								elementL.parent().removeClass('odd').addClass('even');
							}
							if (elementR) {
								elementR.parent().removeClass('odd').addClass('even');
							}
						}
					}
				};

				platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

				dataService.onReadOnlyGrid.register(setReadOnlyGrid);
				platformGridAPI.events.register($scope.gridId, 'onRowsChanged', $scope.onRenderCompleted);
				platformGridAPI.events.register($scope.gridId, 'onScroll', $scope.onRenderCompleted);
				dataService.registerListLoaded($scope.onRenderCompleted);
				$scope.$on('$destroy', function () {
					dataService.onReadOnlyGrid.unregister(setReadOnlyGrid);
					dataService.unregisterListLoaded($scope.onRenderCompleted);
					platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', $scope.onRenderCompleted);
					platformGridAPI.events.unregister($scope.gridId, 'onScroll', $scope.onRenderCompleted);
				});
			}
		]);
})();