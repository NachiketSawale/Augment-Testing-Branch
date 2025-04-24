/**
 * Created by ysl on 12/13/2017.
 */
(function () {
	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImportContentService
	 * @function
	 *
	 * @description
	 * basicsCompanyImportContentService is the data service for all import content settings celection result data.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCompanyImportContentService', ['_', '$window', '$http', '$q', '$timeout', '$translate', 'globals', 'basicsCompanyMainService',
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'PlatformMessenger',
		function (_, $window, $http, $q, $timeout, $translate, globals, basicsCompanyMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, PlatformMessenger) {
			var service = {};

			service.onBasicSettingsFinishedEvent = new PlatformMessenger();
			service.onContentSelectionFinishedEvent = new PlatformMessenger();

			service.onBasicSettingsFinished = function () {
				service.onBasicSettingsFinishedEvent.fire();
			};
			service.onContentSelectionFinished = function () {
				service.onContentSelectionFinishedEvent.fire();
			};

			service.allSettings = {};

			service.setBasicSettings = function (value) {
				if (value.internalImport === true) {
					value.accessToken = $http.defaults.headers.common.Authorization;
					var authNToken = $window.localStorage.getItem(globals.webApiBaseUrl + 'tt:authentication:authNToken');
					if (authNToken) {
						value.refreshToken =JSON.parse(authNToken)['refresh_token'];
						value.clientId = JSON.parse(authNToken)['clientId'];
					}
				}
				service.allSettings.basicSettings = value;
			};

			service.setContentSettings = function (value) {
				service.allSettings.contentSettings = value;
			};

			service.doBasicSettingReady = function () {
				var deferred = $q.defer();
				if (_.isEmpty(service.allSettings.basicSettings.contentServerURL)) {
					deferred.resolve({
						result: false,
						description: $translate.instant('basics.company.importContent.contentServerEmpty')
					});
				} else if (_.isEmpty(service.allSettings.basicSettings.userName)) {
					deferred.resolve({
						result: false,
						description: $translate.instant('basics.company.importContent.userNameEmpty')
					});
				} else if (service.allSettings.basicSettings.internalImport === false && _.isEmpty(service.allSettings.basicSettings.password)) {
					deferred.resolve({
						result: false,
						description: $translate.instant('basics.company.importContent.passwordEmpty')
					});
				} else {
					$http.post(globals.webApiBaseUrl + 'basics/company/importcontent/savecontentsettings', service.allSettings.basicSettings).then(function (response) {
						if (response.data === false) {
							deferred.resolve({
								result: false,
								description: $translate.instant('basics.company.importContent.failedSaved')
							});
							return;
						}

						if (service.allSettings.basicSettings.internalImport === true) {
							deferred.resolve({
								result: true,
								description: $translate.instant('basics.company.importContent.loginSuccessed')
							});
						} else {
							var validateUrl = globals.webApiBaseUrl + 'basics/company/importcontent/validateuser';
							var requestData = {
								Url: service.allSettings.basicSettings.contentServerURL,
								UserName: service.allSettings.basicSettings.userName,
								Password: service.allSettings.basicSettings.password
							};
							$http.post(validateUrl, requestData).then(function (response) {
								if (response.data && response.data.Success === true) {
									deferred.resolve({
										result: true,
										description: $translate.instant('basics.company.importContent.loginSuccessed')
									});
								} else {
									var errorMessage = $translate.instant('basics.company.importContent.loginFailed');
									if (response.data && response.data.ErrorMessage) {
										errorMessage = response.data.ErrorMessage;
										try { // try get really error message
											var temp = JSON.parse(errorMessage);
											if (temp.ErrorMessage) {
												errorMessage = temp.ErrorMessage;
											}
										} catch (e) {
											_.noop(e);
										}
										if (errorMessage.indexOf('url_not_found') !== -1) {
											errorMessage = $translate.instant('basics.company.importContent.urlNotFound');
										}
										if (errorMessage.indexOf('invalid_grant') !== -1) {
											errorMessage = $translate.instant('basics.company.importContent.userOrPwdError');
										}
										console.log(errorMessage);
									}
									deferred.resolve({
										result: false,
										description: errorMessage
									});
								}
							}).catch(function (error) {
								_.noop(error);
								deferred.resolve({
									result: false,
									description: $translate.instant('basics.company.importContent.loginFailed')
								});
							});
						}


					});
				}

				return deferred.promise;
			};

			service.doContentSettingReady = function (isNext) {
				var deferred = $q.defer();
				var selections = service.allSettings.contentSettings.itemSelections;
				if (_.isNil(selections)) {
					deferred.resolve({
						result: false,
						description: $translate.instant('basics.company.importContent.noItemSelected')
					});
				} else if (isNext && _.isEmpty(service.allSettings.contentSettings.sourceCompanyCode)) {
					deferred.resolve({
						result: false,
						description: $translate.instant('basics.company.importContent.sourceCompanyEmpty')
					});
				} else {
					$http.post(globals.webApiBaseUrl + 'basics/company/importcontent/savecontentselections', service.allSettings.contentSettings).then(function (response) {
						if (response.data === true) {
							deferred.resolve({
								result: true,
								description: $translate.instant('basics.company.importContent.successSaved')
							});
						} else {
							deferred.resolve({
								result: false,
								description: $translate.instant('basics.company.importContent.failedSaved')
							});
						}
					});
				}
				return deferred.promise;
			};

			service.startTasks = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/company/importcontent/starttasks');
			};

			service.abort = function (importJobId) {
				return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/abortjob?importJobId=' + importJobId);
			};

			service.getWaitingOrInProgressJob = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/getwaitingorinprogressjob');
			};

			return service;
		}]);
})(angular);
