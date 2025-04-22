/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing item entities.
	 **/
	angular.module(moduleName).controller('salesBillingItemDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'A0AC5D8AD3824C08BCC23D887CB45077', 'salesBillingTranslations');
			}]);
})(angular);
