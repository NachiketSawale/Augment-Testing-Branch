/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformWizardSelectionList
	 * @element div
	 * @restrict A
	 * @description A directive that displays a list for selecting resources that can be used as the contents of a
	 *              wizard step.
	 */
	angular.module('platform').directive('platformWizardSelectionList',
		platformWizardSelectionList);

	platformWizardSelectionList.$inject = ['_', '$compile', 'platformGridAPI',
		'platformTranslateService', '$timeout', 'math'];

	function platformWizardSelectionList(_, $compile, platformGridAPI, platformTranslateService, $timeout, math) {
		return {
			restrict: 'A',
			scope: {
				model: '='
			},
			link: function ($scope, elem) {
				$scope.gridId = '19fc842e6fca495aa78f7d86ccdb7875-' + math.randomInt(0, 10000);
				$scope.gridData = {
					state: $scope.gridId
				};

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				const cfg = $scope.model.selectionListConfig || {};
				const selectModel = cfg.selectedIdProperty || 'selectedId';
				const idProperty = cfg.idProperty || 'id';
				const columns = _.cloneDeep(cfg.columns || []);
				const multiSelectionProperty = cfg.checkListProperty || 'rt$isIncluded';

				if (cfg.multiSelect) {
					columns.push({
						id: 'include',
						field: multiSelectionProperty,
						name$tr$: cfg.includedColumnHeaderKey || 'platform.wizard.isIncluded',
						width: 180,
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: true,
						sortable: true,
						searchable: true,
						resizeable: true
					});
				}

				const grid = {
					data: [],
					lazyInit: true,
					enableConfigSave: false,
					columns: columns,
					id: $scope.gridId,
					options: {
						propagateCheckboxSelection: true,
						skipPermissionCheck: true,
						tree: _.isString(cfg.childProp) || _.isString(cfg.parentProp),
						childProp: cfg.childProp,
						parentProp: cfg.parentProp,
						indicator: true,
						idProperty: idProperty
					}
				};
				platformTranslateService.translateObject(grid.columns, 'name');
				platformGridAPI.grids.config(grid);

				elem.append($compile('<div class="border-all flex-element flex-box flex-column overflow"><div class="flex-element" data-platform-Grid data-data="gridData"></div></div>')($scope));

				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
				$scope.$on('wzdlgStepChanged', function () {
					platformGridAPI.grids.resize($scope.gridId);
				});

				if (_.isFunction($scope.model.cellChanged)) {
					platformGridAPI.events.register($scope.gridId, 'onCellChange', function (evt, info) {
						$scope.model.cellChanged({
							item: info.item,
							columnIndex: info.cell - 1,
							rowIndex: info.row
						});
					});
				}

				$scope.$watch('model.items', function (newValue) {
					const newItems = newValue || [];
					platformGridAPI.items.data($scope.gridId, newItems);

					const currentSelection = $scope.model[selectModel];
					if (cfg.multiSelect) {
						if (_.isArray(currentSelection)) {
							currentSelection.forEach(function (selId) {
								const item = _.find(newItems, function (item) {
									return item[idProperty] === selId;
								});
								if (item) {
									item[multiSelectionProperty] = true;
								}
							});
						}
					} else {
						const selectedIndex = _.findIndex(newItems, function (item) {
							return item[idProperty] === currentSelection;
						});
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: (selectedIndex >= 0) ? [newItems[selectedIndex]] : []
						});
					}
				});

				if (cfg.multiSelect) {
					$scope.$watch('model.items', function (newValue) {
						$scope.model[selectModel] = _.map(_.filter(_.isArray(newValue) ? newValue : [], function (item) {
							return !!item[multiSelectionProperty];
						}), function (item) {
							return item[idProperty];
						});
					}, true);
				} else {
					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onActiveCellChanged);
				}

				function onActiveCellChanged() {
					const selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
					if (angular.isArray(selected)) {
						$scope.model[selectModel] = null;
					} else if (angular.isObject(selected)) {
						$scope.model[selectModel] = selected[idProperty];
					} else {
						$scope.model[selectModel] = null;
					}
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.commitAllEdits();
					if (!cfg.multiSelect) {
						platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onActiveCellChanged);
					}
				});
			}
		};
	}
})(angular);
