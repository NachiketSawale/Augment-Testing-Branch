/**
 * Created by wui on 8/17/2015.
 */

(function (angular) {
	'use strict';
	/* global angular, $, Slick */
	var moduleName = 'basics.lookupdata';

	/* jshint -W072 */ // has too many parameters.
	angular.module(moduleName).factory('basicsLookupdataLookupControllerFactory', [
		'_',
		'platformGridAPI',
		'platformObjectHelper',
		'platformTranslateService',
		'keyCodes',
		'PlatformMessenger',
		'$timeout',
		'$translate',
		'mainViewService',
		'platformToolbarBtnService',
		'platformPermissionService',
		'$stateParams',
		function (
			_,
			platformGridAPI,
			platformObjectHelper,
			platformTranslateService,
			keyCodes,
			PlatformMessenger,
			$timeout,
			$translate,
			mainViewService,
			platformToolbarBtnService,
			platformPermissionService,
			$stateParams) {

			return {
				create: create
			};

			function valueExtractor(item, columnDef) {
				return columnDef.field ? platformObjectHelper.getValue(item, columnDef.field) : '';
			}

			function LookupSearchController($scope, options) {
				var self = this;

				self.onSearch = new PlatformMessenger();

				platformGridAPI.events.register(options.gridId, 'onKeyDown', onGridKeyDown);

				/**
				 * event handler for 'key down' in search box.
				 * @param event
				 * @param searchValue
				 */
				$scope.onSearchInputKeydown = function (event, searchValue) {
					switch (event.keyCode) {
						case keyCodes.ENTER: {
							self.onSearch.fire(null, searchValue);
						}
							break;
					}
				};

				self.onDestroy.register(function () {
					platformGridAPI.events.unregister(options.gridId, 'onKeyDown', onGridKeyDown);
				});

				/**
				 * @description: slick grid event handler
				 */
				function onGridKeyDown(e) {
					if (e.keyCode === keyCodes.ENTER) {
						self.onApply.fire();
					}
				}
			}

			/**
			 * @param $scope
			 * @param options require [gridId, idProperty, columns]
			 * @config
			 * @constructor
			 */
			function LookupGridController($scope, options, config) {
				var self = this;

				self.selectedItems = [];

				var pluginInitialized = false;

				var plugin = {
					init: function (grid) {
						$timeout(function () {
							while (self.actions.length) {
								self.actions.shift()(grid);
							}
							pluginInitialized = true;
						}, 10, false);
					}
				};

				var useTree = !!(options.treeOptions && options.treeOptions.parentProp && options.treeOptions.childProp);
				var hasModuleActivated = $stateParams.tab > 0;

				var addTools = function () {

					if (!config.dialog) {
						return;
					}

					var toolbarItems = [];
					var systemTmplBtn = null;
					var roleTmplBtn = null;
					var hasSystemTmpl = hasModuleActivated && mainViewService.hasModuleConfig($scope.gridId, 's');
					var hasRoleTmpl = hasModuleActivated && mainViewService.hasModuleConfig($scope.gridId, 'r');

					var hasTemplateEditPermission = platformPermissionService.hasExecute('7ee17da2cd004de6a53c63af7cb4d3d9');
					var hasLayoutEditPermission = platformPermissionService.hasExecute('91c3b3b31b5d4ead9c4f7236cb4f2bc0');

					var createItem = function (id, type, sort, hideItem, isSet, options) {
						return _.extend({
							id: id,
							sort: sort,
							type: type,
							hideItem: hideItem,
							isSet: isSet
						}, options);
					};

					var createActionItem = function (id, type, sort, hideItem, caption, iconClass, fn, disabledFn) {
						return createItem(id, type, sort, hideItem, false, {
							caption: caption,
							iconClass: iconClass,
							fn: fn,
							disabled: function () {
								return angular.isFunction(disabledFn) ? disabledFn() : false;
							}
						});
					};

					var updateToolbar = function (id, props) {
						var toolbar = _.find($scope.tools.items, {id: id});
						if (toolbar) {
							_.extend(toolbar, props);
							$scope.tools.update();
						}
					};

					var updateState = function (type, hasTemplate) {
						var updateToolbarId = '', iconClass = '';
						if (type === 's') {
							updateToolbarId = 'user-sys-template-dd';
							hasSystemTmpl = hasTemplate;
							if (systemTmplBtn) {
								iconClass = 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system');
							}
						} else {
							updateToolbarId = 'role-template-dd';
							hasRoleTmpl = hasTemplate;
							if (roleTmplBtn) {
								iconClass = 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles');
							}
						}
						if (updateToolbarId && iconClass) {
							updateToolbar(updateToolbarId, {iconClass: iconClass});
						}
					};

					var refreshView = function () {

						// Retrieve configuration form cache
						var config = mainViewService.getModuleConfig($scope.gridId);

						// Unchecked the grouping button
						updateToolbar('t12', {value: false});

						// Clear grouping columns
						platformGridAPI.columns.setGrouping($scope.gridId, [], true, true, config.Gridconfig.groupColumnWidth);

						// Hide the group panel
						platformGridAPI.grouping.toggleGroupPanel($scope.gridId, false);

						// Refresh configuration
						platformGridAPI.configuration.refresh($scope.gridId, true);
					};

					var saveModuleConfigAs = function (type) {
						mainViewService.saveModuleConfigAs($scope.gridId, type);
						updateState(type, true);
					};

					var applyModuleConfig = function (type) {
						mainViewService.applyModuleConfig($scope.gridId, type);
						refreshView();
					};

					var deleteModuleConfig = function (type) {
						mainViewService.deleteModuleConfig($scope.gridId, type);
						updateState(type, false);
					};

					if (hasModuleActivated) {

						if (hasTemplateEditPermission) {

							systemTmplBtn = createItem('user-sys-template-dd', 'dropdown-btn', 20, false, true, {
								iconClass: 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system'),
								list: {
									showImages: true,
									cssClass: 'dropdown-menu-right',
									items: [
										createActionItem('save-as-sys-tmpl', 'item', 1, false, 'cloud.common.saveAsSystemTemplate', 'tlb-icons ico-save2system', function saveSysTemplateFn() {
											saveModuleConfigAs('s');
										}, function disabledSaveAsSysTemplateFn() {
											return !mainViewService.hasModuleConfig($scope.gridId, 'u');
										}),
										createActionItem('load-sys-tmpl', 'item', 2, false, 'cloud.common.loadSystemTemplate', 'tlb-icons ico-config-system-load', function loadSysTemplateFn() {
											applyModuleConfig('s');
										}, function disabledLoadSysTemplateFn() {
											return !hasSystemTmpl;
										}),
										createActionItem('delete-sys-tmpl', 'item', 3, false, 'cloud.common.deleteSystemTemplate', 'tlb-icons ico-config-system-delete', function deleteSysTemplateFn() {
											deleteModuleConfig('s');
										}, function disabledDeleteSysTemplateFn() {
											return !hasSystemTmpl;
										})
									]
								}
							});

							roleTmplBtn = createItem('role-template-dd', 'dropdown-btn', 22, false, true, {
								iconClass: 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles'),
								list: {
									showImages: true,
									cssClass: 'dropdown-menu-right',
									items: [
										createActionItem('save-as-role-tmpl', 'item', 1, false, 'cloud.common.saveAsRoleTemplate', 'tlb-icons ico-save2role', function saveRoleTemplateFn() {
											saveModuleConfigAs('r');
										}, function disabledSaveAsRoleTemplateFn() {
											return !mainViewService.hasModuleConfig($scope.gridId, 'u');
										}),
										createActionItem('load-role-tmpl', 'item', 2, false, 'cloud.common.loadRoleTemplate', 'tlb-icons ico-config-role-load', function loadRoleTemplateFn() {
											applyModuleConfig('r');
										}, function disabledLoadRoleTemplateFn() {
											return !hasRoleTmpl;
										}),
										createActionItem('delete-role-tmpl', 'item', 3, false, 'cloud.common.deleteRoleTemplate', 'tlb-icons ico-config-role-delete', function deleteRoleTemplateFn() {
											deleteModuleConfig('r');
										}, function disabledDeleteRoleTemplateFn() {
											return !hasRoleTmpl;
										})
									]
								}
							});

						} else {
							if (hasSystemTmpl) {
								systemTmplBtn = createActionItem('reload-user-sys-template', 'item', 20, false, 'cloud.common.reloadUserSystemTemplate', 'tlb-icons ico-config-system-load', function reloadSysTemplateFn() {
									applyModuleConfig('s');
								});
							}
							if (hasRoleTmpl) {
								roleTmplBtn = createActionItem('reload-role-template', 'item', 22, false, 'cloud.common.reloadRoleTemplate', 'tlb-icons ico-config-role-load', function reloadRoleTemplateFn() {
									applyModuleConfig('r');
								});
							}
						}
					}

					// Grouping button
					if (!useTree) {
						toolbarItems.unshift(createItem('d0', 'divider', 0, false, true));
						platformToolbarBtnService.addGroupingBtn($scope, toolbarItems);
					}

					// Template button
					if ((systemTmplBtn || roleTmplBtn)) {
						toolbarItems.push(createItem('d1', 'divider', 18, false, true));
					}

					if (systemTmplBtn) {
						toolbarItems.push(systemTmplBtn);
					}
					if (roleTmplBtn) {
						toolbarItems.push(roleTmplBtn);
					}

					// Grid Layout button
					if (hasLayoutEditPermission) {
						toolbarItems.push(createItem('d3', 'divider', 110, false, true));
						platformToolbarBtnService.addLayoutBtn($scope, toolbarItems);
					}

					if (options.toolbarItems && options.toolbarItems.length > 0) {
						toolbarItems = toolbarItems.length > 0 ? toolbarItems.concat(options.toolbarItems) : options.toolbarItems;
					}

					if (toolbarItems.length > 0) {
						toolbarItems = _.orderBy(toolbarItems, 'sort');
					}

					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						overflow: true,
						sublist: true,
						version: 0,
						refreshVersion: 0,
						update: function () {
							this.version += 1;
						},
						refresh: function () {
							this.refreshVersion += 1;
						},
						items: toolbarItems
					};

				};

				var processColumns = function () {

					if (!config.dialog) {
						return;
					}

					_.each(options.columns, function iterator(col) {

						// grouping
						if (!useTree && _.isUndefined(col.grouping)) {
							col.grouping = {
								title: col.name$tr$ || col.name,
								getter: col.field,
								aggregators: [],
								aggregateCollapsed: true
							};
						}

						// formatter
						if (_.isUndefined(col.formatter)) {
							col.formatter = 'text';
						}

					});
				};

				var processEvents = function () {

					if (!config.dialog) {
						return;
					}

					var groupingToggle = _.find($scope.tools.items, {id: 't12'});

					var treeActionBtn = [
						{
							id: 'd2',
							sort: 13,
							type: 'divider'
						},
						{
							id: 't7',
							sort: 14,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								platformGridAPI.grouping.collapseGroup($scope.gridId);
							}
						},
						{
							id: 't8',
							sort: 15,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								platformGridAPI.grouping.expandGroup($scope.gridId);
							}
						},
						{
							id: 't9',
							sort: 16,
							caption: 'cloud.common.toolbarCollapseAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function collapseAll() {
								platformGridAPI.grouping.collapseAllGroups($scope.gridId);
							}
						},
						{
							id: 't10',
							sort: 17,
							caption: 'cloud.common.toolbarExpandAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function expandAll() {
								platformGridAPI.grouping.expandAllGroups($scope.gridId);
							}
						}
					];

					function onGroupingPanelToggled(e, arg) {
						if (arg.grouppanel) {
							groupingToggle.value = true;
						}
						onGroupingChanged();
					}

					function findByClass(toolItem, cssClassArray) {
						var notFound = true;
						_.each(cssClassArray, function findByClassIterator(CssClass) {
							if (CssClass === toolItem.iconClass) {
								notFound = false;
							}
						});
						return notFound;
					}

					function removeToolByClass(cssClassArray) {
						$scope.tools.items = _.filter($scope.tools.items, function classFilter(toolItem) {
							return findByClass(toolItem, cssClassArray);
						});
						$scope.tools.update();
					}

					function onGroupingChanged() {
						var grid = platformGridAPI.grids.element('id', $scope.gridId);
						var groups = grid.dataView.getGrouping();
						if (groups.length > 0) {
							$scope.tools.items = _.sortBy(_.uniqBy(_.concat($scope.tools.items, treeActionBtn), 'id'), 'sort');
							$scope.tools.update();
						} else {
							if (!grid.options.tree) {
								var itemsToRemove = ['tlb-icons ico-tree-collapse', 'tlb-icons ico-tree-expand', 'tlb-icons ico-tree-collapse-all', 'tlb-icons ico-tree-expand-all'];
								removeToolByClass(itemsToRemove);
							}
						}
					}

					function onInitialized(evt, args) {
						// ALM # 138338 # because some reason user save the wrong setting(showFilterRow = false) cause the filter row can not be active.
						platformGridAPI.filters.showColumnSearch(args.grid.id, true, false);
					}

					if (!useTree) {
						platformGridAPI.events.register($scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
						platformGridAPI.events.register($scope.gridId, 'onGroupingChanged', onGroupingChanged);
					}
					platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

					self.onDestroy.register(function onDestroy() {
						if (!useTree) {
							platformGridAPI.events.unregister($scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
							platformGridAPI.events.unregister($scope.gridId, 'onGroupingChanged', onGroupingChanged);
						}
						platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
					});
				};

				// actions delay to execute after grid initialized.
				self.actions = [];

				/**
				 * execute action which depend on grid instance.
				 * @param action
				 */
				self.delay = function (action) {
					var grid = self.getGrid();
					// make sure the actions execute in the order.
					if (grid && pluginInitialized) {
						action(grid);
					} else {
						self.actions.push(action);
					}
				};

				/**
				 * Is multi-check enabled
				 * @returns {boolean}
				 */
				self.isMultiCheckEnabled = function () {
					return config.dialog && options.multiCheckOptions.isEnabled;
				};

				/**
				 * Append checkbox column
				 * @param columns
				 */
				self.appendCheckboxColumn = function (columns) {
					options.multiCheckOptions.columnConfig.validator = (item, value) => {
						if (value) {
							self.checkItem(item, true);
						} else {
							self.uncheckItem(item, true);
						}

						return true;
					};

					columns.push(options.multiCheckOptions.columnConfig);
				};

				/**
				 * Check data item
				 * @param item
				 * @param skipPropertyCheck
				 */
				self.checkItem = function (item, skipPropertyCheck) {
					if (!self.isMultiCheckEnabled()) {
						return;
					}

					if ($scope.settings.selectableCallback && !$scope.settings.selectableCallback(item, $scope.entity, $scope.settings)) {
						return;
					}

					if (!skipPropertyCheck && !_.get(item, options.multiCheckOptions.columnConfig.field)) {
						_.set(item, options.multiCheckOptions.columnConfig.field, true);
						platformGridAPI.items.invalidate(options.gridId, item);
					}

					if (!self.selectedItems.some(e => _.get(e, options.idProperty) === _.get(item, options.idProperty))) {
						self.selectedItems.push(item);
					}
				};

				/**
				 * Uncheck data item
				 * @param item
				 * @param skipPropertyCheck
				 */
				self.uncheckItem = function (item, skipPropertyCheck) {
					if (!self.isMultiCheckEnabled()) {
						return;
					}

					if (!skipPropertyCheck && _.get(item, options.multiCheckOptions.columnConfig.field)) {
						_.set(item, options.multiCheckOptions.columnConfig.field, false);
						platformGridAPI.items.invalidate(options.gridId, item);
					}

					self.selectedItems = self.selectedItems.filter(e => _.get(e, options.idProperty) !== _.get(item, options.idProperty));
				};

				/**
				 * do grid configuration
				 */
				self.configGrid = function () {
					options.gridData = angular.isArray(options.gridData) ? options.gridData : [];
					options.columns = angular.isArray(options.columns) ? options.columns : [];

					const columns = angular.copy(options.columns);

					if(self.isMultiCheckEnabled()) {
						self.appendCheckboxColumn(columns);
					}

					var gridOptions = {
							idProperty: options.idProperty,
							editorLock: new Slick.EditorLock(),
							indicator: true,
							iconClass: 'controls-icons',
							grouping: options.grouping,
							enableDraggableGroupBy: options.enableDraggableGroupBy,
							dataItemColumnValueExtractor: valueExtractor,
							enableConfigSave: true
						},
						gridConfig = {
							id: options.gridId,
							columns: columns,
							data: options.gridData,
							options: gridOptions
						};

					gridConfig.columns.forEach(function (col) {
						if (col.sortable === undefined) {
							col.sortable = true;
						}
					});

					$.extend(gridOptions, {
							enableModuleConfig: hasModuleActivated
						},
						config.dialog ? {
							enableCopyPasteExcel: false,
							// enableModuleConfig: hasModuleActivated,
							enableDraggableGroupBy: true,
							saveSearch: true,
							showFilterRow: true,
						} : null, options.gridOptions);

					if (options.treeOptions) {
						gridOptions.tree = true;
						gridOptions.collapsed = options.treeOptions.collapsed === undefined ? true : options.treeOptions.collapsed;
						gridOptions.parentProp = options.treeOptions.parentProp;
						gridOptions.childProp = options.treeOptions.childProp;
						if (options.treeOptions.showHeaderRow) {
							gridOptions.showHeaderRow = options.treeOptions.showHeaderRow;
						}
						// idProperty as $scope.settings.valueMember does not work always(ex. in case of DescriptionInfo field)
						if (options.treeOptions.idProperty) {
							gridOptions.idProperty = options.treeOptions.idProperty;
						}
					}
					if (options.lazyInit) {
						gridConfig.lazyInit = options.lazyInit;
					}

					platformGridAPI.grids.config(gridConfig);

					return gridConfig;
				};

				/**
				 * get grid instance.
				 * @returns {*|instance}
				 */
				self.getGrid = function () {
					var gridElement = platformGridAPI.grids.element('id', options.gridId);
					return gridElement ? gridElement.instance : null;
				};

				/**
				 * register slick grid plugin
				 * @param plugin
				 */
				self.registerGridPlugin = function (plugin) {
					var grid = platformGridAPI.grids.element('id', options.gridId);

					if (!grid) {
						return; // the grid is destroyed
					}

					if (!grid.instance) {
						$timeout(function () {
							// grid.instance.registerPlugin(plugin);
							self.registerGridPlugin(plugin);
						}, 10, true);
					} else {
						grid.instance.registerPlugin(plugin);
					}
				};

				/**
				 * update grid data.
				 * @param data
				 */
				self.updateData = function (data) {
					$scope.isLoading = false;

					if (self.isMultiCheckEnabled()) {
						self.setCheckboxState(data);
					}

					platformGridAPI.items.data(options.gridId, data);

					if (options.treeOptions && options.treeOptions.initialState === 'expanded') {
						platformGridAPI.rows.expandAllNodes(options.gridId);
					}
				};

				/**
				 * Set checkbox state according to selected items
				 * @param data
				 */
				self.setCheckboxState = function (data) {
					data.forEach(e => _.set(e, options.multiCheckOptions.columnConfig.field, self.selectedItems.some(se => _.get(se, options.idProperty) === _.get(e, options.idProperty))));
				};

				/**
				 * Clear selected items
				 */
				self.clearSelectedItems = function () {
					self.selectedItems = [];
				};

				/**
				 * get selected data items.
				 * @returns {*}
				 */
				self.getSelectedItems = function () {
					if(self.isMultiCheckEnabled()) {
						return self.selectedItems;
					}

					var grid = platformGridAPI.grids.element('id', options.gridId).instance;
					// modified this block because grid may be null or undefined.
					if (grid) {
						var rows = grid.getSelectedRows();
						if (!rows) {
							return [];
						}
						return rows.map(function (row) {
							return grid.getDataItem(row);
						});
					}

					return [];
				};

				/**
				 * set selection by data id.
				 * @param id
				 */
				self.selectRowById = function (id) {
					self.delay(function (grid) {
						// controller is destroyed
						if (self.disposed) {
							return;
						}

						var row = grid.getData().getRowById(id);
						if (row >= 0) {
							grid.setSelectedRows([row]);
							grid.scrollRowIntoView(row);
						}
					});
				};

				/**
				 * grid selection manager.
				 * @type {{selectRow: Function, next: Function, prev: Function, getSelectedRow: Function, isCanNavigate: Function}}
				 */
				self.selectionManager = {
					selectRow: function (rowIndex) {
						var grid = self.getGrid();
						if (grid && this.isCanNavigate(rowIndex)) {
							grid.scrollRowIntoView(rowIndex);
							grid.setSelectedRows([rowIndex]);
						}
					},
					next: function () {
						var newRowIndex = this.getSelectedRow() + 1;
						this.selectRow(newRowIndex);
					},
					prev: function () {
						var newRowIndex = this.getSelectedRow() - 1;
						this.selectRow(newRowIndex);
					},
					getSelectedRow: function () {
						var grid = self.getGrid(),
							rows = grid.getSelectedRows(),
							index = -1;

						if (rows.length > 0) {
							index = rows[0];
						}

						return index;
					},
					isCanNavigate: function (rowIndex) {
						var grid = self.getGrid(),
							gridDataView = grid.getData(),
							length = gridDataView.getLength();

						return rowIndex >= 0 && rowIndex < length;
					}
				};

				$scope.gridId = options.gridId;

				addTools();

				processColumns();

				platformTranslateService.translateObject(options.columns);

				$scope.grid = {state: options.gridId, config: self.configGrid()};

				processEvents();

				if (platformGridAPI.grids.element('id', options.gridId)) {
					self.registerGridPlugin(plugin);
				}

				self.onDestroy.register(function () {
					platformGridAPI.grids.unregister(options.gridId);
				});
			}

			function LookupDialogController($scope, options) {
				var self = this;

				self.onApply = new PlatformMessenger();

				platformTranslateService.translateObject(options.title);

				/**
				 * close dialog.
				 * @param isOk
				 */
				$scope.close = function (isOk) {
					if (isOk) {
						self.onApply.fire();
					} else {
						$scope.$close({isOk: false, isCancel: true});
					}
				};

				$scope.processFormContainer = function processFormContainer() {
					var formContainerOptions = options.formContainerOptions ? options.formContainerOptions : null;
					var resizeTimerId = null;

					if (formContainerOptions && formContainerOptions.formOptions.configure) {

						if (!formContainerOptions.entity) {
							formContainerOptions.entity = {};
						}

						platformTranslateService.translateFormConfig(formContainerOptions.formOptions.configure);

						var unregisterWatches = _.map(formContainerOptions.formOptions.configure.groups, function watchMapFn(group, index) {
							return $scope.$watch('settings.formContainerOptions.formOptions.configure.groups[' + index + '].isOpen', function watchCb() {
								$timeout.cancel(resizeTimerId);
								resizeTimerId = $timeout(function resizeFn() {
									platformGridAPI.grids.resize($scope.settings.gridId);
								}, 360);
							});
						});

						$scope.$on('$destroy', function scopeDestroyFn() {
							_.over(unregisterWatches)();
						});
					}

				};

				$scope.processFormContainer();
			}

			function LookupCommonController($scope, options) {
				if (!options.dataView) {
					return;
				}

				var page = options.dataView.dataPage;

				$scope.pageUp = function () {
					if (page.number <= 0) {
						return;
					}
					page.number--;
					$scope.search($scope.searchValue || $scope.searchString, true);
				};

				$scope.canPageUp = function () {
					return page.number > 0;
				};

				$scope.getPageText = function () {
					var startIndex = page.number * page.size,
						endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));
					if ($scope.searchValueModified === undefined) {
						if (page.totalLength > 0) {
							return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
						}
						return '';
					}
					if ($scope.isLoading) {
						return $translate.instant('cloud.common.searchRunning');
					}
					if (page.currentLength === 0) {
						return $translate.instant('cloud.common.noSearchResult');
					}
					return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
				};

				$scope.pageDown = function () {
					if (page.count <= page.number) {
						return;
					}
					page.number++;
					$scope.search($scope.searchValue || $scope.searchString, true);
				};

				$scope.canPageDown = function () {
					return page.count > (page.number + 1);
				};

				$scope.enabledPaging = function () {
					return page.enabled;
				};
			}

			function create(config, $scope, options) {
				var controller = {
					disposed: false
				};

				controller.onDestroy = new PlatformMessenger();

				controller.destroy = function () {
					controller.disposed = true;
					controller.onDestroy.fire();
				};

				LookupCommonController.call(controller, $scope, options);

				if (config.dialog) {
					LookupDialogController.call(controller, $scope, options);
				}
				if (config.search) {
					LookupSearchController.call(controller, $scope, options);
				}
				if (config.grid) {
					LookupGridController.call(controller, $scope, options, config);
				}

				return controller;
			}
		}
	]);

})(angular);
