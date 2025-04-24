/*
 * $Id: input-select-handler.js 590054 2020-06-08 15:20:29Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var popupOptions = null;

	angular.module('platform').directive('platformInputSelectHandler', handler);

	handler.$inject = ['_', '$injector', 'basicsLookupdataPopupService', 'keyCodes'];

	function handler(_, $injector, basicsLookupdataPopupService, keyCodes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) { // jshint ignore: line
				var inGrid = !_.isUndefined(attrs.grid);
				var config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null) || {};
				var options = inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null)) || {};
				var unregister = [];

				function updateData(data) {
					if (!_.isUndefined(data)) {
						options.items = data;
					}
					if (!_.isUndefined(ctrl.$modelValue) && ctrl.$modelValue !== null && !_.isNaN(ctrl.$modelValue)) {
						ctrl.$setViewValue(ctrl.$formatters[0](ctrl.$modelValue));
						ctrl.$render();
					}
				}

				function loadData(item) {
					var entity = item || (attrs.entity && scope.$eval(attrs.entity)) || null;
					var result = options.service[options.serviceDataFunction || options.serviceMethod](entity);

					if (_.isArray(result)) {
						updateData(result);
					} else {
						result.then(function (data) {
							updateData(data);
						});
					}
				}

				if (!options.items) {
					options.items = [];
				}

				if (_.isString(options.items)) { // items from constant, value
					options.items = $injector.get(options.items);
				}

				if (_.isString(options.serviceName)) { // get service
					options.service = $injector.get(options.serviceName);
				}

				if (options.service) { // get items from a service
					if (_.isString(options.serviceMethod) || _.isString(options.serviceDataFunction)) {
						if (!inGrid && options.serviceReload) {
							unregister.push(scope.$watch(attrs.entity || 'entity', function (newValue) {
								if (newValue) {
									loadData(newValue);
								}
							}));
						} else {
							loadData();
						}
					} else {
						options.service.loadData()
							.then(function () {
								updateData(options.service.getList());
							});
					}
				}

				if (options.watchItems) {
					unregister.push(scope.$watchCollection((attrs.options || 'config.options') + '.items', function (newItems) {
						// re-select item from updated item list
						updateData(_.isArray(newItems) ? newItems : null);
					}));
				}

				ctrl.$render = function () {
					var value = _.isNull(ctrl.$viewValue) || _.isUndefined(ctrl.$viewValue) || _.isNaN(ctrl.$viewValue) ? '' : formatItemDisplay(ctrl.$viewValue, false);

					elem.val(options.controlFormatter ? options.controlFormatter(value) : value);
				};

				/**
				 * @ngdoc function
				 * @name formatItemDisplay
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Creates a string that represents an item in the selector.
				 * @param item The item.
				 * @param inList Indicates whether the string representation will be shown in the drop-down list. The
				 *               drop-down list always uses the `displayMember` from the `options`, whereas this depends
				 *               on the value of the `modelIsObject` option for the text box of the selector.
				 * @returns The string representation of the item.
				 */
				function formatItemDisplay(item, inList) {
					if (options.displayTemplateProvider) {
						return options.displayTemplateProvider(item);
					} else {
						return (inList || _.isObject(item)) && options.displayMember ? (_.get(item, options.displayMember) || item) : item;
					}
				}

				/**
				 * @ngdoc function
				 * @name formatItemTitleDisplay
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Creates a string that describes an item in the selector in its tooltip.
				 * @param item The item.
				 * @returns The string description of the item.
				 */
				function formatItemTitleDisplay(item) {
					if (options.titleTemplateProvider) {
						return options.titleTemplateProvider(item);
					} else {
						return formatItemDisplay(item, true);
					}
				}

				var group = elem.next('.input-group-btn');
				var button = group.children().first();

				button.on('click', openPopup);
				button.on('keydown', popupKeyDown);
				button.on('keyup', popupKeyUp);
				button.on('blur', closePopup);

				unregister.push(function () {
					button.off();
					elem.off();
				});

				var isEnabled = false;

				function enable() {
					if (!isEnabled) {
						elem.on('keydown', popupKeyDown);
						elem.on('keyup', popupKeyUp);
						isEnabled = true;
					}
				}

				function disable() {
					elem.off('keydown', popupKeyDown);
					elem.off('keyup', popupKeyUp);
					isEnabled = false;
				}

				function isStaticallyDisabled() {
					if (!_.isUndefined(attrs.readonly)) {
						return attrs.readonly || (attrs.readonly === '');
					}
					if (!_.isUndefined(attrs.disabled)) {
						return attrs.disabled || (attrs.disabled === '');
					}

					return false;
				}

				function updateEnabledStatus(isDisabled) {
					if (isDisabled || isStaticallyDisabled()) {
						disable();
					} else {
						enable();
					}
				}

				scope.attrs = attrs;
				updateEnabledStatus(isStaticallyDisabled());
				unregister.push(scope.$watch('attrs.readonly', updateEnabledStatus));
				unregister.push(scope.$watch('attrs.disabled', updateEnabledStatus));
				if (attrs.ngReadonly) {
					scope.$watch(attrs.ngReadonly, updateEnabledStatus);
				}

				unregister.push(scope.$on('$destroy', function () {
					closePopup();
					_.over(unregister)();
					unregister = null;
				}));

				/**
				 * @ngdoc function
				 * @name popupKeyDown
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description This method handles keydown events in the control for controlling visibility of and
				 *              selection within the popup.
				 * @param event An object that contains some information about the event. A keyCode field is expected.
				 */
				function popupKeyDown(event) { // jshint ignore:line
					switch (event.keyCode) {
						case keyCodes.SPACE:
							if (event.ctrlKey) {
								event.preventDefault();
								event.stopPropagation();
							}
							break;

						case keyCodes.ESCAPE:
							if (popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								closePopup();
							}
							break;

						case keyCodes.UP:
							if (!inGrid || popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								moveSelection(false, false);
							}
							break;

						case keyCodes.DOWN:
							if (!inGrid || popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								moveSelection(true, false);
							}
							break;

						case keyCodes.PAGE_UP:
							if (!inGrid || popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								moveSelection(false, true);
							}
							break;

						case keyCodes.PAGE_DOWN:
							if (!inGrid || popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								moveSelection(true, true);
							}
							break;

						case keyCodes.ENTER:
							if (popupOptions && popupOptions.scope && popupOptions.scope.preselectedItem) {
								event.preventDefault();
								event.stopPropagation();
								popupOptions.scope.rt$selectItem(_.find(options.items, popupOptions.scope.preselectedItem));
							}
							break;
					}
				}

				/**
				 * @ngdoc function
				 * @name popupKeyUp
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description This method handles keyup events in the control for controlling visibility of and
				 *              selection within the popup.
				 * @param event An object that contains some information about the event. A keyCode field is expected.
				 */
				function popupKeyUp(event) {
					switch (event.keyCode) {
						case keyCodes.SPACE:
							if (event.ctrlKey) {
								event.preventDefault();
								event.stopPropagation();
								openPopup();
							}
							break;
					}
				}

				/**
				 * @ngdoc function
				 * @name moveSelection
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Selects an item specified in relative terms to the current selection. In other words,
				 *              moves the selection along the list of available items. The method treats the list as a
				 *              ring list, with the first element following after the last one. This method refers to
				 *              the relevant selection influenced by the current input focus - that is, either the
				 *              actual selection in the control or the preselection in the dropdown list.
				 * @param forward Indicates whether the movement takes place in increasing index order.
				 * @param bigChange If true, several items are skipped, otherwise a directly adjacent item is selected.
				 */
				function moveSelection(forward, bigChange) {
					if (popupOptions && popupOptions.scope) {
						popupOptions.scope.rt$movePreselection(forward, bigChange ? 10 : 1);
					} else {
						selectItem(forward, bigChange ? 10 : 1);
					}
				}

				/**
				 * @ngdoc function
				 * @name computeMovedSelectionIndex
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Computes an item index relatively to another item index. In other words, moves an index
				 *              pointer (such as a *selection*) along the list of available items. The method treats the
				 *              list as a ring list, with the first element following after the last one.
				 * @param index The original index.
				 * @param forward Indicates whether the movement takes place in increasing index order.
				 * @param delta Indicates the number of items by which to displace the index. This parameter is
				 *              optional. The default value is `1`.
				 * @returns The computed item index.
				 */
				function computeMovedSelectionIndex(index, forward, delta) {
					var actualDelta = delta ? Math.floor(Math.abs(delta)) : 1;

					if (index === -1) {
						return 0;
					} else {
						var result = index + (forward ? 1 : -1) * actualDelta;
						if (result < 0) {
							if (result === -actualDelta) {
								result = options.items.length - 1;
							} else {
								result = 0;
							}
						} else if (result >= options.items.length) {
							if (result === options.items.length - 1 + actualDelta) {
								result = 0;
							} else {
								result = options.items.length - 1;
							}
						}
						return result;
					}
				}

				/**
				 * @ngdoc function
				 * @name selectItem
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Selects an item specified in relative terms to the current selection. In other words,
				 *              moves the selection along the list of available items. The method treats the list as a
				 *              ring list, with the first element following after the last one.
				 * @param next Indicates whether the movement takes place in increasing index order.
				 * @param delta Indicates the number of items by which to displace the index. This parameter is
				 *              optional. The default value is `1`.
				 */
				function selectItem(next, delta) {
					if (!ctrl.$viewValue) {
						next = options.items[0];
					} else {
						var newIndex = computeMovedSelectionIndex(_.findIndex(options.items, ctrl.$viewValue), next, delta);
						next = options.items[newIndex];
					}
					ctrl.$setViewValue(next);
					ctrl.$render();
					ctrl.$commitViewValue();
				}

				/**
				 * @ngdoc function
				 * @name closePopup
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Hides the drowdown list.
				 * @returns A truthy value if the operation was successful, otherwise (for instance, because the
				 *          dropdown is not being displayed) a falsy value.
				 */
				function closePopup() {
					var open = popupOptions && popupOptions.instance;

					if (open) {
						group.removeClass('open');
						popupOptions.instance.close();

						elem.focus();
					}

					return open;
				}

				/**
				 * @ngdoc function
				 * @name openPopup
				 * @function
				 * @methodOf platformInputSelectHandler
				 * @description Toggles the visibility of the dropdown list.
				 * @returns Always returns `false`.
				 */
				function openPopup() {
					button.focus();

					if (!closePopup()) {
						popupOptions = {
							scope: inGrid ? scope : scope.$new(),
							options: options,
							focusedElement: elem.parent(),
							relatedTarget: elem.parent(),
							template: [
								'<ul class="flex-element input-select-popup" data-ng-class="options.popupCssClass" tabindex="-1">',
								'  <li data-ng-repeat="item in options.items track by $index" id="comboItem{{$index}}">',
								'    <button data-ng-mousedown="rt$itemMousedown(item, $event)" data-ng-mouseenter="rt$preselectItem(item)" data-ng-class="{\'selected\' : preselectedItem === item}" title="{{formatItemTitleDisplay(item)}}" data-ng-bind="formatItemDisplay(item)"></button>',
								'  </li>',
								'</ul>'].join(''),
							width: 0,
							height: 0,
							plainMode: true
						};

						popupOptions.scope.rt$itemMousedown = function (item, $event) {
							if ($event.which === 1) {
								popupOptions.scope.rt$selectItem(item);
							}
						};

						popupOptions.scope.options = options;
						popupOptions.scope.preselectedItem = ctrl.$viewValue;

						popupOptions.scope.formatItemDisplay = function (item) {
							return formatItemDisplay(item, true);
						};

						popupOptions.scope.formatItemTitleDisplay = function (item) {
							return formatItemTitleDisplay(item);
						};

						popupOptions.scope.rt$scrollPreselectionIntoView = function () {
							var item = document.getElementById('comboItem' + _.findIndex(options.items, popupOptions.scope.preselectedItem));
							if (item) {
								var jqItem = angular.element(item);

								for (var current = item; current !== document; current = current.parentNode) {
									var cssProp = window.getComputedStyle(current).getPropertyValue('overflow');
									if (cssProp === 'auto') {
										var scrollableJqEl = angular.element(current);
										if (jqItem.position().top < 0) {
											scrollableJqEl.scrollTop(Math.max(0, scrollableJqEl.scrollTop() + jqItem.position().top - 10));
										} else if (jqItem.position().top + jqItem.height() >= current.clientHeight) {
											scrollableJqEl.scrollTop(jqItem.position().top + scrollableJqEl.scrollTop() - (current.clientHeight - jqItem.height() - 10));
										}
										break;
									}
								}
							}
						};

						popupOptions.scope.$watch('preselectedItem', popupOptions.scope.rt$scrollPreselectionIntoView);

						popupOptions.scope.rt$preselectItem = function (item) {
							if (popupOptions) {
								if (item) {
									popupOptions.scope.preselectedItem = item;
								} else {
									popupOptions.scope.preselectedItem = null;
								}
							}
						};

						popupOptions.scope.rt$movePreselection = function (forward, delta) {
							popupOptions.scope.$apply(function () {
								popupOptions.scope.preselectedItem = options.items[computeMovedSelectionIndex(_.findIndex(options.items, popupOptions.scope.preselectedItem), forward, delta)];
							});
						};

						popupOptions.scope.rt$selectItem = function (item) {
							if (popupOptions) {
								closePopup();

								ctrl.$setViewValue(item);
								ctrl.$render();
								ctrl.$commitViewValue();

								setTimeout(function () {
									elem.focus();
								}, 100);
							}
						};

						group.addClass('open');
						popupOptions.instance = basicsLookupdataPopupService.showPopup(popupOptions);

						popupOptions.instance.opened.then(function () {
							setTimeout(function () {
								if (popupOptions) {
									popupOptions.scope.rt$scrollPreselectionIntoView();
								}
							}, 100);
						});

						popupOptions.instance.closed.then(function () {
							group.removeClass('open');
							if (popupOptions) {
								if (popupOptions.scope && !inGrid) {
									popupOptions.scope.$destroy();
								}

								popupOptions = popupOptions.scope = popupOptions.instance = null;
							}
						});
					}
				}
			}
		};
	}
})(angular);