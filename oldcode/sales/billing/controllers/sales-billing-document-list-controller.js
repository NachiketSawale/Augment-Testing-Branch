/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBidDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of billing document entities.
	 **/
	angular.module(moduleName).controller('salesBillingDocumentListController',
		['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'salesBillingDocumentService',
			function ($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, salesBillingDocumentService) {

				platformContainerControllerService.initController($scope, moduleName, 'c34718f7f1b446aba797b056a0b1dde0');

				basicsCommonUploadDownloadControllerService.initGrid($scope, salesBillingDocumentService);

			}
		]);
})(angular);
