/**
 * Created by balkanci on 17.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main  entity.
	 **/
	angular.module(moduleName).service('projectMainAddressUiConfigService', ProjectMainLayoutService);

	ProjectMainLayoutService.$inject = ['platformUIConfigInitService', 'projectMainAddressConfigurationService', 'projectMainTranslationService'];

	function ProjectMainLayoutService(platformUIConfigInitService, projectMainAddressConfigurationService, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainAddressConfigurationService.getConfig(),
			dtoSchemeId: {
				moduleSubModule: 'Project.Main',
				typeName: 'ProjectAddressDto'
			},
			translator: projectMainTranslationService
		});
	}
})(angular);