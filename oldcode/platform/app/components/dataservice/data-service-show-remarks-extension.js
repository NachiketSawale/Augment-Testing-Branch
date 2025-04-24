/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc self
	 * @name platformDataServiceShowRemarksExtension
	 * @function
	 *
	 * @description
	 * The platformDataServiceShowRemarksExtension provides translation functionality for data services
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformDataServiceShowRemarksExtension', PlatformDataServiceShowRemarksExtension);

	PlatformDataServiceShowRemarksExtension.$inject = ['platformLongTextRegisterService', '_'];

	function PlatformDataServiceShowRemarksExtension(platformLongTextRegisterService, _) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addRemarkPresenter = function addRemarkPresenter(container, options) {
			if (options.longText) {
				container.data.longText = options.longText;

				container.data.showRemarks = function showRemarks(data) {
					self.showRemarks(data.selectedItem, data, container.service);
				};

				container.service.getLongTextProperties = function getLongTextProperties() {
					return container.data.longText.longTextProperties;
				};

				container.service.getRelatedGridId = function getRelatedGridId() {
					return container.data.longText.relatedGridId;
				};

				container.service.getRelatedContainerTitle = function getRelatedContainerTitle() {
					return container.data.longText.relatedContainerTitle;
				};

				container.service.getDocumentationItem = function getDocumentationItem(item) {
					return item;
				};
			}
		};

		this.showRemarks = function showRemarks(entity, data, service) {
			if (data.longText && entity && !_.isEmpty(data.longText.longTextProperties)) {
				platformLongTextRegisterService.setRemarkEntity(service.getDocumentationItem(entity), service);
			}
		};
	}
})(angular);