/**
 * Created by Arthur.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.dispatching';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of dispatching document entities
	 **/
	angModule.controller('logisticDispatchingDocumentDetailController', LogisticDispatchingDocumentDetailController);

	LogisticDispatchingDocumentDetailController.$inject = ['$scope','platformContainerControllerService', 'logisticDispatchingDocumentDataService', 'basicsCommonUploadDownloadControllerService'];

	function LogisticDispatchingDocumentDetailController($scope, platformContainerControllerService, logisticDispatchingDocumentDataService, basicsCommonUploadDownloadControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '71571ef0220e480ca04797f054fde1f2');
		basicsCommonUploadDownloadControllerService.initDetail($scope, logisticDispatchingDocumentDataService);
	}
})();