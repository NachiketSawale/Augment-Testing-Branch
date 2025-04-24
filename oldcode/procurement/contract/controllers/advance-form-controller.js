/**
 * Created by lvy on 7/22/2019.
 */
// procurementContractAdvanceFormController
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).controller('procurementContractAdvanceFormController',
		['$scope', 'platformDetailControllerService', 'procurementContractAdvanceUIStandardService', 'prcAndSalesContractAdvanceDataService', 'procurementContractAdvanceValidationService', 'procurementContextService',
			function ($scope, platformDetailControllerService, columnsService, dataServiceFactory, validationService, moduleContext) {
				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				platformDetailControllerService.initDetailController($scope, dataService, validationService, columnsService);
			}
		]);
})(angular);