(function (angular) {
	'use strict';

	let moduleName = 'qto.formula';

	angular.module(moduleName).factory('qtoFormulaDataValidationProcessService',['$injector',function ($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('qtoFormulaValidationService').validateCode(item, item.Code, 'Code');
			}
		};
		return service;
	}

	]);
})(angular);