/*
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.workflow';

	angular.module(moduleName).factory('basicsWorkflowDragDropService', basicsWorkflowDragDropService);

	basicsWorkflowDragDropService.$inject = ['$log', 'platformDragdropService', 'platformGridAPI'];

	function basicsWorkflowDragDropService($log, platformDragdropService, platformGridAPI) {
		const service = {};

		let itemOnDragEnd;

		service.initDragDropForTemplateContainer = function initDragDropForTemplateContainer(scope, uiStandardService, itemService, gridConfig) {
			let isDragDropAllowed = false;

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
						let grid = platformGridAPI.grids.element('id', scope.gridId).instance;

						let cell = grid.getCellFromEvent(info.event);
						// es
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

					let grid = platformGridAPI.grids.element('id', scope.gridId).instance;
					let cell = grid.getCellFromEvent(info.event);

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

				scope.$on('$destroy', function () {
					platformDragdropService.unregisterDragStateChanged(dragStateChanged);
				});
			}

			platformGridAPI.events.register(scope.gridId, 'onDragStart', onDragStart);
			platformGridAPI.events.register(scope.gridId, 'onDragEnd', onDragEnd);

			function onDragStart(e, arg) {
				if (scope.inCopyMode) {
					return;
				}

				if (gridConfig.dragDropService.canDrag && !gridConfig.dragDropService.canDrag(gridConfig.type)) {
					return;
				}

				let grid = arg.grid;
				let cell = grid.getCellFromEvent(e);

				if (!cell) {
					return;
				}

				let item = grid.getDataItem(cell.row);

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
					let items = [];
					let selectedRows = arg.grid.getSelectedRows();
					for (let i = 0; i < selectedRows.length; i++) {
						items.push(arg.grid.getDataItem(selectedRows[i]));
					}
					return items;
				}

				if (platformDragdropService.isOnTarget()) {
					let items = prepareItems();
					if (!angular.isFunction(gridConfig.dragDropService.doPaste)) {
						gridConfig.dragDropService.copy(items, gridConfig.type, itemService);
					}
					let draggedData = {
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
				let grid = arg.grid;
				if (grid) {
					grid.clearHighlightRows();
				}
			}

			scope.$on('$destroy', function () {
				if (isDragDropAllowed) {
					platformGridAPI.events.unregister(scope.gridId, 'onDragStart', onDragStart);
					platformGridAPI.events.unregister(scope.gridId, 'onDragEnd', onDragEnd);
				}
			});
		};

		return service;
	}
})(angular);