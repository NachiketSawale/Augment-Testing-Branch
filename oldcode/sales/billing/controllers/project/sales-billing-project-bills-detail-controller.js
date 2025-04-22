/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingProjectBillsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing (header) entities in module project.
	 **/
	angular.module(moduleName).controller('salesBillingProjectBillsDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'C49BD5BAA6454B0E80D3985C93789EB4', 'salesBillingTranslations');
			}]);
})();
