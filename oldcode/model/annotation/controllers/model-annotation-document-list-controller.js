/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationDocumentListController',
		modelAnnotationDocumentListController);

	modelAnnotationDocumentListController.$inject = ['$scope', 'platformContainerControllerService',
		'basicsCommonUploadDownloadControllerService', 'modelAnnotationDocumentDataService'];

	function modelAnnotationDocumentListController($scope, platformContainerControllerService,
		basicsCommonUploadDownloadControllerService, modelAnnotationDocumentDataService) {

		platformContainerControllerService.initController($scope, moduleName, '437ca6a2a0c64fe79f90ec3f9b3dc3f0');

		basicsCommonUploadDownloadControllerService.initGrid($scope, modelAnnotationDocumentDataService);
	}
})(angular);
