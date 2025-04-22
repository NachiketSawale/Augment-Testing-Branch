/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingWipListController
	 * @function
	 *
	 * @description
	 * Controller for the related wip list view of a selected billing (header) entity.
	 **/
	angular.module(moduleName).controller('salesBillingWipListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '35b66e9f68e04dd59337a45a2f936d25');
			}
		]);
})();
