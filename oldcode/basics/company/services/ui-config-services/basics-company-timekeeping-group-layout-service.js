/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyTimekeepingGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics company timekeepingGroup entity.
	 **/
	angular.module(moduleName).service('basicsCompanyTimekeepingGroupLayoutService', BasicsCompanyTimekeepingGroupLayoutService);

	BasicsCompanyTimekeepingGroupLayoutService.$inject = ['platformUIConfigInitService', 'basicsCompanyContainerInformationService', 'basicsCompanyConstantValues', 'basicsCompanyTranslationService'];

	function BasicsCompanyTimekeepingGroupLayoutService(platformUIConfigInitService, basicsCompanyContainerInformationService, basicsCompanyConstantValues, basicsCompanyTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCompanyContainerInformationService.getTimekeepingGroupLayout(),
			dtoSchemeId: basicsCompanyConstantValues.schemes.timekeepingGroup,
			translator: basicsCompanyTranslationService
		});
	}
})(angular);