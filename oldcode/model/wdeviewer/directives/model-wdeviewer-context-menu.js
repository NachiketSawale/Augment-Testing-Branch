/**
 * Created by wui on 6/12/2018.
 */

/* jshint -W040 */// self
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	/**
	 * config as below:
	 * [
	 *  {
	 *      name: 'group name'
	 *      title: 'group title'
	 *      order: 0,
	 *      items: [{
	 *          name: 'item name',
	 *          title: 'item title',
	 *          sort: 0,
	 *          execute: 'item handler',
	 *          separator: false,
	 *          subGroup: false,
	 *          groups: [sub groups]
	 *      }]
	 *  }
	 * ]
	 */
	angular.module(moduleName).directive('modelWdeViewerContextMenu', ['modelWdeViewerObserverService',
		function (modelWdeViewerObserverService) {
			return {
				restrict: 'A',
				scope: true,
				controller: ['$scope', controller],
				controllerAs: 'ctrl',
				link: link
			};

			function controller($scope) {
				var self = this;

				self.attrs = null;

				self.menus = [];

				self.createContextMenu = createContextMenu;

				function createContextMenu(event, items) {
					var mask = createMask(items);
					createMainMenu(mask, event, items, 0);
				}

				function createMask(items) {
					var mask = angular.element('<div class="bc-context-menu"></div>');

					mask.css({
						width: '100%',
						height: '100%',
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 9999,
						overflow: 'hidden'
					});

					angular.element('body').append(mask);

					mask.on('click', function () {
						clearMenus(mask);
						mask.remove();
					}).on('contextmenu', function (event) {
						event.preventDefault();
						clearMenus(mask);
						createMainMenu(mask, event, items, 0);
					});

					return mask;
				}

				function createMenu(mask, menu, level, owner) {
					mask.append(menu);
					self.menus.push({
						level: level,
						element: menu,
						owner: owner
					});

					if (!_.isNil(owner)) {
						owner.style.backgroundColor = '#aec3d4';
					}
				}

				function removeMenu(level) {
					var newMenus = [];

					self.menus.forEach(function (menu) {
						if (menu.level > level) {
							menu.element.remove();

							if (!_.isNil(menu.owner)) {
								menu.owner.style.backgroundColor = 'initial';
							}
						} else {
							newMenus.push(menu);
						}
					});

					self.menus = newMenus;
				}

				function clearMenus(mask) {
					if (self.attrs.onContextMenuDestroy) {
						$scope.$eval(self.attrs.onContextMenuDestroy);
					}

					mask.empty();
					self.menus = [];
				}

				function createMainMenu(mask, event, items, level) {
					var menu = angular.element('<ul class="bc-menu-list list-group dropdown-menu"></ul>');

					menu.css({
						display: 'block',
						position: 'absolute',
						left: event.pageX + 'px',
						top: event.pageY + 'px',
						background: 'white',
						border: 'solid 1px silver',
						whiteSpace: 'nowrap'
					});

					createMenuItems(mask, menu, items, level);

					createMenu(mask, menu, level);

					setTimeout(function () {
						var pos = decideMainPosition(event, menu);
						menu.css({
							left: pos.left + 'px',
							top: pos.top + 'px'
						});
					});

					return menu;
				}

				function createSubMenu(mask, owner, items, level) {
					var menu = angular.element('<ul class="bc-menu-list list-group dropdown-menu"></ul>');
					var rect = owner.getBoundingClientRect();

					menu.css({
						display: 'block',
						position: 'absolute',
						left: (rect.left + rect.width) + 'px',
						top: rect.top + 'px',
						background: 'white',
						border: 'solid 1px silver',
						whiteSpace: 'nowrap'
					});

					createMenuItems(mask, menu, items, level);

					createMenu(mask, menu, level, owner);

					setTimeout(function () {
						decideSubPosition(owner, menu[0]);
					});

					return menu;
				}

				function createMenuItems(mask, menu, items, level) {
					angular.forEach(items, function (group, groupIndex) {
						var nextGroupIndex = groupIndex + 1,
							groupItems = _.sortBy(group.items, 'sort');

						angular.forEach(groupItems, function (item, itemIndex) {
							if (item.separator) {
								return;
							}

							var nextItemIndex = itemIndex + 1;
							var menuItem = angular.element('<li class="bc-menu-item list-group-item" style="padding: 6px 18px;color: black;"></li>');

							menuItem.text(item.name);

							if (nextItemIndex < groupItems.length) {
								// next item is not a separator item
								if (!groupItems[nextItemIndex].separator) {
									menuItem.css({
										borderBottom: 'none'
									});
								}
							} else {
								// for last item
								if (nextGroupIndex === items.length) {
									menuItem.css({
										borderBottom: 'none'
									});
								}
							}

							if (item.subGroup) {
								menuItem.append('<span class="control-icons ico-up" style="transform: rotateZ(90deg);width: 20px;height: 20px;position: absolute;right: 0;"></span>');
								menuItem.on('mouseenter', function () {
									removeMenu(level);
									// background-color: #aec3d4;
									createSubMenu(mask, menuItem[0], item.groups, level + 1);
								});
							} else {
								menuItem.on('click', function () {
									item.execute(item);
								});

								menuItem.on('mouseenter', function () {
									removeMenu(level);
								});
							}

							menu.append(menuItem);
						});
					});
				}

				function decideMainPosition(event, menuElement) {
					var doc = document.body;
					var docLeft = (window.pageXOffset || doc.scrollLeft) -
							(doc.clientLeft || 0),
						docTop = (window.pageYOffset || doc.scrollTop) -
							(doc.clientTop || 0),
						elementSize = decideMenuSize(menuElement[0]),
						elementWidth = elementSize.width,
						elementHeight = elementSize.height;
					var docWidth = doc.clientWidth + docLeft,
						docHeight = doc.clientHeight + docTop,
						totalWidth = elementWidth + event.pageX,
						totalHeight = elementHeight + event.pageY,
						left = Math.max(event.pageX - docLeft, 0),
						top = Math.max(event.pageY - docTop, 0);

					if (totalWidth > docWidth) {
						left = left - (totalWidth - docWidth);
					}

					if (totalHeight > docHeight) {
						top = top - (totalHeight - docHeight);
					}

					return {
						left: left,
						top: top
					};
				}

				function decideSubPosition(owner, menu) {
					var doc = document.body;
					var rect = owner.getBoundingClientRect();
					var docLeft = (window.pageXOffset || doc.scrollLeft) -
							(doc.clientLeft || 0),
						docTop = (window.pageYOffset || doc.scrollTop) -
							(doc.clientTop || 0),
						elementSize = decideMenuSize(menu),
						elementWidth = elementSize.width,
						elementHeight = elementSize.height;
					var docWidth = doc.clientWidth + docLeft,
						docHeight = doc.clientHeight + docTop,
						totalWidth = elementWidth + rect.left + rect.width,
						totalHeight = elementHeight + rect.top;

					if (totalWidth > docWidth) {
						menu.style.left = 'initial';
						menu.style.right = (docWidth - rect.left) + 'px';
					}

					if (totalHeight > docHeight) {
						menu.style.top = 'initial';
						menu.style.bottom = (docHeight - rect.top - rect.height) + 'px';
					}
				}

				function parsePixelValue(str) {
					if (str) {
						return Number.parseFloat(str.substring(0, str.length - 2));
					}

					return 0;
				}

				function decideMenuSize(menuElement) {
					var css = window.getComputedStyle(menuElement),
						elementWidth = menuElement.scrollWidth,
						elementHeight = menuElement.scrollHeight;

					if (menuElement.offsetWidth > elementWidth) {
						elementWidth = menuElement.offsetWidth;
					}

					if (menuElement.offsetHeight > elementHeight) {
						elementHeight = menuElement.offsetHeight;
					}

					elementHeight += parsePixelValue(css.marginTop);
					elementHeight += parsePixelValue(css.marginBottom);

					elementWidth += parsePixelValue(css.marginLeft);
					elementWidth += parsePixelValue(css.marginRight);

					return {
						width: elementWidth,
						height: elementHeight
					};
				}
			}

			function link(scope, element, attrs) {
				element.on('contextmenu', function (event) {
					event.preventDefault();
					// fix parallel conflict between context menu and async selectedDimensionIds API in ige engine
					modelWdeViewerObserverService.disable();

					scope.$eval(attrs.modelWdeViewerContextMenu).then(function (items) {
						scope.ctrl.createContextMenu(event, items);
						modelWdeViewerObserverService.enable();
					});
				});

				scope.$on('$destroy', function () {
					element.off('contextmenu');
				});

				scope.ctrl.attrs = attrs;
			}
		}
	]);

})(angular);

