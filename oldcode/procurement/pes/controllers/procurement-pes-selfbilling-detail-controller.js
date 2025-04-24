/**
 * Created by lsi on 7/1/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesSelfbillingDetailController', procurementPesSelfbillingDetailController);

	procurementPesSelfbillingDetailController.$inject = ['$scope', 'platformDetailControllerService', 'procurementPesSelfbillingDataService',
		'procurementPesSelfbillingUIStandardService', 'procurementPesTranslationService', 'procurementPesSelfBillingValidationService'];

	function procurementPesSelfbillingDetailController($scope, platformDetailControllerService, procurementPesSelfbillingDataService,
		procurementPesSelfbillingUIStandardService, procurementPesTranslationService, selfBillingValidationService) {
		platformDetailControllerService.initDetailController($scope, procurementPesSelfbillingDataService, selfBillingValidationService(procurementPesSelfbillingDataService),
			procurementPesSelfbillingUIStandardService, procurementPesTranslationService);
		$scope.formContainerOptions.onFirstItem = null;
		$scope.formContainerOptions.onLastItem = null;
		$scope.formContainerOptions.onNextItem = null;
		$scope.formContainerOptions.onPrevItem = null;
	}
})(angular);