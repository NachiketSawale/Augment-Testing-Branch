/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimateProjectLiSelStatementListValidationProcessService', projectMainLiSelStatementListValidationProcessor);
	projectMainLiSelStatementListValidationProcessor.$inject = ['$injector'];
	function projectMainLiSelStatementListValidationProcessor($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateProjectLiSelStatementListValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);
