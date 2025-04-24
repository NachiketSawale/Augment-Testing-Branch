/**
 * Created by gaz on 9/7/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemMaterialAiAlternativesController', [
		'_',
		'$scope',
		'$translate',
		'platformGridAPI',
		'procurementPackageItemMaterialAiAlternativesService',
		'procurementPackageItemMaterialAiAlternativesSuggestedMaterialDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPackageItemMaterialAiAlternativesUIStandardService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformSidebarWizardCommonTasksService',
		'procurementCommonPrcItemDataService',
		function (_,
			$scope,
			$translate,
			platformGridAPI,
			procurementPackageItemMaterialAiAlternativesService,
			procurementPackageItemMaterialAiAlternativesSuggestedMaterialDataService,
			basicsLookupdataLookupDescriptorService,
			gridColumns,
			basicsCommonHeaderColumnCheckboxControllerService,
			platformSidebarWizardCommonTasksService,
			procurementCommonPrcItemDataService) {

			$scope.isBusy = false;
			$scope.busyInfo = '';

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}

			procurementPackageItemMaterialAiAlternativesService.busyStatusChanged.register(busyStatusChanged);

			var _params = $scope.$parent.modalOptions.params;
			$scope.selectedItem = null;

			$scope.gridId = _params.gridId;

			var _userInput = {};
			_userInput.data = procurementPackageItemMaterialAiAlternativesService.updateReadOnly(_params.packageItemsData.Main);

			basicsLookupdataLookupDescriptorService.attachData({Materials: _params.packageItemsData.Materials});
			procurementPackageItemMaterialAiAlternativesSuggestedMaterialDataService.attachData(_params.packageItemsData);

			$scope.gridData = {
				state: $scope.gridId
			};

			angular.extend($scope.modalOptions, {
				headerText: $translate.instant('procurement.package.ai.aiAlternatives'),
				update: $translate.instant('procurement.package.ai.update'),
				cancel: function () {
					$scope.$parent.$close(false);
				}
			});

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: _userInput.data,
					columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					options: {
						skipPermissionCheck: true,
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

			var headerCheckBoxFields = ['IsCheckAi'];
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
				if (gridData !== null && gridData.length > 0) {
					_.forEach(gridData, function (item) {
						if (item.MdcMaterialFk === item.OriginalMaterialFk) {
							item.IsCheckAi = false;
						} else {
							item.IsCheckAi = isSelected;
						}
					});
				}
			}

			function onSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					procurementPackageItemMaterialAiAlternativesService.setSelectedId($scope.selectedItem.Id);
				}
			}

			$scope.canUpdate = function () {
				var gridData = platformGridAPI.items.data($scope.gridId);
				return (_.findIndex(gridData, {IsCheckAi: true}) !== -1);
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				_params.values = _userInput.data;
				procurementPackageItemMaterialAiAlternativesService.set(_params).then(function () {
					procurementCommonPrcItemDataService.getService().load();
					$scope.close(true);
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('procurement.package.ai.aiAlternatives', $translate.instant('procurement.package.ai.autoMappingDone'));
				});
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			$scope.validateMdcMaterialFk = function (entity, value) {
				var alternatives = _params.packageItemsData.Alternatives;
				procurementPackageItemMaterialAiAlternativesService.validateMdcMaterialFk(entity, value, alternatives);
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['IsCheckAi']);
			};
		}
	]);
})(angular);