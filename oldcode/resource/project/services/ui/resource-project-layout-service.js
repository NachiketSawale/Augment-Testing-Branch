/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project  entity.
	 **/
	angular.module(moduleName).service('resourceProjectLayoutService', ResourceProjectLayoutService);

	ResourceProjectLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectTranslationService'];

	function ResourceProjectLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getResourceProjectLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Project.Main',
				typeName: 'ProjectDto'
			},
			translator: resourceProjectTranslationService
		});
	}
})(angular);