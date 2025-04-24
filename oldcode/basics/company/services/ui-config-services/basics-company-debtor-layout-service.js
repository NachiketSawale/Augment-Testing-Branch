/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyDebtorLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics company debtor entity.
	 **/
	angular.module(moduleName).service('basicsCompanyDebtorLayoutService', BasicsCompanyDebtorLayoutService);

	BasicsCompanyDebtorLayoutService.$inject = ['platformUIConfigInitService', 'basicsCompanyContainerInformationService', 'basicsCompanyConstantValues', 'basicsCompanyTranslationService'];

	function BasicsCompanyDebtorLayoutService(platformUIConfigInitService, basicsCompanyContainerInformationService, basicsCompanyConstantValues, basicsCompanyTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCompanyContainerInformationService.getDebtorLayout(),
			dtoSchemeId: basicsCompanyConstantValues.schemes.companyDebtor,
			translator: basicsCompanyTranslationService
		});
	}
})(angular);