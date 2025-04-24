// noinspection SpellCheckingInspection,JSValidateTypes,JSUnresolvedVariable
// noinspection SpellCheckingInspection

/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

let app; // jshint ignore:line
// eslint-disable-next-line no-undef

(function (angular, globals, tt, _) {
	'use strict';

	if (window.location.pathname.lastIndexOf('/') !== window.location.pathname.length - 1) {
		window.location.pathname += '/';
	}

	/**
	 * parse a JWT token (payload only),
	 * return object with claims key as property with according value
	 * rei@6.10.17
	 * rei@1.3.2019 fixed issue with wrong parsing
	 * @param token
	 */
	globals.parseJwt = function parseJwt(token) {
		const base64Url = (token || '').split('.')[1];
		let output = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		switch (output.length % 4) { // fix length of base64 coded string
			case 0: {
				break;
			}
			case 2: {
				output += '==';
				break;
			}
			case 3: {
				output += '=';
				break;
			}
			default: {
				throw 'Illegal base64url string!';
			}
		}
		return JSON.parse(window.decodeURIComponent(escape(window.atob(output)))); // jshint ignore:line
	};

	/**
	 * True, if browser is IE 11
	 * @type {boolean}
	 */
	globals.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]?11\./);

	/**
	 * True, if browser is Safari
	 * @type {boolean}
	 */
	globals.isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match(/CriOS/);

	/**
	 * True, if color picker should be used instead of native HTML5 color control
	 * @type {boolean}
	 */
	globals.useColorPicker |= (globals.isIE11);

	/**
	 * True, if is a mobile-device
	 * * @type {boolean}
	 * 'ontouchstart' in window --> works on most browsers
	 * navigator.maxTouchPoints --> works on IE10/11 and Surface
	 */
	globals.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

	/**
	 *
	 */
	globals.timestamp = getTimestamp();

	function getTimestamp() {
		const links = document.getElementsByTagName('head')[0].getElementsByTagName('link');
		let timestamp = '';

		for (let i = 0; i < links.length; ++i) {
			let match = links[i].href.match(/.*(?:\.css)(\?t=.*)$/i);

			if (match) {
				timestamp = match[1];
				break;
			}
		}

		return timestamp;
	}

	/**
	 * @function processNavigate
	 * @description this function parse the ?navigate command parameters and return them in
	 * retInfo = {
	 *  company: null,
	 *  module: null,
	 *  id: null,
	 *  search: null
	 * };
	 * @param url
	 * @returns retInfo {object} retInfo
	 */
	globals.processNavigate = function processNavigate(url) {

		let nav = '/#/?navigate';
		const navFound = url.indexOf(nav);
		if (navFound < 0) {
			return null;
		}

		const paramsPart = url.slice(navFound + nav.length);
		if (paramsPart.length === 0) {
			return null;
		}

		const retInfo = {
			company: null,
			module: null,
			id: null,
			search: null,
			requestid: null,
			operation: null,
			selection: null
		};
		const paramsArr = paramsPart.split('&');

		_.forEach(paramsArr, function (p) { // jshint ignore:line
			if (p && p.length > 0) {
				const keyVal = p.split('=');
				const key = (keyVal.length === 2 && keyVal[0] && keyVal[0].length > 0) ? keyVal[0] : '';
				const value = (keyVal.length === 2 && keyVal[1] && keyVal[1].length > 0) ? keyVal[1] : '';

				if (key === 'operation') {  // currently valid:    inquiry
					retInfo.operation = value;
					retInfo.selection = retInfo.selection || 'single';  // set default selection
				}
				if (key === 'selection') {  // currently valid:    single, multiple
					retInfo.selection = value;
				}
				if (key === 'company') {
					retInfo.company = value;
				}
				if (key === 'module') {
					retInfo.module = value;
				}
				if (key === 'id') {
					retInfo.id = value;
				}
				if (key === 'search') {
					retInfo.search = value;
				}
				if (key === 'requestid') {
					retInfo.requestid = value;
				}
			}
		});
		console.log(retInfo);
		return retInfo;
	};

	function urlBuilder() { // jshint ignore:line
		const dirs = _.compact(window.location.pathname.split('/'));
		const idxfile = dirs[dirs.length - 1];

		if (idxfile && (idxfile.indexOf('.cshtml') > 0) || (idxfile.indexOf('.html') > 0)) {
			dirs.pop();
		}

		globals.appBaseUrl = '/' + dirs.join('/') + '/';

		if (globals.portal) {
			dirs.pop(); // go one level up
		}

		if (!globals.webApiBaseUrl || globals.webApiBaseUrl === '/') {
			dirs[dirs.length - 1] = 'services';
			globals.webApiBaseUrl = '/' + dirs.join('/') + '/';
		}

		if (!globals.reportingBaseUrl || globals.reportingBaseUrl === '/') {
			dirs[dirs.length - 1] = 'reporting';
			globals.reportingBaseUrl = '/' + dirs.join('/') + '/';
		}

		if (!globals.identityBaseUrl || globals.identityBaseUrl === '/') {
			dirs[dirs.length - 1] = 'identity/core';
			globals.identityBaseUrl = '/' + dirs.join('/') + '/';
		}

		// set client url in globals  rei@19.12.17 for QR codes
		globals.clientUrl = window.location.origin + window.location.pathname;

		// set portal url in globals  rei@09.03.18 for QR codes
		globals.portalUrl = window.location.origin + globals.webApiBaseUrl.replace('/services/', '/portal/start');  // without / at the end

		// set server url in globals  rei@09.03.18 for QR codes
		globals.serverUrl = window.location.origin + globals.webApiBaseUrl.replace('/services', '');

		dirs.pop();
		globals.baseUrl = '/' + dirs.join('/') + '/';
	}

	const requiredModules = [
		'ngSanitize',
		'ngAnimate',
		'ui.router',
		'ui.bootstrap',
		'ui.select2',
		'ui.sortable',
		'Thinktecture.Authentication',
		'angular-loading-bar',
		'Thinktecture.SignalR',
		'pascalprecht.translate',
		'platform',
		'platform-helper',
		'ngPatternRestrict',
		'platformGrid',
		'leaflet-directive',
		'mgo-angular-wizard',
		'angularUtils.directives.dirPagination',
		'lrFileReader',
		'wysiwyg.module',
		'platformEditor'
	].concat(globals.modules);

	/**
	 *
	 * @returns {string}
	 */
	function getDefLanguageOptionsKey() {
		return globals.appBaseUrl + '-defLangOpts';
	}

	/**
	 *
	 * @returns {*}
	 */
	globals.readLastLanguageFromStorage = function readLastLanguageFromStorage() {
		const lastLanguage = localStorage.getItem(getDefLanguageOptionsKey());
		if (!_.isNil(lastLanguage)) {
			return JSON.parse(lastLanguage);
		}
		return null;
	};

	//
	// usage: globals.saveLastLanguageFromStorage ({language:'de', culture: 'de-de'})
	//
	globals.saveLanguageInfo2Storage = function saveLastLanguageFromStorage(languageOptions) {
		const lastLanguageKey = getDefLanguageOptionsKey();
		if (languageOptions) {
			localStorage.setItem(lastLanguageKey, JSON.stringify(languageOptions));
		}
	};

	/**
	 * Checks if the browser language fits the available ui languages
	 * rei@20.2.18 check if browser language is part of the available ui languages
	 */
	globals.checkFallBackLanguage = function checkFallBackLanguage(fallBackLang, defaultLanguage) {

		if (!globals.uilanguagessimple) {
			return defaultLanguage;
		}
		const languageCultures = globals.uilanguagessimple.map(e => {
			return e.Language;
		});

		let isThere = languageCultures.includes(fallBackLang);
		if (!isThere) {
			fallBackLang = _.split(fallBackLang, '-', 1)[0];
			isThere = languageCultures.includes(fallBackLang);
			if (!isThere) {
				fallBackLang = defaultLanguage;
			}
		}
		return fallBackLang;
	};

	/**
	 * Checks if the browser language fits the available ui languages
	 * rei@20.2.18 check if browser language is part of the available ui languages
	 *
	 */
	globals.getGlobalsLanguagesCulture = function getGlobalsLanguagesCulture(theLanguage, defaultCulture) {

		if (!globals.uilanguagessimple) {
			return defaultCulture;
		}

		const found = _.find(globals.uilanguagessimple, {'language': theLanguage});
		if (found && found.culture) {
			return found.culture;
		}
		return defaultCulture;
	};

	/**
	 *
	 * @type {module}
	 */
	app = angular.module('platformApp', requiredModules);

	/**
	 * First config block: creates decorator for $templateCache to load all templates in a file.
	 */
	app.config(['$provide', function ($provide) {
		$provide.decorator('$templateCache', ['$delegate', '$http', '$injector', function ($delegate, $http, $injector) {
			$delegate.loadTemplateFile = function (url) {
				return $http.get(url)
					.then(function (response) {
						// This is done to prevent infinite loop in circulur references.
						$injector.get('$compile')(response.data);
					});
			};
			return $delegate;
		}]);
	}]);

	// token authentication, loading bar are configured here.
	app.config(['tokenAuthenticationProvider', 'cfpLoadingBarProvider',
		function (tokenAuthenticationProvider, cfpLoadingBarProvider) {
			urlBuilder();

			tokenAuthenticationProvider.setUrl(globals.identityBaseUrl, globals.identityBaseUrl + 'connect/token');
			tokenAuthenticationProvider.setBaseUrl(globals.webApiBaseUrl);
			cfpLoadingBarProvider.includeSpinner = false;
		}
	]);

	/* make $translateProvider and $provide visible to execution phase */
	app.config(['$provide', '$translateProvider', function ($provide, $translateProvider) {
		$provide.value('$translateProvider', $translateProvider);
		$provide.value('$provide', $provide);
	}]);

	app.config(['$sanitizeProvider', function ($sanitizeProvider) {
		$sanitizeProvider.enableSvg(true);
	}]);

	/* translate provider */
	app.config(['$translateProvider', '_',
		function ($translateProvider, _) {
			$translateProvider.useLoader('platformTranslateCustomLoader', {});
			$translateProvider.useSanitizeValueStrategy('escapeParameters');
			$translateProvider.fallbackLanguage('en');
			$translateProvider.useLoaderCache(true);

			const acceptLanguages = navigator.languages || [navigator.languages];
			globals.acceptLanguages = [];
			_.forEach(acceptLanguages, function (item, key) {
				globals.acceptLanguages.push(_.toLower(acceptLanguages[key]));
			});

			const lastUsedLanguage = globals.readLastLanguageFromStorage();

			if (lastUsedLanguage) {
				if (lastUsedLanguage.language.indexOf('-') !== -1) {
					$translateProvider.fallbackLanguage([lastUsedLanguage.language.split('-')[0], 'en']);
				}
				$translateProvider.use(lastUsedLanguage.language);
			} else {
				// must be set here as well, otherwise logon dialog will not be translated
				let fallBackLang = globals.acceptLanguages[0];
				fallBackLang = globals.checkFallBackLanguage(fallBackLang, 'en');
				$translateProvider.use(fallBackLang);
			}
		}
	]);

	/**
	 *
	 */
	app.config([
		'$provide', function ($provide) {
			return $provide.decorator('$rootScope', [
				'$delegate', function ($delegate) {
					$delegate.safeApply = function (fn) {
						const phase = $delegate.$$phase;
						if (phase === '$apply' || phase === '$digest') {
							if (fn && typeof fn === 'function') {
								fn();
							}
						} else {
							$delegate.$apply(fn);
						}
					};
					return $delegate;
				}
			]);
		}
	]);

	/**
	 * configure logProvider
	 */
	app.config(['$logProvider', function ($logProvider) {
		$logProvider.debugEnabled(globals.logProviderDebug || true);
	}]);

	app.config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.globalResolves({
				telephoneScheme: ['$http', '$q', 'globals', function ($http, $q, globals) {
					if (angular.isObject(globals.telephoneScheme)) {
						return $q.when(globals.telephoneScheme);
					}

					return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/telephonescheme')
						.then(function (response) {
							globals.telephoneScheme = response.data;
						});
				}]
			});
		}
	]);

	/*
	// needed for angularjs 1.8
	app.config(['$qProvider',
	function ($qProvider) {
		$qProvider.errorOnUnhandledRejections(globals.errorOnUnhandledRejections || true);
	}]);

	app.config(['$locationProvider',
	function ($locationProvider) {
		$locationProvider.hashPrefix('');
	}]);
	*/

	/** a p p . r u n    a p p . r u n    a p p . r u n    a p p . r u n    a p p . r u n    a p p . r u n    a p p . r u n
	 *
	 */
	app.run(['$rootScope', '$state', '$log', 'platformUtilService', 'platformTranslateService', 'moment', function ($rootScope, $state, $log, platformUtilService, platformTranslateService, moment) {
		globals.longBuildVersion = globals.buildversion;
		globals.buildversion = globals.buildversion.split('+')[0];
		/* define further properties */
		Object.defineProperties(app, {
			'initialStartup': {
				value: true,
				writable: true,
				enumerable: true
			},
			'productName': {
				value: globals.productName,
				writable: true,
				enumerable: true
			},
			'productLogo': {
				value: globals.productLogoUrl,
				writable: true,
				enumerable: true
			},
			'productLogoPrimary': {
				value: globals.productLogoPrimaryUrl,
				writable: true,
				enumerable: true
			},
			// $json = $json -replace "(version: '[A-Za-z0-9-.@',]+)", "productversion: '$productversion', buildversion: '$buildversion', productdate: '$productdate', installationdate: '$installationdate',"
			'productVersion': {
				value: globals.productversion || 'n/a',
				writable: false,
				enumerable: true
			},
			'buildVersion': {
				value: globals.longBuildVersion || 'n/a',
				writable: false,
				enumerable: true
			},
			'productBuildVersion': {
				value: (globals.productversion || 'n/a') + '@' + (globals.buildversion || 'n/a'),
				writable: false,
				enumerable: true
			},
			'productDate': {   // in iso format
				value: globals.productdate,
				writable: false,
				enumerable: true
			},
			'productInstallationDate': { // in iso format
				value: globals.installationdate,
				writable: false,
				enumerable: true
			},
			'productDateLocal': {   // in iso format
				value: globals.productdate ? moment(Date.parse(globals.productdate)).format('L LTS') : 'n/a',
				writable: false,
				enumerable: true
			},
			'productInstallationDateLocal': { // in iso format
				value: globals.installationdate ? moment(Date.parse(globals.installationdate)).format('L LTS') : 'n/a',
				writable: false,
				enumerable: true
			},
			'additionalInfo': { // new rei@01.10.2021
				value: globals.additionalInfo,
				writable: false,
				enumerable: true
			}
		});

		/**
		 *
		 */
		app.navigateToCompany = function () {
			$state.transitionTo('company');
		};

		/**
		 *
		 */
		app.navigateToInitialPage = function () {
			$state.transitionTo('initial');
		};

		/**
		 */
		app.closeCompanyNavigateToDesktop = function () {
			app.initialStartup = false;
			app.navigateToDesktopPage();
		};

		/**
		 */
		app.closeCompanyNavigateToLogin = function () {
			console.log('closeCompanyNavigateToLogin startet...');
			if (app.initialStartup) {
				app.navigateToLoginPage();
			} else {
				app.reloadLoginPage();
			}
		};

		/*
		 This method reloads the application and forces to show the company page
		 */
		app.reloadCompanyPage = function () {
			app.initialStartup = false;
			window.location.href = globals.appBaseUrl + '#/company';
			window.location.reload();
		};

		/*
		 This method reloads the application and forces to show the company page
		 */
		app.reloadDesktop = function (initialUrl) {
			app.initialStartup = false;
			if (initialUrl) {
				console.log('force reload to ' + initialUrl);
				window.location.href = initialUrl;
			} else {
				window.location.href = globals.appBaseUrl + '#/app/desktop';
			}
			window.location.reload();
		};

		/*
		 This method reloads the application and force to show desktop screen,
		 it assumes token is valid and selected company is valid for the user.
		 */
		app.navigateToDesktopPage = function () {
			$state.transitionTo(globals.defaultState + '.desktop');
		};

		/**
		 * This method reloads the application and forces to show the loginscreen
		 * @param viaTransitionTo  if true>> we navigate internal via transitionTo
		 * @param withReload
		 */
		app.reloadLoginPage = function (viaTransitionTo, withReload = true) {
			// navigate to custom url
			let targetUrl = app.customLogoutUrl();
			if (targetUrl) {
				window.location = targetUrl;  // direct navigate to custom logout urls
				return;
			}
			// navigate internal, no reload of page required
			if (viaTransitionTo) {
				// $state.transitionTo(globals.portal ? 'portallogin' : 'login');
				window.location = globals.appBaseUrl + '#/' + (globals.portal ? 'portallogin' : 'login');
				return;
			}
			if (withReload) {
				// navigate ti iTWO4.0 force reload, make sure app is completely reloaded
				targetUrl = globals.appBaseUrl + '#/' + (globals.portal ? 'portallogin' : 'login');
				app.initialStartup = true;
				window.location = targetUrl;
				window.location.reload();
			}
		};

		/**
		 * This method calculates the callBackUrl depending on the globals settings for individual customlogoutUrl(s)
		 * We determine if portal or standard login is used
		 * @returns callbackUrl
		 */
		app.customLogoutUrl = function customLogoutUrl() {
			// since logout after clear cache to cause globals initial,
			// get sso info from localstorage
			let ssoLogonKey = globals.appBaseUrl + 'customsso';
			let customSSOItem= window.localStorage.getItem(ssoLogonKey);
			if (customSSOItem){
				customSSOItem = JSON.parse(customSSOItem);
				if (!globals.portal) {
					// rei@19.2.18 added support of special url after logout, redirect to Logon Url
					if (_.isString(customSSOItem.customLogoutUrl)) {
						return customSSOItem.customLogoutUrl;
					}
				} else {
					// rei@19.2.18 added support of special url after logout, redirect to Logon Url
					if (_.isString(customSSOItem.customPortalLogoutUrl)) {
						return customSSOItem.customPortalLogoutUrl;
					}
				}
			}
			return undefined;
		};

		/**
		 * This method calculates the callBackUrl depending on the globals settings for individual customlogoutUrl(s)
		 * We determine if portal or standard login is used
		 * @returns callbackUrl
		 */
		app.logoutCallbackUrl = function logoutCallbackUrl() {
			return app.customLogoutUrl() || globals.clientUrl;
		};

		/**
		 * this method calls a custom url for logout, if configuried in web.config appsettings under
		 *  <add key="logon:customlogouturl" value="http://202.110.133.45:8081/portal/sso.login?SSOLOGOUT=true" />
		 *  <add key="logon:customportallogouturl" value="" />
		 */
		app.logoutAction = function logoutAction() {
			app.initialStartup = true;
			window.location = app.logoutCallbackUrl();
			return true;
		};

		/**
		 * Navigates depending on Mode Portal Flag to Login Page
		 */
		app.navigateToLoginPage = function () {
			app.reloadLoginPage();
		};

		$rootScope.$on(tt.authentication.logoutConfirmed, function () {
			app.navigateToLoginPage();
		});

		$rootScope.$on(tt.authentication.authenticationRequired, function () {
			app.navigateToLoginPage();
		});

		platformUtilService.loadTemplates([
			'app/components/layoutsystem/templates/layout-templates.html' + globals.timestamp,
			'app/components/menulist/menulist-templates.html' + globals.timestamp,
			'app/components/grid/generic-structure/generic-structure-templates.html' + globals.timestamp,
			'cloud.desktop/templates/sidebar/sidebar-cached-templates.html' + globals.timestamp,
			'app/components/ui-elements/ui-element-templates.html' + globals.timestamp,
			'app/components/form/form-templates.html' + globals.timestamp,
			'app/components/layoutsystem/templates/container-empty.html' + globals.timestamp
		]);

		if (globals.preloadTranslations && globals.preloadTranslations.length) {
			platformTranslateService.registerModule(globals.preloadTranslations, true)
				.then(function () {
					$rootScope.safeApply($rootScope, angular.noop);
				});
		}

		// jshint -W072
		$rootScope.$on('$stateChangeError', function (ev, toState, toParams, fromState, fromParams, error) {
			if (fromState.url === '^' && !tt.authentication.userLoggedIn) {
				ev.preventDefault();
				$state.get('login').error = {code: 123, description: 'Exception stack trace'};
				return !globals.portal ? $state.go('login') : $state.go('portallogin');
			} else {
				console.error('$stateChangeError fromState.Name=' + fromState.name + ' toState.Name=' + toState.name, toState, toParams, fromState, fromParams, error);
			}
		});
	}
	]);

	/**
	 */
	angular.element(document).ready(function () {
		// eslint-disable-next-line no-undef
		angular.module('platform').constant('pdfjsLib', pdfjsLib);
		
		angular.bootstrap(document, ['platformApp']);
	});

// eslint-disable-next-line no-undef
})(angular, globals, tt, _);
