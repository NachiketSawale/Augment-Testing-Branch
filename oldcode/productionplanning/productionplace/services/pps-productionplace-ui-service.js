(function () {
	'use strict';
	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceUIService', [
		'platformUIConfigInitService',
		'platformUIStandardExtentService',
		'ppsProductionPlaceLayoutFactory',
		'ppsProductionPlaceLayoutConfig',
		'productionplanningProductionPlaceTranslationService',
		'ppsCommonLayoutOverloadService',
		function (platformUIConfigInitService,
			platformUIStandardExtentService,
			ppsProductionPlaceLayoutFactory,
			ppsProductionPlaceLayoutConfig,
			ppsProductionPlaceTranslationService,
			ppsCommonLayoutOverloadService) {

			const uiService = {};
			const productionPlaceLayout = ppsProductionPlaceLayoutFactory.createLayout();

			platformUIConfigInitService.createUIConfigurationService({
				service: uiService,
				layout: productionPlaceLayout,
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.ProductionPlace',
					typeName: 'PpsProductionPlaceDto'
				},
				translator:  ppsProductionPlaceTranslationService
			});
			platformUIStandardExtentService.extend(uiService, ppsProductionPlaceLayoutConfig.addition);

			ppsCommonLayoutOverloadService.translateCustomUom(uiService);

			return uiService;
		}
	]);
})();