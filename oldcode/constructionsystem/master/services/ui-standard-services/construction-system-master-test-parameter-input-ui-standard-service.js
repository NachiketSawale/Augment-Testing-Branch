(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterTestParameterInputUIStandardService',
		['platformUIStandardConfigService',
			'constructionSystemMasterTestParameterInputDetailLayout',
			'platformSchemaService',
			'platformUIStandardExtentService',
			'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService,
				constructionSystemMasterTestParameterInputDetailLayout,
				platformSchemaService,
				platformUIStandardExtentService,
				constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosParameterDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = angular.copy(attributeDomains.properties);
				if(attributeDomains.UomFk) {
					attributeDomains.UomFk.mandatory = false; // get rid of the red dot in grid, this field is readonly here
				}

				var service = new StructureUIStandardService(constructionSystemMasterTestParameterInputDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterTestParameterInputDetailLayout.addition, attributeDomains);

				return service;
			}
		]);
})(angular);