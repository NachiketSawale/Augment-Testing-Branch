// .js

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('costGroupStructureUIServiceFactory', [
		'platformUIStandardConfigService',
		'costGroupStructureTranslationService',
		'costGroupStructureLayoutServiceFactory',
		'platformSchemaService',
		function (UIStandardConfigService,
			costGroupStructureTranslationService,
			costGroupStructureLayoutServiceFactory,
			platformSchemaService) {

			let schemaId = {typeName: 'CostGroupDto', moduleSubModule: 'Project.Main'};
			let domainSchema = platformSchemaService.getSchemaFromCache(schemaId);
			let layoutService = costGroupStructureLayoutServiceFactory.getService();
			let detailLayout = layoutService.getLayout();
			return new UIStandardConfigService(detailLayout, domainSchema.properties, costGroupStructureTranslationService);

		}]);
})();
