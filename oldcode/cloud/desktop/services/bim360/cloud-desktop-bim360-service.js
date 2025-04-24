/**
 * Created by hzh on 5/20/2020.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDeskBim360Service',
		['_', '$http', '$interval', '$q', 'platformTranslateService', 'platformModalFormConfigService',
			'platformModalService', 'moment',
			function (_, $http, $interval, $q, platformTranslateService, platformModalFormConfigService,
				platformModalService, moment) {
				var service = {};
				var strBim360Auth = 'bim360Auth';

				// tokenLegged : 0 : two-legged, 1 : three-legged
				service.setSessionAuth = function (tokenInfo) {
					var cacheToken = window.sessionStorage.getItem(strBim360Auth);
					var jsonToken = cacheToken === null ? {} : JSON.parse(cacheToken);
					var tokenLegged = tokenInfo.tokenLegged;
					if (tokenLegged) {
						jsonToken.threeLeggedAuth = tokenInfo;
					} else {
						jsonToken.twoLeggedAuth = tokenInfo;
					}
					window.sessionStorage.setItem(strBim360Auth, JSON.stringify(jsonToken));
				};

				// tokenLeg : 0 : two-legged, 1 : three-legged
				service.getSessionAuth = function (tokenLeg) {
					var cacheToken = window.sessionStorage.getItem(strBim360Auth);
					if (!cacheToken) {
						return undefined;
					}
					var jsonToken = JSON.parse(cacheToken);
					return tokenLeg === 0 ? jsonToken.twoLeggedAuth : jsonToken.threeLeggedAuth;
				};

				service.showDialog = function (modalCreateProjectConfig) {
					platformTranslateService.translateFormConfig(modalCreateProjectConfig.formConfiguration);

					platformModalFormConfigService.showDialog(modalCreateProjectConfig);
				};

				function isJson(str) {
					str = typeof str !== 'string' ? JSON.stringify(str) : str;
					try {
						str = JSON.parse(str);
					} catch (e) {
						return false;
					}
					return (typeof str === 'object' && str !== null);
				}

				// icon : info : 'ico-info', warning : 'ico-warning',  error : 'ico-error'
				service.showMsgDialog = function (title, msg, icon) {
					var info = msg;
					if (isJson(info)) {
						var json = JSON.parse(info);
						if (json.developerMessage) {
							info = json.developerMessage;
						}
					}

					platformModalService.showDialog({
						headerTextKey: title,
						bodyTextKey: info,
						iconClass: icon
					});
				};

				service.tokenIsExpired = function tokenIsExpired(tokenInfo) {
					var isExpired = tokenInfo === undefined;
					if (!isExpired) {
						var curUTC = moment.utc(Date.now());
						var tokenUTC = moment.utc(tokenInfo.getTokenTime);
						var expire = tokenInfo.expires_in;
						if ((curUTC - tokenUTC) / 1000 > expire - 1200) {
							isExpired = true;
						}
					}
					return isExpired;
				};

				service.getToken = function getToken() {
					var code = window.localStorage.getItem('bim360AuthCode');
					var deffer = $q.defer();
					var tokenInfo = {
						authCode: code,
						tokenLegged: 1
					};
					$http.post(globals.webApiBaseUrl + 'basics/common/bim360/getToken', tokenInfo)
						.then(function (response) {
							deffer.resolve(response.data);
						});

					return deffer.promise;
				};

				service.getAuthCode = function getAuthCode(callBackFn, param1, param2) {
					var defer = $q.defer();

					$http.post(globals.webApiBaseUrl + 'basics/common/bim360/init').then(function (response) {
						var preAuthCode = window.localStorage.getItem('bim360AuthCode');
						/**
						 * adding winLeft and winTop to account for dual monitor
						 * using screenLeft and screenTop for IE8 and earlier
						 */
						var winLeft = window.screenLeft ? window.screenLeft : window.screenX;
						var winTop = window.screenTop ? window.screenTop : window.screenY;
						/**
						 * window.innerWidth displays browser window's height and width excluding toolbars
						 * using document.documentElement.clientWidth for IE8 and earlier
						 */
						var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
						var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
						var popUpWidth = 400;
						var popUpHeight = 600;
						var left = ((width / 2) - (popUpWidth / 2)) + winLeft;
						var top = ((height / 2) - (popUpHeight / 2)) + winTop;

						var popupWindow = window.open(response.data, '', 'width=' + popUpWidth + ', height=' + popUpHeight + ', top=' + top + ', left=' + left);

						if (popupWindow.focus) {
							popupWindow.focus();
						}

						var judgeAuth = $interval(function () {
							var isClosed = false;
							if (popupWindow.closed) {
								$interval.cancel(judgeAuth);
								isClosed = true;
							}
							var aftAuthCode = window.localStorage.getItem('bim360AuthCode');
							if (aftAuthCode !== preAuthCode) {
								service.getToken().then(function (response) {
									service.setSessionAuth(response.TokenInfo);
									if (callBackFn) {
										var result = callBackFn(param1, param2);
										if (result && result.then && angular.isFunction(result.then)) {
											result.then(function (response) {
												defer.resolve(response);
											});
										} else {
											defer.resolve(result);
										}
									}
								});
							} else if (isClosed) {
								defer.resolve(null);
							}
						}, 2000);
					});

					return defer.promise;
				};

				return service;
			}]);
})(angular);
