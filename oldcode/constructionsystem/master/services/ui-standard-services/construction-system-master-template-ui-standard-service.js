/**
 * Created by chi on 5/26/2016.
 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').factory('constructionSystemMasterTemplateUIStandardService', constructionSystemMasterTemplateUIStandardService);
	constructionSystemMasterTemplateUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'constructionSystemMasterTemplateDetailLayout',
		'constructionsystemMasterTranslationService'
	];
	function constructionSystemMasterTemplateUIStandardService(
		platformUIStandardConfigService,
		platformSchemaService,
		constructionSystemMasterTemplateDetailLayout,
		constructionsystemMasterTranslationService
	) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'CosTemplateDto', moduleSubModule: 'ConstructionSystem.Master' }).properties;
		return new BaseService(constructionSystemMasterTemplateDetailLayout, domains, constructionsystemMasterTranslationService);
	}
})(angular);