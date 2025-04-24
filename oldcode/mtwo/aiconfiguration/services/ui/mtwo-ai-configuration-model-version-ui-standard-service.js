/**
 * @author: chd
 * @date: 3/24/2021 10:24 AM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).service('mtwoAIConfigurationModelVersionUIStandardService', MtwoAIConfigurationModelVersionUIStandardService);

	MtwoAIConfigurationModelVersionUIStandardService.$inject = ['platformUIConfigInitService', 'mtwoAIConfigurationContainerInformationService', 'mtwoAIConfigurationTranslationService'];

	function MtwoAIConfigurationModelVersionUIStandardService(platformUIConfigInitService, mtwoAIConfigurationContainerInformationService, mtwoAIConfigurationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoAIConfigurationContainerInformationService.getModelVersionLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Mtwo.AIConfiguration',
				typeName: 'ModelVersionDto'
			},
			translator: mtwoAIConfigurationTranslationService
		});
	}
})(angular);
