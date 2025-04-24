/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLiSelStatementListValidationProcessService', estimateMainLiSelStatementListValidationProcessor);
	estimateMainLiSelStatementListValidationProcessor.$inject = ['$injector'];
	function estimateMainLiSelStatementListValidationProcessor($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateMainLiSelStatementListValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);
