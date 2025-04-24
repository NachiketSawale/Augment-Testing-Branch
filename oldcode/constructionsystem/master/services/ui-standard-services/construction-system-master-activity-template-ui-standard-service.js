(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterActivityTemplateUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterActivityTemplateDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterActivityTemplateDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosActivityTemplateDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service = new StructureUIStandardService(constructionSystemMasterActivityTemplateDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterActivityTemplateDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);