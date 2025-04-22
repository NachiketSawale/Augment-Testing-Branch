/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingTransactionListController
	 * @function
	 *
	 * @description
	 * Controller for the transaction list view of a selected billing (header) entity.
	 **/
	angular.module(moduleName).controller('salesBillingTransactionListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'D45FB0E93B5A4101B875C66686887918');
			}
		]);
})();
