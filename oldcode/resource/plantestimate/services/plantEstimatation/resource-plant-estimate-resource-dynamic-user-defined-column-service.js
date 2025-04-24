/**
 * $Id: resource-equipment-resource-dynamic-user-defined-column-service.js 21982 2021-12-10 16:29:21Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantestimate';
	/**
     * @ngdoc service
     * @name resourcePlantEstimateResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * resourcePlantEstimateResourceDynamicUserDefinedColumnService is the config service for resource equipment reource dynamic user defined column
     */
	angular.module(moduleName).factory('resourcePlantEstimateResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
					resourceDynamicConfigurationService : 'resourcePlantEstimateResourceDynamicConfigurationService',
					dataService : 'resourcePlantEstimateResourceDataService',
					assemblyDynamicUserDefinedColumnService : 'resourcePlantEstimateDynamicUserDefinedColumnService'
				},
				isPrjAssembly = false;

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);

})(angular);
