/**
 * @author: chd
 * @date: 5/20/2021 10:20 AM
 * @description:
 */
/* global, angular */
(function (angular) {

	'use strict';

	var moduleName = 'defect.main';

	/**
	 * @ngdoc controller
	 * @name defectAiEstimateCostController
	 * @function
	 *
	 * @description
	 * defectAiEstimateCostController
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('defectAiEstimateCostController', [
		'globals',
		'_',
		'$scope',
		'$http',
		'$translate',
		'platformGridAPI',
		'defectAiEstimateCostService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCharacteristicTypeHelperService',
		'defectAiEstimateCostUIStandardService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformSidebarWizardCommonTasksService',
		'defectMainHeaderDataService',
		function (globals,_,
			$scope,
			$http,
			$translate,
			platformGridAPI,
			defectAiEstimateCostService,
			basicsLookupdataLookupDescriptorService,
			basicsCharacteristicTypeHelperService,
			gridColumns,
			basicsCommonHeaderColumnCheckboxControllerService,
			platformSidebarWizardCommonTasksService,
			defectMainHeaderDataService) {

			$scope.isBusy = false;
			$scope.busyInfo = '';

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}

			defectAiEstimateCostService.busyStatusChanged.register(busyStatusChanged);

			var _params = $scope.$parent.modalOptions.params;
			$scope.selectedItem = null;
			$scope.gridId = _params.gridId;

			var _userInput = {};
			_userInput.data = _params.defectEstimationData.DefectEstimationDtos;

			$scope.gridData = {
				state: $scope.gridId
			};

			angular.extend($scope.modalOptions, {
				headerText: $translate.instant('defect.main.aiWizard.costPrediction'),
				update: $translate.instant('basics.materialcatalog.update'),
				cancelBtn: $translate.instant('cloud.common.cancel')
			});

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: _userInput.data,
					columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					options: {
						tree: false,
						skipPermissionCheck: true,
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			var headerCheckBoxFields = ['IsChecked'];
			var headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

			function checkAll(e) {
				var isSelected = (e.target.checked);
				var gridData = _userInput.data;
				resetSelectedChildren(gridData, isSelected);
			}

			function resetSelectedChildren(children, value) {
				if (children && children.length > 0) {
					_.forEach(children, function (child) {
						child.IsChecked = value;
						resetSelectedChildren(child.ChildItems, value);
					});
				}
			}

			function onSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					defectAiEstimateCostService.setSelectedId($scope.selectedItem.Id);
				}
			}

			function hasUpdate(items) {
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].IsChecked) {
							return true;
						}
					}
				}
				return false;
			}

			$scope.canUpdate = function () {
				var gridData = platformGridAPI.items.data($scope.gridId);
				return hasUpdate(gridData);
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();

				_params.values = _userInput.data.filter(function (item) {
					return item.IsChecked;
				});

				$http.post(globals.webApiBaseUrl + 'defect/main/header/mtwoai/updatedefectestimation', _params.values).then(function () {
					$scope.close(true);
					defectMainHeaderDataService.refresh();
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('defect.main.aiWizard.aiWizardTitle', $translate.instant('defect.main.aiWizard.UpdateSuccess'));
				});
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$parent.$close(false);
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

		}
	]);
})(angular);
