(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.quote';
	/**
	 * @ngdoc service
	 * @name procurementQuoteMandatoryDeadlineValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('procurementQuoteMandatoryDeadlineValidationService', ProcurementQuoteMandatoryDeadlineValidationService);

	ProcurementQuoteMandatoryDeadlineValidationService.$inject = ['procurementQuoteMandatoryDeadlineDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ProcurementQuoteMandatoryDeadlineValidationService(procurementQuoteMandatoryDeadlineDataService, platformDataValidationService) {

		var self = this;

		this.validateStart = function validateStart(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.End, entity, model, self, procurementQuoteMandatoryDeadlineDataService, 'End');
		};

		this.validateEnd = function validateEnd(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.Start, value, entity, model, self, procurementQuoteMandatoryDeadlineDataService, 'Start');
		};
	}

})(angular);