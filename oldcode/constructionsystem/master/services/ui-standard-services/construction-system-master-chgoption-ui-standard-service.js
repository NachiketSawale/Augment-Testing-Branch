/**
 * Created by wui on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterChgOptionUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterChgOptionDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterChgOptionDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosChgOption2HeaderDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service = new StructureUIStandardService(constructionSystemMasterChgOptionDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterChgOptionDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);