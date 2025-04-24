
(function () {
	/*global _ */
	'use strict';
	var moduleName = 'project.assembly';

	/**
	 * @ngdoc service
	 * @name projectAssemblyUIConfigurationService
	 * @function
	 *
	 * @description
	 * projectAssemblyUIConfigurationService is the config service for all project assembly's views.
	 */
	angular.module(moduleName).factory('projectAssemblyUIConfigurationService', [ 'estimateAssembliesUIConfigurationServiceFactory',

		function (estimateAssembliesUIConfigurationServiceFactory) {
			let option = {
				isProject: true
			};

			let service = estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(true);

			return service;
		}
	]);
})(angular);

