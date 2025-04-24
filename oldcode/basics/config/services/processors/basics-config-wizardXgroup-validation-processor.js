/**
 * Created by sandu on 05.02.2016.
 */
(function (angular) {
	'use strict';
	angular.module('basics.config').factory('basicsConfigWizardXGroupValidationProcessor', basicsConfigWizardXGroupValidationProcessor);
	basicsConfigWizardXGroupValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function basicsConfigWizardXGroupValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsConfigWizardXGroupValidationService', function (basicsConfigWizardXGroupValidationService) {
					basicsConfigWizardXGroupValidationService.validateWizardFk(items, null, 'WizardFk');
				}]);
			}
		};
		return service;
	}
})(angular);