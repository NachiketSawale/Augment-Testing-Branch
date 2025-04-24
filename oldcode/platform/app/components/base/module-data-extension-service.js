/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformModuleDataExtensionService
	 * @function
	 * @description
	 * platformModuleDataExtensionService is only for data extensions available in all module which need to update data
	 * in a special way.
	 * At the moment the extension is only intended to support characteristics and userform module.
	 * DO NOT USE FOR COMMUNICATION BETWEEN DATASERVICES BELONGING TO THE SAME MODULE!!
	 */
	angular.module('platform').service('platformModuleDataExtensionService', PlatformModuleDataExtensionService);

	function PlatformModuleDataExtensionService() {
		/**
		 * @ngdoc function
		 * @name fireUpdateDataExtensionEvent
		 * @function
		 * @methodOf platform.platformModuleDataExtensionService
		 * @description fire event that the entire module data needs to be stored. Is triggered by root item extension.
		 */
		this.initializeRootUpdateDataExtensionEvent = function initializeRootUpdateDataExtensionEvent(data) {
			data.updateDataExtensionEvent = new Platform.Messenger();
		};

		/**
		 * @ngdoc function
		 * @name fireUpdateDataExtensionEvent
		 * @function
		 * @methodOf platform.platformModuleDataExtensionService
		 * @description fire event that the entire module data needs to be stored. Is triggered by root item extension.
		 */
		this.fireUpdateDataExtensionEvent = function fireUpdateDataExtensionEvent(updateData, data) {
			data.updateDataExtensionEvent.fire(updateData);
		};

		/**
		 * @ngdoc function
		 * @name registerUpdateDataExtensionEvent
		 * @function
		 * @methodOf platform.platformModuleDataExtensionService
		 * @description register with callback to updateDataExtensionEvent
		 */
		this.registerUpdateDataExtensionEvent = function registerUpdateDataExtensionEvent(callBackFunc, data) {
			data.updateDataExtensionEvent.register(callBackFunc);
		};

		/**
		 * @ngdoc function
		 * @name registerUpdateDataExtensionEvent
		 * @function
		 * @methodOf platform.platformModuleDataExtensionService
		 * @description removes callback from registration to updateDataExtensionEvent
		 */
		this.unregisterUpdateDataExtensionEvent = function unregisterUpdateDataExtensionEvent(callBackFunc, data) {
			data.updateDataExtensionEvent.unregister(callBackFunc);
		};
	}
})();