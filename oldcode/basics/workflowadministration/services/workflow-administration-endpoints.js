/*globals angular */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowAdministration';

	function initEndpoints(platformModuleNavigationService, basicsWorkflowAdministrationInstanceService) {
		platformModuleNavigationService.registerNavigationEndpoint(
			{
				moduleName: moduleName,
				navFunc: function (entity) {
					basicsWorkflowAdministrationInstanceService.goToAdministrationEndpoint(entity);
				}
			});
	}

	initEndpoints.$inject = ['platformModuleNavigationService', 'basicsWorkflowAdministrationInstanceService'];

	angular.module(moduleName).run(initEndpoints);

})(angular);