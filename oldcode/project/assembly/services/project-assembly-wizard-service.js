/**
 * Created by lnt on 2021-09-06.
 */

(function (angular) {
	'use strict';

	let moduleName = 'project.assembly';

	angular.module(moduleName).factory('projectAssemblyWizardService',
		['estimateAssembliesWizardServiceFactory', 'projectAssemblyMainService', 'projectAssemblyFilterService',
			function (estimateAssembliesWizardServiceFactory, projectAssemblyMainService, projectAssemblyFilterService) {
				let service = {};

				service = estimateAssembliesWizardServiceFactory.createNewEstAssembliesWizardService(projectAssemblyMainService, projectAssemblyFilterService, true);

				return service;
			}]);
})(angular);
