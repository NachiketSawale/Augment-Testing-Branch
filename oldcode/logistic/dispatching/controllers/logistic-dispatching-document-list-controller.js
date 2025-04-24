/**
 * Created by Arthur.
 */
(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of dispatching document entities.
	 **/
	angModule.controller('logisticDispatchingDocumentListController', LogisticDispatchingDocumentListController);

	LogisticDispatchingDocumentListController.$inject = ['$scope','platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'logisticDispatchingDocumentDataService', 'basicsCommonUploadDownloadControllerService'];

	function LogisticDispatchingDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		logisticDispatchingDocumentDataService, basicsCommonUploadDownloadControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8905e348c2d44a1fa31f1e69f380adec');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,logisticDispatchingDocumentDataService,'8905e348c2d44a1fa31f1e69f380adec');

		basicsCommonUploadDownloadControllerService.initGrid($scope, logisticDispatchingDocumentDataService);
	}
})(angular);