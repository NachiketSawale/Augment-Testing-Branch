/**
 * Created by zwz on 2024/5/22.
 */
(function () {
	'use strict';
	const moduleName = 'productionplanning.ppsmaterial';
	/**
	 * @ngdoc service
	 * @name ppsMaterialToMdlProductTypeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsMaterialToMdlProductTypeUIStandardService', PpsMaterialToMdlProductTypeUIStandardService);

	PpsMaterialToMdlProductTypeUIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningPpsMaterialTranslationService',
		'platformSchemaService', 'ppsMaterialToMdlProductTypeLayout',
		'platformUIStandardExtentService', 'ppsMaterialToMdlProductTypeLayoutConfig'];

	function PpsMaterialToMdlProductTypeUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
											   platformSchemaService, ppsMaterialToMdlProductTypeLayout,
											   platformUIStandardExtentService, ppsMaterialToMdlProductTypeLayoutConfig) {

		let BaseService = platformUIStandardConfigService;

		let dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsMaterial2MdlProductTypeDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial'
		});
		let schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}
		function MaterialToProductTypeUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		MaterialToProductTypeUIStandardService.prototype = Object.create(BaseService.prototype);
		MaterialToProductTypeUIStandardService.prototype.constructor = MaterialToProductTypeUIStandardService;

		const trKey = 'productionplanning.ppsmaterial.ppsMaterialToMdlProductType.description';
		let service = new BaseService(ppsMaterialToMdlProductTypeLayout, schemaProperties, ppsMaterialTranslationService);
		let mappingColumn = service.getStandardConfigForListView().columns.find(e => e.id === 'description');
		mappingColumn.name = '*3D Object Type';
		mappingColumn.name$tr$ = trKey;
		let mappingRow = service.getStandardConfigForDetailView().rows.find(e => e.rid === 'description');
		mappingRow.label = '*3D Object Type';
		mappingRow.label$tr$ = trKey;

		platformUIStandardExtentService.extend(service, ppsMaterialToMdlProductTypeLayoutConfig.addition, schemaProperties);
		return service;
	}
})();