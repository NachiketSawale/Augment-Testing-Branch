/**
 * Created by lvy on 4/12/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).factory('constructionSystemMasterGlobalParameterValueUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterGlobalParameterValueDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterGlobalParameterValueDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {
				var service={};
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosGlobalParamValueDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				service.service = new StructureUIStandardService(constructionSystemMasterGlobalParameterValueDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				// platformUIStandardExtentService.extend(service, constructionSystemMasterParameterValueDetailLayout.addition, attributeDomains);
				return service.service;
			}
		]);
})(angular);
