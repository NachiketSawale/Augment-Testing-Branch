(function (angular) {
	'use strict';

	function GridConfigController($scope, $modalInstance, platformTranslateService, platformGridAPI, _, platformGridConfigService, $timeout) {

		$scope.configItems = platformGridAPI.configuration.getPropConfig(true);
		$scope.parentGridId = platformGridAPI.configuration.getGID();

		var gridColumns = platformGridConfigService.getVisibleColumns();

		gridColumns.splice(gridColumns.length - 1, 0, {
			id: 'fixed',
			formatter: 'boolean',
			name: 'Fixed',
			name$tr$: 'cloud.desktop.gridFixedColumnHeader',
			field: 'pinned',
			width: 40,
			cssClass: 'cell-center',
			editor: 'boolean',
			focusable: true
		});

		if (platformGridAPI.configuration.isGrpContainer()) {
			// rei@5.10.18, make place for additional column for grouping
			if (gridColumns[0] && gridColumns[0].id === 'fieldName') {
				gridColumns[0].width = gridColumns[0].width - 10;  // fixed and aggregate Column width
			}
			if (gridColumns[1] && gridColumns[1].id === 'userFieldName') {
				gridColumns[1].width = gridColumns[1].width - 70;  // fixed and aggregate Column width
			}

			var aggregateColumn = {
				id: 'aggregate',
				formatter: 'select',
				name: 'Aggregate',
				name$tr$: 'platform.aggregateColumnTitle',
				field: 'aggregates',
				width: 70,
				cssClass: 'cell-center',
				editor: 'select',
				editorOptions: {
					valueMember: 'aggregate',
					displayMember: 'description',
					modelIsObject: false,
					items: [
						{Id: 101, aggregate: 'SUM', description: 'SUM', description$tr$: 'platform.aggregations.sum'},
						{Id: 102, aggregate: 'AVG', description: 'AVG', description$tr$: 'platform.aggregations.avg'},
						{Id: 103, aggregate: 'MAX', description: 'MAX', description$tr$: 'platform.aggregations.max'},
						{Id: 104, aggregate: 'MIN', description: 'MIN', description$tr$: 'platform.aggregations.min'},
						{Id: 105, aggregate: '', description: '', description$tr$: 'platform.aggregations.none'}
					]
				},
				focusable: true
			};
			platformTranslateService.translateObject(aggregateColumn.editorOptions.items);

			gridColumns.push(aggregateColumn);

			setTimeout(function () {
				$scope.configItems.forEach(function (item) {
					if (item.id === 'genericStruct' || item.id === 'itemCount') {
						item.__rt$data = item.__rt$data || {};
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: item, field: 'aggregates'});
					} else {
						// rei@4.10.18 add support for: aggregate function to SUM if not already there
						if (!_.isString(item.aggregates)) {
							item.aggregates = aggregateColumn.editorOptions.items[0].aggregate;
						}
					}
				});
			}, 50);
		}

		if (_.filter(platformGridAPI.columns.getColumns($scope.parentGridId), {'domain': 'convert'}).length > 0) {
			gridColumns.push({
				id: 'uom',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				},
				name: 'UoM',
				field: 'uom',
				width: 70,
				cssClass: 'cell-right',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookupdata-uom-lookup',
					lookupOptions: {}
				},
				focusable: true
			}, {
				id: 'fraction',
				formatter: 'boolean',
				name: 'Fraction',
				field: 'fraction',
				width: 30,
				editor: 'boolean'
			});

			setTimeout(function () {
				$scope.configItems.forEach(function (item) {
					var currentColumn = _.find(platformGridAPI.columns.getColumns($scope.parentGridId), {'id': item.id});
					if (_.isUndefined(currentColumn) || currentColumn.domain !== 'convert') {
						item.__rt$data = item.__rt$data || {};
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: item, field: 'uom'});
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: item, field: 'fraction'});
					}
				});
			}, 50);
		}

		platformTranslateService.translateGridConfig(gridColumns);

		$scope.gridId = platformGridAPI.configuration.$$configId.replace(' ', '');

		$scope.gridData = {
			state: $scope.gridId
		};

		$scope.availableGridId = 'fffffe94db154e72bed8fb879b08ffff';

		$scope.availableGridData = {
			state: $scope.availableGridId
		};

		var availableGridColumns = platformGridConfigService.getAvailableColumns();

		if (!platformGridAPI.grids.exist($scope.availableGridId)) {
			var availableGridConfig = {
				columns: angular.copy(availableGridColumns),
				data: [],
				id: $scope.availableGridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					skipPermissionCheck: true,
					showMainTopPanel: true,
					saveSearch: false,
					editorLock: new Slick.EditorLock()
				}
			};

			platformGridAPI.grids.config(availableGridConfig);
			platformTranslateService.translateGridConfig(availableGridConfig.columns);
			initAvailableData();
		}

		function initAvailableData() {
			platformGridAPI.grids.invalidate($scope.availableGridId);
			platformGridAPI.items.data($scope.availableGridId, getAvailableDatas());
		}

		function getAvailableDatas() {
			//	Grid on t he left side -> items, there are not visible. And sorted
			var notVisibleItems = _.filter($scope.configItems, ['hidden', false]);
			var sortData = _.sortBy(notVisibleItems, ['name']);

			return sortData;
		}

		$scope.checkstatus = {
			visibility: 'unknown',
			enter: 'unknown'
		};

		$scope.modalOptions = {
			closeButtonText: 'Cancel',
			closeButtonText$tr$: 'platform.cancelBtn',
			actionButtonText: 'OK',
			actionButtonText$tr$: 'platform.okBtn',
			height: '85%',
			headerText$tr$: 'platform.gridContainer.configDialogTitle'
		};

		platformTranslateService.translateObject($scope.modalOptions);

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			platformTranslateService.translateGridConfig($scope.configItems);
			platformTranslateService.translateObject($scope.Options, ['closeButtonText', 'actionButtonText']);

			var grid = {
				data: [],
				columns: angular.copy(gridColumns),
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					skipPermissionCheck: true,
					showMainTopPanel: true,
					saveSearch: false,
					editorLock: new Slick.EditorLock()
				},
				lazyInit: true,
				enableConfigSave: true
			};
			platformGridAPI.grids.config(grid);
			initVisibleData();
		} else {
			platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
		}

		function initVisibleData() {
			var visibleItems = _.filter($scope.configItems, ['hidden', true]);
			visibleItems.forEach(item => {
				setReadonlyAccordingToLabelCode(item);
			});
			platformGridAPI.grids.invalidate($scope.gridId);
			platformGridAPI.items.data($scope.gridId, visibleItems);
		}

		$scope.modalOptions.ok = function () {
			var grid = platformGridAPI.grids.element('id', $scope.gridId);

			if (grid.instance.getEditorLock().isActive()) {
				grid.instance.getEditorLock().commitCurrentEdit();
			}

			var summarized = platformGridAPI.items.data($scope.gridId).concat(platformGridAPI.items.data($scope.availableGridId));
			platformGridAPI.items.data($scope.gridId, summarized);

			$modalInstance.close('ok');
		};

		$scope.modalOptions.cancel = function () {
			platformGridAPI.grids.cancelEdit($scope.gridId);
			$modalInstance.dismiss('cancel');
		};

		$scope.tools = platformGridConfigService.initToolBar($scope.gridId);

		// ////////////////////////////////////////////////////////////////////
		// Config Button Handler interaction-Functions
		// kind:  'part' => only selected item(s), 'total' => all items
		// gridIdStart,gridIdTarget: 'availableGridId', 'gridId'
		// visibilityTag: boolean true, false
		// ////////////////////////////////////////////////////////////////////
		$scope.fromStartToTarget = function (kind, gridIdStart, gridIdTarget, visibleTag) {
			var moveItemsFromStart;
			var grid = platformGridAPI.grids.element('id', $scope[gridIdStart]);
			// get filtered content
			var filter = grid.dataView.getFilteredItems().rows;

			var startItems = platformGridAPI.items.data($scope[gridIdStart]);

			if (kind === 'part') {
				// move not all the items
				var startGridInstance = platformGridAPI.grids.element('id', $scope[gridIdStart]).instance;
				var startSelectedRows = startGridInstance.getSelectedRows();

				moveItemsFromStart = startSelectedRows.map(function (row) {
					// get item from startGrid
					return startGridInstance.getDataItem(row);
				});
			} else {
				// user click buttons for all items
				// moveItemsFromStart = angular.copy(startItems);
				moveItemsFromStart = angular.copy(filter);
			}

			var targetGridInstance = platformGridAPI.grids.element('id', $scope[gridIdTarget]).instance;
			var targetSelectedRows = targetGridInstance.getSelectedRows();
			var targetItems = platformGridAPI.items.data($scope[gridIdTarget]);

			// item add in Visible Columns
			var indexForVisibleColumn = targetSelectedRows.length === 1 ? (targetSelectedRows[0] + 1) : targetItems.length;

			angular.forEach(moveItemsFromStart, function (value) {
				// set visible tag
				value.hidden = visibleTag;

				// add item to the visible column in the right row-index
				targetItems.splice(indexForVisibleColumn, 0, value);
				indexForVisibleColumn++;

				// remove item from available columns
				startItems.splice(_.findIndex(startItems, {id: value.id}), 1);

				filter.splice(_.findIndex(filter, {id: value.id}), 1);
			});

			// update grid content
			platformGridAPI.items.data($scope[gridIdStart], startItems);

			platformGridAPI.grids.refresh($scope[gridIdStart]);

			platformGridAPI.items.data($scope[gridIdTarget], targetItems);

			// set selection in grid
			platformGridAPI.rows.selection({gridId: $scope[gridIdTarget], rows: moveItemsFromStart});

			// handle Button disabled-status
			$scope.availableGridIdSelected = gridIdTarget === 'availableGridId' ? false : true;
			$scope.gridIdSelected = gridIdTarget === 'gridId' ? false : true;
		};

		$scope.availableGridIdSelected = true;
		$scope.gridIdSelected = true;

		platformGridAPI.events.register($scope.availableGridId, 'onActiveCellChanged', onActiveCellChangedRightGrid);

		function onActiveCellChangedRightGrid() {
			// is also triggered by ctrl key(multiselection)
			$scope.availableGridIdSelected = false;
		}

		platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

		function onActiveCellChanged() {
			// is also triggered by ctrl key(multiselection)
			$scope.gridIdSelected = false;
		}

		function setReadonlyAccordingToLabelCode(activeRow) {
			if (activeRow.labelCode) {
				if (!activeRow.__rt$data) {
					activeRow.__rt$data = {};
					platformGridAPI.cells.readonly({gridId: $scope.gridId, item: activeRow, field: 'userLabelName'});
				} else {
					let readonly = _.find(activeRow.__rt$data.readonly, (item) => {
						return item.field === 'userLabelName';
					});
					if (readonly) {
						readonly.readonly = true;
					} else {
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: activeRow, field: 'userLabelName'});
					}
				}
			} else {
				if (activeRow.__rt$data && activeRow.__rt$data.readonly) {
					let readonly = _.find(activeRow.__rt$data.readonly, (item) => {
						return item.field === 'userLabelName';
					});
					if (readonly) {
						readonly.readonly = false;
					}
				}
			}

			if (activeRow.isIndicator) {
				if (!activeRow.__rt$data) {
					activeRow.__rt$data = {};
				}
				platformGridAPI.cells.readonly({gridId: $scope.gridId, item: activeRow, field: 'pinned'});
				platformGridAPI.cells.readonly({gridId: $scope.gridId, item: activeRow, field: 'keyboard.enter'});
				platformGridAPI.cells.readonly({gridId: $scope.gridId, item: activeRow, field: 'width'});
			}
		}

		function onCellChanged() {
			let activeRow = platformGridAPI.rows.selection({gridId: $scope.gridId});
			setReadonlyAccordingToLabelCode(activeRow);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChanged);

		let executeBeforeNavigate = function () {
			// $modalInstance.close({stepStatus: 'nothing'});
			$timeout($modalInstance.dismiss({ok: false}));

		};

		platformGridConfigService.registerOnNavigate(executeBeforeNavigate);

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChanged);
				platformGridAPI.grids.unregister($scope.gridId);
			}

			if (platformGridAPI.grids.exist($scope.availableGridId)) {
				platformGridAPI.events.unregister($scope.availableGridId, 'onActiveCellChanged', onActiveCellChangedRightGrid);
				platformGridAPI.grids.unregister($scope.availableGridId);
			}
		});
	}

	GridConfigController.$inject = ['$scope', '$modalInstance', 'platformTranslateService', 'platformGridAPI', '_', 'platformGridConfigService', '$timeout'];

	angular.module('platform').controller('gridConfigController', GridConfigController);

})(angular);