/**
 * Created by rei on Oct. 2017.
 */
/* globals app */
/* jshint -W106 */
(function (angular) {
	'use strict';

	/**
     @ngdoc controller
	 * @name platformPortalLogonDialogController
	 * @function
	 *
	 * @description
	 * Controller for Login dialog.
	 */
	angular.module('platform').controller('platformPortalLogonDialogController',
		['$log', '$scope', 'tokenAuthentication', 'globals', '_', 'platformContextService', 'platformTranslateService', '$translate', '$timeout', 'platformLogonService', '$stateParams', '$state',
			'platformPortalService', 'platformStartupRouteService',
			function platformPortalLogonDialogController($log, $scope, tokenAuthentication, globals, _, platformContextService, platformTranslateService, $translate, $timeout, logonService, $stateParams,
				$state, platformPortalService, platformStartupRouteService) { // jshint ignore:line
				var refreshTokenEnabled = false;
				var self = this;        // keep controller this
				self.result = {};     // keep result code there

				var defaultIdentityprovider = {
					portal: {
						google: false,
						twitter: false,
						msaccount: false,
						facebook: false,
						wsfederation: false,
						openid: false
					}
				};  // rei@06.11.20 only portal/standard used now
				$scope.path = globals.appBaseUrl;

				$scope.identityprovider = defaultIdentityprovider;

				$scope.version = app.productBuildVersion;
				$scope.productName = app.productName;
				$scope.productLogoPrimary = app.productLogoPrimary;

				$scope.dialogOptions = {
					loading: true,
					// loadingInfo: 'Reading available Social Media Provider. Please wait...',
					loadingInfo: 'Please wait...',
					invitation: false,
					idpsDisabled: true,
					idpError: false,
					idpErrorMessage: '',
					idpErrorMessageKey: '',
					invitationGreetingKey: '',
					invitationGreeting: 'Analysing of Invitation Data!<br>This might take a while.<br><br><br><br><br><br><br><br>',
					standardGreeting: '',
					standardGreetingKey: ''
				};

				$scope.providerInfo = {
					contactid: 'n/a',
					contactusername: 'your@portal-username',
					company: 'your@portal-company',
					provider: 'google',
					providerUserName: 'your@googlemail.com'
				};

				if ($stateParams.idperror) {
					$scope.dialogOptions.idpError = true;
					$scope.dialogOptions.idpsDisabled = true;
					$scope.dialogOptions.loading = false;

					// var portalIdpErrorText = "<br><b>Something went wrong while logon!</b><br><br><b>iTWO 4.0 Internet Portal</b> failed!<br><br>Following issue occurred while registering.<br><b>Code</b>: <%= resultcode %> &emsp;<b>Message</b>:<br><%= resultmsg %><br><br><b>Sorry for the inconvenience!</b><br>You're not allowed to login.<br>Please contact your responsible help desk for further support.";
					// if (platformContextService.getLanguage() === 'de') {
					// 	portalIdpErrorText = "<br><b>Anmeldung aktuell nicht möglich!</b><br><br><b>iTWO 4.0 Internet Portal</b> fehlerhaft!<br><br>Die folgenden Fehlermeldung ist aufgetreten..<br><b>Fehlercode:</b> <%= resultcode %> &emsp;<b>Fehlermeldung</b>:<br><%= resultmsg %><br><br><b>Entschuldigung für die Unannehmlichkeit!</b><br>Sie können sich nicht anmelden..<br>Bitte kontaktieren Sie den Help Desk für weitere Informationen.";
					// }
					// if (true) { // 4.1 implementation with text module
					var portalIdpErrorKey = 'portalIdpError';
					platformPortalService.getPortalTextByKey(portalIdpErrorKey).then(function (text) {
						var params = {resultcode: $stateParams.errcode, resultmsg: $stateParams.idperror};
						var compiled = _.template(text);
						$scope.dialogOptions.idpErrorMessage = compiled(params);
					});
					// }
				}
				// read identity server external provider, depending on that we have the social media logins available or not
				if (!$scope.dialogOptions.idpError && !$stateParams.invitation) {   // registration or standard login process
					$scope.dialogOptions.loadingInfo = $translate.instant('platform.portal.loadingProviderInfo');

					// $scope.dialogOptions.loadingInfo = $scope.text.platform.portal.loadingProviderInfo;
					tokenAuthentication.idpInfo().then(function (idpinfo) {
						$scope.identityprovider = _.assign($scope.identityprovider, idpinfo.data);
						$scope.dialogOptions.loading = false;
						$scope.dialogOptions.idpsDisabled = false;
						refreshTokenEnabled = tokenAuthentication.refreshTokenEnabled();
					});
				}

				// set social media provider info
				//	$scope.identityprovider = _.assign(globals.identityprovider||{}, defaultIdentityprovider);
				$scope.identityprovider.isActive = function () {
					return ($scope.identityprovider.portal && ($scope.identityprovider.portal.google ||
						$scope.identityprovider.portal.twitter || $scope.identityprovider.portal.msaccount ||
						$scope.identityprovider.portal.facebook || $scope.identityprovider.portal.wsfederation || $scope.identityprovider.portal.openid));
				};

				/***
				 * used for creating a registration result message depending the current ui language
				 *
				 * if called without params its just refresh with curren params
				 *
				 * @param msgKey
				 * @param msg
				 * @param resultCode
				 * @param resultMsg
				 * @returns {string|Object|*}
				 */
				function setResultMessage(msgKey, msg, resultCode, resultMsg) {
					if (resultCode && resultMsg) {
						self.result.params = {resultcode: resultCode, resultmsg: resultMsg};
					}

					if (self.result && msg) {
						var compiled = _.template(msg);
						$scope.dialogOptions.invitationGreeting = compiled(self.result.params);
						$scope.dialogOptions.invitationGreetingKey = msgKey;
					}
				}

				function invitationGreeting() {
					if ($stateParams.invitation && $scope.contactInfo) {
						platformPortalService.getPortalTextByKey('portalInvitationGreeting')
							.then(function (text) {
								$scope.dialogOptions.invitationGreetingKey = 'portalInvitationGreeting';
								if (text) {
									var compiled = _.template(text);
									$scope.dialogOptions.invitationGreeting = compiled($scope.contactInfo);
								} else {
									$scope.dialogOptions.invitationGreeting = text;
								}
							});
					}
				}

				// analyse params:
				// url: '/portallogin?invitation',
				// https://rib-w0918.rib-software.com/itwo40dev/v1_local/portal/#/portallogin?invitation=token
				if (!$scope.dialogOptions.idpError && $stateParams.invitation) {
					$scope.dialogOptions.loadingInfo = $translate.instant('platform.portal.loadingInvitationInfo');
					$scope.dialogOptions.invitation = true;
					tokenAuthentication.idpInfo().then(function (idpinfo) {
						$scope.identityprovider = _.assign($scope.identityprovider, idpinfo.data);
						refreshTokenEnabled = tokenAuthentication.refreshTokenEnabled();
					});

					logonService.resolveInvitationUrl($stateParams.invitation).then(function (data) {
						$scope.dialogOptions.data = data;
						$scope.dialogOptions.loading = false;
						$scope.dialogOptions.idpsDisabled = false;

						var contact = data.contactEntity || {};
						$scope.contactInfo = {
							id: contact.id,
							fullname: contact.firstName + ' ' + contact.familyName,
							email: contact.email
						};
						invitationGreeting();
					}, function failed(data) {
						$scope.dialogOptions.errorData = data;
						$scope.dialogOptions.loading = false;
						$scope.dialogOptions.idpsDisabled = true;

						platformPortalService.getPortalTextByKey('portalInvitationFailed')
							.then(function (text) {
								setResultMessage('portalInvitationFailed', text, data.ErrorCode, data.ErrorMessage);
							});
					});
				}

				$scope.loginData = {
					username: null,
					password: null
				};

				// object holding translated strings
				$scope.text = {};

				// loads or updates translated strings
				var loadTranslations = function () {
					// load translation of tile-group definition
					$scope.text = platformTranslateService.instant({
						platform: [
							'loginBusyMessage', 'loginFailedMessage', 'loginSuccessfulMessage', 'loginWith',
							'loginViaGoogle', 'loginViaTwitter', 'loginViaMicrosoftAccount', 'loginViaFacebook', 'loginViaAdfs', 'loginViaAad',
							'loginViaOpenId', 'logoffromAad', 'logoffromAdfs', 'logoffIdpProviderButton'],
						'platform.portal': ['loadingProviderInfo']
					});
					invitationGreeting();
					setResultMessage();
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				var translationModules = ['app'];

				if (globals.i18nCustom) {
					translationModules.push('$custom.portal');
				}

				if (!platformTranslateService.registerModule(translationModules)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				/**
				 *
				 */
				function navigateToExternalIdp(idptype) {

					// pathname is with / at the end
					var theRedirct_uri = window.location.origin + window.location.pathname;
					var authorizeUrl = globals.identityBaseUrl + 'connect/authorize';
					var invitationInfo = '';
					let authCodeChallenge = tokenAuthentication.createAuthCodeChallenge();
					if ($scope.dialogOptions.invitation) {
						invitationInfo = ' invitationrequest:' + $stateParams.invitation;
					}
					var param = {
						client_id: 'itwo40.authcode',
						// client_id: 'itwo40.hybrid',
						scope: 'default openid ' + (refreshTokenEnabled ? 'offline_access' : ''),
						// response_type: 'code id_token',  // hybrid flow
						// response_type: 'code', // authorizationcodeflow
						response_type: 'code',
						response_mode: 'form_post',
						redirect_uri: theRedirct_uri + '#/callback',
						nonce: 'random_nonce',
						acr_values: 'idp:' + idptype + ' portalrequest:true' + invitationInfo + ' extpartialredirect_uri:' + theRedirct_uri,
						prompt: 'none',
						max_age: 10
					};
					var callbackUrl = encodeURIComponent(param.redirect_uri);
					var newUri = authorizeUrl +
						'?client_id=' + param.client_id +
						'&scope=' + param.scope +
						'&code_challenge=' + authCodeChallenge + '&code_challenge_method=S256' +
						'&response_type=' + param.response_type +
						'&nonce=' + param.nonce +
						'&max_age=' + param.max_age +
						'&acr_values=' + param.acr_values +
						//						'&redirect_uri=' + param.redirect_uri + '#/redirect?';
						'&redirect_uri=' + callbackUrl;
					console.log(newUri);
					window.location.href = newUri;
				}

				/*
				 called when Login Button is pressed, or Enter Key
				 */
				$scope.idplogin = function (idptype) {
					//if exist custom sso in localstorage then clear before idp login
					platformContextService.removeCustomSsoFromLocalStorage();

					// $log.info('Logon triggered ');
					navigateToExternalIdp(idptype);
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
					if (idptype === 'ext:oidc' && $scope.identityprovider.portal.idplogouturl) {
						var identityServerIdpLogoffUri = $scope.identityprovider.portal.idplogouturl + '?post_logout_redirect_uri=' + redirectUri;
					}
					if (identityServerIdpLogoffUri) {
						window.location.href = identityServerIdpLogoffUri;
					}
				};

				function onLanguageChanged(action) {
					if (action !== 'language') {
						return;
					}
					loadTranslations();
					if ($scope.dialogOptions.standardGreetingKey) {
						platformPortalService.getPortalTextByKey($scope.dialogOptions.standardGreetingKey)
							.then(function (text) {
								$scope.dialogOptions.standardGreeting = text;
							});
					}

					if ($scope.dialogOptions.invitationGreetingKey) {
						platformPortalService.getPortalTextByKey($scope.dialogOptions.invitationGreetingKey)
							.then(function (text) {
								var params = null;
								if (text) {
									if ($scope.dialogOptions.invitationGreetingKey === 'portalInvitationGreeting' && $stateParams.invitation && $scope.contactInfo) {
										params = $scope.contactInfo;
									} else {
										params = self.result.params;
									}
									var compiled = _.template(text);
									$scope.dialogOptions.invitationGreeting = compiled(params);
								} else {
									$scope.dialogOptions.invitationGreeting = text;
								}
							});
					}
				}

				function initStandardGreetingText() {
					if (!$scope.dialogOptions.standardGreetingKey) {
						platformPortalService.getPortalTextByKey('portalStandardGreeting')
							.then(function (text) {
								$scope.dialogOptions.standardGreetingKey = 'portalStandardGreeting';
								$scope.dialogOptions.standardGreeting = text;
							});
					}
				}

				platformContextService.contextChanged.register(onLanguageChanged);

				if (!$scope.dialogOptions.idpError) initStandardGreetingText();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformContextService.contextChanged.unregister(onLanguageChanged);
				});

			}

		]);
})(angular);
