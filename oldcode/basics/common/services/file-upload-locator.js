(function (angular) {
	'use strict';
	/**
	 * @ngdoc service

	 * @name basicsCommonFileUploadServiceLocator
	 * @function
	 * @requireds
	 *
	 * @description a service locator for register, unregister and get file upload service which is created by basicsCommonFileUploadServiceLocator.
	 */
	angular.module('basics.common').factory('basicsCommonFileUploadServiceLocator', [
		function () {
			const locator = {};
			const data = {};

			function hasKey(key) {
				return !!data[key];
			}

			/**
			 * @ngdoc function
			 * @name registerService
			 * @function
			 *
			 * @methodOf basicsCommonFileUploadServiceLocator
			 * @description register file upload service.
			 * @param {string} key - key for service.
			 * @param {object} value - file upload service.
			 */
			locator.registerService = function registerService(key, value) {
				if (!key) {
					return;
				}
				key = key.toLowerCase();
				if (!hasKey(key)) {
					data[key] = value;
				}
			};

			/**
			 * @ngdoc function
			 * @name getService
			 * @function
			 *
			 * @methodOf basicsCommonFileUploadServiceLocator
			 * @description get file upload service.
			 * @param {string} key for service.
			 * @returns {object} the file upload status.
			 */
			locator.getService = function getService(key) {
				if (!key) {
					return null;
				}
				key = key.toLowerCase();
				return hasKey(key) ? data[key] : null;
			};

			/**
			 * @ngdoc function
			 * @name unregisterService
			 * @function
			 *
			 * @methodOf basicsCommonFileUploadServiceLocator
			 * @description unregister file upload service.
			 * @param {string} key for service.
			 */
			locator.unregisterService = function unregisterService(key) {
				if (!key) {
					return;
				}
				key = key.toLowerCase();
				if (hasKey(key)) {
					data[key] = null;
					delete data[key];
				}
			};

			return locator;
		}
	]);
})(angular);