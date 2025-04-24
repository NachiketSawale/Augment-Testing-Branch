(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCustomizeStatusMatrix
	 * @description
	 */
	/* jshint -W072 */ //
	angular.module('basics.customize').directive('basicsCustomizeStatusMatrix', function () {

		function matrixController($scope, $timeout, platformGridAPI, platformCreateUuid, basicsCustomizeStatusRuleDataService, basicsCustomizeStatusDataService, platformTranslateService, basicsLookupdataConfigGenerator) {

			var gridColumns = [];
			var entities;
			var filteredItems = [];
			var config = {
				fid: 'basics.customize.rubric',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'status_matrix',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}],
				rows: [
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						'basics.customize.rubriccategory',
						'Description',
						{
							gid: 'status_matrix',
							rid: 'rubric',
							label: 'Rubric Category',
							label$tr$: 'cloud.common.entityBasRubricCategoryFk',
							type: 'integer',
							model: 'rubricCategoryId',
							sortOrder: 1,
							visible: !_.isNil($scope.entity.rubricId)
						},
						false,
						{
							required: true,
							field: 'RubricFk',
							filterKey: 'basics-customize-rubric-category-by-rubric-filter',
							customIntegerProperty: 'BAS_RUBRIC_FK'
						}
					), {
						gid: 'status_matrix',
						rid: 'onlyShowFilteredItems',
						label: 'Only show active states',
						label$tr$: 'basics.customize.statusMatrixOnlyShowActiveStates',
						type: 'boolean',
						model: 'onlyShowActiveStates',
						sortOrder: 2
					}
				]
			};
			$scope.formOptions = {
				configure: config
			};

			var fromToColumn = {
				id: 'fromStateToState',
				field: 'Code',
				name: 'From \\ To',
				formatter: 'code',
				pinned: true,
				sortOrder: 0
			};
			fromToColumn.name = platformTranslateService.instant('basics.customize.FromTo').basics.customize.FromTo;
			gridColumns.push(fromToColumn);

			$scope.gridId = platformCreateUuid();

			var watchRubricCategory = null;
			if ($scope.entity.rubricId) {
				watchRubricCategory = $scope.$watch(function () {
					return $scope.entity.rubricCategoryId;
				}, function (newItem, oldItem) {
					if (newItem !== oldItem) {
						$scope.entity.rubricCategoryId = newItem;
						initMatrix($scope.entity);
					}
				}, false);
			} else {
				initMatrix($scope.entity);
			}

			var watchOnlyShowActiveStates = $scope.$watch(function () {
				return $scope.entity.onlyShowActiveStates;
			}, function (newItem, oldItem) {
				if (newItem !== oldItem) {
					$scope.entity.onlyShowActiveStates = newItem;
					initMatrix($scope.entity);
				}
			}, false);

			function onCellChanged(e, arg) {
				if (arg.cell - 2 >= 0) {
					var col = arg.grid.getColumns(true)[arg.cell];
					var accessor = basicsCustomizeStatusRuleDataService.getColumnIdForFieldName(col.field);
					var statusTargetFk = filteredItems[accessor].Id;
					var statusFk = filteredItems[arg.row].Id;
					$scope.entity.rule = basicsCustomizeStatusRuleDataService.selectStatusRule(statusFk, statusTargetFk);
				}
			}

			function filterItems(selType) {
				filteredItems = basicsCustomizeStatusDataService.provideStates(selType);
			}

			function loadGridData() {
				basicsCustomizeStatusRuleDataService.provideTransitionEntities(filteredItems).then(function (result) {
					entities = result;
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.items.data($scope.gridId, result);
					}
				});
			}

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var gridConfig = {
					data: [], //todo aus instance data
					columns: angular.copy(gridColumns),
					id: $scope.gridId,
					lazyInit: true,
					isStaticGrid: true,
					options: {
						tree: false, indicator: true, allowRowDrag: false,
						editable: true,
						asyncEditorLoading: true,
						autoEdit: false,
						enableCellNavigation: true,
						enableColumnReorder: false,
						selectionModel: new Slick.CellSelectionModel(),
						showItemCount: false
					}
				};

				platformGridAPI.grids.config(gridConfig);
				platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onCellChanged);
			}

			function initMatrix(selType) {

				gridColumns = [];
				entities = [];

				filterItems(selType);
				loadGridData();

				gridColumns.push(fromToColumn);
				_.forEach(filteredItems, function (item, index) {
					gridColumns.push({
						id: basicsCustomizeStatusRuleDataService.getFieldNameForColumn(index).toLowerCase(),
						field: basicsCustomizeStatusRuleDataService.getFieldNameForColumn(index),
						name: item.DescriptionInfo.Translated,
						domain: 'action',
						formatter: 'action',
						editor: 'action',
						sortOrder: index + 1,
						isOpen: true,
						visible: true
					});
				});

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}
			}

			$scope.gridData = {
				state: $scope.gridId
			};

			function refresh(/*e, arg*/) {
				$timeout(function () {
					platformGridAPI.grids.invalidate($scope.gridId);
					//platformGridAPI.cells.selection({gridId: $scope.gridId, rows: [], cell: arg.field});
				});
			}

			basicsCustomizeStatusRuleDataService.actionChanged.register(refresh);

			function setEntityRule(e, item) {
				if (item) {
					$scope.entity.rule = item;
				} else {
					$scope.entity.rule = basicsCustomizeStatusRuleDataService.getSelected();
				}
			}

			basicsCustomizeStatusRuleDataService.registerSelectionChanged(setEntityRule);

			$scope.$on('$destroy', function () {
				basicsCustomizeStatusRuleDataService.actionChanged.unregister(refresh);
				basicsCustomizeStatusRuleDataService.unregisterSelectionChanged(setEntityRule);
				platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onCellChanged);
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				if (watchRubricCategory) {
					watchRubricCategory();
				}

				watchOnlyShowActiveStates();
			});
		}

		return {
			restrict: 'A',
			scope: {
				entity: '='
			},
			templateUrl: window.location.pathname + '/basics.customize/templates/basics-customize-status-matrix.html',
			link: function (/*scope, ele, attrs*/) {
			},
			controller: ['$scope', '$timeout', 'platformGridAPI', 'platformCreateUuid', 'basicsCustomizeStatusRuleDataService', 'basicsCustomizeStatusDataService', 'platformTranslateService', 'basicsLookupdataConfigGenerator', matrixController]
		};

	});
})(angular);
