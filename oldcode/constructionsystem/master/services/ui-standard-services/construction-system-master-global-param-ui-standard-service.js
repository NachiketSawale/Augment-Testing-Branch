/**
 * Created by lvy on 4/3/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterGlobalParameterUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterGlobalParameterDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterGlobalParameterDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosGlobalParamDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service;
				service= new StructureUIStandardService(constructionSystemMasterGlobalParameterDetailLayout, attributeDomains, constructionsystemMasterTranslationService);

				platformUIStandardExtentService.extend(service, constructionSystemMasterGlobalParameterDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);
