/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/*
	 ** model.map module is created.
	 */
	var moduleName = 'model.map';
	var languageModuleName = 'cloud.common';

	angular.module(moduleName, [languageModuleName, 'platform', 'basics.common', 'basics.config']);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', 'platformSidebarWizardDefinitions', '_',
		function (mainViewServiceProvider, platformSidebarWizardDefinitions, _) {
			var wizardData = _.concat([
				{
					serviceName: 'modelMapSpacedLevelWizardService',
					wizardGuid: 'e7db52fdebdf4a96b962a07e15d32cc0',
					methodName: 'showDialog',
					canActivate: true
				},
				{
					serviceName: 'modelMapPopulateMapsFromLocationTreeWizardService',
					wizardGuid: '3d07cfaab89f4f6cad57341395337cf8',
					methodName: 'showDialog',
					canActivate: true
				},
				{
					serviceName: 'modelMapFloorPlanGenerationWizardService',
					wizardGuid: '6374744d76314bd08d3ae01e5fa21b0c',
					methodName: 'runWizard',
					canActivate: true
				}
			], platformSidebarWizardDefinitions.model.sets.default);

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						platformSchemaService.initialize();
						return platformSchemaService.getSchemas([
							{typeName: 'MapDto', moduleSubModule: 'Model.Map'},
							{typeName: 'MapLevelDto', moduleSubModule: 'Model.Map'},
							{typeName: 'MapPolygonDto', moduleSubModule: 'Model.Map'},
							{typeName: 'MapAreaDto', moduleSubModule: 'Model.Map'}
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}

	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('modelMapDataService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);


