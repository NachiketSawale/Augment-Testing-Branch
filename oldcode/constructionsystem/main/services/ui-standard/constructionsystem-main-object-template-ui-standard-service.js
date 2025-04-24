/**
 * Created by lvy on 6/12/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainObjectTemplateUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMainUIConfigurationService', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMainTranslationService',
			function (platformUIStandardConfigService, constructionSystemMainUIConfigurationService, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMainTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosInsObjectTemplateDto', moduleSubModule: 'ConstructionSystem.Main' });

				attributeDomains = attributeDomains.properties;
				var constructionSystemMainObjectTemplateDetailLayout = constructionSystemMainUIConfigurationService.getConstructionSystemMainObjectTemplateDetailLayout();

				var service;
				service= new StructureUIStandardService(constructionSystemMainObjectTemplateDetailLayout, attributeDomains, constructionsystemMainTranslationService);
				return service;
			}
		]);
})(angular);