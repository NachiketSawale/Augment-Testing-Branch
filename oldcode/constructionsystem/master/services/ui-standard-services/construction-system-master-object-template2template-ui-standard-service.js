/**
 * Created by lvy on 9/7/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterObjectTemplate2TemplateUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterObjectTemplateDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterObjectTemplateDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosObjectTemplate2TemplateDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service;
				service= new StructureUIStandardService(constructionSystemMasterObjectTemplateDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				return service;
			}
		]);
})(angular);