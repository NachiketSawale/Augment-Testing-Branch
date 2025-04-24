(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCompany2BasClerkValidationService
	 * @description provides validation methods for company2clerk
	 */
	var moduleName='basics.company';
	angular.module(moduleName).service('basicsCompany2BasClerkValidationService', BasicsCompany2ClerkValidationService);

	BasicsCompany2ClerkValidationService.$inject = [ 'platformDataValidationService','basicsCompany2BasClerkService'];

	function BasicsCompany2ClerkValidationService(platformDataValidationService, basicsCompany2BasClerkService) {
		var self = this;

		self.validateClerkFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'ClerkFk', self, basicsCompany2BasClerkService);
		};

		self.validateClerkRoleFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'ClerkRoleFk', self, basicsCompany2BasClerkService);
		};

		self.validateValidFrom = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, basicsCompany2BasClerkService, 'ValidFrom');
		};

		self.validateValidTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, basicsCompany2BasClerkService, 'ValidTo');
		};
	}

})(angular);
