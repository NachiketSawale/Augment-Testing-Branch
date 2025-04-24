/**
 * Created by chk on 12/22/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').factory('constructionSystemMasterParameterGroupUIStandardService',
		['platformUIStandardConfigService', 'constructionSystemMasterParameterGroupDetailLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function (platformUIStandardConfigService, ParameterGroupDetailLayout, platformSchemaService,
				platformUIStandardExtentService, constructionsystemMasterTranslationService) {
				var service={};
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CosParameterGroupDto',
					moduleSubModule: 'ConstructionSystem.Master'
				});

				attributeDomains = attributeDomains.properties;

				service.service = new StructureUIStandardService(ParameterGroupDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				// platformUIStandardExtentService.extend(service, ParameterGroupDetailLayout.addition, attributeDomains);
				return service.service;
			}
		]);
})(angular);