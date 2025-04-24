/**
 * Created by anl on 4/25/2019.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingResultUIStandardService', ResultUIStandardService);

	ResultUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningAccountingTranslationService',
		'platformSchemaService', 'platformUIStandardExtentService', 'productionplanningAccountingResultLayout',
		//'productionplanningAccountingResultLayoutConfig',
		'productionplanningAccountingResultDataService'];

	function ResultUIStandardService(platformUIStandardConfigService, ppsRAccountingTranslationService,
									 platformSchemaService, platformUIStandardExtentService, resultLayout, //resultLayoutConfig,
									 resultService) {
		function createService(dataService) {
			var oDataService = dataService || resultService;
			var BaseService = platformUIStandardConfigService;

			var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'ResultDto',
				moduleSubModule: 'ProductionPlanning.Accounting'
			});
			ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

			var service = new BaseService(resultLayout, ruleSetAttributeDomains, ppsRAccountingTranslationService);

			var detailView = service.getStandardConfigForDetailView();
			_.forEach(detailView.rows, function (row) {
				row.change = function (entity, field) {
					oDataService.handleFieldChanged(entity, field);
				};
			});

			platformUIStandardExtentService.extend(service, resultLayout.addition, ruleSetAttributeDomains);

			return service;
		}

		var serviceCache = {};

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		var service = createService();
		service.getService = getService;
		return service;
	}
})();