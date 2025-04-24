/**
 global declaration of tt
 */
/* global app globals */

var tt = window.tt || {};

(function () {
	'use strict';
	//
	// Thinktecture token-based authentication module for AngularJS.
	// Implements OAuth2 resource owner password flow.
	// Uses jQuery.
	// Version 0.2.4 - Feb 20, 2014.
	//
	tt.authentication = {};

	// The following events are available to be subscribed to in the application:
	tt.authentication = {
		authenticationRequired: 'tt:authentication:authNRequired',
		loginConfirmed: 'tt:authentication:loginConfirmed',
		loginFailed: 'tt:authentication:loginFailed',
		loggedIn: 'tt:authentication:loggedIn',
		logoutConfirmed: 'tt:authentication:logoutConfirmed',
		serverError: 'tt:authentication:serverError',
	};

	/**
	 * @type {module|*}
	 */
	tt.authentication.module = angular.module('Thinktecture.Authentication', ['ng']);

	/**
	 * @provider tokenAuthentication
	 *
	 */
	tt.authentication.module.provider('tokenAuthentication', {
		storage: null,
		url: null,
		identitySrvBaseUrl: null,
		baseUrl: null,

		setStorage: function (s) {
			this.storage = s;
		},

		setUrl: function (baseurl, tokenurl) {
			this.identitySrvBaseUrl = baseurl;
			this.url = tokenurl;
		},

		setBaseUrl: function (u) {
			this.baseUrl = u;
		},

		$get: ['$rootScope', '$injector', '$q', 'math', '$', '_', function get($rootScope, $injector, $q, math, $, _) {
			let $http;
			const key = this.baseUrl + 'tt:authentication:authNToken';
			const codeVerifierKey = this.baseUrl + 'tt:authentication:codechallenge';
			let store;
			let that = this;
			let installRefreshTokenRefresherTimer;
			let refreshTokenEnabled = false;
			let refreshAccessTokenTimeout = 0;
			const forceRefreshBeforeInvalidinSec = 30; // we start refresh n seconds before AccessToken gets invalid.
			const emptyHttpHeader = { // rei@3.11.2021 for token interface use empty header
				'Content-Type': 'application/x-www-form-urlencoded',
				'errorDialog': false,
				'Client-context': undefined,
				'Authorization': undefined
			};
			if (this.storage === 'private') {
				store = sessionStorage;
			} else {
				store = localStorage;
			}

			$rootScope.tt = $rootScope.tt || {};
			$rootScope.tt.authentication = $rootScope.tt.authentication || {};
			$rootScope.tt.authentication.userLoggedIn = false;

			/**
			 */
			function clearToken() {
				clearRefreshTokenRefresher();
				store.removeItem(key);
				clearAuthCodeVerifier();
				$http = $http || $injector.get('$http');
				delete $http.defaults.headers.common['Authorization'];
				delete $http.defaults.headers.common['Client-Context'];
				$rootScope.tt.authentication.userLoggedIn = false;
			}

			/**
			 * rei@16.11.20 make sure if the new authentication is required, the saved token is cleaned.
			 * This prevent looping in Login..
			 */
			function broadCastAuthenticationRequired(param1) {
				clearToken();
				$rootScope.$broadcast(tt.authentication.authenticationRequired, param1);
			}

			function getRefreshTokenEnabled() {
				return refreshTokenEnabled;
			}

			function timeNow() {
				return '[' + new Date().toLocaleTimeString() + '] ';
			}

			/**
			 * send login to backup and returning the token
			 */
			function login(username, password) {
				$http = $http || $injector.get('$http');

				const postData = $.param({
					grant_type: 'password', username: username, password: password,
					client_id: 'iTWO.Cloud', client_secret: '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}',
					scope: 'default ' + (refreshTokenEnabled ? 'offline_access' : '')
				});
				return $http.post(that.url, postData, {headers: emptyHttpHeader})
					.then(function (tokenData) {
						username = '';
						password = '';
						setToken(tokenData.data, 'iTWO.Cloud');
						authenticationSuccess();
					});
			}

			/**
			 * return login State, true if loggedin
			 * rei@7.5.2020
			 * @returns {boolean}  true if loggedin
			 */
			function isloggedIn() {
				return $rootScope.tt.authentication.userLoggedIn;
			}

			function clearRefreshTokenRefresher() {
				if (installRefreshTokenRefresherTimer) {
					// console.log(timeNow() + 'installed refreshtoken timer found, clear timer ');
					clearTimeout(installRefreshTokenRefresherTimer);
					installRefreshTokenRefresherTimer = undefined;
				}
			}

			/**
			 *
			 * @param refreshTimer
			 */
			function installRefreshTokenRefresher(refreshTimer) {

				clearRefreshTokenRefresher();

				installRefreshTokenRefresherTimer = setTimeout(function refresher() {
					// console.time('Initiate Access Token refresher now!!');
					installRefreshTokenRefresherTimer = null; // prevent double remove of timer
					let _tokenData = getTokenSync();
					if (_tokenData && _tokenData.refresh_token) {
						getTokenFromRefreshToken(_tokenData)
							.then(
								function ok(tokenData) {
									setToken(tokenData, _tokenData.clientId, 'refresher called for refreshing access token');
									installRefreshTokenRefresher(refreshAccessTokenTimeout);
								},
								function error(errordata) {
									// console.log(timeNow() + 'refresher failed. No longer refreshing Access Token');
									return $q.reject(errordata);
								});
					} else {
						_.noop();
						console.log(timeNow() + 'token refresher uninstalled (no refresh_token found)');
					}
				}, refreshTimer || refreshAccessTokenTimeout);
			}

			/**
			 * send login to backup and returning the token
			 */
			// client_id; secret; sollten aus controller angeliefert werden
			function getTokenAuthorizationCode(authorizationRequestInfo) {
				$http = $http || $injector.get('$http');
				let theRedirct_uri = window.location.origin + window.location.pathname;

				let codeVerifier = readAuthCodeVerifier() || '';
				// console.log ('getTokenAuthorizationCode: Code_Verifier ',codeVerifier);

				theRedirct_uri = theRedirct_uri + '#/callback';
				let clientId = 'itwo40.authcode';
				let postData = $.param({
					client_id: clientId,
					client_secret: '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}',
					grant_type: 'authorization_code',
					code: authorizationRequestInfo.code,
					code_verifier: codeVerifier,
					redirect_uri: theRedirct_uri
				});
				return $http.post(that.url, postData, {headers: emptyHttpHeader})
					.then(function (tokenData) {
						clearAuthCodeVerifier();
						tokenData.data.clientId = clientId; // extend by current client Id
						return tokenData.data;
					}, function error(errordata) {
						clearAuthCodeVerifier();
						if (errordata !== null && errordata.data !== null &&
							((errordata.status === 400 && errordata.data.error === 'invalid_grant') || errordata.status === 503)) {
							broadCastAuthenticationRequired();
							return $q.reject(errordata);
						}
						return errordata;
					});
			}

			/**
			 * This method retrieves a new accesstoken from the refreshtoken.
			 * @returns {*}
			 * @param tokenData
			 */
			function getTokenFromRefreshToken(tokenData) {
				let refreshToken = tokenData.refresh_token;
				if (!tokenData.clientId) {  // rei@12.11.2020 for compatibility reason for usage of expired tokens, without a clientId saved in storage
					tokenData.clientId = 'iTWO.Cloud';
				}
				let clientId = tokenData.clientId;
				$http = $http || $injector.get('$http');
				let postData = $.param({
					grant_type: 'refresh_token',
					client_id: clientId,
					client_secret: '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}',
					refresh_token: refreshToken
				});
				// ConsoleLogTokenInfo(tokenData);
				return $http.post(that.url, postData, {headers: emptyHttpHeader})
					.then(function (tokenData) {
						validateRefreshToken(tokenData.data);
						return tokenData.data;
					}, function error(errordata) {
						if (errordata !== null && errordata.data !== null && (errordata.status === 400 || errordata.status === 503)) {
							console.log(timeNow() + 'refresh_token no longer valid or expired("' + errordata.data.error + '") > clearToken >> navigate to logon dialog');
							clearToken();  // remove invalid token data
							clearRefreshTokenRefresher(); // in case of failure, we no longer force refreshing of the token
							broadCastAuthenticationRequired();
							return $q.reject(errordata);
						}
						clearToken();  // remove invalid token data
						return errordata;
					});
			}

			/**
			 * returns the available of identity server external providers
			 *
			 * @returns {*}  sample {google: true, twitter: true, msaccount: true, facebook: true}
			 */
			function idpInfo() {
				$http = $http || $injector.get('$http');
				return $http({
					method: 'GET',
					url: that.identitySrvBaseUrl + 'idpinfo',
					headers: emptyHttpHeader
				}).then(function (response) {
					refreshTokenEnabled = response.data.refreshTokenEnabled;
					return response;
				});
			}

			/*
			function ConsoleLogTokenInfo(token) {
				const ctxService = $injector.get('platformContextService');
				const cUserId = ctxService.getCurrentUserId();
				const tokenPL = getJwtInfo(token.access_token);
				console.log('TokenInfo: ', tokenPL.user_id, tokenPL.sub, tokenPL.email, ' ; Context User', cUserId);
				console.log('   Refresh ', token.refresh_token);
			}
			*/

			/**
			 *
			 * @param tokenRefreshResult
			 */
			function validateRefreshToken(tokenRefreshResult) {
				const ctxService = $injector.get('platformContextService');
				const tokenPayload = getJwtInfo(tokenRefreshResult.access_token);
				ctxService.validateRefreshTokenWithContext(tokenPayload);
			}

			/**
			 * returns the available of identity server external providers
			 *
			 * @returns {*}  sample {google: true, twitter: true, msaccount: true, facebook: true}
			 */
			function RevocationRefreshToken(tokenData) {
				if (!tokenData) {  // there is no token to release/revoke
					return $q.resolve(null);
				}

				let refreshToken = tokenData.refresh_token;
				if (!refreshToken) { // nothing todo
					return $q.resolve(null);
				}
				if (!tokenData.clientId) {  // rei@12.11.2020 for compatibility reason for usage of expired tokens, without a clientId saved in storage
					tokenData.clientId = 'iTWO.Cloud';
				}

				$http = $http || $injector.get('$http');
				let postData = $.param({
					token: refreshToken,
					token_type_hint: 'refresh_token',
					client_id: tokenData.clientId,
					client_secret: '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}'
				});
				let revocationUrl = that.identitySrvBaseUrl + 'connect/revocation';
				return $http.post(revocationUrl, postData, {headers: emptyHttpHeader})
					.then(function (result) {
						return result;
					}, function error(errordata) {
						return errordata;
					});
			}

			function logout() {
				{
					let authToken = JSON.parse(store.getItem(key));
					let tokenHint = (authToken && authToken.id_token) ? authToken.id_token : '';
					return RevocationRefreshToken(authToken).then(function () {
						// console.log('Revocation result: ', result);
						clearToken();
						$rootScope.$broadcast(tt.authentication.logoutConfirmed);
						that._promise = $q.defer();
						app.initialStartup = true;
						if (tokenHint) {
							let redirectUri = encodeURIComponent(globals.clientUrl);
							window.location = that.identitySrvBaseUrl + 'connect/endsession?id_token_hint=' + tokenHint + '&post_logout_redirect_uri=' + redirectUri;
							return that._promise.promise;
						}
						return $q.resolve(null);
					});
				}
			}

			/**
			 *
			 */
			function authenticationSuccess() {
				$rootScope.tt.authentication.userLoggedIn = true;
				$rootScope.$broadcast(tt.authentication.loggedIn);
				$rootScope.$broadcast(tt.authentication.loginConfirmed);
			}

			/*
			 */
			function initialCheckForToken() {
				let deferred = $q.defer();
				let token = JSON.parse(store.getItem(key));
				if (token) {
					deferred.resolve('iTWO4.0 token available');
				} else {
					deferred.reject('Invalid token or token not available.');
				}
				return deferred.promise;
			}

			/**
			 *
			 * @param tokenData
			 * @returns {boolean}
			 */
			function reUseValidToken(tokenData) {
				setToken(tokenData, tokenData.clientId);
				$rootScope.tt.authentication.userLoggedIn = true;
				$rootScope.$broadcast(tt.authentication.loggedIn);
				return true;
			}

			/*
			 fires tt.authentication.loggedIn if token is valid and ok
			 fires tt.authentication.authenticationRequired if token invalid or not there
			 */
			function checkForValidToken() {

				return getToken().then(function (tokenData) {
					if (tokenData && (tokenData.status === 400 || tokenData.status === -1 || !tokenData.access_token)) { // in case of invalid token was refreshed, with status code 400 , invalid, we clean token and start again
						clearToken();
						tokenData = undefined;
					}
					$rootScope.tt.authentication.userLoggedIn = false;

					if (!tokenData) {
						broadCastAuthenticationRequired();

						return false;

					} else {
						let isPortalToken = isPortalFromToken(tokenData);
						if (globals.portal !== isPortalToken) {
							broadCastAuthenticationRequired();
							return false;
						}
						if (globals.portal && !isPortalToken) {
							broadCastAuthenticationRequired();
							return false;
						}
						if (!tokenData.refresh_token) {
							if (new Date().getTime() > tokenData.expiration) {
								broadCastAuthenticationRequired();
								return false;

							} else {
								return reUseValidToken(tokenData);
							}
						} else {
							if (new Date().getTime() > tokenData.expiration) {
								console.log(timeNow() + 'refresh_token found - while access_token has expired. Try to claim an access_token with refresh_token!');
								let theClientId = tokenData.clientId; // save it for later reuse rei@7.06.2021
								return getTokenFromRefreshToken(tokenData).then(function (tokenData) {
									tokenData.clientId = theClientId; // copy original clientId rei@7.06.2021
									let _refreshTimeout = calculateCurrentRefreshTimeout(tokenData, 'token refresher installed');
									installRefreshTokenRefresher(_refreshTimeout);
									return reUseValidToken(tokenData);
								});
							} else {
								if (!installRefreshTokenRefresherTimer) {
									let _refreshTimeout = calculateCurrentRefreshTimeout(tokenData, 'token refresher installed');
									installRefreshTokenRefresher(_refreshTimeout);
								}
								return reUseValidToken(tokenData);
							}
						}
					}
				});
			}

			/**
			 * returns true if the token is a portal token.
			 * @param tokenData
			 */
			function isPortalFromToken(tokenData) {
				if (tokenData && tokenData.access_token) {
					return _.isEqual(globals.parseJwt(tokenData.access_token).portalrequest, 'True');
				}
				return false;
			}

			/**
			 * @param token
			 * @param msgInfo
			 * @returns {number}
			 * @constructor
			 */
			function calculateCurrentRefreshTimeout(token, msgInfo) {
				let jwtParsed = getJwtInfo(token.access_token);
				let currentDateTime_ms = new Date().getTime();
				let expiredDateTime_ms = new Date(jwtParsed.exp * 1000).getTime(); // exp are in sec since EPOCH
				let refreshDateTime_ms = expiredDateTime_ms - forceRefreshBeforeInvalidinSec * 1000;
				let refreshTimeout_ms = refreshDateTime_ms - currentDateTime_ms;
				refreshAccessTokenTimeout = refreshTimeout_ms;
				token.expiration = refreshDateTime_ms;
				token.expirationDate = new Date(refreshDateTime_ms).toLocaleString();
				token.refreshTokenTimeout_msec = refreshTimeout_ms;
				if (msgInfo) {
					console.log(timeNow() + msgInfo + ' (ClientId=' + token.clientId + ') timeout=' + refreshTimeout_ms + 'ms' + ' @' + token.expirationDate);
				}
				return refreshTimeout_ms;
			}

			/**
			 * the method takes the tokenData and save it into the browser localStorage
			 * and set the authorization header for the $http requests
			 *      enhance it by: expiration datetime, clientId
			 *
			 * @param tokenData     the token returned from idp token endpoint
			 * @param clientId      the clientId used while getting token from token endpoint
			 * @param msgInfo
			 */
			function setToken(tokenData, clientId, msgInfo) {
				if (clientId) { // rei@5.11.2020 extend and save clientId with token, required for refreshtoken
					tokenData.clientId = clientId;
				}
				if (!tokenData.expiration) {
					calculateCurrentRefreshTimeout(tokenData, msgInfo);
				}
				let sessionTokenValue = 'Bearer ' + tokenData.access_token;
				$http = $http || $injector.get('$http');
				$http.defaults.headers.common['Authorization'] = sessionTokenValue;
				// save it into localstorage
				store.setItem(key, JSON.stringify(tokenData));
			}

			function readAuthCodeVerifier() {
				return store.getItem(codeVerifierKey);
			}

			function clearAuthCodeVerifier() {
				store.removeItem(codeVerifierKey);
			}

			/**
			 * create a challenge code from random and hash is with sha256 algo.
			 * saves the code into storage, for validation afterwards.
			 * @returns {*}
			 */
			function createAuthCodeChallenge() {
				/* create a random code verifier of length 43 */
				function uuidv4() {
					return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
						let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
						return v.toString(16);
					});
				}

				let codeVerifier = uuidv4();
				let hash = CryptoJS.SHA256(codeVerifier);          // eslint-disable-line no-undef
				let base64 = hash.toString(CryptoJS.enc.Base64);   // eslint-disable-line no-undef
				let urlencoded = encodeURI(base64);
				let codeChallenge = urlencoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
				store.setItem(codeVerifierKey, codeVerifier);
				// console.log ('Create CodeChallenge: ',codeChallenge, ' Code_Verifier ',codeVerifier);
				return codeChallenge;
			}

			/**
			 * @function getToken
			 * @returns {promise.promise}
			 * @description
			 * return a promise to the token from localstorage
			 */
			function getToken() {
				let deferred = $q.defer();

				let token = JSON.parse(store.getItem(key));
				if (token) {
					deferred.resolve(token);
				} else {
					deferred.reject();
				}
				return deferred.promise;
			}

			/**
			 * @function getToken
			 *
			 * @returns {promise.promise}
			 *
			 * @description
			 * return a promise to the token from localstorage
			 */
			function getTokenSync() {
				return JSON.parse(store.getItem(key));
			}

			function checkForValidTokenSync() {
				const _tokenData = getTokenSync();
				if (_tokenData && _tokenData.refresh_token) {
					return true;
				}
			}

			/**
			 *
			 * @param accesstoken
			 */
			function getJwtInfo(accesstoken) {

				return globals.parseJwt(accesstoken);

			}

			// factory supplies following methods
			return {
				idpInfo: idpInfo,  // return info about the available identity providers from identityserver
				login: login,
				isloggedIn: isloggedIn,
				logout: logout,
				clearToken: clearToken,
				setToken: setToken,
				getJwtInfo: getJwtInfo,
				isPortalFromToken: isPortalFromToken,
				refreshTokenEnabled: getRefreshTokenEnabled,
				checkForValidToken: checkForValidToken,
				checkForValidTokenSync: checkForValidTokenSync,
				initialCheckForToken: initialCheckForToken,
				getTokenAuthorizationCode: getTokenAuthorizationCode,
				readAuthCodeVerifier: readAuthCodeVerifier,
				createAuthCodeChallenge: createAuthCodeChallenge,
				broadCastAuthenticationRequired: broadCastAuthenticationRequired
			};
		}]
	});

	// jshint -W098
	/**
	 *
	 */
	tt.authentication.module.factory('tokenAuthenticationHttpInterceptor', ['$q', '$rootScope', 'tokenAuthentication', function ($q, $rootScope, tokenAuthentication) {

		/**
		 *
		 * @param deferred
		 * @returns {promise.promise}
		 */
		function checkAuthenticationFailureStatus(deferred) {
			$rootScope.tt.authentication.userLoggedIn = false;

			tokenAuthentication.checkForValidToken();
			return deferred.promise;
		}

		/**
		 *
		 * @param rejection
		 * @returns {Promise}
		 */
		function responseError(rejection) {
			if (rejection.status === 401) {
				// rei 14.2.2019 added rejection reason message into the emitted message
				tokenAuthentication.broadCastAuthenticationRequired(rejection.data);
			}
			// rei 19.2.19 added to handle exceptions i.e. in login, while starting application
			if (rejection.status === 500 || rejection.status === 503) {
				// rei 19.2.2019 added rejection reason message into the emitted message
				$rootScope.$broadcast(tt.authentication.serverError, rejection.data);
			}
			return $q.reject(rejection);
		}

		return {
			'responseError': responseError,
			'checkAuthenticationFailureStatus': checkAuthenticationFailureStatus
		};
	}]);

	/**
	 * register $http interceptor
	 */
	tt.authentication.module.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('tokenAuthenticationHttpInterceptor');
	}]);

})();
