/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of contract document entities.
	 **/
	angular.module(moduleName).controller('salesContractDocumentDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'ff6a0d7a144e441e87fe63855418619b', 'salesContractTranslations');
			}]);
})(angular);
