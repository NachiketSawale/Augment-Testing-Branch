/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'controlling.revrecognition';

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
							{typeName: 'PrrHeaderDto', moduleSubModule: 'Controlling.RevRecognition'},
							{typeName: 'PrrItemDto', moduleSubModule: 'Controlling.RevRecognition'},
							{typeName: 'PrrDocumentDto', moduleSubModule: 'Controlling.RevRecognition'},
							{typeName: 'PrrItemE2cDto', moduleSubModule: 'Controlling.RevRecognition'},
							{typeName: 'CompanyTransactionDto', moduleSubModule: 'Basics.Company'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'controllingRevenueRecognitionAccrualTypeCombobox']);
					}],
					'registerWizards': ['_', 'basicsConfigWizardSidebarService', 'platformSidebarWizardDefinitions', function (_, wizardService, platformSidebarWizardDefinitions) {
						var wizardData = _.concat([{
							serviceName: 'controllingRevenueRecognitionWizardService',
							wizardGuid: 'd0461eacb4f74deab59c0273ab979c91',
							methodName: 'createTransactions',
							canActivate: true
						},{
							serviceName: 'controllingRevenueRecognitionWizardService',
							wizardGuid: '983609bbfe524f37b015995ecf0273de',
							methodName: 'changeStatus',
							canActivate: true
						}], platformSidebarWizardDefinitions.model.sets.default);

						wizardService.registerWizard(wizardData);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'controlling.revrecognition',
					navFunc: function (item, triggerField) {
						$injector.get('controllingRevenueRecognitionHeaderDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);

})(angular);
