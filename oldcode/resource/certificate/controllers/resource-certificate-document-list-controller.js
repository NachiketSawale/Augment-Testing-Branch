/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource certificate document entities.
	 **/

	angular.module(moduleName).controller('resourceCertificateDocumentListController', ResourceCertificateDocumentListController);

	ResourceCertificateDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'resourceCertificateDocumentDataService',
	'basicsCommonDocumentUploadFilesControllerService'];

	function ResourceCertificateDocumentListController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, resourceCertificateDocumentDataService,
		basicsCommonDocumentUploadFilesControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3b4a2a670db2438da5deb4b9782547b5');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,resourceCertificateDocumentDataService,'3b4a2a670db2438da5deb4b9782547b5');

		basicsCommonUploadDownloadControllerService.initGrid($scope, resourceCertificateDocumentDataService);
	}
})(angular);