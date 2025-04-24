/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyCreditorValidationService
	 * @description provides validation methods for basics company creditor entities
	 */
	angular.module(moduleName).service('basicsCompanyCreditorValidationService', BasicsCompanyCreditorValidationService);

	BasicsCompanyCreditorValidationService.$inject = ['platformValidationServiceFactory', 'basicsCompanyConstantValues', 'basicsCompanyCreditorDataService'];

	function BasicsCompanyCreditorValidationService(platformValidationServiceFactory, basicsCompanyConstantValues, basicsCompanyCreditorDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(basicsCompanyConstantValues.schemes.companyCreditor, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCompanyConstantValues.schemes.companyCreditor)
		},
		self,
		basicsCompanyCreditorDataService);
	}
})(angular);
