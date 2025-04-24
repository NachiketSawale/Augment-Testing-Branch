(() => {
	'use strict';

	angular.module('platform').factory('platformContextMenuService', platformContextMenuService);

	platformContextMenuService.$inject = ['platformContextMenuItems', 'basicsLookupdataPopupService', 'mainViewService', 'platformGridAPI', '$timeout', 'platformContainerUiAddOnService', '$translate'];

	function platformContextMenuService(platformContextMenuItems, basicsLookupdataPopupService, mainViewService, platformGridAPI, $timeout, platformContainerUiAddOnService, $translate) {
		let instance;
		let service = {
			processContextItems: processContextItems,
			checkIfInCell: checkIfInCell,
			getButtonHTMLMarkup: getButtonHTMLMarkup,
			processButtonKeyDown: processButtonKeyDown,
			getGotoItems: getGotoItems,
			initGoToItemsShortCut: initGoToItemsShortCut,
			createContextMenuContent: createContextMenuContent,
			callShortcutFn: callShortcutFn,
			clearContextMenuProperty: clearContextMenuProperty,
			initContextItems: initContextItems
		};

		service.contextMenuProperty = {
			areaType: '',
			contextMenuKeyPressed: false,
			get grid() {
				if(this.gridId) {
					return platformGridAPI.grids.element('id', this.gridId);
				}
				return undefined;
			},
			get existGrid() {
				return this.gridId ? true : false;
			}
		};

		function clearContextMenuProperty() {
			service.contextMenuProperty.event = undefined;
			service.contextMenuProperty.contextMenuKeyPressed = false;
			service.contextMenuProperty.gridId = undefined;
			service.contextMenuProperty.contextItems = undefined;
			service.contextMenuProperty.headerElem = undefined;
			service.contextMenuProperty.areaType = undefined;
			service.contextMenuProperty.instance = undefined;
		}

		function processDisabledFn(items) {
			angular.forEach(items, function (item) {
				if (item.hasOwnProperty('isDisabled') && _.isFunction(item.isDisabled)) {
					item.disabled = item.isDisabled();
				}
			});
		}

		function checkLastItem(items) {
			return items && items.length > 0 && items[items.length - 1].type === 'divider';
		}

		function processContextItems(items) {
			items = checkIfExistOverflowButton(items);
			if(service.contextMenuProperty.grid) {
				items = getItemsForGrid(service.contextMenuProperty.grid).concat(items);
			}

			if (service.contextMenuProperty.areaType !== 'all') {
				items = _.filter(items, function (item) {
					return item && item.contextAreas && item.contextAreas.includes(service.contextMenuProperty.areaType.type);
				});
			}

			processDisabledFn(items);

			items = platformContextMenuItems.setItemsForContextMenu(items);

			if(checkLastItem(items)) {
				items.pop();
			}

			return items;
		}

		function initContextItems(scope) {
			service.contextMenuProperty.contextItems.items = processContextItems(service.contextMenuProperty.contextItems.items);

			if(service.contextMenuProperty.contextItems.items.length > 0) {
				createContextMenuContent(scope);
			}
		}

		function checkIfExistOverflowButton(contextItems) {
			let existOverflowButton = _.find(contextItems, {id: 'fixbutton'});
			if (existOverflowButton) {
				//set all items in the list of show
				contextItems.forEach((el) => {
					el.hideItem = false;
				});
				//overflow-button in the list is not necessary
				contextItems.pop();
			}
			return contextItems;
		}

		function getGotoItems(grid) {
			return platformContextMenuItems.setGridRowGoToObject(grid);
		}

		function getItemsForGrid(grid) {
			let _gridObjects = platformContextMenuItems.getItemsForGridHeader();
			let _treeGridObjects = grid.options.treeToolbarItems;
			if (_treeGridObjects) {
				_gridObjects = _gridObjects.concat(_treeGridObjects);
			}
			let _copyPasteGridObjects = platformContextMenuItems.getGridCopyPasteItems(grid);
			_gridObjects = _gridObjects.concat(_copyPasteGridObjects);

			let _ResultArray = getGotoItems(grid);
			if(_ResultArray.length > 0) {
				_gridObjects = _gridObjects.concat(_ResultArray);
			}

			return _gridObjects;
		}

		function getSelectedCell() {
			let gridInstance = service.contextMenuProperty.grid.instance;
			let cellAttribute = gridInstance.getCellFromEvent(service.contextMenuProperty.event);
			if(service.contextMenuProperty.contextMenuKeyPressed && !cellAttribute) {
				cellAttribute = gridInstance.getActiveCell();
			}
			return cellAttribute;
		}

		function checkIfInCell(grid, event, contextMenuKeyPressed) {
			let gridInstance = service.contextMenuProperty.grid.instance;
			let cell = getSelectedCell(event, gridInstance, contextMenuKeyPressed);
			let selectedRows = gridInstance.getSelectedRows(); //fue:

			if(cell) {
				let isActive = gridInstance.getEditorLock().isActive();

				if(isActive) {
					//is cell in editmode --> dont show context-menu
					return false;
				}

				if(cell && !selectedRows.includes(cell.row)) {
					gridInstance.resetActiveCell();
					gridInstance.setSelectedRows([cell.row]);
				}

				return true;
			}

			return false;
		}

		function getButtonHTMLMarkup(item, existsShortCuts) {
			item.shortCut = item.shortCut || '';

			let btn = '<button id="##itemId##" type="button" ##disabled## class="##cssExtendClass####cssClass## context-menu-item" ##autofocus## title="##tooltip##" ' +
				' data-ng-click="##fn##" data-ng-keydown="keydownFn($event)" ##currentButtonId## ##attr## ##model##>' +
				'  <span class="##indClass##">##title##</span>';

				if(existsShortCuts && existsShortCuts.length > 0) {
					btn += '<small class="sub-title text-right">' + item.shortCut + '</small>';
				}

				btn += '  ##subico##</button>';

			return btn;
		}

		function processButtonKeyDown() {
			let popups = basicsLookupdataPopupService.getOpenPopupInstances();
			let toFocusElem;

			if(popups.length < 2 && service.contextMenuProperty.instance) {
				basicsLookupdataPopupService.hidePopup(service.contextMenuProperty.instance.level);
				service.contextMenuProperty.grid.instance.focus();
				return;
			}

			popups.reverse().forEach((instance, index) => {
				if(index === 0) {
					basicsLookupdataPopupService.hidePopup(instance.level);
					return;
				}

				let itemId = $(service.contextMenuProperty.event.target).attr('id');
				if(itemId) {
					toFocusElem =	_.find(service.contextMenuProperty.contextItems.items, function (item) {
						if(item.type === 'dropdown-btn') {
							let childElem = _.find(item.list.items, {'id': itemId});
							if(childElem) {
								return item;
							}
						}
					});
				}
			});

			return toFocusElem;
		}

		function showAlarmBox(scope, selected, items) {
			if(!_.isFunction(scope.getUiAddOns)) {
				platformContainerUiAddOnService.addManagerAccessor(scope, $('body'), function () {});
			}
			let uiMgr = scope.getUiAddOns();
			let alarmLabel = 'cloud.common.contextMenu.goTo.' + (selected.length < 1 ? 'noneSelection' : 'noneGoTo');
			//alarmLabel = $translate.instant('cloud.common.contextMenu.goTo.noneSelection');
			uiMgr.getAlarm().show($translate.instant(alarmLabel));
		}

		function callShortcutFn(scope, selectedId) {
			if(selectedId) {
				service.contextMenuProperty.gridId = selectedId;
				let selectedRows = service.contextMenuProperty.grid.instance.getSelectedRows();
				service.contextMenuProperty.contextItems = initGoToItemsShortCut(service.contextMenuProperty.grid);
				if(selectedRows.length > 0 && service.contextMenuProperty.contextItems.items.length > 0) {
					service.contextMenuProperty.contextMenuKeyPressed = true;
					service.contextMenuProperty.event = undefined;

					createContextMenuContent(scope);
				} else {
					showAlarmBox(scope, selectedRows, service.contextMenuProperty.contextItems.items);
				}
			}
		}

		function initGoToItemsShortCut(grid) {
			let _ResultArray = {
				cssClass: 'tools',
				showTitles: true
			}
			_ResultArray.items = getGotoItems(grid);
			if(_ResultArray.items[0]?.type === 'dropdown-btn') {
				_ResultArray.items = _ResultArray.items[0].list.items;
			}
			return _ResultArray;
		}

		function setAutofocusOnItem(firstItem) {
			//The first item gets a focus. This has no effect. Except when you navigate with the keyboard, if that want.
			firstItem.autofocus = true;
		}

		function extendItems() {
			if(service.contextMenuProperty.existGrid) {
				let existsShortCuts = _.filter(service.contextMenuProperty.contextItems, 'shortCut');
				service.contextMenuProperty.contextItems.items.forEach((el, index) => {
					if(index === 0) {
						setAutofocusOnItem(el);
					}

					//Another HTML Markup for menuist-directive
					el.buttonTemplate = getButtonHTMLMarkup(el, existsShortCuts);

					el.contextMenu = {
						gridId: service.contextMenuProperty.gridId,
						headerElem: service.contextMenuProperty.headerElem
					};

					if(el.list && el.list.items.length > 0 && !el.list.initOnce) {
						el.list.cssClass += ' platform-navigate-list-items';
						let existsChildShortCuts = _.filter(el.list.items, 'shortCut');
						el.list.items.forEach((childItems, index) => {
							if(index === 0) {
								setAutofocusOnItem(childItems);
							}

							childItems.buttonTemplate = getButtonHTMLMarkup(childItems, existsChildShortCuts);
						});
					}
				});
			}

			return service.contextMenuProperty.contextItems.items;
		}

		function getFocusedElement() {
			let gridInstance = service.contextMenuProperty.grid.instance;
			let selectedRows = gridInstance.getSelectedRows();
			let focusElement;

			if(!service.contextMenuProperty.contextMenuKeyPressed && service.contextMenuProperty.event.pageX && service.contextMenuProperty.event.pageY) {
				focusElement = $(document.elementFromPoint(service.contextMenuProperty.event.pageX, service.contextMenuProperty.event.pageY));
			} else if(service.contextMenuProperty.contextMenuKeyPressed && selectedRows) {
				let activeCell = gridInstance.getActiveCell();
				let x = activeCell ? activeCell.row : selectedRows[0];
				let y = activeCell ? activeCell.cell : 0;

				focusElement = gridInstance.getCellNode(x, y);
			}

			return focusElement;
		}

		// function createContextMenuContent(scope, contextItems, grid, contextMenuKeyPressed, event) {
		function createContextMenuContent(scope) {
			scope.contextMenuItems = {
				showImages: false,
				showTitles: true,
				cssClass: 'context-items',
				// items: extendItems(contextItems.items, grid)
				items: extendItems()
			};

			service.contextMenuProperty.instance = basicsLookupdataPopupService.toggleLevelPopup({
				multiPopup: false,
				plainMode: true,
				hasDefaultWidth: false,
				scope: scope,
				focusedElement: getFocusedElement(),
				template: '<div class="popup-content" platform-navigate-list-items list-items-selector="\'.context-items\'"><div data-platform-menu-list data-list="contextMenuItems" data-init-once data-popup ></div></div>'
			});

			if (!_.isNil(service.contextMenuProperty.instance)) {
				service.contextMenuProperty.instance.opened
					.then(function () {
						$timeout(function () {
							scope.$digest();
						}, 0);
					});
			}
		}

		return service;
	}
})();