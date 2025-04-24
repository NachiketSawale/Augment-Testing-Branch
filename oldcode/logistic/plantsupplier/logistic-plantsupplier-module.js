/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.plantsupplier';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'logisticPlantSupplyWizardService',
				wizardGuid: '0747d604c48447239b8386e899d09d16',
				methodName: 'setPlantSupplyItemStatus',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'logisticPlantSupplierConstantValues', function (platformSchemaService, basicsConfigWizardSidebarService, logisticPlantSupplierConstantValues) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							logisticPlantSupplierConstantValues.schemes.plantSupplier,
							logisticPlantSupplierConstantValues.schemes.plantSupplyItem
						]);
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'logisticPlantSupplierConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticPlantSupplierConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticPlantSupplierNumberInfoService', logisticPlantSupplierConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
