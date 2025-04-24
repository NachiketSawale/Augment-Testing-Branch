/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceSidebarWatchListExtension
	 * @function
	 * @requires
	 * @description
	 * platformDataServiceSidebarWatchListExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceSidebarWatchListExtension', PlatformDataServiceSidebarWatchListExtension);

	PlatformDataServiceSidebarWatchListExtension.$inject = [];

	function PlatformDataServiceSidebarWatchListExtension() { // jshint ignore:line
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSidebarWatchListExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this; // jshint ignore:line

		this.addSidebarWatchList = function addSidebarWatchList(container, options) {
			if (options.sidebarWatchList) {
				container.service.getWatchListOptions = function () {
					return options.sidebarWatchList;
				};
			}
		};
	}
})();