(function () {
	'use strict';
	/*global globals, angular*/

	var moduleName = 'productionplanning.cadimport';
	globals.modules.push(moduleName);

	angular.module(moduleName, [])
		.config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var wizardData = [{}];
				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService',
							function (platformSchemaService, wizardService) {

								wizardService.registerWizard(wizardData);

								return platformSchemaService.getSchemas([
									{typeName: 'EngCadImportDto', moduleSubModule: 'ProductionPlanning.CadImport'},
									{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
									{typeName: 'EngDrawingComponentDto', moduleSubModule: 'ProductionPlanning.Drawing'},
									{typeName: 'EngStackDto', moduleSubModule: 'ProductionPlanning.Drawing'},
									{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'ImportLogDto', moduleSubModule: 'ProductionPlanning.Drawing'},
									{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
									{typeName: 'EngCadImportPreviewDto', moduleSubModule: 'ProductionPlanning.Drawing'},
									{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								]);
							}
						],
						'loadCustomColumns': ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
							var customColumnsService = customColumnsServiceFactory.getService('productionplanning.drawing');
							return customColumnsService.init('productionplanning/drawing/customcolumn');
						}]
					}
				};
				platformLayoutService.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService',
		function ($injector, platformModuleNavigationService, basicsWorkflowEventService) {
			basicsWorkflowEventService.registerEvent('5ad64d1339544ebe802aa07e8a6748d3', 'Cadimport');
		}]);
})();