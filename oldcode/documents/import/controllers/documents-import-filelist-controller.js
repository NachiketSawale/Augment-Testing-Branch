(function (angular) {

	'use strict';

	angular.module('documents.import').controller('documentsImportFileListController',
		['$scope', '$translate', 'platformGridAPI', '$timeout', 'documentsImportWizardImportService', 'platformTranslateService',

			function ($scope, $translate, platformGridAPI, $timeout, documentsImportWizardImportService, platformTranslateService) {

				var settings = documentsImportWizardImportService.getGridConfiguration();

				var translatePrefix = 'documents.import.';

				$scope.modalOptions.headerText = $translate.instant(translatePrefix + 'wizard.documentsImport');
				$scope.gridId = settings.uuid;

				var errorType = {info: 1, error: 3};

				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var tempColumns = angular.copy(settings.columns);
					tempColumns.unshift({
						id: 'IsChecked',
						field: 'IsChecked',
						name: $translate.instant('documents.import.wizard.checkboxHeaderText'),
						name$tr$: 'documents.import.wizard.checkboxHeaderText',
						formatter: 'boolean',
						editor: 'boolean',
						width: 60,
						headerChkbox: true
					});

					var dataList = [];
					documentsImportWizardImportService.getDataItems().then(function (items) {
						showError(false, '', errorType.error);
						$scope.modalOptions.dialogLoading = false;
						dataList = items;
						platformGridAPI.items.data($scope.gridId, dataList);
					});

					var grid = {
						columns: tempColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				var checkAll = function checkAll(e) {
					documentsImportWizardImportService.checkAllItems(e.target.checked);
					$scope.$digest();
				};

				function updateItemList() {
					documentsImportWizardImportService.getDataItems().then(function (res) {
						platformGridAPI.items.data($scope.gridId, res);
					});
				}

				var gridListener = $scope.$watch(function () {
					return $scope.gridCtrl !== undefined;
				}, function () {
					$timeout(function () {
						updateItemList();
						gridListener();
					}, 10);
				});

				$scope.$watch(function () {
					$scope.modalOptions.OKBtnRequirement = !documentsImportWizardImportService.isOKBtnRequirement();
				});

				function onRefreshEntity(e, entity) {
					platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: entity});
				}

				$scope.onOK = function () {
					$scope.$close({isOK: true, data: documentsImportWizardImportService.getSelectedItems()});
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: false});
				};
				$scope.modalOptions.cancel = $scope.onCancel;

				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);

				$scope.$on('$destroy', function () {
					// platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.grids.unregister(settings.uuid);
					documentsImportWizardImportService.refreshEntity.unregister(onRefreshEntity);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				});
			}
		]);
})(angular);