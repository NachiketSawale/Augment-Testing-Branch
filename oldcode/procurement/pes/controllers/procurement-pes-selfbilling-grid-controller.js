/**
 * Created by lsi on 7/1/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesSelfbillingGridController', procurementPesSelfbillingGridController);

	procurementPesSelfbillingGridController.$inject = ['$scope', 'platformGridControllerService', 'procurementPesSelfbillingUIStandardService',
		'procurementPesSelfbillingDataService', 'procurementPesSelfBillingValidationService'];

	function procurementPesSelfbillingGridController($scope, platformGridControllerService, procurementPesSelfbillingUIStandardService,
		procurementPesSelfbillingDataService, selfBillingValidationService) {
		var gridConfig = {
			initCalled: false,
			columns: []
		};
		platformGridControllerService.initListController($scope, procurementPesSelfbillingUIStandardService, procurementPesSelfbillingDataService, selfBillingValidationService(procurementPesSelfbillingDataService), gridConfig);
	}
})(angular);
