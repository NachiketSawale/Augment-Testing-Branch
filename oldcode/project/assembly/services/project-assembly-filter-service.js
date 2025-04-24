/**
 * Created by lnt on 27.10.2021.
 */
/**
 * $Id: estimate-assemblies-filter-service.js 13857 2021-10-13 06:58:32Z wul $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectAssemblyFilterService
	 * @function
	 *
	 * @description
	 * projectAssemblyFilterService for filtering assemblies container by combination of several filters.
	 */
	angular.module('project.assembly').factory('projectAssemblyFilterService', ['estimateAssembliesFilterServiceFactory',
		function (estimateAssembliesFilterServiceFactory) {

			let service = estimateAssembliesFilterServiceFactory.createEstAssembliesFilterService('project','assembly');

			return service;
		}]);
})();
