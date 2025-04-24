/* global app _ $ Platform globals showdown */

((angular, showdown, Platform, globals) => {
	'use strict';

	const moduleName = 'cloud.desktop';

	/**
	 * this function parses the url parameters and returns it as  keyValue array
	 * @param tobeParsedUrl
	 * @returns {{}}
	 */
	function parseParameter(tobeParsedUrl) {
		const url = tobeParsedUrl;
		const token = '/';
		const result = url.substr(url.lastIndexOf(token) + token.length, 9999);
		const params = result.split('&');
		let resultObj = {};
		_.forEach(params, (param) => {
			const keyValue = param.split('=');
			resultObj[keyValue[0]] = keyValue[1];
		});
		return resultObj;
	}

	function SaveTokenInfoandNavigate(resultObj, tokenAuthentication, platformPortalService, $state) {

		if (resultObj.access_token) {
			// var jwtdecoded = jwt_decode(token);
			// console.log(jwtdecoded);
			tokenAuthentication.setToken(resultObj);
			const jwtInfo = tokenAuthentication.getJwtInfo(resultObj.access_token);

			console.log('initApp: set access_token from issuer: ' + jwtInfo.iss);
			if (jwtInfo.portaltoken === 'false') {
				return platformPortalService.createPortalContextFromToken()
					.then(function ok(result) {
						if (result) {
							$state.transitionTo(globals.defaultState + '.desktop');
						} else {
							app.navigateToCompany();
						}
					}, function failed(/* data */) {
						app.navigateToLoginPage();
					});
			} else {
				$state.transitionTo(globals.defaultState + '.desktop');
			}
		}
	}

	// first config block: configures states for this module.
	angular.module(moduleName).config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

			// this part handles the redirect call of itwo40 from the identity server when social media provider was selected
			$urlRouterProvider.when(/access_token=/i, ['$state', '$match', '$stateParams', 'tokenAuthentication', 'platformPortalService',
				function ($state, $match, $stateParams, tokenAuthentication, platformPortalService) {
					// parse url, extract token and its parameters
					var resultObj = parseParameter($match.input);
					SaveTokenInfoandNavigate(resultObj, tokenAuthentication, platformPortalService, $state);

				}]);

			// this part handles the redirect call of itwo4.0 from the identity server when social media provider was selected
			// callback when hybrid flow is used url: .../#/code=
			$urlRouterProvider.when(/code=/i, ['$state', '$match', '$stateParams', 'tokenAuthentication', 'platformPortalService',
				function ($state, $match, $stateParams, tokenAuthentication, platformPortalService) {
					// parse url, extract token and its parameters
					var resultObj = parseParameter($match.input);
					return tokenAuthentication.getTokenAuthorizationCode(resultObj).then(function (result) {
						// console.log("Code >>> token done...", result);
						SaveTokenInfoandNavigate(result, tokenAuthentication, platformPortalService, $state);
					});
				}]);

			// this part handles the redirect call of itwo40 from the identity server when social media provider was selected
			// callback when authorizationcode flow is used url: .../#/callback?code=...
			$urlRouterProvider.when(/[?]code=/i, ['$state', '$match', '$stateParams', 'tokenAuthentication', 'platformPortalService',
				function ($state, $match, $stateParams, tokenAuthentication, platformPortalService) {
					// parse url, extract token and its parameters
					var resultObj = parseParameter($match.input);
					return tokenAuthentication.getTokenAuthorizationCode(resultObj).then(function (result) {
						// console.log("Code >>> token done...", result);
						SaveTokenInfoandNavigate(result, tokenAuthentication, platformPortalService, $state);
					});
				}]);

			// this part handles the redirect call of itwo40 from the identity server when social media provider was selected
			// callback when authorizationcode flow is used url: .../#/callback?code=...
			$urlRouterProvider.when('/callback?{code}&{scope}&{session_state}', ['$state', '$match', '$stateParams', 'tokenAuthentication', 'platformPortalService',
				function ($state, $match, $stateParams, tokenAuthentication, platformPortalService) {
					// parse url, extract token and its parameters
					var resultObj = {
						code: $match.code,
						scope: $match.scope,
						session_state: $match.session_state
					};
					return tokenAuthentication.getTokenAuthorizationCode(resultObj).then(function (result) {
						// console.log("Code >>> token done...", result);
						SaveTokenInfoandNavigate(result, tokenAuthentication, platformPortalService, $state);
					});
				}]);

		}]);

	angular.module(moduleName).config(['platformNavBarServiceProvider', 'hotkeyCodes', '$injector',
		function (platformNavBarServiceProvider, hotkeyCodes) {

			const defaultActions = [
				new Platform.Action('save', Platform.ActionGroup.navBarActions, 'cloud.desktop.navBarSaveDesc', 'tlb-wh-icons ico-save', true, false, 1, null, null, false, [hotkeyCodes.CTRL, hotkeyCodes.S]),
				new Platform.Action('prev', Platform.ActionGroup.navBarActions, 'cloud.desktop.navBarGoToPrevDesc', 'tlb-wh-icons ico-rec-previous', true, false, 2, null,  null, false, [hotkeyCodes.ALT, hotkeyCodes.UP]),
				new Platform.Action('next', Platform.ActionGroup.navBarActions, 'cloud.desktop.navBarGoToNextDesc', 'tlb-wh-icons ico-rec-next', true, false, 3, null, null, false, [hotkeyCodes.ALT, hotkeyCodes.DOWN]),
				new Platform.Action('refreshSelection', Platform.ActionGroup.navBarActions, 'cloud.desktop.navBarRefreshSelDesc', 'tlb-wh-icons ico-refresh-all', true, false, 4, null, null, false, [hotkeyCodes.CTRL, hotkeyCodes.ALT, hotkeyCodes.R]),
				new Platform.Action('refresh', Platform.ActionGroup.navBarActions, 'cloud.desktop.navBarRefreshDesc', 'tlb-wh-icons ico-refresh', true, false, 5, null, null, false, [hotkeyCodes.CTRL, hotkeyCodes.R]),
				new Platform.Action('first', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarGoToFirstDesc', 'tlb-icons ico-rec-first', true, false, 6),
				new Platform.Action('last', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarGoToLastDesc', 'tlb-icons ico-rec-last', true, false, 7),
				new Platform.Action('discard', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarDiscardDesc', 'tlb-icons ico-discard', true, false, 8)
			];

			platformNavBarServiceProvider.setDefaultActions(defaultActions);
		}]);

	/**
	 * config block for the UI-Router 'mainViewServiceProvider'
	 *
	 * purpose: loading all required translation before one module will start
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var loaded = false;
			var schemaLoaded = {}; // object mustn't be null or undefined

			mainViewServiceProvider.globalResolves({
				secureContextRole: ['platformContextService',
					(platformContextService) => {
						return platformContextService.isSecureClientRoleReady;
					}
				],
				loadGeneralSchema: ['platformSchemaService',
					function (platformSchemaService) {
						return platformSchemaService.getSchemas(
							[{typeName: 'CharacteristicDataDto', moduleSubModule: 'Basics.Characteristic'}],
							schemaLoaded);
					}],
				loadTranslations: ['$q', 'platformTranslateService',
					function ($q, platformTranslateService) {
						let transPromise = $q.defer();

						/** this function check if there request translation already loaded,
						 * if loaded we resolve the promise
						 */
						function translationsLoaded() {
							// console.log('Info: Global translations loaded deferred');
							platformTranslateService.translationChanged.unregister(translationsLoaded);
							loaded = true;
							transPromise.resolve();
						}

						if (!loaded) {
							if (!platformTranslateService.registerModule(['cloud.desktop', 'cloud.common', 'basics.common'])) {
								// console.log('Info: Global translations loaded');
								loaded = true;
								transPromise.resolve();
							} else {
								platformTranslateService.translationChanged.register(translationsLoaded);
							}
						} else {
							// console.log('Info: Global translations already loaded');
							transPromise.resolve();
						}
						return transPromise.promise;
					}],

				// 11.Jun.2015@rei added support for Inquiry api sidebar container
				inquireSidebar: ['$q', 'cloudDesktopSidebarService', 'cloudDesktopSidebarInquiryService',
					function ($q, sidebarService, sidebarInquiryService) {

						if (sidebarInquiryService.checkStartupInfoforInquiry()) {
							sidebarService.addInquirySidebarandCommand();
						}
						return $q.when();
					}],

				// run directive factory to get its configuration in case directive factory isn’t ready, you can put it to module resolver
				'loadLookup': ['basicsLookupdataLookupDefinitionService',
					function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load(['basicsLookupDataProjectProjectDialog']);
					}],

				// run directive factory to get its configuration in case directive factory isn’t ready, you can put it to module resolver
				'initLanguageService': ['cloudCommonLanguageService',
					function (cloudCommonLanguageService) {
						return cloudCommonLanguageService.init();
					}]
			});
		}
	]);

	/**
	 @ngdoc controller
	 * @name cloudDesktopMainframeController
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).controller('cloudDesktopMainframeController',
		['$rootScope', '$scope', '$http', '$state', 'moment', '$timeout', '$templateCache', 'platformUserInfoService', 'tokenAuthentication', 'cloudDesktopHotKeyService',
			'platformContextService', 'cloudDesktopSidebarService', 'platformTranslateService', 'cloudDesktopInfoService', 'platformErrorHttpInterceptor',
			'cloudDesktopEnhancedFilterService', 'basicsDocuService', 'platformNavBarService', 'platformMasterDetailDialogService', 'cloudDesktopUserSettingsService', '$translate',
			'cloudDesktopDisplaySettingsService', 'cloudDesktopQuickstartSettingsService', '$window', 'platformLogonService', 'cloudDesktopDesktopLayoutSettingsService',
			'platformDialogService', 'platformModalService', 'cloudDesktopClerkProxyService', 'cloudDesktopKeyService', 'platformModuleNavigationService', 'cloudDesktopUtilService',
			'cloudDesktopExternalSystemCredentialDialogService', 'mainViewService', 'basicsConfigNavCommandbarService', '$injector', 'platformActivityMonitorService', 'cloudDesktopShortcutService',
			'platformStartupRouteService',
			function ($rootScope, $scope, $http, $state, moment, $timeout, $templateCache, platformUserInfoService, tokenAuthentication, cloudDesktopHotKeyService,
				platformContextService, cloudDesktopSidebarService, platformTranslateService, cloudDesktopInfoService, platformErrorHttpInterceptor,
				cloudDesktopEnhancedFilterService, docuService, platformNavBarService, platformMasterDetailDialogService, usService, $translate, displaySettingsService,
				quickstartSettingsService, $window, platformLogonService, desktopLayoutSettingsService, dialogService, platformModalService, cloudDesktopClerkProxyService,
				cloudDesktopKeyService, naviService, cloudDesktopUtilService, cloudDesktopExternalSystemCredentialDialogService, mainViewService, basicsConfigNavCommandbarService,
				$injector, platformActivityMonitorService, cloudDesktopShortcutService,
				platformStartupRouteService) {

				if (platformStartupRouteService.navigateToStartupRoute()) {
					return;
				}

				$scope.desktopLoading = true;
				$scope.desktopLoadingInfo = '';

				var enteredNavigationOnStateChange = false;

				cloudDesktopKeyService.registerKeyListeners();
				cloudDesktopShortcutService.registerShortcutService($scope);

				$rootScope.$on('$stateChangeSuccess', function () {
					var paramObjectForNavigation = naviService.getParamObject();
					if (paramObjectForNavigation) {
						enteredNavigationOnStateChange = true;
						naviService.navigate(paramObjectForNavigation.navigatorConfig, paramObjectForNavigation.entity, paramObjectForNavigation.field);
						naviService.removeParamObject();
					}
				});

				setTimeout(function () {
					if (enteredNavigationOnStateChange === false) {
						var paramObjectForNavigation = naviService.getParamObject();
						if (paramObjectForNavigation) {
							naviService.navigate(paramObjectForNavigation.navigatorConfig, paramObjectForNavigation.entity, paramObjectForNavigation.field);
							naviService.removeParamObject();
						}
					}
				}, 5000);

				desktopLayoutSettingsService.getDesktopPagesStructure(true)
					.then(function (result) {
						desktopLayoutSettingsService.extendStateProvider(result);
					});

				$scope.watchesInfo = {
					show: false,
					watches: function () {
						return cloudDesktopEnhancedFilterService.getWatchCount();
					}
				};

				/**
				 */

				$scope.showPasswordChangeDialog = function () {
					var dialogOption = {
						templateUrl: globals.appBaseUrl + 'app/partials/change-password-dialog.html',
						controller: 'platformChangePasswordDialogController',
						windowClass: 'company-dialog'
					};
					return platformModalService.showDialog(dialogOption);
				};

				$scope.showAboutDialog = function () {
					var dialogOption = {
						headerText$tr$: 'cloud.desktop.formAbout',
						bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/aboutdialog-body-template.html',
						windowClass: 'about-dialog',
						width: '700px',
						customButtons: [{
							id: 'licences',
							caption$tr$: 'cloud.desktop.aboutdialog.softwareLicencesText',
							fn: function (/* event, info */) {
								/*
										show software licences in a dialog.
										Content is in http://rib-w0839/itwo40/dev/client/lib/99-license/_overview.md
								 */
								callLicencesDialog();
							}
						}, {
							id: 'certificates',
							caption$tr$: 'cloud.desktop.aboutdialog.certificatesText',
							fn: function (/* event, info */) {
								/*
										show software licences in a dialog.
										Content is in http://rib-w0839/itwo40/dev/client/lib/99-license/_overview.md
								 */
								callCertificateDialog();
							}
						}]
					};

					dialogService.showDialog(dialogOption);
				};

				function callCertificateDialog() {
					$http.get(globals.webApiBaseUrl + 'basics/common/resource/uri?id=documentation:certificates')
						.then(function (response) {
							var dialogOption = {
								headerText$tr$: 'cloud.desktop.aboutdialog.certificatesText',
								bodyTemplate: '<iframe credentialless src="' + globals.baseUrl + response.data + '" style="height:500px;width:100%;border:none;overflow:hidden;"></iframe>',
								windowClass: 'about-dialog',
								width: '700px'
							};

							dialogService.showDialog(dialogOption);
						});
				}

				function callLicencesDialog() {
					$http.get(globals.appBaseUrl + 'lib/99-license/_overview.md')
						.then(function (response) {
							// the content is in a md-file. showdown is a js-library, which converts from md to html-markup
							var converter = new showdown.Converter();
							// get as html
							var html = converter.makeHtml(response.data);

							var dialogOption = {
								headerText$tr$: 'cloud.desktop.aboutdialog.softwareLicencesText',
								bodyTemplate: '<div>' + html + '</div>',
								windowClass: 'about-dialog',
								width: '700px'
							};

							dialogService.showDialog(dialogOption);
						});
				}

				$scope.showDocu = showMainDocu;
				$scope.showMarketplace = showMarketplace;

				/* Dialog: Company Selection Dialog */
				$scope.showCompanySelectionDialog = function () {
					var dialogOption = {
						templateUrl: globals.appBaseUrl + 'cloud.desktop/partials/company-role-dialog.html',
						controller: 'cloudCompanyRoleDialogController',
						windowClass: 'company-dialog',
						resizeable: true
					};
					return dialogService.showDialog(dialogOption);
				};

				$scope.showClerkProxyDialog = function showClerkProxyDialog() {
					cloudDesktopClerkProxyService.createClerkProxy();
				};

				$scope.showExternalSystemCredentialsDialog = function showExternalSystemCredentialsDialog() {
					cloudDesktopExternalSystemCredentialDialogService.editExternalSystemCredentials();
				};

				$scope.showSettingsDialog = function () {

					platformLogonService.readUiDataLanguages().then(function () {  // rei@15.3.18 make sure language data loaded
						usService.loadData().then(function (data) {
							var dlgOptions = usService.getDlgOptions(data);
							platformMasterDetailDialogService.showDialog(dlgOptions).then(function (response) {
								if (response.ok) {
									usService.saveData(data).then(function (result) {
										if (result && result.exceptions && result.exceptions.length > 0) {
											platformModalService.showMsgBox(result.exceptionMessage, $translate.instant('cloud.desktop.design.errors.actionUnsuccessful'), 'info');
										}
									});
								}
							});
						});
					});
				};

				// rei added 27.10.2014 support disabling of Settings in modules.
				// as soon as we're in a module, we disable Settings....
				$scope.isSettingsDisabled = true;

				$scope.isDesktopActive = $state.current.isDesktop;

				function makeItem(id, captionTr, cssclass, disabled, fn) {
					return {
						id: id,
						caption$tr$: captionTr,
						type: 'item',
						cssClass: cssclass,
						disabled: disabled,
						fn: function fnX() {
							fn();
						}
					};
				}

				function makeDivider(id) {
					return {
						id: id, type: 'divider'
					};
				}

				function isDesktopActiveFn() {
					return !$scope.isDesktopActive;
				}

				function isDialogOpen() {
					return !!$('.modal-dialog').length;
				}

				/**
				 * force reload because of all services should load their data new
				 */
				$scope.onLogout = function logout() {
					var cb = app.logoutCallbackUrl();
					tokenAuthentication.logout(cb).then(
						function () {
							app.reloadLoginPage();
						}
					);
				};

				$scope.showKeyboardShortcut = function () {
					let hotkeys = $injector.get("hotkeys");
					hotkeys.toggleCheatSheet();
				}

				$scope.onChangePassword = function () {
					$scope.showPasswordChangeDialog();
				};

				$scope.path = globals.appBaseUrl;
				$scope.pathname = window.location.pathname;

				$rootScope.currentModule = getModuleName($state.current);

				// read header info from application storage. i.e. Companyname, username, userrole
				$scope.headerInfo = cloudDesktopInfoService.read();

				$scope.getUserandRoleInfo = function () {

					var socialLoginInfo = '';
					var idpname = $scope.headerInfo.userInfo.IdpName;
					if (!globals.portal && idpname && idpname.length && idpname !== 'Idsrv') { // rei@4.12.20 disabled for portal users;  display only external provider, internal IdSrv is suppressed
						idpname = idpname.replace('Azureadp', 'Azure AD').replace('Azuread', 'Azure AD'); // make it better readable
						socialLoginInfo = ' (' + idpname + ')';
					}
					var userNameRoleName = $scope.headerInfo.userInfo.UserName + socialLoginInfo + ' &middot; ' + $scope.headerInfo.roleName + (platformContextService.permissionObjectInfo ? ' (' + $translate.instant('cloud.desktop.permission.objectPermission') + ')' : '');

					// resize subtitle-element
					processResizeHeaderSubTitle();

					return userNameRoleName;
				};

				/*
				 resize-function for header-title.
				 Because, IE it has to be solved with js.
				 */
				angular.element($window).bind('resize', processResizeHeaderSubTitle);

				function processResizeHeaderSubTitle() {
					// js fix for IE
					if (globals.isIE11) {
						var subtitleElem = angular.element('.subtitle');
						var subtitleLabelElem = subtitleElem.find('label');
						var ellipsisElem = angular.element('.jsEllipse');

						subtitleElem.children('h4').removeClass('fullwidth');
						subtitleLabelElem.removeClass('reverse-ellipsis ellipsis');

						// change bg-color, because by the Desktop-Design settings the bg-color can be different.
						ellipsisElem.css('background-color', angular.element('#mainheader').css('background-color'));

						// show '...', if text-content wider then to be used wide
						if (subtitleElem.width() < subtitleLabelElem.width()) {
							ellipsisElem.addClass('show').removeClass('hide');
						} else {
							ellipsisElem.addClass('hide').removeClass('show');
						}
					}
				}

				// definition for the sideBar directive
				$scope.sidebarOptions = {
					commandBarDeclaration: cloudDesktopSidebarService.commandBarDeclaration,
					lastButtonId: '',
					sidebars: cloudDesktopSidebarService.sidebars,
					sidebarContainers: cloudDesktopSidebarService.sidebarContainers,
					loading: function () {
						return $scope.desktopLoading;
					},
					getActiveCommandBarDeclarations: function () {
						return cloudDesktopSidebarService.getCommandBarWithoutHidden();
					}
				};

				$scope.home = function (event) {
					if (event && event.shiftKey === true) {
						const permission = 'ed86d9db6fe14e548cea619b50683de0';
						$injector.get('platformPermissionService').loadPermissions([permission]).then(() => {
							if ($injector.get('platformPermissionService').hasExecute(permission)) {
								$injector.get('cloudDesktopTestService').showControlDialog();
							} else {
								cloudDesktopUtilService.goHomeLink();
							}
						});
					} else {
						cloudDesktopUtilService.goHomeLink();
					}
				};

				cloudDesktopHotKeyService.register('logout', $scope.onLogout);
				cloudDesktopHotKeyService.register('home', $scope.home);
				cloudDesktopHotKeyService.register('watchesInfo', function () {
					$scope.watchesInfo.show = !$scope.watchesInfo.show;
				});
				cloudDesktopHotKeyService.register('save', function (event) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (!isDialogOpen()) {
                        platformNavBarService.getActionByKey('save').fn();
                    }
                });

				cloudDesktopHotKeyService.register('goToNext',function(){
					if (!isDialogOpen()) {
						platformNavBarService.getActionByKey('next').fn();
					}
				});

				cloudDesktopHotKeyService.register('goToPrevious',function(){
					if (!isDialogOpen()) {
						platformNavBarService.getActionByKey('prev').fn();
					}
				});

				cloudDesktopHotKeyService.register('refresh', function () {
					if (!isDialogOpen()) {
						platformNavBarService.getActionByKey('refresh').fn();
					}
				});

				cloudDesktopHotKeyService.register('refreshSelection', function () {
					if (!isDialogOpen()) {
						platformNavBarService.getActionByKey('refreshSelection').fn();
					}
				});

				function moveFocus(startIndex, subviews, isForward) {
					let nextIndex = isForward ? startIndex + 1 : startIndex - 1;
					if (nextIndex >= subviews.length || nextIndex < 0) {
						nextIndex = isForward ? 0 : subviews.length - 1;
					}

					if (subviews[nextIndex].content !== '') {
						let nextSelectedContainerPaneId = subviews[nextIndex].pane;
						let nextSelectedContainer = document.querySelector('#' + nextSelectedContainerPaneId);
						if (nextSelectedContainer && nextSelectedContainer.clientHeight !== 0 && nextSelectedContainer.clientWidth !== 0) {
							nextSelectedContainer.tabIndex = 0;
							nextSelectedContainer.focus();
						} else {
							moveFocus(nextIndex, subviews, isForward);
						}
					} else {
						// nextIndex = isForward ? nextIndex + 1 : nextIndex - 1;
						moveFocus(nextIndex, subviews, isForward);
					}
				}

				function getActiveContainer() {
					let selectedId = mainViewService.activeContainer();
					if (selectedId) {
						let selectedContainer = document.querySelector('.cid_' + selectedId);
						return selectedContainer;
					}
				}

				function disableNavigation() {
					let selectedContainer = getActiveContainer();
					if (selectedContainer) {
						return $(selectedContainer).scope().disableNavigationShortCut;
					}
				}

				cloudDesktopHotKeyService.register('focusForward', function () {
					if (mainViewService.getCurrentModuleName()) {
						let currentLayout = mainViewService.getCurrentLayout();
						let startIndex = 0;
						if (currentLayout) {
							let selectedContainer = getActiveContainer();
							if (selectedContainer) {
								if ($(selectedContainer).scope().moveFocusWithinSplitview(selectedContainer, true)) {
									return;
								}
								let selectedPane = selectedContainer.parentNode ? selectedContainer.parentNode.id : '';
								if (selectedPane) {
									startIndex = currentLayout.subviews.findIndex(subview => {
										return subview.pane === selectedPane;
									});
								}
							}
							moveFocus(startIndex, currentLayout.subviews, true);
						}
					}
				}, disableNavigation);

				cloudDesktopHotKeyService.register('focusBackward', function () {
					if (mainViewService.getCurrentModuleName()) {
						let currentLayout = mainViewService.getCurrentLayout();
						let startIndex = 0;
						if (currentLayout) {
							let selectedContainer = getActiveContainer();
							if (selectedContainer) {
								if ($(selectedContainer).scope().moveFocusWithinSplitview(selectedContainer, false)) {
									return;
								}
								let selectedPane = selectedContainer.parentNode ? selectedContainer.parentNode.id : '';
								if (selectedPane) {
									startIndex = currentLayout.subviews.findIndex(subview => {
										return subview.pane === selectedPane;
									});
								}
							}
							moveFocus(startIndex, currentLayout.subviews, false);
						}
					}
				}, disableNavigation);

				cloudDesktopHotKeyService.register('maxmin', function () {
					let selectedId = mainViewService.activeContainer();
					if (selectedId) {
						let btnMax = angular.element('.cid_' + selectedId + ' .ico-maximized2');
						if (btnMax && btnMax.length > 0) {
							$timeout(function () {
								btnMax.triggerHandler('click');
							});
						} else {
							let btnMin = angular.element('.cid_' + selectedId + ' .ico-minimized2');
							if (btnMin && btnMin.length > 0) {
								$timeout(function () {
									btnMin.triggerHandler('click');
								});
							}
						}
					}
				});

				cloudDesktopHotKeyService.register('goto', function () {
					$scope.$broadcast('initShortcutGoTo');
				});

				$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
					$scope.isDesktopActive = toState.isDesktop;
					if (toState.name !== fromState.name) {
						if (toState.isDesktop) {
							let desktopShortcuts = ['closeCheatSheet', 'logout', 'watchesInfo', 'toggleCheatSheet'];
							cloudDesktopHotKeyService.setVisibleOptionsInCheatSheet(desktopShortcuts);
						} else if (fromState.isDesktop) {
							cloudDesktopHotKeyService.setVisibleOptionsInCheatSheet();
						}
					}
					reactOnStateChange(toState);
				});

				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState/* , fromParams */) {
					if (toState.name !== fromState.name) {
						let module = getModuleName(fromState);
						cloudDesktopHotKeyService.unregisterModuleShortcuts(module);
						$rootScope.currentModule = null;
					}
				});

				/**
				 * Use the docuService to show the docu of the current module.
				 */
				function showDocu() {
					docuService.showDocu($rootScope.currentModule);
				}

				/**
				 * Use the docuService to show the docu of the current module.
				 */
				function showMainDocu() {
					docuService.showDocu(moduleName);
				}

				/**
				 * Open market place
				 */
				function showMarketplace() {
					window.open('https://marketplace.mtwocloud.com/', '_blank');
				}

				/**
				 * Set the current module name to the rootScope.
				 * Set the docu action to the platformNavBarService.
				 *
				 * @param state
				 */
				function reactOnStateChange(state) {
					let module = getModuleName(state);
					$rootScope.currentModule = module;
				}

				// Call the reactOnStateChange on app start because no state change is fired.
				reactOnStateChange($state.current);

				function getModuleName(state) {
					var urlPath = state.url.split('/');
					if (urlPath[0] !== '^') {
						// return urlPath[1];
						// At the moment we have only cloud.desktop
						return moduleName;
					}

					return urlPath[1] + '.' + urlPath[2];
				}

				/**
				 * local error handler, displays all $http messages as an errordialog
				 *
				 * @param scope
				 * @param rejection
				 */
				function httpErrorHandler(scope, rejection) {
					// console.log('platform.$http.error', scope, rejection);
					// status: 404, config: Object, statusText: "Not Found"
					if (typeof rejection.data === 'function') {
						rejection.data = rejection.data($injector);

						// possibly sort this out by clearly defining whether the error message is supposed to be HTML or plain text
						rejection.data.ErrorMessage = rejection.data.ErrorMessage.replaceAll('\n', '<br />');
					} else if (rejection.data === '') {
						rejection.data = {
							ErrorMessage: 'http-status: ' + rejection.status + ' ' + rejection.statusText,
							MessageDetail: 'url: ' + rejection.config.url,
							ErrorDetail: 'url: ' + rejection.config.url
						};
					}
					dialogService.showErrorDialog(rejection.data);
				}

				/**
				 * onHttpError message handler, will be received when an $http error occures
				 */
				platformErrorHttpInterceptor.onHttpError.register(httpErrorHandler);

				/**
				 * load System context from localStorage first read user and
				 */
				platformUserInfoService.getUserInfoPromise(true)
					.then(function () {
						// platformContextService.readContextFromLocalStorage(); // rei@05.11.2021 removed,m because it resets the secureClientRole in sysContext
						checkEnvironment();
					});

				// loads or updates translated strings
				let loadTranslations = function () {
					platformTranslateService.translateObject($scope.sidebarOptions, ['title', 'caption']);

					// $scope.translate = platformTranslateService.instant({
					//   'cloud.desktop': ['sdGoogleSearchFilter', 'sdSettingsPageInfoLabel', 'sdSettingSupportLabel', 'sdSettingsHeader']
					// });
				};

				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				/**
				 *
				 */
				function checkEnvironment() {
					var hInfo = $scope.headerInfo;

					if (hInfo.companyName && hInfo.companyName.length > 0 &&
						hInfo.roleName && hInfo.roleName.length > 0 &&
						hInfo.userInfo && hInfo.userInfo.userValid) {
						$scope.desktopLoading = false;
					}
				}

				/**
				 * @param headerInfo
				 */
				function updateCompanyRole(headerInfo) {
					// console.log('mainframe headerInfo company/role updated');
					// console.log('cloudDesktopMainframeController receives: onCompanyRoleUpdated');
					$scope.headerInfo = headerInfo;
					checkEnvironment();
				}

				/**
				 * force delayed update of moduleinfo
				 */
				function updateModuleInfo() {
					$timeout(function () {
						$scope.$digest();
					}, 0);
				}

				/**
				 * force delayed update of moduleinfo
				 * alertInfo {
					    "messageType": "System.Application.ShutDownMsg",
					    "content": "Attention! System will rebooted at <%= until %>! Logoff will be forced!!",
					    "validFromUtc": "2020-05-07T09:00:00Z",
					    "validUntilUtc": "2020-05-07T10:31:00Z",
					    "alertBeforeSeconds": 0,
					    "isActive": false,
					    "forceLogoff": true  }
				 */
				function updateMessageAlert(alertInfo) {
					if (!$scope.applicationAlert) { // init applicationAlert
						$scope.applicationAlert = {display: false, message: undefined};
					}
					var previousValue = _.cloneDeep($scope.applicationAlert);
					if (alertInfo.isActive && moment().isAfter(alertInfo.validFromUtc) && moment().isBefore(alertInfo.validUntilUtc)) {
						$scope.applicationAlert.display = true;
						$scope.applicationAlert.message = alertInfo.contentParsed || alertInfo.content;
						$scope.applicationAlert.minutestogo = alertInfo.minutestogo || 0;

						/*
							after consultation with PM: this function will be commented out. If necessary, remove comment.
						 */
						/*
						var setLogoffTimer = moment(alertInfo.validUntilUtc).add(-alertInfo.refreshinSeconds, 'seconds');
						if (alertInfo.forceLogoff && moment().isAfter(setLogoffTimer) && moment().isBefore(alertInfo.validUntilUtc)) {
							console.log('updateMessageAlert activates Logoff Timer in ' + alertInfo.refreshinSeconds + ' s"');
							$scope.applicationAlert.LogoffMessage = 'Please Logoff! Logoff forced in a some seconds! ';
							$timeout(function () {
								$scope.onLogout();
							}, alertInfo.refreshinSeconds * 1000);
						}
						*/
					} else {
						$scope.applicationAlert.display = false;
						$scope.applicationAlert.message = undefined;
					}

					// force digest if changed
					if (!_.isEqual($scope.applicationAlert, previousValue)) {
						// console.log('updateMessageAlert Refresh called');
						$timeout(function () {
							$scope.$digest();
						}, 0);
					}
				}

				platformActivityMonitorService.resetTimer();

				cloudDesktopInfoService.onCompanyRoleUpdated.register(updateCompanyRole);
				cloudDesktopInfoService.onCompanyModuleInfoUpdated.register(updateModuleInfo);
				cloudDesktopInfoService.onApplicationAlertUpdated.register(updateMessageAlert);

				$rootScope.$on('$viewContentLoading', function () {
					$scope.viewContentLoading = true;
				});

				$scope.$on('$viewContentLoaded', function () {
					$scope.viewContentLoading = false;
					$rootScope.$emit('readyForNavigation');
				});

				// un-register on destroy
				$scope.$on('$destroy', function () {
					cloudDesktopShortcutService.unregisterShortcutService();
					cloudDesktopInfoService.onCompanyRoleUpdated.unregister(updateCompanyRole);
					cloudDesktopInfoService.onCompanyModuleInfoUpdated.unregister(updateModuleInfo);
					cloudDesktopInfoService.onApplicationAlertUpdated.unregister(updateMessageAlert);
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformErrorHttpInterceptor.onHttpError.unregister(httpErrorHandler);
					docuService.closeDocu();
				});
			}
		]);
})(angular, showdown, Platform, globals);
