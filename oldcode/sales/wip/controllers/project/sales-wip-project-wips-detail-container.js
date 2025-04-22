/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipProjectWipsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of wip (header) entities in module project.
	 **/
	angular.module(moduleName).controller('salesWipProjectWipsDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'EE83BC7FF01E47CDAAF2771245E8374C', 'salesWipTranslations');
			}]);
})();
