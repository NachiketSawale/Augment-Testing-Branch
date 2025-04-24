/**
 * Created by jhe on 11/16/2018.
 */
(function (angular) {
	/* global angular */
	/* global globals */
	'use strict';

	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['$q', 'platformSchemaService', 'basicsCommonCodeDescriptionSettingsService',
						function ($q, platformSchemaService, basicsCommonCodeDescriptionSettingsService) {
							return $q.all([platformSchemaService.getSchemas([
								{typeName: 'AccountingJournalsDto', moduleSubModule: 'Basics.AccountingJournals'},
								{typeName: 'CompanyTransactionDto', moduleSubModule: 'Basics.Company'}
							]),
							basicsCommonCodeDescriptionSettingsService.loadSettings([
								{typeName: 'AccountingJournalsEntity', modul: 'Basics.AccountingJournals'},
								{typeName: 'CompanyTransactionEntity', modul: 'Basics.Company'}
							])
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.group', 'usermanagement.right'], true);
					}],
					registerWizards: ['basicsConfigWizardSidebarService', 'platformSidebarWizardDefinitions', function (wizardService, platformSidebarWizardDefinitions) {
						var wizardData = _.concat([{
							serviceName: 'basicsAccountingJournalsWizardService',
							wizardGuid: 'ee7eab4169ed4ee9b2cd547d3852c649',
							methodName: 'changeStatus',
							canActivate: true
						}], platformSidebarWizardDefinitions.model.sets.default);

						wizardService.registerWizard(wizardData);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'platformTranslateService',
		function ($injector, naviService, platformTranslateService) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('basicsAccountingJournalsMainService').selectTransactionHeader(item, triggerField);
					}
				}
			);

			platformTranslateService.registerModule(moduleName);
		}]);

})(angular);
