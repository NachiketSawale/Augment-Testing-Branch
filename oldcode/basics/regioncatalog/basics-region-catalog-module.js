/**
 * Created by jhe on 7/24/2018.
 */
(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var wizardData = [{
					serviceName: 'basicsRegionCatalogSidebarWizardService',
					wizardGuid: 'b94584bff9114c089ec8bb46da4a0810',
					methodName: 'alertInfo',
					canActivate: true
				}
				];

				var options = {
					moduleName: moduleName,
					resolve: {
						loadDomains: ['$q', 'platformSchemaService', 'basicsCommonCodeDescriptionSettingsService',

							function ($q, platformSchemaService, basicsCommonCodeDescriptionSettingsService) {
								return $q.all([platformSchemaService.getSchemas([
									{typeName: 'RegionCatalogDto', moduleSubModule: 'Basics.RegionCatalog'},
									{typeName: 'RegionTypeDto', moduleSubModule: 'Basics.RegionCatalog'}
								]),
								basicsCommonCodeDescriptionSettingsService.loadSettings([
									{typeName: 'RegionCatalogEntity', modul: 'Basics.RegionCatalog'},
									{typeName: 'RegionTypeEntity', modul: 'Basics.RegionCatalog'}
								])
								]);
							}],
						loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
						}],
						loadTranslation: ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName, 'usermanagement.group', 'usermanagement.right'], true);
						}]
					}
				};

				platformLayoutService.registerModule(options);
			}
		]);


})(angular);





