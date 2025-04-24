/**
 * Created by leo on 18.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyICCuLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics company  entity.
	 **/
	angular.module(moduleName).service('basicsCompanyICCuLayoutService', BasicsCompanyICCuLayoutService);

	BasicsCompanyICCuLayoutService.$inject = ['platformUIConfigInitService', 'basicsCompanyContainerInformationService', 'basicsCompanyTranslationService', 'basicsCompanyConstantValues'];

	function BasicsCompanyICCuLayoutService(platformUIConfigInitService, basicsCompanyContainerInformationService, basicsCompanyTranslationService, basicsCompanyConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCompanyContainerInformationService.getCompanyICCuLayout(),
			dtoSchemeId: basicsCompanyConstantValues.schemes.companyICCu,
			translator: basicsCompanyTranslationService
		});
	}
})(angular);
