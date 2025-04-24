/*
 * $Id: select-handler.js 619975 2021-01-14 16:53:12Z uestuenel $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var popupOptions = null;

	angular.module('platform').directive('platformSelectHandler', handler);

	handler.$inject = ['$sanitize', '_', '$injector', 'basicsLookupdataPopupService', 'keyCodes', '$compile'];

	function handler($sanitize, _, $injector, basicsLookupdataPopupService, keyCodes, $compile) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) { // jshint ignore:line
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

				/**
				 * @ngdoc function
				 * @name getDisplayedItems
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Returns the array of items to display. Usually, this is the `options.items` array,
				 *              but if an `options.displayedItems` array is provided, it will be returned instead.
				 * @returns {*|Array}
				 */
				function getDisplayedItems() {
					return options.displayedItems || options.items;
				}

				if (!options.items) {
					options.items = [];
				}

				if (_.isString(options.items)) {
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
					var expression = (inGrid ? 'options' : (attrs.options || (attrs.config + '.options'))) + '.items';

					unregister.push(scope.$watchCollection(expression, function () {
						// re-select item from updated item list
						updateData();
					}, true));
				}

				ctrl.$render = function () {
					var value = _.isNull(ctrl.$viewValue) || _.isUndefined(ctrl.$viewValue) ? '' : formatItemDisplay(ctrl.$viewValue);

					elem.text(value);
					elem.attr('title', value);
				};

				/**
				 * @ngdoc function
				 * @name formatItemDisplay
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Creates a string that represents an item in the selector.
				 * @param item The item.
				 * @returns The string representation of the item.
				 */
				function formatItemDisplay(item) {
					if (options.displayTemplateProvider) {
						return options.displayTemplateProvider(item);
					} else {
						return _.get(item, options.displayMember);
					}
				}

				/**
				 * @ngdoc function
				 * @name formatItemTitleDisplay
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Creates a string that describes an item in the selector in its tooltip.
				 * @param item The item.
				 * @returns The string description of the item.
				 */
				function formatItemTitleDisplay(item) {
					if (options.titleTemplateProvider) {
						return options.titleTemplateProvider(item);
					} else {
						return formatItemDisplay(item);
					}
				}

				var group = elem.next('.input-group-btn');
				var button = group.children().first();
				var isElemClicked = false;

				button.on('click', openPopup); // dropdown button

				if(!options.navigationByKeyDisabled){
					button.on('keydown', popupKeyDown);
					button.on('keyup', popupKeyUp);
				}


				unregister.push(function () {
					button.off();
					elem.off();
				});

				/*
					click events on the search box makes difficulties because the popup container closes(blur).
					therefore, no blur-events needed.
				 */
				if (!options.showSearchfield) {
					button.on('blur', function () {
						if (!isElemClicked) {
							closePopup();
						}
						isElemClicked = false;
					});
				}

				function storeElemClicked() {
					isElemClicked = true;
				}

				function storeElemNotClicked() {
					isElemClicked = false;
				}

				var isEnabled = false;

				function enable() {
					if (!isEnabled) {
						elem.on('mousedown', storeElemClicked);
						elem.on('mouseup', storeElemNotClicked);
						elem.on('click', openPopup);
						if(!options.navigationByKeyDisabled){
							elem.on('keydown', popupKeyDown);
							elem.on('keyup', popupKeyUp);
						}
						isEnabled = true;
					}
				}

				function disable() {
					elem.off('mousedown', storeElemClicked);
					elem.off('mouseup', storeElemNotClicked);
					elem.off('click', openPopup);
					if(!options.navigationByKeyDisabled){
						elem.off('keydown', popupKeyDown);
						elem.off('keyup', popupKeyUp);
					}
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
				 * @methodOf platformSelectHandler
				 * @description This method handles keydown events in the control for controlling visibility of and
				 *              selection within the popup.
				 * @param event An object that contains some information about the event. A keyCode field is expected.
				 */
				function popupKeyDown(event) { // jshint ignore:line
					switch (event.keyCode) {
						case keyCodes.SPACE:
							event.preventDefault();
							event.stopPropagation();
							break;

						case keyCodes.ESCAPE:
							if (closePopup()) {
								event.preventDefault();
								event.stopPropagation();
							}
							break;

						case keyCodes.LEFT:
							event.preventDefault();
							event.stopPropagation();
							moveSelection(false, false);
							break;

						case keyCodes.UP:
							if (!inGrid || popupOptions) {
								event.preventDefault();
								event.stopPropagation();
								moveSelection(false, false);
							}
							break;

						case keyCodes.RIGHT:
							event.preventDefault();
							event.stopPropagation();
							moveSelection(true, false);
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
								popupOptions.scope.rt$selectItem(_.find(getDisplayedItems(), popupOptions.scope.preselectedItem));
							}
							break;
					}
				}

				/**
				 * @ngdoc function
				 * @name popupKeyUp
				 * @function
				 * @methodOf platformSelectHandler
				 * @description This method handles keyup events in the control for controlling visibility of and
				 *              selection within the popup.
				 * @param event An object that contains some information about the event. A keyCode field is expected.
				 */
				function popupKeyUp(event) {
					switch (event.keyCode) {
						case keyCodes.SPACE:
							event.preventDefault();
							event.stopPropagation();
							openPopup();
							break;
					}
				}

				/**
				 * @ngdoc function
				 * @name moveSelection
				 * @function
				 * @methodOf platformSelectHandler
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
				 * @methodOf platformSelectHandler
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

						if (getDisplayedItems()[index + (forward ? 1 : -1)] && getDisplayedItems()[index + (forward ? 1 : -1)].hasOwnProperty('disabled')) {
							// not selectable, because is disabled
							index = index + (forward ? 1 : -1);
						}

						var result = index + (forward ? 1 : -1) * actualDelta;

						if (result < 0) {
							if (result === -actualDelta) {
								result = getDisplayedItems().length - 1;
							} else {
								result = 0;
							}
						} else if (result >= getDisplayedItems().length) {
							if (result === getDisplayedItems().length - 1 + actualDelta) {
								result = 0;
							} else {
								result = getDisplayedItems().length - 1;
							}
						}
						return result;
					}
				}

				/**
				 * @ngdoc function
				 * @name selectItem
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Selects an item specified in relative terms to the current selection. In other words,
				 *              moves the selection along the list of available items. The method treats the list as a
				 *              ring list, with the first element following after the last one.
				 * @param next Indicates whether the movement takes place in increasing index order.
				 * @param delta Indicates the number of items by which to displace the index. This parameter is
				 *              optional. The default value is `1`.
				 */
				function selectItem(next, delta) {
					if (!ctrl.$viewValue) {
						next = getDisplayedItems()[0];
					} else {
						var newIndex = computeMovedSelectionIndex(_.findIndex(getDisplayedItems(), ctrl.$viewValue), next, delta);
						next = getDisplayedItems()[newIndex];
					}
					if (next) {
						ctrl.$setViewValue(next);
						ctrl.$render();
						ctrl.$commitViewValue();
					}
				}

				/**
				 * @ngdoc function
				 * @name closePopup
				 * @function
				 * @methodOf platformSelectHandler
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

				/*
					the following keys can come from outside:
					cssClassLi: set css for li-element. e.g. divider-class.
					showButton: e.g. show divider-style = dont need a button-element in markup.
					cssClassButton:  css-class for button. We can add an icon to button e.g.
					title: is title-key not set, then content is title, too.
					popupCssClass: css-class for main-<ul>.

					showSearchfield: show a searchfield.
				 */

				var itemMarkup = [
					'<li id="combobox{{index}}" data-ng-class="rt$getListItemClass({{itemId}})" class="{{cssClassLi}}" tabindex="0" >',
					'<button data-ng-if="{{showButton}}" data-ng-mousedown="rt$itemMousedown({{itemId}}, $event)" data-ng-click="rt$click({{itemId}}, $event)" data-ng-mouseenter="rt$preselectItem({{itemId}})" data-ng-class="rt$getItemCssClasses({{itemId}})" ' +
					'class="{{cssClassButton}}" title="{{title}}" {{disabled}}>' +
					'{{content}}' +
					'</button>',
					'</li>'
				].join('');

				var ulMarkup = '<ul class="flex-element select-popup overflow {{popupCssClass}}">';

				// fill li's and li content
				var setItemListHTMLMarkup = function (items, markup) {

					var itemTemplate = '';

					angular.forEach(items, function (item, index) {
						/*
							at the moment 3 types:
							- default-type: item. Button as usual.
							- title
							- divider
						 */
						var isTitle = (item.type && item.type === 'title');
						var isDivider = (item.type && item.type === 'divider');
						var text = formatItemTitleDisplay(item);
						text = _.isString(text) ? $sanitize(text) : text;  // rei@28.10.21 prevent xss attacks

						itemTemplate = itemMarkup;

						itemTemplate = itemTemplate.replace('{{showButton}}', !isDivider);
						itemTemplate = itemTemplate.replace('{{cssClassLi}}', item.cssClassLi || '');
						itemTemplate = itemTemplate.replace('{{index}}', index); // need for e2e?

						/*
							check if id's om items are an string variable or not.
						 */
						var idvalue;
						if (_.isString(_.get(item, options.valueMember))) {
							idvalue = '\'' + _.get(item, options.valueMember) + '\'';
						} else {
							idvalue = _.get(item, options.valueMember);
						}

						itemTemplate = itemTemplate.replace(/{{itemId}}/g, idvalue);
						itemTemplate = itemTemplate.replace('{{cssClassButton}}', item.cssClassButton || '');
						itemTemplate = itemTemplate.replace('{{title}}', item.toolTipText ? item.toolTipText : text);
						itemTemplate = itemTemplate.replace('{{disabled}}', isTitle ? 'disabled' : '');
						itemTemplate = itemTemplate.replace('{{content}}', text);

						markup.push(itemTemplate);
					});

					return markup;
				};

				var getHtmlListMarkup = function (items) {

					var markup = [];
					markup.push(ulMarkup.replace('{{popupCssClass}}', options.popupCssClass || ''));

					setItemListHTMLMarkup(items, markup);

					markup.push('</ul>');

					return markup.join('');
				};

				var htmlMarkup = function () {

					var arrayMarkup = [
						'<div class="flex-element flex-box generic-popup overflow-hidden flex-column select-handler-wrapper" platform-navigate-list-items list-items-selector="\'.select-handler-wrapper\'">'
					];

					if (options.showSearchfield) {
						// searchfield is avaible
						arrayMarkup.push('<input type="text" placeholder="{{\'cloud.desktop.sdGoogleSearchFilter\' | translate}}" autofocus class="form-control" data-ng-keyup="rt$handleFilter($event)" tabindex="0">');
					}

					var items = options.displayedItems || options.items;

					arrayMarkup.push(getHtmlListMarkup(items));

					arrayMarkup.push('</div>');

					return arrayMarkup.join('');
				};

				var getItemInSelectBox = function (id) {
					return _.find(popupOptions.scope.options.items, [popupOptions.scope.options.valueMember, id]);
				};

				/**
				 * @ngdoc function
				 * @name openPopup
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Toggles the visibility of the dropdown list.
				 * @returns boolean Always returns `false`.
				 */
				function openPopup() {
					button.focus(); // dropdown button

					if (!closePopup()) {
						// options.popupOptions --> initializable from the outside. Attributes only for popup-container
						popupOptions = _.assign({
							scope: inGrid ? scope : scope.$new(),
							options: options,
							focusedElement: elem.parent(),
							relatedTarget: elem.parent(),
							template: htmlMarkup(),
							width: 0,
							height: 0,
							plainMode: true,
							hasDefaultWidth: true, // width from popup-container depends on the content
							containerClass: 'dropdown-container'
						}, options.popupOptions);
						/*
							filter list-items via searchfield
						 */
						popupOptions.scope.rt$handleFilter = function (e) {
							e.stopPropagation();

							// get value from input-field
							var filterValue = angular.element(e.target).val().toLowerCase();

							// get all the items for searchform items
							var list = angular.copy(getDisplayedItems());

							// filter items by searched value from input fieled
							_.remove(list, function (item) {
								if (item.type !== 'title') {
									return !_.includes(_.get(item, options.displayMember).toLowerCase(), filterValue);
								}
							});

							if (options.group && options.group.groupById) {

								/*
										scenario while searching: if existing titles with associated items( --> group), and the items in a group are filtered(no item in a group is existing) -->
										then, the groupname/title has to be removed.

										user can set in option group and groupById:
											group: {
												groupById: 'accessLevel'
											}
								 */

								var groups = _.filter(list, function (item) {
									return item.childId;
								});

								_.find(groups, function (item) {
									// return item.childId;
									if (!_.some(list, [options.group.groupById, item.childId])) {
										_.remove(list, ['childId', item.childId]);
									}
								});
							}

							// update content from selectbox
							// compile is needed for the js-events
							angular.element(e.target).next().replaceWith($compile(getHtmlListMarkup(list))(popupOptions.scope));
						};

						popupOptions.scope.rt$handleClick = function (e) {
							e.stopPropagation();
							storeElemClicked();
						};

						popupOptions.scope.rt$getListItemClass = function (itemID) {
							var item = getItemInSelectBox(itemID);
							var css = 'e2e-combo-box-item';
							if (popupOptions.scope.additionalCss) {
								// if e.g. a integer-variable -> error for toLowerCase()
								css = css + '-' + _.get(item, options.valueMember).toString().toLowerCase();
							}

							return css;
						};

						popupOptions.scope.rt$getItemCssClasses = function (itemID) {
							var item = getItemInSelectBox(itemID);

							var isSelected = popupOptions.scope.preselectedItem === item;
							var additionalCss = popupOptions.scope.additionalCss ? ' ' + popupOptions.scope.additionalCss + _.get(item, options.valueMember).toString().toLowerCase() : '';

							return additionalCss + (isSelected ? ' selected' : '');
						};

						popupOptions.scope.rt$itemMousedown = function (itemID, $event) {
							if ($event.which === 1) {
								popupOptions.scope.rt$selectItem(getItemInSelectBox(itemID));
							}
						};

						popupOptions.scope.rt$click = function (itemID) {
							popupOptions.scope.rt$selectItem(getItemInSelectBox(itemID));
						};

						popupOptions.scope.options = options;
						popupOptions.scope.preselectedItem = ctrl.$viewValue;

						popupOptions.scope.formatItemDisplay = function (item) {
							return formatItemDisplay(item);
						};

						popupOptions.scope.formatItemTitleDisplay = function (item) {
							return formatItemTitleDisplay(item);
						};

						popupOptions.scope.rt$scrollPreselectionIntoView = function () {
							var item = document.getElementById('comboItem' + _.findIndex(getDisplayedItems(), popupOptions.scope.preselectedItem));
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

						popupOptions.scope.rt$preselectItem = function (itemID) {
							var item = getItemInSelectBox(itemID);

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
								popupOptions.scope.preselectedItem = getDisplayedItems()[computeMovedSelectionIndex(_.findIndex(getDisplayedItems(), popupOptions.scope.preselectedItem), forward, delta)];
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

					return false;
				}
			}
		};
	}

})(angular);