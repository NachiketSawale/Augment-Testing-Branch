/**
 * Created by mov on 4/24/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainWic2AssemblyValidationProcessorService', boqMainWic2AssemblyValidationProcessor);
	boqMainWic2AssemblyValidationProcessor.$inject = ['$injector'];

	function boqMainWic2AssemblyValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('boqMainWic2AssemblyValidationService').validateEstLineItemFk(item, null, 'EstLineItemFk');
			}
		};
		return service;
	}
})(angular);