/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesBidDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of contract document entities.
	 **/
	angular.module(moduleName).controller('salesContractDocumentListController',
		['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'salesContractDocumentService',
			function ($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, salesContractDocumentService) {

				platformContainerControllerService.initController($scope, moduleName, 'ef3fc9fd941340a6bd61cda5683c2398');

				basicsCommonUploadDownloadControllerService.initGrid($scope, salesContractDocumentService);

			}
		]);
})(angular);
