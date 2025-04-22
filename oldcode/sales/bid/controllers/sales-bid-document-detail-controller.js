/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of bid document entities.
	 **/
	angular.module(moduleName).controller('salesBidDocumentDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '096bbc843bf142038615af92894512be', 'salesBidTranslations');
			}]);
})(angular);
