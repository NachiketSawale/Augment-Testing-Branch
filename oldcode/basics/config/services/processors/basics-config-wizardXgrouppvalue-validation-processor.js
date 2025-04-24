/**
 * Created by sandu on 05.02.2016.
 */
(function (angular) {
	'use strict';
	angular.module('basics.config').factory('basicsConfigWizardXGroupPValueValidationProcessor', basicsConfigWizardXGroupPValueValidationProcessor);
	basicsConfigWizardXGroupPValueValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function basicsConfigWizardXGroupPValueValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsConfigWizardXGroupPValueValidationService', function (basicsConfigWizardXGroupValidationService) {
					basicsConfigWizardXGroupValidationService.validateWizardParameterFk(items, null, 'WizardParameterFk');
				}]);
			}
		};
		return service;
	}
})(angular);