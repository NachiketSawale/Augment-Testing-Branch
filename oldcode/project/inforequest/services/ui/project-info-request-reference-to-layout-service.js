
(function (angular) {
	'use strict';
	
	
	
	let moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequestReferenceToLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project inforequest entity.
	 **/
	angular.module(moduleName).service('projectInfoRequestReferenceToLayoutService', ProjectInfoRequestReferenceToLayoutService);

	ProjectInfoRequestReferenceToLayoutService.$inject = ['platformUIConfigInitService', 'platformContainerConfigurationService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService','projectInfoRequestConstantValues'];

	function ProjectInfoRequestReferenceToLayoutService(platformUIConfigInitService, platformContainerConfigurationService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService, projectInfoRequestConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectInfoRequestContainerInformationService.getReferenceToLayout(),
			dtoSchemeId: projectInfoRequestConstantValues.schemes.requestReference,
			translator: projectInfoRequestTranslationService
		});
	}
})(angular);
