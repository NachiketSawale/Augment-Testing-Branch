(function () {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).service('ppsDrawingTmplRevisionUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService',
		'productionplanningDrawingContainerInformationService',
		'productionplanningDrawingTranslationService'];

	function UIStandardService(uiConfigInitService,
							   containerInformationService,
							   translationService) {
		uiConfigInitService.createUIConfigurationService({
			service: this,
			layout: containerInformationService.getPpsDrawingTmplRevisionLayout(),
			dtoSchemeId: {
				moduleSubModule: 'ProductionPlanning.Drawing',
				typeName: 'EngTmplRevisionDto'
			},
			translator: translationService
		});
	}
})();