/* global angular, globals*/
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowAdministration';

	function registerModules(platformTranslateService, basicsReportingSidebarService) {
		platformTranslateService.registerModule(moduleName);
		basicsReportingSidebarService.registerModule(moduleName);
	}


	angular.module(moduleName, ['platform', 'cloud.desktop', 'basics.workflow'])
		.config(['mainViewServiceProvider', function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'platformModuleStateService', 'basicsWorkflowInstanceService', function (platformSchemaService, platformModuleStateService, basicsWorkflowInstanceService) {
						platformSchemaService.initialize();
						var state = platformModuleStateService.state(moduleName);
						state.rootService = basicsWorkflowInstanceService;
					}],
					'registerModules': ['platformTranslateService', 'basicsReportingSidebarService', registerModules]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]);
	globals.modules.push(moduleName);
})(angular);