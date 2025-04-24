(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequest2ExternalLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  Inforequest2External entity.
	 **/
	angular.module(moduleName).service('projectInfoRequest2ExternalLayoutService', ProjectInfoRequest2ExternalLayoutService);

	ProjectInfoRequest2ExternalLayoutService.$inject = ['platformUIConfigInitService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService'];

	function ProjectInfoRequest2ExternalLayoutService(platformUIConfigInitService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectInfoRequestContainerInformationService.getExternalLayout(),
			dtoSchemeId: {typeName: 'InfoRequest2ExternalDto', moduleSubModule: 'Project.InfoRequest'},
			translator: projectInfoRequestTranslationService
		});
	}
})(angular);