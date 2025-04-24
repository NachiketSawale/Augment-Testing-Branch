(function(angular){
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementPesWizardCreateCOContractForNewValidationService', procurementPesWizardCreateCOContractForNewValidationService);

	procurementPesWizardCreateCOContractForNewValidationService.$inject = ['$translate', 'platformRuntimeDataService'];

	function procurementPesWizardCreateCOContractForNewValidationService($translate, platformRuntimeDataService) {
		var service = {};
		service.validateProjectChangeFk = validateProjectChangeFk;
		return service;

		// ////////////////////////////

		function validateProjectChangeFk(entity, value, model){
			var result = {valid: true, apply: true};
			if (!value) {
				result.valid = false;
				result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				platformRuntimeDataService.applyValidationResult(result, entity, model);
			}
			else {
				platformRuntimeDataService.applyValidationResult(result, entity, model);
			}
			return result;
		}
	}
})(angular);