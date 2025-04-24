(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequestChangeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project entity.
	 **/
	angular.module(moduleName).service('projectInfoRequestChangeLayoutService', ProjectInfoRequestChangeLayoutService);

	ProjectInfoRequestChangeLayoutService.$inject = ['platformUIConfigInitService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService'];

	function ProjectInfoRequestChangeLayoutService(platformUIConfigInitService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectInfoRequestContainerInformationService.getChangeLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Change.Main',
				typeName: 'ChangeDto'
			},
			translator: projectInfoRequestTranslationService
		});
	}
})(angular);
