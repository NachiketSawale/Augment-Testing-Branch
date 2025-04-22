/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingPaymentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing payment entities.
	 **/
	angular.module(moduleName).controller('salesBillingPaymentDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'da31be78e5cb416db8c44e2b41afa56e', 'salesBillingPaymentTranslations');
			}]);
})(angular);
