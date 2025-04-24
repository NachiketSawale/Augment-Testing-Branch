(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).service('ppsProductionPlaceChildrenUIService', [
		'platformUIConfigInitService',
		'ppsProductionPlaceChildrenLayout',
		'ppsProductionPlaceChildrenLayoutConfig',
		'platformUIStandardExtentService',
		'productionplanningProductTranslationService',
		function (platformUIConfigInitService,
			ppsProductionPlaceChildrenLayout,
			ppsProductionPlaceChildrenLayoutConfig,
			platformUIStandardExtentService,
			productTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: ppsProductionPlaceChildrenLayout,
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.ProductionPlace',
					typeName: 'PpsProdPlaceToProdPlaceDto'
				},
				translator: productTranslationService
			});
			platformUIStandardExtentService.extend(this, ppsProductionPlaceChildrenLayoutConfig.addition);
			this.getStandardConfigForListView().columns.forEach(function (c) {
				c.sortable = false;
			});
		}
	]);
})();