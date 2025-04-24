(function () {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).service('ppsDrawingRevisionUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService',
		'productionplanningDrawingContainerInformationService',
		'productionplanningDrawingTranslationService'];

	function UIStandardService(uiConfigInitService,
							   containerInformationService,
							   translationService) {
		uiConfigInitService.createUIConfigurationService({
			service: this,
			layout: containerInformationService.getPpsDrawingRevisionLayout(),
			dtoSchemeId: {
				moduleSubModule: 'ProductionPlanning.Drawing',
				typeName: 'EngTmplRevisionDto'
			},
			translator: translationService
		});
	}
})();