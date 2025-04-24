/*
 * $Id: platform-portal-service.js
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name platform:platformSsoService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformSsoService provides support for single sign on services
	 */
	angular.module('platform').factory('platformSsoService', platformSsoService);
	platformSsoService.$inject = ['_', 'moment', '$q', '$http', '$translate', 'platformContextService', 'cloudDesktopCompanyService', 'tokenAuthentication', 'platformUserInfoService'];

	function platformSsoService(_, moment, $q, $http, $translate, platformContextService, cloudDesktopCompanyService, tokenAuthentication, platformUserInfoService) { // jshint ignore:line

		var basicsSsoBaseUrl = globals.webApiBaseUrl + 'basics/sso/1.0/';

		/**
		 *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 *
		 public class SsoInfo
		 {
			 public string Username { get; set; }
			 public string Password { get; set; }
			 public string ShortTermToken { get; set; }
			 public string Ticket { get; set; }
			 public string CompanyCode { get; set; }
		 }
		 */
		function singleSignOnMyHome(ssoInfo) {// jshint ignore:line

			// $http.defaults.headers.common['Client-Context'] = angular.toJson(clientCtx);
			var config = {headers: {}};
			if (ssoInfo.shortTermToken) {
				config.headers['st-ssotoken'] = ssoInfo.shortTermToken;
			}

			if (ssoInfo.type) {
				if (ssoInfo.ticket) {  // mike/rei@9.11.18 change for universal usage
					config.headers[ssoInfo.type + '-id'] = ssoInfo.ticket;
				}
			}

			if (ssoInfo.ivuser) {
				config.headers['iv-user'] = ssoInfo.ivuser;
			}

			return $http.post(
				basicsSsoBaseUrl + 'signon',
				null,
				config
			).then(function success(response) {
					var token = response.data;
					// set valid token...
					if (token && _.isString(token.access_token)) {  // jshint ignore:line
						tokenAuthentication.setToken(token);

						return platformUserInfoService.getUserInfoPromise(true)
							.then(function () {
								platformContextService.readContextFromLocalStorage();
								var params;
								if (!ssoInfo.companyCode) {
									params = {
										params: {
											requestedSignedInCompanyId: platformContextService.signedInClientId,
											requestedCompanyId: platformContextService.clientId,
											requestedPermissionClientId: platformContextService.permissionClientId, // this clientId is holding the permission role
											requestedRoleId: platformContextService.permissionRoleId
										}
									};
								} else {
									params = {
										params: {
											requestedSignedInCompanyCode: ssoInfo.companyCode,
											requestedRoleId: ssoInfo.role
										}
									};
								}
								if (params) {
									return cloudDesktopCompanyService.checkCompany(params)
										.then(function success(response) {
												app.navigateToDesktopPage();// jshint ignore:line
												return response.data;
											},
											$q.reject(false));
								} else {
									app.navigateToCompany();// jshint ignore:line
								}
							});
					} else {
						return response.data;
						// $q.reject(response.data);
					}
				},
				function failed(response) {
					return response.data;
				}
			);
		}

		// all method support by this service listed here
		return {
			singleSignOnMyHome: singleSignOnMyHome
		};
	}
})();
