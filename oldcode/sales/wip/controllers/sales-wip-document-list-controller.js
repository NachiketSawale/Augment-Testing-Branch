/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesBidDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of wip document entities.
	 **/
	angular.module(moduleName).controller('salesWipDocumentListController',
		['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'salesWipDocumentService',
			function ($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, salesWipDocumentService) {

				platformContainerControllerService.initController($scope, moduleName, 'e741d2316c0245e1973a305b3f1c938b');

				basicsCommonUploadDownloadControllerService.initGrid($scope, salesWipDocumentService);

			}
		]);
})(angular);
