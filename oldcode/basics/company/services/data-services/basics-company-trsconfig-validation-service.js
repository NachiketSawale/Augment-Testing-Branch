/**
 * Created by anl on 10/14/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).service('basicsCompanyTrsConfigValidationService', BasicsCompanyTrsConfigValidationService);

	BasicsCompanyTrsConfigValidationService.$inject = ['platformDataValidationService', 'basicsCompanyTrsConfigService'];

	function BasicsCompanyTrsConfigValidationService(platformDataValidationService, trsConfigService) {
		var self = this;

		self.validateProjectFk = function validateCountryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, trsConfigService);
		};

		self.validateJobFk = function validateCountryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, trsConfigService);
		};

		self.validateSiteFk = function validateCountryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, trsConfigService);
		};

		self.validateSiteStockFk = function validateCountryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, trsConfigService);
		};
	}

})(angular);