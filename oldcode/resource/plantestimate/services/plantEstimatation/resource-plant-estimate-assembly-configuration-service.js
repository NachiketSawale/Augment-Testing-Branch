/**
 * $Id: resource-equipment-estimate-assembly-ui-configuration-service.js 21982 2021-12-10 16:29:21Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateAssemblyConfigurationService
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateAssemblyConfigurationService is the config service for all project assembly's views.
	 */
	angular.module(moduleName).factory('resourcePlantEstimateAssemblyConfigurationService', [ 'estimateAssembliesUIConfigurationServiceFactory',

		function (estimateAssembliesUIConfigurationServiceFactory) {
			let isPlant = true, isProject = false;

			return estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(isProject, isPlant);
		}
	]);
})(angular);

