/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForEstimateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk for estimate entity.
	 **/
	angular.module(moduleName).service('basicsClerkForEstimateLayoutService', BasicsClerkForEstimateLayoutService);

	BasicsClerkForEstimateLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkForEstimateLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkForEstimateLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkForEstimateDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);