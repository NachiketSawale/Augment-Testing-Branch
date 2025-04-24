(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.unit';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var wizardData = [{
					serviceName: 'basicsUnitExportWizardService',
					wizardGuid: 'eca274b1a9cb4faeb2a2980580027b20',
					methodName: 'exportUom',
					canActivate: true
				},{
					serviceName: 'basicsUnitExportWizardService',
					wizardGuid: 'd2a06eef8a4543718303e353bab7bf21',
					methodName: 'importUom',
					canActivate: true
				}
				];


				var options = {
					moduleName: moduleName,
					resolve: {
						loadDomains: ['$q', 'platformSchemaService', 'basicsCommonCodeDescriptionSettingsService',

							function ($q, platformSchemaService, basicsCommonCodeDescriptionSettingsService) {
								return $q.all(
									[platformSchemaService.getSchemas([
										{typeName: 'UomDto', moduleSubModule: 'Basics.Unit'},
										{typeName: 'UomSynonymDto', moduleSubModule: 'Basics.Unit'}
									]),
									basicsCommonCodeDescriptionSettingsService.loadSettings([
										{typeName: 'UomEntity', modul: 'Basics.Unit'}
									])]
								);
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
		]).run(['$injector', 'platformModuleNavigationService',
		// eslint-disable-next-line func-names
			function ($injector, platformModuleNavigationService) {
				platformModuleNavigationService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (/* item, triggerField */) {
						}
					}
				);
			}]);


})(angular);





