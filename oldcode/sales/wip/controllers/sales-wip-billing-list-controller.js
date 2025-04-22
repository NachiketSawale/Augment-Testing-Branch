/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipBillingListController
	 * @function
	 *
	 * @description
	 * Controller for the related bill list view of a selected wip (header) entity.
	 **/
	angular.module(moduleName).controller('salesWipBillingListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '4a7b645797f34ac3ac21e4410b2635a8');
			}
		]);
})();
