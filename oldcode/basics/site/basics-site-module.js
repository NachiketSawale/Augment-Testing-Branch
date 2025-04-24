(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'basicsSiteWizardService',
				wizardGuid: 'd2026477e01a494c8344d45b7e64c86c',
				methodName: 'enableSite',
				canActivate: true
			}, {
				serviceName: 'basicsSiteWizardService',
				wizardGuid: '91c7614f5c8f4e518586ca6ebae4c7ee',
				methodName: 'disableSite',
				canActivate: true
			}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, basicsConfigWizardSidebarService) {

							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'Site2StockDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'Site2ExternalDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'Site2TksShiftDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'PpsProductionPlaceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'},
								{typeName: 'PpsProdPlaceToProdPlaceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'Site2ClerkDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'PpsCalendarForSiteDto', moduleSubModule: 'ProductionPlanning.Common'}
							]);
						}],
					'loadProductionPlaceType': ['basicsLookupdataSimpleLookupService', 'basicsLookupdataConfigGenerator',
						function (basicsLookupdataSimpleLookupService, basicsLookupdataConfigGenerator) {
							var config = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppsproductplacetype', undefined,  null, false, {
								showIcon: true,
								customBoolProperty: 'CANHAVECHILDREN'
							});
					    return basicsLookupdataSimpleLookupService.refreshCachedData(config.options);
						}],
					'loadSiteType': ['basicsSiteSelectableProcessor', function (basicsSiteSelectableProcessor) {
						return basicsSiteSelectableProcessor.intialize();
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item) {
						if (item.BasSiteFk) {
							$injector.get('basicsSiteMainService').searchByCalId(item.BasSiteFk);
						}
						else if (item.SiteFk) {
							$injector.get('basicsSiteMainService').searchByCalId(item.SiteFk);
						}
					}
				}
			);
		}]);
})(angular);


