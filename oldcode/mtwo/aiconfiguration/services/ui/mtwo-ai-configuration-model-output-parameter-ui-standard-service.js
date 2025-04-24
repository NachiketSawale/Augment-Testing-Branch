/**
 * @author: chd
 * @date: 3/25/2021 11:26 AM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).service('mtwoAIConfigurationModelOutputParameterUIStandardService', MtwoAIConfigurationModelOutputParameterUIStandardService);

	MtwoAIConfigurationModelOutputParameterUIStandardService.$inject = ['platformUIConfigInitService', 'mtwoAIConfigurationContainerInformationService', 'mtwoAIConfigurationTranslationService'];

	function MtwoAIConfigurationModelOutputParameterUIStandardService(platformUIConfigInitService, mtwoAIConfigurationContainerInformationService, mtwoAIConfigurationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoAIConfigurationContainerInformationService.getModelOutputParameterLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Mtwo.AIConfiguration',
				typeName: 'ModelParameterDto'
			},
			translator: mtwoAIConfigurationTranslationService
		});
	}
})(angular);
