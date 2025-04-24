/* globals angular */
(function (angular) {
	'use strict';

	function initClientActions($injector, basicsWorkflowModuleOptions, basicsWorkflowClientActionService) {
		for (var i = 0; i < basicsWorkflowModuleOptions.clientActions.length; i++) {
			basicsWorkflowClientActionService.addAction($injector.get(basicsWorkflowModuleOptions.clientActions[i]));
		}
	}

	initClientActions.$inject = ['$injector', 'basicsWorkflowModuleOptions', 'basicsWorkflowClientActionService'];

	angular.module('basics.workflow').run(initClientActions);
})(angular);