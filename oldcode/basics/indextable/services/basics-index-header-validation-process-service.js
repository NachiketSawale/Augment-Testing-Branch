/**
 * Created by xia on 5/16/2019.
 */


(function (angular) {
	'use strict';

	let moduleName = 'basics.indextable';

	angular.module(moduleName).factory('basicsIndexTableValidationProcessService', basicsIndexTableValidationProcessService);
	basicsIndexTableValidationProcessService.$inject = ['$injector'];
	function basicsIndexTableValidationProcessService($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('basicsIndexHeaderValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);
