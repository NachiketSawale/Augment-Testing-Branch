/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingAccrualListController
	 * @function
	 *
	 * @description
	 * Controller for the bill accruals.
	 **/
	angular.module(moduleName).controller('salesBillingAccrualListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'cbf9b7eea34d471884ddf50512193599');
			}
		]);
})();
