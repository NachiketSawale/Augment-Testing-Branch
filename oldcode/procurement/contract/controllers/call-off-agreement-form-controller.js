(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractCallOffAgreementFormController', ProcurementContractCallOffAgreementFormController);

	ProcurementContractCallOffAgreementFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractCallOffAgreementFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7c9932be107843f4979bd93de61f72ad', 'procurementContractTranslationService');
	}

})(angular);