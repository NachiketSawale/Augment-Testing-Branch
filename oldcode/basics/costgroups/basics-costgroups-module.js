/**
 * Created by joshi on 16.09.2014.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name basics.costcodes
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve':
				{
					'loadDomains': ['platformSchemaService', 'basicsCostGroupsConstantValues', function (platformSchemaService, basicsCostGroupsConstantValues) {
						return platformSchemaService.getSchemas([
							{typeName: 'LicCostGroup1Dto', moduleSubModule: 'Basics.CostGroups'},
							basicsCostGroupsConstantValues.schemes.costGroupCatalog,
							basicsCostGroupsConstantValues.schemes.costGroup

						]);
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', function(wizardService)
					{
						var wizardData = [
							{
								serviceName: 'basicsCostGroupsWizardService',
								wizardGuid: '8ba11b8cc5a34c9ea980774d4c7ffc07',
								methodName: 'importCrbBkp',
								canActivate: true
							}, {
								serviceName: 'basicsCostGroupsWizardService',
								wizardGuid: 'c8ab0141e3694ef7ac3787618bb56ca7',
								methodName: 'importCostGroups',
								canActivate: true
							},
							{
								serviceName: 'basicsCostGroupsWizardService',
								wizardGuid: 'e7afd22f76d44ebdbd2f21bf57043ccf',
								methodName: 'disableRecord',
								canActivate: true
							}, {
								serviceName: 'basicsCostGroupsWizardService',
								wizardGuid: '4ce06366ebdf4eabb3431910854f5b33',
								methodName: 'enableRecord',
								canActivate: true
							}];
						wizardService.registerWizard(wizardData);
					}]

				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, platformModuleNavigationService) {
			var serviceName = 'basicsCostGroupCatalogDataService';
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						//$injector.get(serviceName).navigateToCostGroup(item, triggerField);
					}
				}
			);
		}]);

})(angular);