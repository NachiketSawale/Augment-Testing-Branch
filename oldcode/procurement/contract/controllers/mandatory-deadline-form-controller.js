(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractMandatoryDeadlineFormController', ProcurementContractMandatoryDeadlineFormController);

	ProcurementContractMandatoryDeadlineFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractMandatoryDeadlineFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4f95fed11a894177975dc33975405e42', 'procurementContractTranslationService');
	}

})(angular);