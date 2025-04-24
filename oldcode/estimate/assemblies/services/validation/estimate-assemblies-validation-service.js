/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('estimateAssembliesValidationService', [
		'estimateAssembliesValidationServiceFactory', 'estimateAssembliesService',
		function (estimateAssembliesValidationServiceFactory, estimateAssembliesService) {


			let service = {};

			service = estimateAssembliesValidationServiceFactory.createEstAssembliesValidationService(estimateAssembliesService);

			return service;
		}

	]);

})();
