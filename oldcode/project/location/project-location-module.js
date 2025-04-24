(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.location';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	angular.module(moduleName).constant('projectLocationContainers', [
		{
			'containerId': 'locationlist', 'template': '/project.location/partials/locationlist.html'
		},
		{
			'containerId': 'locationdetail', 'template': '/project.location/partials/locationdetail.html'
		}
	]);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule(moduleName);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, platformModuleNavigationService) {
			platformModuleNavigationService.registerNavigationEndpoint({
				moduleName: 'project.main-location',
				navFunc: function(item, triggerField){
					$injector.get('projectLocationMainService').navigateToLocation(item, triggerField);
				}
			});
		}]);

})(angular);
