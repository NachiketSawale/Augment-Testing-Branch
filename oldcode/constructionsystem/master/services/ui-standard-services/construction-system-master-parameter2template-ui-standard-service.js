/**
 * Created by chi on 5/26/2016.
 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').factory('constructionSystemMasterParameter2TemplateUIStandardService', constructionSystemMasterParameter2TemplateUIStandardService);
	constructionSystemMasterParameter2TemplateUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'constructionSystemMasterParameter2TemplateDetailLayout',
		'constructionsystemMasterTranslationService',
		'platformUIStandardExtentService'
	];
	function constructionSystemMasterParameter2TemplateUIStandardService(
		platformUIStandardConfigService,
		platformSchemaService,
		constructionSystemMasterParameter2TemplateDetailLayout,
		constructionsystemMasterTranslationService,
		platformUIStandardExtentService
	) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'CosParameter2TemplateDto', moduleSubModule: 'ConstructionSystem.Master' }).properties;
		var service = new BaseService(constructionSystemMasterParameter2TemplateDetailLayout, domains, constructionsystemMasterTranslationService);

		platformUIStandardExtentService.extend(service, constructionSystemMasterParameter2TemplateDetailLayout.addition, domains);
		return service;
	}
})(angular);