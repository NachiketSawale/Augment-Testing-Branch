(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterHeaderUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterHeaderDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterHeaderDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosHeaderDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;
				attributeDomains['ChangeOption.IsCopyLineItems'] = {domain: 'boolean'};
				attributeDomains['ChangeOption.IsMergeLineItems'] = {domain: 'boolean'};
				attributeDomains['ChangeOption.IsChange'] = {domain: 'boolean'};
				attributeDomains['CosTemplateFk'] = {domain: 'integer'};

				var service = new StructureUIStandardService(constructionSystemMasterHeaderDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterHeaderDetailLayout.addition, attributeDomains);
				return service;
			}
		]);
})(angular);