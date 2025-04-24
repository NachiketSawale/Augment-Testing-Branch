(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequestDefectLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project entity.
	 **/
	angular.module(moduleName).service('projectInfoRequestDefectLayoutService', ProjectInfoRequestDefectLayoutService);

	ProjectInfoRequestDefectLayoutService.$inject = ['platformUIConfigInitService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService'];

	function ProjectInfoRequestDefectLayoutService(platformUIConfigInitService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectInfoRequestContainerInformationService.getDefectLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Defect.Main',
				typeName: 'DfmDefectDto'
			},
			translator: projectInfoRequestTranslationService
		});
	}
})(angular);
