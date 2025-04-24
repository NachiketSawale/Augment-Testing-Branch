/**
 * Created by wul on 9/1/2020.
 */

(function (angular) {
	'use strict';

	angular.module('procurement.common').controller('prcCommonUpdateEstPrcStructureController',
		['$scope','platformGridAPI', 'platformGridControllerService', 'prcCommonUpdateEstimatePrcStructureDataSerivce', 'prcCommonUpdateEstimatePrcStructureUISerivce',
			function ($scope, platformGridAPI, platformGridControllerService,dataService, uiStandardService) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'PrcStructureFk',
					childProp: 'ChildItems',
					skipPermissionCheck: true,
					collapsed: false,
				};

				$scope.gridId = 'FA740FF0A2094DA085175A2E379F60A7';

				$scope.getContainerUUID = function () {
					return $scope.gridId;
				};
				$scope.tools = {update: function(){}};
				$scope.setTools = function () {};

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);

				dataService.loadData().then(function () {
					$scope.$parent.isReady = true;
					platformGridAPI.rows.expandAllNodes($scope.gridId);
					platformGridAPI.grids.resize($scope.gridId);
				});


				$scope.$on('$destroy', function () {
				});
			}]);
})(angular);