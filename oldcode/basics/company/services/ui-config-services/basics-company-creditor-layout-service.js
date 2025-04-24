/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyCreditorLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics company creditor entity.
	 **/
	angular.module(moduleName).service('basicsCompanyCreditorLayoutService', BasicsCompanyCreditorLayoutService);

	BasicsCompanyCreditorLayoutService.$inject = ['platformUIConfigInitService', 'basicsCompanyContainerInformationService', 'basicsCompanyConstantValues', 'basicsCompanyTranslationService'];

	function BasicsCompanyCreditorLayoutService(platformUIConfigInitService, basicsCompanyContainerInformationService, basicsCompanyConstantValues, basicsCompanyTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCompanyContainerInformationService.getCreditorLayout(),
			dtoSchemeId: basicsCompanyConstantValues.schemes.companyCreditor,
			translator: basicsCompanyTranslationService
		});
	}
})(angular);