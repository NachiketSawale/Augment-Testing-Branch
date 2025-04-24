/**
 * Created by mov on 11/29/2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesProcessor sets readonly to assemblies.
	 */

	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).factory('estimateAssembliesProcessor', ['$injector','estimateAssembliesProcessorFactory',
		function ($injector,estimateAssembliesProcessorFactory) {
			return estimateAssembliesProcessorFactory.createReadOnlyProcessorService ('estimateAssembliesService', 'estimateAssembliesAssembliesStructureService');
		}]);
})(angular);
