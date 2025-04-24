/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.inventory';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'PrcInventoryHeaderDto', moduleSubModule: 'Procurement.Inventory'},
							{typeName: 'PrcInventoryDto', moduleSubModule: 'Procurement.Inventory'},
							{typeName: 'PrcInventoryDocumentDto', moduleSubModule: 'Procurement.Inventory'}
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		'platformTranslateService', '_', 'platformSidebarWizardDefinitions', 'platformModuleNavigationService',
		function ($injector, layoutService, wizardService, platformTranslateService,
			_, platformSidebarWizardDefinitions, naviService) {

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('procurementInventoryHeaderDataService').doNavigate(item, triggerField);
				}
			});

			var wizardData = _.concat([{
				serviceName: 'inventoryHeaderWizardService',
				wizardGuid: '4f82ac23a7cc4b7b9bee5b7be1474def',
				methodName: 'enableRecord',
				canActivate: true
			}, {
				serviceName: 'inventoryHeaderWizardService',
				wizardGuid: 'eb771473ecc845ae9cc8d7771edd1aba',
				methodName: 'disableRecord',
				canActivate: true
			}, {
				serviceName: 'inventoryHeaderWizardService',
				wizardGuid: '200e9a5b3dc84d2fb93a4b7dc62bbda0',
				methodName: 'generateInventory',
				canActivate: true
			}, {
				serviceName: 'inventoryHeaderWizardService',
				wizardGuid: 'ae919a627ebb405ca7bbab405ded23ca',
				methodName: 'processInventory',
				canActivate: true
			}
			], platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);

			platformTranslateService.registerModule(moduleName);

		}]);

})(angular);
