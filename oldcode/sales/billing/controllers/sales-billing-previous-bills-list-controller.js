/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingPreviousBillsListController
	 * @function
	 *
	 * @description
	 * Controller for the predecessor list view of a selected billing (header) entity.
	 **/
	angular.module(moduleName).controller('salesBillingPreviousBillsListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, 'F825FABE0D0949EA8EF3F6C6DBBDEA60');

			}
		]);
})();
