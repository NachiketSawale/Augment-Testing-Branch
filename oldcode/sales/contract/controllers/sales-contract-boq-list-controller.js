/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the boqs belonging to contracts
	 **/
	angular.module(moduleName).controller('salesContractBoqListController',
		['$scope', 'platformContainerControllerService', 'modelViewerStandardFilterService',
			function ($scope, platformContainerControllerService, modelViewerStandardFilterService) {
				platformContainerControllerService.initController($scope, moduleName, '03E13F5F6C6E44A8AE8CD897814887AC');

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesContractBoqService');
			}
		]);

})(angular);
