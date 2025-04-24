(function () {
	'use strict';

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).service('ppsMaintenanceValidationService', ValidationService);
	ValidationService.$inject = [
		'platformDataValidationService',
		'ppsMaintenanceDataService'];

	function ValidationService (platformDataValidationService, dataService) {
		let self = this;
		this.validateStartDate = function validateStartDate(entity, value, model) {
			if(!value || !entity.EndDate){
				return platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
			}
			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, self, dataService, 'EndDate');
		};

		this.validateEndDate = function validateEndDate(entity, value, model) {
			if(!value || !entity.StartDate){
				return platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
			}
			return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, self, dataService, 'StartDate');
		};
	}
})(angular);