/**
 * Created by mov on 10.12.2021. //
 */

/* global _ */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name projectAssemblyStructureProcessor //
	 * @function
	 *
	 * @description
	 * The projectAssemblyStructureProcessor is the service set assembly categories readonly or editable.
	 */
	let moduleName = 'project.assembly';

	angular.module(moduleName).factory('projectAssemblyStructureProcessor', [
		'estimateAssembliesStructureProcessorFactory',
		function (estimateAssembliesStructureProcessorFactory) {

			let service = {};

            service = estimateAssembliesStructureProcessorFactory.createNewEstAssembliesStructureProcessorService({
                serviceName: 'projectAssemblyStructureService'
            });

			return service;
		}]);
})(angular);
