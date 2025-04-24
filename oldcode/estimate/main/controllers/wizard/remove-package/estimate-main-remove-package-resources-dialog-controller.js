/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainRemovePackageResourcesDetailController
	 * @function
	 *
	 * @description
	 * Controller for Resources Package Removal
	 **/
	angular.module(moduleName).controller('estimateMainRemovePackageResourcesDialogController',
		['$scope',
			'$timeout',
			'$injector',
			'platformGridAPI',
			'platformCreateUuid',
			'estimateMainRemovePackageResourcesDialogService',
			'estimateMainRemovePackageResourcesConfigDialogService',
			'platformGridControllerService',
			'basicsCommonHeaderColumnCheckboxControllerService',

			function ($scope,
				$timeout,
				$injector,
				platformGridAPI,
				platformCreateUuid,
				dataDialogService,
				configDialogService,
				platformGridControllerService,
				basicsCommonHeaderColumnCheckboxControllerService
			) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck : true,
					cellChangeCallBack: function (arg) {
						return $scope.isCheckedValueChange(arg.item, arg.item.IsChecked);
					}
				};

				$scope.gridId = platformCreateUuid();

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.setTools = function () {};

				$scope.onContentResized = function () {
					resizeGrid();
				};

				function resizeGrid() {
					$timeout(function(){
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					platformGridControllerService.initListController($scope, configDialogService, dataDialogService, null, myGridConfig);

					basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
					basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataDialogService, ['IsChecked']);
				}

				$scope.isCheckedValueChange = function isCheckedValueChange(){
					return {apply: true, valid: true, error: ''};
				};

				function onHeaderCheckboxChange(e) {
					return $scope.isCheckedValueChange(null, e.target.checked);
				}

				dataDialogService.onResizeGrid.register(resizeGrid);

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					dataDialogService.onResizeGrid.unregister(resizeGrid);
					dataDialogService.setDataList(null);
				});

				init();
			}
		]);
})();
