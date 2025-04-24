/**
 * Created by waz on 11/1/2017.
 */
(function (angular) {
	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.controller('basicsCommonContainerDialogChildGridContainerController', BasicsCommonContainerDialogChildGridContainerController);
	BasicsCommonContainerDialogChildGridContainerController.$inject = ['$scope', '$injector', 'platformGridControllerService', 'platformGridAPI'];

	function BasicsCommonContainerDialogChildGridContainerController($scope, $injector, platformGridControllerService, platformGridAPI) {

		let dataService;
		let uiService;

		function init() {
			getServices();
			setupDataService();
			initController();
			setupPlatformGrid();
		}

		function getServices() {
			dataService = getService($scope.getDialogConfig().custom.childContainer.dataService);
			uiService = getService($scope.getDialogConfig().custom.childContainer.uiService);
		}

		function setupDataService() {
			dataService.registerListLoadStarted(function () {
				$scope.isLoading = true;
			});
			dataService.registerListLoaded(function () {
				$scope.isLoading = false;
			});
			dataService.registerSelectionChanged(function () {
				dataService.deselect();
			});
		}

		function initController() {
			$scope.gridId = $scope.getDialogConfig().custom.childContainer.gridId;
			const gridConfig = {
				multiSelect: false
			};
			platformGridControllerService.initListController($scope, uiService, dataService, {}, gridConfig);
		}

		function setupPlatformGrid() {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.element('id', $scope.gridId).isStaticGrid = true;
			}
		}

		function getService(service) {
			return angular.isString(service) ? $injector.get(service) : service;
		}

		init();
		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}
})(angular);