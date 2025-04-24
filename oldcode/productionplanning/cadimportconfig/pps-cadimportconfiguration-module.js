(function (angular) {
	'use strict';
	/*global globals*/

	var moduleName = 'productionplanning.cadimportconfig';
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
									{typeName: 'EngCadImportConfigDto', moduleSubModule: 'ProductionPlanning.CadImportConfig'},
									{typeName: 'EngCadValidationDto', moduleSubModule: 'ProductionPlanning.CadImportConfig'}
								]);
							}
						]
					}
				};
				platformLayoutService.registerModule(options);
			}
		]);
})(angular);