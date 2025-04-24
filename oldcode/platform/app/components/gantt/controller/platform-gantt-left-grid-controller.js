/**
 * Created by saa.mik on 24.07.2019.
 */
(function (angular) {
	'use strict';

	angular.module('platform').controller('platformGanttLeftGridController', PlatformGanttLeftGridController);

	PlatformGanttLeftGridController.$inject = ['$scope',
		'platformGridControllerService',
		'platformGanttDataService',
		'platformGridAPI'];

	function PlatformGanttLeftGridController($scope,
		platformGridControllerService,
		platformGanttDataService,
		platformGridAPI) {
		var conf = platformGanttDataService.getLeftGridConfig();

		$scope.gridId = conf.uuid;

		$scope.config = {
			initCalled: false, columns: [],
			passThrough: {
				rowHeight: 25// platformPlanningBoardDataService.getRowHeightFromSettings()
			},
			gridDataAccess: 'ganttGridData',
			enableColumnSort: false
		};

		if (!_.isUndefined(conf.treeView)) {
			$scope.config.parentProp = conf.treeView.parentProp;
			$scope.config.childProp = conf.treeView.childProp;
		}

		function init() {
			platformGridControllerService.initListController($scope, conf.uiStandardService, conf.dataService, conf.validationService, $scope.config);
			$scope.gridConfigReady = true;
		}

		function whenChanged() {
			platformGridAPI.grids.unregister($scope.gridId);
			$scope.config.passThrough.rowHeight = 25; // platformPlanningBoardDataService.getRowHeightFromSettings();
			init();
			$scope.gridConfigReady = true;
		}

		function onStart() {
			$scope.gridConfigReady = false;
		}

		// platformPlanningBoardDataService.registerOnSettingsChanged(whenChanged);
		// platformPlanningBoardDataService.registerOnSettingsChangedStarted(onStart);

		$scope.$on('$destroy', function () {
			platformGanttDataService.unregisterUpdateDone();
			platformGanttDataService.unregisterSelectedEntitiesChanged();
			platformGanttDataService.unregisterItemModified();
			// platformGanttDataService.unregisterParentServiceListLoaded();
			// platformPlanningBoardDataService.unregisterOnSettingsChanged(whenChanged);
			// platformPlanningBoardDataService.unregisterOnSettingsChangedStarted(onStart);
		});

		init();

	}

})(angular);
