/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyDebtorValidationService
	 * @description provides validation methods for basics company debtor entities
	 */
	angular.module(moduleName).service('basicsCompanyDebtorValidationService', BasicsCompanyDebtorValidationService);

	BasicsCompanyDebtorValidationService.$inject = ['platformValidationServiceFactory', 'basicsCompanyConstantValues', 'basicsCompanyDebtorDataService'];

	function BasicsCompanyDebtorValidationService(platformValidationServiceFactory, basicsCompanyConstantValues, basicsCompanyDebtorDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(basicsCompanyConstantValues.schemes.companyDebtor, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCompanyConstantValues.schemes.companyDebtor)
		},
		self,
		basicsCompanyDebtorDataService);
	}
})(angular);
