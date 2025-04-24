(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('constructionsystem.master').factory('constructionSystemMasterModelObjectUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterModelObjectDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'modelMainTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterModelObjectDetailLayout, platformSchemaService,
				// eslint-disable-next-line no-mixed-spaces-and-tabs
						  platformUIStandardExtentService, modelMainTranslationService) {
				var service={};
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main' });
				// var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ModelObjectDto', moduleSubModule: 'ConstructionSystem.Master' });//todo:use Model.Main replace

				attributeDomains = attributeDomains.properties;

				service.service = new StructureUIStandardService(constructionSystemMasterModelObjectDetailLayout, attributeDomains, modelMainTranslationService);
				return service.service;
			}
		]);
})(angular);