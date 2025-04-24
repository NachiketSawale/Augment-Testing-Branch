(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceImportFileListController',
		['$scope', '$translate', 'platformGridAPI', '$timeout', 'procurementInvoiceWizardImportService', 'platformTranslateService',

			function ($scope, $translate, platformGridAPI, $timeout, procurementInvoiceWizardImportService, platformTranslateService) {
				// $scope.path = globals.appBaseUrl;
				var settings = procurementInvoiceWizardImportService.getGridConfiguration();

				var translatePrefix = 'procurement.invoice.';

				$scope.modalTitle = $translate.instant(translatePrefix + 'title.importInvoiceTitle');
				$scope.gridId = settings.uuid;

				// Filter handling
				const filterPrefix = translatePrefix + 'wizard.invoice.import.Filter';
				const FILTER_ALL = 'all';
				const FILTER_ERROR = 'error';
				const FILTER_CURRENT = 'current';
				const FILTER_RIB_STANDARD = 'ribstandard';
				const FILTER_ZUGFeRD = 'zugferd';

				const TYPE_RIB_STANDARD = 'RIBStandard';
				const TYPE_ZUGFeRD = 'ZUGFeRD';
				$scope.filterOptions = {
					items: [
						{id: FILTER_ALL, name: $translate.instant(`${filterPrefix}All`)},
						{id: FILTER_ERROR, name: $translate.instant(`${filterPrefix}Error`)},
						{id: FILTER_CURRENT, name: $translate.instant(`${filterPrefix}Current`)},
						{id: FILTER_RIB_STANDARD, name: $translate.instant(`${filterPrefix}RIBStandard`)},
						{id: FILTER_ZUGFeRD, name: $translate.instant(`${filterPrefix}ZUGFeRD`)}
					],
					valueMember: 'id',
					displayMember: 'name'
				};
				$scope.selectedFilter = FILTER_ALL;
				$scope.onFilterOptionChanged = function () {
					procurementInvoiceWizardImportService.getDataItems()
						.then(allImportFiles => {
							const filteredImportFiles = _.filter(allImportFiles, item => {
								switch ($scope.selectedFilter) {
									case FILTER_ERROR:
										return item.IsErrorFile;
									case FILTER_CURRENT:
										return !item.IsErrorFile;
									case FILTER_RIB_STANDARD:
										return item.FileType === TYPE_RIB_STANDARD;
									case FILTER_ZUGFeRD:
										return item.FileType === TYPE_ZUGFeRD;
									default:
										return true;
								}
							});
							platformGridAPI.items.data($scope.gridId, filteredImportFiles);
						})
						.catch(error => {
							console.error('Error fetching data items:', error);
						});
				};

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
						name: $translate.instant('procurement.invoice.wizard.checkbox.headerText'),
						name$tr$: 'procurement.invoice.wizard.checkbox.headerText',
						formatter: 'boolean',
						editor: 'boolean',
						width: 60,
						headerChkbox: true
					});

					var dataList = [];
					procurementInvoiceWizardImportService.getDataItems().then(function (items) {
						showError(false, '', errorType.error);
						$scope.modalOptions.dialogLoading = false;
						dataList = items;
						platformGridAPI.items.data($scope.gridId, dataList);
					}, function () {
						showError(true, $translate.instant(translatePrefix + 'error.noAvailableFileError', errorType.error));
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

				$scope.toggleFilter = function (active) {
					platformGridAPI.filters.showSearch($scope.gridId, active);
				};

				var checkAll = function checkAll(e) {
					procurementInvoiceWizardImportService.checkAllItems(e.target.checked);
					$scope.$digest();
				};

				function updateItemList() {
					procurementInvoiceWizardImportService.getDataItems().then(function (res) {
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
					$scope.modalOptions.OKBtnRequirement = !procurementInvoiceWizardImportService.isOKBtnRequirement();
				});
				/* function onSelectedRowsChanged() {
					 var selected = platformGridAPI.rows.selection({
					 gridId: $scope.gridId
					 });

					 selected = _.isArray(selected) ? selected[0] : selected;
					 gridSelectionDialogService.setSelected(selected);
					 } */

				// noinspection JSUnusedLocalSymbols
				function onRefreshEntity(e, entity) {
					platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: entity});
				}

				procurementInvoiceWizardImportService.refreshEntity.register(onRefreshEntity);
				// platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				$scope.onOK = function () {
					$scope.$close({isOK: true, data: procurementInvoiceWizardImportService.getSelectedItems()});
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: false});
				};

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
					procurementInvoiceWizardImportService.refreshEntity.unregister(onRefreshEntity);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				});
			}
		]);
})(angular);