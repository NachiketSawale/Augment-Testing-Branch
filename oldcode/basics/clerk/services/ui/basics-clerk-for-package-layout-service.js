/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForPackageLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk forPackage entity.
	 **/
	angular.module(moduleName).service('basicsClerkForPackageLayoutService', BasicsClerkForPackageLayoutService);

	BasicsClerkForPackageLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkForPackageLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkForPackageLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkForPackageDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);