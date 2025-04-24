(function () {
	'use strict';

	angular.module('platform').directive('toolbarDirective', toolbarDirective);

	toolbarDirective.$inject = ['toolbarCommonService', '$compile'];

	function toolbarDirective(toolbarCommonService, $compile) {
		return {
			restrict: 'AE',
			scope: {
				data: '='
			},
			link: function ($scope, element) {
				var actionItems = null;

				function getToolbarObject() {
					// gettools from servicestatusBarLink
					return toolbarCommonService.getById('id', $scope.data.id);
				}

				function initActionList() {
					$scope.initActionItemsToolbar = function (link) {
						actionItems = link;
						toolbarCommonService.setActionItemListFunctions($scope.data.id, link);
						link.setFields(getToolbarObject());
					};
				}

				// initialize Action-Item-List
				initActionList();

				var template = '<div platform-toolbar-resize platform-action-item-list data-set-link="initActionItemsToolbar(link)" class="toolbar-resize-wrapper"></div>';
				element.append($compile(template)($scope));
			}
		};
	}

	angular.module('platform').directive('platformToolbarResize', platformToolbarResize);

	platformToolbarResize.$inject = ['$compile', 'basicsLookupdataPopupService', '$timeout', 'toolbarCommonService', '$window'];

	function platformToolbarResize($compile, basicsLookupdataPopupService, $timeout, toolbarCommonService, $window) {
		return {
			restrict: 'AE',
			link: function (scope, element) {

				var instance;
				var hiddenItems = [];
				scope.dropdownButtonFn = function (event) {
					var actionItemsForPopup = null;
					var popupOptions = {
						cssClass: 'toolbar-overflow-showimages',
						items: angular.copy(toolbarCommonService.getById('id', scope.data.id).items)
					};

					// hiddenItems --> list of items in popup.
					for (var i = 0; i < popupOptions.items.length; i++) {
						if (i < hiddenItems[0]) {
							popupOptions.items[i].visible = false;
						} else if (popupOptions.items[i].visible !== false) { // for compatibility, some toolbar item will show in some modules, but will not in others.
							popupOptions.items[i].visible = true;
						}
					}

					// init action-list-items
					scope.initActionItemsPopupToolbar = function (link) {
						actionItemsForPopup = link;
						link.setFields(popupOptions);
					};

					var template = '<div platform-action-item-list data-set-link="initActionItemsPopupToolbar(link)"></div>';

					var toolbar = element[0].querySelector('ul.right-side');

					instance = basicsLookupdataPopupService.toggleLevelPopup({
						multiPopup: false,
						plainMode: true,
						hasDefaultWidth: false,
						scope: scope,
						focusedElement: $(event.currentTarget),
						template: template,
						maxHeight: 600,
					});

					if (!_.isNil(instance)) {
						instance.opened
							.then(function () {
								$timeout(function () {
									scope.$digest();
								}, 0);
							});
					}
				};

				function putInOverflowContainer(toolbarItems, j) {
					while (j < toolbarItems.length) {
						toolbarItems[j].classList.remove('show');
						toolbarItems[j].classList.add('hide');
						hiddenItems.push(j);
						j++;
					}
				}

				function doToolbarResize() {

					if (instance && !instance.isClosed) {
						instance.close();
					}

					var toolbar = element[0].querySelector('ul.right-side');

					var toolbarItems = element[0].querySelectorAll('ul.right-side > li:not(.more)');

					// add button for click popupmenu
					if (toolbar.querySelector('.more') === null) {
						var content = $compile('<li class="item-list-element more"><button type="button" class="dropdown-toggle tlb-icons menu-button ico-menu" data-ng-click="dropdownButtonFn($event)"></button></li>')(scope);
						angular.element(toolbar).append(content);
					}

					var moreLi = toolbar.querySelector('.more');

					var stopWidth = 30; // overflow-button-width: 30

					var primaryWidth = toolbar.offsetWidth;
					hiddenItems.length = 0;

					for (var j = 0; j < toolbarItems.length; j++) {
						toolbarItems[j].classList.remove('hide');

						if (primaryWidth >= stopWidth + toolbarItems[j].offsetWidth) {
							stopWidth += toolbarItems[j].offsetWidth;
							toolbarItems[j].classList.remove('hide');
							toolbarItems[j].classList.add('show');
						} else {
							putInOverflowContainer(toolbarItems, j);
							moreLi.classList.remove('hide');
							break;
						}
					}

					if (hiddenItems.length === 0) {
						moreLi.classList.add('hide');
					}
				}

				var angularWindow = angular.element($window);
				angularWindow.bind('resize', doToolbarResize);

				var splitter;
				var watchForUpdateToolsHTML = scope.$watch(function () {
					// check if element in DOM.
					return element.find('ul.right-side > li').is(':visible');
				}, function (newValue, oldValue) {
					if (newValue !== oldValue) {
						// if splitter resize
						splitter = element.closest('.k-splitter').data('kendoSplitter');
						if (splitter) {
							splitter.bind('resize', doToolbarResize);
						}

						doToolbarResize();
					}
				});

				scope.$on('$destroy', function () {
					if (angularWindow) {
						angularWindow.unbind();
					}
					if (splitter) {
						splitter.unbind();
					}

					watchForUpdateToolsHTML();
				});
			}
		};
	}
})();