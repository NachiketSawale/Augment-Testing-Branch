/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.card';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticCardDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of document entities.
	 **/
	angModule.controller('logisticCardDocumentListController', LogisticCardDocumentListController);

	LogisticCardDocumentListController.$inject = ['$scope','platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService', 'logisticCardDocumentDataService'];

	function LogisticCardDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		basicsCommonUploadDownloadControllerService, logisticCardDocumentDataService) {
		platformContainerControllerService.initController($scope, moduleName, '7e1c27a578c1483386e2594f24bab0bc');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,logisticCardDocumentDataService,'7e1c27a578c1483386e2594f24bab0bc');

		basicsCommonUploadDownloadControllerService.initGrid($scope, logisticCardDocumentDataService);
	}
})();