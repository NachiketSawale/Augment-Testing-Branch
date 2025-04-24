/*
 * $Id: grid-controller-service.js 634695 2021-04-29 10:42:05Z ong $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc controller
	 * @name platformGridControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing in a flat item list controller
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').factory('platformGridControllerService', platformGridControllerService);

	platformGridControllerService.$inject = ['$timeout', '$injector', '$rootScope', 'platformTranslateService', 'platformGridAPI', 'platformModuleStateService', 'platformContainerCreateDeleteButtonService', 'platformLayoutByDataService',
		'platformValidationByDataService', 'platformObjectHelper', 'platformDataServiceSelectionExtension', '_', 'reportingPrintService',
		'platformDragdropService', 'cloudDesktopPinningContextService', 'platformBulkEditorBaseService', 'platformNavBarService',
		'platformViewerFilteringSelectionButtonService', 'cloudDesktopDataLayoutSettingsService', 'platformStatusBarViewSettings', 'cloudDesktopPinningFilterService',
		'$log', 'cloudDesktopSidebarService', 'platformToolbarBtnService', 'platformContextMenuTypes', 'cloudDesktopHotKeyService'];

	/* jshint -W074 */ // try harder - J.S. Hint
	function platformGridControllerService($timeout, $injector, $rootScope, platformTranslateService, platformGridAPI,
		platformModuleStateService, platformContainerCreateDeleteButtonService, platformLayoutByDataService,
		platformValidationByDataService, platformObjectHelper, platformDataServiceSelectionExtension, _, reportingPrintService,
		platformDragdropService, cloudDesktopPinningContextService, bulkEditorBaseService, platformNavBarService,
		platformViewerFilteringSelectionButtonService, dataLayoutSettingsService, platformStatusBarViewSettings, cloudDesktopPinningFilterService,
		$log, cloudDesktopSidebarService, platformToolbarBtnService, platformContextMenuTypes, cloudDesktopHotKeyService) {

		let service = {};
		let itemOnDragEnd;
		let toolbarGridSettingsId = 't200';
		let toolbarCopyPasteOptionsId = 't199';
		let _suppressRefresh = false;

		$rootScope.$on('$stateChangeSuccess', function () {
			_suppressRefresh = false;
		});

		$rootScope.$on('navigateTo', function () {
			_suppressRefresh = true;
		});

		service.addValidationAutomatically = function addValidationAutomatically(columns, validationService) {
			if (!validationService) {
				return;
			}

			_.forEach(columns, function (col) {
				var colField = col.field.replace(/\./g, '$');

				var syncName = 'validate' + colField;
				var asyncName = 'asyncValidate' + colField;

				if (validationService[syncName]) {
					col.validator = validationService[syncName];
				}

				if (validationService[asyncName]) {
					col.asyncValidator = validationService[asyncName];
				}
			});
		};

		service.pushToGridSettingsMenu = function pushToGridSettingsMenu($scope, buttonconf, renameGridMenu) {
			let gridSettingsMenuButton = _.find($scope.tools.items, function (item) {
				return item.id === toolbarGridSettingsId;
			});
			if (renameGridMenu) {
				gridSettingsMenuButton.caption = renameGridMenu;
			}
			gridSettingsMenuButton.list.items.push(buttonconf);
		};

		service.initListController = function initListController($scope, uiStandardService, itemService, validationService, gridConfig) { // jshint ignore:line

			$rootScope.$on('refreshToolbar', function () {
				updateToolStatusBar();
			});

			$rootScope.$on('gridConfigurationAutoRefreshApplied', function () {
				let filterOptions = platformGridAPI.filters.getFilterOptions(scope.gridId);

				if (!filterOptions) {
					return;
				}
				searchColumnToggle.value = filterOptions.showFilterRow;
				searchAllToggle.value = filterOptions.showMainTopPanel;
			});

			// validation logic
			platformLayoutByDataService.registerLayout(uiStandardService, itemService);
			platformValidationByDataService.registerValidationService(validationService, itemService);
			var isDragDropAllowed = false;
			var gridDataAccess = gridConfig.gridDataAccess || 'gridData';
			var scope = $scope;
			var onBatchCopy;


			cloudDesktopHotKeyService.register('closeCheatSheet', function () {
				cancelCopyMode();
			});

			$rootScope.$on('getSelectedItems', function(e, gridId) {
				if(gridId === scope.gridId) {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					platformGridAPI.grouping.assignSelectedItems(grid, itemService.getSelectedEntities());
				}
			});
			// scope variables/ functions
			scope.path = globals.appBaseUrl;
			scope.error = {};

			function dragStateChanged(info) {
				if (!info.isDragging && info.action) {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					const gridInstance = grid ? grid.instance : null;
					if (gridInstance) {
						gridInstance.clearHighlightRows();
					} else {
						$log.warn(`Grid in container ${scope.gridId} unexpectedly not initialized.`);
					}
				}
			}

			if (angular.isFunction(scope.getContainerUUID)) {
				scope.ddTarget = new platformDragdropService.DragdropTarget(platformDragdropService.main, scope.getContainerUUID());
				scope.ddTarget.canDrop = function (info) {
					if (gridConfig.dragDropService && info.draggedData && info.draggedData.sourceGrid) {
						var grid = platformGridAPI.grids.element('id', scope.gridId).instance;

						var cell = grid.getCellFromEvent(info.event);
						if (cell) {
							itemOnDragEnd = grid.getDataItem(cell.row);
							grid.highlightRows([cell.row]);
						} else {
							itemOnDragEnd = undefined;
							grid.clearHighlightRows();
						}

						if (angular.isFunction(gridConfig.dragDropService.setCurrentMouseEvent)) {
							gridConfig.dragDropService.setCurrentMouseEvent(info.event);
						}

						if (angular.isFunction(gridConfig.dragDropService.doCanPaste)) {
							return gridConfig.dragDropService.doCanPaste({
								type: info.draggedData.sourceGrid.type,
								data: info.draggedData.sourceGrid.data,
								itemService: info.draggedData.sourceGrid.itemService,
								currentAction: info.currentAction
							}, gridConfig.type, itemOnDragEnd, itemService);
						} else {
							return gridConfig.dragDropService.canPaste(gridConfig.type, itemOnDragEnd, itemService);
						}
					} else {
						return false;
					}
				};
				scope.ddTarget.drop = function (info) {
					if (!info.draggedData && info.draggedData.sourceGrid) {
						return;
					}

					if (angular.isFunction(gridConfig.dragDropService.setCurrentMouseEvent)) {
						gridConfig.dragDropService.setCurrentMouseEvent(info.event);
					}

					if (gridConfig.dragDropService && !angular.isFunction(gridConfig.dragDropService.doPaste)) {
						if (info.action === platformDragdropService.actions.move) {
							info.draggedData.sourceGrid.cut();
						} else {
							info.draggedData.sourceGrid.copy();
						}
					}

					var grid = platformGridAPI.grids.element('id', scope.gridId).instance;
					var cell = grid.getCellFromEvent(info.event);

					if (cell) {
						itemOnDragEnd = grid.getDataItem(cell.row);
					} else {
						itemOnDragEnd = undefined;
					}

					if (angular.isDefined(gridConfig.dragDropService)) {
						if (angular.isFunction(gridConfig.dragDropService.doCanPaste)) {
							if (!gridConfig.dragDropService.doCanPaste({
								type: info.draggedData.sourceGrid.type,
								data: info.draggedData.sourceGrid.data,
								itemService: info.draggedData.sourceGrid.itemService,
								action: info.action
							}, gridConfig.type, itemOnDragEnd, itemService)) {
								itemOnDragEnd = undefined;
							}
						} else {
							if (!gridConfig.dragDropService.canPaste(gridConfig.type, itemOnDragEnd, itemService)) {
								itemOnDragEnd = undefined;
							}
						}
						if (angular.isFunction(gridConfig.dragDropService.doPaste)) {
							gridConfig.dragDropService.doPaste({
								type: info.draggedData.sourceGrid.type,
								data: info.draggedData.sourceGrid.data,
								itemService: info.draggedData.sourceGrid.itemService,
								action: info.action
							}, itemOnDragEnd, gridConfig.type, function (/* type */) {
							}, itemService);
						} else {
							gridConfig.dragDropService.paste(itemOnDragEnd, gridConfig.type, function (/* type */) {
							}, itemService);
						}
					}
				};

				platformDragdropService.registerDragStateChanged(dragStateChanged);

				var unregisterUpdateEvent = $rootScope.$on('dataservice:update-done', function (event, info) {
					if (info.containers.includes(scope.getContainerUUID())) {
						let grid = platformGridAPI.grids.element('id', scope.gridId);
						let inEditMode = grid.instance.isEditMode();
						let editor = null;
						let currentInput = null;
						if (inEditMode) {
							editor = grid.instance.getCellEditor();
							currentInput = editor.getValue ? editor.getValue() : null;
						}
						platformGridAPI.items.invalidate(scope.gridId, info.items);
						let buttons = {disableCreate: false, disableDelete: false, disableCreateSub: false};
						updateButtons(buttons);

						if (editor) {
							if (currentInput) {
								grid.instance.editActiveCell();
								editor = grid.instance.getCellEditor();
								if (editor && editor.setValue) {
									editor.setValue(currentInput);
								}
							}
						}
					}
				});

				const unregisterBeforeFocusChangedEvent = $rootScope.$on('beforeContainerFocusChange', function(args, container) {
					cancelCopyMode();

					if(_.isFunction(itemService.saveRecentChanges) && scope.gridId === container.containerId) {
						itemService.saveRecentChangesIfResponsibleServiceChanges(container.newContainerId);
					}


					if(grid.options.tree && scope && scope.$parent) {
						if(!scope.$parent.hasFocus) {
							cloudDesktopHotKeyService.unregisterToolbar(grid.options.treeToolbarItems);
						}
					}
				});

				const unregisterFocusChangedEvent = $rootScope.$on('containerFocusChanged', function() {
					if(grid.options.tree && scope && scope.$parent) {
						if(scope.$parent.hasFocus) {
							cloudDesktopHotKeyService.registerToolbar(grid.options.treeToolbarItems);
						}
						else {
							cloudDesktopHotKeyService.unregisterToolbar(grid.options.treeToolbarItems);
						}
					}
				});

				scope.$on('$destroy', function () {
					cancelCopyMode();
					platformDragdropService.unregisterDragStateChanged(dragStateChanged);
					unregisterUpdateEvent();
					unregisterFocusChangedEvent();
					unregisterBeforeFocusChangedEvent();
				});
			}

			gridConfig.enableConfigSave = gridConfig.enableConfigSave === false ? gridConfig.enableConfigSave : true;

			var createDeleteBtnConfig = {};
			scope.containerButtonConfig = createDeleteBtnConfig;

			// grid's id === container's uuid
			if (angular.isUndefined(scope.gridId)) {
				scope.gridId = scope.getContainerUUID();
			}
			scope.selectedEntityID = -1;
			scope.selectedEntityIDs = [];

			var settings = uiStandardService.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			if (settings.addValidationAutomatically) {
				service.addValidationAutomatically(settings.columns, validationService);
			}

			var useTree = (angular.isDefined(gridConfig.parentProp) && angular.isDefined(gridConfig.childProp));
			var idProperty = angular.isDefined(gridConfig.idProperty) ? gridConfig.idProperty : 'Id';

			if (!useTree && _.isUndefined(gridConfig.grouping)) {
				gridConfig.grouping = true;
			}

			if (angular.isDefined(gridConfig.dragDropService)) {
				isDragDropAllowed = true;
			}

			function provideGridConfig() {
				if (_.isFunction(uiStandardService.getDtoScheme)) {
					let scheme = uiStandardService.getDtoScheme();
					_.forEach(settings.columns, function(column) {
						if(Object.prototype.hasOwnProperty.call(scheme, column.field)) {
							column.isHtmlFormatted = scheme[column.field].isHtmlFormatted ? scheme[column.field].isHtmlFormatted : false;
						}
					});
				}

				var grid = {
					columns: angular.copy(settings.columns),
					data: [],
					id: scope.gridId,
					options: {
						tree: useTree,
						indicator: true,
						idProperty: idProperty,
						iconClass: '',
						enableDraggableGroupBy: useTree ? null : gridConfig.grouping,
						enableConfigSave: gridConfig.enableConfigSave !== false,
						skipPermissionCheck: gridConfig.skipPermissionCheck || false,
						showMainTopPanel: gridConfig.showMainTopPanel,
						saveSearch: gridConfig.saveSearch,
						dragDropAllowed: isDragDropAllowed,
						defaultSortColumn: gridConfig.defaultSortColumn,
						defaultSortComparer: gridConfig.defaultSortComparer,
						treeColumnDescription: gridConfig.treeColumnDescription,
						treeHeaderCaption: gridConfig.treeHeaderCaption,
						enableSkeletonLoading: gridConfig.enableSkeletonLoading,
						autoHeight: gridConfig.autoHeight,
						enableColumnSort: true
					}
				};

				if (gridConfig.passThrough) {
					_.assign(grid.options, gridConfig.passThrough);
				}

				if (gridConfig.gridDataPath) {
					grid.gridDataPath = 'moduleState.' + gridConfig.gridDataPath;
				}

				if (gridConfig.iconClass) {
					grid.options.iconClass = gridConfig.iconClass;
				}
				if (angular.isDefined(gridConfig.enableColumnReorder)) {
					grid.options.enableColumnReorder = gridConfig.enableColumnReorder;
				}
				if (angular.isDefined(gridConfig.enableCopyPasteExcel)) {
					grid.options.enableCopyPasteExcel = gridConfig.enableCopyPasteExcel;
				} else {
					gridConfig.enableCopyPasteExcel = true;
				}

				if (gridConfig.isStaticGrid) {
					grid.isStaticGrid = true;
				}

				if (gridConfig.enableModuleConfig) {
					grid.options.enableModuleConfig = true;
				}

				if (gridConfig.propagateCheckboxSelection) {
					grid.options.propagateCheckboxSelection = true;
				}

				if (useTree) {
					grid.options.parentProp = gridConfig.parentProp;
					grid.options.childProp = gridConfig.childProp;
					grid.options.treeWidth = gridConfig.treeWidth || 150;
					grid.options.collapsed = true;
				}

				if (gridConfig.marker) {
					grid.options.marker = gridConfig.marker;
				}

				if (angular.isDefined(gridConfig.enableColumnSort)) {
					grid.options.enableColumnSort = gridConfig.enableColumnSort;
				}

				return grid;
			}

			scope[gridDataAccess] = {
				state: scope.gridId,
				config: provideGridConfig(),
				moduleState: {}
			};

			if (itemService.getModule) {
				scope[gridDataAccess].moduleState = platformModuleStateService.state(itemService.getModule());
			}

			if (!platformGridAPI.grids.exist(scope.gridId)) {
				var grid = provideGridConfig();// ToDo: Old version - 2BRemoved when init via scope works

				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.configuration.refresh(scope.gridId, true);

			function cancelCopyMode() {
				if($scope.inCopyMode) {
					$scope.getUiAddOns().enableToolbar();
					platformGridAPI.grids.setAllowCopySelection(scope.gridId, false);
					$scope.inCopyMode = false;
					if($scope.tools) {
						$scope.tools.update();
					}
				}
			}

			function updateButtons(buttons, forceRefresh = false) {
				if(!$scope.inCopyMode && !scope.toolbarDisabled) {
					if (forceRefresh || platformContainerCreateDeleteButtonService.toggleButtonUsingContainerState(createDeleteBtnConfig, itemService, buttons) ||
						_.isFunction(itemService.getWatchListOptions) || /* force digest cycle as well if addToWatchlist is active */
						_.isFunction(itemService.getPinningOptions) /* force digest cycle as well if pinningOptions is active */
					) {
						doToolbarRefresh();

						// Only the grid events call the updateButtons function. This events are out of the
						// digest cycle of angular. Therefor we have to start an new digest.
						$timeout(function () {
							scope.$apply();
						});
					}
				}
				if ((itemService.isRoot && _.isUndefined(gridConfig.isRoot)) || (!_.isUndefined(gridConfig.isRoot) && gridConfig.isRoot)) {
					const reloadSelectionBtn = platformNavBarService.getActionByKey('refreshSelection');
					if (reloadSelectionBtn) {
						if(itemService.getSelected()) {
							reloadSelectionBtn.disabled = false;
						}
						else {
							reloadSelectionBtn.disabled = true;
						}
					}
				}
			}

			function onMarkerSelectionChangedHandler (e, arg) {
				dataService.markersChanged(arg.items);
				scope.tools.update();
			}

			function onCellModified(e, arg) {
				var buttons = {disableCreate: false, disableDelete: false, disableCreateSub: false};
				if (gridConfig.cellChangeCallBack) {
					gridConfig.cellChangeCallBack(arg, buttons);
				}

				updateButtons(buttons);

				var isTransient = _.get(arg.grid.getColumns()[arg.cell], 'isTransient');

				if (itemService.markItemAsModified && !isTransient) {
					itemService.markItemAsModified(arg.item);
				}
			}

			scope.createItemOnEnter = function createItemOnEnter() {
				if (itemService.canCreate() && itemService.canAutoCreateRow()) {
					itemService.createItem();
				}
			};

			/* jshint -W098 */ // First parameter ignored, but necessary to name the second.
			function onSelectedRowsChanged(e, arg) {
				var selectedEntities = platformGridAPI.rows.selection({
					gridId: scope.gridId,
					wantsArray: true
				});
				if (_.isEmpty(selectedEntities)) {
					if (typeof itemService.deselect === 'function') {
						itemService.deselect();
					}
				}

				function reactOnSetSelected() {
					var buttons = {disableCreate: false, disableDelete: false, disableCreateSub: false};
					if (gridConfig.rowChangeCallBack) {
						gridConfig.rowChangeCallBack(arg, buttons);
					}
					updateButtons(buttons, arg.previousRows.length === 0 ? true : false);
				}

				selectedEntities = _.filter(selectedEntities, function (candidate) {
					return candidate && !candidate.__group;
				});

				if (_.isEmpty(selectedEntities)) {
					return;
				}

				//Fix for defect 133722 - Main Item - Multi Selection shows confusing Sub Item Data
				let rows = platformGridAPI.rows.getRows(scope.gridId);
				var selected = rows ? rows[arg.rows.slice(-1)] : null;

				if (selectedEntities.length === 1 && (!selected && scope.selectedEntityID !== -1) || (selected && scope.selectedEntityID !== selected.Id)) {
					// Special handling of NonDataRow (internally used in grid | grouping) -> set empty entity
					if (selected && selected.__nonDataRow) {
						var oldSel = scope.getSelectedItem();
						if (oldSel) {
							platformGridAPI.rows.scrollIntoViewByItem(scope.gridId, selected);
						}
						selected = oldSel;
					}
					scope.selectedEntityID = (selected) ? selected.Id : -1;
					if(selected) {
						scope.selectedEntityIDs.push(selected.Id);
					}
					var item = itemService.setSelected(selected, selectedEntities);

					if (item && platformObjectHelper.isPromise(item)) {
						item.then(function () {
							if(!scope.toolbarDisabled) {
								reactOnSetSelected();
							}
						});
					}
				} else {
					itemService.setSelectedEntities && itemService.setSelectedEntities(selectedEntities); // jshint ignore:line
				}
			}

			function onDragStart(e, arg) {
				if ($scope.inCopyMode) {
					return;
				}

				if (gridConfig.dragDropService.canDrag && !gridConfig.dragDropService.canDrag(gridConfig.type)) {
					return;
				}

				var grid = arg.grid;
				var cell = grid.getCellFromEvent(e);

				if (!cell) {
					return;
				}

				var item = grid.getDataItem(cell.row);

				if (!item) {
					return;
				}

				// check if row at mouse position is selected, if not current row is selected (single row)
				if (_.indexOf(grid.getSelectedRows(), cell.row) === -1) {
					grid.setSelectedRows([cell.row]);
					grid.gotoCell(cell.row, 0, false);
				}

				if (Slick.GlobalEditorLock.isActive()) {
					return;
				}

				// keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree.
				e.stopImmediatePropagation();

				function prepareItems() {
					var items = [];
					var selectedRows = arg.grid.getSelectedRows();
					for (var i = 0; i < selectedRows.length; i++) {
						items.push(arg.grid.getDataItem(selectedRows[i]));
					}
					return items;
				}

				if (platformDragdropService.isOnTarget()) {
					var items = prepareItems();
					if (!angular.isFunction(gridConfig.dragDropService.doPaste)) {
						gridConfig.dragDropService.copy(items, gridConfig.type, itemService);
					}
					var draggedData = {
						sourceGrid: {
							instance: arg.grid,
							cut: function () {
								gridConfig.dragDropService.setClipboardMode(true);
							},
							copy: function () {
								gridConfig.dragDropService.setClipboardMode(false);
							},
							data: items,
							type: gridConfig.type,
							itemService: itemService
						}
					};
					if (angular.isFunction(gridConfig.extendDraggedData)) {
						gridConfig.extendDraggedData(draggedData);
					}
					platformDragdropService.startDrag(draggedData, gridConfig.allowedDragActions, gridConfig.dragDataTextKey ? {
						text: gridConfig.dragDataTextKey,
						count: items.length
					} : items.length);
				}
			}

			function onDragEnd(e, arg) {
				var grid = arg.grid;
				if (grid) {
					grid.clearHighlightRows();
				}
			}

			function onCellEditable(e, arg) {
				if (gridConfig.cellEditableCallBack) {
					return gridConfig.cellEditableCallBack(arg);
				}
			}

			platformGridAPI.events.register(scope.gridId, 'onCellChange', onCellModified);
			platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register(scope.gridId, 'onGroupingChanged', onGroupingChanged);
			platformGridAPI.events.register(scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
			platformGridAPI.events.register(scope.gridId, 'onItemCountChanged', onItemCountChangedHandler);
			platformGridAPI.events.register(scope.gridId, 'onCopyComplete', onCopyCompleteHandler);
			platformGridAPI.events.register(scope.gridId, 'onPasteComplete', onPasteCompleteHandler);
			platformGridAPI.events.register(scope.gridId, 'onTreeLevelChanged', onTreeLevelChangedHandler);
			platformGridAPI.events.register(scope.gridId, 'onMarkerSelectionChanged', onMarkerSelectionChangedHandler);
			platformGridAPI.events.register(scope.gridId, 'onHeaderCellRendered', onHeaderCellRenderedHandler);
			platformGridAPI.events.register(scope.gridId, 'onInitialized', onInitializedHandler);

			if (useTree) {
				platformGridAPI.events.register(scope.gridId, 'onHeaderClick', onHeaderClickHandler);
			}

			cloudDesktopPinningFilterService.onSetPinningFilter.register(onSetPinningFilter);

			cloudDesktopSidebarService.filterChanged.register(onFilterChanged);

			if (isDragDropAllowed) {
				platformGridAPI.events.register(scope.gridId, 'onDragStart', onDragStart);
				platformGridAPI.events.register(scope.gridId, 'onDragEnd', onDragEnd);
			}

			if (itemService.createItem && (!itemService.canAutoCreateRow || itemService.canAutoCreateRow())) {
				platformGridAPI.events.register(scope.gridId, 'onAddNewRow', scope.createItemOnEnter);
			}

			if (_.isFunction(scope.onContentResized)) {
				scope.onContentResized(function () {
					platformGridAPI.grids.resize(scope.gridId);
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					if(grid && grid.instance) {
						grid.instance.afterResize();
					}
				});
			}

			scope.toggleFilter = function (active, clearFilter) {
				platformGridAPI.filters.showSearch(scope.gridId, active, clearFilter);
			};

			scope.toggleColumnFilter = function (active, clearFilter) {
				platformGridAPI.filters.showColumnSearch(scope.gridId, active, clearFilter);
			};

			scope.toggleGroupPanel = function (active) {
				platformGridAPI.grouping.toggleGroupPanel(scope.gridId, active);
			};

			if (gridConfig.cellEditableCallBack) {
				platformGridAPI.events.register(scope.gridId, 'onBeforeEditCell', onCellEditable);
			}

			var settingsDropdownItems = [
				{
					id: 't111',
					sort: 112,
					caption: 'cloud.common.gridlayout',
					permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0#e',
					type: 'item',
					fn: function () {
						platformGridAPI.configuration.openConfigDialog(scope.gridId);
					},
					disabled: function () {
						return scope.showInfoOverlay || gridConfig.disableConfig;
					}
				},
				{
					id: 'autofitTableWidth',
					sort: 300,
					caption: 'cloud.common.autofitTableWidth',
					type: 'item',
					fn: function () {
						platformGridAPI.columns.autofitColumnsToContent(scope.gridId);
					}
				},
				{
					id: 'settingsDivider',
					sort: 400,
					type: 'divider'
				},
				{
					id: 't155',
					sort: 200,
					caption: 'cloud.common.showStatusbar',
					type: 'check',
					value: true,
					fn: function (id, btn) {
						var uiMgr, sb;
						if (_.isFunction(scope.getUiAddOns)) {
							uiMgr = scope.getUiAddOns();
							if (uiMgr) {
								sb = uiMgr.getStatusBar();

								if (sb) {
									sb.setVisible(btn.value);
									platformGridAPI.status.saveStatusBarState(scope.gridId, btn.value);
								}
							}
						}
					}
				}
			];

			var copyPasteDropdownItems = [
				{
					id: 'exportCopy',
					sort: 200,
					caption: 'cloud.common.exportCopy',
					tooltip: 'cloud.common.exportCopyTooltip',
					type: 'item',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					fn: function () {
						platformGridAPI.grids.copySelection(scope.gridId);
					}
				},
				{
					id: 'copyCellRange',
					sort: 100,
					type: 'item',
					caption: 'cloud.common.exportArea',
					tooltip: 'cloud.common.exportAreaTooltip',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					fn: function () {
						if(platformGridAPI.grids.setAllowCopySelection(scope.gridId, true)) {
							$scope.getUiAddOns().disableToolbar(null);
							$scope.inCopyMode = true;
						}
					}
				},
				{
					id: 'exportPaste',
					sort: 300,
					caption: 'cloud.common.exportPaste',
					tooltip: 'cloud.common.exportPasteTooltip',
					type: 'item',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					fn: function () {
						platformGridAPI.grids.pasteSelection(scope.gridId);
					}
				},
				{
					id: 'dCopyPaste',
					sort: 400,
					type: 'divider'
				},
				{
					id: 't400',
					sort: 500,
					caption: 'cloud.common.exportWithHeader',
					tooltip: 'cloud.common.exportWithHeaderTooltip',
					type: 'check',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					fn: function () {
						platformGridAPI.grids.setCopyWithHeader(scope.gridId, this.value);
					}
				}
			];

			dataLayoutSettingsService.getSettings().then(function (result) {
				let doRefresh = false;
				var button = {
					id: 't255',
					sort: 200,
					caption$tr$: 'cloud.common.markReadonlyCells',
					type: 'check',
					value: true,
					fn: function () {
						platformGridAPI.grids.markReadOnly(scope.gridId, this.value);
					}
				};

				// Retrieve markReadOnly button saved value
				button.value = platformGridAPI.grids.getMarkReadonly(scope.gridId);

				if (result.gridDisplayReadOnly !== 0) {
					settingsDropdownItems.push(button);
					doRefresh = true;
				}

				if(platformGridAPI.grids.getOptions(scope.gridId).tree) {

					var hierarchicalHorizontalFormattingButton = {
						id: 't256',
						sort: 200,
						caption$tr$: 'platform.grid.showHorizontalLevelFormatting',
						type: 'check',
						fn: function () {
							platformGridAPI.grids.setHorizontalLevelFormat(scope.gridId, this.value);
							platformGridAPI.grids.onColumnStateChanged(scope.gridId);
						}
					};

					var hierarchicalVerticalFormattingButton = {
						id: 't257',
						sort: 200,
						caption$tr$: 'platform.grid.showVerticalLevelFormatting',
						type: 'check',
						fn: function () {
							platformGridAPI.grids.setVerticalLevelFormat(scope.gridId, this.value);
							platformGridAPI.grids.onColumnStateChanged(scope.gridId);
						}
					};

					const showHierarchicalFormattingButtons = grid.options.enableHierarchicalCustomFeatures;
					if (showHierarchicalFormattingButtons) {
						hierarchicalHorizontalFormattingButton.value = grid.options.showHLevelFormatting;
						platformGridAPI.grids.setHorizontalLevelFormat(scope.gridId, grid.options.showHLevelFormatting);
						hierarchicalVerticalFormattingButton.value = grid.options.showVLevelFormatting;
						platformGridAPI.grids.setVerticalLevelFormat(scope.gridId, grid.options.showVLevelFormatting);
						settingsDropdownItems.splice(3, 0, hierarchicalVerticalFormattingButton);
						settingsDropdownItems.splice(3, 0, hierarchicalHorizontalFormattingButton);
						doRefresh = true;
					}
				}

				if(doRefresh) {
					doToolbarRefresh();
				}
			});

			// Define standard toolbar Icons and their function on the scope
			var toolbarItems = [
				{
					id: 't108',
					sort: 108,
					caption: 'cloud.common.print',
					iconClass: 'tlb-icons ico-print-preview',
					type: 'item',
					fn: function () {
						reportingPrintService.printGrid(scope.gridId);
					},
					disabled: function () {
						return scope.showInfoOverlay;
					}
				},
				{
					id: toolbarGridSettingsId,
					caption: 'cloud.common.gridSettings',
					disabled: false,
					sort: 200,
					type: 'dropdown-btn',
					icoClass: 'tlb-icons ico-settings',
					cssClass: 'tlb-icons ico-settings',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: settingsDropdownItems
					}
				}
			];

			var searchColumnToggle;

			var searchAllToggle = {
				id: 'gridSearchAll',
				sort: 150,
				caption: 'cloud.common.taskBarSearch',
				type: 'check',
				iconClass: 'tlb-icons ico-search-all',
				fn: function () {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					searchAllToggle.value = !grid.instance.getOptions().showMainTopPanel;
					scope.toggleFilter(searchAllToggle.value);

					if (platformGridAPI.grids.renderHeaderRow(scope.gridId)) {
						if (searchAllToggle.value && searchColumnToggle.value) {
							searchColumnToggle.value = false;
							scope.toggleColumnFilter(false, true);
						}
					}

					let targetBtn = document.getElementById(scope.gridId).getElementsByClassName('ico-search-all')[0];
					if (targetBtn) {
						searchAllToggle.value ? targetBtn.addClass('active') : targetBtn.removeClass('active');
					}
					doToolbarRefresh();
				},
				disabled: function () {
					return scope.showInfoOverlay;
				}
			};

			searchColumnToggle = {
				id: 'gridSearchColumn',
				sort: 160,
				caption: 'cloud.common.taskBarColumnFilter',
				type: 'check',
				iconClass: 'tlb-icons ico-search-column',
				fn: function () {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					searchColumnToggle.value = !grid.instance.getOptions().showFilterRow;
					scope.toggleColumnFilter(searchColumnToggle.value);

					if (searchColumnToggle.value && searchAllToggle.value) {
						searchAllToggle.value = false;
						scope.toggleFilter(false, true);
					}

					let targetBtn = document.getElementById(scope.gridId).getElementsByClassName('ico-search-column')[0];
					if (targetBtn) {
						searchColumnToggle.value ? targetBtn.addClass('active') : targetBtn.removeClass('active');
					}
					doToolbarRefresh();
				},
				disabled: function () {
					return scope.showInfoOverlay;
				}
			};

			if (gridConfig.enableCopyPasteExcel) {
				toolbarItems.push({
					id: toolbarCopyPasteOptionsId,
					caption: 'cloud.common.exportClipboard',
					sort: 199,
					type: 'dropdown-btn',
					disabled: false,
					icoClass: 'tlb-icons ico-clipboard',
					cssClass: 'tlb-icons ico-clipboard',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: copyPasteDropdownItems
					}
				});
			}

			toolbarItems.push(searchAllToggle);
			if (angular.isUndefined(_.get(scope, 'gridData.config.options.renderHeaderRow'))) {
				toolbarItems.push(searchColumnToggle);
			}

			scope.$watch('showInfoOverlay', function () {
				if (scope.tools) {
					scope.tools.update();
				}
			});

			createDeleteBtnConfig.isTree = angular.isDefined(gridConfig.parentProp) && angular.isDefined(gridConfig.childProp);
			platformContainerCreateDeleteButtonService.provideButtons(createDeleteBtnConfig, itemService);

			if (createDeleteBtnConfig.deleteBtnConfig) {
				toolbarItems.push(createDeleteBtnConfig.deleteBtnConfig);
			}
			if (createDeleteBtnConfig.createBtnConfig) {
				toolbarItems.push(createDeleteBtnConfig.createBtnConfig);
			}

			var treeActionBtn = [
				{
					id: 'd1',
					sort: 55,
					type: 'divider'
				}, {
					id: 'collapsenode',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						if (gridConfig.collapseSelected) {
							gridConfig.collapseSelected();
						} else {
							platformGridAPI.grouping.collapseGroup(scope.gridId);
						}
					}
				},
				{
					id: 'expandnode',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						if (gridConfig.expandSelected) {
							gridConfig.expandSelected();
						} else {
							platformGridAPI.grouping.expandGroup(scope.gridId);
						}
					}
				},
				{
					id: 'collapseall',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						if (gridConfig.collapseAll) {
							gridConfig.collapseAll();
						} else {
							platformGridAPI.grouping.collapseAllGroups(scope.gridId);
						}
					}
				},
				{
					id: 'expandall',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						if (gridConfig.expandAll) {
							gridConfig.expandAll();
						} else {
							platformGridAPI.grouping.expandAllGroups(scope.gridId);
						}
					}
				},
				{
					id: 'd2',
					sort: 100,
					type: 'divider'
				}
			];

			if (gridConfig.grouping) {
				var groupingToggle = {
					id: 't12',
					sort: 10,
					caption: 'cloud.common.taskBarGrouping',
					type: 'check',
					iconClass: 'tlb-icons ico-group-columns',
					fn: function () {
						scope.toggleGroupPanel(this.value);
					},
					value: platformGridAPI.grouping.toggleGroupPanel(scope.gridId),
					disabled: function () {
						return scope.showInfoOverlay;
					}
				};

				toolbarItems.push(groupingToggle);
			}

			function onGroupingPanelToggled(e, arg) {
				if (arg.grouppanel) {
					platformGridAPI.events.unregister(arg.grid.id, 'onHeaderToggled', onGroupingPanelToggled);
					groupingToggle.value = true;
				}
				onGroupingChanged();
			}

			function onGroupingChanged() {
				if (scope && scope.gridId) {
					var grid = platformGridAPI.grids.element('id', scope.gridId);
					var groups = grid.dataView.getGrouping();

					if (groups.length > 0) {
						addTools(treeActionBtn);
					} else {
						if (!grid.options.tree) {
							var itemsToRemove = ['tlb-icons ico-tree-collapse', 'tlb-icons ico-tree-expand', 'tlb-icons ico-tree-collapse-all', 'tlb-icons ico-tree-expand-all'];

							scope.removeToolByClass(itemsToRemove);
						}
					}
				}
			}

			var createFilteringSelectionBtnConfig = {
				updateTools: function () {
					scope.tools.update();
				}
			};
			platformViewerFilteringSelectionButtonService.provideButtons(createFilteringSelectionBtnConfig, itemService);
			if (_.isFunction(createFilteringSelectionBtnConfig.finalizeButton)) {
				scope.$on('$destroy', function () {
					createFilteringSelectionBtnConfig.finalizeButton();
				});
			}

			if (createFilteringSelectionBtnConfig.toggleFilteringSelectionBtn) {
				toolbarItems.push(createFilteringSelectionBtnConfig.toggleFilteringSelectionBtn);
			}

			let treeGridBtn = null;
			let treeGridMenuItems = null;

			if (createDeleteBtnConfig.isTree) {
				treeGridBtn = platformToolbarBtnService.addToolbarItemsForTreeLevelGrid(scope);
				scope.treeOptions = {
					parentProp: gridConfig.parentProp,
					childProp: gridConfig.childProp,
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				};

				// add hierarchyCtrl specific items
				if (createDeleteBtnConfig.createChildBtnConfig) {
					toolbarItems.push(createDeleteBtnConfig.createChildBtnConfig);
				}
				if (createDeleteBtnConfig.createShallowCopyBtnConfig || createDeleteBtnConfig.createDeepCopyBtnConfig) {
					toolbarItems.push(
						{
							id: 'd1',
							sort: 50,
							type: 'divider'
						}
					);

					if (createDeleteBtnConfig.createShallowCopyBtnConfig) {
						toolbarItems.push(createDeleteBtnConfig.createShallowCopyBtnConfig);
					}
					if (createDeleteBtnConfig.createDeepCopyBtnConfig) {
						toolbarItems.push(createDeleteBtnConfig.createDeepCopyBtnConfig);
					}

				}
				toolbarItems.push(
					{
						id: 'd1',
						sort: 55,
						type: 'divider',
						contextAreas: [platformContextMenuTypes.gridRow.type],
						contextGroup: 4
					}
				);

				treeGridMenuItems = [
					{
						id: 'expandnode',
						sort: 60,
						caption: 'cloud.common.toolbarExpandSelected',
						type: 'item',
						shortCut: cloudDesktopHotKeyService.getTooltip('expandnode'),
						fn: function expandSelected() {
							if (gridConfig.expandSelected) {
								gridConfig.expandSelected();
							} else {
								platformGridAPI.rows.expandNextNode(scope.gridId);
							}
						},
						contextAreas: [platformContextMenuTypes.gridRow.type],
						contextGroup: 5
					},
					{
						id: 'collapsenode',
						sort: 70,
						caption: 'cloud.common.toolbarCollapseSelected',
						type: 'item',
						isDisplayed: false,
						shortCut: cloudDesktopHotKeyService.getTooltip('collapsenode'),
						fn: function collapseSelected() {
							if (gridConfig.collapseSelected) {
								gridConfig.collapseSelected();
							} else {
								platformGridAPI.rows.collapseNextNode(scope.gridId);
							}
						},
						contextAreas: [platformContextMenuTypes.gridRow.type],
						contextGroup: 5
					},
					{
						id: 'expandcollapsenode',
						caption: 'cloud.common.toolbarExpandCollapseToLevel',
						type: 'item',
						shortCut: '',
						cssClass: 'horizontal-list-item',
						contextAreas: [platformContextMenuTypes.gridRow.type],
						contextGroup: 5
					},
					treeGridBtn];
				grid.options.treeToolbarItems = treeGridMenuItems;
			} else if (createDeleteBtnConfig.createShallowCopyBtnConfig || createDeleteBtnConfig.createDeepCopyBtnConfig) {
				toolbarItems.push(
					{
						id: 'd1',
						sort: 50,
						type: 'divider'
					}
				);

				if (createDeleteBtnConfig.createShallowCopyBtnConfig) {
					toolbarItems.push(createDeleteBtnConfig.createShallowCopyBtnConfig);
				}
				if (createDeleteBtnConfig.createDeepCopyBtnConfig) {
					toolbarItems.push(createDeleteBtnConfig.createDeepCopyBtnConfig);
				}
			}

			function onInitializedHandler(e, arg) {
				if(useTree) {
					let node;
					let headerLeft = arg.grid.getHeaderLeft();
					if (headerLeft.length > 0) {
						for (let i = 0; i < headerLeft[0].children.length; i += 1) {
							if (headerLeft[0].children[i].id.endsWith('tree')) {
								node = headerLeft[0].children[i];
								break;
							}
						}
					}

					if(node) {
						let toggleBtn = '<button class="control-icons tree-toggle toggle ico-tree-collapse ui-structure-menu" style="height: '+ arg.grid.getOptions().rowHeight + 'px; margin-top: -4px;"></button>';
						$(node).css('display', 'flex');
						$(node).prepend(toggleBtn);
					}
				}

				if (cloudDesktopSidebarService.filterInfo.isPending) {
					refreshRequested();
				}
			}

			function onHeaderCellRenderedHandler(e, arg) {
				if (useTree && arg && arg.column.field === 'tree') {
					if(arg.node) {
						let toggleBtn = '<button class="control-icons tree-toggle toggle ico-tree-collapse ui-structure-menu" style="height: '+ arg.grid.getOptions().rowHeight + 'px; margin-top: -4px;"></button>';
						$(arg.node).css('display', 'flex');
						$(arg.node).prepend(toggleBtn);
					}
				}
			}

			function onHeaderClickHandler(e) {
				if (e.target.classList.contains('tree-toggle')) {
					let focusElement;

					if(e.pageX && e.pageY) {
						focusElement = $(document.elementFromPoint(e.pageX, e.pageY));

						let treeHeaderMenuItems = treeGridMenuItems;

						treeHeaderMenuItems.forEach((el) => {
							let btn = '<button id="##itemId##" type="button" ##disabled## class="ui-' + el.id + ' context-menu-item" ##autofocus## title="##tooltip##" ' +
								' data-ng-click="##fn##" data-ng-keydown="keydownFn($event)" ##currentButtonId## ##attr## ##model##>' +
								'  <span class="##indClass##">##title##</span><small class="sub-title text-right">' + el.shortCut + '</small>  ##subico##</button>';

							el.buttonTemplate = btn;
						});

						scope.treeHeaderMenuItems = {
							showImages: false,
							showTitles: true,
							cssClass: 'context-items',
							items: treeGridMenuItems
						};

						$injector.get('basicsLookupdataPopupService').toggleLevelPopup({
							multiPopup: false,
							plainMode: true,
							hasDefaultWidth: false,
							scope: scope,
							focusedElement: focusElement,
							template: '<div class="popup-content" list-items-selector="\'.context-items\'"><div data-platform-menu-list data-list="treeHeaderMenuItems" data-init-once data-popup ></div></div>'
						});
					}
				}
			}

			// Two functions to control the create buttons provided for later optimisation
			function onClearPinningContext() {
				if (platformContainerCreateDeleteButtonService.toggleButtons(createDeleteBtnConfig, itemService)) {
					if (scope.tools) {
						scope.tools.update();
					}
				}
			}

			function onSetPinningContext() {
				if (platformContainerCreateDeleteButtonService.toggleButtons(createDeleteBtnConfig, itemService)) {
					if (scope.tools) {
						scope.tools.update();
					}
				}
			}

			if (gridConfig.pinningContext) {
				// register pinnnig context specification service messenger
				cloudDesktopPinningContextService.onClearPinningContext.register(onClearPinningContext);
				cloudDesktopPinningContextService.onSetPinningContext.register(onSetPinningContext);
			}

			// marker column feature
			if (gridConfig.marker) {
				var filterId = gridConfig.marker.filterId,
					filterService = gridConfig.marker.filterService,
					dataService = gridConfig.marker.dataService;

				if (filterId && filterService && dataService &&
					_.isFunction(filterService.isFilter) && _.isFunction(filterService.removeFilter) &&
					_.isFunction(dataService.getList) && _.isFunction(dataService.gridRefresh) && _.isFunction(dataService.markersChanged)) {

					// add multiselect state handling
					if (angular.isUndefined(dataService._markerMultiselectState)) {
						dataService._markerMultiselectState = false;
					}
					gridConfig.marker.multiSelect = dataService._markerMultiselectState;
					scope.$on('$destroy', function () {
						if (scope.tools) {
							let item = _.find(scope.tools.items, {iconClass: 'tlb-icons ico-selection-multi'});
							dataService._markerMultiselectState = item ? item.value : dataService._markerMultiselectState;
						}
					});

					var removeMarkers = function (markers2Remove) {
						let singleItem;
						let removeFilter = true;
						if(_.size(markers2Remove) === 1)
						{
							singleItem = markers2Remove[0];
						}
						_.each(dataService.getList(), function (item) {
							if(singleItem && singleItem[idProperty] === item[idProperty]) {
								item.isMarked = true;
								removeFilter = false;
							} else {
								item.IsMarked = singleItem && item.IsMarked === null ? null : false;
							}
						});

						dataService.gridRefresh();
						if (removeFilter) {
							filterService.removeFilter(filterId);
						}
						scope.tools.update();
					};

					if (_.isFunction(gridConfig.cellChangeCallBack)) {
						var callback = gridConfig.cellChangeCallBack;
						gridConfig.cellChangeCallBack = function (arg) {
							callback(arg);
						};
					}

					toolbarItems.push({
						id: 't11',
						sort: 110,
						caption: 'cloud.common.toolbarFilter',
						type: 'item',
						iconClass: 'tlb-icons ico-filter-off',
						disabled: function () {
							return !filterService.isFilter(filterId);
						},
						fn: function filterOff() {
							removeMarkers(dataService.getList());
						}
					});
					toolbarItems.push({
						id: 't12',
						sort: 120,
						caption: 'cloud.common.toolbarSelectionMode',
						type: 'check',
						value: !!gridConfig.marker.multiSelect,
						iconClass: 'tlb-icons ico-selection-multi',
						fn: function toogleSelectionMode() {
							if (platformGridAPI.grids.exist(scope.gridId)) {
								// get marker/filter column def ...
								var cols = platformGridAPI.columns.configuration(scope.gridId);
								var filterCol = _.find(cols.current, {id: 'marker'});
								if (filterCol && filterCol.editorOptions) {
									// ... switch multiselect and save
									filterCol.editorOptions.multiSelect = !filterCol.editorOptions.multiSelect;
									platformGridAPI.columns.configuration(scope.gridId, cols.current);

									// remove all markers (and the filter) if we switch to single-selection
									// but only if there were more than one markers set
									var list = _.filter(dataService.getUnfilteredList(), {IsMarked: true});
									if (!filterCol.editorOptions.multiSelect) {
										removeMarkers(list);
									}

									let grid = platformGridAPI.grids.element('id', scope.gridId);
									if(grid && grid.instance) {
										grid.instance.onSelectionModeChanged.notify({items:list, isMultiSelect: filterCol.editorOptions.multiSelect, column: filterCol}, new Slick.EventData(), grid.instance);
									}
								}
							}
						}
					});
					toolbarItems.push({
						id: 't13',
						sort: 130,
						caption: 'cloud.common.toolbarItemFilter',
						type: 'check',
						iconClass: 'tlb-icons ico-line-item-filter',
						disabled: function () {
							return !_.isFunction(dataService.setItemFilter);
						},
						fn: function toogleItemFilter() {
							dataService.enableItemFilter(!dataService.isItemFilterEnabled());
						}
					});
				}
			}

			function startBulkEditor(headlessOption) {
				var element = platformGridAPI.grids.element('id', scope.gridId);
				var grid = element.instance;
				var gridColumns = grid.getColumns();
				var activeCol = 0;
				if (grid.getActiveCell()) {
					activeCol = grid.getActiveCell().cell;
				}
				scope.selectedColumn = gridColumns[activeCol];
				bulkEditorBaseService.startBulkEditor(itemService, uiStandardService, validationService, scope, gridConfig, gridColumns, headlessOption);
			}

			if (_.isFunction(itemService.isReadonly) && !itemService.isReadonly() && _.isFunction(uiStandardService.getDtoScheme) && _.isFunction(itemService.supportsMultiSelection) && itemService.supportsMultiSelection()) {

				toolbarItems.push({
					id: 't14',
					sort: 140,
					caption: 'cloud.common.bulkEditor.title',
					type: 'item',
					iconClass: 'type-icons ico-construction51',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					permission: '#w',
					disabled: function () {
						var selectionFn = itemService.getSelectedEntities;
						if (!_.isFunction(selectionFn)) {
							selectionFn = itemService.getSelected;
						}
						return _.isEmpty(selectionFn()) || (_.isFunction(itemService.isReadonly) && itemService.isReadonly());
					},
					fn: function () {
						startBulkEditor(null);
					}
				});

				onBatchCopy = $rootScope.$on('onBatchCopy', function (event, copyData) {
					if (copyData.gridId === scope.gridId) {
						var headlessOption = copyData;
						if (!_.isEmpty(headlessOption.entities)) {
							startBulkEditor(headlessOption);
						} else {
							console.log('entities missing');
						}
					}
				});
			}
			else
			{
				let grid = platformGridAPI.grids.element('id', scope.gridId);
				if(grid) {
					grid.options.allowBatchCopy = false;
				}
			}

			function updateItemList(e) {
				platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				scope.selectedEntityID = -1;
				scope.selectedEntityIDs = [];

				platformContainerCreateDeleteButtonService.toggleButtons(createDeleteBtnConfig, itemService);

				if (gridConfig.updateChangeCallBack) {
					if (useTree) {
						platformGridAPI.items.data(scope.gridId, itemService.getTree());
					} else {
						platformGridAPI.items.data(scope.gridId, gridConfig.updateChangeCallBack(itemService.getList(), scope.gridCtrl));
					}
				} else {
					if (useTree) {
						var tree = itemService.getTree();
						platformGridAPI.items.data(scope.gridId, tree);
						if (!_.isEmpty(tree)) {
							if(e && e.setTreeGridLevel) {
								if (treeGridBtn) {
									let config = platformGridAPI.grids.getSaveConfiguration(scope.gridId);
									if (config) {
										if (config.treeGridLevel === 'undefined' || !config.treeGridLevel) {
											config.treeGridLevel = treeGridBtn.maxLevel;
										}
										platformGridAPI.grids.setTreeGridLevel(scope.gridId, config.treeGridLevel);
									}
								}
							}
							else {
								platformGridAPI.rows.expandAllSubNodes(scope.gridId);
							}
						}
					} else {
						if (gridConfig.useFilter) {
							platformGridAPI.items.data(scope.gridId, itemService.getFilteredList());
						} else {
							platformGridAPI.items.data(scope.gridId, itemService.getList());
						}
					}
				}
				doToolbarRefresh();

				platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			function doToolbarRefresh() {
				if (scope.tools && _.isFunction(scope.tools.refresh)) {
					scope.tools.refresh();
				} else {
					updateTools();
				}
			}

			function updateFeedbackComponent() {
				let uiMgr, feedback;
				if (_.isFunction(scope.getUiAddOns)) {
					uiMgr = scope.getUiAddOns();
					if (uiMgr) {
						feedback = uiMgr.getFeedbackComponent();
					}
				}
			}

			function updateToolStatusBar() {
				let filterOptions = platformGridAPI.filters.getFilterOptions(scope.gridId);
				let saveConfiguration = platformGridAPI.grids.getSaveConfiguration(scope.gridId);

				if (createDeleteBtnConfig.isTree) {
					let selectedLevel = saveConfiguration.treeGridLevel !== null && saveConfiguration.treeGridLevel !== 'undefined' ? saveConfiguration.treeGridLevel : treeGridBtn.maxLevel;
					platformToolbarBtnService.setSelectedTreeLevel(treeGridBtn, selectedLevel);
				}

				if (!filterOptions) {
					return;
				}
				searchColumnToggle.value = filterOptions.showFilterRow;
				searchAllToggle.value = filterOptions.showMainTopPanel;

				var markReadOnlyBtn = _.find(settingsDropdownItems, {id: 't255'});
				if (markReadOnlyBtn) {
					markReadOnlyBtn.value = platformGridAPI.grids.getMarkReadonly(scope.gridId);
				}

				var HLevelBtn = _.find(settingsDropdownItems, {id: 't256'});
				if (HLevelBtn) {
					HLevelBtn.value = saveConfiguration.showHLevelFormatting;
				}
				var VLevelBtn = _.find(settingsDropdownItems, {id: 't257'});
				if (VLevelBtn) {
					VLevelBtn.value = saveConfiguration.showVLevelFormatting;
				}

				let uiMgr, sb;

				if (_.isFunction(scope.getUiAddOns)) {
					uiMgr = scope.getUiAddOns();
					if (uiMgr) {
						sb = uiMgr.getStatusBar();

						var showStatusBar = saveConfiguration.statusBar;
						if (sb) {
							sb.setVisible(showStatusBar);
						}

						var dropdownToolbarItem = _.find(toolbarItems, {id: 't200'});
						if (dropdownToolbarItem) {
							var statusBarToolbarItem = _.find(dropdownToolbarItem.list.items, {id: 't155'});
							if (statusBarToolbarItem) {
								statusBarToolbarItem.value = showStatusBar;
							}
						}

						var copyPasteToolbarItem = _.find(toolbarItems, {id: toolbarCopyPasteOptionsId});
						if (copyPasteToolbarItem) {
							var copyWithHeader = _.find(copyPasteToolbarItem.list.items, {id: 't400'});
							if (copyWithHeader) {
								copyWithHeader.value = saveConfiguration.copyWithHeader;
							}
						}
					}
				}
				scope.tools.update();
			}

			function updateSelection() {
				var dataServSel = itemService.getSelected();
				var dssId = -1;
				var rows = [];
				if (platformDataServiceSelectionExtension.isSelection(dataServSel)) {
					dssId = dataServSel.Id;
					rows.push(dataServSel);
				}
				if (dssId !== scope.selectedEntityID) {
					if(dssId !== -1 && _.find(scope.selectedEntityIDs, function(entity) { return entity === dssId; })) {
						scope.selectedEntityIDs = _.filter(scope.selectedEntityIDs, function(entity) { return entity !== dssId; });
					}
					else {
						if (dataServSel) {
							platformGridAPI.rows.scrollIntoViewByItem(scope.gridId, dataServSel, false);
						}
						platformGridAPI.rows.selection({
							gridId: scope.gridId,
							rows: rows
						});
						scope.selectedEntityID = dssId;
					}
				}
				var buttons = {disableCreate: false, disableDelete: false, disableCreateSub: false};
				updateButtons(buttons);
			}

			function selectionAfterSort(item) {
				if (platformDataServiceSelectionExtension.isSelection(item) && item.Id !== scope.selectedEntityID) {
					platformGridAPI.rows.selection({
						gridId: scope.gridId,
						rows: [item]
					});
				}
			}

			function onRefreshData(invalidate) {
				platformGridAPI.grids.refresh(scope.gridId, _.isUndefined(invalidate) ? true : invalidate);
			}

			function onRefreshEntity(e, entity) {
				platformGridAPI.rows.refreshRow({gridId: scope.gridId, item: entity});
			}

			function onEntityCreated(e, entity) {
				platformGridAPI.rows.add({gridId: scope.gridId, item: entity});
			}

			function onEntitiesAdded(e, entities) {
				platformGridAPI.rows.append({gridId: scope.gridId, items: entities});
			}

			function setReadOnlyRow() {// rows
			}

			function addItemCssClass(data, cssClass) {
				// add row css class dynamically
				var items = [];
				if (angular.isArray(data) && data.length > 0) {
					items = data;
				} else if (angular.isObject(data) && data.Id > 0) {
					items = [data];
				}
				platformGridAPI.rows.addCssClass({
					gridId: scope.gridId,
					items: items,
					cssClass: cssClass
				});
			}

			function refreshRequested() {
				platformGridAPI.grids.skeletonLoading(scope.gridId, true);
			}

			function listLoaded(e) {
				if(e) {
					platformGridAPI.grids.skeletonLoading(scope.gridId, false);
				}
				updateItemList(e);
			}

			// set cell focus dynamically
			function setCellFocus(options) {
				platformGridAPI.cells.selection({
					gridId: scope.gridId,
					rows: options && options.item ? [options.item] : null,
					cell: options && options.cell ? options.cell : null,
					forceEdit: options && options.forceEdit ? options.forceEdit : null
				});
			}

			if (itemService.registerListLoaded) {
				itemService.registerListLoaded(listLoaded);
			}
			if (itemService.registerDataModified) {
				itemService.registerDataModified(onRefreshData);
			}
			if (itemService.registerItemModified) {
				itemService.registerItemModified(onRefreshEntity);
			}
			if (itemService.registerEntityCreated) {
				itemService.registerEntityCreated(onEntityCreated);
			}
			if (itemService.registerEntitiesAdded) {
				itemService.registerEntitiesAdded(onEntitiesAdded);
			}
			if (itemService.registerSelectionChanged) {
				itemService.registerSelectionChanged(updateSelection);
			}
			if (itemService.registerSelectionAfterSort) {
				itemService.registerSelectionAfterSort(selectionAfterSort);
			}
			if (itemService.registerSetReadOnlyRow) {
				itemService.registerSetReadOnlyRow(setReadOnlyRow);
			}
			if (itemService.registerAddItemCssClass) {
				itemService.registerAddItemCssClass(addItemCssClass);
			}
			if (itemService.registerSetCellFocus) {
				itemService.registerSetCellFocus(setCellFocus);
			}
			if (itemService.registerRefreshRequested) {
				itemService.registerRefreshRequested(refreshRequested);
			}
			if (itemService.registerListLoadStarted) {
				itemService.registerListLoadStarted(refreshRequested);
			}

			if (itemService.addUsingContainer) {
				itemService.addUsingContainer(scope.gridId);
			}

			scope.$on('$destroy', function () {
				if (itemService.removeUsingContainer) {
					itemService.removeUsingContainer(scope.gridId);
				}

				if (itemService.unregisterListLoaded) {
					itemService.unregisterListLoaded(listLoaded);
				}
				if (itemService.unregisterDataModified) {
					itemService.unregisterDataModified(onRefreshData);
				}
				if (itemService.unregisterItemModified) {
					itemService.unregisterItemModified(onRefreshEntity);
				}
				if (itemService.unregisterEntityCreated) {
					itemService.unregisterEntityCreated(onEntityCreated);
				}
				if (itemService.unregisterEntitiesAdded) {
					itemService.unregisterEntitiesAdded(onEntitiesAdded);
				}
				if (itemService.unregisterSelectionChanged) {
					itemService.unregisterSelectionChanged(updateSelection);
				}
				if (itemService.unregisterSelectionAfterSort) {
					itemService.unregisterSelectionAfterSort(selectionAfterSort);
				}
				if (itemService.unregisterSetReadOnlyRow) {
					itemService.unregisterSetReadOnlyRow(setReadOnlyRow);
				}
				if (itemService.unregisterAddItemCssClass) {
					itemService.unregisterAddItemCssClass(addItemCssClass);
				}
				if (itemService.unregisterSetCellFocus) {
					itemService.unregisterSetCellFocus(setCellFocus);
				}
				if (itemService.unregisterRefreshRequested) {
					itemService.unregisterRefreshRequested(refreshRequested);
				}
				if (itemService.unregisterListLoadStarted) {
					itemService.unregisterListLoadStarted(refreshRequested);
				}

				platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onCellModified);
				platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				if (isDragDropAllowed) {
					platformGridAPI.events.unregister(scope.gridId, 'onDragStart', onDragStart);
					platformGridAPI.events.unregister(scope.gridId, 'onDragEnd', onDragEnd);
				}
				platformGridAPI.events.unregister(scope.gridId, 'onHeaderCellRendered', onHeaderCellRenderedHandler);
				platformGridAPI.events.unregister(scope.gridId, 'onInitialized', onInitializedHandler);
				if (useTree) {
					platformGridAPI.events.unregister(scope.gridId, 'onHeaderClick', onHeaderClickHandler);
				}

				platformGridAPI.events.unregister(scope.gridId, 'onAddNewRow', scope.createItemOnEnter);
				platformGridAPI.events.unregister(scope.gridId, 'onBeforeEditCell', onCellEditable);
				platformGridAPI.events.unregister(scope.gridId, 'onHeaderToggled', onGroupingPanelToggled);
				platformGridAPI.events.unregister(scope.gridId, 'onGroupingChanged', onGroupingChanged);
				platformGridAPI.events.unregister(scope.gridId, 'onItemCountChanged', onItemCountChangedHandler);
				platformGridAPI.events.unregister(scope.gridId, 'onCopyComplete', onCopyCompleteHandler);
				platformGridAPI.events.unregister(scope.gridId, 'onPasteComplete', onPasteCompleteHandler);
				platformGridAPI.events.unregister(scope.gridId, 'onTreeLevelChanged', onTreeLevelChangedHandler);
				platformGridAPI.events.unregister(scope.gridId, 'onMarkerSelectionChanged', onMarkerSelectionChangedHandler);
				cloudDesktopPinningFilterService.onSetPinningFilter.unregister(onSetPinningFilter);

				// unregister pinning context service messenger
				if (gridConfig.pinningContext) {
					cloudDesktopPinningContextService.onClearPinningContext.unregister(onClearPinningContext);
					cloudDesktopPinningContextService.onSetPinningContext.unregister(onSetPinningContext);
				}

				cloudDesktopSidebarService.filterChanged.unregister(onFilterChanged);

				// force destroy of grid - seems to be missing
				platformGridAPI.grids.unregister(scope.gridId);

				if (_.isFunction(onBatchCopy)) {
					onBatchCopy();
				}
			});

			var gridListener = scope.$watch(function () {
				return scope.gridCtrl !== undefined;
			}, function () {
				$timeout(function () {
					updateItemList({setTreeGridLevel: true});
					updateSelection();
					updateFeedbackComponent();
					updateToolStatusBar();
					gridListener();
				}, 10);
			});

			// region show grid error (via alert directive)

			/**
			 * set data to error
			 * @param isShow Show the error ui or not
			 * @param messageCol
			 * @param message
			 * @param type
			 */
			function setInfo(isShow, messageCol, message, type) {
				scope.error = {
					show: isShow,
					messageCol: messageCol,
					message: message,
					type: type
				};
			}

			/**
			 * @ngdoc function
			 * @name showInfo
			 * @function
			 * @methodOf
			 */
			scope.showInfo = function (message) {
				setInfo(true, 1, message, 2);
			};

			/**
			 * @ngdoc function
			 * @name hideInfo
			 * @function
			 * @methodOf
			 */
			scope.hideInfo = function () {
				setInfo(false, 1, '', 0);
			};

			/**
			 * @ngdoc function
			 * @name getSelectedItem
			 * @function
			 * @methodOf
			 * @description return the currently selected item
			 */
			scope.getSelectedItem = function () {
				return itemService.getSelected();
			};

			// rei@7.12.2015 add watchlist button
			if (itemService.getWatchListOptions) {
				var options = itemService.getWatchListOptions();
				if (options.active) {
					var watchlistService = $injector.get('cloudDesktopSidebarWatchListService');
					var wlToolbarButton = watchlistService.getWatchListToolbarButtons(scope, itemService);
					if (wlToolbarButton) {
						for (var i = 0; i < wlToolbarButton.length; i++) {
							wlToolbarButton[i].sort = 110;
							toolbarItems.push(wlToolbarButton[i]);
						}
						// service.addTools(wlToolbarButton);
					}
				}
			}

			// rei@14.4.2016 add pinning context button
			if (_.isFunction(itemService.getPinningOptions)) {
				var pinOptions = itemService.getPinningOptions();
				if (pinOptions.isActive && !pinOptions.suppressButton) {
					var pinningContextService = $injector.get('cloudDesktopPinningContextService');
					var pinToolbarButton = pinningContextService.getPinningToolbarButton(scope, itemService);
					if (pinToolbarButton) {
						for (var k = 0; k < pinToolbarButton.length; k++) {
							pinToolbarButton[k].sort = 120;
							toolbarItems.push(pinToolbarButton[k]);
						}
						// service.addTools(pinToolbarButton);
					}
				}
			}

			/*
			showPinningDocuments is for special cases. e.g. project-container: Scheduling, Estimate, BoQ, Model
			 */
			if(itemService.isRoot || !_.isNil(itemService.showPinningDocuments)) {
				let pinningDocumentsService = $injector.get('cloudDesktopPinningDocumentsService');
				let pinningDocumentsButton = pinningDocumentsService.getPinningDocumentButton(itemService, itemService.showPinningDocuments);

				if (pinningDocumentsButton) {
					toolbarItems.push(pinningDocumentsButton);
				}
			}

			toolbarItems = _.sortBy(toolbarItems, 'sort');

			function updateTools() {
				scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: (gridConfig.toolbarItemsDisabled) ? [] : toolbarItems
				});
			}

			if (!gridConfig.skipToolbarCreation) {
				updateTools();
			}

			function addTools(tools) {
				if (angular.isArray(tools)) {
					_.forEach(tools, function (toolItem) {
						if (!_.includes(toolbarItems, toolItem)) {
							toolbarItems.push(toolItem);
						}
					});
					updateTools();
					return;
				}
				throw new Error('must be called with an array as parameter');
			}

			scope.addTools = service.addTools = addTools;
			scope.updateTools = updateTools;
			scope.updateButtons = updateButtons;

			function onItemCountChangedHandler(e, arg) {
				if (!_.isUndefined(arg)) {
					setStatusBarInfo(arg);
				}
			}

			function onCopyCompleteHandler() {
				$scope.getUiAddOns().getAlarm().show('cloud.common.copyToClipboardSucess');
				$scope.getUiAddOns().enableToolbar();
				platformGridAPI.grids.setAllowCopySelection(scope.gridId, false);
				$scope.inCopyMode = false;
			}

			function onPasteCompleteHandler(e, arg) {
				var isTransient = _.get(arg.grid.getColumns()[arg.cell], 'isTransient');

				if (arg.modifiedItems.length > 0 && !isTransient) {
					if (itemService.addEntitiesToModified) {
						itemService.markEntitiesAsModified(arg.modifiedItems);
					} else {
						if (itemService.markItemAsModified) {
							itemService.markItemAsModified(arg.modifiedItems[0]);
						}
					}
				}
			}

			function onTreeLevelChangedHandler(e, arg) {
				if (treeGridBtn) {
					let saveConfiguration = platformGridAPI.grids.getSaveConfiguration(scope.gridId);
					let selectedLevel = saveConfiguration.treeGridLevel !== null && saveConfiguration.treeGridLevel !== 'undefined' ? saveConfiguration.treeGridLevel : treeGridBtn.maxLevel;
					if (arg.grid.getLength() && arg.maxLevel !== 0 && arg.maxLevel < selectedLevel) {
						selectedLevel = arg.maxLevel;
					}
					platformToolbarBtnService.setToolbarItemsForTreeLevel(scope, treeGridBtn, arg.maxLevel, selectedLevel);
				}
			}

			// event of the sidebar (database filter)
			function onFilterChanged(info) {
				if (!_.isUndefined(info)) {
					if (itemService.isRoot && (_.isUndefined(gridConfig.isRoot) || (!_.isUndefined(gridConfig.isRoot) && gridConfig.isRoot)) && cloudDesktopSidebarService.isSearchActive()) {
						setStatusBarNav();
					}
				}
				else {
					setStatusBarNav(false);
				}
			}

			function setStatusBarNav(isVisible = true) {
				var searchFilterInfo = cloudDesktopSidebarService.filterInfo;
				var fieldChanges;

				// Search Form Filter Change
				if (_.isFunction(scope.getUiAddOns) && !_.isUndefined(searchFilterInfo) && searchFilterInfo.recordInfoText !== '') {
					var uiMgr = scope.getUiAddOns();
					var sb = uiMgr.getStatusBar();

					fieldChanges = [
						{
							align: 'last',
							disabled: !searchFilterInfo.backwardEnabled,
							id: 'goToFirst',
							type: 'button',
							visible: true,
							delete: !isVisible,
							iconClass: 'tlb-icons ico-rec-first',
							cssClass: 'block-image',
							func: function () {
								cloudDesktopSidebarService.filterPageFirst();
								cloudDesktopSidebarService.filterStartSearch(false, true);
							}
						},
						{
							align: 'last',
							disabled: !searchFilterInfo.backwardEnabled,
							id: 'goToPrev',
							type: 'button',
							visible: true,
							delete: !isVisible,
							iconClass: 'control-icons ico-previous',
							cssClass: 'block-image',
							func: function () {
								cloudDesktopSidebarService.filterPageBackward();
								cloudDesktopSidebarService.filterStartSearch(false, true);
							}
						},
						{
							id: 'info',
							align: 'last',
							type: 'text',
							ellipsis: true,
							delete: !isVisible,
							value: searchFilterInfo.recordInfoText,
							toolTip: {
								title:  platformTranslateService.instant('platform.grid.sidebarSearchTitle', null, true),
								caption:  platformTranslateService.instant('platform.grid.sidebarSearchDescription', null, true),
								hasDefaultWidth: true,
								width: 300
							}
						},{
							align: 'last',
							disabled: !searchFilterInfo.forwardEnabled,
							id: 'goToNext',
							type: 'button',
							visible: true,
							delete: !isVisible,
							iconClass: 'control-icons ico-next',
							cssClass: 'block-image',
							func: function () {
								cloudDesktopSidebarService.filterPageForward();
								cloudDesktopSidebarService.filterStartSearch(false, true);
							}
						},
						{
							align: 'last',
							disabled: !searchFilterInfo.forwardEnabled,
							id: 'goToLast',
							type: 'button',
							visible: true,
							delete: !isVisible,
							iconClass: 'tlb-icons ico-rec-last',
							cssClass: 'block-image',
							func: function () {
								cloudDesktopSidebarService.filterPageLast();
								cloudDesktopSidebarService.filterStartSearch(false, true);
							}
						}];

					sb.updateFields(fieldChanges);
				}
			}

			function setStatusBarInfo(gridFilterInfo) {
				var link, fieldChanges;

				if (_.isFunction(scope.getUiAddOns) && !_.isUndefined(gridFilterInfo)) {
					var uiMgr = scope.getUiAddOns();
					var sb = uiMgr.getStatusBar();
					link = sb.getLink();

					fieldChanges = [{
						id: 'status',
						value: getItemCountString(gridFilterInfo.rowCountText, gridFilterInfo.hasFilter)
					}];

					link.updateFields(fieldChanges);
					// link.update();
				}
			}

			function getItemCountString(rowCountText, hasFilter) {
				return platformTranslateService.instant('platform.grid.items', null, true) + (hasFilter ? ' (' + platformTranslateService.instant('platform.grid.filtered', null, true) + ')' : '') + ': ' + rowCountText;
			}

			function addSaveViewFieldsInStatusbar(sbLink, items) {
				// at the moment no solutions for bugfixing visible true/false in statusbar
				sbLink.updateFields(platformStatusBarViewSettings.deleteItems());
				// set the items for the icons new
				sbLink.addFields(items);
			}

			function onSetPinningFilter(args) {
				var grid = platformGridAPI.grids.exist(scope.gridId);
				if (grid) {
					let sbLink = getSbLink();
					if (sbLink) {
						let statusBarItems = platformStatusBarViewSettings.updateStatusBarViewItems(args.filter, args.config);
						addSaveViewFieldsInStatusbar(sbLink, statusBarItems);
					}
				}
				if (!_suppressRefresh && args.filter && !cloudDesktopSidebarService.filterInfo.isPending) {
					if ((args.viewChanged && args.config.loadDataTabChanged) || args.filterCleared || (args.config.loadDataModuleStart && args.moduleLoaded) || (args.config.loadDataTabChanged && args.tabChanged)) {
						platformNavBarService.getActionByKey('refresh').fn();
						_suppressRefresh = true;
					}
				}
			}

			function getSbLink() {
				let uiMgr, sb;
				if (_.isFunction(scope.getUiAddOns)) {
					uiMgr = scope.getUiAddOns();
					if (uiMgr) {
						sb = uiMgr.getStatusBar();
						return sb.getLink();

					}
				}
				return null;
			}

			function getStatusBarInitialInfoItems() {
				return [{
					id: 'status',
					type: 'text',
					align: 'left',
					disabled: false,
					cssClass: '',
					visible: true,
					ellipsis: true,
					value: getItemCountString('0/0', false),
					toolTip: {
						title: platformTranslateService.instant('platform.grid.gridSearchTitle', null, true),
						caption: platformTranslateService.instant('platform.grid.gridSearchDescription', null, true),
						hasDefaultWidth: true,
						width: 300
					}
				}];
			}

			if (_.isFunction(scope.getUiAddOns)) {
				let uiMgr = scope.getUiAddOns();

				const addOnScope = uiMgr._privateState.getAddOnScope();

				addOnScope.beforeResizeHandler = function () {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					if(grid && grid.instance) {
						grid.instance.beforeResize();
					}
				};

				if( _.get(gridConfig, 'statusbar.enabled', true)) {
					let sb = uiMgr.getStatusBar();
					let link = sb.getLink();

					let fields = getStatusBarInitialInfoItems();

					// init the items for the save-view infos
					platformStatusBarViewSettings.getStatusBarViewItems().then(response => {
						addSaveViewFieldsInStatusbar(link, response);
					});

					sb.showFields(fields);

					//init items for total amount of records, itemService.isRoot checks if this is a main entity grid
					if (itemService.isRoot && (_.isUndefined(gridConfig.isRoot) || (!_.isUndefined(gridConfig.isRoot) && gridConfig.isRoot)) && cloudDesktopSidebarService.isSearchActive()) {
						setStatusBarNav();
					}
				}
			}

		};
		return service;
	}
})();
