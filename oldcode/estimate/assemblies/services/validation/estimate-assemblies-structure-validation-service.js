/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesAssemblyValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('estimateAssembliesAssemblyValidationService', [
		'estimateAssembliesStructureValidationServiceFactory', 'estimateAssembliesAssembliesStructureService', 'estimateAssembliesService',
		function (estimateAssembliesStructureValidationServiceFactory, assemblyStructureService, estimateAssembliesService) {
			let service = {};

			service = estimateAssembliesStructureValidationServiceFactory.createAssemblyStructureValidationService(assemblyStructureService, estimateAssembliesService);

			return service;
		}

	]);

})();
