/**
 * Created by lvy on 6/13/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainObjectTemplatePropertyUIStandardService',
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

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosInsObjectTemplatePropertyDto', moduleSubModule: 'ConstructionSystem.Main' });

				attributeDomains = attributeDomains.properties;
				attributeDomains.Value = {domain: 'dynamic'};
				var constructionSystemMainObjectTemplatePropertyDetailLayout = constructionSystemMainUIConfigurationService.getConstructionSystemMainObjectTemplatePropertyDetailLayout();

				var service;
				service= new StructureUIStandardService(constructionSystemMainObjectTemplatePropertyDetailLayout, attributeDomains, constructionsystemMainTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMainObjectTemplatePropertyDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);