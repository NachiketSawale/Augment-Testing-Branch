/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingPaymentListController
	 * @function
	 *
	 * @description
	 * Controller for the item list view of payment entity.
	 **/
	angular.module(moduleName).controller('salesBillingPaymentListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'd9cb8c6e6cdb44daa4ef02f6f64fe750');
			}
		]);
})();
