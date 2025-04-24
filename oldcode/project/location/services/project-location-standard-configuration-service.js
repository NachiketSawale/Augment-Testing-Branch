/**
 * Created by Frank Baedeker on 26.08.2014.
 */
(function () {
	'use strict';
	var moduleName = 'project.location';

	/**
	 * @ngdoc service
	 * @name projectLocationStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).service('projectLocationStandardConfigurationService', ProjectLocationStandardConfigurationService);

	ProjectLocationStandardConfigurationService.$inject = ['platformUIConfigInitService', 'projectLocationTranslationService', 'projectLocationDetailLayout'];

	function ProjectLocationStandardConfigurationService (platformUIConfigInitService, projectLocationTranslationService, projectLocationDetailLayout) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectLocationDetailLayout,
			dtoSchemeId: { typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
			translator: projectLocationTranslationService
		});
	}
})();
