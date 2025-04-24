/**
 * Created by chi on 2/23/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqDataFormatUIStandardService', procurementRfqDataFormatUIStandardService);

	procurementRfqDataFormatUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementRfqDataFormatDetailLayout', 'procurementRfqTranslationService'];

	function procurementRfqDataFormatUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementRfqDataFormatDetailLayout, procurementRfqTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'DataFormatDto', moduleSubModule: 'Procurement.Common'}).properties;
		return new BaseService(procurementRfqDataFormatDetailLayout, domains, procurementRfqTranslationService);
	}

})(angular);