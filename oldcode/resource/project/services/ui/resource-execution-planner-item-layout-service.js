/**
 * Created by shen on 28.01.2025
 */


(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectExecPlannerItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project execution planner item entity.
	 **/
	angular.module(moduleName).service('resourceProjectExecPlannerItemLayoutService', ResourceProjectExecPlannerItemLayoutService);

	ResourceProjectExecPlannerItemLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectConstantValues', 'resourceProjectTranslationService'];

	function ResourceProjectExecPlannerItemLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectConstantValues, resourceProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getExecPlannerItemLayout(),
			dtoSchemeId: resourceProjectConstantValues.schemes.execPlannerItem,
			translator: resourceProjectTranslationService
		});
	}
})(angular);