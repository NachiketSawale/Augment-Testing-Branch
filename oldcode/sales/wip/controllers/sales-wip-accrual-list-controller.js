/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipAccrualListController
	 * @function
	 *
	 * @description
	 * Controller for the wip accruals.
	 **/
	angular.module(moduleName).controller('salesWipAccrualListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '6580513f3b564a5088c75b67232d8f47');
			}
		]);
})();
