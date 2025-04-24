/* global angular, globals*/
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowTask';


	angular.module(moduleName, ['platform', 'cloud.desktop', 'basics.workflow'])
		.config(['mainViewServiceProvider','basicsWorkflowTaskModuleOptions', function (mainViewServiceProvider, moduleOptions) {
        	mainViewServiceProvider.registerModule(moduleOptions);
		}]);
	globals.modules.push(moduleName);

})(angular);