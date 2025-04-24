/**
 * Created by janas on 30.04.2015.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesFilterService
	 * @function
	 *
	 * @description
	 * estimateAssembliesFilterService for filtering assemblies container by combination of several filters.
	 */
	angular.module('estimate.assemblies').factory('estimateAssembliesFilterService', ['estimateAssembliesFilterServiceFactory',
		function (estimateAssembliesFilterServiceFactory) {

			let service = estimateAssembliesFilterServiceFactory.createEstAssembliesFilterService('estimate','assemblies');

			return service;
		}]);
})();
