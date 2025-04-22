/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';

	angular.module(moduleName).controller('salesBillingGeneralsDetailController',
		['$scope', 'platformDetailControllerService', 'salesCommonGeneralsServiceFactory', 'platformTranslateService',
			function ($scope, platformDetailControllerService, salesCommonGeneralsServiceFactory, platformTranslateService) {

				var serviceContainer = salesCommonGeneralsServiceFactory.getServiceContainer(moduleName);

				platformDetailControllerService.initDetailController($scope, serviceContainer.salesCommonGeneralsService,
					serviceContainer.salesCommonGeneralsValidationService, serviceContainer.salesCommonGeneralsUIStandardService,
					platformTranslateService);

			}]);

})(angular);
