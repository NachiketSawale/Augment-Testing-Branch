(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractCallOffAgreementValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('procurementContractCallOffAgreementValidationService', ProcurementContractCallOffAgreementValidationService);

	ProcurementContractCallOffAgreementValidationService.$inject = ['procurementContractCallOffAgreementDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ProcurementContractCallOffAgreementValidationService(procurementContractCallOffAgreementDataService, platformDataValidationService) {

		var self = this;

		this.validateEarliestStart = function validateEarliestStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.LatestStart, entity, model, self, procurementContractCallOffAgreementDataService, 'LatestStart');
		};

		this.validateLatestStart = function validateLatestStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.EarliestStart, value, entity, model, self, procurementContractCallOffAgreementDataService, 'EarliestStart');
		};
	}

})(angular);