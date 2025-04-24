/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkAbsenceProxyLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk forWic entity.
	 **/
	angular.module(moduleName).service('basicsClerkAbsenceProxyLayoutService', BasicsClerkAbsenceProxyLayoutService);

	BasicsClerkAbsenceProxyLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkAbsenceProxyLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkAbsenceProxyLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkAbsenceProxyDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);