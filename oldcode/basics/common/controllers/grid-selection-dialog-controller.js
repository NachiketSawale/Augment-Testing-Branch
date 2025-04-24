/**
 * Created by wuj on 11/19/2015.
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').controller('basicsCommonGridSelectionDialogController',
		['$scope', 'platformGridAPI', '$timeout', 'basicsCommonGridSelectionDialogService', 'platformTranslateService',

			function ($scope, platformGridAPI, $timeout, gridSelectionDialogService, platformTranslateService) {
				// $scope.path = globals.appBaseUrl;
				$scope.modalTitle = gridSelectionDialogService.getDialogTitle();
				$scope.gridId = gridSelectionDialogService.getGridUUID();

				const settings = gridSelectionDialogService.getGridConfiguration();

				const isAllowMultiple = gridSelectionDialogService.getAllowMultiple();

				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const tempColumns = angular.copy(settings.columns);
					tempColumns.unshift({
						id: 'IsChecked',
						field: 'IsChecked',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						headerChkbox: isAllowMultiple,
						validator: 'isCheckedValueChange'
					});

					const grid = {
						columns: tempColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: gridSelectionDialogService.usesTree(),
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					if (gridSelectionDialogService.hasIconClass()) {
						grid.options.iconClass = gridSelectionDialogService.getIconClass();
					}

					if (gridSelectionDialogService.usesTree()) {
						grid.options.parentProp = gridSelectionDialogService.getParentProp();
						grid.options.childProp = gridSelectionDialogService.getChildProp();
						grid.options.collapsed = false;
					}

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.toggleFilter = function (active) {
					platformGridAPI.filters.showSearch($scope.gridId, active);
				};

				$scope.isCheckedValueChange = gridSelectionDialogService.isCheckedValueChange;

				const checkAll = function checkAll(e) {
					gridSelectionDialogService.checkAllItems(e.target.checked);
					$scope.$digest();
				};

				function updateItemList() {
					platformGridAPI.items.data($scope.gridId, gridSelectionDialogService.getDataItems());
				}

				const gridListener = $scope.$watch(function () {
					return $scope.gridCtrl !== undefined;
				}, function () {
					$timeout(function () {
						updateItemList();
						gridListener();
					}, 10);
				});

				$scope.$watch(function () {
					$scope.modalOptions.OKBtnRequirement = isAllowMultiple ? !gridSelectionDialogService.isOKBtnRequirement() : !gridSelectionDialogService.isOnlyOneSelected();
				});

				/* function onSelectedRowsChanged() {
				 var selected = platformGridAPI.rows.selection({
				 gridId: $scope.gridId
				 });

				 selected = _.isArray(selected) ? selected[0] : selected;
				 gridSelectionDialogService.setSelected(selected);
				 } */

				function onRefreshEntity(e, entity) {
					platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: entity});
				}

				gridSelectionDialogService.refreshEntity.register(onRefreshEntity);
				// platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				$scope.onOK = function () {
					$scope.$close({isOK: true, data: gridSelectionDialogService.getSelectedItems()});
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: false});
				};

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);

				$scope.$on('$destroy', function () {
					// platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.grids.unregister(gridSelectionDialogService.getGridUUID());
					gridSelectionDialogService.refreshEntity.unregister(onRefreshEntity);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				});
			}
		]);
})(angular);