/**
 * Created by lnt on 26.08.2021.
 */

(function () {
	'use strict';
	/*global angular */

	let moduleName = 'project.assembly';

// TODO: make ngdoc
	angular.module(moduleName).factory('projectAssemblyStructureUIConfigurationService',
		['estimateAssembliesStructureUIConfigurationServiceFactory',
			function (estimateAssembliesStructureUIConfigurationServiceFactory) {

				return  estimateAssembliesStructureUIConfigurationServiceFactory.createEstAssembliesConfigService(true);
			}
		]);
})();
