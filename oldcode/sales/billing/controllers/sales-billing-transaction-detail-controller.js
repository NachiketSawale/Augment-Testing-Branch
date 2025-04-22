/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingTransactionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing transaction entities.
	 **/
	angular.module(moduleName).controller('salesBillingTransactionDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '3FE17CC5F81847E99667F903642150D8', 'salesBillingTranslations');
			}]);
})(angular);
