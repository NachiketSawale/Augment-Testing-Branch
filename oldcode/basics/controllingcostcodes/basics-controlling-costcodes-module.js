/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name basics.controllingcostcodes
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				let options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformModuleInitialConfigurationService','platformSchemaService', function(platformModuleInitialConfigurationService,platformSchemaService){

							platformSchemaService.initialize();
							let schemes = [
								{ typeName: 'ContrCostCodeDto', moduleSubModule: 'Basics.ControllingCostCodes'},
								{ typeName: 'Account2MdcContrCostDto', moduleSubModule: 'Basics.ControllingCostCodes'}
							];

							return platformModuleInitialConfigurationService.load('Basics.ControllingCostCodes').then(function (modData) {
								return platformSchemaService.getSchemas(schemes.concat(modData.schemes));
							});
						}],
						'initContext': ['salesCommonContextService',
							function (salesCommonContextService) {
								return salesCommonContextService.init();
							}
						],
					}
				};
				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'basicsConfigWizardSidebarService',
			function ($injector, wizardService) {
				// register wizards
				let CreateWD = wizardService.WizardData;
				let wizardData = [
					new CreateWD('basicsControllingCostCodesSidebarWizardService', '7C97E97A817E4A0CB7DA2C654D138439', 'controllingCostCodesValidation'),
				];
				wizardService.registerWizard(wizardData);

			}]);

})(angular);