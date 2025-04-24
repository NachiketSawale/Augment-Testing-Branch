(function (angular) {
	'use strict';
	const module = 'productionplanning.header';

	angular.module(module).controller('ppsHeaderJobAddressBlobController', PpsHeaderJobAddressBlobController);
	PpsHeaderJobAddressBlobController.$inject = ['$scope', 'platformFileUtilControllerFactory', 'productionplanningHeaderDataService',
		'ppsHeaderJobAddressBlobService', 'basicsCommonMapSnapshotService'];

	function PpsHeaderJobAddressBlobController($scope, platformFileUtilControllerFactory, ppsHeaderDataService,
		ppsHeaderJobAddressBlobService, mapSnapshotService) {
		platformFileUtilControllerFactory.initFileController($scope, ppsHeaderDataService, ppsHeaderJobAddressBlobService);

		ppsHeaderDataService.registerUpdateDone(updateDone);
		function updateDone() {
			$scope.getFile();
			$scope.tools.update();
		}

		mapSnapshotService.registerMapSnapshotReady($scope.getFile);

		$scope.$on('$destroy', function () {
			ppsHeaderDataService.unregisterUpdateDone(updateDone);
			mapSnapshotService.unregisterMapSnapshotReady($scope.getFile);
		});
	}
})(angular);