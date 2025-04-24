/**
 * Created by zwz on 4/13/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'resource.master';

	angular.module(moduleName).factory('resourceMasterContextService', resourceMasterContextService);

	resourceMasterContextService.$inject = ['$timeout', 'PlatformMessenger'];

	function resourceMasterContextService($timeout, PlatformMessenger) {
		var service = {};
		var moduleContext = {};
		var timeout = {};

		service.moduleStatusKey = 'res.current.resource.pools.status';
		service.moduleReadOnlyKey = 'res.current.readOnly';

		/**
		 * @ngdoc event
		 * @name applicationValueChanged
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description Messenger that fires events when an application values has been changed
		 */
		service.moduleValueChanged = new PlatformMessenger();
		/**
		 * @ngdoc function
		 * @name setModuleValue
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description sets an module defined value
		 * @param key {string} key name of property to be inserted or updated
		 * @param {*} value module defined data
		 */
		service.setModuleValue = function setModuleValue(key, value) {
			if (angular.isString(key)) {
				if (angular.isUndefined(value)) {
					value = null;
				}

				if (timeout[key]) {
					$timeout.cancel(timeout[key]);
				}

				if (!moduleContext[key] || moduleContext[key].val !== value) {
					moduleContext[key] = {val: value};
					service.moduleValueChanged.fire(key);
				}
			}
		};
		/**
		 * @ngdoc function
		 * @name getApplicationValue
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description gets an module defined value
		 * @param key {string} name of property to retrieve
		 * @returns {*} value of key or null
		 */
		service.getModuleValue = function getModuleValue(key) {
			if (angular.isString(key) && moduleContext.hasOwnProperty(key)) {
				return moduleContext[key].val;
			}
			return null;
		};
		/**
		 * @ngdoc function
		 * @name removeModuleValue
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description removes an module defined value
		 * @param key {string} name of property to retrieve
		 * @returns {*} true if there was an item , false if not found
		 */
		service.removeModuleValue = function removeModuleValue(key) {
			if (angular.isString(key) && moduleContext.hasOwnProperty(key)) {
				if (!timeout[key]) {
					timeout[key] = $timeout(function () {
						delete moduleContext[key];
						timeout[key] = null;
					}, 1000);
				}

				return true;
			}
			return false;
		};

		/**
		 * @ngdoc function
		 * @name setModuleStatus
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description set module status in current module
		 */
		service.setModuleStatus = function setModuleStatus(readOnly) {
			service.setModuleValue(service.moduleStatusKey, readOnly);
		};
		/**
		 * @ngdoc function
		 * @name setModuleReadOnly
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description get module status in current module
		 */
		service.getModuleStatus = function getModuleStatus() {
			return service.getModuleValue(service.moduleStatusKey);
		};

		/**
		 * @ngdoc function
		 * @name setModuleReadOnly
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description set readonly status in current module
		 */
		service.setModuleReadOnly = function setModuleReadOnly(readOnly) {
			service.setModuleValue(service.moduleReadOnlyKey, readOnly);
		};
		/**
		 * @ngdoc function
		 * @name setModuleReadOnly
		 * @function
		 * @methodOf resourceMaster:resourceMasterContextService
		 * @description get readonly status in current module
		 */
		service.getModuleReadOnly = function getModuleReadOnly() {
			return service.getModuleValue(service.moduleReadOnlyKey);
		};

		//define properties
		Object.defineProperties(service, {
			'isReadOnly': {
				get: function () {
					var moduleStatus = service.getModuleValue(service.moduleStatusKey) || {};
					return moduleStatus.Isreadonly || moduleStatus.IsReadonly || service.getModuleReadOnly();
				},
				enumerable: true
			}
		});

		return service;
	}
})(angular);
