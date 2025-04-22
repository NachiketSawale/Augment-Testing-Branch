/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingWipDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of related wip document entities.
	 **/
	angular.module(moduleName).controller('salesBillingWipDocumentListController',
		['_', '$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'salesBillingWipDocumentService',
			function (_, $scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, salesBillingWipDocumentService) {

				platformContainerControllerService.initController($scope, moduleName, '32240b2754254f6280bb2a9597c0d611');
				basicsCommonUploadDownloadControllerService.initGrid($scope, salesBillingWipDocumentService);

				// we don't want to have upload, multipleupload, download, and cancelupload buttons here (should be readonly)
				_.remove($scope.tools.items, function(item) {return _.has(item, 'id') ? item.id.includes('load') : true;});
				$scope.tools.update();
			}
		]);
})(angular);
