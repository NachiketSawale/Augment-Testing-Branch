/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';
	/*global globals*/

	var moduleName = 'productionplanning.accounting';
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
									{typeName: 'RuleSetDto', moduleSubModule: 'ProductionPlanning.Accounting'},
									{typeName: 'ResultDto', moduleSubModule: 'ProductionPlanning.Accounting'},
									{typeName: 'RuleDto', moduleSubModule: 'ProductionPlanning.Accounting'},
									{typeName: 'PpsUpstreamItemTemplateDto', moduleSubModule: 'ProductionPlanning.Configuration'},
									{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
									{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								]);
							}
						],
						'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName, 'productionplanning.common']);
						}],
						'loadLookupData': ['ppsAccountingResultUpstreamTargetDataService', function (accountingResultDataService) {
							return accountingResultDataService.getUpstreamItemTarget$();
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
					navFunc: function (item) {
						var accountingService = $injector.get('productionplanningAccountingMainDataService');

						accountingService.navigatedByCode(item);
					}

				});
			}]);


})(angular);