
(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkRoleDefaultValueLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics clerk RoleDefaultValue entity.
	 **/
	angular.module(moduleName).service('basicsClerkRoleDefaultValueLayoutService', BasicsClerkRoleDefaultValueLayoutService);

	BasicsClerkRoleDefaultValueLayoutService.$inject = ['platformUIConfigInitService', 'basicsClerkContainerInformationService', 'basicsClerkTranslationService'];

	function BasicsClerkRoleDefaultValueLayoutService(platformUIConfigInitService, basicsClerkContainerInformationService, basicsClerkTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsClerkContainerInformationService.getBasicsClerkRoleDefaultValueLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Clerk',
				typeName: 'ClerkRoleDefaultValueDto'
			},
			translator: basicsClerkTranslationService
		});
	}
})(angular);