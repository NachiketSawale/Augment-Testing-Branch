/**
 * Created by leo.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.job';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticJobDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of job document entities.
	 **/
	angModule.controller('logisticJobDocumentListController', LogisticJobDocumentListController);

	LogisticJobDocumentListController.$inject = ['$scope','platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService',
		'logisticJobDocumentDataService', 'basicsCommonUploadDownloadControllerService'];

	function LogisticJobDocumentListController($scope, platformContainerControllerService, basicsCommonDocumentUploadFilesControllerService,
		logisticJobDocumentDataService, basicsCommonUploadDownloadControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '20e85d49386d410c85988b42e384759f');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,logisticJobDocumentDataService,'20e85d49386d410c85988b42e384759f');

		basicsCommonUploadDownloadControllerService.initGrid($scope, logisticJobDocumentDataService);
	}
})();