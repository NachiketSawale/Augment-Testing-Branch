/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
     * @ngdoc service
     * @name projectPlantAssemblyFilterService
     * @function
     *
     * @description
     * projectPlantAssemblyFilterService for filtering plant assemblies container by combination of several filters.
     */
	angular.module('project.plantassembly').factory('projectPlantAssemblyFilterService', ['estimateAssembliesFilterServiceFactory',
		function (estimateAssembliesFilterServiceFactory) {

			let service = estimateAssembliesFilterServiceFactory.createEstAssembliesFilterService('project','plantassembly');

			return service;
		}]);
})();
