/**
 * Created by chi on 1/31/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesAccrualUIStandardService', procurementPesAccrualUIStandardService);

	procurementPesAccrualUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementPesAccrualDetailLayout', 'procurementPesTranslationService', 'platformUIStandardExtentService'];

	function procurementPesAccrualUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementPesAccrualDetailLayout, procurementPesTranslationService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'PesAccrualDto', moduleSubModule: 'Procurement.Pes'}).properties;
		var service = new BaseService(procurementPesAccrualDetailLayout, domains, procurementPesTranslationService);
		platformUIStandardExtentService.extend(service, procurementPesAccrualDetailLayout.addition, domains);
		return service;
	}
})(angular);