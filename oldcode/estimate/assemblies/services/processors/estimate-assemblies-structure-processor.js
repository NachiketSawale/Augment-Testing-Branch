/**
 * Created by benny on 26.10.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesStructureProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesStructureProcessor is the service set assembly categories readonly or editable.
	 */
	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesStructureProcessor', ['$injector', 'estimateAssembliesStructureProcessorFactory',
		function ($injector, estimateAssembliesStructureProcessorFactory) {

			let service = {};

			service = estimateAssembliesStructureProcessorFactory.createNewEstAssembliesStructureProcessorService({
				serviceName: 'estimateAssembliesAssembliesStructureService'
			});

			return service;
		}]);
})(angular);
