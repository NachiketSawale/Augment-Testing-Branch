/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingValidationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing validation entities.
	 **/
	angular.module(moduleName).controller('salesBillingValidationDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '381859CB3A9E46829179BFC91D11AF89', 'salesBillingTranslations');
			}]);
})(angular);
