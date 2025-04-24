/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForScheduleLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk forSchedule entity.
	 **/
	angular.module(moduleName).service('basicsClerkForScheduleLayoutService', BasicsClerkForScheduleLayoutService);

	BasicsClerkForScheduleLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkForScheduleLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkForScheduleLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkForScheduleDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);