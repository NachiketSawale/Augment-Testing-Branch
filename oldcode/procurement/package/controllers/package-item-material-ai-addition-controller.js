/**
 * Created by gaz on 9/7/2018.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemMaterialAiAdditionController', [
		'_',
		'$scope',
		'$translate',
		'platformGridAPI',
		'procurementPackageItemMaterialAiAdditionUIStandardService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'procurementCommonPrcItemDataService',
		'procurementPackageItemMaterialAiAdditionService',
		'procurementPackageItemMaterialAiAdditionDataService',
		'procurementPackagePackage2HeaderService',
		'procurementPackageItemDataService',
		'platformModalService',
		'procurementContextService',
		'$http',
		function (_,
			$scope,
			$translate,
			platformGridAPI,
			gridColumns,
			basicsCommonHeaderColumnCheckboxControllerService,
			procurementCommonPrcItemDataService,
			procurementPackageItemMaterialAiAdditionService,
			procurementPackageItemMaterialAiAdditionDataService,
			procurementPackagePackage2HeaderService,
			procurementPackageItemDataService,
			platformModalService,
			procurementContextService,
			$http) {

			var _params = $scope.$parent.modalOptions.params;
			$scope.selectedItem = null;

			$scope.gridId = _params.gridId;

			var _userInput = {};

			$scope.gridData = {
				state: $scope.gridId
			};

			// page step
			var dialogStatus = {
				searchSupplier: '1',
				chooseSupplier: '2'
			};

			$scope.modalOptions = {
				headerTitle: $translate.instant('procurement.package.ai.aiAlternatives'),
				isHighlightTitle: $translate.instant('procurement.package.ai.findTitle'),
				scopeTitle: $translate.instant('procurement.package.ai.scopeTitle'),

				allItems: $translate.instant('procurement.package.ai.allItems'),
				highlight: $translate.instant('procurement.package.ai.highlightItems'),
				allItemsVal: 'allItems',
				highlightItemsVal: 'highlightItems',
				radioSelect: 'allItems',

				btnOkText: $translate.instant('cloud.common.ok'),
				btnCancelText: $translate.instant('cloud.common.cancel'),
				btnBackText: $translate.instant('basics.common.button.back'),
				btnNextText: $translate.instant('cloud.common.nextStep'),

				dialogLoading: false,
				loadingInfo: '',

				step: dialogStatus.searchSupplier,
				btnNextStatus: true,
				btnOkStatus: false,
				searchOrChooseSupplierStatus: true,

				onNext: function onNext() {
					init();
					var msgBoxTitle = $translate.instant('procurement.package.ai.aiAlternatives');
					$scope.modalOptions.dialogLoading = true;

					var selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
					var prcHeaderFk = selectedSubPackage.PrcHeaderFk;

					if ($scope.modalOptions.radioSelect === $scope.modalOptions.highlightItemsVal) {

						var items = procurementPackageItemDataService.getSelectedEntities();

						if (items.length === 0) {
							$scope.modalOptions.dialogLoading = false;
							platformModalService.showMsgBox($translate.instant('procurement.package.ai.noItemsChooseWarning'), msgBoxTitle, 'warning');
							return;
						}

						var itemsIdGroups = [];
						for (var i = 0; i < items.length; i++) {
							if (items[i].BasItemType2Fk === 1 || items[i].BasItemType2Fk === 2) {
								if (items[i].Description1 !== null || items[i].Description2 !== null) {
									itemsIdGroups.push(items[i].Id);
								}
							}
						}
						if (itemsIdGroups.length === 0) {
							$scope.modalOptions.dialogLoading = false;
							platformModalService.showMsgBox($translate.instant('procurement.package.ai.highlightItemsWarningMsg'), msgBoxTitle, 'warning');
							return;
						}

						$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/mtwoai/materialalternativemapping?prcHeaderFk=' + prcHeaderFk + '&selectList=' + itemsIdGroups)
							.catch(function (/* data, status, header, config */) {
								$scope.modalOptions.dialogLoading = false;
							})
							.then(function (response) {
								if (response.data && response.data.Main && angular.isArray(response.data.Main)) {
									if (response.data.Main.length > 0) {
										$scope.modalOptions.step = dialogStatus.chooseSupplier;
										$scope.modalOptions.headerText = buildHeaderText();
										_userInput.data = response.data;
										procurementPackageItemMaterialAiAdditionDataService.initData(_userInput.data.Main);
										procurementPackageItemMaterialAiAdditionDataService.load();
									} else {
										platformModalService.showMsgBox($translate.instant('procurement.package.ai.noItems2UpdateWarning'), msgBoxTitle, 'warning');
									}
								} else {
									platformModalService.showMsgBox($translate.instant('procurement.package.ai.autoMappingError'), msgBoxTitle, 'warning');
								}
								$scope.modalOptions.dialogLoading = false;
							});
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/mtwoai/materialalternativemapping?prcHeaderFk=' + prcHeaderFk)
							.catch(function (/* data, status, header, config */) {
								$scope.modalOptions.dialogLoading = false;
							})
							.then(function (response) {
								if (response.data && response.data.Main && angular.isArray(response.data.Main)) {
									if (response.data.Main.length > 0) {
										$scope.modalOptions.step = dialogStatus.chooseSupplier;
										$scope.modalOptions.headerText = buildHeaderText();
										_userInput.data = response.data;
										procurementPackageItemMaterialAiAdditionDataService.initData(_userInput.data.Main);
										procurementPackageItemMaterialAiAdditionDataService.load();
									} else {
										platformModalService.showMsgBox($translate.instant('procurement.package.ai.noItems2UpdateWarning'), msgBoxTitle, 'warning');
									}
								} else {
									platformModalService.showMsgBox($translate.instant('procurement.package.ai.autoMappingError'), msgBoxTitle, 'warning');
								}
								$scope.modalOptions.dialogLoading = false;
							});
					}
				},

				onBack: function () {
					$scope.modalOptions.step = dialogStatus.searchSupplier;
					$scope.modalOptions.headerText = buildHeaderText();
					procurementPackageItemMaterialAiAdditionDataService.initData([]);
					procurementPackageItemMaterialAiAdditionDataService.load();
				},

				onOK: function () {
					var msgBoxTitle = $translate.instant('procurement.package.ai.aiAlternatives');
					var data = {};

					data.CompanyCurrencyId = procurementContextService.companyCurrencyId;
					data.Param = procurementCommonPrcItemDataService.getService().aiGetCreateItem();

					var gridData = platformGridAPI.items.data($scope.gridId);
					data.AIUpdatePrcItems = [];
					if (gridData !== null && gridData.length > 0) {
						_.forEach(gridData, function (item) {
							if (item.IsCheckAi === true) {
								data.AIUpdatePrcItems.push(item);
							}
						});
					}

					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/mtwoai/aiupdatematerial', data)
						.then(function (response) {
							if (response.status === 200) {
								procurementPackageItemMaterialAiAdditionDataService.initData([]);
								procurementPackageItemMaterialAiAdditionDataService.load();
								procurementCommonPrcItemDataService.getService().load();
								$scope.$close(false);
								platformModalService.showMsgBox($translate.instant('procurement.package.ai.autoMappingFinished'), msgBoxTitle, 'success');
							} else {
								platformModalService.showMsgBox($translate.instant('procurement.package.ai.autoMappingSaveError'), msgBoxTitle, 'warning');
							}
						})
						.catch(_.noop);
				},

				onCancel: onCancel,
				cancel: onCancel
			};

			$scope.modalOptions.headerText = buildHeaderText();

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			function init() {
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						data: _userInput.data,
						columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
						id: $scope.gridId,
						lazyInit: true,
						resizeable: true,
						initCalled: true,
						height: '70%'
					};
					platformGridAPI.grids.config(grid);
				}
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
			}

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					id: $scope.gridId,
					lazyInit: true,
					resizeable: true,
					initCalled: true,
					height: '70%'
				};
				platformGridAPI.grids.config(grid);
			}

			function onSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					procurementPackageItemMaterialAiAdditionService.setSelectedId($scope.selectedItem.Id);
				}
			}

			function checkAll(e) {
				var isSelected = (e.target.checked);
				var gridData = _userInput.data;
				if (gridData !== null && gridData.length > 0) {
					_.forEach(gridData, function (item) {
						item.IsCheckAi = isSelected;
					});
				}
			}

			function hasUpdate(items) {
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].IsCheckAi || hasUpdate(items[i].ChildItems)) {
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
			$scope.options.height = 0;

			function buildHeaderText() {
				return $scope.modalOptions.headerTitle + ' - ' + $scope.modalOptions.step + '/2';
			}

			function onCancel() {
				$scope.$close(false);
			}
		}
	]);
})(angular);
