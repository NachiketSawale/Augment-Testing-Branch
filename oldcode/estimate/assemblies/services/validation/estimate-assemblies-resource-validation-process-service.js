/**
 * Created by mov on 9/6/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesResourceValidationProcessService', estimateAssembliesResourceValidationProcessor);
	estimateAssembliesResourceValidationProcessor.$inject = ['$injector'];
	function estimateAssembliesResourceValidationProcessor($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateAssembliesResourceValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);
