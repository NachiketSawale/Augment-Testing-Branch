/**
 * @ngdoc directive
 * @name platform.directive:platformForm
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Create form from passed in config which contains form's body(groups and rows).
 * It's not rely on form container, We can use this directive to create a single page form just pass in the form config object.
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-form data-form-config="formConfig" data-entity="currentItem"></div>
 </doc:source>
 </doc:example>
 */
(function (angular, globals) {
	/* global $ */
	'use strict';
	angular.module('cloud.desktop').directive('cloudDesktopSidebar',
		['_', '$rootScope', '$templateCache', '$compile', 'cloudDesktopSidebarService', '$state', '$timeout', 'cloudDesktopSidebarPinSettingsService',
			function (_, $rootScope, $templateCache, $compile, cloudDesktopSidebarService, $state, $timeout, cloudDesktopSidebarPinSettingsService) { // jshint ignore:line
				return {
					restrict: 'A',
					scope: {
						sidebarOptions: '='
					},
					link: function (scope, elem) {
						var handlerActive = false;

						scope.sidebarOptions.lastButtonId = '';

						var pinStatusFromLocalStorage = cloudDesktopSidebarPinSettingsService.getPinStatus();

						/**
						 *
						 * @param cmdid
						 */
						scope.cmdbarredirectTo = function (cmdid) {
							var curButtonID = scope.sidebarOptions.lastButtonId;

							// fire event only if sidebar is already open
							if (scope.sidebarOptions.lastButtonId.length !== 0) {
								cloudDesktopSidebarService.onClosingSidebar.fire(curButtonID);

								// for mobile
								// setTimeout(function () {
								// if($('#horizontal').length > 0) {
								// $('#horizontal').data('kendoSplitter').resize(true);
								// }
								//
								// }, 400);
							}

							if (curButtonID === cmdid) {
								scope.sidebarOptions.lastButtonId = '';
								unbindModuleAreaClick();
							} else {
								cloudDesktopSidebarService.onOpenSidebar.fire(cmdid);
								scope.sidebarOptions.lastButtonId = cmdid;
								cloudDesktopSidebarService.commandBarDeclaration.currentButton = cmdid;
								
								if (!handlerActive && !scope.pinned) {
									bindModuleAreaClick();
								}
							}
							
							scope.$broadcast('cloudDesktopSidebarMinmax',{id: cmdid.replace('#', '')});

							// save common status in localStorage
							saveInUserSettingsLocalStorage();

							if (scope.pinned) {
								triggerMainTabs();
							}

							// only if sidebar collapse state is changed the window event have to be triggered.
							if ((curButtonID.length > 0) !== (scope.sidebarOptions.lastButtonId.length > 0)) {
								$timeout(resizeWindow, 150);
							}
						};

						function onModuleAreaClick() {
							// console.log('onModuleAreaClick() Handler for .click() called.');
							unbindModuleAreaClick();
							scope.sidebarOptions.lastButtonId = '';
							$timeout(resizeWindow, 50);
						}

						scope.showNotifications = function(cmdid, rootList){
							rootList.currentButton = cmdid;
							scope.cmdbarredirectTo(cmdid);
						};

						scope.goTo = function goTo(state) {
							$state.go(globals.defaultState + '.' + state);
							unbindModuleAreaClick();

							// simply close the sidebar
							scope.sidebarOptions.lastButtonId = '';
						};

						function unbindModuleAreaClick() {
							// console.log('unbindModuleAreaClick() called. ' + handlerActive);
							if (handlerActive) {
								$('#mainContent').unbind('click', onModuleAreaClick);
								handlerActive = false;
							}
						}

						function bindModuleAreaClick() {
							var mainContent = $('#mainContent').get(0) || {};
							var theEvent = ($.data(mainContent, 'events') || {}).click;
							if (!theEvent) {
								// console.log('bindClickEvent ' + handlerActive);
								$('#mainContent').click(onModuleAreaClick);
							}
							handlerActive = true;
						}

						// will be fired after module content is loaded
						// in this case the click event handler might be destroyed and we have to add the handler again.
						$rootScope.$on('$viewContentLoaded', function () {
							if (handlerActive) {
								// console.log('$rootscope.$on($viewContentLoaded called. ' + handlerActive);
								bindModuleAreaClick();
							}
						});

						scope.pinned = false;

						function saveInUserSettingsLocalStorage() {
							cloudDesktopSidebarPinSettingsService.setPinStatus(scope.pinned, scope.sidebarOptions.lastButtonId);
						}

						/**
						 *
						 * @param pineSidebar
						 */
						scope.pinSidebar = function pinSidebar(pineSidebar) {
							if (_.isNil(pineSidebar)) {
								scope.pinned = !scope.pinned; // toggle pinstate
								// save common pin-status in localStorage
								saveInUserSettingsLocalStorage();
							} else {
								scope.pinned = pineSidebar; // defined pinstate
							}
							$timeout(resizeWindow, 100);

							// toggle auto disappear
							if (scope.pinned && handlerActive) {
								unbindModuleAreaClick();
							}

							if (!scope.pinned && !handlerActive) {
								bindModuleAreaClick();
							}

							if (!scope.pinned) {
								$('.js-pin').hide();
								$timeout(function () {
									$('.js-pin').show();
								}, 0);
							}

							// resize main-tab
							triggerMainTabs();
						};

						function triggerMainTabs() {
							// trigger the function for the main-tabs.
							$timeout(function () {
								$rootScope.$broadcast('resizeNavigation');
							}, 50);
						}

						function resizeWindow() {
							$(window).trigger('resize');
						}

						// scope.commandBarDeclaration = cloudDesktopSidebarService.commandBarDeclaration;
						cloudDesktopSidebarService.scope = scope;

						/**
						 * @ngdoc function
						 * @name onCloseSidebar
						 * @function
						 * @description Close Sidebar
						 * @param { bool } Indicates whether a close is enforced. If false, then close is only triggered if sidebar is not pinned.
						 */
						function onCloseSidebar(forceClose) {
							if (forceClose || !scope.pinned) {
								scope.sidebarOptions.lastButtonId = '';
							}
						}

						/**
						 *
						 * @param openSidebarId
						 */
						function openSidebar(openSidebarId, pineSidebar) {
							if (!_.isNil(pineSidebar)) {
								scope.pinSidebar(pineSidebar);
							}

							if (!_.isNil(openSidebarId)) {
								scope.cmdbarredirectTo(openSidebarId);
							}
						}

						/**
						 *
						 * @param openSidebarId
						 */
						function closeSidebar(pineSidebar) {
							if (!_.isNil(pineSidebar)) {
								scope.pinSidebar(pineSidebar);
							}
							scope.sidebarOptions.lastButtonId = '';
						}

						/**
						 *
						 * @param pineSidebar
						 */
						function pineSidebar(pineSidebar) {
							if (pineSidebar || !scope.pinned) {
								scope.sidebarOptions.lastButtonId = '';
							}
						}

						cloudDesktopSidebarService.onCloseSidebar.register(onCloseSidebar);
						cloudDesktopSidebarService.openSidebar.register(openSidebar);
						cloudDesktopSidebarService.closeSidebar.register(closeSidebar); // rei@24.10.18
						cloudDesktopSidebarService.pineSidebar.register(pineSidebar);

						if (!_.isEmpty(pinStatusFromLocalStorage)) {
							openSidebar(pinStatusFromLocalStorage.lastButtonId, pinStatusFromLocalStorage.active);

							if (pinStatusFromLocalStorage.lastButtonId !== '') {
								scope.sidebarOptions.savedInLocalStorage = true;
							}
						}

						scope.$on('$destroy', function () {
							if (cloudDesktopSidebarService && cloudDesktopSidebarService.onCloseSidebar) {
								cloudDesktopSidebarService.onCloseSidebar.unregister(onCloseSidebar);
							}
							unbindModuleAreaClick();
						});

						var content = $templateCache.get('sidebar-wrapper.html');
						elem.replaceWith($compile(content)(scope));
					}
				};
			}
		]
	);
})(angular, globals);
