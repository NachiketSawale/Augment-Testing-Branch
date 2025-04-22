/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingValidationListController
	 * @function
	 *
	 * @description
	 * Controller for the validation list view of a selected billing (header) entity.
	 **/
	angular.module(moduleName).controller('salesBillingValidationListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '1247EF00DFCE413793B328F685F7CA27');
			}
		]);
})();
