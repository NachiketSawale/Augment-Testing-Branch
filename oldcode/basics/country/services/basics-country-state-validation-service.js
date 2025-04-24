(function (angular) {
	'use strict';

	var moduleName = 'basics.country';
	/**
	 * @ngdoc service
	 * @name basicsCountryStateValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsCountryStateValidationService', BasicsCountryStateValidationService);

	BasicsCountryStateValidationService.$inject = ['platformDataValidationService','basicsCountryStateService','basicsCountryMainService'];

	function BasicsCountryStateValidationService(platformDataValidationService, basicsCountryStateService, basicsCountryMainService ) {
		var self = this;

		self.validateState = function validateState (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCountryStateService);
		};
	}
})(angular);
