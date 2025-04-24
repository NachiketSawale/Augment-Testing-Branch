

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainBackwardCalculationGridController
	 * @requires $scope
	 * @description Shows grid in dialog
	 */
	angular.module(moduleName).controller('estimateMainBackwardCalculationGridController',
		['$scope', '$timeout','platformGridAPI', 'platformGridControllerService', 'estimateMainBackwardCalculationGridUIConfigService', 'estimateMainBackwardCalculationGridDataService',
			function ($scope, $timeout, platformGridAPI, platformGridControllerService, gridUIConfigService, gridDataService) {

				let myGridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.setTools = function () {};

				$scope.tools = {
					update : function () {}
				};

				$scope.gridId = '50765b9dc81b4bc5b5f3958a10c69ff7';

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);
					$scope.isLoading = true;
					gridDataService.load().then(function(){
						$scope.isLoading = false;
					});
					$timeout(function () {
						platformGridAPI.grids.invalidate($scope.gridId);
						platformGridAPI.grids.resize($scope.gridId);
						platformGridAPI.grids.refresh($scope.gridId);
					});
				}

				init();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});

			}]);
})();
