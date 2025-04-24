/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.cardtemplate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of document entities.
	 **/
	angModule.controller('logisticCardTemplateDocumentListController', LogisticCardTemplateDocumentListController);

	LogisticCardTemplateDocumentListController.$inject = ['$scope','platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'logisticCardTemplateDocumentDataService', 'basicsCommonUploadDownloadControllerService'];

	function LogisticCardTemplateDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		logisticCardTemplateDocumentDataService, basicsCommonUploadDownloadControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'da8c50f95eab426ea365f50e28794eb6');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,logisticCardTemplateDocumentDataService,'da8c50f95eab426ea365f50e28794eb6');

		basicsCommonUploadDownloadControllerService.initGrid($scope, logisticCardTemplateDocumentDataService);
	}
})();