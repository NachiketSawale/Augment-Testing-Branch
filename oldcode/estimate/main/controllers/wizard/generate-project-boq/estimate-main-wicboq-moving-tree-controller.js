/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name estimateMainMovingWicboqTreeController
     * @requires $scope
     * @description
     */
	angular.module(moduleName).controller('estimateMainMovingWicboqTreeController',
		['$scope', '$injector', 'platformGridAPI','$timeout',
			'platformGridControllerService',
			'estimateMainMovingWicboqTreeUiService',
			'estimateMainMovingWicboqTreeService',
			function ($scope, $injector, platformGridAPI, $timeout,
				platformGridControllerService,
				gridUIConfigService,
				gridDataService) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					type: 'wicitem',
					property: 'Reference'
				};

				$scope.setTools = function () {
					$scope.tools = [];
					$scope.tools.update = function(){

					};
				};
				$scope.gridId = '5b6b9d54d46b42b5bb8c655f2470a43b';


				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);
					gridDataService.loadData();

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				$scope.$on('$destroy', function () {
					gridDataService.restoreCss();
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});

				init();
			}]);
})();
