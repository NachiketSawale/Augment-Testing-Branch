(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonConfirmCascadeDeleteController',
		['$scope', '$translate', 'platformGridAPI', 'platformTranslateService',
			'platformGridControllerService', 'prcCommonConfirmDeleteDialogHelperService',
			'$timeout', '$injector',
			function ($scope, $translate, platformGridAPI, platformTranslateService,
				gridControllerService, prcCommonConfirmDeleteDialogHelperService, $timeout, $injector) {

				$scope.gridId = $scope.$parent.modalOptions.Id || 'structure.selected';
				$scope.gridData = {state: $scope.gridId};
				$scope.options = $scope.$parent.modalOptions;
				var settings = {columns: []};
				if ($scope.options.showDependantDataButton) {
					var gridColumns = $injector.get('procurementCommonOverviewUIStandardService');
					settings = gridColumns.getStandardConfigForListView();
				}

				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}
				var treeData = null;
				$scope.isShowDependantData = false;
				$scope.disableDependencyButton = prcCommonConfirmDeleteDialogHelperService.isDisableDependencyButton();

				function init() {
					prcCommonConfirmDeleteDialogHelperService.initContainerJson().then(function () {
						prcCommonConfirmDeleteDialogHelperService.showDetail().then(function (data) {
							$scope.dialogLoading = false;
							treeData = data;
							platformGridAPI.items.data($scope.gridId, treeData);
							refreshGrid();
						});
					});
				}

				var treeConfig = {
					parentProp: 'ParentFk',
					childProp: 'Children'
				};

				var grid = {
					columns: angular.copy(settings.columns),
					data: [],
					id: $scope.gridId,
					options: {
						tree: true,
						indicator: true,
						idProperty: 'Id',
						iconClass: 'ico-warning',
						skipPermissionCheck: true,
						parentProp: treeConfig.parentProp,
						childProp: treeConfig.childProp,
						collapsed: false
					}
				};

				platformGridAPI.grids.config(grid);

				function refreshGrid() {
					$timeout(function () {
						platformGridAPI.grids.invalidate($scope.gridId);
						platformGridAPI.grids.resize($scope.gridId);
						platformGridAPI.grids.refresh($scope.gridId);
					}, 0);
				}

				function onShowDependantData() {
					$scope.dialogLoading = true;
					$scope.isShowDependantData = !$scope.isShowDependantData;
					if (treeData) {
						$scope.dialogLoading = false;
						refreshGrid();
					} else {
						init();
					}
				}

				angular.extend($scope.options, {
					onShowDependantData: onShowDependantData,
					onOK: function () {
						$scope.$close({yes: true});
					},
					onCancel: function () {
						$scope.$close();
					}
				});

			}]);
})(angular);