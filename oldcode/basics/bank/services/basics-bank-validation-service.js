(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsBaValidationService
	 * @description provides validation methods for bank instances
	 */
	var moduleName='basics.bank';
	angular.module(moduleName).service('basicsBankValidationService', BasicsBankValidationService);

	function BasicsBankValidationService() {
	}

})(angular);
