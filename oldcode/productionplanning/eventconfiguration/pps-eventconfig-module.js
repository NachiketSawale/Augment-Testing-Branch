/**
 * Created by anl on 6/5/2019.
 */


(function (angular) {
	'use strict';
	/*global globals*/

	var moduleName = 'productionplanning.eventconfiguration';
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
									{typeName: 'EventSeqConfigDto', moduleSubModule: 'ProductionPlanning.EventConfiguration'},
									{typeName: 'EventTemplateDto', moduleSubModule: 'ProductionPlanning.EventConfiguration'},
									{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
									{typeName: 'MaterialGroupDto',moduleSubModule: 'Basics.MaterialCatalog'},
									{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								]);
							}
						],
						'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName, 'productionplanning.common']);
						}]
					}
				};
				platformLayoutService.registerModule(options);
			}
		])
		.run(['$injector', 'platformModuleNavigationService',
			function ($injector, platformModuleNavigationService) {
				platformModuleNavigationService.registerNavigationEndpoint({
					moduleName: moduleName,
					navFunc: function () {
						// var accountingService = $injector.get('productionplanningAccountingMainDataService');
						// accountingService.navigatedByCode(item);
					}
				});
			}]);
})(angular);