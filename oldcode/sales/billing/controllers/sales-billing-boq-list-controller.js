/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the boqs belonging to billing
	 **/
	angular.module(moduleName).controller('salesBillingBoqListController',
		['$scope', 'platformContainerControllerService', 'modelViewerStandardFilterService',
			function ($scope, platformContainerControllerService, modelViewerStandardFilterService) {

				platformContainerControllerService.initController($scope, moduleName, '03E13F5F6C6E44A8AE8CD897814887AC');

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBillingBoqService');
			}
		]);

})();
