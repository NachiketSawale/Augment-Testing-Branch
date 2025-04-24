(function coonfig(angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.assetmaster.basicsAssetMasterGridController
	 * @require $scope
	 * @description controller for basic asset master
	 */
	var moduleName = 'basics.assetmaster';
	angular.module(moduleName).controller('basicsAssetMasterGridController',
		['$timeout', '$scope', 'platformGridControllerService', 'basicsAssetMasterService',
			'basicsAssetMasterStandardConfigurationService', 'basicsAssetMasterValidationService', 'platformGridAPI',
			function basicsAssetMasterGridController($timeout, $scope, gridControllerService, dataService, gridColumns, validationService, platformGridAPI) {

				var gridConfig = {
					columns: [],
					parentProp: 'AssetMasterParentFk',
					childProp: 'AssetMasterChildren'
				};

				function onScrollToItem(e, entity) {
					$timeout(function timeoutCallback() {
						var itemList = dataService.getList();
						if (itemList.length > 0) {
							dataService.setSelected(itemList[0]).then(function selectedCallback() {
								platformGridAPI.rows.expandAllSubNodes($scope.gridId);
								platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity);
							});
						}
					}, 100);
				}

				dataService.onScrollToItem.register(onScrollToItem);


				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// for hidden bulk editor button
				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);

				$scope.$on('$destroy', function destroy() {
					dataService.onScrollToItem.unregister(onScrollToItem);
				});
			}]);
})(angular);