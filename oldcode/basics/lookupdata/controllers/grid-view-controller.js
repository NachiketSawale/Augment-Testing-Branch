/**
 * Created by wui on 9/20/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).constant('basicsLookupdataGridViewOptions', {
		// callback after grid data refreshed.
		afterDataRefreshed: null
	});

	angular.module(moduleName).controller('basicsLookupdataGridViewController', [
		'$scope',
		'$popupInstance',
		'$popupContext',
		'platformObjectHelper',
		'basicsLookupdataGridViewOptions',
		'basicsLookupdataLookupControllerFactory',
		function ($scope,
			$popupInstance,
			$popupContext,
			platformObjectHelper,
			defaults,
			lookupControllerFactory) {
			var gridIns, treeView, selectedItem;
			var settings = _.merge({}, defaults, $popupContext);
			var self = lookupControllerFactory.create({grid: true}, $scope, settings);
			var gridPlugin = {
				init: function (grid) {
					gridIns = grid;
					subscribeGridEvents(grid);
				},
				destroy: function () {
					unsubscribeGridEvents();
				}
			};

			$scope.isLoading = false;
			$scope.settings = settings;

			/**
             * @description reload lookup data.
             */
			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
				else {
					$scope.settings.dataView.invalidateData();
					loadData();
				}
			};

			$scope.$on('$destroy', function () {
				if ($scope.$close) {
					$scope.$close();
				}
				self.destroy();
			});

			initialize();

			function initialize() {
				treeView = $scope.settings.treeOptions ? true : false;
				settings.dataView.setScope($scope);
				settings.dataView.init(settings);
				$popupInstance.opened.then(onPopupOpened);
				$popupInstance.onResizeStop.register(onResizeStop);
				loadData();
			}

			function onPopupOpened(){
				self.registerGridPlugin(gridPlugin);
			}

			function onResizeStop() {
				var grid = self.getGrid();
				if (grid) {
					grid.resizeGrid(grid.id);
				}
			}

			function loadData() {
				var requestArgs = null;

				$scope.isLoading = true;

				if ($scope.settings.dataView.dataPage.enabled) {
					requestArgs = {
						searchFields: $scope.settings.inputSearchMembers,
						searchString: $scope.searchString,
						isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
						paging: true
					};
				}

				$scope.settings.dataView.loadData(requestArgs).then(function (data) {
					$scope.isLoading = false;
					refreshData(data);
				});
			}

			/**
             * @description update popup data
             * @param data
             */
			function refreshData(data) {
				prepareNodeInfo(data);
				self.updateData(data);
				if(angular.isFunction(settings.afterDataRefreshed)){
					settings.afterDataRefreshed($scope, self);
				}
			}

			/**
             * @description: set node info for tree view to select initial item.
             */
			function prepareNodeInfo(items, selectedId) {
				var initialLevel = 0;

				if (!$scope.settings.treeOptions || !angular.isArray(items) || !selectedId) {
					return;
				}

				for (var i = 0; i < items.length; i++) {
					setCollapsed(items[i], selectedId, initialLevel);
				}

				// set value of collapsed true for all parent items of selected item.
				function setCollapsed(item, targetId, level) {
					var result = false;
					var childItems = [];
					var id = $scope.extractValue(item, $scope.settings.idProperty);

					if (id === targetId) {
						result = true;
					}
					else {
						childItems = $scope.extractValue(item, $scope.settings.treeOptions.childProp);
						if (angular.isArray(childItems)) {
							for (var k = 0; k < childItems.length; k++) {
								result = setCollapsed(childItems[k], targetId, level + 1);
								if (result) {
									if (angular.isUndefined(item.nodeInfo)) {
										item.nodeInfo = {
											collapsed: false,
											level: level,
											children: true
										};
									}
									else if (item.nodeInfo.collapsed) {
										item.nodeInfo.collapsed = false;
									}
									break;
								}
							}
						}
					}

					return result;
				}
			}

			function subscribeGridEvents(grid) {
				grid.onMouseEnter.subscribe(onGridMouseEnter);
				grid.onClick.subscribe(onGridClick);
				grid.onSelectedRowsChanged.subscribe(onGridSelectedRowsChanged);
				grid.getData().onRowsChanged.subscribe(onGridDataViewRowsChanged);
			}

			function unsubscribeGridEvents() {
				gridIns.onMouseEnter.unsubscribe(onGridMouseEnter);
				gridIns.onClick.unsubscribe(onGridClick);
				gridIns.onSelectedRowsChanged.unsubscribe(onGridSelectedRowsChanged);
				gridIns.getData().onRowsChanged.unsubscribe(onGridDataViewRowsChanged);
			}

			function onGridMouseEnter(e, arg) {
				var cell = arg.grid.getCellFromEvent(e),
					rowIndex = cell.row;

				arg.grid.setSelectedRows([rowIndex]);
			}

			function onGridClick() {
				applySelection();
			}

			/**
             * @description: slick grid event handler
             */
			function onGridDataViewRowsChanged() {
				var grid = self.getGrid();
				var gridDataView = grid.getData();

				if (selectedItem) {
					var row = gridDataView.getRowById(platformObjectHelper.getValue(selectedItem, $scope.settings.idProperty));
					grid.setSelectedRows([row]);
				}
				else {
					grid.setSelectedRows([]);
				}
			}

			/**
             * @description: slick grid event handler
             */
			function onGridSelectedRowsChanged(e, args) {
				var grid = args.grid,
					row = args.rows[0],
					dataItem = grid.getDataItem(row);

				// help to expand or collapse node for tree view.
				if (selectedItem !== dataItem) {
					selectedItem = dataItem;
				}
			}

			function applySelection() {
				var selectedItems = self.getSelectedItems(),
					selectedItem = selectedItems.length ? selectedItems[0] : null;

				$scope.$close({
					isOk: true,
					value: selectedItem
				});
			}

		}
	]);

})(angular);

