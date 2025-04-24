/**
 * Created by sandu on 28.01.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupPValueValidationService
	 * @description provides validation methods for wizard 2 group entities
	 */
	angular.module(moduleName).service('basicsConfigWizardXGroupPValueValidationService', basicsConfigWizardXGroupPValueValidationService);

	basicsConfigWizardXGroupPValueValidationService.$inject = ['platformDataValidationService','basicsConfigWizardXGroupPValueService'];

	function basicsConfigWizardXGroupPValueValidationService(platformDataValidationService,basicsConfigWizardXGroupPValueService) {
		var service = {};

		service.validateWizardParameterFk = function validateWizardParameterFk(entity,value,model) {
			var result = {
				valid: !!value,
				apply: true
			};
			platformDataValidationService.finishValidation(result, entity, value, model, service, basicsConfigWizardXGroupPValueService);
			return result;
		};
		return service;
	}
})(angular);