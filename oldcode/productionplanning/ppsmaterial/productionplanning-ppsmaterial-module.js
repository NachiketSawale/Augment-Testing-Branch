(function (angular) {
	/* global globals, angular */
	'use strict';

	/*
	 ** basic.material module is created.
	 */
	var moduleName = 'productionplanning.ppsmaterial';

	var moduleSubModule = 'ProductionPlanning.PpsMaterial';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialGroupDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialNewDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
							{typeName: 'MdcProductDescriptionDto', moduleSubModule: moduleSubModule},
							{typeName: 'MdcProductDescParamDto', moduleSubModule: moduleSubModule},
							{typeName: 'MaterialEventTypeDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsEventTypeRelDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsCad2mdcMaterialDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsMaterial2MdlProductTypeDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsMaterialCompDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsSummarizedMatDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsMaterialMappingDto', moduleSubModule: moduleSubModule},
							{typeName: 'MdcDrawingComponentDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsStrandPatternDto', moduleSubModule: 'Productionplanning.StrandPattern'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.ppsmaterial']);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'productionplanningPpsMaterialEventForComboBox'

						]);
					}]
				}

			};

			platformLayoutService.registerModule(options);
		}
	]);

})(angular);