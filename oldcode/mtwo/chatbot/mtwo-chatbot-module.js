/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'mtwo.chatbot';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'mtwoChatbotSideBarWizardService',
				wizardGuid: 'B13427278C7B46D28A5B76AB4BF0D988',
				methodName: 'exportRecord',
				canActivate: true
			},
			{
				serviceName: 'mtwoChatbotSideBarWizardService',
				wizardGuid: '2BECAA39C286476799ACB10D74A9D0A8',
				methodName: 'importRecord',
				canActivate: true
			},
			{
				serviceName: 'mtwoChatbotSideBarWizardService',
				wizardGuid: 'A1349E90DA93449E853C019613487FBA',
				methodName: 'exportWf2intent',
				canActivate: true
			},
			{
				serviceName: 'mtwoChatbotSideBarWizardService',
				wizardGuid: '9C7A9F0B594045658DF4907300541C79',
				methodName: 'importWf2intent',
				canActivate: true
			}
			];


			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'mtwoChatbotConstantValues', function (platformSchemaService, basicsConfigWizardSidebarService, mtwoChatbotConstantValues) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							mtwoChatbotConstantValues.schemes.configuration,
							mtwoChatbotConstantValues.schemes.wf2intent,
							mtwoChatbotConstantValues.schemes.header
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
