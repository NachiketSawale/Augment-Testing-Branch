(function (angular) {
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('objectMainDocumentListController', ObjectMainDocumentListController);

	ObjectMainDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService','objectMainDocumentService'];

	function ObjectMainDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		basicsCommonUploadDownloadControllerService, objectMainDocumentService) {
		platformContainerControllerService.initController($scope, moduleName, '0fe9e5cff36745768670d19df28dfe9f');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,objectMainDocumentService,'0fe9e5cff36745768670d19df28dfe9f');

		basicsCommonUploadDownloadControllerService.initGrid($scope, objectMainDocumentService);
	}
})(angular);