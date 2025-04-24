/**
 * Created by chi on 2/20/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqBidderSettingUIStandardService', procurementRfqBidderSettingUIStandardService);

	procurementRfqBidderSettingUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementRfqBidderSettingDetailLayout', 'procurementRfqTranslationService'];

	function procurementRfqBidderSettingUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementRfqBidderSettingDetailLayout, procurementRfqTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'RfqBidderSettingDto', moduleSubModule: 'Procurement.RfQ'}).properties;
		return new BaseService(procurementRfqBidderSettingDetailLayout, domains, procurementRfqTranslationService);
	}

})(angular);
