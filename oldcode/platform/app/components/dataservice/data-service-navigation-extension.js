/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceNavigationExtension
	 * @function
	 * @requires platformDataServiceSelectionExtension
	 * @description
	 * platformDataServiceNavigationExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceNavigationExtension', PlatformDataServiceNavigationExtension);

	PlatformDataServiceNavigationExtension.$inject = ['_', 'platformDataServiceSelectionExtension'];

	function PlatformDataServiceNavigationExtension(_, platformDataServiceSelectionExtension) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceNavigationExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addEntityNavigation = function addEntityNavigation(container) {// jshint ignore:line
			container.service.goToFirst = function goToFirstSubItem() {
				self.goToFirst(container.data);
			};

			container.service.goToPrev = function goToPrevSubItem() {
				self.goToPrev(container.data);
			};

			container.service.goToNext = function goToNextSubItem() {
				self.goToNext(container.data);
			};

			container.service.goToLast = function goToLastSubItem() {
				self.goToLast(container.data);
			};
		};

		this.goToFirst = function goToFirst(data) {
			if (data.itemList.length > 0) {
				platformDataServiceSelectionExtension.doSelect(data.itemList[0], data);
			}
		};

		this.goToPrev = function goToPrev(data) {
			if (_.isNull(data.selectedItem) || _.isUndefined(data.selectedItem)) {
				self.goToLast(data);// Nothing selected -> start at the end
			} else {
				var index = data.itemList.indexOf(data.selectedItem);
				--index;

				if (index >= 0) {
					platformDataServiceSelectionExtension.doSelect(data.itemList[index], data);
				}
			}
		};

		this.goToNext = function goToNext(data) {
			if (_.isNull(data.selectedItem) || _.isUndefined(data.selectedItem)) {
				self.goToFirst(data);// Nothing selected -> start at the begin
			} else {
				var index = data.itemList.indexOf(data.selectedItem);
				++index;

				if (index < data.itemList.length) {
					platformDataServiceSelectionExtension.doSelect(data.itemList[index], data);
				}
			}
		};

		this.goToLast = function goToLast(data) {
			if (data.itemList.length > 0) {
				platformDataServiceSelectionExtension.doSelect(data.itemList[data.itemList.length - 1], data);
			}
		};
	}
})();