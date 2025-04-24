(function(angular){

	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonPrcItemInfoBlUIStandardService', procurementPrcItemInfoBlUIStandardService);

	procurementPrcItemInfoBlUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'platformUIStandardExtentService',
		'procurementCommonPrcItemInfoBlLayoutService', 'procurementPackageTranslationService'];

	function procurementPrcItemInfoBlUIStandardService(platformUIStandardConfigService, platformSchemaService, platformUIStandardExtentService,
		procurementPrcItemInfoBlLayoutService, procurementPackageTranslationService){


		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PrcItemInfoBLDto',
			moduleSubModule: 'Procurement.Common'
		});

		if(attributeDomains){
			attributeDomains = attributeDomains.properties;
		}

		function StructureUIStandardService(layout, dtoScheme, translationService) {
			BaseService.call(this, layout, dtoScheme, translationService);
		}

		StructureUIStandardService.prototype = Object.create(BaseService.prototype);
		StructureUIStandardService.prototype.constructor = StructureUIStandardService;

		return new StructureUIStandardService(procurementPrcItemInfoBlLayoutService, attributeDomains, procurementPackageTranslationService);
	}
})(angular);