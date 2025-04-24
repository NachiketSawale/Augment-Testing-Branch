/**
 * Created by lvy on 6/1/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterObjectTemplateUIStandardService',
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

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosObjectTemplateDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service;
				service= new StructureUIStandardService(constructionSystemMasterObjectTemplateDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				return service;
			}
		]);
})(angular);