
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainParamRemoveDetailController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid','platformGridControllerService','estimateMainParamRemoveDetailService','estimateMainParamRemoveDetailUIService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid,platformGridControllerService, estimateMainParamRemoveDetailService,uiService) {

			$scope.gridId = platformCreateUuid();

			$scope.gridData = {
				state: $scope.gridId
			};

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true
			};


			$scope.setTools = function(tools){
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.tools ={};
			$scope.tools.update= function () {
			};

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, uiService, estimateMainParamRemoveDetailService, null, myGridConfig);
			}
			init();

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
	]);
})();
