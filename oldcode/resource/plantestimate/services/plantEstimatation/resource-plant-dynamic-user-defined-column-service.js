/**
 * $Id: resource-equipment-dynamic-user-defined-column-service.js 21615 2021-12-08 15:47:48Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantestimate';
	/**
     * @ngdoc service
     * @name resourcePlantEstimateDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * resourcePlantEstimateDynamicUserDefinedColumnService is the config service for plant assembly dynamic user defined column
     */
	angular.module(moduleName).factory('resourcePlantEstimateDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
				configurationExtendService : 'resourcePlantEstimateConfigurationExtendService',
				dataService : 'resourcePlantEstimateLineItemDataService',
				assemblyResourceDynamicUserDefinedColumnService : 'resourcePlantEstimateResourceDynamicUserDefinedColumnService'
			};

			return estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(false, options);
		}
	]);
})(angular);
