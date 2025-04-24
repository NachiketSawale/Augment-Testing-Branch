/**
 * @author: chd
 * @date: 3/16/2021 11:36 AM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';
	let mtwoAIConfigurationModule = angular.module(moduleName);

	mtwoAIConfigurationModule.factory('mtwoAIConfigurationWizardService',
		['$http', '$injector', '$timeout', 'PlatformMessenger', 'platformModalService', 'mtwoAIConfigurationModelListDataService', 'platformSidebarWizardCommonTasksService',

			function ($http, $injector, $timeout, PlatformMessenger, platformModalService, mtwoAIConfigurationModelListDataService, platformSidebarWizardCommonTasksService) {

				let service = {};

				service.uploadAIModel = function () {
					let selected = mtwoAIConfigurationModelListDataService.getSelected();
					if (!selected) {
						platformSidebarWizardCommonTasksService.showErrorNoSelection('mtwo.aiconfiguration.wizard.upload');
					} else {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'mtwo.aiconfiguration/templates/import-ai-model-wizard.html'
						});
					}
				};

				return service;
			}
		]);
})(angular);

