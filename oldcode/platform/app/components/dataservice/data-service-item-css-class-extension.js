/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceItemCssClassExtension
	 * @function
	 * @description
	 * platformDataServiceItemCssClassExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceItemCssClassExtension', PlatformDataServiceItemCssClassExtension);

	// PlatformDataServiceSelectionExtension.$inject = ['dependencies'];//No dependency yet

	function PlatformDataServiceItemCssClassExtension() {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceItemCssClassExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		// var self = this;

		this.addItemCssClass = function addItemCssClass(container) {
			container.data.registerAndCreateEventMessenger('addItemCssClass');

			container.service.addItemCssClass = function addItemCssClass(rows, cssClass) {
				container.data.addItemCssClass.fire(rows, cssClass);
			};
		};
	}
})();