/**
 * Created by leo on 18.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyICCuValidationService
	 * @description provides validation methods for basics company  entities
	 */
	angular.module(moduleName).service('basicsCompanyICCuValidationService', BasicsCompanyICCuValidationService);

	BasicsCompanyICCuValidationService.$inject = ['platformValidationServiceFactory', 'basicsCompanyICCuDataService', 'basicsCompanyConstantValues'];

	function BasicsCompanyICCuValidationService(platformValidationServiceFactory, basicsCompanyICCuDataService, basicsCompanyConstantValues) {
		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(basicsCompanyConstantValues.schemes.companyICCu, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCompanyConstantValues.schemes.companyICCu)
		},
		self,
		basicsCompanyICCuDataService);
	}

})(angular);
