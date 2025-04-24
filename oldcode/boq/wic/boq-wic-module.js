(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.wic';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve':
					{
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {
							return platformSchemaService.getSchemas([
								{typeName: 'WicGroupDto', moduleSubModule: 'Boq.Wic'},
								{typeName: 'WicBoqDto', moduleSubModule: 'Boq.Wic'},
								{typeName: 'WicGroup2ClerkDto', moduleSubModule: 'Boq.Wic'},
								{typeName: 'WicBoqCompositeDto', moduleSubModule: 'Boq.Wic'},
								{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
								{typeName: 'OenBoqItemDto', moduleSubModule: 'Boq.Main'},
								{typeName: 'BoqHeaderDto', moduleSubModule: 'Boq.Main'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'businessPartnerMainSupplierLookup']);
						}],
						'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {
							var wizardData = [{
								serviceName: 'boqWicWizardService',
								wizardGuid: '6aa40ec397df4797a5aa16c8d7dba8e7',
								methodName: 'importCrbNpk',
								canActivate: true
							}, {
								serviceName: 'boqWicWizardService',
								wizardGuid: '0872f57b65044719b1834b5ab7cdb4ca',
								methodName: 'importOenOnlb',
								canActivate: true
							}];
							wizardService.registerWizard(wizardData);
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
					navFunc: function () {
						$injector.get('boqWicGroupService');
						naviService.getNavFunctionByModule(moduleName).apply(this, arguments);
					}
				}
			);
		}]);
})();
