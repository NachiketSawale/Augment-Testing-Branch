/**
 * Created by Sudarshan on 27.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertificateEmployeeDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping certificate document entities.
	 **/

	angular.module(moduleName).controller('timekeepingCertificateEmployeeDocumentListController', TimekeepingCertificateEmployeeDocumentListController);

	TimekeepingCertificateEmployeeDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'timekeepingCertificateDocumentDataService',
		'basicsCommonDocumentUploadFilesControllerService'];

	function TimekeepingCertificateEmployeeDocumentListController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, timekeepingCertificateDocumentDataService,
		basicsCommonDocumentUploadFilesControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a68ac5da946948r1abaa204629a91048');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope, timekeepingCertificateDocumentDataService,'a68ac5da946948r1abaa204629a91048');

		basicsCommonUploadDownloadControllerService.initGrid($scope, timekeepingCertificateDocumentDataService);
	}
})(angular);