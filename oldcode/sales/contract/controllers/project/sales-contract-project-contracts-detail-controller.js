/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractProjectContractsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of contract (header) entities in module project.
	 **/
	angular.module(moduleName).controller('salesContractProjectContractsDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '00B327A345274E5A8B57B02DB5FCAAB7', 'salesContractTranslations');
			}]);
})();
