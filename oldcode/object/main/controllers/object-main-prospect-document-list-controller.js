(function (angular) {
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('objectMainProspectDocumentListController', ObjectMainProspectDocumentListController);

	ObjectMainProspectDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService', 'objectMainProspectDocService'];

	function ObjectMainProspectDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		basicsCommonUploadDownloadControllerService, objectMainProspectDocService) {
		platformContainerControllerService.initController($scope, moduleName, '2bdfd213a302401c88fbff8bc80df3c5');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,objectMainProspectDocService,'2bdfd213a302401c88fbff8bc80df3c5');

		basicsCommonUploadDownloadControllerService.initGrid($scope, objectMainProspectDocService);
	}
})(angular);