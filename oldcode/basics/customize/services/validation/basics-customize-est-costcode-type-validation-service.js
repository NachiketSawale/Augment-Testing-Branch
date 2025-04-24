(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).service('basicsCustomizeEstCostCodeTypeValidationService', BasicsCustomizeEstCostCodeTypeValidationService);

	BasicsCustomizeEstCostCodeTypeValidationService.$inject = ['basicsCustomizeEstCostCodeTypeProcessor'];

	function BasicsCustomizeEstCostCodeTypeValidationService(basicsCustomizeEstCostCodeTypeProcessor) {
		this.validateIsEstimateCc = function validateIsEstimateCc(entity, value, model) {
			basicsCustomizeEstCostCodeTypeProcessor.processItem(entity, value, model);
		};

		this.validateIsAllowance = function validateIsAllowance(entity, value, model) {
			basicsCustomizeEstCostCodeTypeProcessor.processItem(entity, value, model);
		};

		this.validateIsrp = function validateIsrp(entity, value, model) {
			basicsCustomizeEstCostCodeTypeProcessor.processItem(entity, value, model);
		};

		this.validateIsga = function validateIsga(entity, value, model) {
			basicsCustomizeEstCostCodeTypeProcessor.processItem(entity, value, model);
		};

		this.validateIsam = function validateIsam(entity, value, model) {
			basicsCustomizeEstCostCodeTypeProcessor.processItem(entity, value, model);
		};
	}
})(angular);
