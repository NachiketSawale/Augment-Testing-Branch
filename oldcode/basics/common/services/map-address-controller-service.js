/**
 * Created by las on 8/13/2018.
 */

(function () {
	'use strict';

	angular.module('basics.common').service('basicsCommonMapAddressControllerService', MapAddressControllerService);

	MapAddressControllerService.$inject = ['basicsCommonMapAddressRegisterService'];

	function MapAddressControllerService(MapAddressRegisterService) {
		const self = this;

		self.initController = function initController($scope) {
			$scope.entities = [];
			$scope.bShowRoutes = false;
			$scope.bCalculateDist = false;
			MapAddressRegisterService.registerOnShowRoutes(showRuotes);
			MapAddressRegisterService.registerOnCalculateDist(calculateDist);

			function showRuotes(entities) {
				$scope.entities = entities;
				$scope.bShowRoutes = true;
			}

			function calculateDist(entities) {
				$scope.entities = entities;
				$scope.bCalculateDist = true;
			}

			$scope.$on('$destroy', function () {
				MapAddressRegisterService.unregisterOnShowRoutes(showRuotes);
				MapAddressRegisterService.unregisterOnCalculateDist(calculateDist);
			});
		};

	}
})();
