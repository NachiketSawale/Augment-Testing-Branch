(function (angular) {
	'use strict';

	var moduleName = 'procurement.quote';
	/**
	 * @ngdoc service
	 * @name procurementQuoteCallOffAgreementValidationService
	 * @description provides validation methods for entities
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).service('procurementQuoteCallOffAgreementValidationService', ProcurementQuoteCallOffAgreementValidationService);

	ProcurementQuoteCallOffAgreementValidationService.$inject = ['procurementQuoteCallOffAgreementDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ProcurementQuoteCallOffAgreementValidationService(procurementQuoteCallOffAgreementDataService, platformDataValidationService) {

		var self = this;

		this.validateEarliestStart = function validateEarliestStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.LatestStart, entity, model, self, procurementQuoteCallOffAgreementDataService, 'LatestStart');
		};

		this.validateLatestStart = function validateLatestStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.EarliestStart, value, entity, model, self, procurementQuoteCallOffAgreementDataService, 'EarliestStart');
		};
	}

})(angular);