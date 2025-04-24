/**
 * Created by lnt on 01.09.2021.
 */

(function () {
	'use strict';

	let moduleName = 'project.assembly';

	/**
	 * @ngdoc service
	 * @name projectAssemblyResourceValidationService
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('projectAssemblyResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'projectAssemblyResourceService', 'projectAssemblyMainService',
			function (estimateAssembliesResourceValidationService, projectAssemblyResourceService, projectAssemblyMainService) {

				let service = {};

				service = estimateAssembliesResourceValidationService.createEstAssemblyResourceValidationService(projectAssemblyResourceService, projectAssemblyMainService, true);

				return service;

			}
		]);

})();
