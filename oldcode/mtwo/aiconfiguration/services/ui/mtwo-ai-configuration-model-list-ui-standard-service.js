/**
 * @author: chd
 * @date: 3/16/2021 11:41 AM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).service('mtwoAIConfigurationModelListUIStandardService', MtwoAIConfigurationModelListUIStandardService);

	MtwoAIConfigurationModelListUIStandardService.$inject = ['platformUIConfigInitService', 'mtwoAIConfigurationContainerInformationService', 'mtwoAIConfigurationTranslationService'];

	function MtwoAIConfigurationModelListUIStandardService(platformUIConfigInitService, mtwoAIConfigurationContainerInformationService, mtwoAIConfigurationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: mtwoAIConfigurationContainerInformationService.getModelListLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Mtwo.AIConfiguration',
				typeName: 'ModelDto'
			},
			translator: mtwoAIConfigurationTranslationService
		});
	}
})(angular);
