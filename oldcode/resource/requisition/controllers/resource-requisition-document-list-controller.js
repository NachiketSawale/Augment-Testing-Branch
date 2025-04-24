/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.requisition';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of document entities.
	 **/
	angModule.controller('resourceRequisitionDocumentListController', ResourceRequisitionDocumentListController);

	ResourceRequisitionDocumentListController.$inject = ['$scope','platformContainerControllerService', 'resourceRequisitionDocumentDataService', 'basicsCommonUploadDownloadControllerService','basicsCommonDocumentUploadFilesControllerService'];

	function ResourceRequisitionDocumentListController($scope, platformContainerControllerService, resourceRequisitionDocumentDataService, basicsCommonUploadDownloadControllerService, basicsCommonDocumentUploadFilesControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '90b997b3f0c64f97ac4cecd53f961086');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,resourceRequisitionDocumentDataService,'90b997b3f0c64f97ac4cecd53f961086');

		basicsCommonUploadDownloadControllerService.initGrid($scope, resourceRequisitionDocumentDataService);
	}
})();