/**
 * Created by mov on 9/6/2017.
 */



(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainResourceValidationProcessService', estimateMainResourceValidationProcessor);
	estimateMainResourceValidationProcessor.$inject = ['$injector'];
	function estimateMainResourceValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateMainResourceValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);