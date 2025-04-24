/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesResourceValidationService
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('estimateAssembliesResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'estimateAssembliesResourceService', 'estimateAssembliesService',
			function (estimateAssembliesResourceValidationService, estimateAssembliesResourceService, estimateAssembliesService) {

				let service = {};

				service = estimateAssembliesResourceValidationService.createEstAssemblyResourceValidationService(estimateAssembliesResourceService, estimateAssembliesService, false, false, false, true);

				return service;

			}
		]);

})();
