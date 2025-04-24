/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */
/* global app tt globals Platform */

(function (angular) {
	'use strict';

	/**
	 * @jsdoc service
	 * @name platform:platformContextService
	 * @function
	 * @requires $http
	 *
	 * @description platformContextService provides access to system and application contexts
	 */
	angular.module('platform').factory('platformContextService', platformContextService);

	platformContextService.$inject = ['$injector', '$q', '$http', '$translate', '_', 'moment', '$rootScope', 'tokenAuthentication', 'platformTranslateService', 'platformUtilService', 'platformCreateUuid'];

	function platformContextService($injector, $q, $http, $translate, _, moment, $rootScope, tokenAuthentication, platformTranslateService, platformUtilService, platformCreateUuid) {
		let service;
		let sysContext = {};
		let localeSystemOptions = null;
		const defaultLanguage = 'en';
		const defaultCulture = 'en-gb';
		var defaultSysContext = {
			signedInClientId: 0,  // added 17.4.15
			signedInClientCode: '', // rei@7.2.19 added
			signedInClientName: '', // rei@7.2.19 added
			clientId: 0,
			clientCode: '', // rei@7.2.19 added
			clientName: '', // rei@7.2.19 added
			permissionClientId: 0,
			permissionRoleId: 0,
			dataLanguageId: 1,
			language: null,
			culture: null,
			secureClientRole: undefined,  // rei@7.10.17, support secureClientRole
			permissionObjectInfo: ''
		};
		let currentUserId = 0;
		let appContext = {};
		let secureContextRoleReady = $q.defer(); // rei@04.11.2021 if secureRoleContext is valid, this promise will be resolved....
		let objectPermissionInfoFallback = '';
		let clientGuid = getSavedOrNewClientGuid();

		function getStorageKey(userId) {
			const theId = userId ? userId : currentUserId;
			return globals.appBaseUrl + ':' + theId + '-ctx';
		}

		/**
		 * @jsdoc function
		 * @name updateHttpClientContextHeader
		 * @function
		 * @methodOf platform:platformContextService
		 * @description updates the content of http header with current state of sysContext
		 */
		const setDefaultHttpClientContextHeader = function setDefaultHttpClientContextHeader(culture, language, dataLanguageId) {
			// console.log('setDefaultHttpClientContextHeader', culture, language, dataLanguageId);
			let clientCtx = _.clone(defaultSysContext);
			clientCtx.dataLanguageId = dataLanguageId || service.getDataLanguageId();
			clientCtx.language = language || service.getLanguage();
			clientCtx.culture = culture || service.getCulture();
			clientCtx.secureClientRole = undefined;
			clientCtx.clientCode = undefined;
			clientCtx.clientName = undefined;
			clientCtx.signedInClientCode = undefined;
			clientCtx.signedInClientName = undefined;
			clientCtx.permissionObjectInfo = undefined;
			// console.log('setDefaultHttpClientContextHeader called ',clientCtx.clientId,clientCtx.signedInClientId,clientCtx.permissionClientId,clientCtx.permissionRoleId, clientCtx.secureClientRole);
			$http.defaults.headers.common['Client-Context'] = angular.toJson(clientCtx);
			$http.defaults.headers.common['Client-GUID'] = clientGuid;
		};

		/**
		 * @jsdoc function
		 * @name updateHttpClientContextHeader
		 * @function
		 * @methodOf platform:platformContextService
		 * @description updates the content of http header with current state of sysContext
		 */
		const updateHttpClientContextHeader = function updateHttpClientContextHeader() {
			let clientCtx = _.clone(sysContext);
			// console.log('updateHttpClientContextHeader called ',clientCtx.clientId,clientCtx.signedInClientId,clientCtx.permissionClientId,clientCtx.permissionRoleId, clientCtx.secureClientRole);

			if (clientCtx.secureClientRole) {  // do not put the ids onto the client header if its already there in secureClientRole
				clientCtx.signedInClientId = undefined;
				clientCtx.clientId = undefined;
				clientCtx.permissionClientId = undefined;
				clientCtx.permissionRoleId = undefined;
			}
			// clientname and signinClientname not required in context, we clean it
			clientCtx.clientCode = undefined;
			clientCtx.clientName = undefined;
			clientCtx.signedInClientCode = undefined;
			clientCtx.signedInClientName = undefined;
			if (clientCtx.permissionObjectInfo === '') clientCtx.permissionObjectInfo = undefined;

			$http.defaults.headers.common['Client-Context'] = angular.toJson(clientCtx);
			$http.defaults.headers.common['Client-GUID'] = clientGuid;

			if (globals.trace && globals.trace.context) {
				let stacktrace = new Error().stack;
				stacktrace = stacktrace.replace('Error', '');
				let contextInfo = 'C.Id:' + sysContext.clientId + ' SC.Id:' + sysContext.signedInClientId + ' PC.Id:' + sysContext.permissionClientId + ' R.Id:' + sysContext.permissionRoleId;
				console.groupCollapsed('Http Context Header changed: ' + contextInfo + '(expand for details)');
				console.trace(stacktrace);
				console.groupEnd();
			}
		};

		/**
		 *
		 * @param title
		 * @param body
		 * @returns {*}
		 */
		function showAlert(title, body) {
			const platformDialogService = $injector.get('platformDialogService');
			const modalOptions = {headerText: title, bodyText: body, backDrop: true};
			return platformDialogService.showDialog(modalOptions)
				.then(function (response) {
					return response.result;
				});
		}

		function applyLocaleSystemOptions() {
			if (localeSystemOptions === null) {
				localeSystemOptions = {
					firstDayOfWeek: 0,
					firstWeekOfYear: 0
				};

				$http.get(globals.webApiBaseUrl + 'services/platform/locale-system-options')
					.then((response) => {
						if (response.data) {
							localeSystemOptions = response.data;

							applyLocaleSystemOptions();
						}
					});
			} else {
				if (localeSystemOptions.firstWeekOfYear !== 0) {
					let doy = -1;
					let dow = localeSystemOptions.firstDayOfWeek % 7;

					switch (localeSystemOptions.firstWeekOfYear) {
						case 1:  // First-Day
							doy = 7 + dow - 1;
							break;

						case 2: // First-Four-Day-Week
							doy = 7 + dow - 4;
							break;

						case 3: // First-Full-Week
							doy = 7 + dow - 7;
							break;

						case 4: // ISO week
							return;

						default:
							throw new Error(`Unsupported value | firstWeekOfYear: ${localeSystemOptions.firstWeekOfYear}`);
					}

					moment.updateLocale(moment.locale(), {
						week: {
							dow: dow,   // first day of week (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
							doy: doy    // 7 + dow - janX, where janX is the first day of January that must belong to the first week of the year
						}
					});
				}
			}
		}

		function getSavedOrNewClientGuid() {
			let lastClientGuid = localStorage.getItem('clientGuid');
			if (_.isNil(lastClientGuid)) {
				lastClientGuid = platformCreateUuid();
				localStorage.setItem('clientGuid', lastClientGuid);
			}
			return lastClientGuid;
		}

		service = {
			/**
			 * @jsdoc function
			 * @name initialize
			 * @function
			 * @methodOf platform:platformContextService
			 * @description initializes context service
			 */
			initialize: function initialize() {
				angular.extend(sysContext, defaultSysContext);

				/**
				 * calculate browser languge via callback function
				 * @param callback
				 *
				 * Browser  navigator.language  navigator.languages
				 * chrome  "de"                 ["de-DE", "de", "en-US", "en", "fr", "zh-CN", "zh", "zh-TW"]
				 * Edge    "de-DE"              n/a
				 * IE11    "de-DE"              n/a
				 * Safari  "de-DE"              ["de-DE"]
				 * firefox "de"                 [ "de", "en-US", "en" ]
				 *
				 * remark: rei@20.2.18: the following fallback Language calculation is done as well in app.js app.config block.
				 */
				let fallBackLang = globals.acceptLanguages[0];
				fallBackLang = globals.checkFallBackLanguage(fallBackLang, defaultLanguage);
				let fallBackCulture = globals.getGlobalsLanguagesCulture(fallBackLang, defaultCulture);

				let langOpt = globals.readLastLanguageFromStorage();

				if (langOpt) {
					if (!langOpt.language) {
						// rei@20.2.18 check if browser language is part of the available ui languages
						this.setLanguage(fallBackLang);
					} else {
						this.setLanguage(langOpt.language || fallBackLang);
					}
					this.setCulture(langOpt.culture || fallBackCulture);
				} else {
					this.setLanguage(fallBackLang);
					this.setCulture(fallBackCulture);
				}

				moment.locale(sysContext.culture);

				// rei: 02.12.14 patch german localization of LT to the format we accept with [Uhr]
				moment.localeData('de')._longDateFormat.LT = 'HH:mm';
			},

			/**
			 * @jsdoc event
			 * @name contextChanged
			 * @methodOf platform:platformContextService
			 * @description Messenger that fires events when a property of the system context has been changed
			 */
			contextChanged: new Platform.Messenger(),

			/**
			 * get client guid
			 * @returns {string}
			 */
			getClientGuid: () => clientGuid,

			/**
			 * @jsdoc function
			 * @name setLanguage
			 * @function
			 * @methodOf platform:platformContextService
			 * @description set currently used language
			 * @param language {string} ISO language for UI text
			 */
			setLanguage: function setLanguage(language) {
				if (language !== sysContext.language) {
					sysContext.language = language;
					updateHttpClientContextHeader();

					$translate.use(language).then(function () {
						service.contextChanged.fire('language');
					});
				}
			},

			/**
			 * @jsdoc function
			 * @name getLanguage
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets currently selected language
			 * @returns {string} current language
			 */
			getLanguage: function getLanguage() {
				return sysContext.language;
			},

			/**
			 * @jsdoc function
			 * @name getLanguage
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets currently selected language
			 * @returns {string} current language
			 */
			getDefaultLanguage: function getDefaultLanguage() {
				return defaultLanguage;
			},

			/**
			 * @jsdoc function
			 * @name setCulture
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets ISO code used to format Currency/Date/Datetime etc
			 * @param newCulture {string} ISO code for Currency/Date/Datetime etc
			 * @returns {string} culture ISO code
			 */
			culture: function culture(newCulture) {
				if (newCulture && newCulture !== sysContext.culture) {
					sysContext.culture = newCulture;

					updateHttpClientContextHeader();

					if (angular.isDefined(moment)) {
						moment.locale(sysContext.culture);

						applyLocaleSystemOptions();
					}
					this.contextChanged.fire('culture');
				}
				return sysContext.culture;
			},

			/**
			 * @jsdoc function
			 * @name setCulture
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets ISO code used to format Currency/Date/Datetime etc
			 * @param newCulture {string} ISO code for Currency/Date/Datetime etc
			 * @returns {string} culture ISO code
			 */
			setCulture: function setCulture(newCulture) {
				return this.culture(newCulture);
			},

			/**
			 * @jsdoc function
			 * @name getCulture
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets ISO code used to format Currency/Date/Datetime etc
			 * @returns {string} culture ISO code
			 */
			getCulture: function getCulture() {
				return this.culture();
			},

			/**
			 * @jsdoc function
			 * @name setDataLanguageId
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets the language id of database language to be used in service operations
			 * @param id {int} new language id
			 */
			setDataLanguageId: function setDataLanguageId(id) {
				if (id !== 0 && id !== sysContext.dataLanguageId) {
					sysContext.dataLanguageId = id;
					updateHttpClientContextHeader();
					this.contextChanged.fire('dataLanguageId');
				}
			},

			/**
			 * @jsdoc function
			 * @name getDataLanguageId
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets language id of database language currently used in service operations
			 * @returns {int} language id
			 */
			getDataLanguageId: function getDataLanguageId() {
				return sysContext.dataLanguageId;
			},

			/**
			 * set current userid for usage for saving user specific values
			 * @param userId
			 */
			setCurrentUserId: function setCurrentUserId(userId) {
				currentUserId = userId;
			},

			getCurrentUserId: function getCurrentUserId() {
				return currentUserId;
			},

			/**
			 * @jsdoc function
			 * @name setCompanyConfiguration
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets company and permission configuration
			 * @param signedInClientId {int} id of signedin company
			 * @param companyId {int} id of company
			 * @param permissionCompanyId {int} id of company where the permissions are defined
			 * @param permissionRoleId {int} id of role to be used
			 * @param secureClientRole {string}
			 * @param signedInClientCode {string}
			 * @param signedInClientName {string}
			 * @param companyCode {string}
			 * @param companyName {string}
			 */
			setCompanyConfiguration: function setCompanyConfiguration(signedInClientId, companyId, permissionCompanyId, permissionRoleId, secureClientRole, signedInClientCode, signedInClientName, companyCode, companyName) {
				let changed = false;

				if (signedInClientId !== sysContext.signedInClientId) {
					sysContext.signedInClientId = signedInClientId;
					changed = true;
				}
				if (companyId !== sysContext.clientId) {
					sysContext.clientId = companyId;
					changed = true;
				}
				if (permissionCompanyId !== sysContext.permissionClientId) {
					sysContext.permissionClientId = permissionCompanyId;
					changed = true;
				}
				if (permissionRoleId !== sysContext.permissionRoleId) {
					sysContext.permissionRoleId = permissionRoleId;
					changed = true;
				}
				if (secureClientRole !== sysContext.secureClientRole) {
					// console.log('platformctx: ',secureClientRole, sysContext.secureClientRole, secureContextRoleReady.promise);
					sysContext.secureClientRole = secureClientRole;
					if (_.isNil(sysContext.secureClientRole) && secureContextRoleReady.promise.$$state.status === 1) {
						// console.log('platformctx: ',secureContextRoleReady);
						secureContextRoleReady = $q.defer();
					}
					changed = true;
				}
				if (signedInClientCode !== sysContext.signedInClientCode) {
					sysContext.signedInClientCode = signedInClientCode || '';
					changed = true;
				}
				if (signedInClientName !== sysContext.signedInClientName) {
					sysContext.signedInClientName = signedInClientName;
					changed = true;
				}
				if (companyCode !== sysContext.clientCode) {
					sysContext.clientCode = companyCode || '';
					changed = true;
				}
				if (companyName !== sysContext.clientName) {
					sysContext.clientName = companyName;
					changed = true;
				}

				if (changed) {
					updateHttpClientContextHeader();
					if (secureClientRole) {
						secureContextRoleReady.resolve();  // enable and resolve promise
						this.contextChanged.fire('companyConfiguration');
					}
				}
				return changed;
			},

			/**
			 * method companyRoleConfigisValid
			 * return true if none of the signedInClientId,clientId,permissionClientId,permissionRoleId is 0
			 * @returns  bool
			 */
			companyRoleConfigisValid: function () {
				return (sysContext.signedInClientId && sysContext.clientId && sysContext.permissionClientId && sysContext.permissionRoleId);
			},

			/**
			 * @jsdoc function
			 * @name setPermissionObjectInfo
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets object permission info
			 * @param permissionObjectInfo {string} object permission info
			 */
			setPermissionObjectInfo: function setPermissionObjectInfo(permissionObjectInfo) {
				let changed = false;

				if (_.isNil(permissionObjectInfo) || permissionObjectInfo === '') {
					permissionObjectInfo = objectPermissionInfoFallback || '';
				}

				if (permissionObjectInfo !== sysContext.permissionObjectInfo) {
					sysContext.permissionObjectInfo = permissionObjectInfo;
					changed = true;
				}

				if (changed) {
					updateHttpClientContextHeader();
					this.contextChanged.fire('permissionObjectInfo');
				}
			},

			/**
			 * @ngdoc function
			 * @name applyObjectPermissionFallback
			 * @function
			 * @methodOf platform:platformContextService
			 * @description
			 * @param suppressUpdate {bool} don't call setPermissionObjectInfo
			 */
			applyObjectPermissionFallback: (suppressUpdate) => {
				const result = {
					permissionObjectInfo: null
				};

				$rootScope.$emit('platform:request-object-permission-fallback', result);

				if(result.permissionObjectInfo !== objectPermissionInfoFallback) {
					if(service.permissionObjectInfo === objectPermissionInfoFallback) {
						objectPermissionInfoFallback = result.permissionObjectInfo;
						if(!suppressUpdate) {
							service.setPermissionObjectInfo(null);
						}
					} else {
						objectPermissionInfoFallback = result.permissionObjectInfo;
					}
				}
			},

			/**
			 * @jsdoc function
			 */
			setDefaultClientContextHeader: () => {
				// console.log('setDefaultClientContextHeader');
				setDefaultHttpClientContextHeader();
			},

			/**
			 * @jsdoc function
			 * @name getContext
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets a copy of currently used context
			 * @returns {object} cloned content of internal state
			 */
			getContext: function getContext() {
				return _.clone(sysContext);
			},

			/**
			 * @jsdoc function
			 * @name setContext
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets a new configuration
			 * @param {object} context containing new configuration to be used
			 */
			setContext: function setContext(context) {
				angular.extend(sysContext, context);
				updateHttpClientContextHeader();
				this.contextChanged.fire('context');
			},

			/**
			 * @jsdoc event
			 * @name applicationValueChanged
			 * @methodOf platform:platformContextService
			 * @description Messenger that fires events when an application values has been changed
			 */
			applicationValueChanged: new Platform.Messenger(),

			/**
			 * @jsdoc function
			 * @name removeApplicationValue
			 * @function
			 * @methodOf platform:platformContextService
			 * @description removes an application defined value
			 * @param key {string} name of property to retrieve
			 * @returns {*} true if there was an item , false if not found
			 */
			removeApplicationValue: function removeApplicationValue(key) {
				// eslint-disable-next-line no-prototype-builtins
				if (angular.isString(key) && appContext.hasOwnProperty(key)) {
					delete appContext[key];
					return true;
				}
				return false;
			},

			/**
			 * @jsdoc function
			 * @name getApplicationValue
			 * @function
			 * @methodOf platform:platformContextService
			 * @description gets an application defined value
			 * @param key {string} name of property to retrieve
			 * @returns {*} value of key or null
			 */
			getApplicationValue: function getApplicationValue(key) {
				// eslint-disable-next-line no-prototype-builtins
				if (angular.isString(key) && appContext.hasOwnProperty(key)) {
					return appContext[key].val;
				}
				return null;
			},

			/**
			 * @jsdoc function
			 * @name setApplicationValue
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets an application defined value
			 * @param key {string} key name of property to be inserted or updated
			 * @param value {*} application defined data
			 * @param doPersist {bool} doPersist, save data into storage
			 */
			setApplicationValue: function setApplicationValue(key, value, doPersist) {
				if (angular.isString(key)) {
					if (angular.isUndefined(value)) {
						value = null;
					}
					if (!appContext[key] || appContext[key].val !== value) {
						appContext[key] = {val: value, persist: doPersist};
						this.applicationValueChanged.fire(key);
					}
				}
			},

			/**
			 * @jsdoc function
			 * @name setApplicationValueWithSave
			 * @function
			 * @methodOf platform:platformContextService
			 * @description sets an application defined value and save this to local storage
			 * @param key {string} key name of property to be inserted or updated
			 * @param {*} value application defined data
			 */
			setApplicationValueWithSave: function setApplicationValueWithSave(key, value) {
				this.setApplicationValue(key, value, true);
				saveDebounced();
			},
			/**
			 * @jsdoc function
			 * @name resetUserContextToLocalStorage
			 * @description remove user context from storage complete
			 * @param userId
			 */
			resetUserContextToLocalStorage: function (userId) {
				// Put the object into storage
				var key = getStorageKey(userId);
				localStorage.removeItem(key);
			},

			/**
			 * @jsdoc function
			 * @name saveContextToLocalStorage
			 * @function
			 * @methodOf platform:platformContextService
			 * @description saves the context to local storage
			 * @param userId
			 */
			saveContextToLocalStorage: function (userId) {
				// Put the object into storage
				const key = getStorageKey(userId);
				let appPersist = _.omitBy(appContext, function (a) {  // rei@9.1.17: breaking change from lodash 3, now we must use omitBy
					return a.persist !== true;
				});
				let mysyscontext = this.getContext();
				// rei@15.3.18 discard languages from being save into localstorage
				mysyscontext.dataLanguageId = undefined;
				mysyscontext.language = undefined;
				mysyscontext.culture = undefined;
				mysyscontext.secureClientRole = undefined;
				var saveCtx = {sysContext: mysyscontext, appContext: appPersist};
				localStorage.setItem(key, JSON.stringify(saveCtx));
				globals.saveLanguageInfo2Storage({language: this.getLanguage(), culture: this.getCulture()});
			},

			/**
			 * this method reads the syscontext from storage and clears all obsolete values
			 **/
			ClearObsoleteProperties: function () {
				const key = getStorageKey();
				let mySysContext, changed = false;
				let savedContext = localStorage.getItem(key);
				if (!_.isNil(savedContext)) {
					const myContext = JSON.parse(savedContext);
					mySysContext = myContext.sysContext;
					// put all cleanup properties here
					if (mySysContext && mySysContext.secureClientRole) {
						changed = true;
						// ALM 85898 it's desirable to keep last values for having these selected after relogin
						//           mySysContext.signedInClientId/clientId/permissionClientId/permissionRoleId
						mySysContext.clientCode = undefined;
						mySysContext.clientName = undefined;
						mySysContext.permissionObjectInfo = undefined;
						mySysContext.signedInClientCode = undefined;
						mySysContext.signedInClientName = undefined;
						mySysContext.secureClientRole = undefined;
					}
					if (changed) {
						// service.saveContextToLocalStorage();
						var saveCtx = {sysContext: myContext.sysContext, appContext: myContext.appContext};
						localStorage.setItem(key, JSON.stringify(saveCtx));
					}
				}
			},
			unregisterLocalStorageChanges: function () {
				window.onstorage = null;  // unregister onStorage Handler
			},
			registerLocalStorageChanges: function () {
				// Put the object into storage
				let logoutForcedKey = getStorageKey() + '/logout';
				window.localStorage.setItem(logoutForcedKey, JSON.stringify({force: false}));
				// console.log ('registerLocalStorageChanges called');
				window.onstorage = () => { // i'm call when local storage changes
					const logoutForced = window.localStorage.getItem(logoutForcedKey);
					// console.log('window.onstorage for ' + logoutForcedKey);
					if (logoutForced) {
						try {
							const logOut = JSON.parse(logoutForced) || '';
							if (logOut.force) {
								console.log('firing logout for this window');
								app.reloadLoginPage();
							}
						} catch (e) {
							console.log('window.onstorage parse failed', e);
						}
					}
				};
			},
			setForceLogoutViaLocalStorageChanges: function () {
				// console.log('setForceLogoutViaLocalStorageChanges called');
				let logoutForcedKey = getStorageKey() + '/logout';
				service.unregisterLocalStorageChanges(); // unregister myself from notification, we do not want to be notified for the change
				window.localStorage.setItem(logoutForcedKey, JSON.stringify({force: true}));
			},
			/**
			 * @jsdoc function
			 * @name readContextFromLocalStorage
			 * @function
			 * @methodOf platform:platformContextService
			 * @description reads the context from local storage
			 * @param userId
			 */
			readContextFromLocalStorage: function (userId) {
				// Retrieve the object from storage
				const key = getStorageKey(userId);
				// console.log ('readContextFromLocalStorage');

				let mySysContext;
				let myAppContext;

				let savedContext = localStorage.getItem(key);
				if (!_.isNil(savedContext)) {
					const myContext = JSON.parse(savedContext);
					mySysContext = myContext.sysContext;
					myAppContext = myContext.appContext;
				}
				if (mySysContext) {
					this.setCompanyConfiguration(mySysContext.signedInClientId, mySysContext.clientId, mySysContext.permissionClientId,
						mySysContext.permissionRoleId, mySysContext.secureClientRole);
				}
				if (myAppContext) {
					angular.extend(appContext, myAppContext);
				}
			},
			/**
			 *
			 * @param tokenPayload
			 */
			validateRefreshTokenWithContext(tokenPayload) {
				const cUserId = _.toString(service.getCurrentUserId());
				const tokenUserId = tokenPayload.user_id || tokenPayload.itwo_userid;
				// const tokenPayload = getJwtInfo(tokenRefreshResult.access_token);
				if (cUserId !== '0' && cUserId !== tokenUserId) {
					const params = {cUserId: cUserId, tUserId: tokenUserId};
					const titleByTpl = platformTranslateService.instantviaTemplate('platform.contextIssue.title', params);
					const bodyByTpl = platformTranslateService.instantviaTemplate('platform.contextIssue.body', params);
					showAlert(titleByTpl, bodyByTpl).then(function (result) {
						console.log(result);
						app.reloadDesktop();
					});
				}
			},
			/**
			 * @jsdoc function
			 * @name removeCustomSsoFromLocalStorage
			 * @description remove custom sso info from localstorage
			 */
			removeCustomSsoFromLocalStorage: function () {
				let ssoLogonKey = globals.appBaseUrl + 'customsso';
				window.localStorage.removeItem(ssoLogonKey);
			},
			/**
			 * @jsdoc function
			 * @name setCustomSsoToLocalStorage
			 * @description set custom sso info to localstorage
			 */
			setCustomSsoToLocalStorage: function () {
				let ssoLogonKey = globals.appBaseUrl + 'customsso';
				let ssoLogonValue = {
					useCustomSSOLogon: true,
					customLogoutUrl: globals.customLogoutUrl,
					customPortalLogoutUrl: globals.customPortalLogoutUrl
				};
				window.localStorage.setItem(ssoLogonKey, JSON.stringify(ssoLogonValue));
			}
		}; // end service object

		let saveDebounced = platformUtilService.getDebouncedFn(() => {
			service.saveContextToLocalStorage();
		}, 2000);

		/**
		 * direct access to company and permission id's
		 */
		Object.defineProperties(service, {
			'signedInClientId': {
				get: function () {
					return sysContext.signedInClientId;
				}, enumerable: true
			},
			'signedInClientCode': {
				get: function () {
					return sysContext.signedInClientCode;
				}, enumerable: true
			},
			'signedInClientName': {
				get: function () {
					return sysContext.signedInClientName;
				}, enumerable: true
			},
			'clientId': {
				get: function () {
					return sysContext.clientId;
				}, enumerable: true
			},
			'clientCode': {
				get: function () {
					return sysContext.clientCode;
				}, enumerable: true
			},
			'clientName': {
				get: function () {
					return sysContext.clientName;
				}, enumerable: true
			},
			'permissionRoleId': {
				get: function () {
					return sysContext.permissionRoleId;
				}, enumerable: true
			},
			'permissionClientId': {
				get: function () {
					return sysContext.permissionClientId;
				}, enumerable: true
			},
			'permissionObjectInfo': {
				get: function () {
					return sysContext.permissionObjectInfo;
				}, enumerable: true
			},
			'isLoggedIn': {
				get: function () {
					return tokenAuthentication.isloggedIn();
				}, enumerable: true
			},
			'isSecureClientRolePresent': {
				get: function () {
					return !_.isNil(sysContext.secureClientRole);
				}, enumerable: true
			},
			'isSecureClientRoleReady': {
				get: function () {
					return secureContextRoleReady.promise;
				}, enumerable: true
			}
		});
		var permissionObjectInfoCache = {};

		// in case of logout, clean secureClientRole as well
		$rootScope.$on(tt.authentication.logoutConfirmed, function () {
			service.ClearObsoleteProperties();
			service.setForceLogoutViaLocalStorageChanges();
		});

		$rootScope.$on('$stateChangeSuccess',
			function (event, toState, toParams, fromState) {
				if (toState.name !== fromState.name) {
					permissionObjectInfoCache[fromState.name] = service.permissionObjectInfo === objectPermissionInfoFallback ? '' : service.permissionObjectInfo;
					service.applyObjectPermissionFallback(true);
					service.setPermissionObjectInfo(permissionObjectInfoCache[toState.name] || null);
				}
			});

		return service;
	}
})(angular);
