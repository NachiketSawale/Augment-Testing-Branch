/**
 * Created by xsi on 2015-12-23.
 */

(function(angular){
	'use strict';
	var moduleName='constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterWicUIStandardService',
		['platformUIStandardConfigService','constructionSystemMasterWicDetailLayout','platformSchemaService',
			'platformUIStandardExtentService', 'constructionsystemMasterTranslationService',
			function(platformUIStandardConfigService,constructionSystemMasterWicDetailLayout,
				platformSchemaService,platformUIStandardExtentService,constructionsystemMasterTranslationService){

				var BaseService=platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;
				var attributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'CosWicDto', moduleSubModule: 'ConstructionSystem.Master' });

				attributeDomains = attributeDomains.properties;
				var service = new StructureUIStandardService(constructionSystemMasterWicDetailLayout, attributeDomains, constructionsystemMasterTranslationService);
				platformUIStandardExtentService.extend(service, constructionSystemMasterWicDetailLayout.addition, attributeDomains);
				return service;
			}


		]);

})(angular);
