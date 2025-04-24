/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'controlling.actuals';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	/*
	 * @ngdoc module
     * @name controlling.actuals
     * @description
     * Module definition of the controlling actuals module
	 */
	angular.module(moduleName).config(['_', 'mainViewServiceProvider', 'platformSidebarWizardDefinitions',
		function (_, mainViewServiceProvider, platformSidebarWizardDefinitions) {
			var wizardData = _.concat([{
				serviceName: 'controllingActualsSidebarWizardService',
				wizardGuid: '415fc2f301a6412082c00a9510642237',
				methodName: 'updateControllingCostCodes',
				canActivate: true
			},{
				serviceName: 'controllingActualsSidebarWizardService',
				wizardGuid: 'A9309EC4424E492D84745D89D14C1579',
				methodName: 'excelImport', // Uncomment to check the excel import wizard
				canActivate: true
			},{
				serviceName: 'controllingActualsSidebarWizardService',
				wizardGuid: '0285331bb206416d817d71e5ecbce549',
				methodName: 'updateCostHeaderAmount',
				canActivate: true
			},
			{
				serviceName: 'controllingActualsSidebarWizardService',
				wizardGuid:  '2820512A0985469CBF764D7797018BF7',
				methodName:  'importActualCostFromItwoFinance',
				canActivate: true
			},
			{
				serviceName: 'controllingActualsSidebarWizardService',
				wizardGuid:  '4c9ef74c4709451fb16728d77092c51f',
				methodName:  'generatePreliminaryActuals',
				canActivate: true
			}
			], platformSidebarWizardDefinitions.model.sets.default);

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': [
						'platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								{typeName: 'CompanyCostHeaderDto', moduleSubModule: 'Controlling.Actuals'},
								{typeName: 'CompanyCostDataDto', moduleSubModule: 'Controlling.Actuals'}
							]);
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
						$injector.get('cloudDesktopSidebarService').filterSearchFromPKeys([item[triggerField]]);
					},
					toolTip: 'Go To Controlling Actuals'
				}
			);
		}]);

})(angular);
