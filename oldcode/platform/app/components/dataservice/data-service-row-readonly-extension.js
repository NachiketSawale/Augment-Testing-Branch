/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceRowReadonlyExtension
	 * @function
	 * @description
	 * platformDataServiceRowReadonlyExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceRowReadonlyExtension', PlatformDataServiceRowReadonlyExtension);

	// PlatformDataServiceSelectionExtension.$inject = ['dependencies'];//No dependency yet

	function PlatformDataServiceRowReadonlyExtension() {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceRowReadonlyExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		// var self = this;

		this.addRowReadonly = function addRowReadonly(container) {
			container.data.registerAndCreateEventMessenger('setReadOnlyRow');

			container.service.setReadOnlyRow = function setReadOnlyRow(row) {
				container.data.setReadOnlyRow.fire(row);
			};
		};
	}
})();