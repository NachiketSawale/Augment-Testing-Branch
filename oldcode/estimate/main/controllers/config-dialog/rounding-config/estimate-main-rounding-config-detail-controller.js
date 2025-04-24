/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainColumnConfigDetailController
	 * @function
	 *
	 * @description
	 * Controller for the column configuration details view.
	 */
	angular.module(moduleName).controller('estimateMainRoundingConfigDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformContextService',
		'estimateMainRoundingConfigDetailUIConfigService', 'estimateMainRoundingConfigDetailDataService', 'platformGridControllerService', 'estimateMainRoundingConfigDataService', 'estimateMainDialogProcessService', 'estimateMainRoundingConfigDetailValidationService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, platformContextService,
			configDetailUIConfigService, estimateMainRoundingConfigDetailDataService, platformGridControllerService, estimateMainRoundingConfigDataService, estimateMainDialogProcessService, configDetailValidationService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				enableConfigSave: false,
				skipPermissionCheck: true,
				skipToolbarCreation: true,
				toolbarItemsDisabled:true,
				cellChangeCallBack: function (arg) {
					estimateMainRoundingConfigDetailDataService.setItemToSave(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();
			estimateMainRoundingConfigDetailDataService.gridId = $scope.gridId;

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, configDetailUIConfigService, estimateMainRoundingConfigDetailDataService, configDetailValidationService, myGridConfig);

				$injector.get('estimateMainDialogDataService').currentItemChangeFire();
			}

			function setDataSource(data) {
				$scope.data = data;
				estimateMainRoundingConfigDetailDataService.setDataList(data);
				estimateMainRoundingConfigDetailDataService.refreshGrid();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.estRoundingConfigDetail);
			}

			function refresh() {
				estimateMainRoundingConfigDetailDataService.refreshGrid();
			}

			estimateMainRoundingConfigDataService.onItemChange.register(updateData);

			$scope.setTools = function(tools){
				tools.update = function () {
					tools.version += 1;
				};
			};

			estimateMainDialogProcessService.onRefreshRoundingConfigDetail.register(refresh);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainRoundingConfigDataService.onItemChange.unregister(updateData);
				estimateMainDialogProcessService.onRefreshRoundingConfigDetail.unregister(refresh);
			});

			init();
		}
	]);
})();
