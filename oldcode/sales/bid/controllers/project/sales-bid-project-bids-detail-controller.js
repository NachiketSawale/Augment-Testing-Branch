/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidProjectBidsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of bid (header) entities in module project.
	 **/
	angular.module(moduleName).controller('salesBidProjectBidsDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'FDF2E64888F544EC8310359384E823C6', 'salesBidTranslations');
			}]);
})(angular);
