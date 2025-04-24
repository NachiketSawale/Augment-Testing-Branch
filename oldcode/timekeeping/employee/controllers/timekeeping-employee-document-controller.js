/**
 * Created by Sudarshan on 13.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDocumentController
	 * @function
	 *
	 * @description
	 * Controller for the list view of employee documents entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeDocumentController', TimekeepingEmployeeDocumentController);

	TimekeepingEmployeeDocumentController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'timekeepingEmployeeDocumentDataService',
		'basicsCommonDocumentUploadFilesControllerService'];

	function TimekeepingEmployeeDocumentController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, timekeepingEmployeeDocumentDataService,
		basicsCommonDocumentUploadFilesControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e36248434a2c47219b813546e5bcd8bd');
		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope, timekeepingEmployeeDocumentDataService, 'e36248434a2c47219b813546e5bcd8bd');
		basicsCommonUploadDownloadControllerService.initGrid($scope, timekeepingEmployeeDocumentDataService);
	}
})(angular);

