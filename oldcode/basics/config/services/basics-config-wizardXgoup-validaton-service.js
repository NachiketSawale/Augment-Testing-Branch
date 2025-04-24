/**
 * Created by sandu on 28.01.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupValidationService
	 * @description provides validation methods for wizard 2 group entities
	 */
	angular.module(moduleName).factory('basicsConfigWizardXGroupValidationService', basicsConfigWizardXGroupValidationService);

	basicsConfigWizardXGroupValidationService.$inject = ['platformDataValidationService','basicsConfigWizardXGroupService'];

	function basicsConfigWizardXGroupValidationService(platformDataValidationService,basicsConfigWizardXGroupService){
		var service = {};

		service.validateWizardFk = function validateWizardFk(entity,value,model) {
			var result = {
				valid: !!value,
				apply: true
			};
			platformDataValidationService.finishValidation(result, entity, value, model, service, basicsConfigWizardXGroupService);
			return result;
		};
		return service;

	}
})(angular);