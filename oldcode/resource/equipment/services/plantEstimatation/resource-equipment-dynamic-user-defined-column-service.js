/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipment';
	/**
     * @ngdoc service
     * @name resourceEquipmentDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * resourceEquipmentDynamicUserDefinedColumnService is the config service for plant assembly dynamic user defined column
     */
	angular.module(moduleName).factory('resourceEquipmentDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
				configurationExtendService : 'resourceEquipmentConfigurationExtendService',
				dataService : 'resourceEquipmentPlantEstimationLineItemDataService',
				assemblyResourceDynamicUserDefinedColumnService : 'resourceEquipmentResourceDynamicUserDefinedColumnService'
			};

			return estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(false, options);
		}
	]);
})(angular);
