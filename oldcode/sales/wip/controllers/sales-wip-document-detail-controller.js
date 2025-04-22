/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of wip document entities.
	 **/
	angular.module(moduleName).controller('salesWipDocumentDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '0988f39b5d8342f0ad6211c9fa2d434a', 'salesWipTranslations');
			}]);
})(angular);
