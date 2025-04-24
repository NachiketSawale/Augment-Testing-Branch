
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkAbsenceProxyValidationService
	 * @description provides validation methods for clerk-absence instances
	 */
	var moduleName='basics.clerk';
	angular.module(moduleName).service('basicsClerkAbsenceProxyValidationService', BasicsClerkAbsenceValidationService);

	BasicsClerkAbsenceValidationService.$inject = ['platformDataValidationService','basicsClerkAbsenceProxyService'];

	function BasicsClerkAbsenceValidationService(platformDataValidationService, basicsClerkAbsenceProxyService) {
		var self = this;

		self.validateClerkFk = function validateClerkFk (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsClerkAbsenceProxyService);
		};
	}

})(angular);
