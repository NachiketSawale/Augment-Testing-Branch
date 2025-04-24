/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipment';
	/**
     * @ngdoc service
     * @name resourceEquipmentResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * resourceEquipmentResourceDynamicUserDefinedColumnService is the config service for resource equipment reource dynamic user defined column
     */
	angular.module(moduleName).factory('resourceEquipmentResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
					resourceDynamicConfigurationService : 'resourceEquipmentResourceDynamicConfigurationService',
					dataService : 'resourceEquipmentPlantEstimationResourceDataService',
					assemblyDynamicUserDefinedColumnService : 'resourceEquipmentDynamicUserDefinedColumnService'
				},
				isPrjAssembly = false;

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);

})(angular);
