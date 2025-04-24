/*
 * $Id: Created by joshi on 16.09.2015. $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceItemCellFocusExtension
	 * @function
	 * @description
	 * platformDataServiceItemCellFocusExtension adds cell focus behaviour to data services created from the data service factory
	 */

	angular.module('platform').service('platformDataServiceItemCellFocusExtension', PlatformDataServiceItemCellFocusExtension);

	// PlatformDataServiceItemCellFocusExtension.$inject = ['dependencies'];//No dependency yet

	function PlatformDataServiceItemCellFocusExtension() {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceItemCellFocusExtension
		 * @description adds scell focus behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */

		this.addItemCellFocus = function addItemCellFocus(container, options) {
			if (options.setCellFocus) {
				container.data.registerAndCreateEventMessenger('setCellFocus');

				container.service.setCellFocus = function setCellFocus(options) {
					container.data.setCellFocus.fire(options);
				};
			}
		};
	}
})(angular);

