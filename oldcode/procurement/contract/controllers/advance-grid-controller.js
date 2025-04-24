/**
 * Created by lvy on 7/11/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).controller('procurementContractAdvanceGridController',
		['$scope', 'platformGridControllerService', 'procurementContractAdvanceUIStandardService', 'prcAndSalesContractAdvanceDataService', 'procurementContractAdvanceValidationService', 'procurementContextService',
			function ($scope, platformGridControllerService, columnsService, dataServiceFactory, validationService, moduleContext) {
				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				platformGridControllerService.initListController($scope, columnsService, dataService, validationService, {});
			}
		]);
})(angular);
