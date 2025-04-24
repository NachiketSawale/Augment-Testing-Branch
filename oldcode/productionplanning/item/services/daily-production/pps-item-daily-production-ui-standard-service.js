(function () {
	'use strict';
	let moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemDailyProductionUIStandardService', DailyProductionUIStandardService);

	DailyProductionUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'productionplanningItemDailyProductionLayout'];

	function DailyProductionUIStandardService(platformUIStandardConfigService, ppsItemTranslationService,
		platformSchemaService, dailyProductionLayout) {

		let BaseService = platformUIStandardConfigService;

		let dailyProductionAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'PpsDailyProductionVDto', moduleSubModule: 'ProductionPlanning.ProductionSet'});
		dailyProductionAttributeDomains = dailyProductionAttributeDomains.properties;

		function DailyProductionUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		DailyProductionUIStandardService.prototype = Object.create(BaseService.prototype);
		DailyProductionUIStandardService.prototype.constructor = DailyProductionUIStandardService;

		let service = new BaseService(dailyProductionLayout, dailyProductionAttributeDomains, ppsItemTranslationService);

		let listConfig = service.getStandardConfigForListView();
		_.forEach(listConfig.columns, (column) => {
			if (!(column.id === 'fullycovered' || column.id === 'isassigned')) {
				column.editor = null;
			}
		});

		service.getStandardConfigForListView = () => {
			return listConfig;
		};

		return service;
	}
})();
