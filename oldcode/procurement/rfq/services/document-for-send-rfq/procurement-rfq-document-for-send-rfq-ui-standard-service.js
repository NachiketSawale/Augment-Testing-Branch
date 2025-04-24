/**
 * Created by chi on 2/24/2021.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqDocumentForSendRfqUIStandardService', procurementRfqDocumentForSendRfqUIStandardService);

	procurementRfqDocumentForSendRfqUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementRfqDocumentForSendRfqDetailLayout', 'procurementRfqTranslationService'];

	function procurementRfqDocumentForSendRfqUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementRfqDocumentForSendRfqDetailLayout, procurementRfqTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ'}).properties;
		// rfq & clerk documents dont have an status
		procurementRfqDocumentForSendRfqDetailLayout = _.cloneDeep(procurementRfqDocumentForSendRfqDetailLayout);
		_.remove(procurementRfqDocumentForSendRfqDetailLayout.groups[0].attributes, function (attr) {
			return attr === 'documentstatusfk';
		});
		return new BaseService(procurementRfqDocumentForSendRfqDetailLayout, domains, procurementRfqTranslationService);
	}

})(angular);

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqProjectDocumentsUIStandardService', procurementRfqDocumentForSendRfqUIStandardService);

	procurementRfqDocumentForSendRfqUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementRfqDocumentForSendRfqDetailLayout', 'procurementRfqTranslationService'];

	function procurementRfqDocumentForSendRfqUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementRfqDocumentForSendRfqDetailLayout, procurementRfqTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ'}).properties;
		return new BaseService(procurementRfqDocumentForSendRfqDetailLayout, domains, procurementRfqTranslationService);
	}

})(angular);

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqStructureDocumentsUIStandardService', procurementRfqDocumentForSendRfqUIStandardService);

	procurementRfqDocumentForSendRfqUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'procurementRfqDocumentForSendRfqDetailLayout', 'procurementRfqTranslationService'];

	function procurementRfqDocumentForSendRfqUIStandardService(platformUIStandardConfigService, platformSchemaService,
		procurementRfqDocumentForSendRfqDetailLayout, procurementRfqTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'DocumentResultDto', moduleSubModule: 'Procurement.RfQ'}).properties;
		// structure documents should have a structure code and a structure description
		procurementRfqDocumentForSendRfqDetailLayout = _.cloneDeep(procurementRfqDocumentForSendRfqDetailLayout);
		procurementRfqDocumentForSendRfqDetailLayout.groups[0].attributes.push('prcstructurecode', 'prcstructuredescription');
		_.remove(procurementRfqDocumentForSendRfqDetailLayout.groups[0].attributes, function (attr) {
			return attr === 'documentstatusfk';
		});
		return new BaseService(procurementRfqDocumentForSendRfqDetailLayout, domains, procurementRfqTranslationService);
	}

})(angular);

