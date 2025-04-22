/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractWipListController
	 * @function
	 *
	 * @description
	 * Controller for the related wip list view of a selected contract (header) entity.
	 **/
	angular.module(moduleName).controller('salesContractWipListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'e439572b3a4b4bf68315b02e4cba3d32');
			}
		]);
})();
