/**
 * Created by baf on 03.05.2019
 */

(function (angular) {
	'use strict';
	const moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentControllingUnitLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment controllingUnit entity.
	 **/
	angular.module(moduleName).service('projectMainPictureLayoutService', ProjectMainPictureLayoutService);

	ProjectMainPictureLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainPictureLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectPictureLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.picture,
			translator: projectMainTranslationService
		});
	}
})(angular);