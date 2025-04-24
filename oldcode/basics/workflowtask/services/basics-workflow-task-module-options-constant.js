(function () {
	'use strict';

	var moduleName = 'basics.workflowTask';

	angular.module(moduleName).constant('basicsWorkflowTaskModuleOptions', {
		'moduleName': moduleName,
		resolve: {
			loadDomains: ['platformSchemaService', function (platformSchemaService) {
				platformSchemaService.initialize();
			}],
			initState: ['basicsWorkflowMasterDataService', 'platformModuleStateService', 'basicsWorkflowInstanceService',
				function (basicsWorkflowMasterDataService, platformModuleStateService, basicsWorkflowInstanceService) {
					var state = platformModuleStateService.state(moduleName);
					state.rootService = basicsWorkflowInstanceService;
					basicsWorkflowMasterDataService.getPriority(state);
				}],
			loadTranslation: ['platformTranslateService', '$q', function (platformTranslateService, $q) {
				return $q.all(platformTranslateService.registerModule(moduleName), platformTranslateService.registerModule('basics.workflow'));
			}]
		}
	});

})();