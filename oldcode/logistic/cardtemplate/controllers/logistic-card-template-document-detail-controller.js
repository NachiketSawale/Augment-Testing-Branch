/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.cardtemplate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of document entities
	 **/
	angModule.controller('logisticCardTemplateDocumentDetailController', LogisticCardTemplateDocumentDetailController);

	LogisticCardTemplateDocumentDetailController.$inject = ['$scope','platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'logisticCardTemplateDocumentDataService'];

	function LogisticCardTemplateDocumentDetailController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, logisticCardTemplateDocumentDataService) {
		platformContainerControllerService.initController($scope, moduleName, '125101fddb83457a95064b25bb7ff6d0');
		basicsCommonUploadDownloadControllerService.initDetail($scope, logisticCardTemplateDocumentDataService);

	}
})();