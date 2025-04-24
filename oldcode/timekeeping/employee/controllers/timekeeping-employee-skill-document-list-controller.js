/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee skill document entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeSkillDocumentListController', TimekeepingEmployeeSkillDocumentListController);

	TimekeepingEmployeeSkillDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService', 'timekeepingEmployeeSkillDocumentDataService'];

	function TimekeepingEmployeeSkillDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		basicsCommonUploadDownloadControllerService, timekeepingEmployeeSkillDocumentDataService) {
		platformContainerControllerService.initController($scope, moduleName, '1aefc92216ac4bd6b614aae9b54e0dbc');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope, timekeepingEmployeeSkillDocumentDataService, '1aefc92216ac4bd6b614aae9b54e0dbc');

		basicsCommonUploadDownloadControllerService.initGrid($scope, timekeepingEmployeeSkillDocumentDataService);
	}
})(angular);