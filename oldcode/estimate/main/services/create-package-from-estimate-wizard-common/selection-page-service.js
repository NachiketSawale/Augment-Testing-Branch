/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainCreatePackageWizardSelectionPageCommonService', estimateMainCreatePackageWizardSelectionPageCommonService);

	estimateMainCreatePackageWizardSelectionPageCommonService.$inject = ['platformGridAPI', 'platformRuntimeDataService',
		'_', '$injector', 'platformTranslateService', '$timeout'];

	function estimateMainCreatePackageWizardSelectionPageCommonService(
		platformGridAPI, platformRuntimeDataService,
		_, $injector, platformTranslateService, $timeout
	) {
		let service = {
			init: init
		};

		return service;

		function init($scope, options) {
			$scope.isLoading = true;
			$scope.entity.modeFlg = angular.isNumber($scope.entity.modeFlg) ? $scope.entity.modeFlg : 2;
			$scope.entity.rootLevelDisable = _.isBoolean($scope.entity.rootLevelDisable) ? $scope.entity.rootLevelDisable : true;
			$scope.entity.rootLevelFlg = _.isBoolean($scope.entity.rootLevelFlg) ? $scope.entity.rootLevelFlg : false;

			const gridId = options.gridId;
			const parentProp = options.parentProp;
			const childProp = options.childProp;
			const selectionCol = {
				id: 'IsSelected',
				field: 'IsSelected',
				headerChkbox: true,
				toolTip: 'Select',
				name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
				formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
					let html = '';
					let isEntityReadonly = platformRuntimeDataService.isReadonly(dataContext, 'IsSelected');
					if (value === true) {
						html = '<input type="checkbox" checked />';
					} else if (!value) {
						html = '<input type="checkbox" unchecked/>';
					}

					if (isEntityReadonly) {
						html = '<input type="checkbox" disabled="disabled" unchecked />';
					}

					if (dataContext.isIndeterMinate) {
						$timeout(function () {
							angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
						});
					}

					return '<div class="text-center" >' + html + '</div>';
				},
				editor: 'boolean',
				validator: isCheckedValueChanged
			};

			let columns = [selectionCol];

			columns = columns.concat(options.additionalCols);

			let gridConfig = {
				columns: columns,
				data: [],
				id: gridId,
				gridId: gridId,
				idProperty: 'Id',
				lazyInit: false,
				options: {
					tree: true,
					parentProp: parentProp,
					collapsed: false,
					expanded: true,
					showHeaderRow: false,
					showFilterRow: false,
					childProp: childProp
				},
				treeOptions: {
					tree: true,
					idProperty: 'Id',
					parentProp: parentProp,
					childProp: childProp,
					collapsed: false,
					expanded: true,
					showFilterRow: false,
					showHeaderRow: false
				},
				gridOptions: {
					showFilterRow: false
				}
			};

			platformTranslateService.translateGridConfig(gridConfig);

			$scope.getGridConfig = function () {
				return gridConfig;
			}

			$scope.onModeResult = function (value) {
				$scope.entity.modeFlg = value;
				if (1 === value) {
					$scope.entity.rootLevelDisable = true;
					$scope.entity.rootLevelFlg = false;
				}
				let dataList = platformGridAPI.items.data(gridId);

				cancelAllChildren(dataList);

				platformGridAPI.grids.invalidate(gridId);
				platformGridAPI.items.data(gridId, dataList);
				platformGridAPI.grids.refresh(gridId);
			};

			$scope.onRootLevelFlg = function (value) {
				$scope.entity.rootLevelFlg = value;
			};

			$scope.registerHeaderCheckBoxChanged = function (gridId) {
				platformGridAPI.events.register(gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
			}

			$scope.unregisterHeaderCheckBoxChanged = function (gridId) {
				platformGridAPI.events.unregister(gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
			}

			$injector.get('estimateMainCreateBoQPackageWizardService').closeIsLoading.register(loading);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(gridId)) {
					platformGridAPI.grids.unregister(gridId);
					platformGridAPI.events.unregister(gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					$injector.get('estimateMainCreateBoQPackageWizardService').closeIsLoading.unregister(loading);

					if ($scope.$close) {
						$scope.$close();
					}
				}
			});


			function loading() {
				$scope.isLoading = false;
			}

			function isCheckedValueChanged(selectItem, newValue, model, headerCheckedChange, providedGrid, providedRows) {
				if ($scope.entity.modeFlg === 2) {
					checkChildren(selectItem, newValue);
					updateParent(selectItem.parent);
					if (!headerCheckedChange) {
						platformGridAPI.grids.invalidate(gridId);
						platformGridAPI.grids.refresh(gridId);
					}
					let grid = providedGrid ? providedGrid : platformGridAPI.grids.element('id', gridId);
					let dataList = providedRows ? providedRows : grid.dataView.getRows();
					let findChild = _.find(dataList, function (item) {
						if (item[parentProp] !== null && item.IsSelected) {
							return true;
						}
					});
					$scope.entity.rootLevelDisable = _.isEmpty(findChild);
					$scope.entity.rootLevelFlg = false;
				}

				return {apply: true, valid: true, error: ''};
			}

			function checkChildren(item, flg) {
				if (item[childProp] !== null && item[childProp].length > 0 && 2 === $scope.entity.modeFlg) {
					for (let i = 0; i < item[childProp].length; i++) {
						checkChildren(item[childProp][i], flg);
					}
				}
				item.IsSelected = flg;
				item.isIndeterMinate = false;
			}

			function cancelAllChildren(items) {
				let modeFlg = $scope.entity.modeFlg;
				_.forEach(items, function (item) {
					item.IsSelected = false;
					item.isIndeterMinate = false;
					platformRuntimeDataService.readonly(item, 1 === modeFlg && !item.isMark);
					if (item[childProp]) {
						cancelAllChildren(item[childProp]);
					}
				});
			}

			function onHeaderCheckboxChange(e) {
				let data = platformGridAPI.items.data(gridId);
				let grid = platformGridAPI.grids.element('id', gridId);
				let rows = grid.dataView.getRows();

				if ($scope.entity.modeFlg === 2) {
					_.forEach(data, function (item) {
						isCheckedValueChanged(item, e.target.checked, 'IsSelected', true, grid, rows);
					});
				} else {
					_.forEach(rows, function (item) {
						if (item.isMark) {
							item.IsSelected = e.target.checked;
						} else {
							item.IsSelected = false;
						}
					});
				}
			}

			function updateParent(item) {
				if (item) {
					if (item[childProp] && item[childProp].length > 0) {
						const checked = [];
						let hasIndeterMinate = false;
						item[childProp].forEach(function (child) {
							if (child.IsSelected) {
								checked.push(child);
							}
							if (child.isIndeterMinate) {
								hasIndeterMinate = true;
							}
						});

						if (checked.length === 0) {
							item.isIndeterMinate = false;
							item.IsSelected = false;
						} else if ((hasIndeterMinate || checked.length < item[childProp].length) && item.IsSelected) {
							item.isIndeterMinate = true;
						} else if (checked.length === item[childProp].length) {
							item.isIndeterMinate = false;
						}
					}

					updateParent(item.parent);
				}
			}
		}
	}
})(angular);