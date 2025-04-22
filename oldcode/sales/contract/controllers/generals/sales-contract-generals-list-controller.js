/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractGeneralsListController',
		['$scope', 'platformGridControllerService', 'salesCommonGeneralsServiceFactory',
			function ($scope, platformGridControllerService, salesCommonGeneralsServiceFactory) {

				var gridConfig = {initCalled: false, columns: []};

				var serviceContainer = salesCommonGeneralsServiceFactory.getServiceContainer(moduleName);

				platformGridControllerService.initListController($scope,
					serviceContainer.salesCommonGeneralsUIStandardService, serviceContainer.salesCommonGeneralsService,
					serviceContainer.salesCommonGeneralsValidationService, gridConfig);
			}]);

})(angular);