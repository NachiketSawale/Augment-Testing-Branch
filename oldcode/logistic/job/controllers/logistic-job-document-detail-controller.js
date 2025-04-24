/**
 * Created by leo.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.job';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticJobDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of job document entities
	 **/
	angModule.controller('logisticJobDocumentDetailController', LogisticJobDocumentDetailController);

	LogisticJobDocumentDetailController.$inject = ['$scope','platformContainerControllerService', 'logisticJobDocumentDataService', 'basicsCommonUploadDownloadControllerService'];

	function LogisticJobDocumentDetailController($scope, platformContainerControllerService, logisticJobDocumentDataService, basicsCommonUploadDownloadControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8893ada79e704d60ac11c87235d95c0e');
		basicsCommonUploadDownloadControllerService.initDetail($scope, logisticJobDocumentDataService);
	}
})();