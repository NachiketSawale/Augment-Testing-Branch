(function (angular) {
	'use strict';
	var moduleName = 'object.project';
	var angModule = angular.module(moduleName);

	angModule.controller('objectProjectHeaderDocumentListController', ObjectProjectHeaderDocumentListController);

	ObjectProjectHeaderDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService','objectProjectHeaderDocumentService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function ObjectProjectHeaderDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		basicsCommonUploadDownloadControllerService, objectProjectHeaderDocumentService) {
		platformContainerControllerService.initController($scope, moduleName, 'a93d6d0701a04a15b88685b3c0800125');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,objectProjectHeaderDocumentService,'a93d6d0701a04a15b88685b3c0800125');

		basicsCommonUploadDownloadControllerService.initGrid($scope, objectProjectHeaderDocumentService);
	}
})(angular);