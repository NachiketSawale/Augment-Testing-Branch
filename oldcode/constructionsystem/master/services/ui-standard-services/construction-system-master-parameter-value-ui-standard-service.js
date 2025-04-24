/**
 * Created by chk on 12/18/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('constructionsystem.master').factory('constructionSystemMasterParameterValueUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterParameterValueDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterParameterValueDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {
				var service={};
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosParameterValueDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				service.service = new StructureUIStandardService(constructionSystemMasterParameterValueDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				// platformUIStandardExtentService.extend(service, constructionSystemMasterParameterValueDetailLayout.addition, attributeDomains);
				return service.service;
			}
		]);
})(angular);