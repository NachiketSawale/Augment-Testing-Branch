/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractBillingListController
	 * @function
	 *
	 * @description
	 * Controller for the related billing list view of a selected contract (header) entity.
	 **/
	angular.module(moduleName).controller('salesContractBillingListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'd9e8ac9295a148a0910a185c71d87661');
			}
		]);
})();
