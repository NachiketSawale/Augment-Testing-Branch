(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypePlanningBoardFilterLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource type planning board entity.
	 **/
	angular.module(moduleName).service('resourceTypePlanningBoardFilterLayoutService', ResourceTypePlanningBoardFilterLayoutService);

	ResourceTypePlanningBoardFilterLayoutService.$inject = ['platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeConstantValues', 'resourceTypeTranslationService'];

	function ResourceTypePlanningBoardFilterLayoutService(platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeConstantValues, resourceTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceTypeContainerInformationService.getPlanningBoardFilterLayout(),
			dtoSchemeId: resourceTypeConstantValues.schemes.planningBoardFilter,
			translator: resourceTypeTranslationService
		});
	}
})(angular);