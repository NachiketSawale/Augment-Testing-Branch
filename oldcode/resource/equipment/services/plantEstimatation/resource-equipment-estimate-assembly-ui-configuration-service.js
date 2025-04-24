/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentEstimateAssemblyUIConfigurationService
	 * @function
	 *
	 * @description
	 * resourceEquipmentEstimateAssemblyUIConfigurationService is the config service for all project assembly's views.
	 */
	angular.module(moduleName).factory('resourceEquipmentEstimateAssemblyUIConfigurationService', [ 'estimateAssembliesUIConfigurationServiceFactory',

		function (estimateAssembliesUIConfigurationServiceFactory) {
			let isPlant = true,
				isProject = false;

			return estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(isProject, isPlant);
		}
	]);
})(angular);

