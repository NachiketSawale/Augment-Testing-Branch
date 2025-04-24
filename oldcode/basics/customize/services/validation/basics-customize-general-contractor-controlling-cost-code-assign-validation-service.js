(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).service('basicsCustomizeGeneralContractorControllingCostCodeAssignValidationService', BasicsCustomizeGeneralContractorControllingCostCodeAssignValidationService);

	BasicsCustomizeGeneralContractorControllingCostCodeAssignValidationService.$inject = ['platformDataValidationService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeGeneralContractorControllingCostCodeAssignValidationService(platformDataValidationService, basicsCustomizeInstanceDataService) {
		this.validateContextFk = function validateContextFk(entity, value, model) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCustomizeInstanceDataService.getList(), self, basicsCustomizeInstanceDataService);
		};

	}
})(angular);
