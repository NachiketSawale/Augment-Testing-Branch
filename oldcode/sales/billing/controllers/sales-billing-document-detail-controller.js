/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of billing document entities.
	 **/
	angular.module(moduleName).controller('salesBillingDocumentDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '0934ac0577174ad9b00a473235d02109', 'salesBillingTranslations');
			}]);
})(angular);
