/**
 * Created by mov on 9/10/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.indextable';

	angular.module(moduleName).factory('basicsIndexDetailValidationProcessService', basicsIndexDetailValidationProcessService);
	basicsIndexDetailValidationProcessService.$inject = ['$injector'];
	function basicsIndexDetailValidationProcessService($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('basicsIndexDetailValidationService').validateDate(item, item.Date, 'Date');
			}
		};
		return service;
	}
})(angular);
