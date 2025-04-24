/**
 * @ngdoc directive
 * @name platform.directive:platformResizeableList
 * @element div
 * @restrict A
 * @priority
 * @description
 * Controls the menulist directive
 * <doc:example>
 * <doc:source>
 *     <div platform-resizeable-list ng-model="items"></div>
 * </doc:source>
 * </doc:example>
 */
(function (angular) {
	'use strict';

	function platformCollapsableList(_, $window, $timeout) {
		var w;
		var directive = {};

		directive.restrict = 'A';
		directive.require = 'ngModel';
		directive.link =
			function (scope, ele, attrs, ngModelCtrl) {
				w = angular.element($window);

				function getElementWidth() {
					return ele.width();
				}

				var overFlowSize;

				function checkTitleMarkup(maxWidth) {
					// if title and the two buttons dont fit, then title gets the css-class 'ellipsis'
					if (maxWidth < 0) {
						var titleElem = ele[0].querySelector('.title');
						if (titleElem) {
							titleElem.classList.add('ellipsis');
						}
					}
				}

				function filterTypeDivider() {
					ngModelCtrl.$modelValue.items = ngModelCtrl.$modelValue.items.filter(function (elem, index, self) {
						if (elem.type === 'divider') {
							if (elem.type === 'divider' && (self[index + 1] && self[index + 1].type !== 'divider')) {
								return elem;
							}
						} else {
							return elem;
						}
					});
				}

				// return the toolbar-elements
				function getCollapsableElements() {
					var elems = ele[0].querySelectorAll('.collapsable');
					return elems;
				}

				// dont show the element, if exist only one element. and this element is a divider.
				function checkPossibleElementsInToolbar() {
					var collapsableElements = getCollapsableElements();
					var toReturn = true;
					if (collapsableElements.length === 0 || (collapsableElements.length === 1 && collapsableElements[0].classList.contains('divider'))) {
						toReturn = false;
					}
					return toReturn;
				}

				/* jshint -W074 */
				function calcSize() {
					if (!ngModelCtrl.$modelValue) {
						return;
					}

					var eleW = [];

					/*
					for UseCase, when the divider-type appears in succession in items-array.
					 */
					filterTypeDivider();

					/*
					the title gets the css-class 'ellipsis' if there are only 2 buttons left in the container.
					 */
					var titleElem = ele[0].querySelector('.title');
					if (titleElem) {
						titleElem.classList.remove('ellipsis');
					}

					var fix = ele[0].querySelectorAll('.fix');

					overFlowSize = 41; // width of button[platform-fullsize-button] and margin from h2.title

					for (var i = 0; i < fix.length; i++) {
						if (!angular.element(fix[i]).is(':visible') && angular.element(fix[i]).find('button').length > 0) {
							overFlowSize += angular.element(fix[i]).find('button').outerWidth(true);
						} else {
							overFlowSize += fix[i].offsetWidth;
						}
					}

					var maxWidth = getElementWidth() - overFlowSize;
					var sumWith = 0;

					checkTitleMarkup(maxWidth);

					var wrappedQueryResult = getCollapsableElements();
					var displayedTools = _.filter(ngModelCtrl.$modelValue.items, {isDisplayed: true});

					var possibleItems = checkPossibleElementsInToolbar();

					if (wrappedQueryResult && (eleW.length === 0 || eleW.length !== wrappedQueryResult.length)) {
						angular.forEach(wrappedQueryResult, function (child) {
							/*
								you can't get the correct width from an element, that is not visible(display: none).
						      therefore, get width from child.
							 */
							if (!angular.element(child).is(':visible') && angular.element(child).find('button').length > 0) {
								var widthOfChildButtons = 0;
								angular.forEach(angular.element(child).find('button'), function (buttonchild) {
									if (angular.element(buttonchild).outerWidth() > 0) {
										widthOfChildButtons += angular.element(buttonchild).outerWidth();
									}
								});
								eleW.push(widthOfChildButtons);
							} else {
								eleW.push(child.offsetWidth);
							}
						});
					}

					for (i = 0; i < eleW.length; i++) {
						if (maxWidth >= (sumWith + eleW[i])) {
							sumWith += eleW[i];
							if (displayedTools && (i < displayedTools.length) && displayedTools[i] && displayedTools[i].type !== 'overflow-btn') {
								displayedTools[i].hideItem = false;
							}
						} else {
							break;
						}
					}

					/*
					the rest of the items get hideItem = true. dont show in the front.
					Unless there is an element and that is a divider. The variable possibleItems is then false.
					 */
					if (possibleItems) {
						while (i < displayedTools.length) {
							if (displayedTools && (i < displayedTools.length) && displayedTools[i] && displayedTools[i].type !== 'overflow-btn') {
								displayedTools[i].hideItem = true;
							}
							i++;
						}
					}

					modelValueProcess();
				}

				function modelValueProcess() {
					if (ngModelCtrl.$modelValue) {
						ngModelCtrl.$modelValue.version = ngModelCtrl.$modelValue.version !== undefined && ngModelCtrl.$modelValue.version !== null ? ++ngModelCtrl.$modelValue.version : Math.random();
						ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue);
						scope.$root.safeApply();
					}
				}

				function initList() {
					modelValueProcess();
				}

				var initListTimeout = $timeout(function () {
					// the calcuation for this element is in watch-function.
					initList();
				}, 500);

				w.bind('resize', calcSize);
				var splitter = ele.closest('.k-splitter').data('kendoSplitter');
				if (splitter) {
					splitter.bind('resize', calcSize);
				} else {
					$timeout(function () {
						splitter = ele.closest('.k-splitter').data('kendoSplitter');
						if (splitter) {
							splitter.bind('resize', calcSize);
						}
					});
				}

				/*
				The timeout in this directive is not executed in time.
				E.g. for a module that has 8 containers, this 500 ms is not enough. It is enough for a module with 3-4 containers.
				Therefore is exist a watch of the tools-element. Has menulist-directive rendered in DOM, then the watch call the function for the calculation.
				 */
				var watchForUpdateToolsHTML = scope.$watch(function () {
					// check if element in DOM.
					return ele.children('.tools').is(':visible');
				}, function (newValue, oldValue) {
					if (newValue !== oldValue) {
						calcSize();
					}
				});

				/*
				Needed to add an additional watch of the number of tools since switching sub container
				*/
				var watchForUpdateToolLengthHTML = scope.$watch(function () {
					// check if element in DOM.
					return ele.children('.tools').children().length;
				}, function (newValue, oldValue) {
					if (oldValue > 0 && newValue !== oldValue && ele.children('.tools').is(':visible')) {
						calcSize();
					}
				});

				scope.$on('$destroy', function () {
					if (w) {
						w.unbind();
					}
					if (splitter) {
						splitter.unbind();
					}

					$timeout.cancel(initListTimeout);

					watchForUpdateToolsHTML();
					watchForUpdateToolLengthHTML();
				});
			};

		return directive;
	}

	angular.module('platform').directive('platformCollapsableList', ['_', '$window', '$timeout', platformCollapsableList]);
})(angular);