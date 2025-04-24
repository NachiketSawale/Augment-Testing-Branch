// / <reference path='../help/10_angular/angular.js' />

(function config(angular, globals) {
	'use strict';

	/*
	 ** basics.assetmaster module is created.
	 */
	var moduleName = 'basics.assetmaster';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', function configFn(platformLayoutService) {

		var options = {
			'moduleName': moduleName,
			'resolve': {
				'loadDomains': ['platformModuleInitialConfigurationService', 'platformSchemaService', function loadDomains(platformModuleInitialConfigurationService, platformSchemaService) {
					return platformModuleInitialConfigurationService.load('Basics.AssetMaster').then(function success(modData) {
						var schemes = modData.schemes;
						schemes.push({typeName: 'AssetMasterDto', moduleSubModule: 'Basics.AssetMaster'});
						return platformSchemaService.getSchemas(schemes);
					});
				}],
				'loadLookup': ['basicsLookupdataLookupDefinitionService', function loadLookup(basicsLookupdataLookupDefinitionService) {
					return basicsLookupdataLookupDefinitionService.load(['businessPartnerMainSupplierLookup']);
				}]
			}
		};

		platformLayoutService.registerModule(options);
	}
	]).run(['$injector', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', 'platformModuleNavigationService', function init($injector, layoutService, wizardService, naviService) {
		naviService.registerNavigationEndpoint({
			moduleName: moduleName,
			navFunc: function () {
				// use injector because Data-Services can not initialized in Run Phase -> too early
				$injector.get('basicsAssetMasterService');
				naviService.getNavFunctionByModule('basics.assetmaster').apply(this, arguments);
			}
		});

		var wizardData = [{
			serviceName: 'basicsAssetMasterSidebarWizardService',
			wizardGuid: '42c90587057c4decb67099b9b0acb911',
			methodName: 'enableRecord',
			canActivate: true
		}, {
			serviceName: 'basicsAssetMasterSidebarWizardService',
			wizardGuid: '28ef5ac6d79a43449fa9f0a5b4d52379',
			methodName: 'disableRecord',
			canActivate: true
		}];
		wizardService.registerWizard(wizardData);


	}]);

})(angular, globals);