/**
 * Created by rei on Oct.2017.
 */
/* globals app */

(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name platformPartialLogonDialogController
	 * @function
	 *
	 * @description
	 * Controller for Login dialog.
	 */
	angular.module('platform').controller('platformPartialLogonDialogController',
		['$log', '$scope', 'tokenAuthentication', 'globals', '_', 'platformContextService', 'platformTranslateService', '$translate', '$timeout', 'platformLogonService', '$stateParams', 'platformPortalService',
			function platformPartialLogonDialogController($log, $scope, tokenAuthentication, globals, _, platformContextService, platformTranslateService, $translate, $timeout,
				logonService, $stateParams, platformPortalService) { // jshint ignore:line

				var self = this;        // keep controller this
				self.result = {};     // keep result code there

				var portalUserRegisterInfo = {
					clerkList: [],
					countryList: [],
					providerList: [],
					extProviderInfo: {
						city: '',
						clerkFk: undefined,
						companyName: '',
						phone: '',
						countryFk: 0,
						emailFromProvider: '',
						externalIdentity: '',
						identityProvider: '',
						identityProviderFk: 0,
						partialLogin: true,
						remark: null,
						street: null,
						uiNameFromProvider: '',
						userId: 0,
						userNameFromProvider: '',
						zipCode: null
					}
				};
				$scope.dlgData = portalUserRegisterInfo;

				$scope.version = app.productBuildVersion;
				$scope.productName = app.productName;
				$scope.productLogoPrimary = app.productLogoPrimary;

				// /portalpartiallogin?provider=ext:google&providerid=109133264469354983498&name=Rolf%20Eisenhut&email=rolf.eisenhut@googlemail.com
				$scope.dialogOptions = {
					registerValid: function () {
						return ($scope.dialogOptions.isInvitation) ?
							validInvitationParameters() : validParameters();
					},
					emailReadonly: false,
					providerclass: null,
					loading: false,
					registrationDone: false,
					registrationMsg: '',
					registrationMsgKey: '',
					isInvitation: false,
					loadingInfo: 'Check Social Media Provider data. Please Wait...'
				};

				$scope.countryOptions = {
					displayMember: 'displayInfo', valueMember: 'id',
					items: $scope.dlgData.countryList,
					watchItems: true
				};

				$scope.clerkOptions = {
					displayMember: 'displayInfo', valueMember: 'id',
					items: $scope.dlgData.clerkList,
					watchItems: true
				};

				startupLoader($stateParams.partialtoken);

				function iconClassByProvider(provider) {
					var cssClass = '';
					switch (provider) {
						case 'ext:google':
							cssClass = 'fa-google-plus';
							break;
						case 'ext:twitter':
							cssClass = 'fa-twitter';
							break;
						case 'ext:msaccount':
							cssClass = 'fa-windows';
							break;
						case 'ext:azuread':
						case 'ext:azureadp':
							cssClass = 'control-icons ico-azure';
							break;
						case 'ext:facebook':
							cssClass = 'fa-facebook';
							break;
						case 'ext:oidc':
							cssClass = 'control-icons ico-social-media-openid';
							break;
						case 'ext:adfs':
							cssClass = 'control-icons ico-social-media-adfs';
							break;
					}
					return cssClass;
				}

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
						$scope.dialogOptions.registrationMsg = compiled(self.result.params);
						$scope.dialogOptions.registrationMsgKey = msgKey;
					}
				}

				// loads or updates translated strings
				var loadTranslations = function () {
					// $log.debug('loadTranslations called', logonService.getUiLanguages());
					// load translation of tile-group definition
					$scope.text = platformTranslateService.instant({
						platform: ['logoffromAad', 'logoffromAdfs'],
						'platform.portal': ['socialInfo', 'providerName', 'providerUserEmail', 'remark', 'companyName', 'bpdAddress',
							'phone', 'street', 'zipCode', 'city', 'country', 'clerk', 'registerButton', 'backButton', 'invitationButton']
					});
				};

				/**
				 *
				 */
				function refreshTranslations() {
					loadTranslations();
					setResultMessage();
					updateFillOutMsg();
				}

				// register translation changed event
				platformTranslateService.translationChanged.register(refreshTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				var translationModules = ['app'];
				if (globals.i18nCustom) {
					translationModules.push('$custom.portal');
				}
				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(translationModules)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				function isStringwithContent(str) {
					return (_.isString(str) && str.length > 0);
				}

				/**
				 *  updateFillOutMsg is used for update the fillout msg depending on current language settings
				 * @param params    templateKey - key of template
				 * 					parameters for template replacement
				 *                  for init we need the params, for refresh it can be without params.
				 */
				function updateFillOutMsg(templateKey, template, params) {
					if (params) {
						self.FillOutMsgParams = params;
					}

					if (self.FillOutMsgParams && template) {
						var compiled = _.template($translate.instant(template));
						$scope.dialogOptions.registrationFillOutMsg = compiled(self.FillOutMsgParams);
						$scope.dialogOptions.registrationMsg = '';
						$scope.dialogOptions.registrationMsgKey = '';
						$scope.dialogOptions.registrationFillOutMsgKey = templateKey;
					}
				}

				function startupLoader(token) {
					// console.log('Project Favorites Refresh pressed');
					$scope.dialogOptions.loading = true;

					platformPortalService.getPortalExternalProviderInfoFromToken(token).then(function (resultData) {
						$scope.dialogOptions.loading = false;
						var currentLanguage = platformContextService.getLanguage();
						if (resultData.responseCode === 200) {
							$scope.dlgData = portalUserRegisterInfo = resultData;
							var portalInvitationInfo = resultData ? resultData.extProviderInfo.portalInvitationInfo : null;

							$scope.dialogOptions.emailReadonly = isStringwithContent(resultData.extProviderInfo.emailFromProvider);
							$scope.dialogOptions.providerclass = iconClassByProvider(resultData.extProviderInfo.identityProvider);
							$scope.clerkOptions.items = $scope.dlgData.clerkList;
							$scope.countryOptions.items = $scope.dlgData.countryList;
							if (portalInvitationInfo) {
								$scope.dialogOptions.isInvitation = true;
								$scope.contactBpdInfo = portalInvitationInfo.contactBpdInfo;  // make binding easier
								if ($scope.contactBpdInfo.contact.basCountryFk) {  // preset to contact Country
									$scope.dlgData.extProviderInfo.countryFk = $scope.contactBpdInfo.contact.basCountryFk;
								}
								platformPortalService.getPortalTextByKey('portalInvitationFillout', currentLanguage)
									.then(function (text) {
										updateFillOutMsg('portalInvitationFillout', text, {providerFullName: resultData.extProviderInfo.identityProviderFullName});
									});
							} else {
								platformPortalService.getPortalTextByKey('portalRegisteredFillOut', currentLanguage)
									.then(function (text) {
										updateFillOutMsg('portalRegisteredFillOut', text, {providerFullName: resultData.extProviderInfo.identityProviderFullName});
									});
								// $scope.clerkOptions.items = $scope.dlgData.clerkList;
								// $scope.countryOptions.items = $scope.dlgData.countryList;
								_.noop();
							}
						} else { // not 200
							$scope.dialogOptions.registrationDone = true;
							platformPortalService.getPortalTextByKey('portalRegistrationFailed', currentLanguage)
								.then(function (text) {
									reportErrorMessage('portalRegistrationFailed', text, resultData);
								});
						}

					}, function () {
						$scope.dialogOptions.loading = false;
					});
				}

				$scope.onBackBtn = function back() {
					$scope.dialogOptions.loading = true;
					$scope.dialogOptions.loadingInfo = 'Navigate to Logon Page. Please wait...';

					// refresh dialogOptions first...
					$timeout(app.reloadLoginPage(), 500);
				};

				/*
				 called when RegisterNow Button is pressed, or Enter Key
				 */
				$scope.onRegisterBtn = function () {
					// $log.info('Logon triggered ');
					if ($scope.dialogOptions.registerValid()) {
						completeRegister();
					}
				};

				/*
				 called when Invitation Complete Button is pressed, or Enter Key
				 */
				$scope.onInvitationBtn = function () {
					// $log.info('Logon triggered ');
					if ($scope.dialogOptions.registerValid()) {
						completeInvitation();
					}
				};

				/**
				 *
				 * @param templateKey
				 * @param template
				 * @param result
				 */
				function reportErrorMessage(templateKey, template, result) {
					setResultMessage(templateKey, template, result.responseCode || result.ErrorCode, result.responseMessage || result.ErrorMessage);
				}

				/**
				 * Complete Registration, we use portalUserRegisterInfo as parameter
				 */
				function completeRegister() {
					$scope.dialogOptions.loading = true;
					$scope.dialogOptions.loadingInfo = 'Save Registration data. Please wait...';

					portalUserRegisterInfo.portalBaseUrl = globals.portalUrl; // rei@4.7.18, supply portal url for usage in workflow event context
					platformPortalService.portalRegisterComplete(portalUserRegisterInfo).then(function (data) {
						$scope.dialogOptions.loading = false;
						$scope.dialogOptions.registrationDone = true;
						var result = data;
						// responseMessage,responseCode,token
						var currentLanguage = platformContextService.getLanguage();
						if (result.responseCode === 200) {
							platformPortalService.getPortalTextByKey('portalRegisteredSuccessful', currentLanguage)
								.then(function (text) {
									setResultMessage('portalRegisteredSuccessful', text);
								});
						} else {
							platformPortalService.getPortalTextByKey('portalRegistrationFailed', currentLanguage)
								.then(function (text) {
									reportErrorMessage('portalRegistrationFailed', text, result);
								});
						}
						if (result.ErrorCode) {
							platformPortalService.getPortalTextByKey('portalRegistrationFailed', currentLanguage)
								.then(function (text) {
									reportErrorMessage('portalRegistrationFailed', text, result);
								});
						}
					}, function () {
						$scope.dialogOptions.loading = false;
					});

				}

				/**
				 * Complete Invitation, we use portalUserRegisterInfo as parameter
				 */
				function completeInvitation() {
					$scope.dialogOptions.loading = true;
					$scope.dialogOptions.loadingInfo = 'Save your Invitation data. Please wait...';

					platformPortalService.portalInvitationComplete(portalUserRegisterInfo).then(function (data) {
						$scope.dialogOptions.loading = false;
						$scope.dialogOptions.registrationDone = true;
						var result = data;
						// responseMessage,responseCode,token
						var currentLanguage = platformContextService.getLanguage();
						if (result.responseCode === 200) {
							platformPortalService.getPortalTextByKey('portalInvitationSuccessful', currentLanguage)
								.then(function (text) {
									setResultMessage('portalInvitationSuccessful', text);
								});
						} else {
							platformPortalService.getPortalTextByKey('portalRegistrationFailed', currentLanguage)
								.then(function (text) {
									reportErrorMessage('portalRegistrationFailed', text, result);
								});
						}
						if (result.ErrorCode) {
							platformPortalService.getPortalTextByKey('portalRegistrationFailed', currentLanguage)
								.then(function (text) {
									reportErrorMessage('portalRegistrationFailed', text, result);
								});
						}
					}, function () {
						$scope.dialogOptions.loading = false;
					});

				}

				/**
				 * This method check if all required parameters for the invitation are there
				 *
				 * @returns {boolean}
				 */
				function validInvitationParameters() {
					// console.log ('LoginData: ',$scope.loginData);
					var extProv = $scope.dlgData.extProviderInfo;
					var info = $scope.contactBpdInfo;
					if (extProv && info &&
						isStringwithContent(info.bpd.fullName) &&
						isStringwithContent(info.bpd.address)
						//	isStringwithContent(info.contact.telephonePattern) &&
						//	(_.isNumber(extProv.clerkFk) && extProv.clerkFk > 0) &&
						//	(_.isNumber(extProv.countryFk) && extProv.countryFk > 0)
					) {
						return true;
					}
					return false;
				}

				/**
				 * This method check if all required parameters for the self registration are there
				 * @returns {boolean}
				 */
				function validParameters() {
					// console.log ('LoginData: ',$scope.loginData);
					var data = $scope.dlgData.extProviderInfo;
					if (data &&
						isStringwithContent(data.companyName) &&
						isStringwithContent(data.emailFromProvider)
						// isStringwithContent(data.phone) &&
						// (_.isNumber(data.clerkFk) && data.clerkFk > 0) &&
						// (_.isNumber(data.countryFk) && data.countryFk > 0)
					) {
						return true;
					}
					return false;
				}

				function onLanguageChanged(action) {
					if (action !== 'language') {
						return;
					}
					loadTranslations();

					if ($scope.dialogOptions.registrationMsgKey) {
						platformPortalService.getPortalTextByKey($scope.dialogOptions.registrationMsgKey)
							.then(function (text) {
								if (text) {
									var compiled = _.template(text);
									$scope.dialogOptions.registrationMsg = compiled(self.result.params);
								} else {
									$scope.dialogOptions.registrationMsg = text;
								}
							});

					}

					if ($scope.dialogOptions.registrationFillOutMsgKey) {
						platformPortalService.getPortalTextByKey($scope.dialogOptions.registrationFillOutMsgKey)
							.then(function (text) {
								if (text) {
									var compiled = _.template($translate.instant(text));
									$scope.dialogOptions.registrationFillOutMsg = compiled(self.FillOutMsgParams);
								} else {
									$scope.dialogOptions.registrationFillOutMsg = text;
								}
							});
					}
				}

				platformContextService.contextChanged.register(onLanguageChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformContextService.contextChanged.unregister(onLanguageChanged);
				});

			}]);
})(angular);
