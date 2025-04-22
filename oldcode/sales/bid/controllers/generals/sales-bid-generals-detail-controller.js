/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.bid';

	angular.module(moduleName).controller('salesBidGeneralsDetailController',
		['$scope', 'platformDetailControllerService', 'salesCommonGeneralsServiceFactory', 'platformTranslateService',
			function ($scope, platformDetailControllerService, salesCommonGeneralsServiceFactory, platformTranslateService) {

				var serviceContainer = salesCommonGeneralsServiceFactory.getServiceContainer(moduleName);

				platformDetailControllerService.initDetailController($scope, serviceContainer.salesCommonGeneralsService,
					serviceContainer.salesCommonGeneralsValidationService, serviceContainer.salesCommonGeneralsUIStandardService,
					platformTranslateService);

			}]);

})(angular);