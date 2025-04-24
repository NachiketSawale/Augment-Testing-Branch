
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.stock';

	angular.module(moduleName).factory('procurementStockAccrualUIStandardService', procurementStockAccrualUIStandardService);

	procurementStockAccrualUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementStockAccrualDetailLayout', 'procurementStockTranslationService', 'platformUIStandardExtentService'];

	function procurementStockAccrualUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementStockAccrualDetailLayout, procurementStockTranslationService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'CompanyTrans2StockDto', moduleSubModule: 'Procurement.Stock'}).properties;
		var service = new BaseService(procurementStockAccrualDetailLayout, domains, procurementStockTranslationService);
		platformUIStandardExtentService.extend(service, procurementStockAccrualDetailLayout.addition, domains);
		return service;
	}
})(angular);