/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForWicLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk forWic entity.
	 **/
	angular.module(moduleName).service('basicsClerkForWicLayoutService', BasicsClerkForWicLayoutService);

	BasicsClerkForWicLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkForWicLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkForWicLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkForWicDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);