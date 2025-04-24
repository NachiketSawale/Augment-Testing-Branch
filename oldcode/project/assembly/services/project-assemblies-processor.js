/* global _ */

(function (angular) {
	'use strict';


	let moduleName = 'project.assembly';
	angular.module(moduleName).factory('projectAssembliesProcessor', ['$injector','estimateAssembliesProcessorFactory',
		function ($injector,estimateAssembliesProcessorFactory) {
			return estimateAssembliesProcessorFactory.createReadOnlyProcessorService ('projectAssemblyMainService', 'projectAssemblyStructureService');
		}]);
})(angular);
