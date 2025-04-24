/**
 * Created by ong on 10.09.2024.
 */

/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopShortcutService
 * @priority default value
 * @description
 * Contains listeners on keyevents for global or local usage
 */

(function (angular) {
	/* global $ */
	'use strict';
	angular.module('cloud.desktop').service('cloudDesktopShortcutService', ['_', '$rootScope', 'keyCodes', 'platformContainerUiAddOnService', 'mainViewService', 'cloudDesktopHotKeyService',
		function (_, $rootScope,  keyCodes, platformContainerUiAddOnService, mainViewService, cloudDesktopHotKeyService) {
			let showShortCutContainer = false;
			let currentViewShortcutList = [];
			const self = this;

			this.onSelectTab = new Platform.Messenger();

			let alphaList = [{character: '-'}];

			function resetAlphabetList() {
				alphaList = [{character: '-'}];
				initList();
			}

			function initList() {
				if (alphaList.length === 1) {
					for (let character='a';character<='z';character = String.fromCharCode(character.charCodeAt() + 1)) {
						alphaList.push({character: character});
					}
				}
				return alphaList;
			}

			this.getAlphabetList = initList;

			this.unregisterShortcutService = function () {
				mainViewService.unregisterListener('onTabChanged', resetAlphabetList);
				mainViewService.unregisterListener('onViewChanged', resetAlphabetList);
				window.onresize = null;
			}

			this.registerShortcutService = function (scope) {

				$(window).resize(function() {
					if (showShortCutContainer) {
						clearTimeout(window.resizedFinished);
						window.resizedFinished = setTimeout(function () {
							resizeShortcutOverlay(scope);
						}, 250);
					}
				});

				mainViewService.registerListener('onTabChanged', resetAlphabetList);
				mainViewService.registerListener('onViewChanged', resetAlphabetList);

				cloudDesktopHotKeyService.register('openContainerOverlay', function () {
					if (!showShortCutContainer) {
						if(!document.body.classList.contains('modal-open')) {
							initList();
							showHideShortcutOverlay(scope, false);
						}
					}
					else if (showShortCutContainer) {
						showHideShortcutOverlay(scope, true);
					}
				});

				document.addEventListener('wheel', e => {
					if (showShortCutContainer) {
						e.preventDefault();
						e.stopPropagation();
					}
				}, { passive: false })

				$(document).keydown(function (e) {
					const numKey = Number.parseInt(e.key);

					if (showShortCutContainer && !isNaN(numKey)) {
						setContainerFocus(numKey);
						showHideShortcutOverlay(scope, true);
					}
					else if (showShortCutContainer) {
						if(currentViewShortcutList.length > 0) {
							const tabId = currentViewShortcutList.find((item) => item.shortcut === e.key);
							if (tabId) {
								self.onSelectTab.fire(tabId.id);
								showHideShortcutOverlay(scope, true);
							}
						}
					}
				});
				$(document).keyup(function (e) {
					const key = e.which || e.keyCode;

					if (key === keyCodes.ESCAPE && showShortCutContainer) {
						showHideShortcutOverlay(scope, true);
					}
				});
			}

			function retrieveShortcutInfo() {
				const views = mainViewService.getCurrentLayout()
				let shortcutViews = [];

				let selectedId = mainViewService.activeContainer();

				const fullscreen = $('.fullscreen').length !== 0

				views.subviews.forEach(function (view) {
					angular.forEach(view.shortcuts, function (shortcut) {
						if(shortcut !== '-') {
							const selected = _.find(alphaList, function (item) {
								return item.character === shortcut;
							});
							if (selected) {
								selected.isHidden = true;
							}
						}
					});
					let result = mainViewService.getViewForPane(view.pane);
					if (result) {
						if (result.content) {
							let dimensions, _UUID, visibleTabsCount = 0;
							if (angular.isArray(result.content) && result.content.length > 0) {
								_UUID = result.content[result.activeTab || 0].uuid;
								let container = document.querySelector('.cid_' + _UUID);
								if (fullscreen) {
									if (container.offsetParent && !container.closest('.fullscreen-mode')) {
										return;
									}
								}
								if (container.offsetParent && container.closest('.k-state-collapsed')) {
									return;
								}
								visibleTabsCount = $(container).find('.subview-footer .subview-tabs li:visible').length;
								dimensions = container.getBoundingClientRect();
								result.content.forEach((item) => {
									item.letter = '';
								})
							} else {
								_UUID = result.content.uuid;
								let container = document.querySelector('.cid_' + _UUID);
								if (fullscreen) {
									if (container.offsetParent && !container.closest('.fullscreen-mode')) {
										return;
									}
								}
								if (container.offsetParent && container.closest('.k-state-collapsed')) {
									return;
								}
								dimensions = container.getBoundingClientRect();
								result.content.letter = '';
							}

							let isSelectedContainer = _UUID === selectedId ? true : false;
							shortcutViews.push({pane: view.pane, dimensions: dimensions, content: result.content, isSelectedContainer: isSelectedContainer, visibleTabsCount: visibleTabsCount});
						}
					}
				});
				return shortcutViews;
			}

			this.getLayoutShortcutInfo = retrieveShortcutInfo;

			function setContainerFocus(numKey) {

				//const views = mainViewService.getCurrentLayout();
				if (numKey <= self.options.shortcutViews.length) {
					let containerPaneId = self.options.shortcutViews[numKey-1].pane;
					let container = document.querySelector('#' + containerPaneId);
					if (container && container.clientHeight !== 0 && container.clientWidth !== 0) {
						container.tabIndex = 0;
						container.focus();
					}
				}
			}

			function resizeShortcutOverlay(scope) {
				const moduleName = mainViewService.getCurrentModuleName();
				if (moduleName) {
					platformContainerUiAddOnService.addManagerAccessor(scope, $('body'), function () {});
					let uiMgr = scope.getUiAddOns();
					const containerOverlay = uiMgr.getContainerOverlay();

					currentViewShortcutList = [];
					self.options.shortcutViews = retrieveShortcutInfo();
					containerOverlay.containerOverlayShow(self.options, showShortCutContainer);

				}
			}

			function showHideShortcutOverlay(scope, isHide) {
				const moduleName = mainViewService.getCurrentModuleName();
				if (moduleName) {

					platformContainerUiAddOnService.addManagerAccessor(scope, $('body'), function () {});
					let uiMgr = scope.getUiAddOns();
					const containerOverlay = uiMgr.getContainerOverlay();

					if(!isHide) {
						currentViewShortcutList = [];
						let selectedId = mainViewService.activeContainer();

						showShortCutContainer = true;

						let shortCutOptions = {
							isContainerShown: showShortCutContainer,
							focusedContainer: selectedId,
							shortcutViews: retrieveShortcutInfo(),
							shortcutList: alphaList.find((item) => item.isHidden) ? [] : _.cloneDeep(alphaList),
							viewShortcutList: currentViewShortcutList,
							sidebarLastButtonId: scope.sidebarOptions.lastButtonId
						}

						self.options = shortCutOptions;

						containerOverlay.containerOverlayShow(shortCutOptions, showShortCutContainer);
					}
					else {
						self.options = null;
						showShortCutContainer = false
						containerOverlay.containerOverlayShow({}, showShortCutContainer);
					}
				}
			}
		}]);
})(angular);