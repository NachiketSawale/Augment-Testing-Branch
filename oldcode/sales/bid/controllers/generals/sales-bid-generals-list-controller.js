/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('salesBidGeneralsListController',
		['$scope', 'platformGridControllerService', 'salesCommonGeneralsServiceFactory',
			function ($scope, platformGridControllerService, salesCommonGeneralsServiceFactory) {

				var gridConfig = {initCalled: false, columns: []};

				var serviceContainer = salesCommonGeneralsServiceFactory.getServiceContainer(moduleName);

				platformGridControllerService.initListController($scope,
					serviceContainer.salesCommonGeneralsUIStandardService, serviceContainer.salesCommonGeneralsService,
					serviceContainer.salesCommonGeneralsValidationService, gridConfig);
			}]);

})(angular);