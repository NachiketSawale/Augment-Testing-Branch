(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterControllingGroupUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterControllingGroupDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, constructionSystemMasterControllingGroupDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosControllingGroupDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;

				var service = new StructureUIStandardService(constructionSystemMasterControllingGroupDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterControllingGroupDetailLayout.addition, attributeDomains);

				var configForDetailView = service.getStandardConfigForDetailView();
				configForDetailView.rows[0].options.lookupOptions.descriptionMember = configForDetailView.rows[0].options.descriptionMember;
				configForDetailView.rows[1].options.lookupOptions.descriptionMember = configForDetailView.rows[1].options.descriptionMember;

				return service;
			}
		]);
})(angular);