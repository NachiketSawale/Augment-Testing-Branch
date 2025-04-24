
(function () {
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureCostGroupAssignmentController', ['$scope','platformCreateUuid','$injector','platformGridAPI','platformGridControllerService','controllingStructureCostGroupAssignmentUiService','controllingStructureCostGroupAssignmentDataService',
		function ($scope,platformCreateUuid,$injector,platformGridAPI,platformGridControllerService,controllingStructureCostGroupAssignmentUiService,controllingStructureCostGroupAssignmentDataService) {

			let myGridConfig = {
				initCalled: false,
				columns:[],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false
			};

			$scope.gridId = '1635bb851c6b4255bc50ae6f884d4966';

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.tools = {
				update: function () {
					return;
				}
			};

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, controllingStructureCostGroupAssignmentUiService, controllingStructureCostGroupAssignmentDataService, null, myGridConfig);
			}
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();
			controllingStructureCostGroupAssignmentDataService.registerFilters();

			$scope.$on('$destroy', function () {
				controllingStructureCostGroupAssignmentDataService.refreshData();
				controllingStructureCostGroupAssignmentDataService.unregisterFilters();
			});
		}
	]);
})();