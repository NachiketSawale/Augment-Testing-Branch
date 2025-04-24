(() => {
	'use strict';
	angular.module('platform').directive('platformContextMenu', platformContextMenu);

	platformContextMenu.$inject = ['basicsLookupdataPopupService', '$timeout', 'platformGridAPI', 'platformContextMenuTypes', 'keyCodes', 'platformContextMenuService', 'mainViewService'];

	function platformContextMenu(basicsLookupdataPopupService, $timeout, platformGridAPI, platformContextMenuTypes, keyCodes, platformContextMenuService, mainViewService) {
		return {
			restrict: 'AE',
			link: function (scope, elem, attr) {
				let instance;
				let grid;
				let header;
				let contextMenuKeyPressed = false;

				elem.on('contextmenu', (event) => {
					scope.$apply(() => {
						platformContextMenuService.clearContextMenuProperty();
						if(contextMenuKeyPressed) {
							platformContextMenuService.contextMenuProperty.contextMenuKeyPressed = true;
						}
						let contextItems = _.cloneDeep(scope.$eval(attr.contextItems));
						platformContextMenuService.contextMenuProperty.contextItems = contextItems;
						platformContextMenuService.contextMenuProperty.event = event;

						let contextAreaType = getContextArea(event);
						platformContextMenuService.contextMenuProperty.areaType = contextAreaType;
						if(contextItems && contextAreaType) {
							event.preventDefault();
							platformContextMenuService.initContextItems(scope);
						}
						contextMenuKeyPressed = false;
					});
				});

				elem.on('keydown', (event) => {
					//menu-key
					if(event.keyCode === keyCodes.SELECT) {
						contextMenuKeyPressed = true;
					}
				});

				scope.keydownFn = function (event) {
					let popups;
					let popupInstance;
					let toFocusElem;

					//esc-key && right-arrow
					if (event.keyCode === keyCodes.ESCAPE) {
						platformContextMenuService.contextMenuProperty.event = event;
						toFocusElem = platformContextMenuService.processButtonKeyDown();

						if(toFocusElem) {
							let btnId = 'button#' + toFocusElem.id;
							platformContextMenuService.contextMenuProperty.instance.element.find(btnId).focus();
						} else {
							platformContextMenuService.contextMenuProperty.instance.element.find('button').not(':disabled').first().focus();
						}
					}
				}

				function getContextAreaFromGrid(event, grid) {
					if(!grid.scope.$parent.inCopyMode) {
						header = $(event.target).closest('.slick-header-column');
						if(header.length) {
							platformContextMenuService.contextMenuProperty.headerElem = header;
							return platformContextMenuTypes.gridColumnHeader;
						}

						let isInCell = platformContextMenuService.checkIfInCell(grid, event, contextMenuKeyPressed);
						if(isInCell) {
							return platformContextMenuTypes.gridRow;
						}
					}
					return undefined;
				}

				function getContextArea(event) {
					let gridId = checkGridId(event);
					if(gridId) {
						platformContextMenuService.contextMenuProperty.gridId = gridId;
						grid = platformGridAPI.grids.element('id', gridId);
						return getContextAreaFromModuleContainer(event);
					}
					return 'all';
				}

				function checkGridId(event) {
					let gridElem = $(event.target).closest('.platformgrid');
					if(gridElem.length > 0) {
						return gridElem.attr('id');
					}
					return scope.hasOwnProperty('getContainerUUID') ? scope.getContainerUUID() : null;
				}

				function getContextAreaFromModuleContainer(event) {
					if(grid) {
						return getContextAreaFromGrid(event, grid);
					} else {
						//Context-Menu in Detail-Container is still not defined
						return undefined;
					}
				}

				function findGridElem(selectedId) {
					let gridElem = elem.find('.platformgrid');
					return gridElem.length > 0 && gridElem.attr('id') === selectedId;
				}

				scope.$on('initShortcutGoTo', function () {
					//show GoTo-Items in grid
					let selectedId = mainViewService.activeContainer();
					//so that not created multiple times
					if(findGridElem(selectedId)) {
						platformContextMenuService.clearContextMenuProperty();
						platformContextMenuService.callShortcutFn(scope, selectedId);
					}
				});

				scope.$on('$destroy', () => {
					elem.off('contextmenu');
					elem.off('keydown');
				});
			}
		};
	}
})();