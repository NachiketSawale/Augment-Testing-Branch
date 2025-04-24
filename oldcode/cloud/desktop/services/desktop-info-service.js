/**
 * Created by rolf eisenhut on 09.01.2015.
 */
/* global globals Platform */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopDesktopInfoService
 * @priority default value
 * @description
 * @example
 ...
 }
 */
(function (angular) {
	'use strict';
	angular.module('cloud.desktop').factory('cloudDesktopInfoService',
		['_', 'moment', 'platformContextService', '$translate', 'platformUserInfoService', 'platformUtilService', '$document', '$timeout', 'cloudDesktopHeaderService',
			function (_, moment, platformContextService, $translate, platformUserInfoService, platformUtilService, $document, $timeout, cloudDesktopHeaderService) {

				var appKeyToken = 'desktop-headerInfo';
				var service = {};
				var headerInfo = {}; // = platformContextService.getApplicationValue(appKeyToken);
				var applicationAlert = {};
				let certificateMessages = undefined;

				// messengers
				service.onCompanyRoleUpdated = new Platform.Messenger();
				service.onCompanyModuleInfoUpdated = new Platform.Messenger();
				service.onApplicationAlertUpdated = new Platform.Messenger();

				/*
				 define further properties for direct access
				 */
				Object.defineProperties(service, {
					'companyName': {
						get: function () {
							return headerInfo.companyName;
						},
						set: function (p) {
							headerInfo.companyName = p;
						},
						enumerable: true
					},
					'roleName': {
						get: function () {
							return headerInfo.roleName;
						},
						set: function (p) {
							headerInfo.roleName = p;
						},
						enumerable: true
					},
					'headerInfo': {
						get: function () {
							// console.log('desktop.info-service property headerInfo: Company=', headerInfo.companyName);
							return headerInfo;
						},
						enumerable: true
					},
					'ApplicationAlert': {
						get: function () {
							// console.log('desktop.info-service property headerInfo: Company=', headerInfo.companyName);
							return applicationAlert;
						},
						enumerable: true
					},
					'CertificateMessages': {
						get: function () {
							// console.log('desktop.info-service property headerInfo: Company=', headerInfo.companyName);
							return certificateMessages;
						},
						enumerable: true
					},
					'CertificateAllValid': {
						get: function () {
							// if there is no right to get the certificate info, certificateMessages not supplied
							return !!(_.isNil(certificateMessages) || (certificateMessages && certificateMessages.allCertificatesValid === true));
						},
						enumerable: true
					}
				});

				/*
				 saves the current values to application context
				 */
				service.save = function () {
					platformContextService.setApplicationValue('desktop-headerInfo', headerInfo);
				};

				/*
				 updated company and role to current values and saves it to application context
				 */
				service.update = function update(companyName, roleName) {
					// console.log('desktop.info-service update start');
					service.read();
					service.companyName = companyName;
					service.roleName = roleName;
					// console.log('desktop.info-service update headerInfo: Company=', headerInfo.companyName);
					service.save();
					// console.log('cloudDesktopInfoService fires (headerInfo)');
					service.onCompanyRoleUpdated.fire(headerInfo);
				};

				/**
				 * this function updates the moduleinfo into the headerInfo
				 *
				 * @param {string} [moduleText]
				 * @param {string} [entityText]
				 * @param {string} [hintText]
				 */
				service.updateModuleInfo = function updateModuleInfo(moduleText, entityText, hintText) {
					function getModuleInfo(entityText, hintText) {
						var info = '';

						if (entityText && entityText.length > 0) {
							info += entityText;
						}
						if (hintText && hintText.length > 0) {
							info += ' (' + hintText + ')';
						}
						return info;
					}

					service.read();
					setDocumentTitle(moduleText);

					headerInfo.title = entityText === 'desktoppage' ? $translate.instant('cloud.desktop.desktopDisplayName') : $translate.instant(moduleText);
					headerInfo.subTitle = cloudDesktopHeaderService.getModuleInfo(moduleText, entityText);

					service.save();
					// console.log('cloudDesktopInfoService fires (headerInfo)');
					service.onCompanyModuleInfoUpdated.fire(headerInfo);
				};

				function setDocumentTitle(moduleText) {
					if (moduleText) {
						$document[0].title = $translate.instant(moduleText) + ' - ' + globals.productName;
					} else {
						$document[0].title = globals.productName;
					}
				}

				/*
				 saves the current values to application context
				 */
				service.read = function () {

					var hdrInfoDefault = {
						companyName: '',
						roleName: '',
						moduleInfo: '',
						userInfo: platformUserInfoService.getCurrentUserInfo()
					};

					var ctxHdrInfo = platformContextService.getApplicationValue(appKeyToken);
					_.extend(headerInfo, !_.isNil(ctxHdrInfo) ? ctxHdrInfo : hdrInfoDefault);

					return headerInfo;
				};

				var refreshTimeoutDefer;
				var refreshinSeconds = 60;

				function scheduleReadApplicationMessages() {
					// trigger myself again...
					$timeout.cancel(refreshTimeoutDefer); // clear previous timer
					refreshTimeoutDefer = $timeout(readApplicationMessages, refreshinSeconds * 1000);
				}

				/**
				 *
				 * @param theMsg
				 */
				function formatShutDownAlertMessage(theMsg) {
					const until = moment(theMsg.validUntilUtc);
					theMsg.startAlert = until.add(-theMsg.alertBeforeSeconds, 'seconds');
					theMsg.minutestogo = until.diff(moment(), 'minutes');
					const templateFn = _.template(theMsg.content);
					// execute template function with JSON object for the interpolated values
					try {
						const untilLocal = until.format('ll') + ' ' + until.format('LTS');
						theMsg.contentParsed = templateFn({'until': untilLocal, 'minutestogo': theMsg.minutestogo});
					} catch (e) {
						theMsg.contentParsed = '';
					}
					// check time range
					return theMsg;
				}

				/* var x = {
					"messageType": "System.Application.ShutDownMsg",
					"content": "Attention! System will rebooted at <%= until %>! Logoff will be forced!!",
					"validFromUtc": "2020-05-07T09:00:00Z",
					"validUntilUtc": "2020-05-07T10:31:00Z",
					"alertBeforeSeconds": 0,
					"isActive": false,
					"forceLogoff": true
				}; */

				function readApplicationMessages() {
					// console.log('readApplicationMessages called');
					if (platformContextService.isLoggedIn) {
						// console.log('readApplicationMessages enabled');
						platformUtilService.getAllMessages().then(
							function ok(allMsg) {
								const theMsg = (allMsg || {}).shutDownMsg;
								if (theMsg) {
									applicationAlert = theMsg;
									applicationAlert.refreshinSeconds = refreshinSeconds;
									if (theMsg.isActive) {
										formatShutDownAlertMessage(theMsg);
									} else {
										theMsg.contentParsed = undefined;
									}
								}

								/* structure of allMsg.certificateMsg
									{
									        "messageType": "System.Configuration.CertificateMsg",
									        "allCertificatesValid": false,
									        "idSrv": {
									            "friendlyName": "iTWO4.0 IdentityServer Certificate RIB Software GmbH 2022",
									            "thumbPrint": "B1E9A6DB4FEA2DBC4BDA4C1C1635030690204135",
									            "validUntilUtc": "2025-04-09T10:34:17+02:00",
									            "remainingDaysValid": 1000,
									            "isValid": true
									        },
									        "webSrv": {... },
									        "idSrvSsl": {... }
									    }
								*/
								certificateMessages = (allMsg || {}).certificateMsg; // if not supplied value is undefined
								service.onApplicationAlertUpdated.fire(applicationAlert);
								// check message Alert times
								scheduleReadApplicationMessages();
							},
							function failed(/* reason */) {
								applicationAlert = {};
								service.onApplicationAlertUpdated.fire(applicationAlert);
								// check message Alert times
								scheduleReadApplicationMessages();
							}
						);
					} else {
						// console.log('readApplicationMessages not enabled, because not already logged in');
						scheduleReadApplicationMessages();
					}
				}

				/**
				 * @jsdoc scheduleReadApplicationMessages
				 * @param initialRead
				 */
				service.scheduleReadApplicationMessages = function (initialRead = true) {
					// console.log('scheduleReadApplicationMessages started refresh: ' + refreshinSeconds * 1000);
					if (initialRead) {
						readApplicationMessages();
					}
					scheduleReadApplicationMessages();
				};

				/**
				 * @param theMsg
				 * @returns {*}
				 */
				service.formatShutDownAlertMessage = function (theMsg) {
					return formatShutDownAlertMessage(theMsg);
				};

				service.read();
				return service;

			}]);
})(angular);

