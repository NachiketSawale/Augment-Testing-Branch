/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

/**
 * @ngdoc directive
 * @name platform.directive:platformAdjustLabelWidth
 * @element platformForm
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Change the selected html node when enter or tab is pressed, when the selected item changed we send a 'navigating' event.
 * when go to the end of html form, we send 'navigateToNextItem' try to tell the platformFormContainer to go to next item.
 * We even can use this directive in any kind of form, just add 'data-enter-stop' 'data-tab-stop' to any focusable html items.
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-adjust-label-width>
 form groups and rows
 </div>
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformFormNavigation', platformFormNavigation);

	platformFormNavigation.$inject = ['keyCodes', '_'];

	function platformFormNavigation(keyCodes, _) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				var keyCode;

				// check key down when tab or enter go to next focusable control
				function onKeyDown(e) {
					keyCode = e.keyCode;
					if (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.TAB) {
						// when enter or tab key pressed.
						e.stopPropagation();
						e.stopImmediatePropagation();
						e.preventDefault();

						if (e.ctrlKey && e.keyCode === keyCodes.ENTER) {
							// if enter & ctrl pressed, send a break link to textArea
							setTextAreaNewLine(e.target);
						} else if (e.shiftKey) {
							nextTabItem(true);
						} else {
							// tab or enter will call the next tab item function.
							nextTabItem();
						}
					}
				}

				element.on('keydown', onKeyDown);

				// set a new line to text area, when user press ctrl + enter
				function setTextAreaNewLine(element) {
					if (element.tagName === 'TEXTAREA') {
						var start = element.selectionStart;
						var end = element.selectionEnd;

						element.value = element.value.substring(0, start) + '\r\n' + element.value.substring(end);
						element.selectionStart = start + 1;
						element.selectionEnd = start + 1;
					}
				}

				// get all focusable items
				function getFocusables() {
					var elementFilter = '';

					if (keyCode === keyCodes.TAB) {
						// Select the element which itself is focusable or its children is focusable, skip the read only inputs, and marked as tabStop ture
						elementFilter = '[data-tabStop="true"]:focusable:not([readonly]), [data-tabStop="true"] :focusable:not([readonly])';
					} else {
						// Select the element which itself is focusable or its children is focusable, skip the read only inputs, and marked as enterStop ture
						elementFilter = '[data-enterStop="true"]:focusable:not([readonly]), [data-enterStop="true"] :focusable:not([readonly])';
					}

					return element.find(elementFilter);
				}

				// go to next focusable control
				function nextTabItem(prev) {
					var activeItem = element.find(':focus')[0];
					if (!activeItem) {
						return false;
					}

					// get next focusable index.
					var focusables = getFocusables();
					var currentFocusIndex = focusables.index(activeItem);
					var nextFocusIndex = currentFocusIndex + (prev ? -1 : 1);

					if (currentFocusIndex < 0) {
						// current element is not in focusables, auto focus on the next focusable item,
						// even is not included in th focusables.
						var allFocusables = element.find(':focusable');
						var activeIndex = allFocusables.index(activeItem);

						for (var i = activeIndex + 1; i < allFocusables.length; ++i) {
							nextFocusIndex = focusables.index(allFocusables[i]);
							if (nextFocusIndex >= 0) {
								break;
							}
						}

						// Can't find the next focusable item, take it as reach to the last row
						if (nextFocusIndex < 0) {
							nextFocusIndex = focusables.length - 1;
						}
					}

					if (prev) {
						if (nextFocusIndex !== -1) {
							focusables[nextFocusIndex].focus();
						} else {
							focusables[focusables.length - 1].focus();
						}
					} else {
						// focus on next item and emit events
						// when navigating a 'navigating' will emit
						// when want to navigate to next page a 'navigateToNextItem' will emit
						if (nextFocusIndex < focusables.length) {
							focusables[nextFocusIndex].focus();
						} else {
							var oldItem = angular.element(activeItem);

							if (scope.formOptions && scope.formOptions.onLeaveLastRow) {
								var continueNavigate = scope.formOptions.onLeaveLastRow(keyCode === keyCodes.ENTER, oldItem);

								if (continueNavigate) {
									focusables[0].focus();
								}
							} else {
								focusables[0].focus();
							}
						}
					}

					return true;
				}

				var unregister = [];

				unregister.push(scope.$on('$destroy', function () {
					element.off('keydown', onKeyDown);

					_.over(unregister)();
					unregister = null;
				}));
			}
		};
	}
})(angular);