(function () {
	'use strict';
	/*global _*/

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonMapController', [
		'$scope', '$injector',
		'ppsCommonMapDataService',
		'basicsCommonMapSnapshotService',

		function ($scope,  $injector,
			mapDataService, basicsCommonMapSnapshotService) {

			let options = $scope.getContentValue('options');
			let url = options.url;
			let jobPropName = options.jobPropName;
			let parentSrv = $injector.get(options.parentService);
			let propNamesForSnapshot = 	{
				Code: 'Code',
				LgmJobId: 'LgmJobFk'
			};

			basicsCommonMapSnapshotService.setMapSnapshotTools($scope, false);
			parentSrv.registerSelectionChanged(showAddresses);

			if (parentSrv.hasSelection()) {
				showAddresses();
			}

			function showAddresses() {
				let parentEntity = parentSrv.getSelected();
				if (!_.isNil(parentEntity)) {
					mapDataService.loadAddresses(parentEntity[jobPropName], parentEntity.Id, url).then(
						function (addressEntities) {
							$scope.entities = addressEntities;
							basicsCommonMapSnapshotService.updateSnapshotItemList([parentEntity], propNamesForSnapshot, $scope);
						}
					);
				} else {
					$scope.entities = [];
				}
			}

			$scope.$on('$destroy', function () {
				parentSrv.unregisterSelectionChanged(showAddresses);
			});
		}]);
})();