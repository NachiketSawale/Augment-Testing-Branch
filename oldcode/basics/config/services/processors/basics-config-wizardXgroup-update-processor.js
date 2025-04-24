/**
 * Created by sandu on 31.03.2016.
 */
(function (angular) {
	'use strict';
	angular.module('basics.config').factory('basicsConfigWizardXGroupUpdateProcessor', basicsConfigWizardXGroupUpdateProcessor);
	basicsConfigWizardXGroupUpdateProcessor.$inject = ['platformRuntimeDataService'];
	function basicsConfigWizardXGroupUpdateProcessor(platformRuntimeDataService) {
		var service = {};
		service.processItem = function processItem(item) {
			if (item.Version >= 1) {
				platformRuntimeDataService.readonly(item, [{
					field: 'WizardFk',
					readonly: true
				}]);
			}
		};
		return service;
	}
})(angular);