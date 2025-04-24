/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';
	/**
     * @ngdoc service
     * @name resourceEquipmentGroupResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * This is the config service for resource equipment group resource dynamic user defined column
     */
	angular.module(moduleName).factory('resourceEquipmentGroupResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
					resourceDynamicConfigurationService : 'resourceEquipmentGroupResourceDynamicConfigurationService',
					dataService : 'resourceEquipmentGroupPlantEstimationResourceDataService',
					assemblyDynamicUserDefinedColumnService : 'resourceEquipmentGroupDynamicUserDefinedColumnService'
				},
				isPrjAssembly = false;

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);

})(angular);
