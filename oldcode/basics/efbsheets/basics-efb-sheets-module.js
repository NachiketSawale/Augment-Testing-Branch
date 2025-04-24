/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/* global globals */

	angular.module(moduleName, ['basics.costcodes']);
	globals.modules.push(moduleName);

	/*
     /**
     * @ngdoc module
     * @name basics.efbsheets
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
								{ typeName: 'EstCrewMixDto', moduleSubModule: 'Basics.EfbSheets'},
								{ typeName: 'EstAverageWageDto', moduleSubModule: 'Basics.EfbSheets'},
								{ typeName: 'EstCrewMixAfDto', moduleSubModule: 'Basics.EfbSheets'},
								{ typeName: 'EstCrewMixAfsnDto', moduleSubModule: 'Basics.EfbSheets'},
								{ typeName: 'EstCrewMix2CostCodeDto', moduleSubModule: 'Basics.EfbSheets'},
								{ typeName: 'CostcodePriceListDto', moduleSubModule: 'Basics.CostCodes'},
							]);
						}],

						'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
							return platformTranslateService.registerModule(['basics.efbsheets', 'basics.customize', 'cloud.common', 'basics.costcodes'], true);
						}]
					}
				};
				mainViewServiceProvider.registerModule(options);
			}
		]).run(['basicsConfigWizardSidebarService', 'platformSidebarWizardDefinitions',
			function (wizardService, platformSidebarWizardDefinitions) {
				let CreateWD = wizardService.WizardData;
				let wizardData = _.concat([
					new CreateWD('basicsEfbSheetsSideBarWizardService', 'D365E2E9609F4075B2C58A585C301747', 'updateWages'),
				], platformSidebarWizardDefinitions.model.sets.default);
				wizardService.registerWizard(wizardData);
			}]);

})(angular);