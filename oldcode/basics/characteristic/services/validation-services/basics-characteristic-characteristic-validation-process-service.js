/**
 * Created by mov on 12/26/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('BasicsCharacteristicCharacteristicValidationProcessService', basicsCharacteristicCharacteristicValidationProcessor);
	basicsCharacteristicCharacteristicValidationProcessor.$inject = ['$injector'];
	function basicsCharacteristicCharacteristicValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('basicsCharacteristicCharacteristicValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);