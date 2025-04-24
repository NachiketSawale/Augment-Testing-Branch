/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'basics.costcodes';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name basics.costcodes
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				let options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService){

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{ typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
								// { typeName: 'ContrCostCodeDto', moduleSubModule: 'Basics.CostCodes'},
								{ typeName: 'CostcodePriceVerDto', moduleSubModule: 'Basics.CostCodes'},
								{ typeName: 'CostcodePriceListDto', moduleSubModule: 'Basics.CostCodes'},
								{ typeName: 'CstPriceVer2CompanyDto', moduleSubModule: 'Basics.CostCodes'},
								{typeName: 'CostCodesUsedCompanyDto', moduleSubModule: 'Basics.CostCodes'},
								{typeName: 'CostCode2ResTypeDto', moduleSubModule: 'Basics.CostCodes'},
								{typeName: 'CompanyDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CostCodesReferencesDto', moduleSubModule: 'Basics.CostCodes'}
							]);
						}],
						loadTranslation: ['platformTranslateService',  function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName], true);
						}],
						'registerWizards': ['basicsConfigWizardSidebarService', function(wizardService)
						{
							let wizardData = [
								{
									serviceName: 'basicsCostCodesWizardService',
									wizardGuid: 'e71b906a275446b7b4f47af820840a7f',
									methodName: 'importCostCodes',
									canActivate: true
								},
								{
									serviceName: 'basicsCostCodesWizardService',
									wizardGuid: '9FB79E9F2228472EA1418FC28FE96922',
									methodName: 'enableDisableCostCodes',
									canActivate: true
								}];
							wizardService.registerWizard(wizardData);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService', '$timeout', function ($injector, naviService, $timeout) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$timeout(function () {
							$injector.get('basicsCostCodesMainService').navigateTo(item, triggerField);
						}, 1000);
					}
				}
			);
		}]);

})(angular);