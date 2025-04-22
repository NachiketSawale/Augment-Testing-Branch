/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of bid document entities.
	 **/
	angular.module(moduleName).controller('salesBidDocumentListController',
		['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'salesBidDocumentService',
			function ($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, salesBidDocumentService) {

				platformContainerControllerService.initController($scope, moduleName, '03deb09668e740c389bc3681210eaef1');

				basicsCommonUploadDownloadControllerService.initGrid($scope, salesBidDocumentService);

			}
		]);
})(angular);
