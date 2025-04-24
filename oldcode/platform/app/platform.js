/**
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform', []);
	angular.module('platform-helper', []);

	/**
	 *      First config block for ui-router.
	 */
	angular.module('platform').config(configUiRouter);

	configUiRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider', '_', 'globals'];

	function configUiRouter($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider, _, globals) {

		$urlRouterProvider.otherwise('/app/desktop', {
			resolve: {
				secureContextRole: ['platformContextService',
					(platformContextService) => {
						return platformContextService.isSecureClientRoleReady;
					}
				]
			}
		});

		$stateProvider.state(globals.defaultState, {
			url: globals.defaultUrl,
			templateUrl: window.location.pathname + '/cloud.desktop/partials/mainframe.html',
			controller: 'cloudDesktopMainframeController',
			resolve: {
				defaultState: ['platformContextService', 'platformLogonService', '$state', '$q', function (platformContextService, logonService) {
					if (platformContextService.isSecureClientRolePresent) {
						return true;
					}
					return logonService.checkCompany(true);
				}],
				secureContextRole: ['platformContextService', 'defaultState',
					(platformContextService) => {
						return platformContextService.isSecureClientRoleReady;
					}
				]
			}
		});

		$stateProvider.state('company', {
			url: '/company',
			templateUrl: window.location.pathname + '/cloud.desktop/partials/company-role-selection.html',
			controller: 'cloudCompanyRoleSelectionController',
			resolve: {
				customlogon: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readCustomLogon();
				}],
				checkToken: ['tokenAuthentication', function (tokenAuthentication) {
					return tokenAuthentication.checkForValidToken();
				}],
				userLanguages: ['platformLogonService', 'checkToken', function (platformLogonService) {
					return platformLogonService.readUiDataLanguages();
				}],
				company: ['platformUserInfoService', 'checkToken', 'userLanguages', function (platformUserInfoService) {
					return platformUserInfoService.getUserInfoPromise(true);
				}],
				/* rei@16.11.17 clear all obsolete properties from SysContext */
				clearLocalStorage: ['platformContextService', 'checkToken', 'company', function (platformContextService) {
					return platformContextService.ClearObsoleteProperties();
				}],
				/* rei@12.07.22 skip company dialog if there are enough in fo in start up info */
				checkStartupInSkipIfValid: ['platformContextService', 'initApp', 'platformLogonService', 'platformModalService', 'checkToken', 'company', 'clearLocalStorage',
					function (platformContextService, initApp, logonService, platformModalService) {
						const startUpInfo = initApp.getStartupInfo();  // {url: url, navInfo: navigationParams}
						const navInfo = (startUpInfo || {}).navInfo;
						if (startUpInfo && navInfo) {
							// rei@18.7.22 not withNavigate must be false, to prevent recursive call of $state to company
							if (initApp.validateNavigateInfo(navInfo)) {
								return logonService.checkCompany(false, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined)
									.then(
										(/* ok */) => initApp.navigateWithParameter(navInfo),
										(error) => platformModalService.showErrorBox(error.message, 'cloud.desktop.api.naverrtitle'));
							} else {
								return platformModalService.showErrorBox('cloud.desktop.api.naverrinquiry', 'cloud.desktop.api.naverrtitle');
							}
						}
					}]
			}
		});

		$stateProvider.state('initial', {
			url: '/initialPage',
			templateUrl: window.location.pathname + '/cloud.desktop/partials/initial-page.html',
			controller: 'cloudDesktopInitialPageController'
		});

		$stateProvider.state('api', {
			url: '/api?navigate&operation&selection&confirm&company&roleid&module&id&search&requestid&project&extparams&uilanguage&datalanguage&invoiceid&billingid',
			controller: ['$injector', '$state', '$stateParams', 'initApp', 'platformModalService', 'platformLogonService',
				'platformStartupRouteService',
				function ($injector, $state, $stateParams, initApp, platformModalService, platformLogonService,
					platformStartupRouteService) {

					if (globals.apiReloadLoginTrigger === true) {      // rei@3.6.22 we have to login first before continue with api call
						globals.apiReloadLoginTrigger = undefined;   // remove global value
						platformStartupRouteService.saveStartupRoute('api', $stateParams);
						$state.transitionTo(globals.portal ? 'portallogin' : 'login');
						return true;
					} else {
						var navInfo = $stateParams;
						if (!initApp.validateNavigateInfo(navInfo)) {
							platformModalService.showErrorBox('cloud.desktop.api.naverrinquiry', 'cloud.desktop.api.naverrtitle');
						}
						if (navInfo.uilanguage && navInfo.datalanguage) {
							platformLogonService.readUiDataLanguages().then(function () {
								const dataLanguages = globals.datalanguages;
								const dataLangId = _.find(dataLanguages, {'Culture': navInfo.datalanguage});
								// set with new language from url
								const data = {
									uiLanguage: navInfo.uilanguage,
									userDataLangId: dataLangId ? dataLangId.Id : 1
								};
								$injector.get('cloudDesktopLanguageSettingsService').saveLanguage(data, true);
								initApp.navigateWithParameter(navInfo);
							});
						} else {
							initApp.navigateWithParameter(navInfo);
						}
					}
				}],
			resolve: {
				navigateState: ['platformLogonService', '$state', '$q', '$stateParams', 'initApp', 'tokenAuthentication', 'platformModalService', function (logonService, $state, $q, $stateParams, initApp, tokenAuthentication, platformModalService) {
					console.log('navigate state called ...resolving...');
					const navInfo = $stateParams;
					initApp.clearStartupInfo();
					if (navInfo) {
						// we save the origin url plus parse navigation info into app context.
						// after successful login and company selection we navigate to this navigation info...
						// console.log('saveStartupInfo ',window.location.href, navInfo);
						initApp.saveStartupInfo(window.location.href, navInfo);
					}
					if (tokenAuthentication.checkForValidTokenSync()) {
						// rei@18.7.22 withNavigate must be true, in case of company not valid => navigate to $state to company
						if (initApp.validateNavigateInfo(navInfo)) {
							return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined)
								.then((/* ok */) => true, (error) => {
									// navInfo.validationFailed = true;
									return platformModalService.showErrorBox(error.message, 'cloud.desktop.api.naverrtitle').then(
										() => app.navigateToCompany()
									);
								});
						} else {
							return platformModalService.showErrorBox('cloud.desktop.api.naverrinquiry', 'cloud.desktop.api.naverrtitle');
						}
					} else {
						console.log('api Call triggers login because of token not valid or present.');
						globals.apiReloadLoginTrigger = true;  // make sure other resolver can access the flag... therefore its in globals...
						return true;
					}
				}],
				secureContextRole: ['platformContextService', 'navigateState', (platformContextService) => {
					if (globals.apiReloadLoginTrigger) {
						console.log('api Called resolved secureContextRole, apiReloadLoginTrigger=' + globals.apiReloadLoginTrigger);
						return true;
					}
					return platformContextService.isSecureClientRoleReady;
				}
				]
			}
		});

		$stateProvider.state('login', {
			url: '/loginPage?ipderror',
			templateUrl: window.location.pathname + 'app/partials/logon-dialog.html',
			controller: 'platformLogonDialogController',
			resolve: {
				forceLogout: ['tokenAuthentication', (tokenAuthentication) => {
					return tokenAuthentication.clearToken();  // if already logged in we first logout.
				}],
				resetContext: ['platformContextService', 'forceLogout', (platformContextService) => {
					return platformContextService.setDefaultClientContextHeader();
				}],
				legalInfo: ['platformLogonService', function readLegalInfo(/* platformLogonService */) {
				}],
				customLogon: ['platformLogonService', 'platformStartupRouteService', function readCustomLogonCss(platformLogonService) {
					return platformLogonService.readCustomLogonCss();
				}]
			}
		});

		$stateProvider.state('changepassword', {
			url: '/changePasswordPage',
			templateUrl: window.location.pathname + 'app/partials/change-password-page.html',
			controller: 'platformChangePasswordPageController',
			resolve: {
				customlogon: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readCustomLogon();
				}],
				checkToken: ['tokenAuthentication', function (tokenAuthentication) {
					return tokenAuthentication.checkForValidToken();
				}]
			}
		});

		// $urlRouterProvider.when('/portallogin?{invitation}&{idperror}',{
		$stateProvider.state('portallogin', {
			url: '/portallogin?{invitation}&{idperror}&{errcode}',
			templateUrl: window.location.pathname + 'app/partials/portal-logon-dialog.html',
			controller: 'platformPortalLogonDialogController',
			resolve: {  // rei@29.10.18 make sure language are loaded before dialog starts..
				uiLanguages: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readUiLanguagesOnly();
				}],
				customLogon: ['platformLogonService', function readCustomLogonCss(platformLogonService) {
					return platformLogonService.readCustomLogonCss(true);
				}]
			}
		});

		$stateProvider.state('accesstoken', {
			url: '/accesstoken=?token_type?expires_in?scope?',
			templateUrl: window.location.pathname + 'app/partials/partial-logon-dialog.html',
			controller: 'platformPartialLogonDialogController',
			resolve: {  // rei@29.10.18 make sure language are loaded before dialog starts..
				uiLanguages: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readUiLanguagesOnly();
				}]
			}
		});

		// https://rib-w0918.rib-software.com/itwo40dev/v1_local/common/portal/#
		// /portalpartiallogin?provider=ext:google&providerid=109133264469354983498&name=Rolf%20Eisenhut&email=rolf.eisenhut@googlemail.com
		$stateProvider.state('portalpartiallogin', {
			url: '/portalpartiallogin?partialtoken&provider&providerid&name&email',
			templateUrl: window.location.pathname + 'app/partials/partial-logon-dialog.html',
			controller: 'platformPartialLogonDialogController',
			resolve: {  // rei@29.10.18 make sure language are loaded before dialog starts..
				resetContext: ['platformContextService', (platformContextService) => {
					return platformContextService.setDefaultClientContextHeader();
				}],
				uiLanguages: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readUiLanguagesOnly();
				}],
				customLogon: ['platformLogonService', function readCustomLogonCss(platformLogonService) {
					return platformLogonService.readCustomLogonCss(true);
				}]
			}
		});

		$stateProvider.state('sso', {
			url: '/sso?type&token&company&ticket&code&more',
			templateUrl: window.location.pathname + 'app/partials/sso-logon-dialog.html',
			controller: 'platformSsoLogonController',
			resolve: {
				customlogon: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readCustomLogon();
				}],
				uiLanguages: ['platformLogonService', function (platformLogonService) {
					return platformLogonService.readUiLanguagesOnly();
				}],
				customLogon: ['platformLogonService', function readCustomLogonCss(platformLogonService) {
					return platformLogonService.readCustomLogonCss(true);
				}]
			}
		});

		$locationProvider.html5Mode(false);

		if (!_.isUndefined(globals.debugMode)) {
			$compileProvider.debugInfoEnabled(globals.debugMode);
		}
	}

	angular.module('platform').run(
		['$templateCache', 'initApp', 'platformUtilService', 'platformLogonService', '$translate', '$log', '_',
			function ($templateCache, initApp, platformUtilService, platformLogonService, $translate, $log, _) {
				$templateCache.put('tabsTemplate.html', [
					'<div id="tabs" style="position: relative;">',
					'<ul id="ribtabs" class="nav nav-tabs">',
					'<li data-ng-repeat="tab in tabData">',
					'<a ui-sref="{{tab.state}}">',
					'<div>{{tab.displayName}}</div><div></div>',
					'</a>',
					'</li>',
					'</ul>',
					'</div>'
				].join(''));

				$templateCache.put('platform-container-content.html', [
					'<div class="contentSection" data-ng-transclude>',
					'</div>'
				].join(''));

				initApp();

				platformLogonService.readLegalInfo();

				const faultyTranslationKeys = {};
				(function monkeyPatchTranslateInstant() {
					const origInstant = $translate.instant;
					$translate.instant = function instance(translationKey) {
						try {
							return origInstant.apply(this, arguments);
						} catch (ex) {
							if (!_.isString(translationKey) || !faultyTranslationKeys[translationKey]) {
								if (_.isString(translationKey)) {
									faultyTranslationKeys[translationKey] = true;
								}
								$log.error('Unable to retrieve translation key "' + translationKey + '". Exception message: ' + ex);
							}
							return translationKey;
						}
					};
				})();
			}
		]);

	/**
	 * Check if the current state is part of pre Initialization phase
	 *
	 * @param stateName
	 * @returns {boolean}
	 */
	angular.module('platform').value('platformIsPreInitState', function isPreInitializationState(stateName) {
		return (stateName === 'login' || stateName === 'company' ||
			stateName === 'portallogin' || stateName === 'portalpartiallogin' ||
			stateName === 'sso' || stateName === 'changepassword' || stateName === 'api');
	});

	/**
	 * Generates a GUID string.
	 * @returns {String} The generated GUID.
	 * @example af8a84166e18a307bd9cf2c947bbb3aa or af8a8416-6e18-a307-bd9c-f2c947bbb3aa (long = true)
	 * @author Slavik Meltser (slavik@meltser.info).
	 * @link http://slavik.meltser.info/?p=142
	 */
	const uuidGenerator = (long) => {
		function _p8(s) {
			const p = (Math.random().toString(16) + '000000000').substring(2, 8);

			return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
		}

		if (long) {
			return _p8() + _p8(true) + _p8(true) + _p8();
		} else {
			return _p8() + _p8() + _p8() + _p8();
		}
	};

	/**
	 * Generates a uuid string.
	 * @returns {String} The generated uuid.
	 */
	const generateUuId = () => {
		let uuID = '';
		let hex = '';
		for (let i = 0; i < 8; i++) {
			hex = Math.floor(Math.random() * 16).toString(16);
			hex = hex.toLowerCase();
			uuID += hex;
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				hex = Math.floor(Math.random() * 16).toString(16);
				hex = hex.toLowerCase();
				uuID += hex;
			}
		}
		for (let i = 0; i < 12; i++) {
			hex = Math.floor(Math.random() * 16).toString(16);
			hex = hex.toLowerCase();
			uuID += hex;
		}

		return uuID;
	};

	// uuid generator helper
	angular.module('platform').value('platformCreateUuid', uuidGenerator);

	// new uuid generator
	angular.module('platform').value('platformUuidGenerator', generateUuId);

	// globals, underscore, moment, accounting libraries as constant
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('globals', globals);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('_', _);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('moment', moment);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('accounting', accounting);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('math', math);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('$', $);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('Communicator', Communicator);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('Mousetrap', Mousetrap);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('IBAN', IBAN);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('d3', d3);
	// pdfjs library is now delay loaded as es-module and must be registered before application will be bootstrapped
	angular.module('platform').constant('pdfjsLib', null);
	// eslint-disable-next-line no-undef
	angular.module('platform').constant('Quill', Quill);

	// Common KeyCodes
	angular.module('platform').constant('keyCodes', {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		INSERT: 45,
		DELETE: 46,
		KEY_0: 48,
		KEY_1: 49,
		KEY_2: 50,
		KEY_3: 51,
		KEY_4: 52,
		KEY_5: 53,
		KEY_6: 54,
		KEY_7: 55,
		KEY_8: 56,
		KEY_9: 57,
		KEY_A: 65,
		KEY_B: 66,
		KEY_C: 67,
		KEY_D: 68,
		KEY_E: 69,
		KEY_F: 70,
		KEY_G: 71,
		KEY_H: 72,
		KEY_I: 73,
		KEY_J: 74,
		KEY_K: 75,
		KEY_L: 76,
		KEY_M: 77,
		KEY_N: 78,
		KEY_O: 79,
		KEY_P: 80,
		KEY_Q: 81,
		KEY_R: 82,
		KEY_S: 83,
		KEY_T: 84,
		KEY_U: 85,
		KEY_V: 86,
		KEY_W: 87,
		KEY_X: 88,
		KEY_Y: 89,
		KEY_Z: 90,
		LEFT_META: 91,
		RIGHT_META: 92,
		SELECT: 93,
		NUM_0: 96,
		NUM_1: 97,
		NUM_2: 98,
		NUM_3: 99,
		NUM_4: 100,
		NUM_5: 101,
		NUM_6: 102,
		NUM_7: 103,
		NUM_8: 104,
		NUM_9: 105,
		NUM_ADD: 107,
		NUM_DECIMAL: 110,
		NUM_DIVIDE: 111,
		NUM_ENTER: 108,
		NUM_MULTIPLY: 106,
		NUM_SUBTRACT: 109,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		SEMICOLON: 186,
		EQUALS: 187,
		COMMA: 188,
		DASH: 189,
		PERIOD: 190,
		SLASH: 191,
		GRAVE_ACCENT: 192,
		OPEN_BRACKET: 219,
		BACKSLASH: 220,
		CLOSE_BRACKET: 221,
		SINGLE_QUOTE: 222
	});

	angular.module('platform').constant('hotkeyCodes', {
		TAB: { translation: 'cloud.desktop.keyboard.tab', key: 'tab'},
		SHIFT: { translation: 'cloud.desktop.keyboard.shift', key: 'shift'},
		CTRL: { translation: 'cloud.desktop.keyboard.ctrl', key: 'ctrl'},
		ALT: { translation: 'cloud.desktop.keyboard.alt', key: 'alt'},
		ESCAPE: { translation: 'cloud.desktop.keyboard.escape', key: 'esc'},
		SPACE: { translation: 'cloud.desktop.keyboard.space', key: 'space'},
		PAGE_UP: { translation: 'cloud.desktop.keyboard.pageup', key: 'pageup'},
		PAGE_DOWN: { translation: 'cloud.desktop.keyboard.pagedown', key: 'pagedown'},
		END: { translation: 'cloud.desktop.keyboard.end', key: 'end'},
		LEFT: { translation: 'cloud.desktop.keyboard.left', key: 'left'},
		UP: { translation: 'cloud.desktop.keyboard.up', key: 'up'},
		RIGHT: { translation: 'cloud.desktop.keyboard.right', key: 'right'},
		DOWN: { translation: 'cloud.desktop.keyboard.down', key: 'down'},
		PLUS: { translation: 'cloud.desktop.keyboard.plus', key: '='},
		MINUS: { translation: 'cloud.desktop.keyboard.minus', key: '-'},
		DEL: { translation: 'cloud.desktop.keyboard.del', key: 'del' },
		A: { translation:'A', key: 'a'},
		B: { translation:'B', key: 'b'},
		C: { translation:'C', key: 'c'},
		D: { translation:'D', key: 'd'},
		E: { translation:'E', key: 'e'},
		F: { translation:'F', key: 'f'},
		G: { translation:'G', key: 'g'},
		H: { translation:'H', key: 'h'},
		I: { translation:'I', key: 'i'},
		J: { translation:'J', key: 'j'},
		K: { translation:'K', key: 'k'},
		L: { translation:'L', key: 'l'},
		M: { translation:'M', key: 'm'},
		N: { translation:'N', key: 'n'},
		O: { translation:'O', key: 'o'},
		P: { translation:'P', key: 'p'},
		Q: { translation:'Q', key: 'q'},
		R: { translation:'R', key: 'r'},
		S: { translation:'S', key: 's'},
		T: { translation:'T', key: 't'},
		U: { translation:'U', key: 'u'},
		V: { translation:'V', key: 'v'},
		W: { translation:'W', key: 'w'},
		X: { translation:'X', key: 'x'},
		Y: { translation:'Y', key: 'y'},
		Z: { translation:'Z', key: 'z'},
	});

})(angular);
