(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractMandatoryDeadlineValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('procurementContractMandatoryDeadlineValidationService', ProcurementContractMandatoryDeadlineValidationService);

	ProcurementContractMandatoryDeadlineValidationService.$inject = ['procurementContractMandatoryDeadlineDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ProcurementContractMandatoryDeadlineValidationService(procurementContractMandatoryDeadlineDataService, platformDataValidationService) {

		var self = this;

		this.validateStart = function validateStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.End, entity, model, self, procurementContractMandatoryDeadlineDataService, 'End');
		};

		this.validateEnd = function validateEnd(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.Start, value, entity, model, self, procurementContractMandatoryDeadlineDataService, 'Start');
		};
	}

})(angular);