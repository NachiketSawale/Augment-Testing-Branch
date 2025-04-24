/**
 * Created by joshi on 18.11.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.currency';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name basics.currency
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				var options = {
					moduleName: moduleName,
					resolve: {
						loadDomains: ['platformSchemaService', function(platformSchemaService){

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{ typeName: 'CurrencyDto', moduleSubModule: 'Basics.Currency'},
								{ typeName: 'CurrencyConversionDto', moduleSubModule: 'Basics.Currency'},
								{ typeName: 'CurrencyRateDto', moduleSubModule: 'Basics.Currency'}
							]);
						}],
						registerWizards: ['basicsConfigWizardSidebarService', function (wizardService) {
							// register wizards
							var CreateWD = wizardService.WizardData;
							var wizardData = [
								new CreateWD('basicsCurrencyWizardService', '1a5b6929b98e417eb87c976212616b11', 'importCurrency')

							];
							wizardService.registerWizard(wizardData);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService',
		// eslint-disable-next-line func-names
			function ($injector, platformModuleNavigationService) {
				platformModuleNavigationService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (/* item, triggerField */) {
						}
					}
				);
			}]);

})(angular);
