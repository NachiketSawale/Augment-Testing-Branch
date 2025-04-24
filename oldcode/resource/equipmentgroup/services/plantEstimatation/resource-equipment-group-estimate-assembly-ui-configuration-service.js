/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEstimateAssemblyUIConfigurationService
	 * @function
	 *
	 * @description
	 * This is the config service for all plant group assembly's views.
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupEstimateAssemblyUIConfigurationService', [ 'estimateAssembliesUIConfigurationServiceFactory',

		function (estimateAssembliesUIConfigurationServiceFactory) {
			let isPlant = true,
				isProject = false;

			return estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService(isProject, isPlant);
		}
	]);
})(angular);

