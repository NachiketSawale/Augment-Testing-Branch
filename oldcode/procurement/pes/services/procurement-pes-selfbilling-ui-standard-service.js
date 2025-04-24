/**
 * Created by lsi on 7/1/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesSelfbillingUIStandardService', procurementPesSelfbillingUIStandardService);
	procurementPesSelfbillingUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementPesSelfbillingDetailLayout', 'procurementPesTranslationService'];

	function procurementPesSelfbillingUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementPesSelfbillingDetailLayout, procurementPesTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'PesSelfBillingDto', moduleSubModule: 'Procurement.Pes'}).properties;
		return new BaseService(procurementPesSelfbillingDetailLayout, domains, procurementPesTranslationService);
	}
})(angular);
