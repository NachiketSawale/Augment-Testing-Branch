/**
 * Created by rei on Jan.2018.
 */
/* globals app */

(function () {
	'use strict';

	/**
	 @ngdoc controller
	 * @name platformPartialLogonDialogController
	 * @function
	 *
	 * @description
	 * Controller for Login dialog.
	 */
	angular.module('platform').controller('platformSsoLogonController',
		['$log', '$scope', 'tokenAuthentication', 'globals', '_', 'platformContextService',
			'platformTranslateService', '$translate', '$timeout', 'platformLogonService', '$stateParams', 'platformSsoService',
			function platformPartialLogonDialogController($log, $scope, tokenAuthentication, globals, _, platformContextService,
				platformTranslateService, $translate, $timeout, logonService, $stateParams,
				platformSsoService) { // jshint ignore:line

				var self = this;        // keep controller this
				self.result = {};     // keep result code there

				$scope.version = app.productBuildVersion;
				$scope.productName = app.productName;
				$scope.productLogoPrimary = app.productLogoPrimary;

				// /portalpartiallogin?provider=ext:google&providerid=109133264469354983498&name=Rolf%20Eisenhut&email=rolf.eisenhut@googlemail.com
				$scope.dialogOptions = {
					loadingInfo: 'Check Single SignOn Data. Please Wait... (local)',
					singleSignOnInfoMsg: ''
				};

				var ssoTypeInfo = {ssoOwner: '', ssoType: '', company: ''};

				if ($stateParams.type) {  // mike/rei@9.11.18 accept all kind of type paramete , i.e. myHome, etc.
					ssoTypeInfo.ssoOwner = $stateParams.type;
					if ($stateParams.ticket) {
						ssoTypeInfo.ssoType = 'Ticket System';
					}
				}

				if ($stateParams.company) {
					ssoTypeInfo.company = 'with Company Code ' + $stateParams.company;
				}
				if ($stateParams.shortTermToken) {
					ssoTypeInfo.ssoOwner = '';
					ssoTypeInfo.ssoType = 'ShortTermToken';
				}

				var ticket = $stateParams.ticket;
				if (!ticket){
					ticket = $stateParams.code;
				}

				var ssoInfo = {
					type: $stateParams.type,
					shortTermToken: $stateParams.token,
					ticket: ticket,
					encryptedpwd: undefined, // not used here, cannot be trigger via the ?sso url
					companyCode: $stateParams.company
				};
				$scope.dlgData = ssoInfo;

				function iconClassByProvider(provider) {// jshint ignore:line
					var cssClass = '';
					switch (provider) {
						case 'ext:myHome':
							cssClass = 'fa-google-plus';
							break;
						case 'ext:bischIdm':
							cssClass = 'fa-twitter';
							break;
					}
					return cssClass;
				}

				/***
				 * used for creating a registration result message depending the current ui language
				 *
				 * if called without params its just refresh with curren params
				 *
				 * @param msgPath
				 * @param resultCode
				 * @param resultMsg
				 * @returns {string|Object|*}
				 */
				function setResultMessage(msgPath, params) {
					if (params) {
						self.result.params = params;
					}
					if (msgPath) {
						self.result.messagePath = msgPath;
					}
					if (self.result && self.result.messagePath) {
						var compiled = _.template($translate.instant(self.result.messagePath));
						$scope.dialogOptions.singleSignOnInfoMsg = compiled(self.result.params);
					} else {
						$scope.dialogOptions.singleSignOnInfoMsg = '';
					}
				}

				var initDone = false;
				// loads or updates translated strings
				var loadTranslations = function () {
					// $log.debug('loadTranslations called', logonService.getUiLanguages());
					// load translation of tile-group definition
					$scope.text = platformTranslateService.instant({
						platform: [/* 'loginLanguage' */],
						'platform.sso': ['title', 'checkWaitMessage', 'ssoInfoTemplate', 'ssoErrorTemplate'],
						'platform.portal': ['backButton']
					});
					$scope.dialogOptions.loadingInfo = $translate.instant('platform.sso.checkWaitMessage');

					// rei@6.3.18 make sure translations for the module are loaded. And we ensure label are updated
					if (!initDone && !_.isEqual($scope.text.platform.sso.ssoInfoTemplate, 'platform.sso.ssoInfoTemplate')) {
						initDone = true;
						$timeout(startupLoader(), 200);
					}
					setResultMessage();
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				// 	if (!platformTranslateService.registerModule('app',true)) {
				// 		console.log('registerModule app done...');
				// 		// if translation is already available, call loadTranslation directly
				// 		loadTranslations();
				//
				// 		console.log('InfoTemplate: ' + $scope.text.platform.sso.ssoInfoTemplate + '\nErrortext: ' + $scope.text.platform.sso.ssoErrorTemplate + '\nButton: ' + $scope.text.platform.portal.backButton);
				// 		//startupLoader();
				// 	}
				platformTranslateService.registerModule('app', true).then(function (/* data */) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
					// startupLoader();
				});

				function isStringwithContent(str) {// jshint ignore:line
					return (_.isString(str) && str.length > 0);
				}

				/**
				 * method startupLoader() call single signOn logon Service with parameters supplied by url
				 *
				 */
				function startupLoader() {
					$scope.dialogOptions.loading = true;

					//Remove custom sso to ensure sso info clear.
					platformContextService.removeCustomSsoFromLocalStorage();
					
					platformSsoService.singleSignOnMyHome(ssoInfo).then(function (data) {// jshint ignore:line
						$scope.dialogOptions.loading = false;

						if (data && data.http_statuscode > 200) { // jshint ignore:line
							// {"http_statuscode":401,"http_errorreason":"Logon name validation failed. Can not login with this Logon name.","expires_in":0}
							// console.log(data);
							var errorInfo = {
								ssoOwner: ssoTypeInfo.ssoOwner, ssoType: ssoTypeInfo.ssoType,
								statuscode: data.http_statuscode || 'n/a', errorinfo: data.http_errorreason || 'no details available' // jshint ignore:line
							};
							setResultMessage('platform.sso.ssoErrorTemplate', errorInfo);

						}
						else{	
							platformContextService.setCustomSsoToLocalStorage();
						}
					}, function (data) {
						$scope.dialogOptions.loading = false;
						// console.log(data);
						// {"http_statuscode":401,"http_errorreason":"Logon name validation failed. Can not login with this Logon name.","expires_in":0}
						var errorInfo = {
							ssoOwner: ssoTypeInfo.ssoOwner, ssoType: ssoTypeInfo.ssoType,
							statuscode: data.http_statuscode || 'n/a', errorinfo: data.http_errorreason || 'no details available' // jshint ignore:line
						};
						setResultMessage('platform.sso.ssoErrorTemplate', errorInfo);
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
				};

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
				});

			}]);
})();
