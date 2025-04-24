/**
 * @author: chd
 * @date: 3/25/2021 10:53 AM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).service('mtwoAIConfigurationModelInputParameterUIStandardService', MtwoAIConfigurationModelInputParameterUIStandardService);

	MtwoAIConfigurationModelInputParameterUIStandardService.$inject = ['platformUIConfigInitService', 'mtwoAIConfigurationContainerInformationService', 'mtwoAIConfigurationTranslationService'];

	function MtwoAIConfigurationModelInputParameterUIStandardService(platformUIConfigInitService, mtwoAIConfigurationContainerInformationService, mtwoAIConfigurationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoAIConfigurationContainerInformationService.getModelInputParameterLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Mtwo.AIConfiguration',
				typeName: 'ModelParameterDto'
			},
			translator: mtwoAIConfigurationTranslationService
		});
	}
})(angular);
