/*
 * $Id: platform-portal-service.js
 * Copyright (c) RIB Software GmbH
 */
/* globals Platform */
/* globals globals */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name platform:platformPortalService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformPortalService provides support for handling portal register services
	 */
	angular.module('platform').factory('platformPortalService', platformPortalService);
	platformPortalService.$inject = ['_', 'moment', '$q', '$http', '$translate', 'platformContextService', 'platformUserInfoService'];

	function platformPortalService(_, moment, $q, $http, $translate, platformContextService, platformUserInfoService) { // jshint ignore:line

		var userMgmtMainBaseUrl = globals.webApiBaseUrl + 'usermanagement/main/portal/';
		var portalTexts = {};

		function getPortalExternalProviderInfoFromToken(theToken) {// jshint ignore:line

			return $http.post(
				userMgmtMainBaseUrl + 'getexternalproviderinfofromtoken',
				'"' + theToken + '"'
			).then(function success(response) {
					return response.data;
				},
				function failed(response) {
					return response.data;
				}
			);
		}

		/**
		 * method createPortalContextFromToken
		 *
		 *  1.  first we have to get the userId
		 *  2.  read eventually safed companyrole info from local storage
		 *  3.  create secureContext
		 *
		 * @param createPortalContextFromToken
		 * @returns {Promise|*}
		 */
		function createPortalContextFromToken() {

			return platformUserInfoService.getUserInfoPromise(true)
				.then(function () {

					platformContextService.readContextFromLocalStorage();

					// call backend only if we have a valid Context
					if (!platformContextService.companyRoleConfigisValid()) {
						return $q.when(false);
					}
					return $http.get(userMgmtMainBaseUrl + 'createPortalContextFromToken')
						.then(function success(response) {
								if (response.data.secCtx) {
									var ctx = response.data.ctx;
									platformContextService.setCompanyConfiguration(ctx.signedInClientId, ctx.signedInClientId, ctx.permissionClientId, ctx.permissionRoleId, response.data.secCtx);
								}
								return true;
							},
							function failed(response) {
								platformContextService.secureClientRole = null;
								return response;
							}
						);
				});
		}

		/**
		 *
		 * @param portalUserInfo
		 * @returns {Promise|*}
		 */
		function portalRegisterComplete(portalUserRegisterInfo) {

			var request = {
				registerToken: portalUserRegisterInfo.registerToken,
				extProviderInfo: portalUserRegisterInfo.extProviderInfo,
				portalBaseUrl: portalUserRegisterInfo.portalBaseUrl // rei@4.7.18, supply portal url for usage in workflow event context
			};

			return $http.post(
				userMgmtMainBaseUrl + 'registercomplete',
				request
			).then(function success(response) {
					return response.data;
				},
				function failed(response) {
					return response.data;
				}
			);
		}

		/**
		 *
		 * @param portalUserInfo
		 * @returns {Promise|*}
		 */
		function portalInvitationComplete(portalUserRegisterInfo) {

			var request = {
				registerToken: portalUserRegisterInfo.registerToken,
				extProviderInfo: portalUserRegisterInfo.extProviderInfo
			};

			return $http.post(
				userMgmtMainBaseUrl + 'invitationcomplete',
				request
			).then(function success(response) {
					return response.data;
				},
				function failed(response) {
					return response.data;
				}
			);
		}

		/**
		 * Get portal text by portal text code like portalRegisteredSuccessful, portalRegistrationFailed
		 * @param key - portal text code
		 * @param language
		 * @returns {Promise}
		 */
		function getPortalTextByKey(key, language) {
			var defer = $q.defer();
			var text = '';

			if (!key) {
				defer.resolve(text);
				return defer.promise;
			}
			language = language || platformContextService.getLanguage();

			if (!portalTexts[language]) { // get from server
				$http.get(globals.webApiBaseUrl + 'basics/textmodules/text/getportaltexts?language=' + language)
					.then(function (response) {
						if (!response || !response.data) {
							portalTexts[language] = {};
						} else {
							portalTexts[language] = response.data[language] || {};
							if (portalTexts[language][key]) {
								text = portalTexts[language][key];
							}
						}
						defer.resolve(text);
					}, function () {
						portalTexts[language] = {};
						defer.resolve(text);
					});
			} else { // get from cache
				if (portalTexts[language][key]) {
					text = portalTexts[language][key];
				}
				defer.resolve(text);
			}

			return defer.promise;
		}

		// all method support by this service listed here
		return {
			getPortalExternalProviderInfoFromToken: getPortalExternalProviderInfoFromToken,
			portalRegisterComplete: portalRegisterComplete,
			portalInvitationComplete: portalInvitationComplete,
			createPortalContextFromToken: createPortalContextFromToken,
			getPortalTextByKey: getPortalTextByKey
		};

	}
})(angular);
