/**
 * Created by xia on 3/5/2018.
 */

(function () {
	'use strict';
	/* global Slick, _ */

	var moduleName = 'boq.main';

	/**
     @ngdoc controller
	 * @name estimateMainTotalsConfigDetailFilterController
	 * @function
	 *
	 * @description
	 * Controller for the Totals configuration details filter popup.
	 */
	angular.module(moduleName).controller('boqDivisionTypeAssignmentController', [
		'$scope', 'platformGridAPI', '$popupInstance', '$injector', 'boqDivisionTypeAssignmentUpdateService',
		function ($scope, platformGridAPI, $popupInstance, $injector, boqDivisionTypeAssignmentUpdateService) {

			$scope.gridId = 'de0c65b5f0574305bdab01d429ef9982';
			$scope.grid = {
				state: $scope.gridId
			};

			var gridConfig = {
				data: [],
				columns: angular.copy($scope.settings.columns),
				id: $scope.gridId,
				lazyInit: false,
				isStaticGrid: true,
				options: {
					indicator: true,
					editorLock: new Slick.EditorLock(),
					multiSelect: false,
					skipPermissionCheck: true
				}
			};

			platformGridAPI.grids.config(gridConfig);

			$scope.options.dataView.dataProvider.getList($scope.settings, $scope.$parent).then(function (data) {
				var processedData = $scope.settings.dataProcessor.execute(data, $scope.options);
				platformGridAPI.items.data($scope.gridId, processedData);
			});

			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
			};

			$scope.refreshData = function refreshData(processedData) {
				platformGridAPI.items.data($scope.gridId, processedData);
			};

			function onPopupResizeStop() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.resize($scope.gridId);
				}
			}

			function processItem(item) {
				$scope.entity.Modified = true;
				var options = $scope.$eval('options');
				if (!options) {
					return;
				}

				var identification = options.field;
				if (!$scope.entity[identification]) {
					$scope.entity[identification] = [];
				}
				if (item.Filter) {
					if (_.findIndex($scope.entity[identification], {BoqDivisionTypeFk: item.Id}) === -1) {
						if (!_.isArray($scope.entity[identification])) {
							$scope.entity[identification] = [];
						}
						$scope.entity[identification].push({
							'Id': item.Id + $scope.entity.Id,
							'BoqHeaderFk': $scope.entity.Id,
							'BoqItemFk': $scope.entity.BoqHeaderFk,
							'BoqDivisionTypeFk': item.Id
						});
					}
				} else {
					_.remove($scope.entity[identification], {'BoqDivisionTypeFk': item.Id});
				}

				// update the boq2divisionType assignment cache
				boqDivisionTypeAssignmentUpdateService.addBoq2DivisionTypeToUpdateByDivisionType($scope.entity, item, item.Filter);
			}

			function onCellChange(e, args) {
				processItem(args.item);
				var boqMainService = $injector.get('boqMainService');
				boqMainService.divisionTypeAssignmentChanged.fire(boqMainService, args.item, $scope);
				// boqMainService.gridRefresh();
			}

			function onHeaderCheckboxChange(e) {
				var data = platformGridAPI.items.data($scope.gridId);
				_.forEach(data, function (item) {
					item.Filter = e.target.checked;
					processItem(item);
					$scope.$apply();
				});

				var boqMainService = $injector.get('boqMainService');
				boqMainService.divisionTypeAssignmentChanged.fire(boqMainService, data, $scope);
				boqMainService.gridRefresh();
			}

			$popupInstance.onResizeStop.register(onPopupResizeStop);
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					$popupInstance.onResizeStop.unregister(onPopupResizeStop);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					platformGridAPI.grids.unregister($scope.gridId);

					if ($scope.$close) {
						$scope.$close();
					}
				}
			});
		}
	]);
})();
