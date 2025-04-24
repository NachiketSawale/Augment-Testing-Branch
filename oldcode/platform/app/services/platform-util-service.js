/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @jsdoc service
	 * @name platform:platformUserInfoService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformPermissionService provides support for loading and checking access right
	 */
	angular.module('platform').factory('platformUtilService', platformUtilService);
	platformUtilService.$inject = ['globals', '$q','$sce', '_', '$http', '$templateCache','$injector'];

	function platformUtilService(globals, $q, $sce, _, $http, $templateCache,$injector) {

		let platformContextService=undefined;

		/**
		 * The function loads templates into the templatecache
		 * @param templatesArray
		 * @param isLoadedOption
		 * @returns {*} promise
		 */
		function loadTemplates(templatesArray, isLoadedOption) {

			if ((_.isObject(isLoadedOption) && isLoadedOption.isLoaded) || !_.isArray(templatesArray)) {
				return $q.when(0);
			}

			let promises = [];
			_.forEach(templatesArray, function (template) {
				promises.push($templateCache.loadTemplateFile(template));
			});

			return $q.all(promises)
				.then(function () {
					if (_.isObject(isLoadedOption)) {
						isLoadedOption.isLoaded = true;
					}
				});
		}

		/**
		 * This method returns the About Dialog Database Info
		 * @returns {Promise|*}
		 */
		function getSystemInfo() {
			const systemInfoBaseUrl = globals.webApiBaseUrl + 'services/platform/';

			return $http.get(systemInfoBaseUrl + 'getsysteminfo')
				.then(function success(response) {
					return response.data;
				}, function failed(response) {
					return response.data;
				});
		}

		/*
		returns the ShutdownMessage if the is one
		 */
		function getShutdownMessage() {

			return getApplicationMessages().then(function ok(messages) {
				if (messages) {
					return _.find(messages, {'messageType': 'System.Application.ShutDownMsg'});
				}
				return null;
			});
		}

		/*
returns the ShutdownMessage & Certificate Messages if the is one(s)
 */
		function getAllMessages(includeCertDetails = false) {

			return getApplicationMessages(includeCertDetails).then(function ok(messages) {
				if (messages) {
					let shutdownMsg= _.find(messages, {'messageType': 'System.Application.ShutDownMsg'});
					let certificateMsgs= _.find(messages, {'messageType': 'System.Configuration.CertificateMsg'});
				return {'shutDownMsg': shutdownMsg, 'certificateMsg': certificateMsgs};
				}
				return null;
			});
		}

		function CheckValidSecureRoleContext() {

			if (_.isNil(platformContextService)) {
				platformContextService = $injector.get('platformContextService');
			}
			return platformContextService.isSecureClientRolePresent;
		}

		/**
		 * This method returns application message if available
		 * @returns {Promise|*}
		 */
		function getApplicationMessages( includeCertDetails = false) {
			if (CheckValidSecureRoleContext()) {
				const systemInfoBaseUrl = globals.webApiBaseUrl + 'infrastructure/message/';
				const msgList = {
					includeCertDetails: includeCertDetails,
					msgList: ['System.Application.ShutDownMsg', 'System.Configuration.CertificateMsg']
				}; // read shutdown Message
				return $http.post(systemInfoBaseUrl + 'readmessages', msgList, {headers: {errorDialog: false}}).then(function success(response) {
					return response.data;
				}, function failed(response) {
					return response.data;
				});
			}
			return $q.resolve(null);  // rei@21.7.22 return null in case of SecureClientRole isn't there.
		}

		/**
		 * This method returns application message if available
		 * @returns {Promise|*}
		 */
		function setApplicationMessages(theMessage) {
			const systemInfoBaseUrl = globals.webApiBaseUrl + 'infrastructure/message/';
			// var msgList = {msgList: ['System.Application.ShutDownMsg']}; // read shutdown Message
			return $http.post(systemInfoBaseUrl + 'setmsg', theMessage)
				.then(function success(response) {
					return response.data;
				}, function failed(response) {
					// rei@16.7.2020 redirect because of maintmode... navigate to it
					const isMaintPage = (response.data || '').includes('maintenanceroot');
					if (response.status === 405 && isMaintPage) {  // rei@16.7.2020 redirect because of maintmode... navigate to it
						console.log(response);
						window.location.href = globals.clientUrl;
					}
					return response.data;
				});
		}

		/**
		 * @ngdoc function
		 * @name getDebouncedFn
		 * @function
		 * @methodOf platformUtilService
		 * @description Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.
		 * @param { function } fn The function to be executed debounced.
		 * @param { number } timeout The number of milliseconds to delay.
		 * @param { object } options The options object.
		 * @returns { function } Returns the new debounced function.
		 * @example
		 * let saveDebounced = service.getDebouncedFn(() => {
				console.log('save');
			}, 2000);


		 */
		function getDebouncedFn(fn, timeout = 1000, options = {}) {
			let timer;
			let func;

			if (options.leading) {
				func = (...args) => {
					if (!timer) {
						fn.apply(this, args);
					}
					clearTimeout(timer);
					timer = setTimeout(() => {
						timer = undefined;
					}, timeout);
				};
			} else {
				func = (...args) => {
					clearTimeout(timer);
					timer = setTimeout(() => {
						fn.apply(this, args);
					}, timeout);
				};
			}

			func.cancel = () => {
				clearTimeout(timer);
			};
			return func;
		}

		/**
		 *
		 * @param object
		 *             object to be sanitized, we check if object is a string, then we sanitize it.
		 * @param debug
		 * @returns {result|*}
		 */
		function getSanitized(object, debug = false) {
			if (!(_.isString(object) && object.length !== 0)) {
				return object;
			}
			const ori = object;
			const result = $sce.getTrustedHtml(object);
			if (debug && ori !== result) {
				console.log('getSanitized(object) sanitized', ori, ' >>> ', result);
			}
			return result;
		}

		return {
			getDebouncedFn: getDebouncedFn,
			loadTemplates: loadTemplates,
			getSystemInfo: getSystemInfo,
			getApplicationMessages: getApplicationMessages,
			setApplicationMessages: setApplicationMessages,
			//getShutdownMessage: getShutdownMessage,
			checkValidSecureRoleContext: CheckValidSecureRoleContext,  // rei21.7.22 added
			getAllMessages: getAllMessages,
			getSanitized: getSanitized
		};
	}
})
();
