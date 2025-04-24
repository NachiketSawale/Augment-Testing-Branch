/**
 * Created by wed on 10/24/2017.
 */
(function (window, $, utility, globals) {
	'use strict';

	let store = window.localStorage;
	let sessionStore = window.localStorage;
	let appGlobal = {
		webApiBaseUrl: '',
		tokenServerUrl: window.webAPIConfig.identityBaseUrl || globals.identityBaseUrl,
		userInfoUrl: 'services/platform/getuserinfo',
		assignedCompanyWithRolesUrl: 'basics/company/getassignedcompanieswithroles',
		checkCompanyUrl: 'basics/company/checkcompany',
		checkDownloadEnabledUrl: 'cloud/help/export/checkenabledfulldownload',
		languagesUrl: 'cloud/common/getlanguages',
		defaultLanguageKey: '/webapi/-defLangOpts',
		contextKey: '/webapi/:{user}-ctx',
		authorizeKey: '/webapi/services/tt:authentication:authNToken',
		defaultLanguage: '{"language":"en","culture":"en-gb"}',
		currentUser: '',
		context: {
			sysContext: {},
			appContext: {}
		},
		authorization: ''
	};

	const clientId = 'iTWO.Cloud';
	const clientSecret = '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}';

	function initialize() {

		appGlobal.context.sysContext = getInitialContext();

		// init authorization
		let token = sessionStore.getItem(appGlobal.authorizeKey);
		if (token) {
			token = JSON.parse(token);
			if (new Date().getTime() <= token.expiration) {
				appGlobal.authorization = 'Bearer ' + token['access_token'];
			}
		}

		// init context
		restoreContextFromStorage();

		// init default language
		let defaultLanguage = sessionStore.getItem(appGlobal.defaultLanguageKey);
		if (defaultLanguage) {
			appGlobal.defaultLanguage = defaultLanguage;
		}

		let urls = utility.resolveUrl();

		appGlobal.webApiBaseUrl = urls.webApiBaseUrl;
		appGlobal.userInfoUrl = appGlobal.webApiBaseUrl + appGlobal.userInfoUrl;
		appGlobal.assignedCompanyWithRolesUrl = appGlobal.webApiBaseUrl + appGlobal.assignedCompanyWithRolesUrl;
		appGlobal.checkCompanyUrl = appGlobal.webApiBaseUrl + appGlobal.checkCompanyUrl;
		appGlobal.checkDownloadEnabledUrl = appGlobal.webApiBaseUrl + appGlobal.checkDownloadEnabledUrl;
		appGlobal.languagesUrl = appGlobal.webApiBaseUrl + appGlobal.languagesUrl;
	}

	function getInitialContext() {
		return {
			signedInClientId: 0,
			clientId: 0,
			permissionClientId: 0,
			permissionRoleId: 0,
			dataLanguageId: 0,
			language: 'en',
			culture: 'en-gb',
			permissionObjectInfo: null,
			secureClientRole: null
		};
	}

	function restoreContextFromStorage() {
		if (appGlobal.currentUser) {
			let contextKey = getContextStorageKey(appGlobal.currentUser), context = store.getItem(contextKey);
			if (context) {
				appGlobal.context = JSON.parse(context);
			}
		}
	}

	function getContextStorageKey(userid) {
		return appGlobal.contextKey.replace('{user}', userid);
	}

	function createAuthorizeHeaders() {
		return {
			'Client-Context': JSON.stringify(appGlobal.context.sysContext),
			'Authorization': appGlobal.authorization
		};
	}

	function createAuthorizeHeadersWithDefaultContext() {
		return $.extend(createAuthorizeHeaders(), {
			'Client-Context': JSON.stringify(getInitialContext()),
		});
	}

	function ajaxInternal(type, url, data, headers, options) {
		return $.ajax($.extend({
			type: type,
			url: url,
			data: data,
			headers: headers
		}, options));
	}

	function getTokenFormServer(postData) {
		const initArgs = {
			client_id: clientId,
			client_secret: clientSecret,
			scope: 'default offline_access'
		};
		return getTokenServerUrl().then(tokenServerUrl => {
			return ajaxInternal('POST', tokenServerUrl + 'connect/token', $.extend(initArgs, postData), {'Content-Type': 'application/x-www-form-urlencoded'}).then(response => {
				saveToken(response);
			}).then(() => {
				return getUserInfo().then(data => {
					saveCurrentUser(data.UserId);
					resetClientContext();
				});
			}).then(() => {
				return checkCompany();
			});
		});
	}

	function login(username, password) {
		return getTokenFormServer({
			grant_type: 'password',
			username: username,
			password: password
		});
	}

	function getTokenServerUrl() {
		return $.when(utility.keepEndsWith(appGlobal.tokenServerUrl, '/'));
	}

	function logout() {

		let tokenInfo = sessionStore.getItem(appGlobal.authorizeKey);
		if (!tokenInfo) {
			return;
		}

		let token = JSON.parse(tokenInfo);

		sessionStore.removeItem(appGlobal.authorizeKey);
		appGlobal.authorization = '';
		appGlobal.currentUser = '';
		appGlobal.userInfoResponse = null;

		return getTokenServerUrl().then(tokenServerUrl => {
			return ajaxInternal('POST', tokenServerUrl + 'connect/revocation',
				{
					token: token['refresh_token'],
					token_type_hint: 'refresh_token',
					client_id: clientId,
					client_secret: clientSecret
				},
				{
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			).then(response => {
				console.log(response);
			}).fail(response => {
				console.warn(response);
			});
		});
	}

	function getUserInfo() {
		if (appGlobal.authorization && appGlobal.userInfoResponse) {
			return $.when(appGlobal.userInfoResponse);
		}
		return ajaxInternal('GET', appGlobal.userInfoUrl, null, createAuthorizeHeaders()).then(response => {
			appGlobal.userInfoResponse = response;
			return response;
		});
	}

	function getAssignedCompaniesWithRoles() {
		return ajaxInternal('GET', appGlobal.assignedCompanyWithRolesUrl, null, createAuthorizeHeadersWithDefaultContext());
	}

	function checkCompany() {
		let context = getClientContext();
		let params = $.param({
			requestedSignedInCompanyId: context.signedInClientId,
			requestedCompanyId: context.clientId,
			requestedPermissionClientId: context.permissionClientId, // this clientId is holding the permission role
			requestedRoleId: context.permissionRoleId
		});
		return ajaxInternal('GET', appGlobal.checkCompanyUrl, params, createAuthorizeHeaders()).then(response => {
			saveClientContext({secureClientRole: response['secureClientRolePart']});
			return response;
		});
	}

	function checkDownloadEnabled() {
		return ajaxInternal('GET', appGlobal.checkDownloadEnabledUrl, null, createAuthorizeHeaders());
	}

	function saveToken(tokenData) {
		if (!tokenData.expiration) {
			tokenData.expiration = new Date().getTime() + tokenData['expires_in'] * 1000;
		}
		appGlobal.authorization = 'Bearer ' + tokenData['access_token'];
		sessionStore.setItem(appGlobal.authorizeKey, JSON.stringify(tokenData));
	}

	function resetClientContext() {
		if (appGlobal.context && appGlobal.context.sysContext) {
			appGlobal.context.sysContext.secureClientRole = null;
			saveClientContext(appGlobal.context.sysContext);
		}
	}

	function saveClientContext(data) {
		if (appGlobal.currentUser) {
			let contextKey = getContextStorageKey(appGlobal.currentUser);
			appGlobal.context.sysContext = $.extend(appGlobal.context.sysContext, data);
			store.setItem(contextKey, JSON.stringify(appGlobal.context));
		}
	}

	function saveCurrentUser(userid) {
		appGlobal.currentUser = userid;
		restoreContextFromStorage();
	}

	function saveDefaultLanguage(language) {
		let currLanguage = $.extend(JSON.parse(appGlobal.defaultLanguage), language);
		appGlobal.defaultLanguage = JSON.stringify(currLanguage);
		sessionStore.setItem(appGlobal.defaultLanguageKey, appGlobal.defaultLanguage);
	}

	function getClientContext(getSerializeValue) {
		let value = appGlobal.context.sysContext;
		if (getSerializeValue) {
			return JSON.stringify(value);
		}
		return value;
	}

	function getLanguages() {
		return ajaxInternal('GET', appGlobal.languagesUrl, null, createAuthorizeHeaders()).then((languages) => {
			if (languages && languages.length) {
				languages.forEach(lang => {
					if (!lang.Description && lang.DescriptionInfo) {
						lang.Description = lang.DescriptionInfo.Translated || lang.DescriptionInfo.Description;
					}
				});
			}
			return languages;
		});
	}

	function ready() {
		if (appGlobal.authorization) {
			return getUserInfo().then(data => {
				saveCurrentUser(data.UserId);
			}).fail(() => {
				logout();
			});
		}
		return $.when();
	}

	function timeNow() {
		return '[' + new Date().toLocaleTimeString() + '] ';
	}

	function refreshToken(refreshToken) {
		return new Promise((resolve, reject) => {
			getTokenFormServer({
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			}).then(data => {
				resolve(data);
			}).fail(data => {
				reject(data);
			});
		});
	}

	function startRefreshTokenSchedule() {
		let forceRefreshBeforeInvalidInSec = 30; // seconds
		let calculateCurrentRefreshTimeout = (token) => {
			let jwtParsed = utility.parseJwt(token['access_token']);
			let expiredDateTime_ms = new Date(jwtParsed.exp * 1000).getTime(); // exp are in sec since EPOCH
			let refreshDateTime_ms = expiredDateTime_ms - forceRefreshBeforeInvalidInSec * 1000;
			let refreshTimeout_ms = refreshDateTime_ms - new Date().getTime();
			let expirationDate = new Date(refreshDateTime_ms).toLocaleString();

			console.log('%c' + timeNow() + ' %c Start refresh token schedule timeout=' + refreshTimeout_ms + 'ms' + ' @' + expirationDate, 'font-weight:bold;', 'color:#46b8da;');

			return refreshTimeout_ms;
		};

		let token = JSON.parse(sessionStore.getItem(appGlobal.authorizeKey));
		if (token) {
			let refreshTimeout = calculateCurrentRefreshTimeout(token);
			window.setTimeout(() => {
				refreshToken(token['refresh_token']).then((data) => {
					startRefreshTokenSchedule();
				}, (reason) => {
					console.info(reason);
				});
			}, refreshTimeout);
		}
	}

	let authService = {
		ready: ready,
		login: login,
		logout: logout,
		saveDefaultLanguage: saveDefaultLanguage,
		getLanguages: getLanguages,
		getUserInfo: getUserInfo,
		mergeClientContext: saveClientContext,
		getAssignedCompaniesWithRoles: getAssignedCompaniesWithRoles,
		getClientContext: getClientContext,
		checkCompany: checkCompany,
		checkDownloadEnabled: checkDownloadEnabled,
		getAuthorization: function () {
			return appGlobal.authorization;
		},
		isLogon: function () {
			return !!appGlobal.authorization;
		},
		getDefaultLanguage: function () {
			return JSON.parse(appGlobal.defaultLanguage);
		},
		startRefreshTokenSchedule: function () {
			if (this.isLogon()) {
				startRefreshTokenSchedule();
			}
		}
	};

	initialize();

	window.authService = authService;
})(window, window.jQuery, window.utility, globals);
