/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceSidebarInquiryExtension
	 * @function
	 * @requires cloudDesktopSidebarService, platformDataServiceSelectionExtension
	 * @description
	 * platformDataServiceSidebarInquiryExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceSidebarInquiryExtension', PlatformDataServiceSidebarInquiryExtension);

	PlatformDataServiceSidebarInquiryExtension.$inject = ['cloudDesktopSidebarService', 'platformDataServiceSelectionExtension', 'cloudDesktopSidebarInquiryService'];

	function PlatformDataServiceSidebarInquiryExtension(sidebarService, platformDataServiceSelectionExtension, inquiryService) { // jshint ignore:line
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSidebarInquiryExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this; // jshint ignore:line

		this.addSidebarInquiry = function addSidebarInquiry(container, options) {
			if (options.sidebarInquiry) {
				container.data.sidebarInquiryOptions = options.sidebarInquiry;
				var io = container.data.sidebarInquiryOptions.options;
				container.data.sidebarInquiry = true;

				// check valid sidebar Inquiry options
				// sidebarInquiry: {options: { active: true, getSelectedItemsFn: getSelectedItems, getResultsSetFn: getResultsSet}}  // 11.Jun.2015@rei added

				if (io && io.active && inquiryService.isInquiryPending(io.modulename) && _.isFunction(io.getSelectedItemsFn) && _.isFunction(io.getResultsSetFn)) {
					inquiryService.registerProvider({
						modulename: io.moduleName,
						getSelectedItemsFn: io.getSelectedItemsFn,
						getResultsSetFn: io.getResultsSetFn
					});
				}
			}
		};
	}
})();