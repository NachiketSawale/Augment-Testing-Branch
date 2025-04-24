/**
 * Created by wui on 7/31/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	/*jshint -W072*/ // has too many parameters.
	angular.module(moduleName).controller('basicsLookupdataGridPopupController',[
		'_',
		'$scope',
		'$log',
		'$popupInstance',
		'$popupContext',
		'platformGridAPI',
		'keyCodes',
		'platformCreateUuid',
		'platformObjectHelper',
		'basicsLookupdataLookupControllerFactory',
		function (_,
		          $scope,
				  $log,
		          $popupInstance,
		          $popupContext,
		          platformGridAPI,
		          keyCodes,
				  platformCreateUuid,
		          platformObjectHelper,
		          lookupControllerFactory) {
			var treeView = false;
			var selectedItem = $scope.displayItem;
			var selectedId = $scope.editModeHandler.getSelectedRowId();
			var gridId = $scope.settings.uuid;

			if(!gridId){
				$log.warn('Lookup ' + $scope.settings.lookupType + ' miss uuid definition!');
				gridId = platformCreateUuid();
			}

			var extension = _.merge({}, $scope.settings, {
				gridId: gridId,
				idProperty: $scope.settings.idProperty
			});
			var self = lookupControllerFactory.create({grid: true}, $scope, extension);
			var gridIns;
			var gridPlugin = {
				init: function (grid) {
					gridIns = grid;
					subscribeGridEvents(grid);
				},
				destroy: function () {
					unsubscribeGridEvents();
				}
			};

			/**
			 * @description setData
			 * @param set lookup data from outside
			 */
			$scope.options.setData = function (data) {
				prepareNodeInfo(data);
				self.updateData(data);
			};

			/**
			 * @description update popup data
			 * @param data
			 */
			$scope.refreshData = function (data) {
				prepareNodeInfo(data);
				self.updateData(data);
				self.selectRowById(selectedId);
			};

			/**
			 * update data source outside.
			 * @param data data array
			 */
			$scope.updateData = function(data) {
				// apply filter, tree building and cache.
				data = $scope.settings.dataView.processData(data);
				$scope.refreshData(data);
				$scope.updateDisplayData();
			};

			/**
			 * @description reload lookup data.
			 */
			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
				else {
					$scope.settings.dataView.invalidateData();
					refresh('', true);
				}
			};

			$scope.$on('$destroy', function () {
				if ($scope.$close) {
					$scope.$close();
				}
				$popupContext.onLookupSearch.unregister(onLookupSearch);
				$popupContext.onInputKeyDown.unregister(onInputKeyDown);
				$popupContext.onInputBlur.unregister(onInputBlur);
				self.destroy();
			});

			initialize();

			function initialize() {
				treeView = $scope.settings.treeOptions ? true : false;
				$popupInstance.opened.then(onPopupOpened);
				$popupInstance.onResizeStop.register(onResizeStop);
				$popupContext.onLookupSearch.register(onLookupSearch);
				$popupContext.onInputKeyDown.register(onInputKeyDown);
				$popupContext.onInputBlur.register(onInputBlur);
				refresh($scope.searchString);
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

			function onLookupSearch(e, args) {
				// controller is destroyed
				if (self.disposed) {
					return;
				}

				self.updateData(args.result.matchedTree);
				self.delay(function (grid) {
					// controller is destroyed
					if (self.disposed) {
						return;
					}

					grid.setSelectedRows([]);

					if (treeView) {
						grid.getData().expandAllNodes();
					}

					if (args.result.similarItem) {
						self.selectRowById(args.result.similarItem[$scope.settings.idProperty]);
					}
				});
			}

			function onInputKeyDown(e, args) {
				var grid = self.getGrid();
				var prevent = function () {
					args.event.preventDefault();
					args.event.stopPropagation();
					args.defaultPrevented = true;
				};

				switch (args.event.keyCode) {
					case keyCodes.ENTER:
					case keyCodes.TAB:
						{
							args.defaultPrevented = true;
							applySelection(args.event.keyCode);
						}
						break;
					case keyCodes.DOWN:
						{
							prevent();
							self.selectionManager.next();
						}
						break;
					case keyCodes.UP:
						{
							prevent();
							self.selectionManager.prev();
						}
						break;
					case keyCodes.LEFT:
						{
							if (grid && treeView) {
								prevent();
								grid.getData().collapseAllSubNodes(selectedItem);
							}
						}
						break;
					case keyCodes.RIGHT:
						{
							if (grid && treeView) {
								prevent();
								grid.getData().expandAllSubNodes(selectedItem);
							}
						}
						break;
				}
			}

			function onInputBlur(e, args) {
				var grid = self.getGrid();
				if (grid && grid.getContainerNode().contains(args.event.relatedTarget)) {
					// prevent closing if click tree toggle indicator.
					args.event.target.focus();
					args.defaultPrevented = true;
				}
			}

			function refresh(searchString, updateInputText) {
				if (searchString) {
					var lastSearchResult = $scope.settings.dataView.searchResult;
					if (lastSearchResult.searchString === searchString) {
						selectedId = lastSearchResult.similarItem ? lastSearchResult.similarItem[$scope.settings.idProperty] : null;
						$scope.refreshData(lastSearchResult.matchedTree);
					}
				}
				else {
					$scope.isLoading = true;
					var requestArgs = null;
					if($scope.settings.dataView.dataPage.enabled){
						requestArgs = {
							searchFields: $scope.settings.inputSearchMembers,
							searchString: $scope.searchString,
							isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
							paging: true
						};
					}
					$scope.settings.dataView.loadData(requestArgs).then(function (data) {
						$scope.isLoading = false;
						$scope.refreshData(data);
						if (updateInputText) {
							$scope.updateDisplayData();
						}
					});
				}
			}

			/**
			 * @description: set node info for tree view to select initial item.
			 */
			function prepareNodeInfo(items) {
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

			function applySelection(keyCode) {
				var selectedItems = self.getSelectedItems(),
					selectedItem = selectedItems.length ? selectedItems[0] : null;

				if ($scope.canSelect(selectedItem)) {
					$scope.$close({
						isOk: true,
						value: selectedItem,
						keyCode: keyCode
					});
				}
			}

		}
	]);

})(angular);