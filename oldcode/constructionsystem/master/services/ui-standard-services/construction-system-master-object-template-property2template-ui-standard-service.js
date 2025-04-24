/**
 * Created by lvy on 9/7/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterObjectTemplateProperty2TemplateUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterObjectTemplatePropertyDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterObjectTemplatePropertyDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosObjectTemplateProperty2TemplateDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;
				attributeDomains.Value = {domain: 'dynamic'};

				var service;
				service= new StructureUIStandardService(constructionSystemMasterObjectTemplatePropertyDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterObjectTemplatePropertyDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);