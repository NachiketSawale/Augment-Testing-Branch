/* global app,globals */
/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformUserInfoService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformPermissionService provides support for loading and checking access right
	 */
	angular.module('platform').factory('platformLogonService', platformLogonService);

	platformLogonService.$inject = ['$http', '$q', '_', 'tokenAuthentication', 'platformTranslateService', 'platformContextService', 'cloudDesktopCompanyService', '$translate', '$rootScope'];

	function platformLogonService($http, $q, _, tokenAuthentication, xlateSvc, platformContextService, cloudDesktopCompanyService, $translate, $rootScope) { // jshint ignore:line
		var service = {};
		var loginCss; // Custom CSS for the login dialog
		var i18nCustomReaddone; // none undefined if already read

		var processMessage = {
			main: '',
			sub: ''
		};

		/**
		 * @param {string}[mainMsg]
		 * @param {string}[subMsg]
		 */
		service.setProcessMessage = function (mainMsg, subMsg) {
			processMessage.main = mainMsg;
			processMessage.sub = subMsg;
		};

		service.getProcessMainMsg = function () {
			return processMessage.main;
		};

		service.getProcessSubMsg = function () {
			return processMessage.sub;
		};

		/**
		 * This function supplies all available ui languages as array
		 * The languages are taken from the globals variable globals.uilanguages, which itself will
		 * be assembled on backend side with all available uilanguages
		 *
		 * aljami@21.01.2022 globals.uilanguagessimple is used instead of globals.uilanguages
		 *
		 * @returns {Object} array of [{language: {string} , languageName: {string} , languageName$tr$: {string} , culture: {string} }]
		 */
		service.getUiLanguages = function getUiLanguages() {

			let languagesList = globals.uilanguagessimple;
			let uiLanguages;
			if (languagesList) {
				uiLanguages = languagesList.map(e => {
					return {language: e.Language, languageName$tr$: 'platform.uiLanguage.' + e.Culture.toLowerCase(), culture: e.Culture.toLowerCase()};
				});
			}

			/* fallback if no languages are found in globals.uilanguages */
			if (!uiLanguages || (uiLanguages && uiLanguages.length === 0)) {
				uiLanguages = [
					{language: 'de', languageName: 'German', languageName$tr$: 'platform.uiLanguage.de-de', culture: 'de-de'},
					{language: 'en', languageName: 'English', languageName$tr$: 'platform.uiLanguage.en-gb', culture: 'en-gb'}
				];
			}

			let uiLanguagesXlated = xlateSvc.translateObject(uiLanguages, ['languageName']);

			// @2022.01.20 - aljami - add culture at the end of description
			_.forEach(uiLanguagesXlated, e => {
				e.languageName = e.languageName + ' (' + e.language + ')';
			});

			return uiLanguagesXlated;
		};

		/**
		 * This function return all available ui languages in the native language format.
		 * The languages are taken from the globals variable globals.uilanguages, which itself will
		 * be assembled on backend side with all available uilanguages
		 * @returns {Object} array of [{language: {string} , languageName: {string} , culture: {string} }]
		 * rei@29.10.18
		 * aljami@21.01.2022 function returns languages in English, not in native. globals.uilanguagessimple is used instead of globals.uilanguages
		 */
		service.getUiLanguagesNative = function getUiLanguagesNative() {
			var nativeLangs = [];

			_.forEach(globals.uilanguagessimple, (language) => {
				nativeLangs.push({
					language: language.Language,
					languageName: language.Description + ' (' + language.Language + ')',
					culture: language.Culture
				});
			});

			return nativeLangs;
		};

		/**
		 * this function is used for checking a valid token and company id.
		 *
		 * @param {boolean } [withNavigate]   if true and company is invalid:  it'll navigate to company
		 * @param {string}   [company]        if supplied the check will by done with this company name, not with saved in appication context
		 * @param [roleId] {int}              1 for 'admin'
		 *
		 * @returns {*} a promise
		 */
		service.checkCompany = function checkCompany(withNavigate, company, roleId) {
			const mainMsg = 'Start application please wait';
			let deferred = $q.defer();


			function isNotThere(p1, def='n/a') {
				return p1?p1:def;
			}
			service.setProcessMessage(mainMsg, 'check login token for validation');
			tokenAuthentication.checkForValidToken().then(function (tokenValid) {
				if (tokenValid) {
					// continued user company/role checking only if base url or direct application was called
					service.setProcessMessage(mainMsg, 'token valid >> check saved company information for validation, please wait...');
					cloudDesktopCompanyService.checkLoadAssigedCompaniesToUser(company, roleId).then(function (companyValid) {
						if (!companyValid) {
							if (withNavigate) {
								app.navigateToCompany();// jshint ignore:line
							}
							deferred.reject({error: 1, message: $translate.instant('cloud.desktop.api.companychkerror1', {p1: isNotThere(company), p2: isNotThere(roleId)})});
						}
						service.setProcessMessage(mainMsg, 'company is valid now starting desktop or module');
						deferred.resolve();
					}, function error(reason) {
						deferred.reject({error: 2, message: $translate.instant('cloud.desktop.api.companychkerror2', {p1: isNotThere(company), p2: isNotThere(roleId), p3: isNotThere(reason)})});
					}
					);
				}
			}, function error(reason) {
				deferred.reject({error: 3, message: 'Token is invalid. Reason is => ' + reason});
			}
			);
			return deferred.promise;
		};

		/**
		 * changeLogonPassword
		 *  selfexplaining
		 * @param logonName
		 * @param oldPassword
		 * @param newPassword
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		service.changeLogonPassword = function changeLogonPassword(logonName, oldPassword, newPassword) {

			var passwordUrl = globals.webApiBaseUrl +
				'usermanagement/main/user/changeuserpassword';

			var postData = {
				logonName: logonName,
				oldPassword: btoa('base64.' + oldPassword),
				newPassword: btoa('base64.' + newPassword)
			};

			return $http.post(passwordUrl, postData).then(function ok(response) {
				return response.data;
			}, function failed(response) {
				return response.data;
			});
		};

		/**
		 *
		 * @param invitationToken
		 * @returns {*}
		 */
		service.resolveInvitationUrl = function resolveInvitationUrl(invitationToken) {

			var resolveInvitationUrl = globals.webApiBaseUrl + 'usermanagement/main/portal/resolveinvitationtoken?invitationtoken=' + invitationToken;
			return $http.get(resolveInvitationUrl).then(function ok(response) {
				return response.data;
			}, function failed(response) {
				return $q.reject(response.data);
			});
		};

		function getText(token) {

			return $translate.instant(token);

		}

		service.minimumPasswordLength = 8;
		service.validationRegex = '';

		// Loads password rule
		service.loadPasswordRules = function () {
			var passwordRulesUrl = globals.webApiBaseUrl + 'usermanagement/main/user/passwordrules';
			return $http.get(passwordRulesUrl).then(function ok(response) {
				service.minimumPasswordLength = response.data.minLength; // minimum length for the password
				service.validationRegex = response.data.pattern; // validation regex pattern
				service.passwordHint = response.data.hint; // password hint
				return response.data;
			}, function failed(response) {
				return $q.reject(response.data);
			});
		};

		/**
		 * Check password input values
		 * @param username
		 * @param oldp
		 * @param newp
		 * @param confirmp
		 * @returns {string} null if password matches requirement, else errmsg
		 */
		service.passwordValidation = function passwordValidation(username, oldp, newp, confirmp) {

			var errorMsg = null;

			// function contains(regPattern, checkValue) {
			//    return regPattern.test(checkValue);
			// }

			if (!_.isString(oldp) || !_.isString(newp) || !_.isString(confirmp)) {
				errorMsg = getText('platform.invalidPassword'); // 'Invalid old or new or confirm password';
			} else if (_.isEqual(oldp, newp)) {
				errorMsg = getText('platform.invalidDiffPassword');
			} else if (!_.isEqual(newp, confirmp)) {
				errorMsg = getText('platform.invalidEqPassword'); // 'New Password must be equal to confirm password';
			} else if (newp.length < service.minimumPasswordLength) {
				errorMsg = service.passwordHint; // 'New Password length must be at least service.minimumPasswordLength!';
			} else if (_.isEqual(username, newp)) {
				errorMsg = getText('platform.invalidUsernamePassword'); // 'New Password must be different from Username';
			} else if (service.validationRegex !== '') {
				var matches = newp.match(service.validationRegex);
				if (matches === null) { // validation failed with password rules, set error msg to password hint
					errorMsg = service.passwordHint;
				}
			}
			/* else if (!contains(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/, newp)) {
				errorMsg = getText('platform.invalidSpecialCharPassword'); //'New Password must contain at least one number (0-9)! or one special character';
			}
			else if (!contains(/[a-z]/, newp)) {
				errorMsg = getText('platform.invalidLowerCasePassword'); //'New Password must contain at least one lowercase letter (a-z)!';
			}
			else if (!contains(/[A-Z]/, newp)) {
				errorMsg = getText('platform.invalidUpperCasePassword'); //'New Password must contain at least one uppercase letter (A-Z)!';
			} */
			return errorMsg;
		};

		/**
		 * this method read the custom logon url if available...
		 * rei@19.2.18, support myhome logoff/logon url
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		service.readLegalInfo = function readLegalInfo() {

			// rei@10.9.19 support portal legal info
			var theUrl = globals.webApiBaseUrl + 'basics/common/systemoption/legalinfo?portal=' + globals.portal;
			return $http.get(theUrl).then(function ok(response) {
				if (response && response.data) {

					globals.showImpressumLink = response.data.ShowImpressum || false;
					globals.showDataprotectionLink = response.data.ShowGdpr || false;
					$rootScope.$emit('LegalInfo-read-done');
				}
				return true;
			}, function failed(/* response */) {
				return false;
			});
		};

		service.readCustomLogonCss = function readCustomLogonCss(isPortal) {
			if (!_.isUndefined(loginCss)) {
				return $q.when(loginCss);
			}

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/getlogincss',
				params: {isPortal: !!isPortal}
			}).then(function ok(response) {
				if (response && response.data) {
					loginCss = response.data;
				}
			}, function error(response) {
				console.log('readCustomLogonCss failed: ', response);
				return '';
			});
		};

		service.getCustomLogonCss = function getCustomLogonCss() {
			return loginCss;
		};

		/**
		 * this method read the custom logon url if available...
		 * rei@19.2.18, support myhome logoff/logon url
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		service.readCustomLogon = function readCustomLogon() {

			var theUrl = globals.webApiBaseUrl + 'platform/customlogon';
			return $http.get(theUrl).then(function ok(response) {
				if (response && response.data) {
					_.assignIn(globals, response.data);
				}
				return true;
			}, function failed(/* response */) {
				return false;
			});

		};

		/**
		 * rei@09.07.2020 added for support customizable overloading of json translateable text.
		 * @returns {Promise|PromiseLike<boolean>|Promise<boolean>}
		 */
		service.readi18nCustomText = function readi18nCustomText() {
			if (i18nCustomReaddone !== undefined) {
				return $q.when(true);
			} else {
				var url = globals.webApiBaseUrl + 'basics/common/systemoption/usei18ncustomertext';
				return $http.get(url).then(function ok(response) {
					if (response && response.data) {
						globals.i18nCustom = response.data.I18nCustom || false;
						$rootScope.$emit('i18nCustom-read-done');
					}
					return true;
				}, function failed(/* response */) {
					return false;
				});
			}
		};

		/**
		 * this method read all Ui and Data languages ...
		 * rei@12.3.18,
		 returns from net {
			 /// <summary></summary>
			 [JsonProperty("datalanguages")]
				 public IEnumerable<LanguageDto> DataLanguages { get; set; }
			 /// <summary></summary>
			 [JsonProperty("uilanguages")]
				 public SortedDictionary<string, IList<LanguageLogic.UiLanguagesInfo>> UiLanguages { get; set; }
		 }     *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 *
		 * after sucessful read it will stored the language entires in globals
		 *     globals.uilanguages
		 *    globals.datalanguages
		 *
		 *    aljami@21.01.2022,
		 return from net {
		   /// <summary></summary>
			[JsonProperty("datalanguages")]
			public IEnumerable<LanguageDto> DataLanguages { get; set; }
			/// <summary></summary>
			[JsonProperty("uilanguagessimple")]
			public IEnumerable<LanguageLogic.UiLanguagesRes> UiLanguagesSimple { get; set; }
		 }
		 * after sucessful read it will stored the language entires in globals
		 *     globals.uilanguagessimple
		 *    globals.datalanguages
		 */
		service.readUiDataLanguages = function readUiDataLanguages() {

			// check if already loaded, if loaded just return true
			if ((globals.uilanguagessimple && globals.uilanguagessimple.length !== 0) && globals.datalanguage) {
				return $q.when(true);
			}
			var theUrl = globals.webApiBaseUrl + 'cloud/common/getuidatalanguages';
			return $http.get(theUrl).then(function ok(response) {
				if (response && response.data) {
					_.assignIn(globals, response.data);
					$rootScope.$emit('platform-getuidatalanguages-read');

					return true;
				}
			}, function failed(response) {
				return response;
			});
		};

		/**
		 * readUiLanguagesOnly >>> self explaining
		 *
		 * after successfully read it will stored the ui language in globals
		 *     globals.uilanguages
			aljami@21.01.2022
		 * after sucessfully read it will stored the ui language in globals
		 *     globals.uilanguagessimple
		 *
		 * @returns {*}
		 */
		service.readUiLanguagesOnly = function readUiLanguagesOnly() {
			// check if already loaded, if loaded just return true
			if (globals.uilanguagessimple && globals.uilanguagessimple.length !== 0) {
				return $q.when(true);
			}
			var theUrl = globals.webApiBaseUrl + 'cloud/common/getuilanguages'; // anonymous call
			return $http.get(theUrl).then(function ok(response) {
				if (response && response.data) {
					_.assignIn(globals, response.data);
					return true;
				}
			}, function failed(response) {
				return response;
			});
		};

		/*
		Support UiData Language changed indicator, rei@28.1.22
		 */
		let _UiDataLanguagesChanged;
		service.UiDataLanguagesChanged = function (inputParam) {
			if (!_.isUndefined(inputParam)) {
				_UiDataLanguagesChanged = inputParam;
			}
			return _UiDataLanguagesChanged;
		};

		/**
		 * this method saves User defined Ui and Data language
		 * rei@12.3.18,
		 *
		 * if dataLanguageId is undefined or null we use the platformContextService.getDataLanguageId() as value
		 * if uiLanguageId is undefined or null we use the platformContextService.getLanguage() as value
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		service.saveUiDataLanguages = function saveUiDataLanguages(dataLanguageId, uiLanguageId, uiCulture) {

			const params = {
				dataLanguageId: dataLanguageId || platformContextService.getDataLanguageId(),
				uiLanguageId: uiLanguageId || platformContextService.getLanguage(),
				uiCulture: uiCulture || platformContextService.getCulture()
			};

			var theUrl = globals.webApiBaseUrl + 'services/platform/saveuserlanguages';
			service.UiDataLanguagesChanged(true);  // indicate there is a cahnge in the language settings
			return $http.post(theUrl, params).then(function ok(response) {
				if (response && response.data) {
					// _.assignIn(globals, response.data);
					service.UiDataLanguagesChanged(true);  // indicate there is a change in the ui/data language settings
					return response.data;
				}
			}, function failed(response) {
				return response;
			});
		};
		return service;
	}
})();
