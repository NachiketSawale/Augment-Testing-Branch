/*
 * $Id: mainview-subcontainer.js 625253 2021-02-26 12:57:37Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global $ */
	'use strict';

	mainViewSubContainerController.$inject = ['$scope', '$translate', '$q', 'platformToolbarService', '_', '$timeout', 'cloudDesktopHotKeyService'];

	function mainViewSubContainerController($scope, $translate, $q, platformToolbarService, _, $timeout, cloudDesktopHotKeyService) {
		var scope = $scope;

		function selectTab(isForward) {
			let startIndex = scope.subviewCtrl.activeTab;
			let nextIndex = isForward ? startIndex + 1 : startIndex - 1;
			if(nextIndex >= scope.subviewCtrl.content.length || nextIndex < 0) {
				nextIndex = isForward ? 0 : scope.subviewCtrl.content.length - 1;
			}

			scope.subviewCtrl.activeTab = nextIndex;
			// noinspection JSUnresolvedVariable
			scope.subviewCtrl.selectionChanged();
			scope.$emit('tabchanged');
		}

		cloudDesktopHotKeyService.register('focusTabForward', function () {
			if (scope.hasFocus && scope.subviewCtrl.content.length > 1) {
				selectTab(true);
			}
		});

		cloudDesktopHotKeyService.register('focusTabBackward', function () {
			if (scope.hasFocus && scope.subviewCtrl.content.length > 1) {
				selectTab(false);
			}
		});

		scope.disableNavigationShortCut = false;

		scope.setTools = function (tools, cached) {
			// refactoring of tool items to get the correct order.
			// Should be moved into the controllers, when all cotainers use a base controller.
			tools.items = platformToolbarService.getTools(scope.getContainerUUID(), tools.items, cached);
			tools.version = Math.random();
			tools.refreshVersion = Math.random();
			tools.update = function () {
				platformToolbarService.ensureOverflowButton(tools.items);
				tools.version += 1;
			};
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			scope.tools = tools;

			if (scope.hasFocus) {
				scope.unregisterToolbarShortcuts();
				scope.registerToolbarShortcuts();
			}
		};

		function findByClass(toolItem, cssClassArray) {
			var notFound = true;
			_.each(cssClassArray, function (CssClass) {
				if (CssClass === toolItem.iconClass) {
					notFound = false;
				}
			});
			return notFound;
		}

		scope.unregisterToolbarShortcuts = function unregisterToolbarShortcuts(shortcutsItems) {
			let shortcuts = Array.isArray(shortcutsItems) ? shortcutsItems :(scope.tools && Array.isArray(scope.tools.items) ? scope.tools.items : []);
			shortcuts.forEach(function (item) {
				if (cloudDesktopHotKeyService.hasHotKey(item.id) && item.fn) {
					// console.log(scope.getContainerUUID() + ' - Unregister hotkey: ' + item.id);
					cloudDesktopHotKeyService.unregister(item.id, item.fn);
					cloudDesktopHotKeyService.resetDescription(item.id);
				}
			});
		};

		scope.registerToolbarShortcuts = function registerToolbarShortcuts(shortcutsItems) {
			let shortcuts = Array.isArray(shortcutsItems) ? shortcutsItems :(scope.tools && Array.isArray(scope.tools.items) ? scope.tools.items : []);
			shortcuts.forEach(function(item) {
				if (cloudDesktopHotKeyService.hasHotKey(item.id) && item.fn) {
					// console.log(scope.getContainerUUID() + ' - Register hotkey: ' + item.id);
					cloudDesktopHotKeyService.register(item.id, item.fn, item.isDisabled, item.isDisplayed);
					cloudDesktopHotKeyService.setDescription(item.id, $translate.instant(item.caption));
				}
			});
		};

		scope.removeToolByClass = function removeToolByClass(cssClassArray) {
			if (scope.tools && scope.tools.items) {
				scope.tools.items = _.filter(scope.tools.items, function (toolItem) {
					return findByClass(toolItem, cssClassArray);
				});
				scope.tools.update();
			}
		};

		scope.onTabClicked = function (tab) {
			// noinspection JSUnresolvedVariable
			scope.subviewCtrl.activeTab = tab;
			// noinspection JSUnresolvedVariable
			scope.subviewCtrl.selectionChanged();
			scope.$emit('tabchanged');
		};

		scope.isTabbed = function () {
			// noinspection JSUnresolvedVariable
			return angular.isArray(scope.subviewCtrl.content);
		};

		scope.getContainerUUID = function () {
			if (scope.subviewCtrl.content && angular.isArray(scope.subviewCtrl.content) && scope.subviewCtrl.content.length > scope.subviewCtrl.activeTab) {
				return scope.subviewCtrl.content[scope.subviewCtrl.activeTab].uuid.toLowerCase();
			}
			if (scope.subviewCtrl.content && !angular.isArray(scope.subviewCtrl.content)) {
				return scope.subviewCtrl.content.uuid.toLowerCase();
			}
			return '';
		};

		scope.getAllContainerUUIDs = function () {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content && angular.isArray(scope.subviewCtrl.content)) {
				var result = [];
				// noinspection JSUnresolvedVariable
				for (var i = 0; i < scope.subviewCtrl.content.length; i++) {
					// noinspection JSUnresolvedVariable
					result.push(scope.subviewCtrl.content[i].uuid.toLowerCase());
				}
				return result;
			}
		};

		scope.getContentValue = function (propName) {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content) {
				// noinspection JSUnresolvedVariable
				return angular.isArray(scope.subviewCtrl.content) ? scope.subviewCtrl.content[scope.subviewCtrl.activeTab][propName] : scope.subviewCtrl.content[propName];
			}
		};

		scope.isActive = function (index) {
			// noinspection JSUnresolvedVariable
			return scope.subviewCtrl.activeTab === index;
		};

		scope.getCurrentContentUrl = function () {
			if (!scope.subviewCtrl.content) {
				return null;
			}

			// content not an array or array is empty
			if (!angular.isArray(scope.subviewCtrl.content) || _.isEmpty(scope.subviewCtrl.content)) {
				return scope.subviewCtrl.content.template;
			}

			// check if active tab is out of range
			if (!scope.subviewCtrl.content[scope.subviewCtrl.activeTab]) {
				scope.subviewCtrl.activeTab = 0;
			}

			return scope.subviewCtrl.content[scope.subviewCtrl.activeTab].template;
		};

		scope.getCurrentCtrl = function () {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content) {
				// noinspection JSUnresolvedVariable
				return angular.isArray(scope.subviewCtrl.content) ? scope.subviewCtrl.content[scope.subviewCtrl.activeTab].controller : scope.subviewCtrl.content.controller;
			}
		};

		scope.getTabTitle = function (tabIndex) {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content && scope.subviewCtrl.content.length > tabIndex) {
				// noinspection JSUnresolvedVariable
				return angular.isArray(scope.subviewCtrl.content) ? $translate.instant(scope.subviewCtrl.content[tabIndex].title) : $translate.instant(scope.subviewCtrl.content.title);
			}

			return '';
		};

		scope.getTabTitleClass = function (tabIndex) {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content && scope.subviewCtrl.content.length > tabIndex) {
				// noinspection JSUnresolvedVariable
				return angular.isArray(scope.subviewCtrl.content) ? $translate.instant(scope.subviewCtrl.content[tabIndex].title).replace(/ /g, '').toLowerCase() : $translate.instant(scope.subviewCtrl.content.title).replace(/ /g, '').toLowerCase();
			}

			return '';
		};

		scope.getTitle = function () {
			if (scope.subviewCtrl.content && angular.isArray(scope.subviewCtrl.content) && scope.subviewCtrl.content.length > scope.subviewCtrl.activeTab) {
				return $translate.instant(scope.subviewCtrl.content[scope.subviewCtrl.activeTab].title);
			}

			if (scope.subviewCtrl.content && !angular.isArray(scope.subviewCtrl.content)) {
				return $translate.instant(scope.subviewCtrl.content.title);
			}

			return '';
		};

		scope.hideToolbar = function() {
			return false;
		};

		scope.loading = false;

		scope.dataLoading = function (obj) {
			scope.loading = true;
			var deferred = $q.defer();

			$q.when(obj).then(function (result) {
				deferred.resolve(result);
				$timeout(function () {
					scope.loading = false;
				});
			}, function (result) {
				deferred.reject(result);
				$timeout(function () {
					scope.loading = false;
				});
			});

			return deferred.promise;
		};

		/**
		 * @ngdoc function
		 * @name getIconClass
		 * @function
		 * @methodOf mainViewSubContainerController
		 * @description Returns the optional icon class for the container.
		 * @returns {String} The name of the icon class.
		 */
		scope.getIconClass = function () {
			if (scope.subviewCtrl.content && angular.isArray(scope.subviewCtrl.content) && scope.subviewCtrl.content.length > scope.subviewCtrl.activeTab) {
				return scope.subviewCtrl.content[scope.subviewCtrl.activeTab].iconClass;
			}

			if (scope.subviewCtrl.content && !angular.isArray(scope.subviewCtrl.content)) {
				return scope.subviewCtrl.content.iconClass;
			}

			return '';
		};

		/**
		 * @ngdoc function
		 * @name setIconClass
		 * @function
		 * @methodOf mainViewSubContainerController
		 * @description Sets the optional icon class for the container.
		 * @param {String} iconClass The new icon class, if any.
		 */
		scope.setIconClass = function (iconClass) {
			// noinspection JSUnresolvedVariable
			if (scope.subviewCtrl.content) {
				// noinspection JSUnresolvedVariable
				if (angular.isArray(scope.subviewCtrl.content)) {
					// noinspection JSUnresolvedVariable
					scope.subviewCtrl.content[scope.subviewCtrl.activeTab].iconClass = iconClass;
				} else {
					// noinspection JSUnresolvedVariable
					scope.subviewCtrl.content.iconClass = iconClass;
				}
			}
		};

		scope.getActiveTab = function () {
			// noinspection JSUnresolvedVariable
			return scope.subviewCtrl.activeTab;
		};

		scope.moveFocusWithinSplitview = function moveFocusWithinSplitview(selectedContainer, forward) {

			function setFocus(view) {
				scope.removeInnerSplitContainerFocus(selectedContainer);
				view.tabIndex = 0;
				view.focus();
				$(view).addClass('selected');
				$(view).scope().registerToolbarShortcuts();
			}
			let splitViews = $(selectedContainer).find('.splitview-container');
			if (splitViews && splitViews.length > 0) {
				let selected = splitViews.filter('.selected');
				if (selected && selected.length > 0) {
					let selectedIndex = splitViews.index(selected);
					if(forward && selectedIndex === splitViews.length - 1) {
						return false;
					}
					else if(forward && selectedIndex < splitViews.length - 1) {
						setFocus(splitViews[selectedIndex + 1]);
						return true;
					}
					else if(!forward && selectedIndex === 0) {
						return false;
					}
					else if(!forward && selectedIndex > 0) {
						setFocus(splitViews[selectedIndex - 1]);
						return true;
					}
				}
				else {
					setFocus(splitViews[0]);
					return true;
				}
			}
			return false;
		};

		scope.removeInnerSplitContainerFocus = function removeInnerSplitContainerFocus(ele) {
			let splitViews = $(ele).find('.splitview-content');
			if (splitViews.length > 0) {
				for (let i = 0; i < splitViews.length; i++) {
					let parent = $(splitViews[i]).closest('.splitview-container');
					if (parent && $(parent).hasClass('selected')) {
						$(parent).removeClass('selected');
						if ($(parent).scope()) {
							$(parent).scope().unregisterToolbarShortcuts();
						}
					}

				}
			}
		};
	}

	var templates = {
		'tab': ['<li data-ng-class="{active: isActive(%index%)}" data-tid="%index%" data-overflow="auto" class="tab-id_{{ getTabTitleClass(%index%) }}">',
			'<button data-ng-click="onTabClicked(%index%);" title=" {{ getTabTitle(%index%) }}" data-ng-bind="getTabTitle(%index%)"></button>',
			'</li>'].join(''),
		'overflowitem': ['<li data-ng-class="{active: isActive(%index%)}">',
			'<button data-ng-click="onTabClicked(%index%);" title=" {{ getTabTitle(%index%) }}" data-ng-bind="getTabTitle(%index%)"></button>',
			'</li>'].join(''),
		'overflowBtn': '<button class="overflow-anchor dropdown-toggle menu-button tlb-icons ico-menu" data-ng-click="openPopup()"></button>',
		'footer': '<div class="subview-footer"></div>',
		'tabs': '<ul></ul>'
	};

	function buildContainerFooter(length) {
		var $tabs = $(templates.tabs);
		var $footer = $(templates.footer);
		var $obtn = $(templates.overflowBtn);

		var index;
		var tabs = [];
		for (index = 0; index < length; index++) {
			// noinspection JSCheckFunctionSignatures
			var item = templates.tab.replace(/%\w+%/g, index);
			tabs.push(item);
		}
		tabs = tabs.join('');
		$(tabs).appendTo($tabs);
		var clone = $tabs.clone();
		$tabs.addClass('subview-tabs');
		$tabs.children().addClass('subview-tab');
		clone.children().addClass('hidden subview-tab-overflow');
		$obtn.css('display', 'none');
		$tabs.appendTo($footer);
		$obtn.appendTo($footer);

		return {
			'footer': $footer,
			'tabs': $tabs,
			'hidden': clone,
			'anchor': $obtn
		};
	}

	mainViewSubContainer.$inject = ['_', '$rootScope', '$templateCache', 'mainViewService', '$compile', '$timeout', '$translate', 'basicsLookupdataPopupService', '$window', 'platformGridAPI', 'cloudDesktopShortcutService'];

	function mainViewSubContainer(_, $rootScope, $templateCache, mainViewService, $compile, $timeout, $translate, basicsLookupdataPopupService, $window, platformGridAPI, cloudDesktopShortcutService) { // jshint ignore:line
		function compile(ele, attr) {

			let activeTab = 0;
			let elements;
			let unregister = [];

			if (attr.id === 'pane-ct1' || attr.id === 'pane-ct2') {
				ele.parent().addClass('pane-ct');
			} else if (attr.id === 'pane-cb1' || attr.id === 'pane-cb2') {
				ele.parent().addClass('pane-cb');
			} else {
				ele.parent().addClass(attr.id);
			}

			var $overlay = ele.find('.container-overlay');

			return function ($scope, $element, attr, ctrl) {
				var scope = $scope;
				var ele = $element;
				var initial = true;
				var view = mainViewService.getViewForPane(attr.id);

				if (view) {
					ctrl.content = view.content;
					ctrl.activeTab = view.activeTab || activeTab;
					ctrl.shortcuts = view.shortcuts;
				}

				cloudDesktopShortcutService.onSelectTab.register(onSelectTab);

				function onSelectTab(tabId) {
					if(scope.subviewCtrl.content && angular.isArray(scope.subviewCtrl.content)) {
						let tabIndex = scope.subviewCtrl.content.findIndex(function (item) { return item.id === tabId; });
						if (tabIndex >= 0) {
							let container = document.querySelector('.cid_' + scope.getContainerUUID());
							if(container) {
								container.tabIndex = 0;
								container.focus();
								scope.subviewCtrl.activeTab = tabIndex;
								scope.subviewCtrl.selectionChanged();
								scope.$emit('tabchanged');
							}
						}
					}
				}

				function updateContent() {
					ctrl.content = mainViewService.getViewForPane(attr.id) ? mainViewService.getViewForPane(attr.id).content : undefined;
				}

				unregister.push(mainViewService.registerListener('onlayoutEdit', updateContent));

				unregister.push(scope.$watch('subviewCtrl.content', function (newValue, oldValue) {
					if (angular.isArray(newValue)) {
						// noinspection JSUnresolvedVariable
						elements = buildContainerFooter(newValue.length);
						ele.children().find('.subview-footer').remove();
						ele.children().append($compile(elements.footer)(scope));
					}
					if (angular.isArray(oldValue) && !angular.isArray(newValue)) {
						ele.children().find('.subview-footer').remove();
					}
					if (initial) {
						var child = ele.children('.subview-container');
						if (scope.isTabbed()) {
							var uuids = scope.getAllContainerUUIDs();
							uuids.forEach(function (item) {
								child.addClass('cid_' + item);
							});
						} else {
							child.addClass('cid_' + scope.getContainerUUID());
						}
						// child.attr('id',scope.getContainerUUID());
						initial = false;
					}
				}));

				function allowedFile(items) {
					for (var i = 0; i < scope.$$childTail.allowedFiles.length; i++) {
						var fileExt = scope.$$childTail.allowedFiles[i];
						if (_.includes(items[0].type, fileExt)) {
							return true;
						}
					}
					return false;
				}

				var dragging = false;
				var timeoutId;

				function handleDragEnter(evt) {
					dragging = true;
					timeoutId = setTimeout(function () {
						dragging = false;
					}, 0);
					if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
						// noinspection JSUnresolvedVariable
						if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
							$overlay.addClass('file-allowed');
						} else {
							$overlay.addClass('file-denied');
						}
					} else {
						$overlay.addClass('file-denied');
					}
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}

				function handleDragOver(evt) {
					if (!evt) {
						return;
					}
					if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
						// noinspection JSUnresolvedVariable
						if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
							// noinspection JSUnresolvedVariable
							evt.dataTransfer.dropEffect = 'copy';
							$overlay.addClass('file-allowed');
						} else {
							// noinspection JSUnresolvedVariable
							evt.dataTransfer.dropEffect = 'none';
							$overlay.addClass('file-denied');
						}
					} else {
						// noinspection JSUnresolvedVariable
						evt.dataTransfer.dropEffect = 'none';
					}
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}

				function handleDragLeave(evt) {
					if (!dragging) {
						if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
							// noinspection JSUnresolvedVariable
							if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
								$overlay.removeClass('file-allowed');
							} else {
								$overlay.removeClass('file-denied');
							}
						} else {
							$overlay.removeClass('file-denied');
						}
					}
					dragging = false;
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}

				function handleFileSelect(evt) {
					evt.stopPropagation();
					evt.preventDefault();
					// noinspection JSUnresolvedVariable
					if (evt.dataTransfer) {
						var files = evt.dataTransfer.files;
						if (scope.$$childTail.fileDropped) {
							scope.$$childTail.fileDropped(files);
						}
						$overlay.removeClass('file-allowed');
						$overlay.removeClass('file-denied');
					}
					dragging = false;
				}

				scope.$on('tabchanged', function() {
					if (scope && scope.hasFocus) {
						scope.unregisterToolbarShortcuts();
					}
				});

				function selectFirstRecordInGrid (setDefaultInput) {
					let gridElement = $(ele).find('.platformgrid');
					if (gridElement && gridElement.length > 0) {
						let gridId = gridElement[0].id;
						let gridInstance = platformGridAPI.grids.element('id', gridId);
						if (gridInstance) {
							let activeCell = gridInstance.instance.getActiveCell();
							if (!activeCell && setDefaultInput) {
								if (gridInstance.dataView.getItems().length > 0) {
									gridInstance.instance.setCellFocus(0,1);
								}
							}
							if (activeCell) {
								gridInstance.instance.focus();
							}
						}
						return true;
					}
					return false;
				}

				function handleFocus(setDefaultInput, e) {
					if(_.isUndefined(setDefaultInput)) {
						setDefaultInput = true;
					}
					else {
						if (setDefaultInput.currentTarget && setDefaultInput.currentTarget !== setDefaultInput.target)
						{
							setDefaultInput = false;
						}
					}
					if (!scope.hasFocus && scope.getContainerUUID()) {
						$rootScope.$broadcast('beforeContainerFocusChange', {containerId: mainViewService.activeContainer(), newContainerId: scope.getContainerUUID()});
						ele.addClass('selected');
						scope.hasFocus = true;
						scope.registerToolbarShortcuts();
						mainViewService.activeContainer(scope.getContainerUUID());

						let element = ele;

						let splitviewcontainers = $(ele).find('.splitview-content');
						if(splitviewcontainers.length > 0) {
							element = splitviewcontainers[0];
							$(element).closest('.splitview-container').addClass('selected');
						}

						if(setDefaultInput) {

							//Fix for request 130714 - If a container is active (via shortcut), the main control (grid, form) should have the focus.
							if (!selectFirstRecordInGrid(setDefaultInput)) {
								let inputElement = $(element).find('input.active');
								if (!inputElement || (inputElement && inputElement.length === 0)) {
									inputElement = $(element).find('.input-group.active');
									if (!inputElement || (inputElement && inputElement.length === 0)) {
										inputElement = $(element).find('.input-group:first');
									}
								}
								if (inputElement && inputElement[0]) {
									inputElement[0].tabIndex = 0;
									inputElement[0].focus();
								}
							}
						}
						$rootScope.$broadcast('containerFocusChanged', {containerId: scope.getContainerUUID()});
					}

					if(scope.hasFocus && e) {
						let parent = $(e.target).closest('.splitview-container');
						if(parent && !$(parent).hasClass('selected')) {
							scope.removeInnerSplitContainerFocus(ele);
							$(parent).addClass('selected');
							if ($(parent).scope()) {
								$(parent).scope().registerToolbarShortcuts();
							}
						}
					}
				}

				function clickHandler(e) {
					handleFocus(false, e);
				}

				function handleKeyDown(event) {
					if(event.key === 'F2') {
						if(scope.hasFocus) {
							selectFirstRecordInGrid(true);
						}
					}
				}

				ele.click(clickHandler);

				ele[0].addEventListener('dragover', handleDragOver);
				ele[0].addEventListener('dragleave', handleDragLeave);
				ele[0].addEventListener('dragenter', handleDragEnter);
				ele[0].addEventListener('drop', handleFileSelect);
				ele[0].addEventListener('focusin', handleFocus);
				ele[0].addEventListener('keydown', handleKeyDown);


				unregister.push(function () {
					ele[0].removeEventListener('dragover', handleDragOver);
					ele[0].removeEventListener('dragleave', handleDragLeave);
					ele[0].removeEventListener('dragenter', handleDragEnter);
					ele[0].removeEventListener('drop', handleFileSelect);
					ele[0].removeEventListener('focusin', handleFocus);
					ele[0].removeEventListener('keydown', handleKeyDown);
				});

				unregister.push($rootScope.$on('beforeContainerFocusChange', function () {
					if (scope.hasFocus) {
						scope.hasFocus = false;
						scope.unregisterToolbarShortcuts();
						ele.removeClass('selected');
						scope.removeInnerSplitContainerFocus(ele);
					}
				}));

				unregister.push(scope.$on('$destroy', function () {
					clearTimeout(timeoutId);
					cloudDesktopShortcutService.onSelectTab.unregister(onSelectTab);
					scope.unregisterToolbarShortcuts();
					_.over(unregister)();
					unregister = null;

					ele.off();
					ele = null;

					scope.tools = null;
					scope = null;
				}));

				ctrl.selectionChanged = function () {
					if (scope) {
						scope.disableNavigationShortCut = false;
					}
					mainViewService.updateSubviewTab(attr.id, ctrl.activeTab);
					elements.hidden.find('>li[data-tid="' + activeTab + '"],.active').removeClass('active');
				};

				function getChildrenWidth() {
					if (!elements) {
						return 0;
					}
					var childrenWidth = 0;
					elements.tabs.children(':visible').each(function () {
						childrenWidth += $(this).outerWidth(true);
					});
					return childrenWidth + elements.anchor.outerWidth(true);
				}

				function hideElement(element) {
					element.hide();
					elements.hidden.find('>li[data-tid="' + element.data('tid') + '"]').removeClass('hidden');
				}

				function showElement(element, parentWidth) {
					if (element.length && parentWidth > getChildrenWidth() + element.outerWidth(true)) {
						element.show();
						elements.hidden.find('>li[data-tid="' + element.data('tid') + '"]').addClass('hidden');
						return true;
					}
					return false;
				}

				function shrink(parentWidth) {
					var tab, visibleTabs;
					if (parentWidth < getChildrenWidth()) {
						visibleTabs = elements.tabs.children(':visible:not([data-overflow="never"],.overflow-anchor)');
						var i;
						for (i = visibleTabs.length - 1; i >= 0; i--) {
							tab = visibleTabs.eq(i);
							if (parentWidth > getChildrenWidth()) {
								break;
							} else {
								hideElement(tab);
							}
						}
					}
				}

				function grow(parentWidth) {
					var tab, hiddenTabs;
					if (parentWidth > getChildrenWidth()) {
						hiddenTabs = elements.tabs.children(':hidden');
						var i;
						for (i = 0; i < hiddenTabs.length; i++) {
							tab = hiddenTabs.eq(i);
							if (parentWidth < getChildrenWidth() || !showElement(tab, parentWidth)) {
								break;
							}
						}
					}
				}

				function toggleAnchor() {
					if (elements.hidden.children(':not(.hidden)').length > 0) {
						elements.anchor.css('display', 'inline-block');
					} else {
						elements.anchor.css('display', 'none');
					}
				}

				var instance = null;
				var popupOpen = false;

				function onResize() {
					var parentWidth = elements.footer.innerWidth();

					if (popupOpen) {
						instance.close();
					}

					shrink(parentWidth);
					grow(parentWidth);
					toggleAnchor();
				}

				if (angular.isArray(ctrl.content)) {
					var splitter;

					$timeout(function () {
						splitter = ele.closest('.k-splitter').data('kendoSplitter');
						if (splitter && elements) {
							splitter.bind('resize', onResize);
						} else if (!splitter && elements) {
							// window resize-function if no splitter existing(#86234)
							angular.element($window).on('resize', onResize);
						}

						// After #86234 -> scenario: One Layout-Container(without splitter) and with many tab-items -> No overflow-anchor button is shown.
						if (getChildrenWidth() > elements.tabs.width()) {
							onResize();
						}
					}, 100);

					scope.openPopup = function () {
						if (popupOpen) {
							return;
						}

						var extension = {
							scope: scope,
							options: scope.options,
							focusedElement: elements.anchor,
							relatedTarget: elements.tabs,
							template: elements.hidden,
							hasDefaultWidth: false,
							controller: mainViewSubContainerController,
							width: 0,
							height: 0
						};

						var popupOptions = $.extend({}, scope.popupOptions, extension);

						instance = basicsLookupdataPopupService.showPopup(popupOptions);

						function clicked(e) {
							if (e.target !== elements.hidden && popupOpen) {
								instance.close();
								popupOpen = false;
								$('html').off('click', clicked);
							} else {
								popupOpen = true;
							}
						}

						$('html').click(clicked);
					};
				}
			};
		}

		return {
			restrict: 'A',
			scope: {},
			template: $templateCache.get('subview-container-2'),
			controller: mainViewSubContainerController,
			controllerAs: 'subviewCtrl',
			compile: compile
		};
	}

	angular.module('platform').directive('subViewContainer', mainViewSubContainer);

})(angular);
