/*globals angular */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	function initEndpoints(platformModuleNavigationService, basicsWorkflowTemplateService) {
		platformModuleNavigationService.registerNavigationEndpoint(
			{
				moduleName: moduleName,
				navFunc: function (entity) {
					basicsWorkflowTemplateService.goToDesignerEndpoint(entity);
				}
			});
	}

	initEndpoints.$inject = ['platformModuleNavigationService', 'basicsWorkflowTemplateService'];

	angular.module(moduleName).run(initEndpoints);

})(angular);