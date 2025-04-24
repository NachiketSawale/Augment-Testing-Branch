/**
 * Created by reimer on 14.01.2015.
 */

(function () {
	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 * Controller for generic dependent data grid
	 **/
	angular.module(moduleName).controller('basicsDependentDataGenericController',
		['$scope',
			'basicsDependentDataGenericService',
			'basicsDependentDataGridColumnsService',
			'basicsDependentDataChartService',
			'platformGridAPI',
			'platformModalService',
			'$injector',
			'platformModuleStateService',
			'$timeout',
			'PlatformMessenger',
			'reportingPrintService',
			'platformToolbarBtnService',
			function ($scope,
				basicsDependentDataGenericService,
				basicsDependentDataGridColumnsService,
				basicsDependentDataChartService,
				platformGridAPI,
				platformModalService,
				$injector,
				platformModuleStateService,
				$timeout,
				PlatformMessenger,
				reportingPrintService,
				platformToolbarBtnService) {

				var _hasBoundColumn = true;    // must have a parent entity

				$scope.isLoading = false;

				// grid's id = container's uuid
				$scope.gridId = $scope.getContainerUUID();

				// console.log('basicsDependentDataGenericController created - scope: ' + $scope.$id);

				// $scope must have this property?
				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.chartDataSource = {
					data: [],
					groups: [],
					parentGroup: null
				};

				var dependentDataType = $scope.getContentValue('type');
				var getBoundContainerUuid = function () {
					let boundContainerUuid = $scope.getContentValue('boundContainerUuid');
					return boundContainerUuid ? boundContainerUuid.toLowerCase() : boundContainerUuid;
				}

				var getDependentDataId = function () {
					var dependentDataId = $scope.getContentValue('dependentDataId');
					return dependentDataId;
				};

				var getDependentChart = function () {
					return $scope.getCurrentContentUrl().indexOf('chart') > -1;
				};

				var dependentDataId = getDependentDataId();
				var isChartUrl = getDependentChart();
				var boundContainerUuid = getBoundContainerUuid();
				var UISelectedItem = [];

				var getMainService = function () {
					var containerModuleName = $scope.getContentValue('moduleInternalName');
					var service = platformModuleStateService.state(containerModuleName).rootService;
					return service;
				};
				var mainService = getMainService();

				var updateGrid = function (data) {
					platformGridAPI.items.data($scope.gridId, data);
					platformGridAPI.grids.invalidate($scope.gridId);
					platformGridAPI.grids.refresh($scope.gridId);
				};

				var groupTreeActionBtn = [
					{
						id: 'd1',
						sort: 55,
						type: 'divider'
					}, {
						id: 't7',
						sort: 60,
						caption: 'cloud.common.toolbarCollapse',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function collapseSelected() {
							platformGridAPI.grouping.collapseGroup($scope.gridId);
						}
					},
					{
						id: 't8',
						sort: 70,
						caption: 'cloud.common.toolbarExpand',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function expandSelected() {
							platformGridAPI.grouping.expandGroup($scope.gridId);
						}
					},
					{
						id: 't9',
						sort: 80,
						caption: 'cloud.common.toolbarCollapseAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: function collapseAll() {
							platformGridAPI.grouping.collapseAllGroups($scope.gridId);
						}
					},
					{
						id: 't10',
						sort: 90,
						caption: 'cloud.common.toolbarExpandAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: function expandAll() {
							platformGridAPI.grouping.expandAllGroups($scope.gridId);
						}
					},
					{
						id: 'd2',
						sort: 100,
						type: 'divider'
					}
				];

				function onGroupingChanged() {
					if ($scope && $scope.gridId) {
						var grid = platformGridAPI.grids.element('id', $scope.gridId);
						var groups = grid.dataView.getGrouping();
						if (groups.length > 0) {
							toolbarItems = _(toolbarItems).concat(groupTreeActionBtn).value();
							updateTools();
						} else {
							if (!grid.options.tree) {
								var itemsToRemove = ['tlb-icons ico-tree-collapse', 'tlb-icons ico-tree-expand', 'tlb-icons ico-tree-collapse-all', 'tlb-icons ico-tree-expand-all'];
								$scope.removeToolByClass(itemsToRemove);
							}
						}
					}
				}

				function onGroupingPanelToggled(e, arg) {
					if (arg.grouppanel) {
						platformGridAPI.events.unregister(arg.grid.id, 'onHeaderToggled', onGroupingPanelToggled);
						var togglePanel = _.find(toolbarItems, function (item) {
							return item.id === 't12';
						});
						if (togglePanel) {
							togglePanel.value = true;
						}
					}
					onGroupingChanged();
				}

				var toolbarItems = [];

				function updateTools() {
					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolbarItems
					});
				}

				$scope.onContentResized(function () {
					platformGridAPI.grids.resize($scope.getContainerUUID());
				});

				$scope.toggleFilter = function (active) {
					platformGridAPI.filters.showSearch($scope.gridId, active);
				};

				function gridToTreeGrid(parentItems, data, level, treeParentProp) {
					_.forEach(parentItems, function (item) {
						item.nodeInfo = {};
						item.nodeInfo.children = false;
						item.nodeInfo.collapsed = true;
						item.nodeInfo.level = level + 1;
						item.HasChildren = false;
						var childs = _.filter(data, function (item1) {
							return item1[treeParentProp] === item.Id;
						});
						if (childs && childs.length > 0) {
							item.nodeInfo.children = true;
							item.ChildItems = childs;
							item.HasChildren = true;
							gridToTreeGrid(childs, data, item.nodeInfo.level, treeParentProp);
						}
					});
				}

				var getIdColumn = function (entity) {
					for (var prop in entity) {
						if (prop.toLowerCase() === 'id') {
							return prop;
						}
					}
					return null;
				};

				var pendingRequest = null;
				var contextSelectionChanged = function (forceLoad) {
					var contextId = null;
					if (boundContainerUuid) {
						let activeRow = platformGridAPI.rows.selection({gridId: boundContainerUuid});
						if (activeRow) {
							let idColumn = getIdColumn(activeRow);
							if (idColumn && activeRow.hasOwnProperty(idColumn)) {
								contextId = activeRow[idColumn];
							}
						} else {
							platformGridAPI.items.data($scope.gridId, []);
							return;
						}
					} else if (_hasBoundColumn) {
						var selectedItem = mainService.getSelected();
						if (selectedItem) {
							var idColumn = getIdColumn(selectedItem);
							if (idColumn && selectedItem.hasOwnProperty(idColumn)) {
								contextId = selectedItem[idColumn];
							}
						} else {
							// throw new Error('Please first select a parent entity!');
							return;
						}
					} else if (!forceLoad) {
						return;
					}
					if (pendingRequest !== null) {
						pendingRequest.cancel('parent entity changed');
					}
					if (!contextId) {
						return;
					}

					pendingRequest = basicsDependentDataGenericService.loadData(dependentDataId, contextId);

					pendingRequest.promise.then(
						function (data) {
							var isTree = dependentDataType === 3;
							if (isChartUrl) {
								reloadChartData(data);
							} else if (isTree && treeParentProp) {
								var arrItems = [];
								_.forEach(data, function (item) {
									var propValue = item[treeParentProp];
									if (propValue) {
										var findParent = _.find(data, function (item1) {
											return item1.Id === propValue;
										});
										if (!findParent) {
											arrItems.push(item);
										}
									} else {
										arrItems.push(item);
									}
								});
								gridToTreeGrid(arrItems, data, -1, treeParentProp);
								updateGrid(arrItems);
							} else {
								updateGrid(data); // success handler
							}

						},
						function (reason) {  // jshint ignore:line
							console.log(reason);
							// error handler

						}).finally(function () {
						pendingRequest = null;
					});
				};

				var contextUpdated = function () {
					contextSelectionChanged();
				};

				var refreshSubContainerRequested = function () {
					contextSelectionChanged();
				};

				var refreshUserContainer = function () {
					contextSelectionChanged(true);
				};

				if (boundContainerUuid) {
					if (platformGridAPI.grids.exist(boundContainerUuid)) {
						platformGridAPI.events.register(boundContainerUuid, 'onSelectedRowsChanged', contextSelectionChanged);
					} else {
						platformGridAPI.events.register(boundContainerUuid, 'onInitialized', onInitializedSubContainer);
					}
				} else if (mainService) {
					mainService.registerSelectionChanged(contextSelectionChanged);
					mainService.registerUpdateDataExtensionEvent(contextUpdated);
					mainService.registerRefreshRequested(refreshUserContainer);
					if (mainService.hasOwnProperty('onRefreshSubContainerRequested')) {
						mainService.onRefreshSubContainerRequested.register(refreshSubContainerRequested);
					}
				}

				function onInitializedSubContainer() {
					platformGridAPI.events.register(boundContainerUuid, 'onSelectedRowsChanged', contextSelectionChanged);
				}

				/************reloadChartData******/
				function reloadChartData(data) {
					$scope.chartDataSource = {
						data: data,
						group: [],
						parentGroup: null
					};
					UISelectedItem = [];
					var chartData = updateChartGrid(data);
					updateGrid(chartData);
				}

				/*******chart list change***/
				var chartfilter = '';

				function chartFilter(value, chart) {
					return function () {
						chartfilter = value;
						if (chart.Config) {
							if (JSON.parse(chart.Config).group) {
								$scope.groups = JSON.parse(chart.Config).group.enable;
								if ($scope.groups) {
									$scope.chartDataConfig = chart;
									groupShow();
									platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellChange);
									return;
								}
							}
						}
						$scope.chartDataSource.group = [];
						$scope.chartDataSource.parentGroup = null;
						$scope.groups = false;
						$scope.chartDataConfig = chart;
						//platformGridAPI.events.unregister($scope.gridId, 'onCellChange');
						//platformGridAPI.grids.unregister($scope.gridId);
					};
				}

				function check(value) {
					return function () {
						return chartfilter === value;
					};
				}

				function onGridCellChange(e, args) {
					var parentEntity = null;
					var currentItem = args.item;
					UISelectedItem = [];
					var gridData = platformGridAPI.items.data($scope.gridId);
					if (currentItem.Children) {
						parentEntity = currentItem;
						for (var i = 0; i < currentItem.Children.length; i++) {
							var Children = currentItem.Children[i];
							Children.checked = currentItem.checked;
						}
					} else {
						var currentParentId = currentItem.PID;
						parentEntity = _.find(gridData, {'Id': currentParentId});
						var Childrens = parentEntity.Children;
						if (Childrens.length > 0) {
							parentEntity.checked = Childrens.some(function (item) {
								return item.checked;
							});
						}
					}
					_.forEach(gridData, function (item) {
						if (item.Id !== parentEntity.Id) {
							item.checked = false;
							var _Childrens = item.Children;
							_.forEach(_Childrens, function (_item) {
								_item.checked = false;
							});
						}
					});
					var currentChildren = parentEntity.Children;
					_.forEach(currentChildren, function (item) {
						if (item.checked) {
							UISelectedItem.push(item);
						}
					});
					platformGridAPI.grids.invalidate($scope.gridId);
					var data = $scope.chartDataSource.data;
					$scope.chartDataSource = {
						data: data,
						group: UISelectedItem,
						parentGroup: parentEntity.Id
					};
				}

				var initChartGridView = function () {
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var gridCols = [{
							id: 'checked',
							actionList: [],
							domain: 'boolean',
							field: 'checked',
							formatter: 'boolean',
							name: 'Checked',
							editor: 'boolean',
							disabled: false,
							permission: true,
							navigator: false,
							searchable: false,
							focusable: false
						}, {
							id: 'group',
							actionList: [],
							domain: 'description',
							field: 'group',
							width: 100,
							sortable: true,
							formatter: 'description',
							name: 'Group',
							navigator: false,
							searchable: false
						}
						];
						var grid = {
							data: [],
							columns: angular.copy(gridCols),
							id: $scope.gridId,
							options: {
								tree: true,
								childProp: 'Children',
								skipPermissionCheck: true,
								parentProp: 'PID',
								idProperty: 'Id',
								collapsed: false,
								indicator: true,
								enableDraggableGroupBy: false,
								isUserContainer: true
							},
							enableConfigSave: true
						};
						platformGridAPI.grids.config(grid);
					}
				};

				var columns = [];

				function groupShow() {
					initChartGridView();
					var data = $scope.chartDataSource.data;
					$scope.chartDataSource = {
						data: data,
						group: [],
						parentGroup: null
					};
					UISelectedItem = [];
					var chartData = updateChartGrid(data);
					updateGrid(chartData);
				}

				function updateChartGrid(data) {
					var dataSourceData = data;
					var chart = $scope.chartDataConfig;
					var chartData = [];
					if (!chart) {
						return false;
					}
					var columnItem1 = chart.g1Column;
					var columnItem2 = chart.g2Column;
					var group1 = null;
					var group2 = null;
					var children1 = [];
					var children2 = [];
					var columnItem1Name;
					var columnItem2Name;

					if (dataSourceData) {
						var group1Map = {};
						var group2Map = {};
						for (var i = 0; i < dataSourceData.length; i++) {
							data = dataSourceData[i];
							if (columnItem1) {
								columnItem1Name = 'g1' + columnItem1.Id;
								var column1 = columnItem1.DatabaseColumn;
								var d1 = data[column1];
								if (d1 && !group1Map[d1]) {
									group1Map[d1] = d1;
									children1.push({Id: columnItem1Name + data.Id, checked: false, group: d1, PID: columnItem1Name});
								}
							}
							if (columnItem2) {
								var column2 = columnItem2.DatabaseColumn;
								columnItem2Name = 'g2' + columnItem2.Id;
								var d2 = data[column2];
								if (d2 && !group2Map[d2]) {
									group2Map[d2] = d2;
									children2.push({Id: columnItem2Name + data.Id, checked: false, group: d2, PID: columnItem2Name});
								}
							}
						}
					}
					if (columnItem1) {
						columnItem1Name = 'g1' + columnItem1.Id;
						group1 = columnItem1.DescriptionInfo.Description ? columnItem1.DescriptionInfo.Description : columnItem1.DatabaseColumn;
						chartData.push({Id: columnItem1Name, checked: false, group: group1, Children: children1});
					}
					if (columnItem2) {
						columnItem2Name = 'g2' + columnItem2.Id;
						group2 = columnItem2.DescriptionInfo.Description ? columnItem2.DescriptionInfo.Description : columnItem2.DatabaseColumn;
						chartData.push({Id: columnItem2Name, checked: false, group: group2, Children: children2});
					}
					return chartData;
				}

				var initChartGrid = function () {
					var firstGroup = false;
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellChange);
					$scope.triggerUpdateEvent = new PlatformMessenger();
					$scope.$on('splitter.ResizeChanged', function () {
						$scope.triggerUpdateEvent.fire();
					});

					_.each($('.k-splitter'), function (item) {
						var splitter = $(item).data('kendoSplitter');
						if (splitter) {
							splitter.bind('resize', function () {
								$scope.triggerUpdateEvent.fire();
							});
						}
					});
					basicsDependentDataChartService.loadData(dependentDataId).then(function (datas) {
						var charts = datas[0].data;
						columns = datas[1].data;
						var items = [];
						_.forEach(charts, function (chart) {
							var caption = chart.TitleInfo.Description;
							var chartId = chart.Id;
							var xColumn = _.find(columns, {Id: chart.DependentdatacolumnXFk});
							var yColumn = _.find(columns, {Id: chart.DependentdatacolumnYFk});
							var g1Column = _.find(columns, {Id: chart.DependentdatacolumnGrp1Fk});
							var g2Column = _.find(columns, {Id: chart.DependentdatacolumnGrp2Fk});
							chart.xColumn = xColumn;
							chart.yColumn = yColumn;
							chart.g1Column = g1Column;
							chart.g2Column = g2Column;
							var UserchartSeriesEntities = chart.UserchartSeriesEntities;
							if (UserchartSeriesEntities && UserchartSeriesEntities.length > 0) {
								_.forEach(UserchartSeriesEntities, function (UserchartSerie) {
									var _xColumn = _.find(columns, {Id: UserchartSerie.DependentdatacolumnXFk});
									var _yColumn = _.find(columns, {Id: UserchartSerie.DependentdatacolumnYFk});
									var _rColumn = _.find(columns, {Id: UserchartSerie.DependentdatacolumnRFk});
									UserchartSerie.xColumn = _xColumn;
									UserchartSerie.yColumn = _yColumn;
									UserchartSerie.rColumn = _rColumn;
								});
							}
							items.push({
								caption: caption,
								value: chartId,
								type: 'radio',
								fn: chartFilter(chartId, chart),
								disabled: check(chartId)
							});
						});

						if (items.length > 0) {
							var first = _.first(charts);
							chartfilter = first.Id;
							$scope.chartDataConfig = first;
							if (first.Config) {
								$scope.groups = JSON.parse(first.Config).group.enable;
								if ($scope.groups) {
									firstGroup = true;
									initChartGridView();
									groupShow();
								}
							}

							var firstNode = {
								id: 't10',
								sort: 5,
								type: 'dropdown-btn',
								iconClass: 'tlb-icons ico-view-ods',
								list: {
									items: [{
										type: 'sublist',
										list: {
											items: items
										}
									}]
								}
							};
							toolbarItems.push(firstNode);
							if (firstGroup) {
								$timeout(function () {
									platformGridAPI.configuration.refresh($scope.gridId);
								}, 0, false);
							}

						}
						updateTools();
						contextSelectionChanged();
					});
				};

				var addRefreshButton = function () {

					var toolbarItem = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 'd0',
								type: 'divider',
								sort: -6
							},
							{
								id: 'refreshDependentData',
								type: 'item',
								caption: 'cloud.common.toolbarRefresh',
								sort: -5,
								iconClass: 'tlb-icons ico-refresh',
								fn: function () {
									contextSelectionChanged(true);
								}
							}
						]
					};

					$scope.setTools(toolbarItem);
					$timeout($scope.tools.update, 0, true);
				};

				var treeParentProp = null;
				var initGrid = function (isTree) {
					var grid = null;
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var gridCols = basicsDependentDataGridColumnsService.getDefaultCols();
						grid = {
							data: [],
							columns: angular.copy(gridCols),
							id: $scope.gridId,
							options: {
								tree: false,
								indicator: true,
								enableDraggableGroupBy: true,
								isUserContainer: true
							},
							enableConfigSave: true
						};

						if (isTree) {
							grid = {
								data: [],
								columns: angular.copy(gridCols),
								id: $scope.gridId,
								options: {
									tree: true,
									childProp: 'ChildItems',
									skipPermissionCheck: true,
									indicator: true,
									idProperty: 'Id',
									collapsed: false,
									hierarchyEnabled: true,
									isUserContainer: true
								},
								enableConfigSave: true
							};
						}
						platformGridAPI.grids.config(grid);
					}
					toolbarItems = [];

					if (isTree) {
						toolbarItems.push(
							{
								id: 't7',
								sort: 60,
								caption: 'cloud.common.toolbarCollapse',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-collapse',
								fn: function collapseSelected() {
									platformGridAPI.rows.collapseNextNode($scope.gridId);
								}
							},
							{
								id: 't8',
								sort: 70,
								caption: 'cloud.common.toolbarExpand',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-expand',
								fn: function expandSelected() {
									platformGridAPI.rows.expandNextNode($scope.gridId);
								}
							},
							{
								id: 't9',
								sort: 80,
								caption: 'cloud.common.toolbarCollapseAll',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-collapse-all',
								fn: function collapseAll() {
									platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
								}
							},
							{
								id: 't10',
								sort: 90,
								caption: 'cloud.common.toolbarExpandAll',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-expand-all',
								fn: function expandAll() {
									platformGridAPI.rows.expandAllSubNodes($scope.gridId);
								}
							},
							{
								id: 'd2',
								sort: 100,
								type: 'divider'
							}
						);
					} else {
						platformToolbarBtnService.addGroupingBtn($scope, toolbarItems);
						platformGridAPI.events.register($scope.gridId, 'onGroupingChanged', onGroupingChanged);
						platformGridAPI.events.register($scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
					}
					platformToolbarBtnService.addPrintBtn($scope, toolbarItems);
					platformToolbarBtnService.addSearchAllBtn($scope, toolbarItems);
					platformToolbarBtnService.addSearchColumnBtn($scope, toolbarItems);
					platformToolbarBtnService.addLayoutBtn($scope, toolbarItems);
					platformToolbarBtnService.addCopyPasteBtn($scope, toolbarItems);

					updateTools();

					$scope.isLoading = true;

					basicsDependentDataGridColumnsService.loadData(dependentDataId).then(function (viewData) {

						var gridCols = angular.copy(viewData.gridCols);

						if (isTree) {
							var gridCol = _.find(viewData.DependentDataColumnDto, function (item) {
								return 'ID' === item.DatabaseColumn;
							});
							if (gridCol && gridCol.DependentcolParentFk) {
								var parentPropItem = _.find(viewData.DependentDataColumnDto, function (item) {
									return item.Id === gridCol.DependentcolParentFk;
								});
								if (parentPropItem) {
									treeParentProp = parentPropItem.DatabaseColumn;

									angular.extend(grid.options, {
										tree: true,
										childProp: 'ChildItems',
										skipPermissionCheck: true,
										parentProp: treeParentProp,
										idProperty: 'Id',
										collapsed: false,
										hierarchyEnabled: true
									});

									// platformGridAPI.grids.config(grid);
								}
							}
						}

						// platformGridAPI.grids.refresh($scope.gridId,true);

						// load user column config
						$timeout(function () {
							// update grid columns
							platformGridAPI.columns.configuration($scope.gridId, gridCols);

							platformGridAPI.configuration.refresh($scope.gridId, !isTree);
						}, 0, false);
						_hasBoundColumn = viewData.BoundColumn && viewData.BoundColumn.length > 0;
						if (!_hasBoundColumn)
							addRefreshButton();
						$scope.isLoading = false;
						// update grid content
						contextSelectionChanged(true);
					});

				};

				var init = function () {
					if (2 === dependentDataType) {
						initChartGrid();
					} else {
						let isTree = dependentDataType === 3;
						initGrid(isTree);
						let gridListener = $scope.$watch(function () {
							return $scope.gridCtrl !== undefined;
						}, function () {
							$timeout(function () {
								retrieveSavedSettings();
								gridListener();
							}, 10);
						});
					}
				};
				init();

				function retrieveSavedSettings() {

					var filterOptions = platformGridAPI.filters.getFilterOptions($scope.gridId);
					if (filterOptions) {
						var searchAllBtn = _.find(toolbarItems, {id: 'gridSearchAll'});
						if (searchAllBtn) {
							searchAllBtn.value = filterOptions.showMainTopPanel;
						}
						var searchColumnBtn = _.find(toolbarItems, {id: 'gridSearchColumn'});
						if (searchColumnBtn) {
							searchColumnBtn.value = filterOptions.showFilterRow;
						}
					}

					var saveConfiguration = platformGridAPI.grids.getSaveConfiguration($scope.gridId);
					if (saveConfiguration) {
						var allowCopySelection = saveConfiguration.allowCopySelection;
						var copyPasteToolbarItem = _.find(toolbarItems, {id: 'copyPaste'});
						if (copyPasteToolbarItem) {
							var allowCopyToolBarItem = _.find(copyPasteToolbarItem.list.items, {id: 't100'});
							if (allowCopyToolBarItem) {
								allowCopyToolBarItem.value = allowCopySelection;
							}
						}
					}
				}

				/***destroy****/
				$scope.$on('$destroy', function () {
					if (mainService) {
						mainService.unregisterSelectionChanged(contextSelectionChanged);
						mainService.unregisterUpdateDataExtensionEvent(contextUpdated);
						mainService.unregisterRefreshRequested(refreshUserContainer);
						if (mainService.hasOwnProperty('onRefreshSubContainerRequested')) {
							mainService.onRefreshSubContainerRequested.unregister(contextSelectionChanged);
						}
					}
					if (boundContainerUuid) {
						platformGridAPI.events.unregister(boundContainerUuid, 'onInitialized', onInitializedSubContainer);
						platformGridAPI.events.unregister(boundContainerUuid, 'onSelectedRowsChanged', contextSelectionChanged);
					}
					_.each($('.k-splitter'), function (item) {
						var splitter = $(item).data('kendoSplitter');
						if (splitter) {
							splitter.unbind('resize');
						}
					});
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
					platformGridAPI.events.unregister($scope.gridId, 'onGroupingChanged', onGroupingChanged);
					platformGridAPI.grids.unregister($scope.gridId);
					$scope.isLoading = false;
				});
			}
		]);
})();
