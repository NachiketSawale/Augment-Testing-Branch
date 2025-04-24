/**
 * Created by rei on 16.01.2015.
 */
/* globals app */

(function (tt) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name platformLoginDialogController
	 * @function
	 *
	 * @description
	 * Controller for the standard Login dialog.
	 */
	angular.module('platform').controller('platformLogonDialogController',
		['$location', '$rootScope', '$log', '$scope', '$stateParams', 'tokenAuthentication', 'globals', '_', 'platformContextService', 'platformTranslateService', '$timeout', 'platformLogonService', 'platformDialogService',
			'platformStartupRouteService',
			function platformLogonDialogController($location, $rootScope, $log, $scope, $stateParams, tokenAuthentication, globals, _, platformContextService, platformTranslateService, $timeout, logonService, platformDialogService,
				platformStartupRouteService) { // jshint ignore:line
				var refreshTokenEnabled = false;

				var defaultIdentityprovider = {google: false, twitter: false, msaccount: false, facebook: false};
				$scope.path = globals.appBaseUrl;
				if (globals.isEmbedded) {
					$scope.embedded = true;
				}
				$scope.identityprovider = defaultIdentityprovider;

				$scope.loginOptions = {
					autoComplete: 'off',
					isAutoCompleteOff: function () {
						return $scope.loginOptions.autoComplete === 'off';
					},
					loading: true,
					loadingInfo: ''
				};

				if ($stateParams && $stateParams.ipderror) {
					$scope.loginOptions.loading = true;
					$scope.feedback = {
						show: false,
						message: platformTranslateService.translate('platform.loginFailedMessage')
							.then(function (data) {
								$scope.feedback.message = data + '<br>' + $stateParams.ipderror;
								$scope.feedback.show = true;
								$scope.loginOptions.loading = false;
								return $scope.feedback.message;
							}),
						alertClass: 'alert-danger hide-after-10sec'
					};
					$scope.loginOptions.loading = false;
					startGraceTimeCountdownForFailedAttempt();
				}

				// read identity server external provider, depending on that we have the social media logins available or not
				tokenAuthentication.idpInfo().then(function (idpinfo) {
					$scope.loginOptions.loading = false;
					$scope.identityprovider = _.assign($scope.identityprovider, idpinfo.data);
					refreshTokenEnabled = tokenAuthentication.refreshTokenEnabled();
				});

				// set social media provider info
				//	$scope.identityprovider = _.assign(globals.identityprovider||{}, defaultIdentityprovider);
				$scope.identityprovider.idpLogin = function () {
					return ($scope.identityprovider && $scope.identityprovider.standard && ($scope.identityprovider.standard.azuread || $scope.identityprovider.standard.wsfed));
				};

				// set social media provider info
				//	$scope.identityprovider = _.assign(globals.identityprovider||{}, defaultIdentityprovider);
				$scope.identityprovider.stdLogin = function () {
					return ($scope.identityprovider && $scope.identityprovider.explicitlogon === false) ? false : true;
				};

				$scope.version = app.productBuildVersion;
				$scope.productName = app.productName;
				$scope.productLogoPrimary = app.productLogoPrimary;

				$scope.loginData = {
					username: null,
					password: null
				};

				// object holding translated strings
				$scope.text = {};

				// loads or updates translated strings
				var loadTranslations = function () {
					// $log.debug('loadTranslations called', logonService.getUiLanguages());
					// load translation of tile-group definition
					$scope.text = platformTranslateService.instant({
						platform: ['loginLanguage', 'loginPassword', 'loginUsername', 'loginButton', 'loginEnterPassword', 'loginEnterUsername',
							'loginBusyMessage', 'loginFailedMessage', 'loginSuccessfulMessage', 'loginWith',
							'loginViaGoogle', 'loginViaTwitter', 'loginViaMicrosoftAccount', 'loginViaFacebook',
							'loginViaAdfs', 'loginViaAad', 'logoffromAad', 'logoffromAdfs', 'loginWaitHint']
					});
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('app')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				/**
				 * @returns {boolean}
				 */
				function isUserPasswordValid() {
					return true;
					// return !(!$scope.loginData.username || !$scope.loginData.password || ($scope.loginData.username.length === 0) || ($scope.loginData.password.length === 0));
				}

				/*
				recursively calls itself till graceTime becomes 0
				* */
				var myTimeout = function () {
					$scope.graceTime--;
					if ($scope.graceTime > 0) {
						// wait 1s and call itself
						$timeout(myTimeout, 1000);
					} else {
						// remove the countdown from UI, activate button
						platformContextService.setApplicationValueWithSave('failedLogin', {'failCount':0, 'loginBlockedUntil': moment(new Date()).add(-1, 's').toDate().toString()});
						$scope.loginDisabledForFaultyLogin = false;
					}
				};


				$scope.canLogon = function () {
					return !$scope.loginOptions.loading && isUserPasswordValid() && !$scope.loginDisabledForFaultyLogin;
				};
				platformContextService.readContextFromLocalStorage();
				let failedLoginObj = platformContextService.getApplicationValue('failedLogin') || {'failCount':0, 'loginBlockedUntil': moment(new Date()).add(-1, 's').toDate().toString()};
				$scope.failedPasswordCount = failedLoginObj.failCount;
				let loginDisabledUntilStr = failedLoginObj.loginBlockedUntil || moment(new Date()).add(-1, 's').toDate().toString();
				if(new Date(loginDisabledUntilStr).getTime() > new Date().getTime() ){
					$scope.graceTime = Math.round((new Date(loginDisabledUntilStr) - new Date()) / 1000);
					$scope.loginDisabledForFaultyLogin = true;
					$timeout(myTimeout, 1000);
				}else{
					$scope.graceTime = 0;
					$scope.loginDisabledForFaultyLogin = false;
				}



				function startGraceTimeCountdownForFailedAttempt() {
					$scope.failedPasswordCount += 1;
					$scope.loginDisabledForFaultyLogin = true; // show the countdown from UI, deactivate button
					switch ($scope.failedPasswordCount) {
						case 1:
							$scope.graceTime = 3;
							break;
						case 2:
							$scope.graceTime = 5;
							break;
						case 3:
							$scope.graceTime = 10;
							break;
						default:
							$scope.graceTime = ($scope.failedPasswordCount - 3) * 30; // add 30s for each faulty login
					}
					let loginBlockedUntil = moment(new Date()).add($scope.graceTime, 's').toDate().toString();
					platformContextService.setApplicationValueWithSave('failedLogin', {'failCount':$scope.failedPasswordCount, 'loginBlockedUntil': loginBlockedUntil});

					$timeout(myTimeout, 1000);
				}

				$scope.getLoginWaitHint = function () {
					return _.template($scope.text.platform.loginWaitHint)({graceTime: $scope.graceTime});
				};

				/*
				 called when Login Button is pressed, or Enter Key
				 */
				$scope.login = function () {
					//remove custom sso info before standard login to ensure custom logouturl info
					//clear, since the logout can't clean up the data, otherwise the navigation to
					//customlogouturl when someone uses the standard login and custom sso login
					//in the same browser
					platformContextService.removeCustomSsoFromLocalStorage();

					if (!$scope.loginDisabledForFaultyLogin && isUserPasswordValid()) {
						$scope.feedback = {
							show: true,
							message: $scope.text.platform.loginBusyMessage,
							alertClass: 'alert-info'
						};
						$scope.loginOptions.loading = true;

						// rei@31.3.2020 encrypt password with base64 and uriencode it for supporting unicode full cahr set
						var base64Pwd = window.btoa(encodeURIComponent('base64.' + $scope.loginData.password));
						tokenAuthentication.login($scope.loginData.username, base64Pwd).then(
							function success() {
								// remove eventually running error feedback timer
								$scope.feedback = {
									show: true,
									message: $scope.text.platform.loginSuccessfulMessage,
									alertClass: 'alert-info'
								};

								$scope.loginOptions.loading = true;

								// call callback function
								if ($scope.onLogonValidFn) {
									$scope.onLogonValidFn();
								}
							},
							function error(result) {
								if (_.isString(result.data.error_description)){
									result.data.error_description = _.escape(result.data.error_description);
								}
								var moreInfo = _.isNil(result.data.error_description) ? '' : ('<br>' + result.data.error_description);  // jshint ignore:line
								$scope.feedback = {
									show: true,
									message: $scope.text.platform.loginFailedMessage + moreInfo,
									alertClass: 'alert-danger hide-after-10sec'
								};
								$scope.loginOptions.loading = false;
								startGraceTimeCountdownForFailedAttempt();
							});
					}
				};

				/**
				 * this login handles the ipd login
				 * rei@14.2.2019:  currently we allow:  azure active directory and adfs logins
				 * @param idptype
				 */
				$scope.idplogin = function idplogin(idptype) {

					// pkce see https://curity.io/resources/tutorials/howtos/advanced/pkce
					// sha256 see https://developer.mozilla.org/en-US/docs/Glossary/Cryptographic_hash_function
					let authCodeChallenge = tokenAuthentication.createAuthCodeChallenge();
					var redirectUri = window.location.origin + window.location.pathname + '#/callback';
					var callbackUrl = encodeURIComponent(redirectUri);
					var authorizeUrl = globals.identityBaseUrl + 'connect/authorize';
					var identityServerIdpAuthUri = authorizeUrl +
						'?client_id=' + 'itwo40.authcode' +    // jshint ignore:line
						'&client_secret={fec4c1a6-8182-4136-a1d4-81ad1af5db4a}' +
						'&scope=' + 'default openid' + (refreshTokenEnabled ? ' offline_access' : '') +
						'&response_type=' + 'code' +    // jshint ignore:line
						'&nonce=' + 'random_nonce' +
						'&max_age=' + 10 +    // jshint ignore:line
						'&code_challenge=' + authCodeChallenge + '&code_challenge_method=S256' +
						'&acr_values=' + 'idp:' + idptype + ' ipderrorroute:loginpage?ipderror' +     // jshint ignore:line
						'&redirect_uri=' + callbackUrl;   // jshint ignore:line
					window.location.href = identityServerIdpAuthUri;
				};

				/*
				 called when Logoff Button is pressed
				 */
				$scope.idplogoff = function (idptype) {
					var redirectUri = encodeURI(window.location.origin + window.location.pathname);
					var identityServerIdpLogoffUri = null;
					if ((idptype === 'ext:azuread') || (idptype === 'ext:azureadp')) {
						identityServerIdpLogoffUri = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=';
						identityServerIdpLogoffUri += redirectUri;
					}
					if (idptype === 'ext:adfs') {
						if ($scope.identityprovider.standard.wsfedlogouturl) {
							identityServerIdpLogoffUri = $scope.identityprovider.standard.wsfedlogouturl + '&wreply=' + redirectUri;
						}
					}
					if (identityServerIdpLogoffUri) {
						window.location.href = identityServerIdpLogoffUri;
					}
				};

				/*
				 */
				$scope.init = function () {
					$scope.feedback = {};
					$scope.loginData = {
						username: $scope.loginData.username, // init with last data
						password: null
					};
				};

				/* Called after valid login
				 */
				$scope.onLogonValidFn = function () {
					// console.log('onLogonValidFn called');
					platformStartupRouteService.clearStartupRoute();
					app.navigateToCompany(); // jshint ignore:line
				};

				function reportError(message) {
					var moreInfo = message ? ('<br>' + message.Message) : '';  // jshint ignore:line
					$scope.feedback = {
						show: true,
						message: $scope.text.platform.loginFailedMessage + moreInfo,
						alertClass: 'alert-danger hide-after-10sec'
					};
					$scope.loginOptions.loading = false;
				}

				function showError(message) {
					platformDialogService.showErrorDialog(message);

					$scope.feedback = {
						show: true,
						message: $scope.text.platform.loginFailedMessage,
						alertClass: 'alert-danger hide-after-10sec'
					};
					$scope.loginOptions.loading = false;
				}

				var unRegAuthenticationRequired = $rootScope.$on(tt.authentication.authenticationRequired, function (e, data) {
					// console.log('authenticationRequired', e, data);
					reportError(data);
				});

				var unRegserverError = $rootScope.$on(tt.authentication.serverError, function (e, data) {
					// console.log('serverError', e, data);
					showError(data);
				});

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					unRegAuthenticationRequired();
					unRegserverError();
				});

			}]);
})(tt);// jshint ignore:line
