/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.productionplace';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [{
				serviceName: 'productionplanningProductionplaceWizardService',
				wizardGuid: '30c25c43ce0b4450806763d21bbc43cc',
				methodName: 'enablePlace',
				canActivate: true
			}, {
				serviceName: 'productionplanningProductionplaceWizardService',
				wizardGuid: '57b38025007a48e7bc7a7ce912bb6ee0',
				methodName: 'disablePlace',
				canActivate: true
			}];

			const options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							{typeName: 'PpsProductionPlaceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
							{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
							{typeName: 'PhaseForPlanningBoardDto',moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'PpsPhaseRequirementDto',moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'PpsMaintenanceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
							{typeName: 'GenericDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'productionplanning.processconfiguration', 'productionplanning.formwork']);
					}],
					'loadLookup': ['basicsLookupdataLookupDescriptorService', function(basicsLookupdataLookupDescriptorService){
						basicsLookupdataLookupDescriptorService.loadData([
							'SiteType' // preload SiteType lookup for site filter container of ProductionPlace module (#140039)
						]);
					}],
					'loadItemCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningItemTranslationService', function (customColumnsServiceFactory, translationServ) {
						var customColumnsService = customColumnsServiceFactory.getService('productionplanning.item');
						return customColumnsService.init('productionplanning/item/customcolumn').then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(
		['$injector', 'platformModuleNavigationService', 'cloudDesktopSidebarService',
			function ($injector, naviService, cloudDesktopSidebarService) {
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (item, triggerField) {
							var dataService = $injector.get('ppsProductionPlaceDataService');
							if (!_.isNil(item.Id) && triggerField === 'SiteFk') {
								dataService.nevigateBySite(item); // site item
							}
						}
					}
				);
			}]
	);
})(angular);
